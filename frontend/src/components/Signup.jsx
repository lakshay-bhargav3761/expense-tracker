import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../api/api";
import { useApp } from "../context/AppContext";

export default function Signup() {
  const navigate = useNavigate();
  const { updateUser } = useApp();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

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

    if (!form.name || !form.email || !form.password) {
      setError("Please fill all fields");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/register", form);

      const token = res.data?.token;
      const user = res.data?.user;

      // ❗ SAFETY CHECK
      if (!token || !user) {
        throw new Error("Invalid signup response");
      }

      // ✅ STORE EVERYTHING (CRITICAL FIX)
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userId", user._id); // 🔥 THIS WAS MISSING

      // ✅ SYNC CONTEXT
      updateUser(user);

      // ✅ REDIRECT
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.response?.data?.message || "Signup failed");
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
          Join Expense Tracker 🚀
        </motion.h1>

        <p className="opacity-80 text-lg">
          Start managing your finances today
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gray-100 dark:bg-gray-900">

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-8 rounded-2xl w-full max-w-md space-y-6 shadow-2xl text-gray-800 dark:text-white dark:text-gray-200"
        >
          <h2 className="text-2xl font-bold text-center">
            Create Account ✨
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

          {/* NAME */}
          <motion.input
            whileFocus={{ scale: 1.02 }}
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="input"
          />

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
            {loading ? "Creating..." : "Sign Up"}
          </motion.button>

          {/* LINK */}
          <p className="text-sm text-center">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-primary cursor-pointer font-medium hover:underline"
            >
              Login
            </span>
          </p>
        </motion.form>
      </div>
    </div>
  );
}