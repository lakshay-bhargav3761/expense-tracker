import React from "react";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { dark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 dark:bg-gray-800 dark:text-white shadow hover:shadow-md transition"
    >
      {dark ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
};

export default ThemeToggle;