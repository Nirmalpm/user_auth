import db from "../db/connectVYMySQLDB.js";
import mysql2 from "mysql2";

export const addUser = async (req, res) => {
  const { email, name, userId } = req.body;
  const insertQuery = "INSERT INTO user (name, email, userId) VALUES (?, ?, ?)";
  const values = [name, email, userId];

  try {
    const [row] = await db.query(insertQuery, values);
    return res.status(200).json({
      sucess: true,
      message: "User profile successfully added",
      id: row.insertId,
    });
  } catch (error) {
    console.error("User profile table insertion failed:", error);
    return res.status(500).json({
      sucess: false,
      message: `Error while saving user profile ${error.message}`,
    });
  }
};

export const addUserHome = async (req, res) => {
  const { userId, fullName, userDesc, imagePath } = req.body;

  console.log(userId, fullName, userDesc, imagePath);

  // Check if user profile already exists
  const checkQuery = "SELECT * FROM user_home WHERE userId = ?";
  const insertQuery =
    "INSERT INTO user_home (userId, fullName, userDesc, imagePath) VALUES (?, ?, ?, ?)";
  const values = [userId, fullName, userDesc, imagePath];

  try {
    const [checkResults] = await db.query(checkQuery, [userId]);
    if (checkResults.length > 0) {
      return res.status(409).json({
        success: false,
        message: "User Home already exists",
      });
    }
    const [row] = await db.query(insertQuery, values);
    return res.status(200).json({
      success: true,
      message: "User profile successfully added",
      user: {
        userId,
        fullName,
        userDesc,
        imagePath,
        id: row.insertId,
      },
    });
  } catch (error) {
    console.error("Error while adding record to user_home:", error);
    return res.status(500).json({
      success: false,
      message: `Error while saving User Home: ${error.message}`,
    });
  }
};

export const isUserPresent = async (req, res) => {
  const { userId } = req.body;
  const selectQuery = `SELECT id  FROM user WHERE  userId = ?`;
  const values = [userId];

  try {
    const [results] = await db.query(selectQuery, values);
    console.log(results);
    if (results.length > 0) {
      return res.status(200).json({
        success: true,
        message:
          results[0].id !== null && results[0].id !== undefined
            ? "User profile present"
            : "User not found",
        id: results[0].id,
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "User not found",
        id: "",
      });
    }
  } catch (error) {
    console.error("Error while checking for user profile:", error);
    res.status(500).json({
      success: false,
      message: `Error while checking for user profile ${error.message}`,
    });
  }
};

export const isUserProfileHomePresent = async (req, res) => {
  const { userId } = req.body;
  const selectQuery = `SELECT *  FROM user_home WHERE  userId = ?`;
  const values = [userId];

  try {
    const [results] = await db.query(selectQuery, values);
    console.log(results);
    if (results.length > 0) {
      return res.status(200).json({
        success: true,
        message: "User profile home found",
        user: { ...results[0] },
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "User profile home not found",
        user: { userId },
      });
    }
  } catch (error) {
    console.error("Error while checking for user home:", error);
    res.status(500).json({
      success: false,
      message: `Error while checking for user home ${error.message}`,
    });
  }
};

export const loadUserProfile = (req, res) => {
  const { userId } = req.body;
};
