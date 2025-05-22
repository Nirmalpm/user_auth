import axios from "axios";
import bcrypt from "bcryptjs";
import pool from "../db/connectMariaDB.js";
import { sendEmployeeAddedMail } from "../mailtrap/emails.js";

const API_KEY = "2b754650c5aa43b2bca1ddb3608323e2"; //https://newsapi.org/register/success
const API_URL =
  "https://newsapi.org/v2/top-headlines?country=us&apiKey=2b754650c5aa43b2bca1ddb3608323e2&category=health";
const EmpType = {
  SPR: 1,
  DOC: 2,
  REC: 3,
  ATD: 4,
  SEC: 5,
  PHA: 6,
  NUR: 7,
  HNR: 8,
  HKP: 9,
  STF: 10,
  LAB: 11,
  DIT: 12,
  CLN: 13,
  MGR: 14,
  ADM: 15,
};

const EMP_DEFLT_PWD = "123_XXX_X";

export const getHealthNews = async (req, res) => {
  let { page = 1, pageSize = 10 } = req.query;
  try {
    const response = await axios.get(
      `${API_URL}&page=${page}&pageSize=${pageSize}`
    );
    //console.log(response.data);
    res.status(200).json({ data: response.data });
  } catch (error) {
    throw error;
  }
};

export const addDept = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).send("Name is required");

  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(
      "INSERT INTO Department (name) VALUES (?)",
      [name]
    );
    //res.status(201).json({ id: Number(result.insertId), name });
    getDepts(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding department");
  } finally {
    if (conn) conn.release();
  }
};

export const getDepts = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows =
      await conn.query(`SELECT d.id,d.name,COUNT(doc.dept)  doctor_count FROM   Department d
                                    LEFT JOIN Doctor doc ON doc.dept = d.id GROUP BY  d.id, d.name ORDER BY d.name`);
    // Convert BigInt to Number
    const result = rows.map((row) => ({
      ...row,
      doctor_count: Number(row.doctor_count),
    }));
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching departments");
  } finally {
    if (conn) conn.release();
  }
};

export const addEmployee = async (req, res) => {
  const { empType, name, email } = req.body;
  let conn;
  try {
    conn = await pool.getConnection();
    // Start transaction
    await conn.beginTransaction();
    // 1. Get max sequence number (max Doctor.id for the department)
    const rows = await conn.query(
      "SELECT IFNULL(MAX(id), 0) maxId FROM Employee WHERE emp_type = ?",
      [empType]
    );
    if (rows.length === 0) {
      // Should never happen but safeguard
      throw new Error("Failed to fetch max doctor id.");
    }
    const maxId = rows[0].maxId;
    const newSeq = maxId + 1;

    // 2. Create emp_code
    const empCode = getEmpCode(req, empType, newSeq);

    // 4. Hash password (recommended)
    const hashedPassword = await bcrypt.hash(EMP_DEFLT_PWD, 10);

    await conn.query(
      "INSERT INTO Employee (emp_code, emp_type, verified, active, password) VALUES (?, ?, ?, ?, ?)",
      [empCode, empType, "N", "N", hashedPassword]
    );

    await insertEmployee(req, res, empType, empCode, conn);

    // Commit transaction
    await conn.commit();
    //res.status(201).json({ id: Number(result.insertId), name });
    await sendEmployeeAddedMail(email, name, empCode, EMP_DEFLT_PWD);
    res
      .status(200)
      .json({ success: true, message: "Employee added successfully!" });
  } catch (error) {
    // Rollback if any error happens
    await conn.rollback();
    console.error("Transaction error:", error);
    res.status(500).json({
      success: false,
      message: "Transaction failed, rolled back." + error.message,
    });
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

const getEmpCode = (req, empType, newSeq) => {
  const { dept } = req.body;
  if (empType === EmpType.DOC) {
    return `DOC_${dept}_${newSeq}`;
  }

  return null;
};

const insertEmployee = async (req, res, empType, empCode, conn) => {
  if (empType === EmpType.DOC) {
    const { name, degree, dept, specialization, contact, email, photo_path } =
      req.body;
    if (!name) {
      throw new Error("Name is required");
    }
    // 5. Insert into Doctor
    await conn.query(
      `INSERT INTO Doctor (name, specialization, contact_number, email,  photo_path, dept, degree, emp_code)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, specialization, contact, email, photo_path, dept, degree, empCode]
    );
  }
};

export const getDoctors = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(
      "SELECT d.id, d.emp_code, d.name,d.degree,dep.name as dept,d.specialization,d.contact_number,d.photo_path,d.email FROM Doctor d, Department dep where dep.id = d.dept order by updated_at desc"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching Doctors");
  } finally {
    if (conn) conn.release();
  }
};
