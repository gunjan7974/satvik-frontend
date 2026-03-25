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
      if (response.success && response.data) {
        setOrders(response.data);
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
            <div className="space-y-6">
              {orders.map((order, index) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="rounded-[2rem] border-0 shadow-xl shadow-gray-200/50 overflow-hidden hover:shadow-2xl hover:shadow-gray-200 transition-all duration-500 group">
                    <CardContent className="p-0">
                       <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-50">
                          {/* Main Info */}
                          <div className="flex-1 p-8">
                             <div className="flex justify-between items-start mb-6">
                                <div>
                                   <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Order #{order.orderNumber}</p>
                                   <div className="flex items-center gap-3">
                                      <h3 className="text-xl font-black text-gray-900 tracking-tight">Sattvik Meal Case</h3>
                                      <Badge variant="outline" className={`px-4 py-1.5 rounded-full font-bold uppercase text-[10px] ${
                                        order.status === 'delivered' ? 'bg-green-50 text-green-600 border-green-200' :
                                        order.status === 'cancelled' ? 'bg-red-50 text-red-600 border-red-200' :
                                        'bg-orange-50 text-orange-600 border-orange-200 animate-pulse'
                                      }`}>
                                        {order.status}
                                      </Badge>
                                   </div>
                                </div>
                                <div className="text-right">
                                   <p className="text-2xl font-black text-gray-900">₹{order.total}</p>
                                   <p className="text-xs font-bold text-gray-400">{new Date(order.createdAt!).toLocaleDateString()}</p>
                                </div>
                             </div>
                             
                             <div className="flex flex-wrap gap-2 mb-6">
                                {order.items.slice(0, 3).map((item, i) => (
                                   <span key={i} className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                                      {item.quantity}x {item.title}
                                   </span>
                                ))}
                                {order.items.length > 3 && (
                                   <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                                      +{order.items.length - 3} more
                                   </span>
                                )}
                             </div>

                             <div className="flex items-center gap-6 pt-6 border-t border-gray-50">
                                <Link href="#" className="flex items-center gap-2 text-gray-400 hover:text-orange-600 font-bold text-xs uppercase tracking-widest transition-colors">
                                   <MessageSquare className="w-4 h-4" /> Need Help?
                                </Link>
                                <Link href="#" className="flex items-center gap-2 text-gray-400 hover:text-orange-600 font-bold text-xs uppercase tracking-widest transition-colors">
                                   <AlertCircle className="w-4 h-4" /> Report Issue
                                </Link>
                             </div>
                          </div>

                          {/* Action Side */}
                          <div className="bg-gray-50/50 p-8 flex flex-col justify-center gap-3 md:w-64">
                             <Button 
                                className="w-full bg-gray-900 hover:bg-orange-600 text-white rounded-2xl py-7 font-black uppercase tracking-widest shadow-xl transition-all"
                                onClick={() => {
                                   localStorage.setItem('completedOrder', JSON.stringify(order));
                                   router.push('/cart/checkout/confirmation/success/tracking');
                                }}
                             >
                                TRACK ORDER
                             </Button>
                             <Button 
                                variant="outline" 
                                className="w-full border-gray-200 text-gray-700 hover:bg-white rounded-2xl py-7 font-black uppercase tracking-widest bg-transparent"
                             >
                                ORDER DETAILS
                             </Button>
                          </div>
                       </div>
                    </CardContent>
                  </Card>
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