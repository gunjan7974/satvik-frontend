import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { CreditCard, Smartphone, Building2, ArrowLeft, Shield, Lock, CheckCircle } from "lucide-react";

interface EventBooking {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  eventType: string;
  eventDate: Date;
  guestCount: number;
  timeSlot: string;
  specialRequests: string;
  totalAmount: number;
  advanceAmount: number;
  status: "pending" | "confirmed" | "cancelled";
  bookingDate: Date;
  selectedServices: string[];
  selectedVenue: string;
}

interface EventPaymentProps {
  booking: EventBooking;
  onGoBack: () => void;
  onPaymentSuccess: (paymentData: any) => void;
}

export function EventPayment({ booking, onGoBack, onPaymentSuccess }: EventPaymentProps) {
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    upiId: "",
    bankAccount: "",
    ifscCode: ""
  });
  const [processing, setProcessing] = useState(false);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }

    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      const paymentData = {
        transactionId: `TXN${Date.now()}`,
        paymentMethod,
        amount: booking.advanceAmount,
        status: "success",
        timestamp: new Date().toISOString(),
        bookingId: booking.id
      };
      
      setProcessing(false);
      onPaymentSuccess(paymentData);
    }, 3000);
  };

  return (
    <section className="py-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button variant="outline" onClick={onGoBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Booking
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Payment</h1>
          <p className="text-gray-600 mt-2">Secure payment for your event booking</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <Badge variant="outline" className="mb-2">
                    {booking.id}
                  </Badge>
                  <p className="font-medium">{booking.eventType}</p>
                  <p className="text-sm text-gray-600">{booking.customerName}</p>
                </div>
                
                <Separator />
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Event Date:</span>
                    <span>{new Date(booking.eventDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time:</span>
                    <span>{booking.timeSlot}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Guests:</span>
                    <span>{booking.guestCount}</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Amount:</span>
                    <span>₹{booking.totalAmount}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg text-orange-600">
                    <span>Advance Payment:</span>
                    <span>₹{booking.advanceAmount}</span>
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    Remaining ₹{booking.totalAmount - booking.advanceAmount} to be paid at venue
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-green-500" />
                  Secure Payment
                </CardTitle>
                <p className="text-sm text-gray-600">Your payment information is encrypted and secure</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePayment} className="space-y-6">
                  {/* Payment Method Selection */}
                  <div>
                    <Label className="text-base font-medium mb-4 block">Select Payment Method</Label>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                          <RadioGroupItem value="card" id="card" className="peer sr-only" />
                          <Label
                            htmlFor="card"
                            className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer peer-checked:border-blue-500 peer-checked:bg-blue-50 hover:bg-gray-50"
                          >
                            <CreditCard className="h-8 w-8 mb-2 text-blue-600" />
                            <span className="text-sm font-medium">Credit/Debit Card</span>
                          </Label>
                        </div>
                        
                        <div className="relative">
                          <RadioGroupItem value="upi" id="upi" className="peer sr-only" />
                          <Label
                            htmlFor="upi"
                            className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer peer-checked:border-blue-500 peer-checked:bg-blue-50 hover:bg-gray-50"
                          >
                            <Smartphone className="h-8 w-8 mb-2 text-green-600" />
                            <span className="text-sm font-medium">UPI Payment</span>
                          </Label>
                        </div>
                        
                        <div className="relative">
                          <RadioGroupItem value="bank" id="bank" className="peer sr-only" />
                          <Label
                            htmlFor="bank"
                            className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer peer-checked:border-blue-500 peer-checked:bg-blue-50 hover:bg-gray-50"
                          >
                            <Building2 className="h-8 w-8 mb-2 text-purple-600" />
                            <span className="text-sm font-medium">Net Banking</span>
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Payment Details */}
                  {paymentMethod === "card" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={paymentDetails.cardNumber}
                            onChange={(e) => setPaymentDetails(prev => ({...prev, cardNumber: e.target.value}))}
                            required
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="cardName">Cardholder Name</Label>
                          <Input
                            id="cardName"
                            placeholder="John Doe"
                            value={paymentDetails.cardName}
                            onChange={(e) => setPaymentDetails(prev => ({...prev, cardName: e.target.value}))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input
                            id="expiryDate"
                            placeholder="MM/YY"
                            value={paymentDetails.expiryDate}
                            onChange={(e) => setPaymentDetails(prev => ({...prev, expiryDate: e.target.value}))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            type="password"
                            value={paymentDetails.cvv}
                            onChange={(e) => setPaymentDetails(prev => ({...prev, cvv: e.target.value}))}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "upi" && (
                    <div>
                      <Label htmlFor="upiId">UPI ID</Label>
                      <Input
                        id="upiId"
                        placeholder="user@paytm"
                        value={paymentDetails.upiId}
                        onChange={(e) => setPaymentDetails(prev => ({...prev, upiId: e.target.value}))}
                        required
                      />
                    </div>
                  )}

                  {paymentMethod === "bank" && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="bankAccount">Account Number</Label>
                        <Input
                          id="bankAccount"
                          placeholder="1234567890"
                          value={paymentDetails.bankAccount}
                          onChange={(e) => setPaymentDetails(prev => ({...prev, bankAccount: e.target.value}))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="ifscCode">IFSC Code</Label>
                        <Input
                          id="ifscCode"
                          placeholder="SBIN0001234"
                          value={paymentDetails.ifscCode}
                          onChange={(e) => setPaymentDetails(prev => ({...prev, ifscCode: e.target.value}))}
                          required
                        />
                      </div>
                    </div>
                  )}

                  <Separator />

                  {/* Security Notice */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Lock className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Secure Payment</span>
                    </div>
                    <p className="text-xs text-blue-700">
                      Your payment is secured with 256-bit SSL encryption. We never store your card details.
                    </p>
                  </div>

                  {/* Pay Button */}
                  <Button
                    type="submit"
                    className="w-full bg-orange-600 hover:bg-orange-700"
                    size="lg"
                    disabled={!paymentMethod || processing}
                  >
                    {processing ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing Payment...
                      </div>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Pay ₹{booking.advanceAmount}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}