import React, { useEffect, useState } from "react";
import { dashboardStyles } from "../styles/dummyStyles";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";

import API from "../api/api";
import { useApp } from "../context/AppContext";
import AnimatedWrapper from "../components/AnimatedWrapper";

const COLORS = ["#16a34a", "#dc2626", "#2563eb", "#f59e0b"];

/* =========================
   🔥 NEW PIE CHART COMPONENT
========================= */
const CustomPieChart = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          cx="50%"
          cy="50%"
          innerRadius={70} // donut
          outerRadius={100}
          paddingAngle={4}
          activeIndex={activeIndex}
          onMouseEnter={(_, index) => setActiveIndex(index)}
        >
          {data.map((entry, index) => (
            <Cell
              key={index}
              fill={COLORS[index % COLORS.length]}
              style={{
                filter:
                  index === activeIndex
                    ? "drop-shadow(0px 0px 10px rgba(0,0,0,0.3))"
                    : "none",
                cursor: "pointer",
              }}
            />
          ))}
        </Pie>

        <Tooltip />

        {/* CENTER TOTAL */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-lg font-bold fill-gray-700 dark:fill-white"
        >
          ₹{total}
        </text>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default function Dashboard() {
  const { refreshKey } = useApp();

  const [data, setData] = useState({
    monthlyIncome: 0,
    monthlyExpense: 0,
    savings: 0,
    savingsRate: 0,
    recentTransactions: [],
    trendData: [],
    categoryData: [],
  });

  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("monthly");

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const res = await API.get("/dashboard", {
        params: { filter },
      });

      setData({
        monthlyIncome: res.data?.monthlyIncome ?? 0,
        monthlyExpense: res.data?.monthlyExpense ?? 0,
        savings: res.data?.savings ?? 0,
        savingsRate: res.data?.savingsRate ?? 0,
        recentTransactions: Array.isArray(res.data?.recentTransactions)
          ? res.data.recentTransactions
          : [],
        trendData: Array.isArray(res.data?.trendData)
          ? res.data.trendData
          : [],
        categoryData: Array.isArray(res.data?.categoryData)
          ? res.data.categoryData
          : [],
      });
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [filter, refreshKey]);

  if (loading) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        <div className="h-8 w-1/3 bg-gray-300 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-300 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <AnimatedWrapper>
      <div className={dashboardStyles.container}>
        <div className={dashboardStyles.headerContainer}>
          <div className={dashboardStyles.headerContent}>
            <div>
              <h1 className={dashboardStyles.headerTitle}>Dashboard</h1>
              <p className={dashboardStyles.headerSubtitle}>
                Overview of your financial activity
              </p>
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border px-3 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>

        <div className={dashboardStyles.summaryGrid}>
          <StatCard title="Income" value={data.monthlyIncome} color="green" />
          <StatCard title="Expense" value={data.monthlyExpense} color="red" />
          <StatCard title="Savings" value={data.savings} color="blue" />
          <StatCard title="Savings %" value={data.savingsRate} color="purple" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* TREND */}
          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
            <h2 className="mb-4 font-semibold text-gray-800 dark:text-white">
              Trend
            </h2>

            {data.trendData.length === 0 ? (
              <p className="text-gray-500">No data</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={3} />
                  <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* CATEGORY (UPDATED) */}
          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
            <h2 className="mb-4 font-semibold text-gray-800 dark:text-white">
              Expense Categories
            </h2>

            {data.categoryData.length === 0 ? (
              <p className="text-gray-500">No data</p>
            ) : (
              <CustomPieChart data={data.categoryData} />
            )}
          </div>
        </div>

        {/* RECENT */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-lg mt-6 border border-gray-100 dark:border-gray-700">
          <h2 className="font-semibold mb-4 text-lg text-gray-800 dark:text-white">
            Recent Transactions
          </h2>

          {data.recentTransactions.length === 0 ? (
            <p className="text-gray-400">No transactions yet</p>
          ) : (
            <div className="space-y-3">
              {data.recentTransactions.map((t) => (
                <motion.div
                  key={t._id}
                  whileHover={{ scale: 1.02 }}
                  className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-gray-700"
                >
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {t.description}
                    </p>
                    <p className="text-sm text-gray-500">{t.category}</p>
                  </div>

                  <span
                    className={
                      t.type === "income"
                        ? "text-green-500 font-semibold"
                        : "text-red-500 font-semibold"
                    }
                  >
                    ₹{t.amount}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AnimatedWrapper>
  );
}

const StatCard = ({ title, value, color }) => {
  const colors = {
    green: "from-green-400 to-green-600",
    red: "from-red-400 to-red-600",
    blue: "from-blue-400 to-blue-600",
    purple: "from-purple-400 to-purple-600",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`p-5 rounded-2xl text-white bg-gradient-to-r ${colors[color]} shadow-lg`}
    >
      <p className="opacity-80">{title}</p>
      <h2 className="text-2xl font-bold">
        {title === "Savings %" ? `${value}%` : `₹${value}`}
      </h2>
    </motion.div>
  );
};