"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <motion.footer
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mt-auto py-6 px-4 md:px-8 border-t border-gray-100 bg-white shadow-[0_-1px_3px_rgba(0,0,0,0.02)]"
    >
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <p className="text-sm font-semibold text-gray-800 tracking-tight">Sattvik Kaleva Admin</p>
          <p className="text-xs text-gray-500 mt-0.5">
            Internal Operations Control Panel v1.2
          </p>
        </div>

        <div className="flex items-center space-x-6">
          <Link href="/admin/support" className="text-xs text-gray-500 hover:text-orange-600 transition-colors uppercase tracking-wider font-medium">Support</Link>
          <Link href="/admin/docs" className="text-xs text-gray-500 hover:text-orange-600 transition-colors uppercase tracking-wider font-medium">Documentation</Link>
          <Link href="/admin/analytics" className="text-xs text-gray-500 hover:text-orange-600 transition-colors uppercase tracking-wider font-medium">Analytics</Link>
        </div>

        <div className="flex flex-col items-center md:items-end text-center md:text-right">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black mb-1">Developed By</p>
          <p className="text-sm font-bold text-gray-900 group">
            <span className="text-orange-600">Tsrijanali</span> Food and Services
          </p>
          <p className="text-[11px] text-gray-400 mt-1 italic">
            © {currentYear} Sattvik Kaleva. All Rights Reserved.
          </p>
        </div>
      </div>
    </motion.footer>
  );
}