"use client";

import React from "react";
import { 
  LogOut, 
  Edit2, 
  Package, 
  Users, 
  Heart, 
  Plus, 
  MapPin, 
  Mail, 
  Link as LinkIcon, 
  Calendar,
  Image as ImageIcon,
  Clock,
  Navigation,
  Globe,
  Settings
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { cn } from "@/components/ui/utils";

interface ModernProfileHeaderProps {
  user: any;
  activeTab: string;
  onTabChange: (id: string) => void;
  onLogout: () => void;
  onEdit: () => void;
}

export function ModernProfileHeader({ user, activeTab, onTabChange, onLogout, onEdit }: ModernProfileHeaderProps) {
  const tabs = [
    { id: "profile", label: "Profile", icon: UserIcon },
    { id: "orders", label: "My Orders", icon: Package },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "gallery", label: "Gallery", icon: ImageIcon },
  ];

  const stats = [
    { icon: Package, label: "Total Orders", value: "938" },
    { icon: Heart, label: "Saved Items", value: "3,586" },
    { icon: Clock, label: "Visits", value: "2,659" },
  ];

  return (
    <div className="bg-white rounded-[2rem] overflow-hidden shadow-xl border border-gray-100">
      {/* 🏙️ BANNER AREA */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop" 
          alt="Banner" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        {/* Top Floating Controls */}
        <div className="absolute top-6 right-6 flex gap-3">
           <Button 
             variant="glass" 
             onClick={onLogout}
             className="bg-white/20 hover:bg-red-500/80 text-white border-white/20 backdrop-blur-md rounded-xl w-12 h-12 p-0"
           >
              <LogOut className="w-5 h-5" />
           </Button>
        </div>
      </div>

      {/* 👤 AVATAR & INFO AREA */}
      <div className="relative px-6 md:px-12 pb-8">
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between -mt-16 md:-mt-20 gap-8">
          
          {/* STATS (LEFT) */}
          <div className="hidden md:flex items-center gap-12 pb-4">
             {stats.map((stat, i) => (
                <div key={i} className="text-center group cursor-pointer hover:translate-y-[-2px] transition-transform">
                   <p className="text-2xl font-black text-gray-900 leading-none">{stat.value}</p>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 group-hover:text-orange-500">{stat.label}</p>
                </div>
             ))}
          </div>

          {/* CENTRAL AVATAR */}
          <div className="relative">
             <div className="absolute -inset-1.5 bg-white rounded-full shadow-2xl" />
             <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-white shadow-xl relative z-10 ring-4 ring-orange-50/50">
               <AvatarImage src={user?.avatar} />
               <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-600 text-white text-4xl font-black italic">
                 {user?.name?.charAt(0)}
               </AvatarFallback>
             </Avatar>
          </div>

          {/* ACTION BUTTONS (RIGHT) */}
          <div className="flex items-center gap-3 pb-4">
             <div className="flex gap-2 mr-4">
                {[1, 2, 3, 4].map(i => (
                   <button key={i} className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all shadow-sm">
                      <Globe className="w-4 h-4" />
                   </button>
                ))}
             </div>
             <Button 
                onClick={onEdit}
                className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-8 h-12 font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-orange-100"
             >
                <Plus className="w-4 h-4 mr-2" /> Update Profile
             </Button>
          </div>
        </div>

        {/* Name & Title */}
        <div className="text-center mt-6">
           <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">{user?.name}</h2>
           <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-1">Premium Gastro Member</p>
        </div>

        {/* 📑 SECONDARY NAV TABS */}
        <div className="mt-12 pt-6 border-t border-gray-50 flex items-center justify-center md:justify-end gap-10">
           {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                 <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={cn(
                       "flex items-center gap-3 px-4 py-2 border-b-2 transition-all duration-300 group",
                       isActive ? "border-orange-500 text-orange-600" : "border-transparent text-gray-400 hover:text-gray-600"
                    )}
                 >
                    <Icon className={cn("w-4 h-4", isActive ? "text-orange-500" : "text-gray-300 group-hover:text-gray-500")} />
                    <span className="font-black text-[10px] uppercase tracking-widest italic">{tab.label}</span>
                 </button>
              );
           })}
        </div>
      </div>
    </div>
  );
}

import { User as UserIcon } from "lucide-react";
