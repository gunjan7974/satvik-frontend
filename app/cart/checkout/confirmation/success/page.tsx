// frontend/app/cart/checkout/success/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '../../../../../components/ui/card';
import { Button } from '../../../../../components/ui/button';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const [paymentData, setPaymentData] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem('paymentData');
    if (data) {
      setPaymentData(JSON.parse(data));
    }
  }, []);

  const handleContinueShopping = () => {
    // Clear payment data
    localStorage.removeItem('paymentData');
    router.push('/menu');
  };

  const handleViewOrders = () => {
    router.push('/orders');
  };

  if (!paymentData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <Card className="max-w-md w-full mx-4">
        <CardContent className="pt-6 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-green-600 mb-4">
            Payment Successful!
          </h1>
          <p className="text-gray-600 mb-6">
            Your order has been confirmed and will be delivered soon.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-600">Transaction ID:</p>
            <p className="font-medium">{paymentData.transactionId}</p>
            <p className="text-sm text-gray-600 mt-2">Amount Paid:</p>
            <p className="font-medium">₹{paymentData.amount}</p>
          </div>
          <div className="space-y-3">
            <Button
              onClick={handleViewOrders}
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              View Orders
            </Button>
            <Button
              variant="outline"
              onClick={handleContinueShopping}
              className="w-full"
            >
              Continue Shopping
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}