"use client";

import React, { useState } from "react";
import { User, Mail, Phone, Camera, Edit2, CheckCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { apiClient } from "@/lib/api";

interface ProfileSectionProps {
  user: any;
  onUpdate: (data: any) => Promise<void>;
}

export function ProfileSection({ user, onUpdate }: ProfileSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors, isDirty }, reset } = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    }
  });

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      await onUpdate(data);
      setIsEditing(false);
      reset(data);
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* 👤 TOP PROFILE CARD */}
      <Card className="rounded-[2rem] border-0 shadow-xl overflow-hidden bg-white group hover:shadow-2xl transition-all duration-500">
         <div className="h-24 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-400 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl -mr-16 -mt-16 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -ml-12 -mb-12" />
         </div>
         
         <CardContent className="p-8 -mt-20 relative z-10 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-6">
               <div className="relative group">
                  <div className="absolute -inset-1.5 bg-white rounded-full p-0.5 shadow-xl transition-all duration-500 group-hover:scale-105" />
                  <Avatar className="w-32 h-32 border-4 border-white shadow-2xl relative z-10 ring-4 ring-orange-50/50">
                    <AvatarImage src={user?.avatar || ""} className="object-cover" />
                    <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-600 text-white text-4xl font-bold italic">
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  
                  <button className="absolute bottom-1 right-1 w-10 h-10 bg-white shadow-2xl rounded-full flex items-center justify-center text-orange-600 border-4 border-white transition-all hover:scale-110 active:scale-95 group-hover:bg-orange-50 z-20">
                     <Camera className="w-4 h-4" />
                  </button>
               </div>
               
               <div className="flex-1 space-y-2 mt-4 md:mt-10 self-end">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                     <div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-1 uppercase">
                           {user?.name || "Guest Account"}
                        </h2>
                        <div className="flex items-center gap-2 text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                           <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
                           Premium Gastronomic Level
                        </div>
                     </div>
                     
                     <div className="flex gap-2">
                        {!isEditing && (
                           <Button 
                              onClick={() => setIsEditing(true)}
                              className="bg-orange-500 hover:bg-orange-600 text-white rounded-2xl px-6 py-6 font-bold shadow-lg shadow-orange-100 uppercase tracking-widest text-[10px]"
                           >
                              <Edit2 className="w-4 h-4 mr-2" /> Edit Profile Details
                           </Button>
                        )}
                     </div>
                  </div>
               </div>
            </div>
         </CardContent>
      </Card>

      {/* 📝 FORM / INFO SECTION */}
      <AnimatePresence mode="wait">
        {!isEditing ? (
          <motion.div
            key="display"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
             <Card className="rounded-[2.5rem] border-0 shadow-lg p-10 bg-white overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50/50 rounded-full blur-[100px] -mr-32 -mt-32 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10">
                   <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 mb-4">Official Identification</p>
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600">
                            <User className="w-5 h-5" />
                         </div>
                         <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Name</p>
                            <p className="font-bold text-gray-800 tracking-tight">{user?.name || "-"}</p>
                         </div>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 mb-4">Core Connectivity</p>
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600">
                            <Mail className="w-5 h-5" />
                         </div>
                         <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</p>
                            <p className="font-bold text-gray-800 tracking-tight">{user?.email || "-"}</p>
                         </div>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 mb-4">Registry Terminal</p>
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600">
                            <Phone className="w-5 h-5" />
                         </div>
                         <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone Frequency</p>
                            <p className="font-bold text-gray-800 tracking-tight">+91 {user?.phone || "-"}</p>
                         </div>
                      </div>
                   </div>
                </div>
             </Card>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
             <Card className="rounded-[2.5rem] border-0 shadow-lg p-10 bg-white">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="group space-y-4">
                         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">Legal Full Name</p>
                         <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-200 group-hover:text-orange-500 transition-colors">
                               <User className="w-5 h-5" />
                            </div>
                            <input 
                               {...register("name", { required: "Name is required" })}
                               className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-5 pl-14 pr-6 focus:ring-4 focus:ring-orange-100 focus:bg-white outline-none transition-all font-bold text-gray-800"
                               placeholder="e.g. Srijanali Sharma"
                            />
                            {errors.name && <p className="text-red-500 text-[10px] uppercase font-bold mt-2 ml-2 tracking-widest">{errors.name.message as string}</p>}
                         </div>
                      </div>

                      <div className="group space-y-4">
                         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">Secured Phone Terminal</p>
                         <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-200 group-hover:text-orange-500 transition-colors">
                               <Phone className="w-5 h-5" />
                            </div>
                            <input 
                               {...register("phone", { 
                                  required: "Phone is required",
                                  pattern: {
                                     value: /^[0-9]{10}$/,
                                     message: "Please enter a valid 10-digit number"
                                  }
                               })}
                               className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-5 pl-14 pr-6 focus:ring-4 focus:ring-orange-100 focus:bg-white outline-none transition-all font-bold text-gray-800"
                               placeholder="e.g. 9644974442"
                            />
                            {errors.phone && <p className="text-red-500 text-[10px] uppercase font-bold mt-2 ml-2 tracking-widest">{errors.phone.message as string}</p>}
                         </div>
                      </div>
                   </div>

                   <div className="group space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">Registry Email Node</p>
                      <div className="relative">
                         <div className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-200 group-hover:text-orange-500 transition-colors">
                            <Mail className="w-5 h-5" />
                         </div>
                         <input 
                            {...register("email", { 
                               required: "Email is required",
                               pattern: {
                                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                  message: "invalid email address"
                               }
                            })}
                            disabled
                            className="w-full bg-gray-100/50 border border-gray-100 rounded-2xl py-5 pl-14 pr-6 cursor-not-allowed opacity-70 font-bold text-gray-500"
                         />
                         <p className="text-[9px] text-gray-400 mt-2 ml-2 italic">Official email channel cannot be altered. Contact support for modification.</p>
                      </div>
                   </div>

                   <div className="flex gap-4 pt-6">
                      <Button 
                         type="submit"
                         disabled={loading || !isDirty}
                         className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-black uppercase text-[10px] tracking-[0.3em] h-16 rounded-2xl shadow-xl shadow-orange-100 relative group overflow-hidden"
                      >
                         <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                         {loading ? <span className="animate-spin mr-2">/</span> : <CheckCircle className="w-4 h-4 mr-2" />} 
                         Execute Identity Update
                      </Button>
                      <Button 
                         type="button"
                         onClick={handleCancel}
                         disabled={loading}
                         variant="outline"
                         className="flex-shrink-0 w-24 border-gray-100 rounded-2xl text-red-500 hover:bg-red-50 font-black h-16"
                      >
                         <X className="w-5 h-5" />
                      </Button>
                   </div>
                </form>
             </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
