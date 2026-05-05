import { motion } from "framer-motion";

export default function Card({ children, className = "" }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className={`glass p-5 rounded-2xl shadow-xl transition ${className}`}
    >
      {children}
    </motion.div>
  );
}