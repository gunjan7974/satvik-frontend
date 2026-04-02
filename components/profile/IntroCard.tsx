"use client";

import React from "react";
import { 
  Contact, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Zap,
  Globe,
  Instagram,
  Facebook,
  Twitter,
  Youtube
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface IntroCardProps {
  user: any;
}

export function IntroCard({ user }: IntroCardProps) {
  const contactInfo = [
    { icon: Mail, label: user?.email || "xyzjonathan@gmail.com", sub: "Official Email Terminal" },
    { icon: Phone, label: user?.phone || "+91 96449 74442", sub: "Primary Pulse Node" },
    { icon: MapPin, label: "Raipur, Chhattisgarh", sub: "Central Logistics Hub" },
  ];

  const socialIcons = [
     { icon: Instagram, color: "text-rose-500", bg: "bg-rose-50" },
     { icon: Facebook, color: "text-blue-600", bg: "bg-blue-50" },
     { icon: Twitter, color: "text-sky-400", bg: "bg-sky-50" },
     { icon: Youtube, color: "text-red-500", bg: "bg-red-50" },
  ];

  return (
    <div className="space-y-10">
       <Card className="rounded-[3rem] border-0 shadow-lg p-10 bg-white group hover:shadow-2xl transition-all duration-700 relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <CardContent className="p-0 space-y-10 relative">
             <div className="space-y-4">
                <h3 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">Intro</h3>
                <p className="text-gray-400 font-medium text-sm leading-relaxed italic">
                   Hello, I am {user?.name || "Member"}. I love exploring new culinary dimensions and authentic flavors. 
                   Sattvik enthusiast since the first bite.
                </p>
             </div>

             <div className="space-y-8">
                {contactInfo.map((info, i) => {
                   const Icon = info.icon;
                   return (
                      <motion.div 
                        whileHover={{ x: 5 }}
                        key={i} 
                        className="flex items-center gap-6 group/item"
                      >
                         <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-orange-200 group-hover/item:bg-orange-600 group-hover/item:text-white transition-all shadow-sm">
                            <Icon className="w-6 h-6" />
                         </div>
                         <div>
                            <p className="font-black text-gray-950 uppercase tracking-tighter text-lg leading-none mb-1">{info.label}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{info.sub}</p>
                         </div>
                      </motion.div>
                   );
                })}
             </div>

             <div className="pt-10 border-t border-gray-50 flex justify-between items-center">
                <div className="flex gap-4">
                   {socialIcons.map((social, i) => (
                      <button key={i} className={`w-12 h-12 rounded-full ${social.bg} flex items-center justify-center ${social.color} hover:bg-gray-950 hover:text-white transition-all shadow-xl shadow-gray-100`}>
                         <social.icon className="w-5 h-5" />
                      </button>
                   ))}
                </div>
             </div>
          </CardContent>
       </Card>

       {/* 🧱 QUICK INFO CARD */}
       <Card className="rounded-[3rem] border-0 shadow-lg p-10 bg-gradient-to-br from-gray-950 to-black text-white relative overflow-hidden group shadow-2xl transition-all duration-700">
          <div className="absolute top-0 right-0 w-40 h-40 bg-orange-600/20 rounded-full blur-[80px] -mr-16 -mt-16 animate-pulse" />
          <CardContent className="p-0 space-y-8 relative">
             <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-3xl bg-orange-600/20 flex items-center justify-center text-orange-500 border border-orange-500/30">
                   <Zap className="w-8 h-8 fill-current" />
                </div>
                <div>
                   <p className="text-orange-500 font-black italic tracking-tighter text-2xl uppercase leading-none">Platinum Hub</p>
                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">Verified Subscription Node</p>
                </div>
             </div>
             
             <div className="space-y-4 pt-4">
                <div className="flex justify-between items-center">
                   <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Joined Hub:
                   </span>
                   <span className="font-bold text-gray-100 italic">October 2024</span>
                </div>
                <div className="flex justify-between items-center text-emerald-400">
                   <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                      <Globe className="w-4 h-4" /> Account Protocol:
                   </span>
                   <span className="font-bold italic">Standard Secure</span>
                </div>
             </div>
          </CardContent>
       </Card>
    </div>
  );
}
