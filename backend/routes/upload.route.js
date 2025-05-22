import express from "express";
import { upload, upload_doc } from "../uploads/multer.js"; // adjust path as needed

const router = express.Router();

router.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  res.json({
    message: "Image uploaded successfully",
    filePath: `/uploads/${req.file.filename}`,
  });
});

router.post("/upload_doc", upload_doc.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  res.json({
    message: "Image uploaded successfully",
    filePath: `/docprofile/${req.file.filename}`,
  });
});

export default router;
