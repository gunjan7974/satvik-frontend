'use client';

import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "next/navigation";
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  Package, 
  Settings, 
  LogOut, 
  ChevronRight, 
  Camera, 
  Shield, 
  CreditCard,
  Bell,
  Heart,
  Loader2,
  Edit2,
  Award,
  Zap,
  Crown,
  History,
  Navigation
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function ProfilePage() {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const isAdmin = user?.role === 'admin';
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login?redirect=/profile");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#050505]">
        <div className="relative">
          <Loader2 className="h-16 w-16 animate-spin text-orange-500 opacity-20" />
          <Loader2 className="h-16 w-16 animate-spin text-amber-500 absolute top-0 left-0 [animation-duration:1.5s]" />
        </div>
        <p className="text-amber-500/50 font-black uppercase tracking-[0.5em] text-[10px] animate-pulse">Initializing Luxury Experience</p>
      </div>
    );
  }

  if (!user) return null;

  const menuItems = [
    { icon: Package, label: "My Orders", sub: "12 Cumulative Bookings", link: "/orders", color: "from-orange-500/20 to-orange-600/5", textColor: "text-orange-500", glow: "shadow-orange-500/20" },
    { icon: Heart, label: "Favorites", sub: "8 Saved Hand-picked Dishes", link: "#", color: "from-rose-500/20 to-rose-600/5", textColor: "text-rose-500", glow: "shadow-rose-500/20" },
    { icon: MapPin, label: "Addresses", sub: "3 Primary Locations Saved", link: "#", color: "from-emerald-500/20 to-emerald-600/5", textColor: "text-emerald-500", glow: "shadow-emerald-500/20" },
    { icon: CreditCard, label: "Payments", sub: "Mastercard •••• 4492", link: "#", color: "from-amber-500/20 to-amber-600/5", textColor: "text-amber-500", glow: "shadow-amber-500/20" },
    { icon: Bell, label: "Notifications", sub: "2 Unread Exclusive Perks", link: "#", color: "from-purple-500/20 to-purple-600/5", textColor: "text-purple-500", glow: "shadow-purple-500/20" },
    { icon: Shield, label: "Privacy", sub: "Biometric Security Active", link: "#", color: "from-blue-500/20 to-blue-600/5", textColor: "text-blue-500", glow: "shadow-blue-500/20" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-amber-500/30 selection:text-amber-200">
      {/* 🌌 Cinematic Background Element */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-600/5 rounded-full blur-[150px]"></div>
      </div>

      <div className="relative h-96 overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070')] bg-cover bg-center brightness-[0.3]"
        ></motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-[#050505]"></div>
        
        {/* Floating Abstract Shapes */}
        <div className="absolute top-20 left-1/4 w-32 h-32 border border-white/5 rounded-full rotate-45 opacity-20"></div>
        <div className="absolute top-40 right-1/3 w-20 h-20 border border-amber-500/10 rounded-lg -rotate-12 opacity-30"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-60 relative z-10 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* 🏷️ Side: Luxury Profile Summary */}
          <div className="lg:col-span-4 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Card className="bg-white/5 backdrop-blur-3xl border-white/10 rounded-[40px] overflow-hidden shadow-[0_30px_100px_-20px_rgba(0,0,0,0.8)] border-t-white/20">
                <CardContent className="p-10 flex flex-col items-center text-center">
                  <div className="relative mb-10 group">
                    {/* Animated Outer Ring */}
                    <div className="absolute -inset-4 bg-gradient-to-tr from-amber-600 via-orange-500 to-yellow-400 rounded-full opacity-20 group-hover:opacity-40 blur-xl transition-all duration-700 animate-spin-slow"></div>
                    
                    <Avatar className="w-40 h-40 border-[6px] border-[#121212] shadow-2xl relative z-10 ring-2 ring-amber-500/20">
                      <AvatarImage src={user.avatar || ""} className="object-cover" />
                      <AvatarFallback className="bg-gradient-to-br from-zinc-800 to-zinc-950 text-amber-500 text-5xl font-black italic">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute bottom-2 right-2 rounded-full bg-amber-500 text-black shadow-xl h-12 w-12 flex items-center justify-center border-[4px] border-[#121212] z-20 hover:bg-white transition-colors"
                    >
                      <Camera className="w-5 h-5 fill-current" />
                    </motion.button>
                  </div>

                  <div className="space-y-3 mb-10">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-center gap-3"
                    >
                      <h2 className="text-3xl font-black tracking-tight text-white font-serif italic">{user.name}</h2>
                      {isAdmin && (
                        <div className="p-1.5 bg-amber-500/10 rounded-lg border border-amber-500/20">
                          <Crown className="w-5 h-5 text-amber-500 fill-amber-500/50" />
                        </div>
                      )}
                    </motion.div>
                    <div className="flex flex-col items-center gap-2">
                      <Badge className="bg-amber-500 text-black border-0 rounded-full px-5 py-1.5 text-[10px] uppercase font-black tracking-[0.2em] shadow-[0_10px_20px_-5px_rgba(245,158,11,0.5)]">
                        {user.role} Member
                      </Badge>
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">ID: #SK-{user._id?.slice(-6).toUpperCase()}</span>
                    </div>
                  </div>

                  <div className="w-full space-y-5 text-sm font-medium text-zinc-400 border-t border-white/5 pt-10">
                    <div className="flex items-center gap-4 group cursor-pointer hover:text-white transition-colors justify-center md:justify-start px-4">
                      <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center group-hover:bg-amber-500/10 transition-colors">
                        <Mail className="w-4 h-4 text-zinc-600 group-hover:text-amber-500" />
                      </div>
                      <span className="truncate">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-4 group cursor-pointer hover:text-white transition-colors justify-center md:justify-start px-4">
                      <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors">
                        <Phone className="w-4 h-4 text-zinc-600 group-hover:text-emerald-500" />
                      </div>
                      <span>+91 {user.phone || '9644974442'}</span>
                    </div>
                  </div>

                  <Button 
                    onClick={logout}
                    variant="ghost" 
                    className="mt-12 w-full rounded-2xl text-zinc-500 hover:text-red-500 hover:bg-red-500/5 font-black uppercase text-[10px] tracking-[0.3em] h-14 border border-zinc-800/50"
                  >
                    <LogOut className="w-4 h-4 mr-3" /> Secure Logout
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* 💳 Membership Card Effect */}
            <motion.div
              initial={{ opacity: 0, rotateX: 20 }}
              animate={{ opacity: 1, rotateX: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
              style={{ perspective: "1000px" }}
            >
              <div className="group relative h-60 bg-gradient-to-br from-zinc-800 via-zinc-900 to-black rounded-[40px] p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] overflow-hidden border border-white/5 cursor-default">
                {/* Metallic Shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-amber-500/80">Sattvik Elite</p>
                      <h3 className="text-2xl font-serif italic text-white/90 font-bold">Platinum Rewards</h3>
                    </div>
                    <Crown className="w-8 h-8 text-amber-500 opacity-30" />
                  </div>
                  
                  <div className="space-y-4">
                     <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] items-end px-1">
                           <span className="text-zinc-500 font-bold uppercase tracking-widest">Next Tier Progress</span>
                           <span className="text-amber-500 font-black">75%</span>
                        </div>
                        <div className="h-2 w-full bg-black/40 rounded-full border border-white/5 overflow-hidden p-[2px]">
                           <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: "75%" }}
                            transition={{ duration: 1.5, delay: 1 }}
                            className="h-full bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.6)]"
                           />
                        </div>
                     </div>
                     <p className="text-[9px] text-zinc-500 font-bold text-center italic tracking-widest">Top 1% Preferred Gastronome</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* 🚀 Main: Interactive Luxury Hub */}
          <div className="lg:col-span-8 space-y-10">
            {/* Asset Balance & VIP Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
               <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-[35px] p-0.5 shadow-2xl shadow-orange-900/20"
               >
                  <div className="bg-[#0a0a0a] rounded-[33px] p-8 h-full relative overflow-hidden group">
                     {/* Floating Coins Effect */}
                     <Coins className="absolute -right-6 -bottom-6 w-32 h-32 text-amber-500 opacity-[0.03] rotate-12 group-hover:scale-110 group-hover:rotate-0 transition-transform duration-700" />
                     
                     <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500 mb-6">Loyalty Capital</p>
                        <div className="flex items-baseline gap-3 mb-2">
                           <h4 className="text-6xl font-black text-white tracking-tighter">1,250</h4>
                           <span className="text-amber-500 font-black text-lg italic tracking-widest">PTS</span>
                        </div>
                        <p className="text-xs text-zinc-500 font-medium leading-relaxed">Exchangeable for Gourmet Experiences & Exclusive Table Reservations.</p>
                        
                        <div className="flex gap-4 mt-8">
                           <Button className="flex-1 bg-amber-500 hover:bg-white text-black font-black uppercase tracking-widest text-[10px] h-12 rounded-xl transition-all shadow-[0_10px_20px_-5px_rgba(245,158,11,0.3)]">
                              Redeem <Zap className="ml-2 h-4 w-4 fill-current" />
                           </Button>
                           <Button variant="outline" className="flex-1 border-zinc-800 text-zinc-400 hover:text-white font-black uppercase text-[10px] tracking-widest h-12 rounded-xl bg-transparent">
                              History
                           </Button>
                        </div>
                     </div>
                  </div>
               </motion.div>

               <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-[#0a0a0a] border border-white/5 rounded-[35px] p-8 relative overflow-hidden"
               >
                 <div className="flex flex-col h-full justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 mb-6">Health Impact</p>
                        <div className="flex items-center gap-4">
                           <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                              <Zap className="w-8 h-8 text-emerald-500" />
                           </div>
                           <div>
                              <h4 className="text-3xl font-black text-white italic tracking-tight">85%</h4>
                              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Sattvik Diet Adherence</p>
                           </div>
                        </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                       <span className="text-xs font-bold text-zinc-400">Streak: <span className="text-white">12 Days</span></span>
                       <Badge variant="ghost" className="text-emerald-500 font-black tracking-widest text-[9px] uppercase">Peak Wellness</Badge>
                    </div>
                 </div>
               </motion.div>
            </div>

            {/* Privilege Directory */}
            <div className="space-y-8">
               <div className="flex items-center gap-6 px-2">
                  <h3 className="text-xs font-black uppercase tracking-[0.5em] text-zinc-600 whitespace-nowrap">Directory of Luxuries</h3>
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-zinc-800 to-transparent"></div>
               </div>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {menuItems.map((item, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ y: -8, scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * idx, type: "spring", stiffness: 300 }}
                    >
                      <Link href={item.link}>
                         <div className={`group p-10 rounded-[35px] bg-gradient-to-b from-[#0f0f0f] to-[#070707] border border-zinc-900 transition-all duration-500 flex flex-col gap-6 cursor-pointer relative overflow-hidden shadow-2xl hover:border-amber-500/30 ${item.glow}`}>
                            {/* Decorative Corner */}
                            <div className="absolute top-0 right-0 w-16 h-16 bg-white/[0.02] -mr-8 -mt-8 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                            
                            <div className="flex justify-between items-start">
                               <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${item.color} shadow-lg transition-all duration-500 group-hover:rotate-6 group-hover:scale-110`}>
                                  <item.icon className={`w-6 h-6 ${item.textColor}`} />
                               </div>
                               <ChevronRight className="w-5 h-5 text-zinc-800 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
                            </div>

                            <div className="space-y-1.5 mt-2">
                               <p className="font-black text-white tracking-tight uppercase group-hover:text-amber-500 transition-colors text-lg">{item.label}</p>
                               <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{item.sub}</p>
                            </div>
                         </div>
                      </Link>
                    </motion.div>
                  ))}
               </div>
            </div>

            {/* 🏰 VIP Lounge Note */}
            <motion.div 
               whileHover={{ scale: 1.02 }}
               className="bg-[#0c0c0c] border border-amber-500/10 rounded-[40px] p-10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none"></div>
                <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500 ring-8 ring-amber-500/5 flex-shrink-0 animate-pulse">
                    <Crown className="w-8 h-8 fill-current" />
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h4 className="text-xl font-black text-white uppercase tracking-widest mb-2 italic flex items-center gap-2 justify-center md:justify-start">
                       Sattvik Concierge <Navigation className="w-4 h-4 fill-amber-500 text-amber-500" />
                    </h4>
                    <p className="text-sm text-zinc-500 font-medium leading-relaxed max-w-xl">
                      Your dietary preferences are synchronized with our Head Chef's station across all branches. Enjoy a tailored culinary journey every time you walk in.
                    </p>
                </div>
                <Button className="bg-transparent border border-zinc-800 text-zinc-400 hover:text-white rounded-full px-8 h-12 text-[10px] font-black uppercase tracking-widest">
                  Preferences
                </Button>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Helper icons
function Coins(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="8" r="6" />
      <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
      <path d="M7 6h1v4" />
      <path d="m16.71 13.88.7.71-2.82 2.82" />
    </svg>
  );
}