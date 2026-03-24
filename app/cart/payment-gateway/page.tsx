// frontend/app/cart/payment-gateway/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PaymentGateway } from "@/components/PaymentGateway";
import { ErrorBoundary } from "@/components/error-boundary";
import { useAuth } from "@/hooks/useAuth";
import type { OrderDetails } from "@/types/cart";
// import { processPayment, createOrder } from "@/utils/api";

export default function PaymentGatewayPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const pendingOrder = localStorage.getItem('pendingOrder');
    if (!pendingOrder) {
      router.push('/cart');
      return;
    }

    setOrderDetails(JSON.parse(pendingOrder));
    setIsLoading(false);
  }, [isAuthenticated, router]);

  const handlePaymentSuccess = async (paymentData: any) => {
    try {
      setIsLoading(true);
      
      if (!orderDetails) return;

      const updatedOrder = {
        ...orderDetails,
        paymentInfo: {
          ...orderDetails.paymentInfo,
          status: 'completed',
          transactionId: paymentData.transactionId,
        },
      };

      // const order = await createOrder(updatedOrder);
      
      // localStorage.setItem('completedOrder', JSON.stringify(order));
      localStorage.removeItem('pendingOrder');
      localStorage.removeItem('cart');
      
      router.push('/cart/checkout/confirmation');
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !orderDetails) {
    return <div>Loading...</div>;
  }

  return (
    <>
    </>
    // <ErrorBoundary>
    //   <PaymentGateway
    //     orderDetails={orderDetails}
    //     onPaymentSuccess={handlePaymentSuccess}
    //     onGoBack={() => router.push('/cart/checkout')}
    //   />
    // </ErrorBoundary>
  );
}