const incomeModel = require("../models/incomeModel");
const getDateRange = require("../utils/dateFilter");

/* 📥 GET INCOME */
exports.getIncome = async (req, res) => {
  try {
    const { userId, range = "monthly" } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const { start, end } = getDateRange(range);

    const incomes = await incomeModel
      .find({
        userId,
        date: { $gte: start, $lte: end },
      })
      .sort({ date: -1 });

    const totalIncome = incomes.reduce(
      (acc, cur) => acc + Number(cur.amount || 0),
      0
    );

    const averageIncome =
      incomes.length > 0 ? totalIncome / incomes.length : 0;

    res.json({
      totalIncome,
      averageIncome,
      numberOfTransactions: incomes.length,
      incomes,
    });
  } catch (err) {
    console.error("Get income error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/* ➕ ADD INCOME */
exports.addIncome = async (req, res) => {
  try {
    const { description, amount, category, date, userId } = req.body;

    if (!description || !amount || !category || !date || !userId) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (Number(amount) <= 0) {
      return res.status(400).json({ error: "Amount must be positive" });
    }

    const income = await incomeModel.create({
      description: description.trim(),
      amount: Number(amount),
      category: category.trim(),
      date,
      userId,
    });

    res.status(201).json({
      message: "Income added",
      income,
    });
  } catch (err) {
    console.error("Add income error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/* ❌ DELETE INCOME */
exports.deleteIncome = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await incomeModel.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Income not found" });
    }

    res.json({ message: "Income deleted" });
  } catch (err) {
    console.error("Delete income error:", err);
    res.status(500).json({ error: "Server error" });
  }
};