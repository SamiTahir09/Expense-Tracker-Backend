import Income from "../models/Income.js";
import ExpenseModel from "../models/Expense.js";

import { isValidObjectId, Types } from "mongoose";

export const getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;
    const userObjectId = new Types.ObjectId(userId);

    //................................. Calculate total income..............................................
    const totalIncomeResult = await Income.aggregate([
      { $match: { user: userObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalIncome = totalIncomeResult[0] ? totalIncomeResult[0].total : 0;

    // ................................Calculate total expenses...................................................
    const totalExpenseResult = await ExpenseModel.aggregate([
      { $match: { user: userObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    //..................................... get income transactions in 60 days....................................
    const last60daysIncomeTransactions = await Income.find({
      userId,
      date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
    }).sort({ date: -1 });

    // get total income in 60 days
    const totalIncomeLast60Days = last60daysIncomeTransactions.reduce(
      (total, transaction) => total + transaction.amount,
      0,
    );

    // ............................get expense transactions in 30 days.............................................
    const last30daysExpenseTransactions = await ExpenseModel.find({
      userId,
      date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    }).sort({ date: -1 });

    //.................................. get total expense in 30 days...............................................
    const totalExpenseLast30Days = last30daysExpenseTransactions.reduce(
      (total, transaction) => total + transaction.amount,
      0,
    );
    //......................................fetch last 5 income + expense transactions.........................................................
    const lastTransactions = [
      ...(await Income.find({ userId }).sort({ date: -1 }).limit(5)).map(
        (transaction) => ({
          ...transaction.toObject(),
          type: "income",
        }),
      ),
      ...(await ExpenseModel.find({ userId }).sort({ date: -1 }).limit(5)).map(
        (transaction) => ({
          ...transaction.toObject(),
          type: "expense",
        }),
      ),
    ].sort((a, b) => b.date - a.date);

    // final response
    res.json({
      totalBalance:
        (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
      totalIncome: totalIncome[0]?.total || 0,
      totalExpense: totalExpense[0]?.total || 0,
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
    res.status(500).json({ message: "Error fetching dashboard data", error });
  }
};
