import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import API from "../api/api";
import { useApp } from "../context/AppContext";
import AnimatedWrapper from "../components/AnimatedWrapper";
import { expensePageStyles } from "../styles/dummyStyles";

const ExpensePage = () => {
  const { triggerRefresh } = useApp();

  const user = JSON.parse(localStorage.getItem("user")) || {};

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    category: "Food",
    date: new Date().toISOString().split("T")[0],
  });

  /* =========================
     FETCH EXPENSES
  ========================= */
  const fetchExpenses = async () => {
    try {
      setLoading(true);

      const res = await API.get("/expense", {
        params: { userId: user?._id },
      });

      const data =
        res.data?.expense ||
        res.data?.expenses ||
        res.data?.data ||
        [];

      setExpenses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Expense fetch error:", err);
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchExpenses();
    }
  }, [user?._id]);

  /* =========================
     ADD EXPENSE
  ========================= */
  const handleAdd = async () => {
    if (!newExpense.description || !newExpense.amount) {
      alert("Fill all fields");
      return;
    }

    if (!user?._id) {
      alert("User not found, please login again");
      return;
    }

    try {
      setAdding(true);

      await API.post("/expense", {
        ...newExpense,
        amount: Number(newExpense.amount),
        userId: user._id,
      });

      triggerRefresh();
      await fetchExpenses();

      setNewExpense({
        description: "",
        amount: "",
        category: "Food",
        date: new Date().toISOString().split("T")[0],
      });
    } catch (err) {
      console.error("Add expense error:", err);
    } finally {
      setAdding(false);
    }
  };

  /* =========================
     DELETE EXPENSE
  ========================= */
  const handleDelete = async (id) => {
    try {
      await API.delete(`/expense/${id}`);
      triggerRefresh();
      await fetchExpenses();
    } catch (err) {
      console.error("Delete expense error:", err);
    }
  };

  /* =========================
     LOADING
  ========================= */
  if (loading) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        <div className="h-8 w-1/3 bg-gray-300 rounded"></div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-300 rounded-xl"></div>
        ))}
      </div>
    );
  }

  return (
    <AnimatedWrapper>
      <div className={expensePageStyles.container}>

        {/* HEADER */}
        <div className={expensePageStyles.headerCard}>
          <div className={expensePageStyles.headerContainer}>
            <div>
              <h1 className={expensePageStyles.headerTitle}>Expenses</h1>
              <p className={expensePageStyles.headerSubtitle}>
                Track and manage your spending
              </p>
            </div>
          </div>
        </div>

        {/* FORM */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg space-y-5 border border-gray-100 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            <input
              placeholder="Description"
              value={newExpense.description}
              onChange={(e) =>
                setNewExpense({ ...newExpense, description: e.target.value })
              }
              className="border px-3 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            />

            <input
              type="number"
              placeholder="Amount"
              value={newExpense.amount}
              onChange={(e) =>
                setNewExpense({ ...newExpense, amount: e.target.value })
              }
              className="border px-3 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            />

            <select
              value={newExpense.category}
              onChange={(e) =>
                setNewExpense({ ...newExpense, category: e.target.value })
              }
              className="border px-3 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            >
              <option>Food</option>
              <option>Travel</option>
              <option>Shopping</option>
              <option>Bills</option>
              <option>Health</option>
            </select>

            <input
              type="date"
              value={newExpense.date}
              onChange={(e) =>
                setNewExpense({ ...newExpense, date: e.target.value })
              }
              className="border px-3 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAdd}
            disabled={adding}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-2 rounded-xl"
          >
            {adding ? "Adding..." : "Add Expense"}
          </motion.button>
        </div>

        {/* LIST */}
        <div className="space-y-4 mt-6">
          {expenses.length === 0 ? (
            <div className="text-center text-gray-400">
              No expenses yet
            </div>
          ) : (
            expenses.map((e) => (
              <motion.div
                key={e._id}
                whileHover={{ scale: 1.02 }}
                className="bg-white dark:bg-gray-800 p-4 rounded-xl flex justify-between items-center shadow"
              >
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">
                    {e.description}
                  </p>
                  <p className="text-sm text-gray-500">
                    {e.category} • {new Date(e.date).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-4 items-center">
                  <span className="text-red-500 font-semibold">
                    ₹{e.amount}
                  </span>

                  <button
                    onClick={() => handleDelete(e._id)}
                    className="text-red-500"
                  >
                    ✕
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>

      </div>
    </AnimatedWrapper>
  );
};

export default ExpensePage;