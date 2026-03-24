'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { OrderConfirmation } from "@/components/OrderConfirmation";
import { ErrorBoundary } from "@/components/error-boundary";
import { useAuth } from "@/hooks/useAuth";

// Define the expected order data structure
interface OrderData {
  _id?: string;
  orderNumber?: string;
  orderDate?: string;
  status?: string;
  // Frontend data
  name: string;
  email: string;
  phone: string;
  deliveryType: 'delivery' | 'pickup';
  address?: string;
  landmark?: string;
  city: string;
  pincode?: string;
  paymentMethod: 'cod' | 'online';
  instructions?: string;
  items: Array<{
    id: string | number;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    subtotal?: number;
  }>;
  summary: {
    subtotal: number;
    gst: number;
    deliveryFee: number;
    total: number;
    totalItems: number;
  };
}

export default function OrderConfirmationPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrderDetails = () => {
      if (!isAuthenticated) {
        setError('Please login to view order confirmation');
        router.push('/login');
        return;
      }

      try {
        const completedOrder = localStorage.getItem('completedOrder');
        console.log('Retrieved completedOrder from localStorage:', completedOrder);
        
        if (!completedOrder) {
          setError('No order found. Please place an order first.');
          router.push('/cart');
          return;
        }

        const parsedOrder = JSON.parse(completedOrder) as OrderData;
        console.log('Parsed order data:', parsedOrder);
        
        // Validate that we have the required order data
        if (!parsedOrder.items || !parsedOrder.name) {
          console.error('Missing required order data:', {
            hasItems: !!parsedOrder.items,
            hasName: !!parsedOrder.name,
            orderData: parsedOrder
          });
          setError('Invalid order data. Please place a new order.');
          localStorage.removeItem('completedOrder');
          router.push('/cart');
          return;
        }

        setOrderData(parsedOrder);
        setError(null);
      } catch (err) {
        console.error('Error loading order details:', err);
        setError('Failed to load order details. Please try again.');
        localStorage.removeItem('completedOrder');
        router.push('/cart');
      } finally {
        setIsLoading(false);
      }
    };

    loadOrderDetails();
  }, [isAuthenticated, router]);

  const handleViewOrders = () => {
    localStorage.removeItem('completedOrder');
    router.push('/orders');
  };

  const handleContinueShopping = () => {
    localStorage.removeItem('completedOrder');
    router.push('/menu');
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order confirmation...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/cart')}
            className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Back to Cart
          </button>
        </div>
      </div>
    );
  }

  // Show order not found state
  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h2>
          <p className="text-gray-600 mb-6">
            We couldn't find your order details. Please place a new order.
          </p>
          <button
            onClick={() => router.push('/menu')}
            className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <OrderConfirmation
        orderData={orderData}
        onGoHome={handleContinueShopping}
        onTrackOrder={handleViewOrders}
      />
    </ErrorBoundary>
  );
}