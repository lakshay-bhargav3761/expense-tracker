
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  LogOut,
  User,
  ChevronDown,
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  Menu,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import { useApp } from "../context/AppContext";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { logout, user } = useApp();

  const navLinks = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      label: "Income",
      path: "/income",
      icon: <TrendingUp className="w-4 h-4" />,
    },
    {
      label: "Expenses",
      path: "/expense",
      icon: <TrendingDown className="w-4 h-4" />,
    },
  ];

  // CLOSE DROPDOWN ON OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // CLOSE MOBILE MENU ON ROUTE CHANGE
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <nav className="glass sticky top-0 z-50 px-6 py-3 flex items-center justify-between backdrop-blur-xl border-b border-white/20">

      {/* LEFT */}
      <div className="flex items-center gap-4">
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link
          to="/dashboard"
          className="text-lg font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
        >
          Expense Tracker
        </Link>
      </div>

      {/* NAV LINKS */}
      <div className="hidden md:flex items-center gap-2">
        {navLinks.map((link) => {
          const active = location.pathname.startsWith(link.path);

          return (
            <motion.div key={link.path} whileHover={{ scale: 1.05 }}>
              <Link
                to={link.path}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "text-white bg-gradient-to-r from-primary to-secondary shadow-md"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">

        <ThemeToggle />

        {/* USER */}
        <div className="relative" ref={menuRef}>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white shadow-md">
              {user?.name ? user.name[0].toUpperCase() : <User className="w-4 h-4" />}
            </div>

            <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-200">
              {user?.name || "User"}
            </span>

            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                menuOpen ? "rotate-180" : ""
              }`}
            />
          </motion.button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-52 glass rounded-2xl shadow-2xl py-2 z-50"
              >
                <button
                  onClick={() => navigate("/profile")}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition rounded-lg"
                >
                  <User className="w-4 h-4" />
                  Profile
                </button>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition rounded-lg"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* OVERLAY */}
            <div
              className="fixed inset-0 bg-black/30 z-40"
              onClick={() => setMobileOpen(false)}
            />

            <motion.div
              initial={{ x: -80 }}
              animate={{ x: 0 }}
              exit={{ x: -80 }}
              className="absolute top-full left-0 w-full glass border-t md:hidden z-50"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 px-6 py-3 ${
                    location.pathname.startsWith(link.path)
                      ? "bg-gradient-to-r from-primary to-secondary text-white"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}

