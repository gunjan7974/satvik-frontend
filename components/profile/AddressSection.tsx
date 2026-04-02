"use client";

import React, { useState } from "react";
import { MapPin, Plus, Edit2, Trash2, Home, Briefcase, Globe, MoreVertical, CheckCircle } from "lucide-react";
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

export function AddressSection() {
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
    toast.success("Address removed successfully");
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'home': return Home;
      case 'work': return Briefcase;
      default: return Globe;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div className="space-y-1">
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">Secured Grid Terminal</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Saved delivery coordinates for rapid deployment</p>
         </div>
         
         <Button className="bg-orange-600 hover:bg-orange-700 text-white rounded-2xl px-8 h-16 font-black uppercase text-[10px] tracking-[0.3em] shadow-xl shadow-orange-100 group transition-all duration-300 active:scale-95">
            <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-500" /> 
            Establish New Coordinate
         </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <AnimatePresence mode="popLayout">
            {addresses.map((address) => {
               const Icon = getTypeIcon(address.type);
               return (
                  <motion.div
                    key={address.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative group h-full"
                  >
                     <Card className="h-full rounded-[2.5rem] border-2 border-transparent hover:border-orange-500/20 bg-white shadow-xl shadow-gray-100 hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-default group">
                        <CardContent className="p-8 relative z-10 flex flex-col h-full bg-white group-hover:bg-orange-50/10 transition-colors">
                           <div className="flex justify-between items-start mb-6">
                              <div className="flex items-center gap-4">
                                 <div className="w-14 h-14 rounded-2xl bg-orange-600 text-white flex items-center justify-center shadow-lg shadow-orange-200 group-hover:rotate-6 transition-transform">
                                    <Icon className="w-6 h-6" />
                                 </div>
                                 <div>
                                    <h4 className="font-black text-gray-900 text-lg uppercase tracking-tight">{address.type}</h4>
                                    {address.isDefault && (
                                       <Badge className="bg-green-100 text-green-600 border-0 rounded-full px-3 py-0.5 text-[8px] font-black uppercase tracking-widest mt-1">
                                          PRIMARY HUB
                                       </Badge>
                                    )}
                                 </div>
                              </div>
                              
                              <DropdownMenu>
                                 <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-orange-100 text-gray-400">
                                       <MoreVertical className="w-5 h-5" />
                                    </Button>
                                 </DropdownMenuTrigger>
                                 <DropdownMenuContent align="end" className="rounded-2xl border-orange-50 p-2 shadow-xl bg-white min-w-[150px]">
                                    <DropdownMenuItem className="rounded-xl flex items-center gap-3 p-3 font-bold text-gray-600 cursor-pointer hover:bg-orange-50 hover:text-orange-600 outline-none">
                                       <Edit2 className="w-4 h-4" /> Edit Details
                                    </DropdownMenuItem>
                                    {!address.isDefault && (
                                       <DropdownMenuItem className="rounded-xl flex items-center gap-3 p-3 font-bold text-orange-600 cursor-pointer hover:bg-orange-100 outline-none">
                                          <CheckCircle className="w-4 h-4" /> Set as Primary
                                       </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem 
                                       onClick={() => handleDelete(address.id)}
                                       className="rounded-xl flex items-center gap-3 p-3 font-bold text-red-500 cursor-pointer hover:bg-red-50 outline-none"
                                    >
                                       <Trash2 className="w-4 h-4" /> Remove Hub
                                    </DropdownMenuItem>
                                 </DropdownMenuContent>
                              </DropdownMenu>
                           </div>
                           
                           <div className="flex-1 space-y-4">
                              <div className="flex gap-4">
                                 <MapPin className="w-5 h-5 text-orange-200 group-hover:text-orange-500 flex-shrink-0" />
                                 <div>
                                    <p className="text-gray-700 font-bold leading-relaxed">{address.line1}</p>
                                    <p className="text-gray-400 font-medium text-sm">{address.city}, {address.pincode}</p>
                                    {address.landmark && (
                                       <p className="text-orange-900/40 text-[10px] font-black uppercase tracking-widest mt-2 bg-orange-50 w-fit px-3 py-1 rounded-lg italic">
                                          REF: {address.landmark}
                                       </p>
                                    )}
                                 </div>
                              </div>
                           </div>
                           
                           <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                              <span className="text-[10px] font-black text-orange-500/60 uppercase tracking-[0.2em] italic">Precision Coordinates Ready</span>
                              <div className="flex gap-1">
                                 <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                 <div className="w-1.5 h-1.5 rounded-full bg-orange-500 opacity-40" />
                                 <div className="w-1.5 h-1.5 rounded-full bg-orange-500 opacity-20" />
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
