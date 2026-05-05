import React from "react";

const AddTransactionModal = ({
  showModal,
  setShowModal,
  newTransaction,
  setNewTransaction,
  handleAddTransaction,
  type = "both", // income / expense / both
  categories = ["Food", "Salary", "Shopping", "Other"],
}) => {
  if (!showModal) return null;

  const handleChange = (field, value) => {
    setNewTransaction((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    if (!newTransaction.description || !newTransaction.amount) {
      alert("Please fill all required fields");
      return;
    }

    handleAddTransaction();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white w-[90%] max-w-md p-6 rounded-xl shadow-lg">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Add Transaction</h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-500 hover:text-black"
          >
            ✕
          </button>
        </div>

        {/* TYPE (optional) */}
        {type === "both" && (
          <div className="mb-3">
            <label className="text-sm text-gray-600">Type</label>
            <select
              value={newTransaction.type}
              onChange={(e) => handleChange("type", e.target.value)}
              className="w-full border p-2 rounded mt-1"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
        )}

        {/* DESCRIPTION */}
        <div className="mb-3">
          <label className="text-sm text-gray-600">Description</label>
          <input
            type="text"
            placeholder="Enter description"
            value={newTransaction.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="w-full border p-2 rounded mt-1"
          />
        </div>

        {/* AMOUNT */}
        <div className="mb-3">
          <label className="text-sm text-gray-600">Amount</label>
          <input
            type="number"
            placeholder="Enter amount"
            value={newTransaction.amount}
            onChange={(e) => handleChange("amount", e.target.value)}
            className="w-full border p-2 rounded mt-1"
          />
        </div>

        {/* CATEGORY */}
        <div className="mb-3">
          <label className="text-sm text-gray-600">Category</label>
          <select
            value={newTransaction.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className="w-full border p-2 rounded mt-1"
          >
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* DATE */}
        <div className="mb-4">
          <label className="text-sm text-gray-600">Date</label>
          <input
            type="date"
            value={newTransaction.date}
            onChange={(e) => handleChange("date", e.target.value)}
            className="w-full border p-2 rounded mt-1"
          />
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTransactionModal;