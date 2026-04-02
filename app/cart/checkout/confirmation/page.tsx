'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { OrderConfirmation } from "@/components/OrderConfirmation";
import { ErrorBoundary } from "@/components/error-boundary";
import { useAuth } from "@/hooks/AuthContext";

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

        const parsedOrder = JSON.parse(completedOrder);
        console.log('Parsed order data:', parsedOrder);
        
        // Map backend order to OrderData format if needed
        const orderItemsList = parsedOrder.orderItems || parsedOrder.items || [];
        const mappedItems = orderItemsList.map((item: any) => {
          const itemPrice = item.price || (item.food?.price) || 0;
          return {
            id: item.food?._id || item.food || item.menu || item.id,
            name: item.name || item.title || (item.food?.title) || 'Item',
            price: itemPrice,
            quantity: item.quantity,
            subtotal: item.subtotal || (itemPrice * item.quantity)
          };
        });

        const subtotalValue = parsedOrder.totalPrice || parsedOrder.total || mappedItems.reduce((acc: number, item: any) => acc + item.subtotal, 0);

        const mappedOrder: OrderData = {
          _id: parsedOrder._id,
          orderNumber: parsedOrder.orderNumber || (parsedOrder._id ? parsedOrder._id.substring(0, 8) : `SK${Date.now().toString().slice(-6)}`),
          orderDate: parsedOrder.createdAt || new Date().toISOString(),
          status: parsedOrder.status || 'placed',
          name: parsedOrder.customer?.name || parsedOrder.name || 'Guest',
          email: parsedOrder.customer?.email || parsedOrder.email || '',
          phone: parsedOrder.customer?.phone || parsedOrder.phone || '',
          deliveryType: (parsedOrder.deliveryType || (parsedOrder.customer?.address?.line1 ? 'delivery' : 'pickup')) as 'delivery' | 'pickup',
          address: parsedOrder.customer?.address?.line1 || parsedOrder.address || '',
          city: parsedOrder.customer?.address?.city || parsedOrder.city || '',
          paymentMethod: (parsedOrder.paymentMethod || 'cod') as 'cod' | 'online',
          items: mappedItems,
          summary: parsedOrder.summary || {
            subtotal: subtotalValue,
            gst: Math.round(subtotalValue * 0.18),
            deliveryFee: subtotalValue > 500 ? 0 : 40,
            total: subtotalValue + Math.round(subtotalValue * 0.18) + (subtotalValue > 500 ? 0 : 40),
            totalItems: mappedItems.reduce((acc: number, item: any) => acc + (item.quantity || 0), 0)
          }
        };

        setOrderData(mappedOrder);
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
    // Keep the order in localStorage until they finish tracking
    router.push('/cart/checkout/confirmation/success/tracking');
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