"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PaymentGateway } from "@/components/PaymentGateway";
import { ErrorBoundary } from "@/components/error-boundary";
import { useAuth } from "@/hooks/AuthContext";
import { useCart } from "@/hooks/CartContext";
import { apiClient } from "@/lib/api";
import { Loader2 } from "lucide-react";

export default function PaymentGatewayPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { clearCart } = useCart();
  const [orderDetails, setOrderDetails] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return router.push('/login');

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

      const finalOrderData = {
        ...orderDetails,
        isPaid: true,
        paymentInfo: paymentData,
        status: "Pending" // Initial status when placed
      };

      const response = await apiClient.createOrder(finalOrderData);
      
      if (response.success) {
        // Success! Clear the cart
        await clearCart();
        localStorage.removeItem('pendingOrder');
        const finalOrder = response.order || (response as any).data;
        localStorage.setItem('completedOrder', JSON.stringify(finalOrder));
        router.push('/cart/checkout/confirmation');
      } else {
        throw new Error(response.message || "Failed to create order after payment");
      }
    } catch (error) {
      console.error('Error processing payment success:', error);
      alert('Payment was successful but order creation failed. Please contact support.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !orderDetails) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-xl">
          <Loader2 className="h-12 w-12 animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Processing your order...</p>
        </div>
      </div>
    );
  }

  // Map pending order data to gateway props
  const gatewayCustomerInfo = {
    name: orderDetails.customer.name,
    phone: orderDetails.customer.phone,
    address: orderDetails.customer.address.line1 || "Store Pickup"
  };

  return (
    <ErrorBoundary>
      <PaymentGateway
        orderTotal={orderDetails.totalPrice}
        orderItems={orderDetails.orderItems}
        customerInfo={gatewayCustomerInfo}
        onPaymentSuccess={handlePaymentSuccess}
        onGoBack={() => router.push('/cart/checkout')}
      />
    </ErrorBoundary>
  );
}