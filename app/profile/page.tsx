"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/hooks/AuthContext";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { ProfileCover } from "@/components/profile/ProfileCover";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { IntroCard } from "@/components/profile/IntroCard";
import { ActivityFeed } from "@/components/profile/ActivityFeed";
import { PostBox } from "@/components/profile/PostBox";
import { ProfileSection } from "@/components/profile/ProfileSection";
import { AddressGrid } from "@/components/profile/AddressGrid";
import { SecuritySection } from "@/components/profile/SecuritySection";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, logout, isAuthenticated, loading, updateProfile } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login?redirect=/profile");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[#FFF3E9]">
        <div className="relative">
          <div className="absolute -inset-8 bg-orange-200/40 rounded-full blur-3xl animate-pulse" />
          <Loader2 className="h-16 w-16 animate-spin text-orange-600 relative z-10" />
        </div>
        <div className="text-center space-y-2">
            <h3 className="text-xl font-black text-orange-950 uppercase tracking-[0.2em] italic">Accessing Social Hub</h3>
            <p className="text-[10px] text-orange-700/60 font-bold uppercase tracking-[0.4em] animate-pulse italic">Synchronizing Gastronomic Terminal Node...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const handleUpdateProfile = async (data: any) => {
     try {
        await updateProfile?.(data);
        setIsEditing(false);
        toast.success("Identity Module Synchronized Successfully");
     } catch (error: any) {
        toast.error("Protocol Error: " + error.message);
        throw error;
     }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-12 px-6 md:px-20 max-w-7xl mx-auto pb-40">
             {/* 📉 LEFT SIDE (30%) - INTRO */}
             <div className="lg:col-span-4 space-y-12 lg:sticky lg:top-32 h-fit">
                <IntroCard user={user} />
             </div>

             {/* 📈 RIGHT SIDE (70%) - FEED */}
             <div className="lg:col-span-8 space-y-12">
                <PostBox user={user} />
                <ActivityFeed user={user} />
             </div>
          </div>
        );
      case "orders":
        return (
          <div className="max-w-4xl mx-auto py-24 px-8 text-center space-y-12">
             <div className="p-16 bg-white/60 backdrop-blur-3xl rounded-[4rem] border border-orange-50 shadow-2xl">
                <h2 className="text-5xl font-black text-gray-950 tracking-tighter uppercase italic leading-none mb-6">Archive Access Denied</h2>
                <p className="text-gray-400 font-medium max-w-lg mx-auto mb-12 text-lg italic leading-relaxed">
                   Requested Order Module is currently under maintenance. Tactical synchronization required for legacy data retrieval.
                </p>
                <button 
                  onClick={() => setActiveTab("profile")} 
                  className="px-12 h-14 bg-orange-600 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-2xl shadow-orange-100 hover:bg-orange-700 transition-all active:scale-95"
                >
                   Return to Social Hub
                </button>
             </div>
          </div>
        );
      case "addresses":
        return <div className="max-w-7xl mx-auto px-6 md:px-20 py-12"><AddressGrid /></div>;
      default:
        return (
          <div className="max-w-4xl mx-auto py-24 text-center">
             <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic shadow-sm mb-4">Module Integration Pending</h3>
             <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-[11px] italic">Requested Protocol: <strong>{activeTab}</strong> is being synthesized by gastro-command hub v2.0</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF3E9] selection:bg-orange-500 selection:text-white font-sans antialiased text-gray-900 pb-20">
      
      {/* 🖼️ PROFILE COVER SECTION */}
      <ProfileCover />

      <div className="max-w-screen-2xl mx-auto relative z-10">
        <AnimatePresence mode="wait">
           {isEditing ? (
              <motion.div
                 key="editing"
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.95 }}
                 className="fixed inset-0 z-50 bg-white md:bg-black/80 md:backdrop-blur-3xl flex flex-col md:p-10 lg:p-24 overflow-y-auto"
              >
                 <div className="max-w-5xl mx-auto w-full bg-white md:rounded-[4rem] p-10 md:p-24 shadow-none md:shadow-2xl relative shadow-orange-100/20">
                    <button 
                       onClick={() => setIsEditing(false)}
                       className="absolute top-10 right-10 w-20 h-20 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all shadow-xl shadow-orange-100 italic font-black uppercase text-[11px]"
                    >
                       Close_Hub
                    </button>
                    <h2 className="text-5xl font-black text-gray-950 uppercase italic tracking-tighter mb-16 underline underline-offset-[16px] decoration-orange-500/30">Node Configuration</h2>
                    <ProfileSection user={user} onUpdate={handleUpdateProfile} />
                 </div>
              </motion.div>
           ) : null}
        </AnimatePresence>

        {/* 👤 PROFILE HEADER (SOCIAL OVERLAP) */}
        <ProfileHeader 
          user={user} 
          onLogout={logout}
          onEdit={() => setIsEditing(true)}
        />

        {/* 📌 NAVIGATION TABS (STICKY) */}
        <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* 🧱 MAIN CONTENT (SOCIAL FEED/GRID) */}
        <main className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.8, ease: "anticipate" }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <footer className="mt-40 pt-20 border-t border-orange-100 flex flex-col md:flex-row justify-between items-center gap-12 px-6 md:px-20 max-w-7xl mx-auto">
         <div className="text-center md:text-left">
            <h4 className="text-3xl font-black text-gray-950 uppercase italic tracking-tighter mb-2 underline decoration-orange-500/40">Sattvika <span className="text-orange-600">Kaleva</span></h4>
            <p className="text-[11px] font-black uppercase tracking-[0.5em] text-gray-400 leading-none italic">Social Culinary Command Node v2.4.1</p>
         </div>
         <div className="flex gap-10">
            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest italic hover:text-orange-500 transition-colors cursor-pointer">Protocol Archive</span>
            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest italic hover:text-orange-500 transition-colors cursor-pointer">Security Ledger</span>
            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest italic hover:text-orange-500 transition-colors cursor-pointer">Hub Integrity</span>
         </div>
         <p className="text-[9px] font-bold text-gray-200 uppercase tracking-widest italic font-mono decoration-orange-100">© 2026 GASTRO-CORE GLOBAL HUB</p>
      </footer>
    </div>
  );
}