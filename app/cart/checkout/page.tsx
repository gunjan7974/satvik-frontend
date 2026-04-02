"use client";

import { Checkout } from "@/components/Checkout";
import { ErrorBoundary } from "@/components/error-boundary";
import { useAuth } from "@/hooks/AuthContext";
import { useCart } from "@/hooks/CartContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiClient } from "@/lib/api";

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { cartData, loading, clearCart } = useCart();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const cartItems = cartData?.items.map((item: any) => ({
    id: typeof item.food === 'string' ? item.food : item.food?._id,
    name: typeof item.food === 'string' ? item.title : item.food?.title,
    price: typeof item.food === 'string' ? item.price : item.food?.price,
    quantity: item.quantity,
    image: item.image || (typeof item.food !== 'string' ? item.food?.image : ""),
    subtotal: item.subtotal,
    description: typeof item.food !== 'string' ? item.food?.description : "No description",
    category: typeof item.food !== 'string' ? item.food?.category : "General",
  })) || [];

  const handlePlaceOrder = async (orderData: any) => {
    if (!isAuthenticated) return router.push("/login");

    try {
      setIsPlacingOrder(true);
      
      // Calculate local total since backend cart might not provide it
      const calculatedTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      const completeOrderData = {
        customer: {
          name: orderData.name || user?.name || "Guest User",
          email: orderData.email || user?.email || "",
          phone: orderData.phone || "",
          address: orderData.deliveryType === "delivery" ? {
            line1: orderData.address || "",
            line2: orderData.landmark || "",
            city: orderData.city || "Raipur",
            state: "Chhattisgarh",
            postalCode: orderData.pincode || "",
            country: "India",
          } : {},
        },
        orderItems: cartItems.map((item) => ({
          food: String(item.id),
          quantity: item.quantity,
          name: item.name,
          price: item.price
        })),
        totalPrice: calculatedTotal,
        status: "Pending",
        paymentMethod: orderData.paymentMethod || "cod",
      };

      if (orderData.paymentMethod === 'online') {
        localStorage.setItem("pendingOrder", JSON.stringify(completeOrderData));
        router.push("/cart/payment-gateway");
        return;
      }

      const response = await apiClient.createOrder(completeOrderData as any);
      
      if (response.success) {
        // Success! Clear the cart so it doesn't show up again
        await clearCart();
        const finalOrder = response.order || (response as any).data;
        localStorage.setItem("completedOrder", JSON.stringify(finalOrder));
        router.push("/cart/checkout/confirmation");
      } else {
        throw new Error(response.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handleGoBack = () => {
    router.push("/cart");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Please add some items to your cart before proceeding to checkout.</p>
          <button
            onClick={() => router.push("/menu")}
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
      <Checkout
        cartItems={cartItems}
        onGoBack={handleGoBack}
        onPlaceOrder={handlePlaceOrder}
      />
    </ErrorBoundary>
  );
}
