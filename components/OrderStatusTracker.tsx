import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Check, Clock, Package, Truck, Home, Phone, MapPin, Star, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";


interface OrderStatusTrackerProps {
  orderId: string;
  onBack: () => void;
}

export function OrderStatusTracker({ orderId, onBack }: OrderStatusTrackerProps) {
  const [currentStatus, setCurrentStatus] = useState(0);
  const [progress, setProgress] = useState(0);

  const statuses = [
    { id: 0, label: "Order Placed", icon: Package, time: "2:30 PM", completed: true },
    { id: 1, label: "Preparing", icon: Clock, time: "2:35 PM", completed: true },
    { id: 2, label: "Out for Delivery", icon: Truck, time: "2:55 PM", completed: true },
    { id: 3, label: "Delivered", icon: Home, time: "Est. 3:15 PM", completed: false }
  ];

  const deliveryPartner = {
    name: "Rajesh Kumar",
    phone: "+91 98765 43210",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    vehicle: "Two Wheeler - RJ 14 AB 1234"
  };

  const orderDetails = {
    orderId: orderId,
    items: [
      { name: "Paneer Tikka", quantity: 2, price: 299 },
      { name: "Dal Makhani", quantity: 1, price: 199 },
      { name: "Butter Naan", quantity: 4, price: 160 }
    ],
    subtotal: 658,
    deliveryFee: 40,
    taxes: 65.80,
    total: 763.80,
    deliveryAddress: "123, Green Park, Raipur, Chhattisgarh - 492001"
  };

  // Simulate status updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStatus((prev) => {
        if (prev < statuses.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 15000); // Update every 15 seconds for demo

    return () => clearInterval(interval);
  }, []);

  // Update progress bar
  useEffect(() => {
    const targetProgress = (currentStatus / (statuses.length - 1)) * 100;
    setProgress(targetProgress);
  }, [currentStatus]);

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <div className="bg-white sticky top-0 z-40 border-b border-gray-200">
        <div className="px-4 py-4 flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h3>Track Order</h3>
            <p className="text-sm text-gray-600">Order #{orderId}</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Live Map Placeholder */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          <div className="relative h-64 bg-gradient-to-br from-teal-100 to-blue-100 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-teal-600 mx-auto mb-3 animate-bounce" />
              <p className="text-gray-700">Live tracking map</p>
              <p className="text-sm text-gray-500 mt-1">Your order is on the way!</p>
            </div>
            
            {/* Animated delivery icon */}
            <motion.div
              animate={{
                x: [0, 100, 200],
                y: [0, -20, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute bottom-8 left-8"
            >
              <Truck className="w-8 h-8 text-teal-600" />
            </motion.div>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="mb-6">Order Status</h2>
          
          {/* Progress Bar */}
          <div className="mb-8">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>Order Placed</span>
              <span>Delivered</span>
            </div>
          </div>

          {/* Status Steps */}
          <div className="space-y-6">
            {statuses.map((status, index) => {
              const Icon = status.icon;
              const isActive = index === currentStatus;
              const isCompleted = index < currentStatus || status.completed;
              
              return (
                <motion.div
                  key={status.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex flex-col items-center">
                    <motion.div
                      animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : isActive
                          ? 'bg-teal-500 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {isCompleted && index < currentStatus ? (
                        <Check className="w-6 h-6" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </motion.div>
                    {index < statuses.length - 1 && (
                      <div
                        className={`w-0.5 h-12 ${
                          index < currentStatus ? 'bg-green-500' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={isActive ? 'text-teal-600' : ''}>{status.label}</h3>
                      {isActive && (
                        <Badge className="bg-teal-100 text-teal-700 border-teal-300">
                          In Progress
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{status.time}</p>
                    {isActive && currentStatus === 2 && (
                      <p className="text-sm text-teal-600 mt-1">
                        Your delivery partner is on the way
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Delivery Partner Info */}
        {currentStatus >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <h2 className="mb-4">Delivery Partner</h2>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full overflow-hidden">
                <img
                  src={deliveryPartner.image}
                  alt={deliveryPartner.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="mb-1">{deliveryPartner.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{deliveryPartner.rating}</span>
                  <span>•</span>
                  <span>{deliveryPartner.vehicle}</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => window.location.href = `tel:${deliveryPartner.phone}`}
              >
                <Phone className="w-4 h-4" />
                Call
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Message
              </Button>
            </div>
          </motion.div>
        )}

        {/* Order Details */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="mb-4">Order Summary</h2>
          
          <div className="space-y-3 mb-4">
            {orderDetails.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-700">
                  {item.name} × {item.quantity}
                </span>
                <span className="text-gray-900">₹{item.price}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-4 border-t border-gray-200 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>₹{orderDetails.subtotal}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee</span>
              <span>₹{orderDetails.deliveryFee}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Taxes & Charges</span>
              <span>₹{orderDetails.taxes}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200">
              <span>Total</span>
              <span>₹{orderDetails.total}</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-start gap-2">
              <MapPin className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600 mb-1">Delivery Address</p>
                <p className="text-gray-900">{orderDetails.deliveryAddress}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl p-6 border border-teal-100">
          <h3 className="mb-2">Need Help?</h3>
          <p className="text-sm text-gray-600 mb-4">
            Contact our support team for any queries about your order
          </p>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1">
              <Phone className="w-4 h-4 mr-2" />
              Call Support
            </Button>
            <Button variant="outline" className="flex-1">
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border ${className}`}>
      {children}
    </span>
  );
}
