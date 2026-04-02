"use client";

import React, { useState } from "react";
import { MapPin, Plus, Edit2, Trash2, Home, Briefcase, Globe, MoreVertical, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface Address {
  id: string;
  type: string;
  line1: string;
  city: string;
  pincode: string;
  landmark?: string;
  isDefault?: boolean;
}

export function AddressGrid() {
  const [addresses, setAddresses] = useState<Address[]>([
    { 
      id: "1", 
      type: "Home", 
      line1: "House No 42, Galaxy Residency", 
      city: "Jamshedpur", 
      pincode: "831001", 
      landmark: "Near Galaxy Mall",
      isDefault: true 
    },
    { 
      id: "2", 
      type: "Work", 
      line1: "Office 12, Tech Tower, Sector 5", 
      city: "Kolkata", 
      pincode: "700091",
      isDefault: false 
    },
  ]);

  const handleDelete = (id: string) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
    toast.success("Grid Coordinate Terminated");
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'home': return Home;
      case 'work': return Briefcase;
      default: return Globe;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-16 py-12 animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-6">
         <div className="space-y-2">
            <div className="flex items-center gap-3">
               <Sparkles className="w-5 h-5 text-orange-500 fill-current" />
               <p className="text-[11px] font-black uppercase tracking-[0.5em] text-orange-500 italic">Core Grid Nodes</p>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-gray-950 tracking-tighter uppercase italic leading-none mb-2">Saved <span className="text-orange-600">Hubs</span></h2>
            <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-[10px] italic">Strategic culinary deployment locations across the network</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
         <AnimatePresence mode="popLayout">
            {/* ➕ ADD NEW HUB CARD - ULTRA PREMIUM */}
            <motion.div
               layout
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               whileHover={{ scale: 1.05, y: -10 }}
               className="group cursor-pointer h-full"
            >
               <Card className="h-full rounded-[4rem] border-4 border-dashed border-orange-200 hover:border-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-700 shadow-none hover:shadow-[0_48px_80px_-24px_rgba(255,107,0,0.3)] active:scale-95 min-h-[350px] flex items-center justify-center text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-orange-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  
                  <div className="p-12 space-y-6 relative z-10">
                     <div className="w-24 h-24 rounded-full bg-orange-100 text-orange-600 group-hover:bg-white group-hover:text-orange-600 flex items-center justify-center mx-auto transition-all duration-700 shadow-xl shadow-orange-100/50 group-hover:rotate-180 group-hover:scale-125">
                        <Plus className="w-12 h-12" />
                     </div>
                     <h4 className="font-black text-gray-400 group-hover:text-white uppercase text-[12px] tracking-[0.4em] transition-colors italic leading-none">
                        Establish New Hub Protocol
                     </h4>
                     <p className="text-[10px] font-bold text-gray-300 group-hover:text-white opacity-0 group-hover:opacity-60 transition-all">Link new coordinates to the main network</p>
                  </div>
               </Card>
            </motion.div>

            {addresses.map((address) => {
               const Icon = getTypeIcon(address.type);
               return (
                  <motion.div
                    key={address.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="relative group h-full"
                  >
                     <Card className="h-full rounded-[4rem] border-0 bg-white shadow-2xl hover:shadow-[0_48px_96px_-24px_rgba(0,0,0,0.15)] hover:-translate-y-4 transition-all duration-700 overflow-hidden group/card relative">
                        {/* Decorative Gradient Background in Group */}
                        <div className="absolute top-0 right-0 w-48 h-48 bg-orange-50 rounded-full blur-3xl -mr-12 -mt-12 group-hover:card:bg-orange-100 transition-all duration-1000" />
                        
                        <CardContent className="p-14 flex flex-col h-full bg-white relative">
                           <div className="flex justify-between items-start mb-12 relative z-10">
                              <div className="w-16 h-16 rounded-[2rem] bg-gray-950 text-white flex items-center justify-center transition-all group-hover:card:bg-orange-600 group-hover:card:rotate-6 group-hover:card:scale-110 shadow-2xl">
                                 <Icon className="w-8 h-8" />
                              </div>
                              
                              <DropdownMenu>
                                 <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-12 w-12 p-0 rounded-full hover:bg-orange-50 text-gray-400 group-hover:card:text-orange-600">
                                       <MoreVertical className="w-6 h-6" />
                                    </Button>
                                 </DropdownMenuTrigger>
                                 <DropdownMenuContent align="end" className="rounded-[2.5rem] border-orange-100 p-3 shadow-2xl bg-white min-w-[200px]">
                                    <DropdownMenuItem className="rounded-2xl flex items-center gap-4 p-4 font-black uppercase text-[10px] tracking-widest text-gray-600 cursor-pointer hover:bg-orange-50 hover:text-orange-600 outline-none">
                                       <Edit2 className="w-4 h-4 ml-2" /> Modify Hub Nodes
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                       onClick={() => handleDelete(address.id)}
                                       className="rounded-2xl flex items-center gap-4 p-4 font-black uppercase text-[10px] tracking-widest text-red-500 cursor-pointer hover:bg-red-50 outline-none"
                                    >
                                       <Trash2 className="w-4 h-4 ml-2" /> Decouple Hub
                                    </DropdownMenuItem>
                                 </DropdownMenuContent>
                              </DropdownMenu>
                           </div>
                           
                           <div className="flex-1 space-y-8 relative z-10">
                              <div className="space-y-4">
                                 <div className="flex items-center gap-3">
                                    <h4 className="font-black text-gray-950 text-3xl md:text-4xl uppercase tracking-tighter italic mb-0">{address.type}</h4>
                                 </div>
                                 {address.isDefault && (
                                    <div className="flex gap-1.5 items-center">
                                       <Badge className="bg-gradient-to-r from-orange-500 to-orange-700 text-white border-0 rounded-full px-6 py-2 text-[10px] font-black uppercase tracking-[0.25em] shadow-xl shadow-orange-200 italic">
                                          Primary Node Hub
                                       </Badge>
                                       <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                                    </div>
                                 )}
                              </div>
                              
                              <div className="space-y-6 pt-6 border-t border-orange-50">
                                 <div className="flex gap-5">
                                    <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-200 flex items-center justify-center flex-shrink-0 group-hover:card:text-orange-500 group-hover:card:bg-white ring-2 ring-transparent group-hover:card:ring-orange-100 transition-all">
                                       <MapPin className="w-5 h-5 flex-shrink-0" />
                                    </div>
                                    <div className="space-y-1">
                                       <p className="text-gray-800 font-black italic text-lg leading-tight group-hover:card:translate-x-2 transition-transform duration-500">{address.line1}</p>
                                       <p className="text-gray-400 font-bold uppercase tracking-[0.1em] text-[11px] italic">{address.city}, {address.pincode}</p>
                                    </div>
                                 </div>
                              </div>
                           </div>
                           
                           <div className="mt-14 pt-10 border-t-2 border-orange-50/50 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-y-6 group-hover:translate-y-0">
                              <div className="flex items-center gap-3">
                                 <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                 <span className="text-[10px] font-black text-orange-600 uppercase tracking-[0.4em] italic shadow-orange-50/50">Coordinates Verified</span>
                              </div>
                              <div className="flex gap-3">
                                 {[1, 2, 3].map(i => (
                                    <div key={i} className={cn("w-2 h-2 rounded-full", i === 1 ? "bg-orange-500" : i === 2 ? "bg-orange-300" : "bg-orange-100")} />
                                 ))}
                              </div>
                           </div>
                        </CardContent>
                     </Card>
                  </motion.div>
               );
            })}
         </AnimatePresence>
      </div>
    </div>
  );
}
