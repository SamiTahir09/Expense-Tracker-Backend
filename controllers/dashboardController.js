import Income from "../models/Income.js";
import ExpenseModel from "../models/Expense.js";
import { Types } from "mongoose";

export const getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;
    const userObjectId = new Types.ObjectId(userId);

    // Total Income
    const totalIncomeResult = await Income.aggregate([
      { $match: { user: userObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalIncome =
      totalIncomeResult.length > 0 ? totalIncomeResult[0].total : 0;

    // Total Expense
    const totalExpenseResult = await ExpenseModel.aggregate([
      { $match: { user: userObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalExpense =
      totalExpenseResult.length > 0 ? totalExpenseResult[0].total : 0;

    // Last 60 Days Income
    const last60daysIncomeTransactions = await Income.find({
      user: userObjectId,
      date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
    }).sort({ date: -1 });

    const totalIncomeLast60Days = last60daysIncomeTransactions.reduce(
      (total, transaction) => total + transaction.amount,
      0,
    );

    // Last 30 Days Expense
    const last30daysExpenseTransactions = await ExpenseModel.find({
      user: userObjectId,
      date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    }).sort({ date: -1 });

    const totalExpenseLast30Days = last30daysExpenseTransactions.reduce(
      (total, transaction) => total + transaction.amount,
      0,
    );

    // Recent Transactions (Income + Expense)
    const lastTransactions = [
      ...(
        await Income.find({ user: userObjectId }).sort({ date: -1 }).limit(5)
      ).map((transaction) => ({
        ...transaction.toObject(),
        type: "income",
      })),
      ...(
        await ExpenseModel.find({ user: userObjectId })
          .sort({ date: -1 })
          .limit(5)
      ).map((transaction) => ({
        ...transaction.toObject(),
        type: "expense",
      })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    // Final Response
    res.json({
      totalBalance: totalIncome - totalExpense,
      totalIncome,
      totalExpense,

      totalExpenseLast30Days: {
        total: totalExpenseLast30Days,
        transactions: last30daysExpenseTransactions,
      },

      totalIncomeLast60Days: {
        total: totalIncomeLast60Days,
        transactions: last60daysIncomeTransactions,
      },

      recentTransactions: lastTransactions,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({
      message: "Error fetching dashboard data",
      error: error.message,
    });
  }
};
