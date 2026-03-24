import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import { ArrowLeft, MapPin, Phone, Clock, CheckCircle, Truck, ChefHat, Package, Printer, User, Star, Navigation, Bell } from "lucide-react";
import { motion } from "framer-motion";

import { Alert, AlertDescription } from "./ui/alert";

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

interface DeliveryLocation {
  lat: number;
  lng: number;
  address: string;
}

interface LiveUpdate {
  id: string;
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning';
}

export function OrderTracking({ orderId, onGoBack }: OrderTrackingProps) {
  const [currentStep, setCurrentStep] = useState(2);
  const [estimatedTime, setEstimatedTime] = useState(25);
  const [liveUpdates, setLiveUpdates] = useState<LiveUpdate[]>([
    {
      id: '1',
      message: 'Order confirmed by restaurant',
      timestamp: '2:32 PM',
      type: 'success'
    }
  ]);
  
  const [deliveryPerson, setDeliveryPerson] = useState({
    name: "Rajesh Kumar",
    phone: "+91 98765 43210",
    rating: 4.8,
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    vehicleNumber: "CG 04 AB 1234",
    estimatedArrival: "5-10 minutes",
    currentLocation: "Near City Mall, approaching delivery address"
  });

  const [customerLocation] = useState<DeliveryLocation>({
    lat: 21.2514,
    lng: 81.6296,
    address: "New Dhamtari Rd, opp. Mahadev Tata motors, Devpuri, Raipur, Chhattisgarh 492015"
  });

  const [orderDetails] = useState({
    items: [
      { name: "Special Sattvik Thali", quantity: 1, price: 250 },
      { name: "Paneer Butter Masala", quantity: 1, price: 180 },
      { name: "Gulab Jamun", quantity: 2, price: 80 }
    ],
    subtotal: 510,
    deliveryFee: 40,
    total: 550,
    paymentMethod: "Online Payment",
    orderTime: "2:30 PM"
  });

  const orderStatuses: OrderStatus[] = [
    {
      id: "placed",
      label: "Order Placed",
      description: "Your order has been received and is being processed",
      icon: CheckCircle,
      completed: true,
      timestamp: "2:30 PM"
    },
    {
      id: "confirmed",
      label: "Order Confirmed",
      description: "Restaurant has confirmed your order and started preparation",
      icon: CheckCircle,
      completed: true,
      timestamp: "2:32 PM"
    },
    {
      id: "preparing",
      label: "Being Prepared",
      description: "Our skilled chefs are preparing your delicious meal with care",
      icon: ChefHat,
      completed: currentStep >= 2,
      timestamp: currentStep >= 2 ? "2:35 PM" : undefined,
      isActive: currentStep === 2
    },
    {
      id: "ready",
      label: "Ready for Pickup",
      description: "Your order is ready and being packed for delivery",
      icon: Package,
      completed: currentStep >= 3,
      timestamp: currentStep >= 3 ? "2:50 PM" : undefined,
      isActive: currentStep === 3
    },
    {
      id: "out_for_delivery",
      label: "Out for Delivery",
      description: "Your order is on the way to your location",
      icon: Truck,
      completed: currentStep >= 4,
      timestamp: currentStep >= 4 ? "2:55 PM" : undefined,
      isActive: currentStep === 4
    },
    {
      id: "delivered",
      label: "Delivered",
      description: "Order delivered successfully. Enjoy your meal!",
      icon: CheckCircle,
      completed: currentStep >= 5,
      timestamp: currentStep >= 5 ? "3:15 PM" : undefined,
      isActive: currentStep === 5
    }
  ];

  // Real-time order progress simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < 5) {
          const newStep = prev + 1;
          
          // Add live updates based on progress
          const updateMessages = {
            3: "Food is ready and being packed for delivery",
            4: "Delivery partner has picked up your order",
            5: "Order delivered successfully!"
          };
          
          // if (updateMessages[newStep]) {
          //   setLiveUpdates(prevUpdates => [
          //     {
          //       id: Date.now().toString(),
          //       message: updateMessages[newStep],
          //       timestamp: new Date().toLocaleTimeString('en-US', { 
          //         hour12: true, 
          //         hour: 'numeric', 
          //         minute: '2-digit' 
          //       }),
          //       type: newStep === 5 ? 'success' : 'info'
          //     },
          //     ...prevUpdates
          //   ]);
          // }
          
          setEstimatedTime(prevTime => {
            if (newStep === 4) return 15; // Out for delivery
            if (newStep === 5) return 0; // Delivered
            return Math.max(0, prevTime - 5);
          });
          
          return newStep;
        }
        return prev;
      });
    }, 20000); // Update every 20 seconds for demo

    // Simulate live location updates
    const locationInterval = setInterval(() => {
      if (currentStep === 4) {
        const locations = [
          "Just left the restaurant",
          "Near City Mall, on route to your location",
          "5 minutes away from your address",
          "Reached your building, calling now"
        ];
        
        setDeliveryPerson(prev => ({
          ...prev,
          currentLocation: locations[Math.floor(Math.random() * locations.length)]
        }));
      }
    }, 15000);

    return () => {
      clearInterval(interval);
      clearInterval(locationInterval);
    };
  }, [currentStep]);

  const progress = (currentStep / (orderStatuses.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <Button 
          variant="outline" 
          onClick={onGoBack}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Button>

        {/* Header */}
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-6 mb-8 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Tracking</h1>
              <div className="flex items-center space-x-4 text-gray-600">
                <span>Order #{orderId}</span>
                <span>•</span>
                <span>Placed at {orderDetails.orderTime}</span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>ETA: {estimatedTime > 0 ? `${estimatedTime} minutes` : 'Delivered!'}</span>
                </span>
              </div>
            </div>
            <Badge 
              variant="outline" 
              className={`text-lg px-4 py-2 ${
                currentStep < 5 
                  ? 'bg-orange-100 text-orange-700 border-orange-200' 
                  : 'bg-green-100 text-green-700 border-green-200'
              }`}
            >
              {currentStep < 5 ? 'In Progress' : 'Delivered'}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Status Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Bar */}
            <Card>
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Order Progress</span>
                    <span>{Math.round(progress)}% Complete</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                </div>

                {currentStep < 5 && (
                  <Alert className="border-orange-200 bg-orange-50">
                    <Clock className="h-4 w-4" />
                    <AlertDescription className="text-orange-700">
                      <strong>Estimated delivery: {estimatedTime} minutes</strong>
                      {currentStep === 4 && (
                        <span className="block mt-1">Your delivery partner is on the way!</span>
                      )}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Status Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {orderStatuses.map((status, index) => {
                  const IconComponent = status.icon;
                  return (
                    <motion.div
                      key={status.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-start space-x-4 p-4 rounded-lg transition-all ${
                        status.completed 
                          ? 'bg-green-50 border border-green-200' 
                          : status.isActive 
                          ? 'bg-orange-50 border border-orange-200' 
                          : 'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <div className={`p-3 rounded-full ${
                        status.completed 
                          ? 'bg-green-100 text-green-600' 
                          : status.isActive
                          ? 'bg-orange-100 text-orange-600'
                          : 'bg-gray-200 text-gray-400'
                      }`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className={`font-semibold ${
                            status.completed 
                              ? 'text-green-800' 
                              : status.isActive
                              ? 'text-orange-800'
                              : 'text-gray-600'
                          }`}>
                            {status.label}
                          </h4>
                          {status.timestamp && (
                            <span className="text-sm text-gray-500">{status.timestamp}</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{status.description}</p>
                        {status.isActive && currentStep === 4 && (
                          <motion.div 
                            className="mt-2 flex items-center space-x-1 text-orange-600"
                            animate={{ opacity: [1, 0.5, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Navigation className="h-4 w-4" />
                            <span className="text-sm font-medium">{deliveryPerson.currentLocation}</span>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Delivery Partner Info */}
            {currentStep >= 4 && currentStep < 5 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Your Delivery Partner</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Online
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 border border-orange-200">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <img
                          src={deliveryPerson.photo}
                          alt={deliveryPerson.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-orange-200"
                        />
                        <motion.div 
                          className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        ></motion.div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-800">{deliveryPerson.name}</h3>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">{deliveryPerson.rating}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">Vehicle: {deliveryPerson.vehicleNumber}</p>
                        <p className="text-sm text-orange-600 font-medium">ETA: {deliveryPerson.estimatedArrival}</p>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Button variant="outline" size="sm" className="bg-white">
                          <Phone className="h-4 w-4 mr-2" />
                          Call
                        </Button>
                        <Button variant="outline" size="sm" className="bg-white">
                          <MapPin className="h-4 w-4 mr-2" />
                          Track
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Live Updates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-orange-600" />
                  <span>Live Updates</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {liveUpdates.map((update) => (
                    <motion.div
                      key={update.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3 rounded-lg text-sm ${
                        update.type === 'success' 
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : update.type === 'warning'
                          ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <p className="font-medium">{update.message}</p>
                        <span className="text-xs opacity-75">{update.timestamp}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Live Map */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-orange-600" />
                  <span>Live Tracking</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-100 rounded-lg relative overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.6761508031073!2d81.62960731744385!3d21.25140000000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a28dda23d7c5c1d%3A0x7a9f0b2b2b7c8d9e!2sNew%20Dhamtari%20Rd%2C%20Devpuri%2C%20Raipur%2C%20Chhattisgarh!5e0!3m2!1sen!2sin!4v1640000000000!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    className="border-0 rounded-lg"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Live Order Tracking"
                  />
                  
                  {/* Live tracking overlay */}
                  {currentStep >= 4 && currentStep < 5 && (
                    <motion.div
                      className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-lg border border-gray-200"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div className="flex items-center space-x-2">
                        <motion.div 
                          className="w-3 h-3 bg-green-500 rounded-full"
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        ></motion.div>
                        <span className="text-sm font-medium text-green-600">Live Tracking Active</span>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 5 && (
                    <div className="absolute inset-0 bg-green-600 bg-opacity-20 flex items-center justify-center">
                      <div className="bg-white p-4 rounded-lg shadow-lg">
                        <div className="flex items-center space-x-2 text-green-600">
                          <CheckCircle className="h-6 w-6" />
                          <span className="font-semibold">Delivered Successfully!</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-orange-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Restaurant</p>
                      <p className="text-xs text-gray-600">
                        Sattvik Kaleva, New Dhamtari Rd, Raipur
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Your Location</p>
                      <p className="text-xs text-gray-600">{customerLocation.address}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Order Summary</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.print()}
                  className="flex items-center space-x-2"
                >
                  <Printer className="h-4 w-4" />
                  <span>Receipt</span>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {orderDetails.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{orderDetails.subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>₹{orderDetails.deliveryFee}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-base">
                      <span>Total</span>
                      <span>₹{orderDetails.total}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center text-sm">
                      <span>Payment Method:</span>
                      <span className="font-medium">{orderDetails.paymentMethod}</span>
                    </div>
                  </div>
                  
                  {/* Print-only receipt section */}
                  <div className="hidden print:block">
                    <Separator className="my-4" />
                    <div className="text-center mb-4">
                      <h2 className="font-bold text-lg">Sattvik Kaleva</h2>
                      <p className="text-sm">Pure Veg • Veggy and Choosy</p>
                      <p className="text-xs">New Dhamtari Rd, Raipur, Chhattisgarh 492015</p>
                      <p className="text-xs">Phone: 96449 74442</p>
                    </div>
                    <div className="text-xs space-y-1">
                      <p>Order ID: {orderId}</p>
                      <p>Date: {new Date().toLocaleString()}</p>
                      <p>Status: {currentStep < 5 ? 'In Progress' : 'Delivered'}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="h-4 w-4 mr-2" />
                  Restaurant: 96449 74442
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="h-4 w-4 mr-2" />
                  Support: 1800-123-4567
                </Button>
                {currentStep >= 4 && deliveryPerson && (
                  <Button variant="outline" className="w-full justify-start">
                    <Phone className="h-4 w-4 mr-2" />
                    Delivery Partner: {deliveryPerson.phone}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}