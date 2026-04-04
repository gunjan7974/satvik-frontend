"use client";

import React, { useEffect, useState } from "react";
import { apiClient, Order } from "../../lib/api";
import { Loader2, Package, Clock, ChevronRight, MessageSquare, AlertCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent } from "../../components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "next/navigation";

export default function MyOrdersPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/orders");
      return;
    }
    fetchOrders();
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getOrders();
      // Handle both formats: response.data or response.orders
      const orderList = response.data || (response as any).orders;
      if (response.success && orderList) {
        setOrders(orderList);
      }
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-orange-600" />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* 🌟 Header Section */}
      <section className="bg-white border-b border-gray-100 py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
           <div className="space-y-2">
              <Badge className="bg-orange-100 text-orange-600 border-0 font-black px-4 py-1 text-[10px] uppercase tracking-widest">Order History</Badge>
              <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter">MY <span className="text-orange-600">ORDERS</span></h1>
              <p className="text-gray-500 font-medium">Manage and track all your previous orders from Sattvik Kaleva.</p>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="text-right">
                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Orders</p>
                 <p className="text-2xl font-black text-gray-900">{orders.length}</p>
              </div>
              <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-600/30">
                 <Package className="w-6 h-6 text-white" />
              </div>
           </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 mt-12">
        <AnimatePresence mode="popLayout">
          {orders.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {orders.map((order, index) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="h-full"
                >
                  <div className="relative h-full flex flex-col rounded-[3rem] border border-white/60 bg-white shadow-xl shadow-gray-200/30 overflow-hidden hover:shadow-2xl hover:shadow-orange-200/30 transition-all duration-500 group">
                    
                    {/* Premium Abstract Backgrounds */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-100/50 to-transparent rounded-full blur-3xl pointer-events-none group-hover:scale-110 group-hover:from-orange-200/50 transition-all duration-700"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-amber-100/40 to-transparent rounded-full blur-2xl pointer-events-none"></div>

                    <div className="p-0 relative z-10 flex-grow flex flex-col">
                       <div className="flex flex-col flex-grow divide-y divide-orange-900/5 h-full">
                          {/* Main Info */}
                          <div className="flex-1 p-6 flex flex-col">
                             <div className="flex flex-wrap justify-between items-start gap-4 mb-5">
                                <div>
                                   <div className="flex items-center gap-2 mb-1.5">
                                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                                      <p className="text-[10px] font-black text-orange-500/80 uppercase tracking-widest">Order #{order.orderNumber || order._id?.substring(0, 6)}</p>
                                   </div>
                                   <div className="flex flex-wrap items-center gap-3">
                                      <h3 className="text-xl font-black text-gray-900 tracking-tight">Sattvik Order</h3>
                                      <Badge variant="outline" className={`px-3 py-1 rounded-full font-bold uppercase text-[10px] backdrop-blur-md shadow-sm border-0 ${
                                        order.status?.toLowerCase() === 'delivered' ? 'bg-green-500/10 text-green-700' :
                                        order.status?.toLowerCase() === 'cancelled' ? 'bg-red-500/10 text-red-700' :
                                        'bg-orange-500/10 text-orange-700'
                                      }`}>
                                        {order.status}
                                      </Badge>
                                   </div>
                                </div>
                                <div className="text-right">
                                   <p className="text-2xl font-black text-gray-900 bg-clip-text text-transparent bg-gradient-to-br from-gray-900 to-gray-600">₹{order.totalPrice || order.total}</p>
                                   <p className="text-xs font-bold text-gray-400 mt-0.5">{new Date(order.createdAt!).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                </div>
                             </div>
                             
                              <div className="flex flex-wrap gap-2.5 mb-6 flex-grow">
                                {((order.orderItems || order.items || []) as any[]).slice(0, 4).map((item: any, i: number) => (
                                   <span key={i} className="text-xs font-bold text-gray-600 bg-gray-50/80 shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)] px-4 py-1.5 rounded-full border border-gray-100 backdrop-blur-md">
                                      <span className="text-orange-600 mr-1.5">{item.quantity}x</span> {item.title || item.food?.name}
                                   </span>
                                ))}
                                {((order.orderItems || order.items || []) as any[]).length > 4 && (
                                   <span className="text-xs font-bold text-orange-700 bg-orange-50/80 shadow-sm px-4 py-1.5 rounded-full border border-orange-100 backdrop-blur-md">
                                      +{((order.orderItems || order.items || []) as any[]).length - 4} more
                                   </span>
                                )}
                             </div>

                             <div className="flex items-center gap-6 pt-5 border-t border-gray-200/30">
                                <Link href="#" className="group/link flex items-center gap-2 text-gray-400 hover:text-orange-600 font-bold text-[11px] uppercase tracking-widest transition-colors">
                                   <MessageSquare className="w-4 h-4 group-hover/link:scale-110 transition-transform" /> Need Help?
                                </Link>
                                <Link href="#" className="group/link flex items-center gap-2 text-gray-400 hover:text-orange-600 font-bold text-[11px] uppercase tracking-widest transition-colors">
                                   <AlertCircle className="w-4 h-4 group-hover/link:scale-110 transition-transform" /> Report Issue
                                </Link>
                             </div>
                          </div>

                          {/* Action Side */}
                          <div className="bg-orange-50/30 px-6 pb-6 pt-4 flex flex-col sm:flex-row items-center gap-4 relative overflow-hidden mt-auto">
                             {/* Decorative subtle texture */}
                             <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
                             
                             <Button 
                                className="relative w-full sm:flex-1 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white rounded-full py-6 font-black text-[11px] uppercase tracking-widest shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all border border-orange-400/20 overflow-hidden"
                                onClick={() => {
                                   localStorage.setItem('completedOrder', JSON.stringify(order));
                                   router.push('/cart/checkout/confirmation/success/tracking');
                                }}
                             >
                                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
                                TRACK ORDER
                             </Button>
                             <Button 
                                variant="outline" 
                                className="w-full sm:flex-[0.7] border-gray-200/80 bg-white/60 backdrop-blur-md text-gray-700 hover:bg-white hover:border-gray-300 rounded-full py-6 font-black text-[11px] uppercase tracking-widest transition-all shadow-sm relative z-10"
                             >
                                ORDER DETAILS
                             </Button>
                          </div>
                       </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
             <div className="text-center py-40">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                   <Package className="w-16 h-16 text-gray-200" />
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight uppercase">No Orders Found</h3>
                <p className="text-gray-400 font-medium max-w-sm mx-auto mb-10">You haven't placed any orders yet. Start your culinary journey with Sattvik Kaleva today.</p>
                <Link href="/menu">
                   <Button className="bg-orange-600 hover:bg-orange-700 text-white px-12 py-8 rounded-3xl font-black uppercase tracking-widest shadow-2xl shadow-orange-600/30">
                      EXPLORE MENU
                   </Button>
                </Link>
             </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}