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
  const { cart, cartData, loading, updateQuantity, removeFromCart, clearCart } = useCart();
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // Helper to get items for both guest and auth modes
  const cartItems = isAuthenticated ? (
    cartData?.items.map((item: any) => {
      const food = item.food;
      const foodImage = food?.image ? (food.image.startsWith('http') ? food.image : `http://localhost:5000${food.image}`) : "";
      
      return {
        id: typeof food === 'string' ? food : food?._id,
        name: typeof food === 'string' ? (item.title || "Item") : food?.name,
        price: typeof food === 'string' ? (item.price || 0) : food?.price,
        quantity: item.quantity,
        image: foodImage || "https://placehold.co/300?text=No+Image",
        subtotal: item.subtotal,
        description: typeof food !== 'string' ? food?.description : "",
        category: typeof food !== 'string' ? (food?.category?.title || food?.category) : "General",
      };
    }) || []
  ) : (
    // Guest Mode: Create items from cartMap
    // Note: In a real app, we'd fetch these specific menuIds. For now, we use a basic placeholder if not found.
    Object.entries(cart).map(([id, qty]) => ({
      id,
      name: "Sattvik Item", // Placeholder since we don't have full data in guest mode without fetch
      price: 0, 
      quantity: qty,
      image: "https://placehold.co/300?text=Guest+Item",
      subtotal: 0,
      description: "",
      category: "General",
    }))
  );

  const cartTotal = isAuthenticated ? (cartData?.total || 0) : 0;

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
    if (!isAuthenticated) {
      // Prompt login before checkout
      router.push("/login?redirect=/cart/checkout");
      return;
    }
    router.push("/cart/checkout");
  };

  const handleContinueShopping = () => {
    router.push("/menu");
  };

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

