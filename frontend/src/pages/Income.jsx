import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import API from "../api/api";
import { useApp } from "../context/AppContext";
import AnimatedWrapper from "../components/AnimatedWrapper";
import { incomeStyles } from "../styles/dummyStyles";

const IncomePage = () => {
  const { triggerRefresh } = useApp(); // ✅ FIX // ✅ correct function

  const user = JSON.parse(localStorage.getItem("user")); // ✅ FIX

  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const [newIncome, setNewIncome] = useState({
    description: "",
    amount: "",
    category: "Salary",
    date: new Date().toISOString().split("T")[0],
  });

  /* =========================
     FETCH INCOME
  ========================= */
  const fetchIncome = async () => {
    try {
      setLoading(true);

      const res = await API.get("/income", {
        params: { userId: user?._id }, // ✅ FIX
      });

      const data = Array.isArray(res.data?.incomes)
        ? res.data.incomes
        : [];

      setIncomes(data);
    } catch (err) {
      console.error("Income fetch error:", err);
      setIncomes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) fetchIncome();
  }, []);

  /* =========================
     ADD INCOME
  ========================= */
  const handleAdd = async () => {
    if (!newIncome.description || !newIncome.amount) {
      alert("Fill all fields");
      return;
    }

    try {
      setAdding(true);

      await API.post("/income", {
        ...newIncome,
        amount: Number(newIncome.amount),
        userId: user._id, // ✅ CRITICAL FIX
      });

      await fetchIncome();     // refresh list
      triggerRefresh();          // refresh dashboard

      setNewIncome({
        description: "",
        amount: "",
        category: "Salary",
        date: new Date().toISOString().split("T")[0],
      });

    } catch (err) {
      console.error("Add income error:", err);
    } finally {
      setAdding(false);
    }
  };

  /* =========================
     DELETE INCOME
  ========================= */
  const handleDelete = async (id) => {
    try {
      await API.delete(`/income/${id}`);

      await fetchIncome();
      triggerRefresh();

    } catch (err) {
      console.error("Delete error:", err);
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
      <div className={incomeStyles.wrapper}>

        {/* HEADER */}
        <div className={incomeStyles.headerContainer}>
          <div className={incomeStyles.header}>
            <div>
              <h1 className={incomeStyles.headerTitle}>Income</h1>
              <p className={incomeStyles.headerSubtitle}>
                Track and manage your earnings
              </p>
            </div>
          </div>
        </div>

        {/* FORM */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg space-y-5 border border-gray-100 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            <input
              placeholder="Description"
              value={newIncome.description}
              onChange={(e) =>
                setNewIncome({ ...newIncome, description: e.target.value })
              }
              className="border px-3 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            />

            <input
              type="number"
              placeholder="Amount"
              value={newIncome.amount}
              onChange={(e) =>
                setNewIncome({ ...newIncome, amount: e.target.value })
              }
              className="border px-3 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            />

            <select
              value={newIncome.category}
              onChange={(e) =>
                setNewIncome({ ...newIncome, category: e.target.value })
              }
              className="border px-3 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            >
              <option>Salary</option>
              <option>Freelance</option>
              <option>Business</option>
              <option>Investments</option>
            </select>

            <input
              type="date"
              value={newIncome.date}
              onChange={(e) =>
                setNewIncome({ ...newIncome, date: e.target.value })
              }
              className="border px-3 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAdd}
            disabled={adding}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-2 rounded-xl"
          >
            {adding ? "Adding..." : "Add Income"}
          </motion.button>
        </div>

        {/* LIST */}
        <div className="space-y-4 mt-6">
          {incomes.length === 0 ? (
            <div className="text-center text-gray-400">
              No income yet
            </div>
          ) : (
            incomes.map((i) => (
              <motion.div
                key={i._id}
                whileHover={{ scale: 1.02 }}
                className="bg-white dark:bg-gray-800 p-4 rounded-xl flex justify-between items-center shadow"
              >
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">
                    {i.description}
                  </p>
                  <p className="text-sm text-gray-500">
                    {i.category} • {new Date(i.date).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-4 items-center">
                  <span className="text-green-500 font-semibold">
                    ₹{i.amount}
                  </span>

                  <button
                    onClick={() => handleDelete(i._id)}
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

export default IncomePage;