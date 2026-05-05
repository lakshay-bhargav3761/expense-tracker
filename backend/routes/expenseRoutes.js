const express = require("express");
const router = express.Router();

const {
  getExpense,
  addExpense,
  deleteExpense, // ✅ FIXED (added import)
} = require("../controllers/expenseController");

router.get("/", getExpense);
router.post("/", addExpense);
router.delete("/:id", deleteExpense);

module.exports = router;