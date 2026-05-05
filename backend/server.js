const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();

/* CONNECT DB */
connectDB();

/* MIDDLEWARE */
app.use(cors());
app.use(express.json());

/* HEALTH CHECK */
app.get("/", (req, res) => {
  res.send("API is running");
});

/* ROUTES */
const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const userRoutes = require("./routes/userRoutes"); // 🔥 ADD THIS

app.use("/api/auth", authRoutes);
app.use("/api/expense", expenseRoutes);
app.use("/api/income", incomeRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/user", userRoutes); // 🔥 ADD THIS

/* 404 HANDLER */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* GLOBAL ERROR HANDLER */
app.use((err, req, res, next) => {
  console.error("Server error:", err.message);
  res.status(500).json({ message: "Internal server error" });
});

/* SERVER */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));