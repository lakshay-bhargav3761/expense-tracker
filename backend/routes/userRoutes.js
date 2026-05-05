const express = require("express");
const router = express.Router();
const User = require("../models/userModel");

/* UPDATE PROFILE */
router.put("/update", async (req, res) => {
  try {
    const { userId, name } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID required" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { name },
      { new: true }
    );

    res.json({ user });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router; // 🔥 THIS LINE IS CRITICAL