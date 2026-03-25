"use client";

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
  Edit2
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function ProfilePage() {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login?redirect=/profile");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-orange-600" />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Loading your world...</p>
      </div>
    );
  }

  if (!user) return null;

  const menuItems = [
    { icon: Package, label: "My Orders", sub: "Track & manage orders", link: "/orders", color: "bg-orange-100 text-orange-600" },
    { icon: Heart, label: "Wishlist", sub: "Saved items", link: "#", color: "bg-red-100 text-red-600" },
    { icon: MapPin, label: "Addresses", sub: "Manage delivery locations", link: "#", color: "bg-blue-100 text-blue-600" },
    { icon: CreditCard, label: "Payments", sub: "Save cards & wallets", link: "#", color: "bg-green-100 text-green-600" },
    { icon: Bell, label: "Notifications", sub: "Offers & updates", link: "#", color: "bg-purple-100 text-purple-600" },
    { icon: Shield, label: "Privacy", sub: "Privacy & security", link: "#", color: "bg-gray-100 text-gray-600" },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* 🌟 Profile Header Background */}
      <div className="h-64 bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 relative overflow-hidden">
         <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
         <div className="absolute -bottom-24 -left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-32 relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
        >
          {/* 👤 User Basic Info Card */}
          <Card className="rounded-[2.5rem] border-0 shadow-2xl shadow-gray-200/50 overflow-hidden mb-8">
            <CardContent className="p-8 md:p-12">
               <div className="flex flex-col md:flex-row items-center gap-10">
                  <div className="relative group">
                     <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-white shadow-xl ring-4 ring-orange-50">
                        <AvatarImage src={user.avatar || ""} />
                        <AvatarFallback className="bg-orange-600 text-white text-4xl font-black">
                           {user.name.charAt(0)}
                        </AvatarFallback>
                     </Avatar>
                     <Button size="icon" className="absolute bottom-2 right-2 rounded-full bg-white text-gray-900 shadow-lg border border-gray-100 hover:bg-gray-50">
                        <Camera className="w-4 h-4" />
                     </Button>
                  </div>

                  <div className="flex-1 text-center md:text-left space-y-4">
                     <div className="space-y-1">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                           <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight uppercase">{user.name}</h1>
                           <Badge className="bg-orange-100 text-orange-600 border-0 font-black px-3 py-1 text-[10px] uppercase tracking-widest">{user.role}</Badge>
                        </div>
                        <p className="text-gray-500 font-medium">Lover of Sattvik Delicacies since {new Date(user.createdAt!).getFullYear()}</p>
                     </div>

                     <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm font-bold">
                        <div className="flex items-center gap-2 text-gray-400 bg-gray-50 px-4 py-2 rounded-2xl">
                           <Mail className="w-4 h-4" /> <span>{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 bg-gray-50 px-4 py-2 rounded-2xl">
                           <Phone className="w-4 h-4" /> <span>{user.vendorId ? "Vendor Contact" : "+91 9644974442"}</span>
                        </div>
                     </div>
                  </div>

                  <div className="shrink-0 flex gap-2">
                     <Button onClick={() => setIsEditing(!isEditing)} variant="outline" className="rounded-2xl border-gray-200 font-bold px-6 h-12 shadow-sm">
                        <Edit2 className="w-4 h-4 mr-2" /> {isEditing ? "Save" : "Edit"}
                     </Button>
                     <Button onClick={logout} variant="ghost" className="rounded-2xl text-red-500 hover:bg-red-50 font-bold px-4 h-12">
                        <LogOut className="w-5 h-5" />
                     </Button>
                  </div>
               </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
             {/* 🛠️ Settings & Quick Links */}
             <div className="md:col-span-8 space-y-6">
                <Card className="rounded-[2.5rem] border-0 shadow-xl shadow-gray-100 p-6 md:p-10">
                   <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest mb-8">Personal Hub</h3>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {menuItems.map((item, idx) => (
                         <Link href={item.link} key={idx} className="group">
                           <div className="p-6 rounded-3xl bg-white border border-gray-100 hover:border-orange-100 hover:bg-orange-50/30 transition-all duration-300 flex items-center gap-5">
                              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.color} shadow-sm group-hover:scale-110 transition-transform`}>
                                 <item.icon className="w-6 h-6" />
                              </div>
                              <div className="flex-1 min-w-0">
                                 <p className="font-black text-gray-900 tracking-tight text-sm uppercase">{item.label}</p>
                                 <p className="text-xs text-gray-400 font-medium truncate">{item.sub}</p>
                              </div>
                              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:translate-x-1 transition-transform" />
                           </div>
                         </Link>
                      ))}
                   </div>
                </Card>
             </div>

             {/* 🎖️ Badges & Points */}
             <div className="md:col-span-4 space-y-6">
                <Card className="rounded-[2.5rem] border-0 shadow-xl shadow-gray-100 bg-gray-900 text-white p-8 overflow-hidden relative">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600 rounded-full blur-[80px] -mr-16 -mt-16 opacity-50"></div>
                   <div className="relative z-10">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-orange-400">Total Coins</p>
                      <h2 className="text-5xl font-black mb-6">1,250</h2>
                      <div className="space-y-4">
                         <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="w-3/4 h-full bg-orange-500 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.5)]"></div>
                         </div>
                         <p className="text-xs font-medium text-gray-400">750 points to Silver tier</p>
                      </div>
                      <Button className="w-full mt-8 bg-white/10 hover:bg-white/20 text-white border-0 py-6 rounded-2xl font-black uppercase tracking-widest text-xs">
                         Redeem Now
                      </Button>
                   </div>
                </Card>

                <Card className="rounded-[2.5rem] border-0 shadow-xl shadow-gray-100 p-8">
                   <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-6">Account Type</h3>
                   <div className="flex items-center gap-4 p-4 rounded-3xl bg-green-50 border border-green-100">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                         <Shield className="w-5 h-5" />
                      </div>
                      <div>
                         <p className="text-sm font-black text-green-900 uppercase italic">Verified</p>
                         <p className="text-[10px] text-green-700/60 font-medium">Safe & Secure Account</p>
                      </div>
                   </div>
                </Card>
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}