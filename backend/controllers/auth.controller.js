import bcrypt from "bcryptjs";
import crypto from "crypto";

import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../mailtrap/emails.js";

import { User } from "../models/user.model.js";
import db from "../db/connectVYMySQLDB.js";
import { set } from "mongoose";

export const signup = async (req, res) => {
  const { email, password, name, phoneNumber } = req.body;
  console.log(email, password, name, phoneNumber);
  try {
    if (!email || !password || !name) {
      throw new Error("All fields are required");
    }
    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      // throw new Error("User already exist");
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const user = new User({
      email,
      password: hashPassword,
      name,
      phoneNumber,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, /// 24 hours
    });

    await user.save();

    //jwt
    generateTokenAndSetCookie(res, user._id);

    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or Expired verification code",
      });
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;

    await user.save();

    //await addUser({ email: user.email, name: user.name, userId: user.id });

    await sendWelcomeEmail(user.email, user.name);

    return res.status(200).json({
      success: true,
      message: "Eamil verified successfully ",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("Error in verifyEmail", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ success: false, message: "Invalid credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    generateTokenAndSetCookie(res, user);

    user.lastLogin = new Date();
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Logged in successfully ",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("Error in login", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ success: false, message: "Email not registered" });
    }

    //Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 60 * 60 * 1000; //1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    //send email
    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/password-reset/${resetToken}`
    );

    res.status(201).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.log("Error in forgotPassword", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const passwordReset = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    user.password = hashPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;

    await user.save();
    sendResetSuccessEmail(user.email);

    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.log("Error in passwordReset", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({
    success: true,
    message: "Logged out successfully!",
  });
};

export const checkAuth = async (req, res) => {
  //console.log("checkAuth", req.user);
  const { userId } = req.user;
  try {
    const user = await User.findById(userId).select("-password"); // This will select the user record without password
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in checkAuth");
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const searchUsers = async (req, res) => {
  const { query } = req.query;
  let users = [];
  try {
    if (query) {
      const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Optional: escape regex chars
      const regex = new RegExp(safeQuery, "i"); // 'i' for case-insensitive
      users = await User.find({ name: { $regex: regex } });
    } else {
      users = await User.find();
    }
    return res.status(200).json({
      success: true,
      message: "Users returned ",
      users,
    });
  } catch (error) {
    console.log("Error in searchUsers");
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const createUser = async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;
  console.log(name, email, password, phoneNumber);
  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      phoneNumber,
      isVerified: true,
      lastLogin: new Date(),
      roles: ["user"], // Add roles here (e.g., 'admin', 'user')
    });

    // Save the new user
    await newUser
      .save()
      .then((user) => {
        console.log("User added successfully:", user);
      })
      .catch((err) => {
        console.error("Error adding user:", err);
      });
    return res.status(200).json({
      success: true,
      message: "New user added successfully ",
    });
  } catch (error) {
    throw error;
  }
};

export const usersByRole = async (req, res) => {
  const { role } = req.query;
  let users = [];
  try {
    if (role) {
      users = await User.find({ roles: role });
    } else {
      users = await User.find();
    }

    res.status(200).json({ success: true, users });
  } catch (error) {
    throw error;
  }
};

export const updateRole = async (req, res) => {
  const { userId, role } = req.body;
  console.log(userId, role);
  try {
    await User.updateOne(
      { _id: userId },
      {
        $addToSet: { roles: role },
      }
    );
    res.status(200).json({
      success: true,
      message: `New role, ${role}, added to the user with id, ${userId}`,
    });
  } catch (error) {
    throw error;
  }
};

export const removeRole = async (req, res) => {
  const { userId, role } = req.body;
  try {
    await User.updateOne(
      { _id: userId },
      {
        $pull: { roles: role },
      }
    );
    res.status(200).json({
      success: true,
      message: `${role} role removed for the user with id, ${userId}`,
    });
  } catch (error) {
    throw error;
  }
};

export const addUser = async (req, res) => {
  const { email, name, userId, phoneNumber } = req.body;
  console.log(email, name, userId, phoneNumber);
  const insertQuery =
    "INSERT INTO user (name, email, userId,phoneNumber) VALUES (?, ?, ?, ?)";
  const values = [name, email, userId, phoneNumber];

  try {
    const [row] = await db.query(insertQuery, values);
    return res.status(200).json({
      sucess: true,
      message: "User profile successfully added",
      userProfile: { userId: row.insertId, name, email, phoneNumber },
    });
  } catch (error) {
    console.error("User profile table insertion failed:", error);
    return res.status(500).json({
      sucess: false,
      message: `Error while saving user profile ${error.message}`,
    });
  }
};

export const getAccessLogs = async (req, res) => {
  const query =
    " select distinct username, country, region, region_name, city, lat, lon,DATE_FORMAT(logged_at, '%Y-%m-%d %H:%i') AS logged_at from visitor_geo_logs order by lat, lon, logged_at desc ";
  try {
    const [rows] = await db.query(query);
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json(error);
  }
};
