import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { MapPin, Clock, CreditCard, Wallet, ArrowLeft, CheckCircle } from "lucide-react";
import { useState } from "react";

interface CartItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
}

interface CheckoutProps {
  cartItems: CartItem[];
  onGoBack: () => void;
  onPlaceOrder: (orderData: any) => void;
}

export function Checkout({ cartItems, onGoBack, onPlaceOrder }: CheckoutProps) {
  const [orderData, setOrderData] = useState({
    // Customer Details
    name: "",
    email: "",
    phone: "",
    
    // Delivery Details
    deliveryType: "delivery",
    address: "",
    landmark: "",
    city: "Raipur",
    pincode: "",
    
    // Payment Details
    paymentMethod: "",
    
    // Special Instructions
    instructions: ""
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = orderData.deliveryType === "delivery" && subtotal <= 300 ? 40 : 0;
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + deliveryFee + gst;
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleInputChange = (field: string, value: string) => {
    setOrderData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!orderData.name.trim()) newErrors.name = "Name is required";
    if (!orderData.email.trim()) newErrors.email = "Email is required";
    if (!orderData.phone.trim()) newErrors.phone = "Phone number is required";
    if (orderData.deliveryType === "delivery") {
      if (!orderData.address.trim()) newErrors.address = "Delivery address is required";
      if (!orderData.pincode.trim()) newErrors.pincode = "Pincode is required";
    }
    if (!orderData.paymentMethod) newErrors.paymentMethod = "Please select a payment method";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const completeOrderData = {
        ...orderData,
        items: cartItems,
        summary: {
          subtotal,
          gst,
          deliveryFee,
          total,
          totalItems
        },
        timestamp: new Date().toISOString()
      };
      onPlaceOrder(completeOrderData);
    }
  };

  return (
    <section className="py-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={onGoBack}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your order details</p>
        </div>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <div className="bg-orange-100 p-2 rounded-full">
                      <span className="text-orange-600 font-bold">1</span>
                    </div>
                    <span>Customer Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        value={orderData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className={errors.name ? "border-red-500" : ""}
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={orderData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={orderData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <div className="bg-orange-100 p-2 rounded-full">
                      <span className="text-orange-600 font-bold">2</span>
                    </div>
                    <span>Delivery Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Order Type *</Label>
                    <RadioGroup
                      value={orderData.deliveryType}
                      onValueChange={(value) => handleInputChange("deliveryType", value)}
                      className="flex space-x-6 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="delivery" id="delivery" />
                        <Label htmlFor="delivery" className="flex items-center space-x-2 cursor-pointer">
                          <MapPin className="h-4 w-4" />
                          <span>Home Delivery</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="pickup" id="pickup" />
                        <Label htmlFor="pickup" className="flex items-center space-x-2 cursor-pointer">
                          <Clock className="h-4 w-4" />
                          <span>Store Pickup</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {orderData.deliveryType === "delivery" ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="address">Delivery Address *</Label>
                        <Textarea
                          id="address"
                          placeholder="Enter your complete address"
                          value={orderData.address}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          className={errors.address ? "border-red-500" : ""}
                          rows={3}
                        />
                        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="landmark">Landmark</Label>
                          <Input
                            id="landmark"
                            placeholder="Nearby landmark"
                            value={orderData.landmark}
                            onChange={(e) => handleInputChange("landmark", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            value={orderData.city}
                            onChange={(e) => handleInputChange("city", e.target.value)}
                            readOnly
                            className="bg-gray-100"
                          />
                        </div>
                        <div>
                          <Label htmlFor="pincode">Pincode *</Label>
                          <Input
                            id="pincode"
                            placeholder="492001"
                            value={orderData.pincode}
                            onChange={(e) => handleInputChange("pincode", e.target.value)}
                            className={errors.pincode ? "border-red-500" : ""}
                          />
                          {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
                        </div>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-blue-800 text-sm">
                          <Clock className="h-4 w-4 inline mr-1" />
                          Estimated delivery time: 30-45 minutes
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-medium text-green-800 mb-2">Pickup Location:</h4>
                      <p className="text-green-700 text-sm">
                        Sattvik Kaleva<br />
                        Opp. Icy Spicy, Beside Noorjahan Restaurant<br />
                        Main Road Katora Talab, Raipur<br />
                        Phone: 9644974441
                      </p>
                      <p className="text-green-600 text-sm mt-2">
                        <Clock className="h-4 w-4 inline mr-1" />
                        Ready for pickup in: 20-30 minutes
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <div className="bg-orange-100 p-2 rounded-full">
                      <span className="text-orange-600 font-bold">3</span>
                    </div>
                    <span>Payment Method</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={orderData.paymentMethod}
                    onValueChange={(value) => handleInputChange("paymentMethod", value)}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex items-center space-x-3 cursor-pointer flex-1">
                        <Wallet className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium">Cash on Delivery</p>
                          <p className="text-sm text-gray-600">Pay when your order arrives</p>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="online" id="online" />
                      <Label htmlFor="online" className="flex items-center space-x-3 cursor-pointer flex-1">
                        <CreditCard className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">Online Payment</p>
                          <p className="text-sm text-gray-600">UPI, Cards, Net Banking</p>
                        </div>
                        <Badge variant="secondary" className="ml-auto">5% OFF</Badge>
                      </Label>
                    </div>
                  </RadioGroup>
                  {errors.paymentMethod && <p className="text-red-500 text-sm mt-2">{errors.paymentMethod}</p>}
                </CardContent>
              </Card>

              {/* Special Instructions */}
              <Card>
                <CardHeader>
                  <CardTitle>Special Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Any special requests or cooking instructions..."
                    value={orderData.instructions}
                    onChange={(e) => handleInputChange("instructions", e.target.value)}
                    rows={3}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items List */}
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-start text-sm">
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium">₹{item.price * item.quantity}</p>
                      </div>
                    ))}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal ({totalItems} items)</span>
                      <span>₹{subtotal}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>GST (18%)</span>
                      <span>₹{gst}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <div>
                        <span>
                          {orderData.deliveryType === "delivery" ? "Delivery Fee" : "Pickup"}
                        </span>
                        {orderData.deliveryType === "delivery" && subtotal > 300 && (
                          <Badge variant="secondary" className="ml-2 text-xs">Free</Badge>
                        )}
                      </div>
                      <span className={orderData.deliveryType === "delivery" && subtotal > 300 ? "line-through text-gray-500" : ""}>
                        ₹{deliveryFee}
                      </span>
                    </div>
                    
                    {orderData.paymentMethod === "online" && (
                      <div className="flex justify-between text-green-600">
                        <span>Online Payment Discount (5%)</span>
                        <span>-₹{Math.round(total * 0.05)}</span>
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-orange-600">
                      ₹{orderData.paymentMethod === "online" ? Math.round(total * 0.95) : total}
                    </span>
                  </div>
                  
                  <Button 
                    type="submit"
                    className="w-full bg-orange-600 hover:bg-orange-700 text-lg py-3"
                    size="lg"
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Place Order
                  </Button>
                  
                  <div className="text-center text-sm text-gray-500">
                    <p>Your order will be confirmed shortly</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}