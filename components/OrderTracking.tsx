"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import { ArrowLeft, X, MapPin, Phone, Clock, CheckCircle, Truck, ChefHat, Package, Printer, User, Star, Navigation, Bell, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertDescription } from "./ui/alert";
import { apiClient, Order } from "../lib/api";

interface OrderTrackingProps {
  orderId: string;
  onGoBack: () => void;
}

interface OrderStatus {
  id: string;
  label: string;
  description: string;
  icon: any;
  completed: boolean;
  timestamp?: string;
  isActive?: boolean;
}

export function OrderTracking({ orderId, onGoBack }: OrderTrackingProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [estimatedTime, setEstimatedTime] = useState(25);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getOrder(orderId);
        if (response.success && (response.data || response.order)) {
          const rawOrder = response.data || (response as any).order;
          
          // Map backend order to frontend Order format if needed
          const mappedOrder: any = {
            ...rawOrder,
            items: rawOrder.items || rawOrder.orderItems || [],
            total: rawOrder.total || rawOrder.totalPrice || 0,
            createdAt: rawOrder.createdAt || new Date().toISOString()
          };
          
          // Ensure items have title and price
          mappedOrder.items = mappedOrder.items.map((item: any) => ({
            ...item,
            title: item.title || item.food?.title || item.name || 'Item',
            price: item.price || item.food?.price || 0,
            quantity: item.quantity || 1
          }));

          setOrder(mappedOrder);
        } else {
            setError("Order not found");
        }
      } catch (err) {
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
    
    // Poll for status updates
    const pollInterval = setInterval(fetchOrder, 10000);
    return () => clearInterval(pollInterval);
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-white rounded-3xl shadow-xl">
         <Loader2 className="w-12 h-12 text-orange-600 animate-spin mb-4" />
         <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Tracking your meal...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center p-8 bg-white rounded-3xl shadow-xl border border-red-50">
         <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <X className="w-8 h-8 text-red-600" />
         </div>
         <h3 className="text-2xl font-bold text-gray-900 mb-2">{error || "Something went wrong"}</h3>
         <Button onClick={onGoBack} className="bg-orange-600 hover:bg-orange-700">Go Back</Button>
      </div>
    );
  }

  const getStepFromStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case 'placed': return 0;
      case 'confirmed': return 1;
      case 'preparing': return 2;
      case 'ready': return 3;
      case 'out-for-delivery': return 4;
      case 'delivered': return 5;
      default: return 0;
    }
  };

  const currentStep = getStepFromStatus(order.status);

  const orderStatuses: OrderStatus[] = [
    {
      id: "placed",
      label: "Order Placed",
      description: "Your order has been received and is being processed",
      icon: CheckCircle,
      completed: currentStep >= 0,
      timestamp: new Date(order.createdAt!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
    {
      id: "confirmed",
      label: "Order Confirmed",
      description: "Restaurant has confirmed your order and started preparation",
      icon: CheckCircle,
      completed: currentStep >= 1,
      isActive: currentStep === 1
    },
    {
      id: "preparing",
      label: "Being Prepared",
      description: "Our skilled chefs are preparing your delicious meal with care",
      icon: ChefHat,
      completed: currentStep >= 2,
      isActive: currentStep === 2
    },
    {
      id: "ready",
      label: "Ready for Pickup",
      description: "Your order is ready and being packed for delivery",
      icon: Package,
      completed: currentStep >= 3,
      isActive: currentStep === 3
    },
    {
      id: "out-for-delivery",
      label: "Out for Delivery",
      description: "Your order is on the way to your location",
      icon: Truck,
      completed: currentStep >= 4,
      isActive: currentStep === 4
    },
    {
      id: "delivered",
      label: "Delivered",
      description: "Order delivered successfully. Enjoy your meal!",
      icon: CheckCircle,
      completed: currentStep >= 5,
      isActive: currentStep === 5
    }
  ];

  const progress = (currentStep / (orderStatuses.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 selection:bg-orange-100">
      <div className="max-w-6xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={onGoBack}
          className="mb-8 hover:bg-white rounded-full group px-6 py-6 border border-gray-100 shadow-sm"
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-gray-700">Back to Orders</span>
        </Button>

        {/* 🎫 PREMIUM HEADER */}
        <div className="bg-white rounded-[2rem] p-8 md:p-12 mb-10 border border-gray-100 shadow-2xl shadow-gray-200/50 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl opacity-50 -mr-32 -mt-32" />
           
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <Badge className="bg-orange-100 text-orange-600 border-0 px-4 py-1 font-black text-[10px] uppercase tracking-widest">
                       Real-time Tracking
                    </Badge>
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-500 font-bold text-sm">Order ID: {order.orderNumber}</span>
                 </div>
                 <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter">
                   {currentStep >= 5 ? "TASTED & DELIVERED" : "ON ITS WAY TO YOU"}
                 </h1>
                 <p className="text-gray-500 font-medium max-w-xl">
                   Relax while we handle the magic. Your delicious Sattvik meal is being crafted with precision and care.
                 </p>
              </div>
              
              <div className="bg-orange-50 p-6 rounded-[2rem] border border-orange-100 text-center min-w-[200px]">
                 <p className="text-orange-900/60 font-black text-[10px] uppercase tracking-[0.2em] mb-2">Estimated Time</p>
                 <div className="flex items-center justify-center gap-2">
                    <Clock className="w-6 h-6 text-orange-600" />
                    <span className="text-4xl font-black text-orange-600">
                       {currentStep >= 5 ? "00" : estimatedTime} <span className="text-lg">MINS</span>
                    </span>
                 </div>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Status Timeline Column */}
          <div className="lg:col-span-3 space-y-8">
            <Card className="rounded-[2.5rem] border-0 shadow-xl overflow-hidden">
               <div className="bg-gray-900 p-8 text-white relative">
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="font-black text-lg uppercase tracking-widest">Live Progress</h3>
                     <span className="text-orange-400 font-bold">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-3 bg-white/20" color="#f97316" />
               </div>
               
               <CardContent className="p-8 space-y-6 bg-white">
                  {orderStatuses.map((status, index) => {
                    const IconComponent = status.icon;
                    return (
                      <motion.div
                        key={status.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`group relative flex items-start gap-6 p-6 rounded-3xl transition-all duration-500 border-2 ${
                          status.completed 
                            ? 'bg-green-50/50 border-green-100' 
                            : status.isActive 
                            ? 'bg-orange-50 border-orange-200 shadow-lg shadow-orange-100' 
                            : 'bg-white border-transparent grayscale opacity-50'
                        }`}
                      >
                         <div className={`shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center shadow-md ${
                            status.completed 
                              ? 'bg-green-600 text-white' 
                              : status.isActive
                              ? 'bg-orange-600 text-white animate-pulse'
                              : 'bg-gray-100 text-gray-400'
                         }`}>
                           <IconComponent className="w-8 h-8" />
                         </div>
                         
                         <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                               <h4 className="font-black text-gray-900 tracking-tight text-lg uppercase">
                                  {status.label}
                               </h4>
                               {status.timestamp && (
                                  <span className="text-xs font-bold text-gray-400">{status.timestamp}</span>
                               )}
                            </div>
                            <p className="text-gray-500 font-medium text-sm leading-relaxed">
                               {status.description}
                            </p>
                         </div>

                         {/* Pulse link line */}
                         {index < orderStatuses.length - 1 && (
                            <div className="absolute left-14 top-24 w-0.5 h-12 bg-gray-100" />
                         )}
                      </motion.div>
                    );
                  })}
               </CardContent>
            </Card>
          </div>

          {/* Details & Map Column */}
          <div className="lg:col-span-2 space-y-8">
             {/* 📦 ORDER SUMMARY */}
             <Card className="rounded-[2.5rem] border-0 shadow-xl overflow-hidden p-8">
                <div className="flex items-center justify-between mb-8">
                   <h3 className="font-black text-gray-900 uppercase tracking-widest text-sm">Order Summary</h3>
                   <Printer className="w-5 h-5 text-gray-300 cursor-pointer hover:text-orange-600" />
                </div>
                
                <div className="space-y-6">
                   {order.items.map((item, id) => (
                      <div key={id} className="flex justify-between items-center group">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center font-black text-orange-600">
                               {item.quantity}x
                            </div>
                            <span className="font-bold text-gray-800 tracking-tight">{item.title}</span>
                         </div>
                         <span className="font-black text-gray-900">₹{item.price * item.quantity}</span>
                      </div>
                   ))}

                   <Separator className="bg-gray-50" />
                   
                   <div className="space-y-3 bg-gray-50/50 p-6 rounded-3xl">
                      <div className="flex justify-between text-gray-500 font-bold text-sm">
                         <span>Subtotal</span>
                         <span>₹{order.total}</span>
                      </div>
                      <div className="flex justify-between text-gray-500 font-bold text-sm">
                         <span>Delivery Fee</span>
                         <span className="text-green-600">FREE</span>
                      </div>
                      <Separator className="bg-gray-200/50" />
                      <div className="flex justify-between text-gray-900 font-black text-2xl pt-2">
                         <span>Total</span>
                         <span>₹{order.total}</span>
                      </div>
                   </div>
                   
                   <div className="flex items-center gap-3 p-4 bg-orange-600 rounded-2xl text-white shadow-lg shadow-orange-600/30">
                      <ChefHat className="w-5 h-5" />
                      <span className="text-xs font-black uppercase tracking-widest">Pure Vegetarian Crafted</span>
                   </div>
                </div>
             </Card>

             {/* 📍 DELIVERY INFO */}
             <Card className="rounded-[2.5rem] border-0 shadow-xl overflow-hidden p-8 bg-blue-600 text-white">
                <div className="flex items-center gap-3 mb-6">
                   <MapPin className="w-6 h-6" />
                   <h3 className="font-black uppercase tracking-widest text-sm text-blue-100">Delivery Information</h3>
                </div>
                <p className="text-lg font-bold leading-tight mb-8">
                   {order.customer.address?.line1}, {order.customer.address?.city}
                </p>
                <div className="flex flex-col gap-4">
                   <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 py-7 rounded-2xl font-black uppercase tracking-widest shadow-xl">
                      <Phone className="w-4 h-4 mr-2" /> Call Driver
                   </Button>
                   <Button variant="outline" className="w-full border-blue-400 text-white hover:bg-blue-700 py-7 rounded-2xl font-black uppercase tracking-widest bg-transparent">
                      Help Center
                   </Button>
                </div>
             </Card>
          </div>
        </div>
      </div>
    </div>
  );
}