const express = require("express");
const router = express.Router();

const {
  getIncome,
  addIncome,
  deleteIncome, // ✅ FIXED (added import)
} = require("../controllers/incomeController");

router.get("/", getIncome);
router.post("/", addIncome);
router.delete("/:id", deleteIncome);

module.exports = router;