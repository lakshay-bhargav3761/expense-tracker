import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = () => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen">

      <Sidebar />

      <div className="flex-1 flex flex-col relative z-10">
        <Navbar />

       <motion.main
  key={location.pathname}
  initial={{ opacity: 0, y: 15 }}
  animate={{ opacity: 1, y: 0 }}
  className="flex-1 p-6 relative z-10"
>
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </motion.main>
      </div>
    </div>
  );
};

export default Layout;