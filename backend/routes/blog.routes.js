import express from "express";
import {
  saveBlog,
  getBlogs,
  getAllDisplayBlogs,
  deleteBlog,
  saveBlogComment,
  getComments,
  deleteComment,
} from "../controllers/blogscontroller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/saveBlog", saveBlog);
router.get("/getBlogs", getBlogs);
router.get("/getAllDisplayBlogs", getAllDisplayBlogs);
router.post("/deleteBlog", verifyToken(["admin", "user"]), deleteBlog);
router.post("/saveBlogComment", saveBlogComment);
router.get("/getComments", getComments);
router.post("/deleteComment", verifyToken(["admin", "user"]), deleteComment);

export default router;
