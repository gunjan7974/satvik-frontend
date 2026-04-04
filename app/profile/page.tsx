"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/AuthContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import {
  User, Mail, Phone, Edit2, LogOut, Camera, CheckCircle,
  X, Package, Star, CalendarCheck, Shield, MapPin, Heart,
  Settings, Bell, ChevronRight, Sparkles, Award, TrendingUp,
  Clock, ShoppingBag, Utensils, Gift, Crown, Zap
} from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { apiClient, Order } from "../../lib/api";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// ─── Floating Orb Background ───────────────────────────────────────────────
function FloatingOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)", top: "-100px", right: "-100px" }}
        animate={{ scale: [1, 1.3, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(234,88,12,0.08) 0%, transparent 70%)", bottom: "10%", left: "-100px" }}
        animate={{ scale: [1.2, 1, 1.2], rotate: [90, 0, 90] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(251,146,60,0.1) 0%, transparent 70%)", top: "40%", left: "40%" }}
        animate={{ scale: [1, 1.5, 1], x: [0, 50, 0], y: [0, -40, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

// ─── Stat Card ─────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.6, type: "spring", bounce: 0.5 }}
      whileHover={{ y: -8, scale: 1.05, rotate: 2 }}
      whileTap={{ scale: 0.95 }}
      className="relative group cursor-pointer"
    >
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
      <div className="relative bg-white/70 backdrop-blur-xl border border-white/80 rounded-3xl p-6 shadow-lg shadow-orange-100/30 group-hover:shadow-xl group-hover:shadow-orange-200/50 transition-all duration-300 flex flex-col items-center text-center">
        <motion.div 
          whileHover={{ rotate: 15, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${color} shadow-sm group-hover:shadow-md transition-shadow mx-auto`}
        >
          <Icon className="w-7 h-7" />
        </motion.div>
        <p className="text-4xl font-black text-gray-900 leading-none tracking-tight">{value}</p>
        <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mt-3">{label}</p>
      </div>
    </motion.div>
  );
}

// ─── Tab Button ────────────────────────────────────────────────────────────
function TabButton({ id, label, icon: Icon, activeTab, onClick }: any) {
  const isActive = activeTab === id;
  return (
    <button
      onClick={() => onClick(id)}
      className={`relative flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all duration-300 ${
        isActive ? "text-white" : "text-gray-500 hover:text-gray-900"
      }`}
    >
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg shadow-orange-200"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
      <Icon className="w-4 h-4 relative z-10" />
      <span className="relative z-10">{label}</span>
    </button>
  );
}

// ─── Edit Profile Modal ─────────────────────────────────────────────────────
function EditModal({ user, onUpdate, onClose }: any) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors, isDirty } } = useForm({
    defaultValues: { name: user?.name || "", phone: user?.phone || "" }
  });

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      await onUpdate(data);
      toast.success("Profile updated successfully! ✨");
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative h-24 bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 overflow-hidden">
          <motion.div
            className="absolute inset-0 opacity-30"
            style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, white 1px, transparent 1px)", backgroundSize: "30px 30px" }}
          />
          <div className="absolute inset-0 flex items-center justify-between px-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                <Edit2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg leading-none">Edit Profile</h2>
                <p className="text-white/70 text-xs mt-0.5">Update your information</p>
              </div>
            </div>
            <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-400" />
              <input
                {...register("name", { required: "Name is required" })}
                className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-300 rounded-xl py-3.5 pl-11 pr-4 outline-none transition-all font-semibold text-gray-800 placeholder-gray-300"
                placeholder="Enter your full name"
              />
            </div>
            {errors.name && <p className="text-red-500 text-xs font-semibold">{errors.name.message as string}</p>}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-400" />
              <input
                {...register("phone", {
                  required: "Phone is required",
                  pattern: { value: /^[0-9]{10}$/, message: "Enter a valid 10-digit number" }
                })}
                className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-300 rounded-xl py-3.5 pl-11 pr-4 outline-none transition-all font-semibold text-gray-800 placeholder-gray-300"
                placeholder="10-digit phone number"
              />
            </div>
            {errors.phone && <p className="text-red-500 text-xs font-semibold">{errors.phone.message as string}</p>}
          </div>

          {/* Email (disabled) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
              <input
                value={user?.email || ""}
                disabled
                className="w-full bg-gray-100 border-2 border-transparent rounded-xl py-3.5 pl-11 pr-4 text-gray-400 font-semibold cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-gray-400">Email cannot be changed. Contact support if needed.</p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-12 rounded-xl border-2 border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !isDirty}
              className="flex-1 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold shadow-lg shadow-orange-200 hover:shadow-orange-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}>
                  <Zap className="w-4 h-4" />
                </motion.div>
              ) : <CheckCircle className="w-4 h-4" />}
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ─── Info Row ───────────────────────────────────────────────────────────────
function InfoRow({ icon: Icon, label, value, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -40, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, type: "spring", bounce: 0.4 }}
      whileHover={{ scale: 1.02, x: 5 }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center gap-4 p-4 rounded-2xl hover:bg-orange-50/80 hover:shadow-lg hover:shadow-orange-100/50 transition-all group cursor-pointer"
    >
      <motion.div 
        whileHover={{ rotate: 10, scale: 1.1 }}
        className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-100 to-amber-50 flex items-center justify-center text-orange-500 flex-shrink-0 transition-transform shadow-sm group-hover:shadow-md"
      >
        <Icon className="w-5 h-5" />
      </motion.div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{label}</p>
        <p className="font-bold text-gray-800 truncate mt-0.5 text-lg">{value || "Not set"}</p>
      </div>
      <motion.div
        whileHover={{ x: 3 }}
      >
        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-orange-500 transition-colors" />
      </motion.div>
    </motion.div>
  );
}

// ─── Quick Action Card ──────────────────────────────────────────────────────
function QuickAction({ icon: Icon, label, color, delay, onClick }: any) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-100, 100], [20, -20]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-20, 20]), { stiffness: 300, damping: 30 });

  function handleMouseMove(event: React.MouseEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.5, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.5, type: "spring", bounce: 0.6 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      whileHover={{ y: -6, scale: 1.05 }}
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      className="relative flex flex-col items-center gap-3 p-5 rounded-3xl bg-white/70 backdrop-blur-md border border-white/80 shadow-md hover:shadow-xl transition-all overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent z-0 pointer-events-none" />
      <motion.div 
        whileHover={{ rotate: 15, translateZ: 20 }}
        className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color} shadow-sm group-hover:shadow-md transition-shadow relative z-10`}
      >
        <Icon className="w-6 h-6" />
      </motion.div>
      <span className="text-xs font-black text-gray-700 tracking-wide uppercase relative z-10 group-hover:text-orange-600 transition-colors">{label}</span>
      <div className="absolute inset-0 bg-gradient-to-t from-orange-100/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-0" />
    </motion.button>
  );
}

// ─── Main Profile Page ──────────────────────────────────────────────────────
export default function ProfilePage() {
  const { user, logout, isAuthenticated, loading, updateProfile } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [showEditModal, setShowEditModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.3]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.95]);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  const resolveAvatarUrl = (avatarPath: string | undefined) => {
    if (!avatarPath) return null;
    if (avatarPath.startsWith("http")) return avatarPath;
    const backendUrl = "http://localhost:5000";
    return `${backendUrl}${avatarPath.startsWith("/") ? "" : "/"}${avatarPath}`;
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type and size
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    try {
      setUploadingAvatar(true);
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await updateProfile(formData);
      if (res.success) {
        toast.success("Profile picture updated! ✨");
      } else {
        throw new Error(res.message || "Failed to update avatar");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong while uploading");
    } finally {
      setUploadingAvatar(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      setIsLoadingOrders(true);
      const response = await apiClient.getOrders();
      // Handle both formats: response.data or response.orders
      const orderList = response.data || (response as any).orders;
      if (response.success && orderList) {
        setOrders(orderList);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login?redirect=/profile");
    }
  }, [isAuthenticated, loading, router]);

  if (loading || !mounted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gradient-to-br from-orange-50 via-white to-amber-50">
        <div className="relative">
          <motion.div
            className="w-20 h-20 rounded-full border-4 border-orange-100"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            style={{ borderTopColor: "#f97316" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Utensils className="w-6 h-6 text-orange-50" />
          </div>
        </div>
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-sm font-semibold text-gray-400 uppercase tracking-widest"
        >
          Loading your profile...
        </motion.p>
      </div>
    );
  }

  if (!user) return null;

  const currentAvatarUrl = resolveAvatarUrl(user.avatar);

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const stats = [
    { icon: Package, label: "Total Orders", value: orders.length.toString(), color: "bg-orange-100 text-orange-600", delay: 0.1 },
    { icon: Star, label: "Reviews Given", value: "12", color: "bg-amber-100 text-amber-600", delay: 0.2 },
    { icon: CalendarCheck, label: "Event Bookings", value: "3", color: "bg-indigo-100 text-indigo-600", delay: 0.3 },
    { icon: Heart, label: "Favourites", value: "8", color: "bg-rose-100 text-rose-600", delay: 0.4 },
  ];

  const quickActions = [
    { icon: ShoppingBag, label: "My Orders", color: "bg-orange-100 text-orange-600", path: "/orders" },
    { icon: Utensils, label: "Menu", color: "bg-green-100 text-green-600", path: "/menu" },
    { icon: CalendarCheck, label: "Events", color: "bg-indigo-100 text-indigo-600", path: "/events" },
    { icon: Gift, label: "Rewards", color: "bg-rose-100 text-rose-600", path: "/rewards" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/80 via-white to-amber-50/50 relative">
      <FloatingOrbs />

      {/* Hidden File Input */}
      <input
        type="file"
        ref={avatarInputRef}
        onChange={handleAvatarChange}
        className="hidden"
        accept="image/*"
      />

      {/* ── Hero / Cover Section ── */}
      <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="relative h-72 md:h-80 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600" />
        {/* Pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }}
        />
        {/* Animated blobs */}
        <motion.div
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full bg-amber-300/20 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        {/* Top bar */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
          <motion.button
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            onClick={() => router.back()}
            className="h-10 px-4 rounded-xl bg-white/20 backdrop-blur text-white text-sm font-semibold flex items-center gap-2 hover:bg-white/30 transition-colors"
          >
            <ChevronRight className="w-4 h-4 rotate-180" /> Back
          </motion.button>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur text-white flex items-center justify-center hover:bg-white/30 transition-colors">
              <Bell className="w-4 h-4" />
            </button>
            <button
              onClick={logout}
              className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur text-white flex items-center justify-center hover:bg-red-500/60 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
        {/* Badge top-right */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          className="absolute top-16 right-8 hidden md:flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl px-4 py-2.5"
        >
          <Crown className="w-4 h-4 text-amber-200" />
          <span className="text-white text-xs font-bold uppercase tracking-widest">Premium Member</span>
        </motion.div>
      </motion.div>

      {/* ── Profile Content ── */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 -mt-24 pb-20">

        {/* ── Avatar + Name Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, type: "spring", bounce: 0.4 }}
          className="bg-white/80 backdrop-blur-2xl border border-white/80 rounded-[2.5rem] shadow-2xl shadow-orange-100/50 p-8 md:p-10 mb-6 relative overflow-hidden"
        >
          {/* Subtle shine effect */}
          <motion.div 
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 5 }}
            className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[-20deg]"
          />
          
          <div className="relative flex flex-col md:flex-row items-center gap-6 md:gap-10">
            {/* Avatar Section */}
            <div className="relative flex-shrink-0 z-10 flex justify-center items-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -inset-4 rounded-full bg-gradient-to-tr from-orange-500 to-amber-300 opacity-20 blur-2xl"
              />
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="relative w-32 h-32 md:w-40 md:h-40 aspect-square rounded-full border-[6px] border-white shadow-2xl overflow-hidden bg-gradient-to-br from-orange-500 to-orange-700 p-1.5 flex items-center justify-center"
              >
                <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-orange-400 to-orange-600 aspect-square">
                  {uploadingAvatar ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                      <Zap className="w-10 h-10 text-white" />
                    </motion.div>
                  ) : currentAvatarUrl ? (
                    <img src={currentAvatarUrl} alt={user.name} className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <span className="text-white text-5xl md:text-6xl font-black drop-shadow-lg leading-none">
                      {user.name?.charAt(0)?.toUpperCase()}
                    </span>
                  )}
                </div>
              </motion.div>
              {/* Camera Button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => avatarInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="absolute bottom-1 right-1 md:bottom-2 md:right-2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-xl flex items-center justify-center text-orange-600 border-2 border-orange-100 hover:bg-orange-600 hover:text-white transition-all z-20 disabled:opacity-50"
              >
                <Camera className="w-5 h-5 md:w-6 md:h-6" />
              </motion.button>
            </div>

            {/* User Info Section */}
            <div className="flex-1 text-center md:text-left z-10 w-full">
              <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 mb-3">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight"
                >
                  {user.name || "Guest User"}
                </motion.h1>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ delay: 0.4, type: "spring", bounce: 0.5 }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full shadow-lg shadow-green-100/50 backdrop-blur-md transition-all border border-white/40"
                  style={{ 
                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    color: "white", 
                    fontSize: "11px", 
                    fontWeight: "800",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.4)"
                  }}
                >
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shadow-inner">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                  <span>Verified User</span>
                </motion.div>
              </div>
              
              <div className="flex flex-col gap-1 md:gap-2">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                  className="text-gray-600 font-bold flex items-center justify-center md:justify-start gap-2 text-sm md:text-base"
                >
                  <Mail className="w-4 h-4 text-orange-400" />
                  {user.email}
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
                  className="text-gray-500 font-semibold flex items-center justify-center md:justify-start gap-2 text-xs md:text-sm"
                >
                  <Phone className="w-4 h-4 text-orange-400" />
                  {user.phone ? `+91 ${user.phone}` : "No phone added"}
                </motion.div>
              </div>
            </div>

            {/* Edit Button */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
              className="flex-shrink-0 mt-4 md:mt-0"
            >
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setShowEditModal(true)}
                className="relative flex items-center gap-2.5 overflow-hidden group"
                style={{ 
                  background: "linear-gradient(145deg, #ff8c38 0%, #f97316 40%, #ea580c 100%)",
                  color: "white",
                  fontWeight: "700",
                  fontSize: "14px",
                  letterSpacing: "0.025em",
                  borderRadius: "14px",
                  padding: "12px 24px",
                  border: "1px solid rgba(255,255,255,0.25)",
                  boxShadow: "0 4px 15px -3px rgba(234, 88, 12, 0.5), inset 0 1px 0 rgba(255,255,255,0.25)",
                  cursor: "pointer"
                }}
              >
                {/* Inner top highlight */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: '50%',
                  background: 'linear-gradient(to bottom, rgba(255,255,255,0.15), transparent)',
                  borderRadius: '14px 14px 0 0', pointerEvents: 'none'
                }} />
                {/* Hover sweep shine */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full transition-all duration-700 ease-in-out" />
                
                <Edit2 className="w-3.5 h-3.5 relative z-10" style={{ opacity: 0.95 }} />
                <span className="relative z-10">Edit Profile</span>
                <Sparkles className="w-3 h-3 relative z-10 opacity-75" />
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </div>

        {/* ── Tabs ── */}
        <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-[2rem] p-1.5 mb-6 flex gap-1 overflow-x-auto">
          {tabs.map(tab => (
            <TabButton key={tab.id} {...tab} activeTab={activeTab} onClick={setActiveTab} />
          ))}
        </div>

        {/* ── Tab Content ── */}
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Personal Info Card */}
              <div className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-3xl shadow-xl shadow-orange-100/20 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900">Personal Information</h2>
                    <p className="text-xs text-gray-400">Your personal details</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <InfoRow icon={User} label="Full Name" value={user.name} delay={0.1} />
                  <InfoRow icon={Mail} label="Email Address" value={user.email} delay={0.15} />
                  <InfoRow icon={Phone} label="Phone Number" value={(user as any).phone ? `+91 ${(user as any).phone}` : null} delay={0.2} />
                  <InfoRow icon={Shield} label="Account Role" value={(user as any).role ? (user as any).role.charAt(0).toUpperCase() + (user as any).role.slice(1) : "Customer"} delay={0.25} />
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-3xl shadow-xl shadow-orange-100/20 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900">Quick Actions</h2>
                    <p className="text-xs text-gray-400">Jump to your favorite sections</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {quickActions.map((action, i) => (
                    <QuickAction
                      key={i}
                      {...action}
                      delay={i * 0.08}
                      onClick={() => router.push(action.path)}
                    />
                  ))}
                </div>
              </div>

              {/* Membership Card */}
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }} 
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.4, type: "spring", bounce: 0.3 }}
                whileHover={{ scale: 1.01, rotate: -1 }}
                className="relative rounded-3xl overflow-hidden shadow-2xl shadow-orange-200/40"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600" />
                <div className="absolute inset-0 opacity-10"
                  style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "20px 20px" }}
                />
                <motion.div
                  className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/10 blur-2xl"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 6, repeat: Infinity }}
                />
                <div className="relative p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Crown className="w-5 h-5 text-amber-300" />
                      <span className="text-amber-200 text-xs font-bold uppercase tracking-widest">Premium Member</span>
                    </div>
                    <h3 className="text-2xl font-black text-white tracking-tight">Sattvik Kaleva</h3>
                    <p className="text-white/70 text-sm mt-1">Member since {new Date().getFullYear()}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-2xl font-black text-white">₹0</p>
                      <p className="text-white/60 text-xs font-semibold">Wallet Balance</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-black text-white">0</p>
                      <p className="text-white/60 text-xs font-semibold">Reward Points</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === "orders" && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              {isLoadingOrders ? (
                <div className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-3xl p-12 text-center">
                  <Loader2 className="w-10 h-10 animate-spin text-orange-600 mx-auto mb-4" />
                  <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading orders...</p>
                </div>
              ) : orders.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                  {orders.map((order, idx) => (
                    <motion.div
                      key={order._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="h-full"
                    >
                      <div className="h-full flex flex-col justify-between group relative bg-white/40 backdrop-blur-2xl border border-white/60 rounded-[3rem] p-5 shadow-xl shadow-gray-200/30 hover:shadow-2xl hover:shadow-orange-200/30 transition-all duration-500 overflow-hidden">
                        {/* Premium Abstract Backgrounds */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-100/50 to-transparent rounded-full blur-2xl pointer-events-none group-hover:scale-110 group-hover:from-orange-200/50 transition-all duration-700"></div>
                        
                        <div className="relative z-10 flex-grow flex flex-col gap-4">
                          <div className="flex items-start gap-3">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner mt-1 ${
                              order.status?.toLowerCase() === 'delivered' ? 'bg-gradient-to-br from-green-100 to-green-50 text-green-600 border border-green-200' :
                              order.status?.toLowerCase() === 'cancelled' ? 'bg-gradient-to-br from-red-100 to-red-50 text-red-600 border border-red-200' :
                              'bg-gradient-to-br from-orange-100 to-amber-50 text-orange-600 border border-orange-200'
                            }`}>
                              <Package className="w-6 h-6" />
                            </div>
                            <div className="flex-grow">
                              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                                 <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                                    <p className="text-[9px] font-black text-orange-500/80 uppercase tracking-widest">Order #{order.orderNumber || order._id?.substring(0, 6)}</p>
                                 </div>
                                 <Badge className={`px-2.5 py-0.5 rounded-full text-[8px] uppercase font-black border-0 backdrop-blur-md shadow-sm ${
                                   order.status?.toLowerCase() === 'delivered' ? 'bg-green-500/10 text-green-700' :
                                   order.status?.toLowerCase() === 'cancelled' ? 'bg-red-500/10 text-red-700' :
                                   'bg-orange-500/10 text-orange-700'
                                 }`}>
                                   {order.status}
                                 </Badge>
                              </div>
                              <h4 className="text-lg font-black text-gray-900 leading-tight mb-2 tracking-tight">Sattvik Order</h4>
                              
                              <div className="flex flex-wrap gap-1.5 mb-2">
                                  {((order.orderItems || order.items || []) as any[]).slice(0, 3).map((item: any, i: number) => (
                                     <span key={i} className="text-[10px] font-bold text-gray-600 bg-white/60 shadow-sm px-2.5 py-1 rounded-full border border-white/80 backdrop-blur-md">
                                        <span className="text-orange-600 mr-1">{item.quantity}x</span> {item.title || item.food?.name}
                                     </span>
                                  ))}
                              </div>
                            </div>
                          </div>
  
                          <div className="flex items-center justify-between gap-5 mt-auto pt-4 border-t border-orange-900/5">
                            <div>
                              <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-600 leading-none mb-1.5">₹{order.totalPrice || order.total}</p>
                              <p className="text-[10px] font-bold text-gray-400">{new Date(order.createdAt!).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                            </div>
                            
                            <Button 
                              className="relative overflow-hidden bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white rounded-full font-black text-[10px] uppercase tracking-widest px-8 py-4 shadow-md hover:shadow-lg hover:shadow-orange-500/30 transition-all border border-orange-400/20"
                              onClick={() => {
                                localStorage.setItem('completedOrder', JSON.stringify(order));
                                router.push('/cart/checkout/confirmation/success/tracking');
                              }}
                            >
                              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
                              Track
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-3xl shadow-xl shadow-orange-100/20 p-12 text-center">
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-6"
                  >
                    <Package className="w-9 h-9 text-orange-500" />
                  </motion.div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">No Orders Yet</h3>
                  <p className="text-gray-400 mb-8 max-w-sm mx-auto">Your order history will appear here. Start exploring our delicious menu!</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => router.push("/menu")}
                    className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold shadow-lg shadow-orange-200"
                  >
                    Browse Menu
                  </motion.button>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "addresses" && (
            <motion.div
              key="addresses"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-3xl shadow-xl shadow-orange-100/20 p-8 text-center">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-6"
                >
                  <MapPin className="w-9 h-9 text-indigo-500" />
                </motion.div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">No Addresses Saved</h3>
                <p className="text-gray-400 mb-8 max-w-sm mx-auto">Save your delivery addresses for faster checkout experience.</p>
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-bold shadow-lg shadow-indigo-200"
                >
                  + Add New Address
                </motion.button>
              </div>
            </motion.div>
          )}

          {activeTab === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              {[
                { icon: Edit2, label: "Edit Profile", desc: "Update your personal information", action: () => setShowEditModal(true), color: "bg-orange-100 text-orange-600" },
                { icon: Bell, label: "Notifications", desc: "Manage your notification preferences", action: () => {}, color: "bg-blue-100 text-blue-600" },
                { icon: Shield, label: "Security", desc: "Password and account security", action: () => {}, color: "bg-green-100 text-green-600" },
                { icon: LogOut, label: "Logout", desc: "Sign out of your account", action: logout, color: "bg-rose-100 text-rose-600" },
              ].map((item, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ x: 4 }}
                  onClick={item.action}
                  className="w-full flex items-center gap-4 p-5 bg-white/70 backdrop-blur-xl border border-white/80 rounded-2xl shadow-sm hover:shadow-md text-left transition-all group"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-400">{item.desc}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 flex-shrink-0 transition-colors" />
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Edit Modal ── */}
      <AnimatePresence>
        {showEditModal && (
          <EditModal
            user={user}
            onUpdate={updateProfile}
            onClose={() => setShowEditModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}