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
  Plus
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface ModernOrdersFeedProps {
  user: any;
}

export function ModernOrdersFeed({ user }: ModernOrdersFeedProps) {
  const posts = [
    { 
      id: "1", 
      time: "15 min ago", 
      content: "The Jamshedpur Hub just fulfillment my second Deluxe Paneer Platter today. The flavors are exceptionally synthesized under current gastronomic protocol.", 
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop" 
    },
    { 
      id: "2", 
      time: "2 hours ago", 
      content: "Synchronizing with the new dessert module: Classic Gulab Jamun sequence initiated. Total satisfaction established.", 
      image: "https://images.unsplash.com/photo-1594916814923-d92233989c9c?q=80&w=1974&auto=format&fit=crop" 
    },
  ];

  return (
    <div className="space-y-12">
       {/* ✍️ SHARE THOUGHTS / ORDER POSTER */}
       <Card className="rounded-[2rem] border-0 shadow-lg p-8 bg-white/60 backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100/30 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
          
          <CardContent className="p-0 space-y-6">
             <div className="flex gap-4">
                <Avatar className="w-12 h-12 shadow-lg">
                   <AvatarImage src={user?.avatar} />
                   <AvatarFallback className="bg-orange-500 text-white font-bold">{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                   <textarea 
                     className="w-full bg-orange-50/20 border-0 rounded-2xl p-4 text-sm font-bold text-gray-800 focus:ring-2 focus:ring-orange-100 outline-none transition-all h-24 placeholder:text-gray-400 placeholder:italic"
                     placeholder="What's your culinary coordinate today?"
                   />
                </div>
             </div>
             
             <div className="flex justify-between items-center border-t border-gray-50 pt-6">
                <div className="flex gap-4">
                   <button className="flex items-center gap-2 text-gray-400 hover:text-orange-500 transition-all group/btn">
                      <div className="w-10 h-10 rounded-xl bg-orange-50 group-hover/btn:bg-orange-500 group-hover/btn:text-white flex items-center justify-center transition-all">
                         <ImageIcon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest hidden md:inline-block italic">Photo Hub</span>
                   </button>
                   <button className="flex items-center gap-2 text-gray-400 hover:text-orange-500 transition-all group/btn">
                      <div className="w-10 h-10 rounded-xl bg-orange-50 group-hover/btn:bg-orange-500 group-hover/btn:text-white flex items-center justify-center transition-all">
                         <PenTool className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest hidden md:inline-block italic">Experience Log</span>
                   </button>
                </div>
                
                <Button className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl px-10 h-14 font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-orange-100 transition-all active:scale-95">
                   Establish Post
                </Button>
             </div>
          </CardContent>
       </Card>

       {/* 📜 ACTIVITY FEED */}
       <div className="space-y-12">
          {posts.map((post) => (
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               key={post.id}
             >
                <Card className="rounded-[3rem] border-0 shadow-xl overflow-hidden bg-white/60 backdrop-blur-xl group hover:shadow-2xl transition-all duration-700">
                   <CardContent className="p-10 space-y-8">
                      {/* Post Header */}
                      <div className="flex justify-between items-start">
                         <div className="flex gap-4">
                            <Avatar className="w-14 h-14 border-4 border-white shadow-xl">
                               <AvatarImage src={user?.avatar} />
                               <AvatarFallback className="bg-orange-500 text-white font-bold">{user?.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                               <h4 className="font-black text-gray-950 uppercase text-lg italic leading-none mb-1">{user?.name}</h4>
                               <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest flex items-center">
                                  <Clock className="w-3.5 h-3.5 mr-2" /> {post.time}
                               </p>
                            </div>
                         </div>
                         <Button variant="ghost" className="rounded-full h-12 w-12 p-0 text-gray-400 hover:bg-orange-50 hover:text-orange-600">
                            <MoreVertical className="w-6 h-6" />
                         </Button>
                      </div>

                      {/* Post Content */}
                      <p className="text-gray-700 font-bold text-lg leading-relaxed italic px-2">
                         {post.content}
                      </p>

                      {/* Post Image */}
                      {post.image && (
                         <div className="rounded-[2.5rem] overflow-hidden shadow-2xl relative group/img">
                            <img 
                              src={post.image} 
                              alt="Activity" 
                              className="w-full h-[400px] object-cover group-hover/img:scale-105 transition-transform duration-1000"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-700 flex items-end p-10">
                               <p className="text-white font-black italic uppercase tracking-widest text-[10px]">Coordinate Fulfilled Successfully</p>
                            </div>
                         </div>
                      )}

                      {/* Post Interactivity */}
                      <div className="flex items-center justify-between pt-6 border-t border-gray-50 px-4">
                         <div className="flex gap-8">
                            <button className="flex items-center gap-3 text-gray-400 hover:text-red-500 group/i transition-all">
                               <Heart className="w-6 h-6 group-hover/i:scale-125 transition-transform" />
                               <span className="font-black text-[10px] uppercase tracking-widest leading-none">1.2k</span>
                            </button>
                            <button className="flex items-center gap-3 text-gray-400 hover:text-orange-500 group/i transition-all">
                               <MessageCircle className="w-6 h-6 group-hover/i:scale-125 transition-transform" />
                               <span className="font-black text-[10px] uppercase tracking-widest leading-none">42</span>
                            </button>
                            <button className="flex items-center gap-3 text-gray-400 hover:text-blue-500 group/i transition-all">
                               <Share2 className="w-6 h-6 group-hover/i:scale-125 transition-transform" />
                            </button>
                         </div>
                         <Button variant="link" className="text-orange-500 font-black uppercase text-[10px] tracking-widest italic hover:text-orange-600 group">
                            Expand Module <Plus className="w-4 h-4 ml-2 group-hover:rotate-180 transition-transform" />
                         </Button>
                      </div>
                   </CardContent>
                </Card>
             </motion.div>
          ))}
       </div>
    </div>
  );
}
