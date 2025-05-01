import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import { connectDB } from "./db/connectDB.js";

import authRoutes from "./routes/auth.route.js";
import blogRoute from "./routes/blog.routes.js";
import uploadRoute from "./routes/upload.route.js";
import userRoutes from "./routes/user.route.js";
import adminRoute from "./routes/admin.route.js";

import { verifyToken } from "./middleware/verifyToken.js";
import { visitorLogger } from "./middleware/visitorLogger.js";

dotenv.config(); //Env file values to access we need to make use of dotenv

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json()); // this middleware parse incoming requests, req.body, with json payload
app.use(cookieParser()); // allows to parse incoming cookies

app.use("/api/auth", authRoutes);
app.use("/api/user", verifyToken(["user", "admin"]), userRoutes);
app.use("/api/blogs", blogRoute);
app.use("/fileupload", uploadRoute);
app.use("/admin", adminRoute);

app.use("/uploads", express.static(path.resolve(__dirname, "../uploads")));

app.get("/track-visit", visitorLogger(), (req, res) => {
  res.sendStatus(200); // or res.end() or res.send('OK')
});

console.log(
  "Serving static files from:",
  path.resolve(__dirname, "../uploads")
);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend", "dist")));
  app.get("*splat", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

// app.get("/quote-image", async (req, res) => {
//   const response = await axios.get("https://zenquotes.io/api/image", {
//     responseType: "stream",
//   });
//   res.setHeader("Content-Type", "image/jpeg");
//   response.data.pipe(res);
// });

app.listen(PORT, () => {
  connectDB();
  console.log("Server is running on port: ", PORT);
});

//g3Lh4bFrzlwX3yeO
