"use client";

import React from "react";
import { 
  Package, 
  Star, 
  CalendarCheck, 
  ShoppingBag, 
  Heart,
  LayoutGrid
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/components/ui/utils";

interface ProfileTabsProps {
  activeTab: string;
  onTabChange: (id: string) => void;
}

export function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  const tabs = [
    { id: "profile", label: "Profile", icon: LayoutGrid },
    { id: "orders", label: "Orders", icon: Package },
    { id: "reviews", label: "Reviews", icon: Star },
    { id: "bookings", label: "Bookings", icon: CalendarCheck },
    { id: "events", label: "Events", icon: ShoppingBag },
  ];

  return (
    <div className="sticky top-0 z-40 bg-white/60 backdrop-blur-3xl border-b border-orange-50 shadow-sm mt-8">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-center">
        <div className="flex items-center gap-4 md:gap-14 overflow-x-auto scrollbar-hide py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "relative flex items-center gap-3 px-6 py-4 transition-all group",
                  isActive ? "text-orange-600" : "text-gray-400 hover:text-gray-600"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-orange-500" : "text-gray-300 group-hover:text-gray-500")} />
                <span className="font-black text-[11px] uppercase tracking-[0.2em] italic hidden sm:inline-block transition-all">
                  {tab.label}
                </span>

                {/* ✨ ACTIVE UNDERLINE ANIMATION */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
