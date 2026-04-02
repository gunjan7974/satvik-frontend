"use client";

import React from "react";
import { Camera, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface ProfileCoverProps {
  coverImage?: string;
  onEditCover?: () => void;
}

export function ProfileCover({ coverImage, onEditCover }: ProfileCoverProps) {
  return (
    <div className="relative h-80 md:h-[450px] w-full overflow-hidden rounded-b-[3rem] shadow-2xl group">
      {/* 🖼️ COVER IMAGE */}
      <img
        src={coverImage || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop"}
        alt="Profile Cover"
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      
      {/* 🌑 OVERLAY GRADIENT */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
      
      {/* 🔘 EDIT COVER BUTTON */}
      <div className="absolute bottom-10 right-10 z-20">
        <Button 
          variant="secondary" 
          onClick={onEditCover}
          className="bg-white/20 hover:bg-white/40 text-white border-white/30 backdrop-blur-md rounded-2xl px-6 h-12 shadow-xl flex items-center gap-3 transition-all active:scale-95"
        >
          <Camera className="w-5 h-5" />
          <span className="font-bold text-sm tracking-tight hidden sm:inline">Edit Cover Photo</span>
        </Button>
      </div>

      {/* Decorative Energy Flare */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-orange-500/20 rounded-full blur-[100px] pointer-events-none" />
    </div>
  );
}
