"use client";

import React, { useState } from "react";
import { Lock, ShieldCheck, CheckCircle, RefreshCcw, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function SecuritySection() {
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("Security coordinates updated successfully");
      reset();
    } catch (error: any) {
      toast.error("Security Breach: Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const password = watch("newPassword");

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="space-y-1">
         <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">Encryption Console</h2>
         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Manage your digital credentials and secure access nodes</p>
      </div>

      <Card className="rounded-[2.5rem] border-0 shadow-lg p-10 bg-white relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50/30 rounded-full blur-[100px] -mr-32 -mt-32" />
         
         <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 relative z-10">
            <div className="grid grid-cols-1 gap-8 max-w-2xl">
               <div className="group space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">Current Authorization Key</p>
                  <div className="relative">
                     <div className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-200 group-hover:text-orange-500 transition-colors">
                        <Lock className="w-5 h-5" />
                     </div>
                     <input 
                        type={showPass ? "text" : "password"}
                        {...register("currentPassword", { required: "Current password is required" })}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-5 pl-14 pr-12 focus:ring-4 focus:ring-orange-100 focus:bg-white outline-none transition-all font-bold text-gray-800"
                        placeholder="••••••••••••"
                     />
                     <button 
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-600 transition-colors"
                     >
                        {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                     </button>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="group space-y-4">
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">New Protocol Key</p>
                     <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-200">
                           <ShieldCheck className="w-5 h-5" />
                        </div>
                        <input 
                           type="password"
                           {...register("newPassword", { 
                              required: "New password is required",
                              minLength: { value: 8, message: "Key strength must be 8+ symbols" }
                           })}
                           className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-5 pl-14 pr-6 focus:ring-4 focus:ring-orange-100 focus:bg-white outline-none transition-all font-bold text-gray-800"
                        />
                        {errors.newPassword && <p className="text-red-500 text-[10px] uppercase font-bold mt-2 ml-2">{errors.newPassword.message as string}</p>}
                     </div>
                  </div>

                  <div className="group space-y-4">
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">Confirm Protocol Key</p>
                     <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-200">
                           <CheckCircle className="w-5 h-5" />
                        </div>
                        <input 
                           type="password"
                           {...register("confirmPassword", { 
                              required: "Please confirm your key",
                              validate: (val) => val === password || "Keys do not match"
                           })}
                           className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-5 pl-14 pr-6 focus:ring-4 focus:ring-orange-100 focus:bg-white outline-none transition-all font-bold text-gray-800"
                        />
                        {errors.confirmPassword && <p className="text-red-500 text-[10px] uppercase font-bold mt-2 ml-2">{errors.confirmPassword.message as string}</p>}
                     </div>
                  </div>
               </div>
            </div>

            <div className="pt-6 border-t border-gray-50 max-w-2xl">
               <Button 
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto min-w-[250px] bg-gray-900 hover:bg-black text-white font-black uppercase text-[10px] tracking-[0.3em] h-16 rounded-2xl shadow-xl transition-all active:scale-95 group"
               >
                  {loading ? <RefreshCcw className="w-4 h-4 mr-2 animate-spin" /> : <ShieldCheck className="w-4 h-4 mr-2" />} 
                  Rotate Encryption Key
               </Button>
               <p className="text-[9px] text-gray-400 mt-4 font-medium italic">Rotating your key will terminate all legacy sessions across other gastro-terminals.</p>
            </div>
         </form>
      </Card>
    </div>
  );
}
