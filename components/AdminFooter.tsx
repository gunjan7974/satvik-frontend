"use client";

import { motion } from 'framer-motion';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <motion.footer
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="bg-white border-t border-gray-200 py-4 px-4 md:px-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
        <p className="text-sm text-gray-600 text-center md:text-left">
          Developed by <span className="font-semibold text-orange-600">Tsrijanali Food and Services Pvt. Ltd.</span>
        </p>
        <p className="text-sm text-gray-500 text-center md:text-right">
          © {currentYear} Sattvik Kaleva. All rights reserved.
        </p>
      </div>
    </motion.footer>
  );
}