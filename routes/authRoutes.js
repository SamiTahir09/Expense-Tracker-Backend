import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  registerUser,
  loginUser,
  getUserInfo,
} from "../controllers/authController.js";
import upload from "../middleware/uploadmiddleware.js";

const router = express.Router();

// Register route
router.post("/register", registerUser);
// Login route
router.post("/login", loginUser);
// Get User Info route
router.get("/getuser", protect, getUserInfo);

router.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.status(200).json({ message: "File uploaded successfully", imageUrl });
});

export default router;
