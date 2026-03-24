import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { CheckCircle, MapPin, Clock, Phone, Home } from "lucide-react";

interface OrderConfirmationProps {
  orderData: any;
  onGoHome: () => void;
  onTrackOrder: () => void;
}

export function OrderConfirmation({ orderData, onGoHome, onTrackOrder }: OrderConfirmationProps) {
  const orderId = `SK${Date.now().toString().slice(-6)}`;
  const estimatedTime = orderData.deliveryType === "delivery" ? "30-45" : "20-30";
  
  return (
    <section className="py-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
          <p className="text-xl text-gray-600">Thank you for choosing Sattvik Kaleva</p>
          <div className="mt-4">
            <Badge variant="outline" className="text-lg px-4 py-2">
              Order ID: {orderId}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <div className="space-y-6">
            {/* Delivery Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {orderData.deliveryType === "delivery" ? (
                    <MapPin className="h-5 w-5 text-orange-600" />
                  ) : (
                    <Clock className="h-5 w-5 text-orange-600" />
                  )}
                  <span>
                    {orderData.deliveryType === "delivery" ? "Delivery Details" : "Pickup Details"}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {orderData.deliveryType === "delivery" ? (
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium">{orderData.name}</p>
                      <p className="text-gray-600">{orderData.phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-800">{orderData.address}</p>
                      {orderData.landmark && (
                        <p className="text-gray-600">Near: {orderData.landmark}</p>
                      )}
                      <p className="text-gray-600">{orderData.city} - {orderData.pincode}</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-blue-800 font-medium">
                        <Clock className="h-4 w-4 inline mr-1" />
                        Estimated delivery: {estimatedTime} minutes
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium">{orderData.name}</p>
                      <p className="text-gray-600">{orderData.phone}</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="font-medium text-green-800 mb-2">Pickup from:</p>
                      <p className="text-green-700 text-sm">
                        Sattvik Kaleva<br />
                        Opp. Icy Spicy, Beside Noorjahan Restaurant<br />
                        Main Road Katora Talab, Raipur
                      </p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-blue-800 font-medium">
                        <Clock className="h-4 w-4 inline mr-1" />
                        Ready for pickup in: {estimatedTime} minutes
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <Badge variant={orderData.paymentMethod === "online" ? "default" : "secondary"}>
                      {orderData.paymentMethod === "online" ? "Online Payment" : "Cash on Delivery"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Amount:</span>
                    <span className="font-bold text-lg">
                      ₹{orderData.paymentMethod === "online" ? 
                        Math.round(orderData.summary.total * 0.95) : 
                        orderData.summary.total}
                    </span>
                  </div>
                  {orderData.paymentMethod === "online" && (
                    <div className="text-green-600 text-sm">
                      You saved ₹{Math.round(orderData.summary.total * 0.05)} with online payment!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Special Instructions */}
            {orderData.instructions && (
              <Card>
                <CardHeader>
                  <CardTitle>Special Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{orderData.instructions}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items List */}
                <div className="space-y-3">
                  {orderData.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          ₹{item.price} × {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
                
                <Separator />
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal ({orderData.summary.totalItems} items)</span>
                    <span>₹{orderData.summary.subtotal}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>GST (18%)</span>
                    <span>₹{orderData.summary.gst}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>
                      {orderData.deliveryType === "delivery" ? "Delivery Fee" : "Pickup"}
                    </span>
                    <span>₹{orderData.summary.deliveryFee}</span>
                  </div>
                  
                  {orderData.paymentMethod === "online" && (
                    <div className="flex justify-between text-green-600">
                      <span>Online Payment Discount (5%)</span>
                      <span>-₹{Math.round(orderData.summary.total * 0.05)}</span>
                    </div>
                  )}
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Paid</span>
                  <span className="text-orange-600">
                    ₹{orderData.paymentMethod === "online" ? 
                      Math.round(orderData.summary.total * 0.95) : 
                      orderData.summary.total}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              <Button 
                onClick={onTrackOrder}
                className="w-full bg-orange-600 hover:bg-orange-700"
                size="lg"
              >
                Track Your Order
              </Button>
              <Button 
                onClick={onGoHome}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <Home className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </div>

            {/* Contact Information */}
            <Card className="mt-6">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <p className="font-medium">Need help with your order?</p>
                  <div className="flex items-center justify-center space-x-2">
                    <Phone className="h-4 w-4 text-orange-600" />
                    <a 
                      href="tel:9644974441" 
                      className="text-orange-600 font-medium hover:underline"
                    >
                      9644974441
                    </a>
                  </div>
                  <p className="text-sm text-gray-500">Available 24/7</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}