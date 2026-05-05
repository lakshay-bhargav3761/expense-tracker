import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../api/api";
import { useApp } from "../context/AppContext";

export default function Login() {
  const navigate = useNavigate();
  const { updateUser } = useApp();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/login", form);

      const token = res.data?.token;
      const user = res.data?.user;

      // ❗ SAFETY CHECK
      if (!token || !user) {
        throw new Error("Invalid login response");
      }

      // ✅ STORE EVERYTHING PROPERLY
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userId", user._id); // 🔥 CRITICAL FIX

      // ✅ UPDATE CONTEXT
      updateUser(user);

      // ✅ REDIRECT CLEANLY
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">

      {/* BACKGROUND */}
      <div className="absolute w-[500px] h-[500px] bg-primary opacity-20 blur-3xl rounded-full -top-20 -left-20"></div>
      <div className="absolute w-[400px] h-[400px] bg-secondary opacity-20 blur-3xl rounded-full bottom-0 right-0"></div>

      {/* LEFT */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-primary to-secondary text-white items-center justify-center flex-col space-y-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold"
        >
          Expense Tracker 💸
        </motion.h1>

        <p className="opacity-80 text-lg">
          Manage your money smarter
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gray-100 dark:bg-gray-900">

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-8 rounded-2xl w-full max-w-md space-y-6 shadow-2xl text-gray-800 dark:text-gray-200"
        >
          <h2 className="text-2xl font-bold text-center">
            Welcome Back 👋
          </h2>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm text-center"
            >
              {error}
            </motion.p>
          )}

          {/* EMAIL */}
          <motion.input
            whileFocus={{ scale: 1.02 }}
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="input"
          />

          {/* PASSWORD */}
          <motion.input
            whileFocus={{ scale: 1.02 }}
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="input"
          />

          {/* BUTTON */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>

          {/* LINK */}
          <p className="text-sm text-center">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-primary cursor-pointer font-medium hover:underline"
            >
              Sign up
            </span>
          </p>
        </motion.form>
      </div>
    </div>
  );
}