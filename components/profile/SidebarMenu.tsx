"use client";

import React, { useState } from "react";
import { 
  User, 
  Package, 
  MapPin, 
  Lock, 
  LogOut, 
  ChevronRight, 
  Edit3, 
  Calendar,
  Clock,
  Navigation
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/components/ui/utils";

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  subLabel?: string;
}

interface SidebarMenuProps {
  activeTab: string;
  onTabChange: (id: string) => void;
  onLogout: () => void;
}

export function SidebarMenu({ activeTab, onTabChange, onLogout }: SidebarMenuProps) {
  const menuItems: MenuItem[] = [
    { id: "profile", label: "My Profile", icon: User, subLabel: "Personal information" },
    { id: "orders", label: "My Orders", icon: Package, subLabel: "View your order history" },
    { id: "track", label: "Track Order", icon: Navigation, subLabel: "Check current status" },
    { id: "bookings", label: "My Bookings", icon: Clock, subLabel: "Table reservations" },
    { id: "events", label: "My Events", icon: Calendar, subLabel: "Events you've joined" },
    { id: "addresses", label: "Addresses", icon: MapPin, subLabel: "Save delivery locations" },
    { id: "password", label: "Change Password", icon: Lock, subLabel: "Manage your security" },
  ];

  return (
    <div className="bg-white rounded-3xl p-3 md:p-4 shadow-sm border border-orange-100/50 md:sticky md:top-28 overflow-x-auto md:overflow-visible">
      <div className="flex md:flex-col items-center md:items-stretch gap-2 md:space-y-1 min-w-max md:min-w-0">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex-shrink-0 md:w-full flex items-center justify-between p-3 md:p-4 rounded-xl md:rounded-2xl transition-all duration-300 group",
                isActive 
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-200" 
                  : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
              )}
            >
              <div className="flex items-center gap-3 md:gap-4">
                <div className={cn(
                  "p-2 rounded-lg md:p-2.5 md:rounded-xl transition-colors",
                  isActive ? "bg-white/20" : "bg-orange-50 group-hover:bg-white"
                )}>
                  <Icon className={cn("w-4 h-4 md:w-5 md:h-5", isActive ? "text-white" : "text-orange-500")} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-xs md:text-sm leading-none md:mb-1">{item.label}</p>
                  {item.subLabel && (
                    <p className={cn("hidden md:block text-[10px] font-medium", isActive ? "text-white/70" : "text-gray-400")}>
                      {item.subLabel}
                    </p>
                  )}
                </div>
              </div>
              <ChevronRight className={cn("hidden md:block w-4 h-4 transition-transform", isActive ? "translate-x-1" : "text-gray-300 group-hover:translate-x-1")} />
            </button>
          );
        })}
        
        <div className="ml-2 pl-2 border-l border-orange-50 md:ml-0 md:pl-0 md:pt-4 md:mt-4 md:border-t md:border-orange-50 md:border-l-0">
          <button
            onClick={onLogout}
            className="flex-shrink-0 md:w-full flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl text-red-500 hover:bg-red-50 transition-all duration-300 group"
          >
            <div className="p-2 rounded-lg md:p-2.5 md:rounded-xl bg-red-50 group-hover:bg-red-100 transition-colors">
              <LogOut className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <p className="font-bold text-xs md:text-sm tracking-tight">Log Out</p>
          </button>
        </div>
      </div>
    </div>
  );
}
