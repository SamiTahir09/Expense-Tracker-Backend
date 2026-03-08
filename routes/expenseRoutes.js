import express from "express";
import {
  addExpense,
  getAllExpenses,
  downloadExpensesExcel,
  deleteExpense,
} from "../controllers/expenseController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", protect, addExpense);
router.get("/get", protect, getAllExpenses);
router.delete("/delete/:id", protect, deleteExpense);
router.get("/download", protect, downloadExpensesExcel);

export default router;
