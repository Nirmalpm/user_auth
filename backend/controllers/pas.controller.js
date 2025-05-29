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
    await conn.beginTransaction();
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
    await conn.query(
      "insert into PatientBill (patient_id,payment_status,item_type,total_amount) values(?,?,?,?)",
      [result.insertId, "PAID", "REG", reg_amount]
    );
    //console.log(result);
    conn.commit();
    res.status(200).json({ success: true, id: Number(result.insertId) });
  } catch (error) {
    await conn.rollback();
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
      `SELECT p.*,w.ward_id,(select ward_name from WardMaster where id = w.ward_id) ward_name,w.doctor_id doctor_id,
      (select name from Doctor where id = w.doctor_id) doctor_name,w.bed_number,w.admission_date from Patient p 
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
    await conn.beginTransaction();
    const result = await conn.query(
      `INSERT INTO InPatientWard ( patient_id, admission_date, bed_number, ward_id, doctor_id, status )
         VALUES (?, ?, ?, ?, ?, ?)`,
      [patient_id, admission_date, bed_number, ward_id, doctor_id, "OCCUPIED"]
    );
    await conn.query("update Patient set ip='Y' where id = ?", [patient_id]);
    res.status(200).json({ success: true, id: Number(result.insertId) });
    await conn.commit();
  } catch (err) {
    if (conn) {
      await conn.rollback();
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
    await conn.beginTransaction();
    const result = await conn.query(
      "UPDATE InPatientWard SET status='VACATED' where id=?",
      [wardId]
    );

    await conn.query("UPDATE Patient SET ip=NULL where id=?", [patient_id]);

    res.status(200).json({
      success: true,
      message: `Patient vacated the Ward bed successfully`,
    });
    await conn.commit();
  } catch (error) {
    if (conn) {
      await conn.rollback();
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
  const { patient_id, visit_date_time, doctor_id } = req.body;
  console.log(patient_id, visit_date_time, doctor_id);
  if (!patient_id || !visit_date_time || !doctor_id) {
    throw new Error("Required fields missing");
  }

  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();

    const doctor = await conn.query(
      "select consult_fee from Doctor where id = ?",
      [doctor_id]
    );
    const amount = doctor[0].consult_fee;
    const bill = await conn.query(
      "insert into PatientBill (patient_id,total_amount,item_type) values (?, ?, ?)",
      [patient_id, amount, "OP"]
    );
    const result = await conn.query(
      `INSERT INTO OPConsultation ( patient_id,visit_date_time, doctor_id,amount,bill_id )
         VALUES (?, ?, ?, ?,?)`,
      [patient_id, visit_date_time, doctor_id, amount, bill.insertId]
    );
    await conn.commit();
    res.status(200).json({ success: true, id: Number(result.insertId) });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).send("Error fetching Patients");
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

export const addPatientConsumables = async (req, res) => {
  const { patient_id, items } = req.body; // items: array of { item_id, quantity, price }
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();
    const totalAmount = items.reduce(
      (acc, item) => acc + Number(item.price * item.quantity),
      0
    );
    //Insert to PatientBill
    const bill = await conn.query(
      "INSERT INTO PatientBill (patient_id, total_amount, item_type) VALUES (?, ?, ?)",
      [patient_id, totalAmount, "CNS"]
    );
    for (const item of items) {
      const { item_id, quantity, price } = item;

      const result = await conn.query(
        "select stock_quantity from Pharmacy where id=?",
        [item_id]
      );
      let qty = quantity;
      if (result[0].stock_quantity < quantity) {
        qty = result[0].stock_quantity;
      }

      // Insert into PatientConsumable
      await conn.query(
        "INSERT INTO PatientConsumable (patient_id, item_id, quantity, price, bill_id) VALUES (?, ?, ?, ?, ?)",
        [patient_id, item_id, qty, price, bill.insertId]
      );

      // Update stock_quantity based on quantity used
      await conn.query(
        `UPDATE Pharmacy SET stock_quantity = stock_quantity - ? 
         WHERE id = ? AND stock_quantity >= ?`,
        [qty, item_id, qty]
      );
    }

    await conn.commit();
    getPatientConsumables(req, res);
  } catch (error) {
    if (conn) await conn.rollback();
    res.status(500).json({ success: false, message: "Item addition failed" });
    throw error;
  } finally {
    if (conn) await conn.release();
  }
};

export const getPatientConsumables = async (req, res) => {
  const { patient_id, buy_date } = req.query;
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(
      `select *, (select name from Pharmacy where id = item_id) item_name from PatientConsumable 
      where patient_id = ? and buy_date = ? order by buy_date desc`,
      [patient_id, buy_date]
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ success: false, message: "Item retreival failed" });
    throw error;
  } finally {
    if (conn) {
      await conn.release();
    }
  }
};

export const getPatientConsumablesHistory = async (req, res) => {
  const { patient_id } = req.query;
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(
      `select	pt.*,(select name from Pharmacy where id = pt.item_id) item_name from	PatientConsumable pt inner 
      join InPatientWard pw on	pw.patient_id = pt.patient_id where	pt.patient_id = ? 
      and pt.buy_date >= pw.admission_date 	and pw.status = 'OCCUPIED' order by pt.buy_date desc`,
      [patient_id]
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ success: false, message: "Item retreival failed" });
    throw error;
  } finally {
    if (conn) {
      await conn.release();
    }
  }
};

export const setItemPaidStatus = async (req, res) => {
  const { id } = req.body;
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();
    const result = await conn.query(
      "update PatientConsumable set status = 'PAID' where id = ?",
      [id]
    );

    const rows = await conn.query(
      `select count(*) cnt, ( select bill_id from PatientConsumable where id = ?) bill_id from PatientConsumable 
      where bill_id  in ( select bill_id from PatientConsumable where id = ?) and status != 'PAID'`,
      [id, id]
    );
    let status = "PAID";
    if (rows[0].cnt > 0) {
      status = "PARTIAL";
    }
    const bill = await conn.query(
      "update PatientBill set payment_status = ? where id = ?",
      [status, rows[0].bill_id]
    );
    await conn.commit();
    res.status(200).json({ success: true, message: "Item status set to PAID" });
  } catch (error) {
    await conn.rollback();
    res
      .status(500)
      .json({ success: false, message: "setPaidStatus: Item updation failed" });
    throw error;
  } finally {
    if (conn) {
      await conn.release();
    }
  }
};

export const setFullPaidStatus = async (req, res) => {
  const { patient_id, buy_date } = req.body;
  let conn;
  try {
    conn = await pool.getConnection();
    conn.beginTransaction();
    const result = await conn.query(
      "update PatientConsumable set status = 'PAID' where patient_id = ? and buy_date = ?",
      [patient_id, buy_date]
    );

    const rows = await conn.query(
      `select bill_id from PatientConsumable where patient_id = ? and buy_date = ?`,
      [patient_id, buy_date]
    );
    rows.forEach(async (row) => {
      await conn.query(
        "update PatientBill set payment_status = ? where id = ?",
        ["PAID", row.bill_id]
      );
    });
    await conn.commit();
    res.status(200).json({ success: true, message: "Item status set to PAID" });
  } catch (error) {
    await conn.rollback();
    res
      .status(500)
      .json({ success: false, message: "setPaidStatus: Item updation failed" });
    throw error;
  } finally {
    if (conn) {
      await conn.release();
    }
  }
};

//TESTS
export const addPatientTest = async (req, res) => {
  const { patient_id, tests } = req.body; // items: array of { item_id, quantity, price }
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();
    const totalAmount = tests.reduce(
      (acc, test) => acc + Number(test.amount),
      0
    );
    //Insert to PatientBill
    const bill = await conn.query(
      "INSERT INTO PatientBill (patient_id, total_amount, item_type) VALUES (?, ?, ?)",
      [patient_id, totalAmount, "TST"]
    );

    for (const item of tests) {
      const { test_id, result, amount } = item;

      // Insert into PatientConsumable
      await conn.query(
        "INSERT INTO PatientTest (patient_id, test_id, result, amount,bill_id) VALUES (?, ?, ?, ?, ?)",
        [patient_id, test_id, result, amount, bill.insertId]
      );
    }
    await conn.commit();
    getPatientTests(req, res);
  } catch (error) {
    await conn.rollback();
    res.status(500).json({ success: false, message: "Test addition failed" });
    throw error;
  } finally {
    if (conn) await conn.release();
  }
};

export const getPatientTests = async (req, res) => {
  const { patient_id, test_date } = req.query;
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(
      `select *, (select test_name from TestMaster where id = test_id) test_name from PatientTest
      where patient_id = ? and test_date = ? order by test_date desc`,
      [patient_id, test_date]
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ success: false, message: "Test retreival failed" });
    throw error;
  } finally {
    if (conn) {
      await conn.release();
    }
  }
};

export const getPatientTestHistory = async (req, res) => {
  const { patient_id } = req.query;
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(
      `select pt.*,(select test_name from TestMaster where id = pt.test_id) test_name  from PatientTest pt inner join InPatientWard pw on pw.patient_id = pt.patient_id 
      where pt.patient_id = ? and pt.test_date >= pw.admission_date and pw.status='OCCUPIED' order by pt.test_date desc`,
      [patient_id]
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ success: false, message: "Test retreival failed" });
    throw error;
  } finally {
    if (conn) {
      await conn.release();
    }
  }
};

export const setTestPaidStatus = async (req, res) => {
  const { id } = req.body;
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();
    const result = await conn.query(
      "update PatientTest set status = 'PAID' where id = ?",
      [id]
    );

    const rows = await conn.query(
      `select count(*) cnt, ( select bill_id from PatientTest where id = ?) bill_id from PatientTest 
      where bill_id  in ( select bill_id from PatientTest where id = ?) and status != 'PAID'`,
      [id, id]
    );
    let status = "PAID";
    if (rows[0].cnt > 0) {
      status = "PARTIAL";
    }
    const bill = await conn.query(
      "update PatientBill set payment_status = ? where id = ?",
      [status, rows[0].bill_id]
    );
    await conn.commit();

    res.status(200).json({ success: true, message: "Test status set to PAID" });
  } catch (error) {
    await conn.rollback();
    res.status(500).json({
      success: false,
      message: "setTestPaidStatus: Test updation failed",
    });
    throw error;
  } finally {
    if (conn) {
      await conn.release();
    }
  }
};

export const setFullTestPaidStatus = async (req, res) => {
  const { patient_id, test_date } = req.body;
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();
    const result = await conn.query(
      "update PatientTest set status = 'PAID' where patient_id = ?",
      [patient_id]
    );
    const rows = await conn.query(
      `select bill_id from PatientTest where patient_id = ? and test_date = ?`,
      [patient_id, test_date]
    );
    rows.forEach(async (row) => {
      await conn.query(
        "update PatientBill set payment_status = ? where id = ?",
        ["PAID", row.bill_id]
      );
    });
    await conn.commit();
    res.status(200).json({ success: true, message: "Test status set to PAID" });
  } catch (error) {
    await conn.rollback();
    res.status(500).json({
      success: false,
      message: "setFullTestPaidStatus: Test updation failed",
    });
    throw error;
  } finally {
    if (conn) {
      await conn.release();
    }
  }
};

export const getMiscBillItemTypes = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(
      "select * from BillItemType where type_group = ?",
      ["MISC"]
    );
    res.status(200).json(rows);
  } catch (error) {
    throw error;
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

export const getBillings = async (req, res) => {
  const { patient_id } = req.query;
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(
      "select * from PatientBill where patient_id = ?",
      [patient_id]
    );
    res.status(200).json(rows);
  } catch (error) {
    throw error;
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

export const getItemsByBill = async (req, res) => {
  const { patient_id, bill_id } = req.query;
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(
      "select * from PatientBill where patient_id = ?  order by id",
      [patient_id, bill_id]
    );
    const retRows = [...rows];
    for (const row of retRows) {
      if (row.item_type === "CNS") {
        const cns = await conn.query(
          "select *,(select name from Pharmacy where id = item_id) item_name from PatientConsumable where patient_id = ? and bill_id = ?",
          [patient_id, row.id]
        );
        row.consumables = cns;
      } else if (row.item_type === "TST") {
        const tests = await conn.query(
          "select *,(select test_name from TestMaster where id = test_id) test_name from PatientTest where patient_id = ? and bill_id = ?",
          [patient_id, row.id]
        );
        row.tests = tests;
      } else if (row.item_type === "OP") {
        const op = await conn.query(
          "select * from OPConsultation where patient_id = ? and bill_id = ?",
          [patient_id, row.id]
        );
        row.op = op;
      } else if (row.item_type === "FD") {
        const foods = await conn.query(
          "select * from PatientFoodOrder where patient_id = ? and bill_id = ?",
          [patient_id, row.id]
        );
        row.food_order = foods;
      } else if (row.item_type === "MISC") {
        const misc = await conn.query(
          "select *,(select name from BillItemType where code = bill_type_code) name from PatientMisc where patient_id = ? and bill_id = ?",
          [patient_id, row.id]
        );
        row.misc = misc;
      }
    }
    res.status(200).json(retRows);
  } catch (error) {
    throw error;
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

export const addMiscItems = async (req, res) => {
  console.log("addMiscItems");
  const { patient_id, ward_id, doctor_id, items } = req.body; // items: array of { item_id, quantity, price }
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();

    //Insert to PatientBill
    const bill = await conn.query(
      "INSERT INTO PatientBill (patient_id, item_type) VALUES (?, ?)",
      [patient_id, "MISC"]
    );

    const ward = await conn.query(
      "select daily_nursing_charge from WardMaster where id = ?",
      [ward_id]
    );

    const doctor = await conn.query(
      "select ip_visit_fee from Doctor where id = ?",
      [doctor_id]
    );

    let tot_amount = 0.0;
    for (const item of items) {
      let amount = 0;
      const { bill_type_code } = item;
      if (bill_type_code === "NRSNG") {
        amount = ward[0].daily_nursing_charge;
      } else if (bill_type_code === "DRVST") {
        amount = doctor[0].ip_visit_fee;
      }
      // Insert into PatientConsumable
      await conn.query(
        "INSERT INTO PatientMisc (patient_id, bill_type_code, amount, bill_id) VALUES (?, ?, ?, ?)",
        [patient_id, bill_type_code, amount, bill.insertId]
      );
      tot_amount += Number(amount);
      console.log("Total Amount:", tot_amount);
    }

    //Udate  PatientBill
    await conn.query("UPDATE PatientBill set total_amount = ? where id = ? ", [
      tot_amount,
      bill.insertId,
    ]);

    await conn.commit();
    getMiscItems(req, res);
  } catch (error) {
    if (conn) await conn.rollback();
    res.status(500).json({ success: false, message: "Item addition failed" });
    throw error;
  } finally {
    if (conn) await conn.release();
  }
};

export const getMiscItems = async (req, res) => {
  const { patient_id, item_date } = req.query;
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(
      `select *, (select name from BillItemType where code = bill_type_code) item_name from PatientMisc 
      where patient_id = ? and item_date = ? order by item_date desc`,
      [patient_id, item_date]
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ success: false, message: "Item retreival failed" });
    throw error;
  } finally {
    if (conn) {
      await conn.release();
    }
  }
};

export const getMiscItemsHistory = async (req, res) => {
  const { patient_id } = req.query;
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(
      `select	pt.*,(select name from BillItemType where code = pt.bill_type_code) item_name from	PatientMisc pt inner 
      join InPatientWard pw on	pw.patient_id = pt.patient_id where	pt.patient_id = ? 
      and pt.item_date >= pw.admission_date 	and pw.status = 'OCCUPIED' order by pt.item_date desc`,
      [patient_id]
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ success: false, message: "Item retreival failed" });
    throw error;
  } finally {
    if (conn) {
      await conn.release();
    }
  }
};
