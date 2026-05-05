
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  ArrowUp,
  ArrowDown,
  User,
  Menu,
  ChevronLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MENU_ITEMS = [
  { text: "Dashboard", path: "/dashboard", icon: <Home size={18} /> },
  { text: "Income", path: "/income", icon: <ArrowUp size={18} /> },
  { text: "Expenses", path: "/expense", icon: <ArrowDown size={18} /> },
  { text: "Profile", path: "/profile", icon: <User size={18} /> },
];

const Sidebar = () => {
  const { pathname } = useLocation();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const sidebarRef = useRef(null);

  // 🔒 prevent scroll on mobile
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [mobileOpen]);

  // ❌ close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        mobileOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target)
      ) {
        setMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileOpen]);

  // ✅ close mobile on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <motion.div
        animate={{ width: isCollapsed ? 64 : 240 }}
        className="hidden md:flex flex-col backdrop-blur-xl bg-white dark:bg-gray-800/70 dark:bg-gray-900/80 
        border-r border-white/20 dark:border-gray-700 shadow-lg h-screen transition-all duration-300"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-4">
          {!isCollapsed && (
            <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Expense
            </h1>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            {isCollapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* MENU */}
        <nav className="flex-1 px-2 space-y-2">
          {MENU_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.path);

            return (
              <Link
                key={item.text}
                to={item.path}
                className={`relative flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "text-white bg-gradient-to-r from-primary to-secondary shadow-md"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                } ${isCollapsed && "justify-center"}`}
              >
                {item.icon}
                {!isCollapsed && <span>{item.text}</span>}

                {/* ACTIVE DOT */}
                {isActive && !isCollapsed && (
                  <span className="absolute right-3 w-2 h-2 bg-white dark:bg-gray-800 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>
      </motion.div>

      {/* MOBILE BUTTON */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white dark:bg-gray-800 dark:bg-gray-800 p-2 rounded-lg shadow-md"
        onClick={() => setMobileOpen(true)}
      >
        <Menu size={18} />
      </button>

      {/* MOBILE SIDEBAR */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* OVERLAY */}
            <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  onClick={() => setMobileOpen(false)} // 🔥 ADD THIS
  className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 cursor-pointer"
/>

            {/* SIDEBAR PANEL */}
            <motion.div
              ref={sidebarRef}
              initial={{ x: -100 }}
              animate={{ x: 0 }}
              exit={{ x: -100 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 dark:bg-gray-900 p-4 shadow-xl z-50"
            >
              <h1 className="text-lg font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Expense Tracker
              </h1>

              <nav className="space-y-2">
                {MENU_ITEMS.map((item) => {
                  const isActive = pathname.startsWith(item.path);

                  return (
                    <Link
                      key={item.text}
                      to={item.path}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl ${
                        isActive
                          ? "text-white bg-gradient-to-r from-primary to-secondary"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      {item.icon}
                      <span>{item.text}</span>
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;

