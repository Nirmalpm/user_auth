import db from "../db/connectVYMySQLDB.js";
import mysql2 from "mysql2";

export const addUser = async (req, res) => {
  const { email, name, userId } = req.body;
  const insertQuery = "INSERT INTO user (name, email, userId) VALUES (?, ?, ?)";
  const values = [name, email, userId];

  try {
    db.query(insertQuery, values, (err, results) => {
      if (err) {
        console.error("User profile table insertion failed:", err);
        throw new Error("Error while saving user info to profile DB");
      }
      console.log("Inserted user ID:", results.insertId);
    });
    return res
      .status(200)
      .json({ sucess: true, message: "User profile successfully added" });
  } catch (error) {
    console.error("User profile table insertion failed:", error);
    return res.status(500).json({
      sucess: false,
      message: `Error while saving user profile ${error.message}`,
    });
  }
};

export const isUserPresent = async (req, res) => {
  const { userId } = req.body;
  const selectQuery = `SELECT count(*) AS count FROM user WHERE  userId = ?`;
  const values = [userId];

  try {
    db.query(selectQuery, values, (err, results) => {
      if (err) {
        console.error("Error while fetching User profile", err);
        return res.status(500).json({
          success: false,
          message: "Error while fetching User profile",
        });
      }
      const { count } = results[0];
      return res.status(200).json({
        success: true,
        message: count > 0 ? "User profile present" : "User not found",
        count,
      });
    });
  } catch (error) {
    console.error("Error while checking for user profile:", error);
    res.status(500).json({
      success: false,
      message: `Error while checking for user profile ${error.message}`,
    });
  }
};
