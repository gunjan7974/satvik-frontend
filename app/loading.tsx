'use client';

import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[60] bg-white/80 backdrop-blur-md flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        {/* Animated Logo or Icon */}
        <div className="relative">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.8, 1, 0.8] 
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="w-24 h-24 rounded-full border-4 border-orange-100 flex items-center justify-center p-4 bg-white shadow-xl shadow-orange-100/50"
          >
            <img
              src="/assets/logo.png"
              alt="Loading..."
              className="w-full h-full object-contain"
            />
          </motion.div>
          
          {/* Pulsing ring around logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: "easeOut" 
            }}
            className="absolute inset-0 rounded-full border-2 border-orange-400"
          />
        </div>

        {/* Text and ProgressBar */}
        <div className="flex flex-col items-center gap-3">
          <h2 className="text-xl font-bold text-gray-800 tracking-tight">Sattvik Kaleva</h2>
          <div className="w-40 h-1 bg-gray-100 rounded-full overflow-hidden relative">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"
            />
          </div>
          <p className="text-xs text-orange-600 font-medium uppercase tracking-widest animate-pulse">
            Loading Excellence...
          </p>
        </div>
      </div>
    </div>
  );
}
