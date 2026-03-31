"use client";

import { useRouter } from "next/navigation";
import { Cart } from "@/components/Cart";
import { ErrorBoundary } from "@/components/error-boundary";
import { useAuth } from "@/hooks/AuthContext";
import { useCart } from "@/hooks/CartContext";
import { useState } from "react";

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { cartData, loading, updateQuantity, removeFromCart, clearCart } = useCart();
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const cartItems = cartData?.items.map((item: any) => {
    const food = item.food;
    const foodImage = food?.image ? (food.image.startsWith('http') ? food.image : `http://localhost:5000${food.image}`) : "";
    
    return {
      id: typeof food === 'string' ? food : food?._id,
      name: typeof food === 'string' ? item.title : food?.name,
      price: typeof food === 'string' ? item.price : food?.price,
      quantity: item.quantity,
      image: foodImage || "https://placehold.co/300?text=No+Image",
      subtotal: item.subtotal,
      description: typeof food !== 'string' ? food?.description : "",
      category: typeof food !== 'string' ? (food?.category?.title || food?.category) : "General",
    };
  }) || [];

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    setIsUpdating(itemId);
    await updateQuantity(itemId, newQuantity);
    setIsUpdating(null);
  };

  const handleRemoveItem = async (itemId: string) => {
    setIsUpdating(itemId);
    await removeFromCart(itemId);
    setIsUpdating(null);
  };

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) return;
    router.push("/cart/checkout");
  };

  const handleContinueShopping = () => {
    router.push("/menu");
  };

  if (!isAuthenticated && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view your cart.</p>
          <button
            onClick={() => router.push("/login")}
            className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Login to Continue
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <main className="min-h-screen bg-gray-50">
        <Cart
          cartItems={cartItems}
          cartTotal={cartData?.total || 0}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearCart={clearCart}
          onProceedToCheckout={handleProceedToCheckout}
          onContinueShopping={handleContinueShopping}
          isUpdating={isUpdating}
          isLoading={loading}
        />
      </main>
    </ErrorBoundary>
  );
}

