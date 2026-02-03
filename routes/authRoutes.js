import express from "express";
import {
  registerUser,
  loginUser,
  getUserInfo,
} from "../controllers/authController.js";

const router = express.Router();

// Register route
router.post("/register", registerUser);
// Login route
router.post("/login", loginUser);
// Get User Info route
router.get("/getuser", getUserInfo);

export default router;
