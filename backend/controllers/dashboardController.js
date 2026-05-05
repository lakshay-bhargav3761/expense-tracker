const Expense = require("../models/expenseModel");
const Income = require("../models/incomeModel");
const getDateRange = require("../utils/dateFilter");

exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.query.userId;
    const filter = req.query.filter || "monthly";

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { start, end } = getDateRange(filter);

    /* =========================
       FETCH DATA
    ========================= */
    const incomes = await Income.find({
      userId,
      date: { $gte: start, $lte: end },
    }).sort({ date: 1 });

    const expenses = await Expense.find({
      userId,
      date: { $gte: start, $lte: end },
    }).sort({ date: 1 });

    /* =========================
       TOTALS
    ========================= */
    const monthlyIncome = incomes.reduce(
      (sum, i) => sum + Number(i.amount || 0),
      0
    );

    const monthlyExpense = expenses.reduce(
      (sum, e) => sum + Number(e.amount || 0),
      0
    );

    const savings = monthlyIncome - monthlyExpense;

    const savingsRate =
      monthlyIncome === 0
        ? 0
        : Math.round((savings / monthlyIncome) * 100);

    /* =========================
       COMBINE TRANSACTIONS
    ========================= */
    const combined = [
      ...incomes.map((i) => ({
        ...i.toObject(),
        type: "income",
      })),
      ...expenses.map((e) => ({
        ...e.toObject(),
        type: "expense",
      })),
    ];

    /* =========================
       RECENT TRANSACTIONS
    ========================= */
    const recentTransactions = [...combined]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    /* =========================
       TREND DATA (FINAL FIX)
    ========================= */
    const trendMap = {};

    combined.forEach((t) => {
      const dateObj = new Date(t.date);

      let key;

      if (filter === "yearly") {
        key = dateObj.toLocaleString("default", { month: "short" });
      } else {
        key = dateObj.toISOString().split("T")[0]; // 🔥 stable format
      }

      if (!trendMap[key]) {
        trendMap[key] = {
          date: key,
          income: 0,
          expense: 0,
        };
      }

      if (t.type === "income") {
        trendMap[key].income += Number(t.amount || 0);
      } else {
        trendMap[key].expense += Number(t.amount || 0);
      }
    });

    let trendData = Object.values(trendMap).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    // 🔥 fallback (prevents empty chart)
    if (trendData.length === 0) {
      trendData = [
        {
          date: "No Data",
          income: 0,
          expense: 0,
        },
      ];
    }

    /* =========================
       CATEGORY DATA
    ========================= */
    const categoryMap = {};

    expenses.forEach((e) => {
      categoryMap[e.category] =
        (categoryMap[e.category] || 0) + Number(e.amount || 0);
    });

    const categoryData = Object.keys(categoryMap).map((key) => ({
      name: key,
      value: categoryMap[key],
    }));

    /* =========================
       RESPONSE
    ========================= */
    res.json({
      monthlyIncome,
      monthlyExpense,
      savings,
      savingsRate,
      recentTransactions,
      trendData,
      categoryData,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ error: "Server error" });
  }
};