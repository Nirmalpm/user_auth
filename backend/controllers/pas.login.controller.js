import bcrypt from "bcryptjs";
import pool from "../db/connectMariaDB.js";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const { emp_code, password } = req.body;
    //console.log(emp_code, password);
    if (!emp_code || !password) {
      res.status(400).json({
        success: false,
        message: "Employee ID and password are required",
      });
      return;
    }
    const result = await conn.query(
      "select * from Employee where emp_code = ?",
      [emp_code]
    );
    //console.log(result);
    if (result && result.length === 0) {
      res.status(400).json({ success: false, message: "Employee not found!" });
      return;
    }
    let employee = result[0];
    //console.log(employee);
    const isPasswordValid = await bcrypt.compare(password, employee.password);
    if (!isPasswordValid) {
      res.status(400).json({ success: false, message: "Invalid credentials!" });
      return;
    }
    if (result.length > 0) {
      delete result[0].password;
    }
    if (employee.emp_code.startsWith("DOC")) {
      const result = await conn.query(
        "select * from Doctor where emp_code = ?",
        [employee.emp_code]
      );
      employee = { ...employee, doctor: result[0] };
    }
    console.log(employee);
    generateTokenAndSetCookie(employee, res);
    res.status(200).json({ success: true, employee, isAuthenticated: true });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, employee: null, isAuthenticated: false });
  } finally {
    if (conn) {
      await conn.release();
    }
  }
};

const generateTokenAndSetCookie = (employee, res) => {
  try {
    const token = jwt.sign(
      { userId: employee.id, email: employee.email, roles: employee.roles },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
    res.cookie("pas_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", //only works in https
      samesite: "strict", //prevents csrf attacks
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    //console.log(token);
    return token;
  } catch (error) {
    throw error;
  }
};

export const logout = async (req, res) => {
  res.clearCookie("pas_token");
  return res.status(200).json({
    success: true,
    message: "Logged out successfully!",
  });
};

export const checkAuth = async (req, res) => {
  ////console.log("checkAuth", req.user);
  const { userId } = req.employee;
  // console.log(req.employee);
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(
      "select id,emp_code,emp_type,verified,active from Employee where id =?",
      [userId]
    );
    let employee = result[0];
    
    if (!result[0]) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    if (employee.emp_code.startsWith("DOC")) {
      const result = await conn.query(
        "select * from Doctor where emp_code = ?",
        [employee.emp_code]
      );
      employee = { ...employee, doctor: result[0] };
    }
    return res
      .status(200)
      .json({ success: true, employee: employee, isAuthenticated: true });
  } catch (error) {
    //console.log("Error in checkAuth");
    return res
      .status(400)
      .json({ success: false, message: error.message, isAuthenticated: false });
  } finally {
    if (conn) {
      await conn.release();
    }
  }
};
