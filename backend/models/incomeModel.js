const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: Date,
      required: true,
    },

    // ✅ FIXED (STRING INSTEAD OF OBJECTID)
    userId: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      default: "income",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Income", incomeSchema);