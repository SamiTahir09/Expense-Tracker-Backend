import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  addincome,
  deleteincome,
  downloadincome,
  getAllincome,
} from "../controllers/incomecontroller.js";

const router = express.Router();

router.post("/add", protect, addincome);
router.get("/get", protect, getAllincome);
router.delete("/:id", protect, deleteincome);
router.get("/download", protect, downloadincome);

export default router;
