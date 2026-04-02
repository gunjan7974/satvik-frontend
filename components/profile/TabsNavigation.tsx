"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/components/ui/utils";
import { 
  User, 
  Package, 
  MapPin, 
  Calendar, 
  Settings, 
  CreditCard,
  Navigation,
  Clock,
  Sparkles
} from "lucide-react";

interface TabsNavigationProps {
  activeTab: string;
  onTabChange: (id: string) => void;
}

export function TabsNavigation({ activeTab, onTabChange }: TabsNavigationProps) {
  const tabs = [
    { id: "profile", label: "Profile", icon: User, color: "orange" },
    { id: "orders", label: "Orders", icon: Package, color: "rose" },
    { id: "bookings", label: "Bookings", icon: Clock, color: "blue" },
    { id: "events", label: "Events", icon: Calendar, color: "emerald" },
    { id: "addresses", label: "Addresses", icon: MapPin, color: "amber" },
    { id: "track", label: "Track", icon: Navigation, color: "indigo" },
  ];

  return (
    <div className="sticky top-[90px] z-50 bg-[#FFFBF7]/80 backdrop-blur-xl border-y border-orange-100/30 -mx-6 md:-mx-12 px-6 md:px-12 py-8 overflow-x-auto scrollbar-hide">
      <div className="max-w-max mx-auto flex items-center gap-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "relative flex flex-col items-center gap-3 px-10 py-5 rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-700 group whitespace-nowrap overflow-hidden transition-all",
                isActive 
                  ? "text-white shadow-2xl scale-105" 
                  : "text-gray-400 hover:text-gray-900 hover:bg-orange-50/50"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabGlow"
                  className="absolute inset-[2px] bg-gradient-to-tr from-orange-500 via-orange-600 to-red-600 rounded-[2.3rem] shadow-[0_12px_24px_-8px_rgba(255,107,0,0.4)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.8 }}
                />
              )}
              
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className={cn(
                  "p-2.5 rounded-2xl transition-all duration-300",
                  isActive ? "bg-white/20 text-white rotate-6" : "bg-orange-50/50 text-orange-200 group-hover:scale-125"
                )}>
                  <Icon className="w-5 h-5 flex-shrink-0" />
                </div>
                <span className={cn("relative z-10 font-black italic", isActive ? "opacity-100" : "opacity-60")}>
                  {tab.label}
                </span>
                
                {/* Visual Dot */}
                {isActive && (
                   <div className="flex gap-1 mt-1">
                      <div className="w-1 h-1 rounded-full bg-white" />
                      <div className="px-1 h-1 rounded-full bg-white opacity-40" />
                   </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
