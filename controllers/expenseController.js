import xlsx from "xlsx";
import ExpenseModel from "../models/Expense.js";

// add expense source
export const addExpense = async (req, res) => {
  const userId = req.user.id;

  try {
    const { icon, amount, category, date } = req.body;

    if (!amount || !category || !date) {
      return res
        .status(400)
        .json({ message: "Amount, category, and date are required" });
    }

    const newExpense = new ExpenseModel({
      userId,
      icon,
      amount,
      category,
      date,
    });
    await newExpense.save();
    res
      .status(201)
      .json({ message: "Expense added successfully", expense: newExpense });
  } catch (error) {}
};
// get all expenses
export const getAllExpenses = async (req, res) => {
  const userId = req.user.id;
  try {
    const expenses = await ExpenseModel.find({ userId }).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching expenses", error });
  }
};
// Download Expenses
export const downloadExpensesExcel = async (req, res) => {
  const userId = req.user.id;

  try {
    const expense = await ExpenseModel.find({ userId }).sort({ date: -1 });

    //prepare data for excel
    const excelData = expense.map((item) => ({
      Source: item.category,
      Amount: item.amount,
      Date: item.date.toISOString().split("T")[0],
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(excelData);
    xlsx.utils.book_append_sheet(wb, ws, "Expenses");
    xlsx.writeFile(wb, "Expenses_Detail.xlsx");

    res.download("Expenses_Detail.xlsx");

    res.json(excelData);
  } catch (error) {
    res.status(500).json({
      message: "Error downloading expenses data",
      error: error.message,
    });
  }
};
// Delete Expense
export const deleteExpense = async (req, res) => {
  try {
    const expense = await ExpenseModel.findOneAndDelete(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting expense", error: error.message });
  }
};
