"use client";

import React from "react";
import { 
  ImageIcon, 
  MapPin, 
  Smile, 
  Plus,
  Send,
  Camera,
  Layers,
  Sparkles
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface PostBoxProps {
  user: any;
}

export function PostBox({ user }: PostBoxProps) {
  return (
    <Card className="rounded-[3rem] border-0 shadow-lg p-10 bg-white/60 backdrop-blur-3xl relative overflow-hidden group transition-all duration-700 hover:shadow-2xl hover:bg-white/80 border border-orange-50/50">
       {/* Ambient Flare */}
       <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100/30 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none transition-transform group-hover:scale-150 duration-700" />
       
       <CardContent className="p-0 space-y-10 relative">
          <div className="flex gap-6">
             <Avatar className="w-16 h-16 shadow-xl border-2 border-white ring-2 ring-orange-50">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-600 text-white font-black italic">{user?.name?.charAt(0)}</AvatarFallback>
             </Avatar>
             <div className="flex-1">
                <textarea 
                  className="w-full bg-orange-50/20 border-0 rounded-3xl p-6 text-base font-bold text-gray-800 focus:ring-2 focus:ring-orange-100 outline-none transition-all h-32 placeholder:text-gray-400 placeholder:italic shadow-inner"
                  placeholder="What's on your plate today?"
                />
             </div>
          </div>
          
          <div className="flex justify-between items-center border-t border-gray-50 pt-8">
             <div className="flex gap-4">
                {[
                  { icon: Camera, label: "Add Capture", color: "text-blue-500", bg: "bg-blue-50" },
                  { icon: Layers, label: "Select Module", color: "text-indigo-500", bg: "bg-indigo-50" },
                  { icon: Sparkles, label: "Mood Trace", color: "text-amber-500", bg: "bg-amber-50" },
                ].map((action, i) => {
                   const Icon = action.icon;
                   return (
                     <button 
                       key={i} 
                       className="flex items-center gap-3 text-gray-400 hover:text-orange-500 transition-all group/btn"
                     >
                        <div className={`w-12 h-12 rounded-2xl ${action.bg} ${action.color} group-hover/btn:bg-orange-500 group-hover/btn:text-white flex items-center justify-center transition-all shadow-sm group-hover/btn:shadow-xl group-hover/btn:shadow-orange-100`}>
                           <Icon className="w-5 h-5 transition-transform group-hover/btn:rotate-12" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest hidden lg:inline-block italic">{action.label}</span>
                     </button>
                   );
                })}
             </div>
             
             <Button className="bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 hover:from-orange-600 hover:to-red-700 h-14 rounded-2xl px-12 font-black uppercase text-[11px] tracking-[0.2em] shadow-2xl shadow-orange-100 transition-all active:scale-95 flex items-center gap-3 group/post">
                <span>Publish Experience</span>
                <Send className="w-4 h-4 transition-transform group-hover/post:translate-x-1 group-hover/post:translate-y-[-2px]" />
             </Button>
          </div>
       </CardContent>
    </Card>
  );
}
