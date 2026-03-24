import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Plus, Minus, Trash2, ShoppingBag, ArrowLeft, Percent, Tag, Sparkles } from "lucide-react";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { defaultMenuItems, MenuItem } from "./Menu";

interface CartItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
}

interface CartProps {
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: number, newQuantity: number) => void;
  onRemoveItem: (itemId: number) => void;
  onProceedToCheckout: () => void;
  onContinueShopping: () => void;
  onAddToCart?: (itemId: number) => void;
}

// Available discount codes
const discountCodes = [
  { code: "FIRST20", discount: 20, minOrder: 200, description: "20% off on first order" },
  { code: "WEEKEND15", discount: 15, minOrder: 300, description: "15% off weekend special" },
  { code: "FAMILY25", discount: 25, minOrder: 500, description: "25% off family pack" },
  { code: "STUDENT10", discount: 10, minOrder: 150, description: "10% student discount" },
  { code: "SAVE30", discount: 30, minOrder: 600, description: "30% off on orders above ₹600" }
];

export function Cart({ 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  onProceedToCheckout,
  onContinueShopping,
  onAddToCart
}: CartProps) {
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<typeof discountCodes[0] | null>(null);
  
  // Get suggested items based on cart items
  const getSuggestedItems = (): MenuItem[] => {
    // const cartCategories = [...new Set(cartItems.map(item => item.category))];
    const cartItemIds = cartItems.map(item => item.id);
    
    // Get items from same categories and popular items
    const suggested = defaultMenuItems.filter(item => 
      !cartItemIds.includes(item.id) 
    ).slice(0, 6);
    
    return suggested;
  };
  
  const suggestedItems = getSuggestedItems();
  
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 300 ? 0 : 40;
  const discountAmount = appliedDiscount && subtotal >= appliedDiscount.minOrder 
    ? Math.round((subtotal * appliedDiscount.discount) / 100) 
    : 0;
  const gst = Math.round((subtotal - discountAmount) * 0.18);
  const total = subtotal + deliveryFee + gst - discountAmount;
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const applyCoupon = () => {
    const validCoupon = discountCodes.find(
      (discount) => discount.code.toLowerCase() === couponCode.toLowerCase()
    );

    if (!validCoupon) {
      toast.error("Invalid coupon code");
      return;
    }

    if (subtotal < validCoupon.minOrder) {
      toast.error(`Minimum order amount of ₹${validCoupon.minOrder} required for this coupon`);
      return;
    }

    setAppliedDiscount(validCoupon);
    toast.success(`Coupon applied! You saved ₹${Math.round((subtotal * validCoupon.discount) / 100)}`);
  };

  const removeCoupon = () => {
    setAppliedDiscount(null);
    setCouponCode("");
    toast.success("Coupon removed");
  };

  if (cartItems.length === 0) {
    return (
      <section className="py-20 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
            <p className="text-xl text-gray-600 mb-8">
              Looks like you haven't added any delicious items to your cart yet!
            </p>
            <Button 
              onClick={onContinueShopping}
              className="bg-orange-600 hover:bg-orange-700"
              size="lg"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Continue Shopping
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={onContinueShopping}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
          <p className="text-gray-600 mt-2">{totalItems} items in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                          <Badge variant="outline" className="mt-2 text-xs">
                            {item.category}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveItem(item.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="font-medium text-lg min-w-[2rem] text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">₹{item.price} each</p>
                          <p className="text-lg font-bold text-orange-600">₹{item.price * item.quantity}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>₹{subtotal}</span>
                </div>
                
                {/* Coupon Code Section */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Tag className="h-4 w-4 text-orange-600" />
                    <span className="font-medium">Have a coupon?</span>
                  </div>
                  
                  {!appliedDiscount ? (
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="flex-1"
                      />
                      <Button 
                        onClick={applyCoupon}
                        variant="outline"
                        disabled={!couponCode.trim()}
                      >
                        Apply
                      </Button>
                    </div>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Percent className="h-4 w-4 text-green-600" />
                          <span className="text-green-800 font-medium">{appliedDiscount.code}</span>
                          <Badge className="bg-green-500 text-white">
                            {appliedDiscount.discount}% OFF
                          </Badge>
                        </div>
                        <Button 
                          onClick={removeCoupon}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </Button>
                      </div>
                      <p className="text-sm text-green-600 mt-1">{appliedDiscount.description}</p>
                    </div>
                  )}
                  
                  {/* Available Coupons */}
                  <div className="text-xs text-gray-500">
                    <p className="mb-1">Available coupons:</p>
                    <div className="space-y-1">
                      {discountCodes.map((discount) => (
                        <p key={discount.code} className="flex justify-between">
                          <span className="font-mono">{discount.code}</span>
                          <span>{discount.discount}% off (min ₹{discount.minOrder})</span>
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                {appliedDiscount && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedDiscount.discount}%)</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span>GST (18%)</span>
                  <span>₹{gst}</span>
                </div>
                
                <div className="flex justify-between">
                  <div>
                    <span>Delivery Fee</span>
                    {subtotal > 300 && (
                      <Badge variant="secondary" className="ml-2 text-xs">Free</Badge>
                    )}
                  </div>
                  <span className={subtotal > 300 ? "line-through text-gray-500" : ""}>
                    ₹{deliveryFee}
                  </span>
                </div>
                
                {subtotal > 300 && (
                  <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                    🎉 You saved ₹40 on delivery! Orders above ₹300 get free delivery.
                  </div>
                )}
                
                {subtotal <= 300 && (
                  <div className="text-sm text-orange-600 bg-orange-50 p-2 rounded">
                    Add ₹{300 - subtotal} more for free delivery!
                  </div>
                )}
                
                <Separator />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-orange-600">₹{total}</span>
                </div>
                
                <Button 
                  onClick={onProceedToCheckout}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-lg py-3"
                  size="lg"
                >
                  Proceed to Checkout
                </Button>
                
                <div className="text-center text-sm text-gray-500">
                  <p>Estimated delivery: 30-45 minutes</p>
                  <p className="mt-1">24/7 service available</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Suggested Items Section */}
        {suggestedItems.length > 0 && onAddToCart && (
          <div className="mt-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      You Might Also Like
                    </h2>
                    <p className="text-sm text-gray-600">Popular items from our menu</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {suggestedItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-purple-200">
                      <div className="relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-28 object-cover"
                        />
                        <Badge className="absolute top-2 left-2 bg-green-500 text-white text-xs">
                          🍃 Veg
                        </Badge>
                      </div>
                      <CardContent className="p-3 flex-1 flex flex-col">
                        <h3 className="font-bold text-xs mb-1 line-clamp-2">{item.name}</h3>
                        <div className="flex items-center space-x-1 mb-2">
                          {item.averageRating && item.averageRating > 0 && (
                            <>
                              <span className="text-yellow-400">★</span>
                              <span className="text-xs font-medium">{item.averageRating}</span>
                            </>
                          )}
                        </div>
                        <div className="mt-auto">
                          <p className="font-bold text-orange-600 text-sm mb-2">₹{item.price}</p>
                          <Button
                            onClick={() => onAddToCart(item.id)}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-7 text-xs"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}