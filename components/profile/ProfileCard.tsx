"use client";

import React, { useState } from "react";
import { User, Mail, Phone, Camera, Check, X, ShieldCheck, Sparkles, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { cn } from "@/components/ui/utils";

interface EditableFieldProps {
  label: string;
  icon: any;
  name: string;
  register: any;
  error?: string;
  isEditing: boolean;
  value?: string;
  disabled?: boolean;
}

function EditableField({ label, icon: Icon, name, register, error, isEditing, value, disabled }: EditableFieldProps) {
  return (
    <div className="relative space-y-3 group">
      {/* Visual Indicator of Focus */}
      <AnimatePresence>
         {isEditing && (
            <motion.div 
               initial={{ width: 0 }}
               animate={{ width: "100%" }}
               className="absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-orange-400 to-transparent"
            />
         )}
      </AnimatePresence>

      <div className={cn(
        "relative flex items-center transition-all duration-700 rounded-[2.5rem] overflow-hidden group/input",
        isEditing 
          ? "bg-white border-2 border-orange-200/50 p-2 pr-8 shadow-[0_20px_40px_-10px_rgba(255,107,0,0.1)] focus-within:border-orange-500 focus-within:ring-8 focus-within:ring-orange-50/50" 
          : "bg-gray-100/50 border-2 border-transparent p-6 hover:bg-orange-50/30"
      )}>
        <div className={cn(
          "flex items-center justify-center rounded-[1.8rem] transition-all duration-700 p-4",
          isEditing ? "bg-orange-600 text-white shadow-lg shadow-orange-200 rotate-3" : "bg-white text-orange-200 group-hover/input:text-orange-500 group-hover/input:rotate-12"
        )}>
          <Icon className="w-6 h-6 flex-shrink-0" />
        </div>
        
        <div className="flex-1 px-6 relative">
          <p className={cn(
            "text-[9px] font-black uppercase tracking-[0.4em] transition-all duration-500 italic",
            isEditing ? "text-orange-600 mb-1.5" : "text-gray-400 mb-1"
          )}>
            {label}
          </p>
          
          {isEditing ? (
            <input 
              {...register(name)}
              disabled={disabled}
              className={cn(
                "w-full bg-transparent outline-none font-black text-gray-950 text-xl tracking-tighter italic leading-none p-0 selection:bg-orange-500 selection:text-white",
                disabled && "opacity-40"
              )}
              placeholder={`Register your new ${label.toLowerCase()}...`}
            />
          ) : (
             <p className="font-black text-gray-950 text-xl tracking-tighter uppercase italic leading-none transition-all group-hover/input:translate-x-2">
                {value || "NOT_SET"}
             </p>
          )}
        </div>

        {error && isEditing && (
           <div className="absolute top-1/2 -translate-y-1/2 right-6 text-red-500 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              <p className="text-[9px] font-bold uppercase tracking-widest">{error}</p>
           </div>
        )}
      </div>
    </div>
  );
}

interface ProfileCardProps {
  user: any;
  onUpdate: (data: any) => Promise<void>;
  isEditing: boolean;
  onCancel: () => void;
}

export function ProfileCard({ user, onUpdate, isEditing, onCancel }: ProfileCardProps) {
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
      toast.success("Synchronicity successfully established");
      reset(data);
    } catch (error: any) {
      toast.error(error.message || "Protocol rejection detected");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12">
      <Card className="rounded-[4.5rem] border-0 shadow-[0_50px_100px_-20px_rgba(255,107,0,0.15)] relative overflow-hidden bg-white/60 backdrop-blur-[40px] group border-4 border-white/80">
         {/* Colorful energy flares */}
         <div className="absolute top-0 right-0 w-96 h-96 bg-orange-400/20 rounded-full blur-[100px] -mr-48 -mt-48 transition-all group-hover:bg-orange-400/30 duration-1000" />
         <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-400/10 rounded-full blur-[120px] -ml-40 -mb-40 transition-all group-hover:bg-red-400/20 duration-1000" />
         
         <CardContent className="p-12 md:p-24 relative z-10 flex flex-col items-center">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-16">
               <div className="flex flex-col items-center relative">
                  {/* Decorative Halo */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none">
                     <div className="w-[300px] h-[300px] border-4 border-dashed border-orange-200/50 rounded-full animate-spin-slow" />
                  </div>

                  <div className="relative group/avatar cursor-pointer">
                     <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="relative z-10"
                     >
                        <div className="absolute -inset-6 bg-gradient-to-tr from-orange-500 to-red-600 rounded-full blur-2xl opacity-10 group-hover/avatar:opacity-40 transition-all duration-1000" />
                        <Avatar className="w-56 h-56 md:w-64 md:h-64 border-[16px] border-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)] relative z-10 bg-white ring-4 ring-orange-100">
                           <AvatarImage src={user?.avatar} className="object-cover" />
                           <AvatarFallback className="bg-gradient-to-br from-orange-500 via-orange-600 to-red-700 text-white font-black text-7xl uppercase italic tracking-tighter">
                             {user?.name?.charAt(0)}
                           </AvatarFallback>
                        </Avatar>
                     </motion.div>
                     
                     <button type="button" className="absolute bottom-4 right-4 w-16 h-16 bg-white rounded-full shadow-2xl flex items-center justify-center text-orange-600 hover:text-white hover:bg-orange-600 transition-all active:scale-90 z-20 border-[6px] border-white group/cam">
                        <Camera className="w-6 h-6 group-hover/cam:scale-125 transition-transform" />
                     </button>
                  </div>
                  
                  <div className="mt-12 text-center flex flex-col items-center">
                     <div className="flex items-center gap-3 px-6 py-2 bg-gradient-to-r from-orange-50 to-amber-50 rounded-full border border-orange-100/50 mb-6 group-hover:scale-110 transition-transform">
                        <Sparkles className="w-3.5 h-3.5 text-orange-500 fill-current" />
                        <p className="text-[10px] font-black italic text-orange-600 uppercase tracking-[0.4em]">Secure Gastronomic Identity</p>
                     </div>
                     <h3 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter italic uppercase leading-none">{user?.name}</h3>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 px-4">
                  <EditableField 
                    label="Official Designation" 
                    icon={User}
                    name="name" 
                    register={register} 
                    error={errors.name?.message as string}
                    isEditing={isEditing}
                    value={user?.name}
                  />

                  <EditableField 
                    label="Communication Frequency" 
                    icon={Phone}
                    name="phone" 
                    register={register} 
                    error={errors.phone?.message as string}
                    isEditing={isEditing}
                    value={user?.phone ? `+91 ${user.phone}` : "SET_FREQUENCY"}
                  />

                  <div className="md:col-span-2">
                    <EditableField 
                      label="Registry Email Terminal" 
                      icon={Mail}
                      name="email" 
                      register={register} 
                      error={errors.email?.message as string}
                      isEditing={isEditing}
                      value={user?.email}
                      disabled={true}
                    />
                  </div>
               </div>

               <AnimatePresence>
                 {isEditing && (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex flex-col md:flex-row gap-8 pt-12 border-t-2 border-orange-50/50"
                    >
                       <Button 
                          type="submit"
                          disabled={loading || !isDirty}
                          className="flex-1 bg-gradient-to-r from-orange-600 via-orange-700 to-red-700 h-24 rounded-[3rem] text-white font-black uppercase text-[12px] tracking-[0.5em] shadow-[0_32px_64px_-16px_rgba(255,107,0,0.3)] transition-all active:scale-95 group overflow-hidden relative"
                       >
                          <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                          <span className="relative z-10 flex items-center justify-center">
                             {loading ? <span className="animate-spin mr-4 text-white">/</span> : <Check className="w-6 h-6 mr-4" />} 
                             Synchronize Protocol Changes
                          </span>
                       </Button>
                       <Button 
                          type="button"
                          onClick={() => { onCancel(); reset(); }}
                          disabled={loading}
                          variant="outline"
                          className="md:w-1/3 h-24 rounded-[3rem] border-4 border-gray-100 text-rose-500 hover:bg-rose-50 font-black uppercase text-[12px] tracking-[0.5em] transition-all italic"
                       >
                          <X className="w-6 h-6 mr-4" /> Cancel_Abort
                       </Button>
                    </motion.div>
                 )}
               </AnimatePresence>
               
               {!isEditing && (
                  <div className="flex flex-col items-center gap-6 pt-12 border-t-2 border-orange-50/50 group-hover:translate-y-2 transition-transform duration-700">
                     <div className="flex items-center gap-4 bg-orange-50/30 px-8 py-3 rounded-full border border-orange-100/50">
                        <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-200">
                           <ShieldCheck className="w-5 h-5 fill-current" />
                        </div>
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-700 italic leading-none mb-1">Channel Secured</p>
                           <p className="text-[10px] font-bold text-gray-400 capitalize">Your profile node is fully encrypted & verified</p>
                        </div>
                     </div>
                  </div>
               )}
            </form>
         </CardContent>
      </Card>
    </div>
  );
}
