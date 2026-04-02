"use client";

import React from "react";
import { 
  LogOut, 
  Edit2, 
  Share2, 
  Camera, 
  Package, 
  Star, 
  CalendarCheck,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface ProfileHeaderProps {
  user: any;
  onLogout: () => void;
  onEdit: () => void;
}

export function ProfileHeader({ user, onLogout, onEdit }: ProfileHeaderProps) {
  const stats = [
    { label: "Orders", value: "938", icon: Package, color: "text-orange-500" },
    { label: "Reviews", value: "3,586", icon: Star, color: "text-amber-500" },
    { label: "Bookings", value: "2,659", icon: CalendarCheck, color: "text-indigo-500" },
  ];

  return (
    <div className="relative pt-0 px-6 md:px-20 pb-4">
      {/* 👤 AVATAR AREA (OVERLAPPING COVER) */}
      <div className="flex flex-col md:flex-row items-center md:items-end justify-between -mt-24 md:-mt-28 gap-8 relative z-30">
        
        {/* AVATAR + NAME (Social Hub) */}
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="relative group/avatar">
            {/* Ambient Shadow/Glow */}
            <div className="absolute -inset-2 bg-gradient-to-tr from-orange-500 to-red-600 rounded-full blur-[30px] opacity-25 group-hover/avatar:opacity-40 transition-opacity" />
            
            <Avatar className="w-40 h-40 md:w-52 md:h-52 border-[8px] border-white shadow-2xl relative z-10">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-600 text-white text-5xl font-black italic">
                {user?.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            {/* 📷 EDIT AVATAR BUTTON */}
            <button className="absolute bottom-6 right-6 z-20 w-12 h-12 rounded-full bg-gray-100 hover:bg-orange-500 text-gray-900 hover:text-white flex items-center justify-center border-4 border-white shadow-xl transition-all duration-300 active:scale-90 group-hover/avatar:translate-y-[-4px]">
               <Camera className="w-5 h-5" />
            </button>
          </div>

          <div className="text-center md:text-left space-y-3 pb-4">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
               <h1 className="text-4xl md:text-5xl font-black text-gray-950 tracking-tighter uppercase italic drop-shadow-sm">
                 {user?.name || "Guest Core"}
               </h1>
               <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 border-0 px-4 py-1.5 rounded-xl shadow-lg shadow-orange-100 h-9 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> 
                  <span className="font-black italic uppercase tracking-widest text-[9px]">Verified Member</span>
               </Badge>
            </div>
            <p className="text-gray-400 font-bold text-base md:text-lg flex items-center justify-center md:justify-start gap-3 italic">
              <Sparkles className="w-5 h-5 text-orange-400 fill-current" /> Food Lover | Premium Platinum Member
            </p>
            
            {/* STATS (SOCIAL STYLE) */}
            <div className="flex items-center justify-center md:justify-start gap-12 mt-6">
               {stats.map((stat, i) => {
                 const Icon = stat.icon;
                 return (
                   <motion.div 
                     key={i} 
                     whileHover={{ y: -5 }}
                     className="text-center md:text-left group cursor-pointer"
                   >
                     <div className="flex flex-col md:flex-row items-center gap-2">
                        <span className="text-xl md:text-2xl font-black text-gray-900 leading-none">{stat.value}</span>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-orange-500 transition-colors">{stat.label}</span>
                     </div>
                   </motion.div>
                 );
               })}
            </div>
          </div>
        </div>

        {/* 🔘 ACTION BUTTONS (SOCIAL STYLE) */}
        <div className="flex items-center gap-4 pb-8 h-full">
           <Button 
              onClick={onEdit}
              className="bg-gradient-to-r from-orange-500 h-14 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-2xl px-10 border-0 shadow-2xl shadow-orange-100 font-black uppercase text-[11px] tracking-[0.2em] transition-all active:scale-95 flex items-center gap-3 relative overflow-hidden group/btn"
           >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
              <Edit2 className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Edit Profile</span>
           </Button>
           <Button 
              variant="outline"
              className="h-14 w-14 rounded-2xl border-[3px] border-orange-50 text-orange-500 hover:bg-orange-50 transition-all flex items-center justify-center"
           >
              <Share2 className="w-6 h-6" />
           </Button>
           <button 
              onClick={onLogout}
              className="h-14 w-14 rounded-2xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center group/logout"
           >
              <LogOut className="w-6 h-6 group-hover/logout:translate-x-1 transition-transform" />
           </button>
        </div>
      </div>
    </div>
  );
}
