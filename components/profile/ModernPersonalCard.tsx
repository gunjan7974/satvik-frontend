"use client";

import React from "react";
import { 
  Briefcase, 
  Mail, 
  Link as LinkIcon, 
  MapPin, 
  Globe,
  Instagram,
  Facebook,
  Twitter,
  Youtube
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface ModernPersonalCardProps {
  user: any;
}

export function ModernPersonalCard({ user }: ModernPersonalCardProps) {
  const contactInfo = [
    { icon: Briefcase, label: "Sir, P.P. Institute Of Science", sub: "Gastro Researcher" },
    { icon: Mail, label: user?.email || "xyzjonathan@gmail.com", sub: "Official Terminal" },
    { icon: LinkIcon, label: "www.xyz.com", sub: "Digital Portfolio" },
    { icon: MapPin, label: "New York, USA - 100001", sub: "Primary Hub" },
  ];

  const socialIcons = [
     { icon: Instagram, color: "rose" },
     { icon: Facebook, color: "blue" },
     { icon: Twitter, color: "sky" },
     { icon: Youtube, color: "red" },
  ];

  return (
    <Card className="rounded-[2rem] border-0 shadow-lg p-10 bg-white group hover:shadow-2xl transition-all duration-700">
       <CardContent className="p-0 space-y-10 relative">
          <div className="space-y-4">
             <h3 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">Introduction</h3>
             <p className="text-gray-400 font-medium text-sm leading-relaxed italic">
                Hello, I am {user?.name}. I love exploring new flavors and culinary architectures. Premium member of the Sattvik community since 2024.
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
                      <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-orange-200 group-hover/item:bg-orange-500 group-hover/item:text-white transition-all shadow-sm">
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
             <div className="flex gap-3">
                {socialIcons.map((social, i) => (
                   <button key={i} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-orange-500 hover:text-white transition-all">
                      <social.icon className="w-4 h-4" />
                   </button>
                ))}
             </div>
             <p className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.2em] italic underline underline-offset-8">Status: Active Hub</p>
          </div>
       </CardContent>
    </Card>
  );
}
