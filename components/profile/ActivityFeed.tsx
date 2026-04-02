"use client";

import React from "react";
import { 
  Package, 
  Clock, 
  MapPin, 
  Zap, 
  ImageIcon, 
  MoreVertical, 
  Heart, 
  MessageCircle, 
  Share2, 
  PenTool,
  Plus,
  Star,
  ShoppingBag
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface ActivityFeedProps {
  user: any;
}

export function ActivityFeed({ user }: ActivityFeedProps) {
  const posts = [
    { 
      id: "1", 
      type: "order",
      time: "15 min ago", 
      content: "Just fulfillment my second Deluxe Paneer Platter today. The flavors are exceptionally synthesized under current gastronomic protocol. Absolute satisfaction reached.", 
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop",
      stats: { likes: "1.2k", comments: "42", shares: "18" }
    },
    { 
      id: "2", 
      type: "review",
      time: "2 hours ago", 
      content: "The Jamshedpur Hub delivered a perfect Classic Gulab Jamun sequence today. Synchronizing with the new dessert module was an amazing experience.", 
      image: "https://images.unsplash.com/photo-1594916814923-d92233989c9c?q=80&w=1974&auto=format&fit=crop",
      stats: { likes: "840", comments: "15", shares: "5" }
    },
  ];

  return (
    <div className="space-y-12">
       {posts.map((post, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            key={post.id}
          >
             <Card className="rounded-[4rem] border-0 shadow-lg overflow-hidden bg-white/60 backdrop-blur-3xl group hover:shadow-2xl transition-all duration-1000 border border-orange-100/30">
                <CardContent className="p-10 space-y-8">
                   {/* 📄 POST HEADER (SOCIAL STYLE) */}
                   <div className="flex justify-between items-center">
                      <div className="flex items-center gap-5">
                         <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-tr from-orange-400 to-red-500 rounded-full blur-md opacity-20" />
                            <Avatar className="w-14 h-14 border-4 border-white shadow-xl relative z-10">
                               <AvatarImage src={user?.avatar} />
                               <AvatarFallback className="bg-orange-500 text-white font-bold">{user?.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                         </div>
                         <div>
                            <div className="flex items-center gap-3">
                               <h4 className="font-black text-gray-950 uppercase text-lg italic leading-none mb-1">{user?.name || "Member"}</h4>
                               <p className="px-3 py-1 bg-gray-50 text-gray-400 font-bold text-[8px] uppercase tracking-widest rounded-full">{post.type} Log</p>
                            </div>
                            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] flex items-center mt-1">
                               <Clock className="w-3.5 h-3.5 mr-2" /> {post.time}
                            </p>
                         </div>
                      </div>
                      <Button variant="ghost" className="rounded-2xl h-14 w-14 p-0 text-gray-300 hover:bg-orange-50 hover:text-orange-600 transition-all">
                         <MoreVertical className="w-6 h-6" />
                      </Button>
                   </div>

                   {/* 📝 POST CONTENT */}
                   <p className="text-gray-700 font-bold text-xl leading-relaxed italic px-4">
                      {post.content}
                   </p>

                   {/* 📷 POST IMAGE (HIGH-END PREVIEW) */}
                   {post.image && (
                      <div className="rounded-[3rem] overflow-hidden shadow-2xl relative group/img cursor-pointer aspect-video md:aspect-[16/8]">
                         <img 
                           src={post.image} 
                           alt="Activity" 
                           className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-1000"
                         />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-700 flex items-end p-12">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                                  <ImageIcon className="w-6 h-6" />
                               </div>
                               <div>
                                  <p className="text-white font-black italic uppercase tracking-[0.2em] text-[10px]">Coordinate Sequence Synced</p>
                               </div>
                            </div>
                         </div>
                      </div>
                   )}

                   {/* 💓 POST INTERACTIVITY (SOCIAL HUB) */}
                   <div className="flex items-center justify-between pt-8 border-t border-gray-50 px-6">
                      <div className="flex gap-10">
                         <button className="flex items-center gap-3 text-gray-400 hover:text-red-500 group/i transition-all">
                            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center group-hover/i:bg-red-50 group-hover/i:scale-110 transition-all shadow-sm group-hover/i:shadow-red-50">
                               <Heart className="w-6 h-6 group-hover/i:fill-current" />
                            </div>
                            <span className="font-black text-[11px] uppercase tracking-widest leading-none mt-1">{post.stats.likes}</span>
                         </button>
                         <button className="flex items-center gap-3 text-gray-400 hover:text-orange-500 group/i transition-all">
                            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center group-hover/i:bg-orange-50 group-hover/i:scale-110 transition-all shadow-sm group-hover/i:shadow-orange-50">
                               <MessageCircle className="w-6 h-6 group-hover/i:fill-current" />
                            </div>
                            <span className="font-black text-[11px] uppercase tracking-widest leading-none mt-1">{post.stats.comments}</span>
                         </button>
                         <button className="flex items-center gap-3 text-gray-400 hover:text-sky-500 group/i transition-all">
                            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center group-hover/i:bg-sky-50 group-hover/i:scale-110 transition-all shadow-sm group-hover/i:shadow-sky-50">
                               <Share2 className="w-6 h-6 group-hover/i:fill-current" />
                            </div>
                            <span className="font-black text-[11px] uppercase tracking-widest leading-none mt-1">{post.stats.shares}</span>
                         </button>
                      </div>
                      
                      <div className="flex items-center gap-4">
                         <div className="flex -space-x-3">
                            {[1, 2, 3].map(i => (
                               <Avatar key={i} className="w-10 h-10 border-4 border-white shadow-lg ring-1 ring-orange-50">
                                  <AvatarImage src={`https://i.pravatar.cc/100?img=${i + 10}`} />
                                  <AvatarFallback>U</AvatarFallback>
                               </Avatar>
                            ))}
                         </div>
                         <span className="text-[9px] font-black uppercase text-gray-300 italic tracking-[0.2em]">+ 1.2k others viewed</span>
                      </div>
                   </div>
                </CardContent>
             </Card>
          </motion.div>
       ))}

       {/* 🔄 LOAD MORE TACTICAL BUTTON */}
       <div className="py-12 flex justify-center">
          <Button variant="ghost" className="h-16 px-12 rounded-3xl text-orange-500 font-black uppercase text-[11px] tracking-[0.4em] italic hover:bg-orange-500 hover:text-white transition-all shadow-xl shadow-orange-50 active:scale-95 group">
             Retrieve More Data <Plus className="w-5 h-5 ml-4 group-hover:rotate-180 transition-transform duration-500" />
          </Button>
       </div>
    </div>
  );
}
