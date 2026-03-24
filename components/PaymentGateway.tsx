import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  Wallet, 
  Shield, 
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
  Download
} from "lucide-react";
import { motion } from "framer-motion";

interface PaymentGatewayProps {
  orderTotal: number;
  orderItems: any[];
  customerInfo: any;
  onPaymentSuccess: (paymentData: any) => void;
  onGoBack: () => void;
}

type PaymentMethod = 'card' | 'upi' | 'netbanking' | 'wallet' | 'cod';

export function PaymentGateway({ orderTotal, orderItems, customerInfo, onPaymentSuccess, onGoBack }: PaymentGatewayProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'failed'>('idle');
  const [error, setError] = useState('');

  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('');

  const convenienceFee = selectedMethod === 'cod' ? 0 : Math.round(orderTotal * 0.02); // 2% convenience fee
  const totalAmount = orderTotal + convenienceFee;

  const paymentMethods = [
    {
      id: 'card' as PaymentMethod,
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Visa, Mastercard, RuPay'
    },
    {
      id: 'upi' as PaymentMethod,
      name: 'UPI',
      icon: Smartphone,
      description: 'Google Pay, PhonePe, Paytm'
    },
    {
      id: 'netbanking' as PaymentMethod,
      name: 'Net Banking',
      icon: Building2,
      description: 'All major banks'
    },
    {
      id: 'wallet' as PaymentMethod,
      name: 'Digital Wallet',
      icon: Wallet,
      description: 'Paytm, Amazon Pay'
    },
    {
      id: 'cod' as PaymentMethod,
      name: 'Cash on Delivery',
      icon: CheckCircle,
      description: 'Pay when you receive'
    }
  ];

  const banks = [
    'State Bank of India',
    'HDFC Bank',
    'ICICI Bank',
    'Axis Bank',
    'Punjab National Bank',
    'Bank of Baroda',
    'Canara Bank',
    'Union Bank of India'
  ];

  const handlePayment = async () => {
    setIsProcessing(true);
    setError('');

    // Validate payment details based on selected method
    if (selectedMethod === 'card') {
      if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name) {
        setError('Please fill all card details');
        setIsProcessing(false);
        return;
      }
    } else if (selectedMethod === 'upi') {
      if (!upiId) {
        setError('Please enter UPI ID');
        setIsProcessing(false);
        return;
      }
    } else if (selectedMethod === 'netbanking') {
      if (!selectedBank) {
        setError('Please select a bank');
        setIsProcessing(false);
        return;
      }
    }

    // Simulate payment processing
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate random success/failure for demo (90% success rate)
      const isSuccess = Math.random() > 0.1;
      
      if (isSuccess) {
        setPaymentStatus('success');
        const paymentData = {
          transactionId: `TXN${Date.now()}`,
          paymentMethod: selectedMethod,
          amount: totalAmount,
          timestamp: new Date().toISOString(),
          status: 'success'
        };
        
        setTimeout(() => {
          onPaymentSuccess(paymentData);
        }, 2000);
      } else {
        setPaymentStatus('failed');
        setError('Payment failed. Please try again.');
      }
    } catch (err) {
      setPaymentStatus('failed');
      setError('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const generatePaymentReceipt = () => {
    const paymentData = {
      transactionId: `TXN${Date.now()}`,
      paymentMethod: selectedMethod,
      amount: totalAmount,
      timestamp: new Date().toISOString(),
      status: 'success'
    };

    const receiptContent = `
SATTVIK KALEVA - PAYMENT RECEIPT
===============================

TRANSACTION SUCCESSFUL
Payment Date: ${new Date().toLocaleDateString('en-IN')}
Payment Time: ${new Date().toLocaleTimeString('en-IN')}

PAYMENT DETAILS:
Transaction ID: ${paymentData.transactionId}
Payment Method: ${selectedMethod.toUpperCase()}
Status: PAID SUCCESSFULLY
Amount: ₹${totalAmount}

CUSTOMER INFORMATION:
Name: ${customerInfo.name}
Phone: ${customerInfo.phone}
Address: ${customerInfo.address}

ORDER SUMMARY:
${orderItems.map(item => `${item.name} x ${item.quantity} - ₹${item.price * item.quantity}`).join('\n')}

BILLING BREAKDOWN:
Subtotal: ₹${orderTotal}
${convenienceFee > 0 ? `Convenience Fee: ₹${convenienceFee}` : ''}
Total Paid: ₹${totalAmount}

RESTAURANT DETAILS:
Sattvik Kaleva
Pure Vegetarian Restaurant
New Dhamtari Rd, opp. Mahadev Tata motors
Devpuri, Raipur, Chhattisgarh 492015
Phone: 96449 74442
Email: tsrijanalifoodnservices@gmail.com
Timing: 10:00 AM - 10:00 PM

Thank you for your payment!
Your order is being prepared with care.
🌱 100% Pure Vegetarian • Fresh & Authentic
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Sattvik-Kaleva-Payment-Receipt-${paymentData.transactionId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-lg mx-auto px-4"
        >
          <Card className="text-center">
            <CardContent className="pt-6 pb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h2>
                <div className="bg-green-50 p-4 rounded-lg mb-4">
                  <p className="text-green-800 font-semibold text-lg">₹{totalAmount} Paid Successfully</p>
                  <p className="text-green-700 text-sm">Transaction ID: TXN{Date.now().toString().slice(-8)}</p>
                </div>
                <p className="text-gray-600 mb-4">
                  Your order has been confirmed and payment processed successfully. 
                  Your delicious meal is being prepared with care!
                </p>
              </div>
              
              <div className="space-y-3">
                <Button 
                  onClick={generatePaymentReceipt}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                  size="lg"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Payment Receipt PDF
                </Button>
                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    Receipt will be downloaded automatically • Redirecting to order confirmation...
                  </p>
                </div>
              </div>
              
              <div className="mt-6 p-3 bg-blue-50 rounded-lg">
                <p className="text-blue-800 font-medium text-sm">🎉 Payment completed successfully!</p>
                <p className="text-blue-700 text-xs mt-1">
                  Your order is now being prepared. You'll receive updates shortly.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (paymentStatus === 'failed') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md mx-auto px-4"
        >
          <Card className="text-center">
            <CardContent className="pt-6 pb-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="mb-2 text-red-600">Payment Failed</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <div className="space-y-2">
                <Button 
                  onClick={() => {
                    setPaymentStatus('idle');
                    setError('');
                  }}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                >
                  Try Again
                </Button>
                <Button variant="outline" onClick={onGoBack} className="w-full">
                  Go Back
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Button 
          variant="outline" 
          onClick={onGoBack}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Checkout
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Methods */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span>Secure Payment</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedMethod} onValueChange={(value: PaymentMethod) => setSelectedMethod(value)}>
                  <div className="space-y-3">
                    {paymentMethods.map((method) => {
                      const IconComponent = method.icon;
                      return (
                        <div key={method.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                          <RadioGroupItem value={method.id} id={method.id} />
                          <div className="flex items-center space-x-3 flex-1">
                            <IconComponent className="h-5 w-5 text-gray-600" />
                            <div>
                              <label htmlFor={method.id} className="font-medium cursor-pointer">
                                {method.name}
                              </label>
                              <p className="text-sm text-gray-500">{method.description}</p>
                            </div>
                          </div>
                          {method.id === 'cod' && (
                            <Badge variant="outline" className="text-green-600">No Fee</Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Payment Details Form */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedMethod === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardDetails.number}
                        onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                        maxLength={19}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input
                          id="expiry"
                          placeholder="MM/YY"
                          value={cardDetails.expiry}
                          onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                          maxLength={4}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="cardName">Cardholder Name</Label>
                      <Input
                        id="cardName"
                        placeholder="John Doe"
                        value={cardDetails.name}
                        onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                      />
                    </div>
                  </div>
                )}

                {selectedMethod === 'upi' && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="upiId">UPI ID</Label>
                      <Input
                        id="upiId"
                        placeholder="yourname@paytm"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                      />
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-700">
                        You will receive a payment request on your UPI app. Please approve it to complete the transaction.
                      </p>
                    </div>
                  </div>
                )}

                {selectedMethod === 'netbanking' && (
                  <div className="space-y-4">
                    <div>
                      <Label>Select Your Bank</Label>
                      <RadioGroup value={selectedBank} onValueChange={setSelectedBank}>
                        <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
                          {banks.map((bank) => (
                            <div key={bank} className="flex items-center space-x-2">
                              <RadioGroupItem value={bank} id={bank} />
                              <label htmlFor={bank} className="text-sm cursor-pointer">{bank}</label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                )}

                {selectedMethod === 'wallet' && (
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-purple-700">
                      You will be redirected to your wallet provider to complete the payment.
                    </p>
                  </div>
                )}

                {selectedMethod === 'cod' && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-700">
                      Pay cash when your order is delivered. Please keep the exact amount ready.
                    </p>
                  </div>
                )}

                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-red-700">{error}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {orderItems.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.name} × {item.quantity}</span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₹{orderTotal}</span>
                </div>
                {convenienceFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Convenience Fee</span>
                    <span>₹{convenienceFee}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total Amount</span>
                  <span>₹{totalAmount}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Delivery Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p><strong>Name:</strong> {customerInfo.name}</p>
                <p><strong>Phone:</strong> {customerInfo.phone}</p>
                <p><strong>Address:</strong> {customerInfo.address}</p>
              </CardContent>
            </Card>

            <Button 
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full bg-orange-600 hover:bg-orange-700"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>Pay ₹{totalAmount}</>
              )}
            </Button>

            <div className="text-center text-xs text-gray-500">
              <p>🔒 Your payment information is secure and encrypted</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}