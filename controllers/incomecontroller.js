import User from "../models/User.js";
// All Income
export const addincome = (req, res) => {
  const userId = req.user.id;

  try {
    const { icon, source, amount, date } = req.body;

    if (!source || !amount || !date) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newIncome = new Income({
      userId,
      icon,
      source,
      amount,
      date,
    });
    newIncome.save();
    res
      .status(201)
      .json({ message: "Income added successfully", income: newIncome });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding income", error: error.message });
  }
};
// Get All Income
export const getAllincome = (req, res) => {
  res.send("Get Income");
};
// Delete Income
export const deleteincome = (req, res) => {
  res.send("Delete Income");
};
// Download Income
export const downloadincome = (req, res) => {
  res.send("Download Income");
};
