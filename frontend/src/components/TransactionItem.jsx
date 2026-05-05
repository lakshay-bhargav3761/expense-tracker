import React from "react";

const TransactionItem = ({ transaction }) => {
  return (
    <div className="p-3 border rounded mb-2">
      <p>{transaction.description}</p>
      <p>₹{transaction.amount}</p>
      <p>{transaction.category}</p>
    </div>
  );
};

export default TransactionItem;