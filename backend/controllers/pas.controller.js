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
      `SELECT d.id, d.emp_code, d.name,d.degree,dep.name as dept,d.specialization,d.contact_number,d.photo_path,d.email,d.consult_fee FROM Doctor d,
       Department dep where dep.id = d.dept order by updated_at desc`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching Doctors");
  } finally {
    if (conn) conn.release();
  }
};

export const registerPatient = async (req, res) => {
  const {
    name,
    age,
    date_of_birth,
    gender,
    address,
    medical_history,
    blood_group,
    contact_number,
    email,
    reg_amount,
    reg_date,
  } = req.body;
  let conn;
  const year = new Date().getFullYear();
  const month = new Date().getMonth();
  const day = new Date().getDay();
  const phoneStr = contact_number.toString();
  let patient_code = `${year}${month}${day}${age}${gender}${phoneStr.slice(
    -4
  )}`;

  try {
    conn = await pool.getConnection();
    const existing = `select count(*) cnt FROM Patient where lower(patient_code) LIKE ?`;

    const exResult = await conn.query(existing, [
      `${patient_code.toLowerCase()}%`,
    ]);
    console.log(Number(exResult[0].cnt));
    if (exResult && Number(exResult[0].cnt) > 0) {
      patient_code = `${patient_code}_${Number(exResult[0].cnt) + 1}`;
    }
    const query = `insert into Patient(name,age,date_of_birth,gender,address,medical_history,patient_code,blood_group,contact_number,email,reg_amount,reg_date) 
    values(?,?,?,?,?,?,?,?,?,?,?,?)`;
    const result = await conn.query(query, [
      name,
      age,
      date_of_birth,
      gender,
      address,
      medical_history,
      patient_code,
      blood_group,
      contact_number,
      email,
      reg_amount,
      reg_date,
    ]);
    console.log(result);
    res.status(200).json({ success: true, id: Number(result.insertId) });
  } catch (error) {
    throw error;
  } finally {
    if (conn) {
      await conn.release();
    }
  }
};

export const getVacantBedNumbers = async (req, res) => {
  const { wardId } = req.query;
  let conn;
  try {
    const query = `WITH RECURSIVE bed_numbers AS (
                  SELECT 1 AS bed_no
                  UNION ALL
                  SELECT bed_no + 1 FROM bed_numbers
                  WHERE bed_no < (SELECT total_beds FROM WardMaster WHERE id = ?)
                )
                SELECT 
                  (SELECT ward_name FROM WardMaster WHERE id = ?) AS ward_name, 
                  bed_no 
                FROM bed_numbers
                WHERE bed_no NOT IN (select bed_number from InPatientWard where ward_id = ? and status != 'VACATED');`;
    conn = await pool.getConnection();
    const rows = await conn.query(query, [wardId, wardId, wardId]);
    res.status(200).json(rows);
  } catch (error) {
    throw error;
  } finally {
    if (conn) {
      await conn.release();
    }
  }
};

export const getPatients = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(
      `SELECT p.*,w.ward_id,(select ward_name from WardMaster where id = w.ward_id) ward_name,w.bed_number from Patient p 
      left outer join InPatientWard w on w.patient_id= p.id and w.status != 'VACATED' order by updated_at desc`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching Patients");
  } finally {
    if (conn) conn.release();
  }
};

export const admitPatient = async (req, res) => {
  const { patient_id, admission_date, bed_number, ward_id, doctor_id } =
    req.body;
  if (!patient_id || !admission_date || !bed_number || !ward_id || !doctor_id) {
    throw new Error("Required fields missing");
  }

  let conn;
  try {
    conn = await pool.getConnection();
    conn.beginTransaction();
    const result = await conn.query(
      `INSERT INTO InPatientWard ( patient_id, admission_date, bed_number, ward_id, doctor_id, status )
         VALUES (?, ?, ?, ?, ?, ?)`,
      [patient_id, admission_date, bed_number, ward_id, doctor_id, "OCCUPIED"]
    );
    await conn.query("update Patient set ip='Y' where id = ?", [patient_id]);
    res.status(200).json({ success: true, id: Number(result.insertId) });
    conn.commit();
  } catch (err) {
    if (conn) {
      conn.rollback();
    }
    console.error(err);
    res.status(500).send("Error fetching Patients");
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

export const vacatePatientWard = async (req, res) => {
  const { wardId, patient_id } = req.body;
  console.log(wardId, patient_id);
  let conn;
  try {
    conn = await pool.getConnection();
    conn.beginTransaction();
    const result = await conn.query(
      "UPDATE InPatientWard SET status='VACATED' where id=?",
      [wardId]
    );

    await conn.query("UPDATE Patient SET ip=NULL where id=?", [patient_id]);

    res.status(200).json({
      success: true,
      message: `Patient vacated the Ward bed successfully`,
    });
    conn.commit();
  } catch (error) {
    if (conn) {
      conn.rollback();
    }
    throw error;
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

export const getPatientsByWard = async (req, res) => {
  const { wardId } = req.query;
  let conn;
  const query = `SELECT 
  w.ward_name ward_name,
  w.total_beds total_beds,
  p.id  patient_id, p.name  patient_name,
  p.email  patient_email, p.address  patient_address,p.blood_group  patient_blood_group,p.medical_history  patient_medical_history,
  ipw.admission_date admission_date,ipw.bed_number bed_number,ipw.status status,ipw.id patient_ward_id, d.name doctor_name,d.id doctor_id,
  (w.total_beds - (
      SELECT COUNT(*) 
      FROM InPatientWard ipw2 
      WHERE ipw2.ward_id = w.id and (ipw2.status  is null or ipw2.status = 'OCCUPIED')
  ))  beds_left
FROM WardMaster w
LEFT JOIN InPatientWard ipw ON w.id = ipw.ward_id  and ipw.status != 'VACATED'
LEFT JOIN Doctor d ON d.id = ipw.doctor_id
LEFT JOIN Patient p ON p.id = ipw.patient_id where w.id = ?`;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(query, [wardId]);
    // Convert BigInt to Number
    const result = rows.map((row) => ({
      ...row,
      beds_left: Number(row.beds_left),
    }));
    //console.log(result);
    res.status(200).json(result);
  } catch (error) {
    throw error;
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

export const addOpConsultation = async (req, res) => {
  const {
    op_id,
    visit_date_time,
    doctor_id,
    diagnosis,
    remarks,
    prescription,
    amount,
  } = req.body;
  console.log(op_id,
    visit_date_time,
    doctor_id,
    diagnosis,
    remarks,
    prescription,
    amount,)
  if (!op_id || !visit_date_time || !doctor_id || !diagnosis || !amount) {
    throw new Error("Required fields missing");
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(
      `INSERT INTO OPConsultation ( op_id,visit_date_time, doctor_id,diagnosis,remarks,prescription,amount )
         VALUES (?, ?, ?, ?, ?, ?,?)`,
      [
        op_id,
        visit_date_time,
        doctor_id,
        diagnosis,
        remarks,
        prescription,
        amount,
      ]
    );

    res.status(200).json({ success: true, id: Number(result.insertId) });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching Patients");
  } finally {
    if (conn) {
      conn.release();
    }
  }
};
