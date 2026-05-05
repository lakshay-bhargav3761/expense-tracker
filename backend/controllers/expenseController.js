const expenseModel = require("../models/expenseModel");
const getDateRange = require("../utils/dateFilter");

/* 📥 GET EXPENSE */
exports.getExpense = async (req, res) => {
  try {
    const { userId, range = "monthly" } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const { start, end } = getDateRange(range);

    const expenses = await expenseModel
      .find({
        userId,
        date: { $gte: start, $lte: end },
      })
      .sort({ date: -1 });

    const totalExpense = expenses.reduce(
      (acc, cur) => acc + Number(cur.amount || 0),
      0
    );

    const averageExpense =
      expenses.length > 0 ? totalExpense / expenses.length : 0;

    res.json({
      totalExpense,
      averageExpense,
      numberOfTransactions: expenses.length,
      expense: expenses, // 👈 keep key name same as frontend expects
    });
  } catch (err) {
    console.error("Get expense error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/* ➕ ADD EXPENSE */
exports.addExpense = async (req, res) => {
  try {
    const { description, amount, category, date, userId } = req.body;

    if (!description || !amount || !category || !date || !userId) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (Number(amount) <= 0) {
      return res.status(400).json({ error: "Amount must be positive" });
    }

    const expense = await expenseModel.create({
      description: description.trim(),
      amount: Number(amount),
      category: category.trim(),
      date,
      userId,
    });

    res.status(201).json({
      message: "Expense added",
      expense,
    });
  } catch (err) {
    console.error("Add expense error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/* ❌ DELETE EXPENSE */
exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await expenseModel.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Expense not found" });
    }

    res.json({ message: "Expense deleted" });
  } catch (err) {
    console.error("Delete expense error:", err);
    res.status(500).json({ error: "Server error" });
  }
};