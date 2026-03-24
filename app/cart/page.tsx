"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Cart } from "@/components/Cart";
import { ErrorBoundary } from "@/components/error-boundary";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/api";
import type { CartItem } from "@/types/cart";

// Backend cart item structure
interface BackendCartItem {
  _id?: string;
  menu: string | {
    _id: string;
    title: string;
    price: number;
    image?: string;
  };
  title: string;
  price: number;
  quantity: number;
  subtotal: number;
  image?: string;
}

interface BackendCart {
  _id: string;
  items: BackendCartItem[];
  total: number;
}

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cartTotal, setCartTotal] = useState(0);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // const fetchCartData = async () => {
  //   if (!isAuthenticated) {
  //     setIsLoading(false);
  //     return;
  //   }

  //   try {
  //     setIsLoading(true);
  //     const response = await apiClient.getCart();

  //     if (response.success && response.cart) {
  //       const backendCart: BackendCart = response.cart;

  //       // ✅ Convert backend cart items to frontend CartItem format (with default fields)
  //       const convertedItems: CartItem[] = backendCart.items.map((item) => {
  //         const menuId =
  //           typeof item.menu === "string" ? item.menu : item.menu._id;
  //         const menuName =
  //           typeof item.menu === "string" ? item.title : item.menu.title;
  //         const menuPrice =
  //           typeof item.menu === "string" ? item.price : item.menu.price;
  //         const menuImage =
  //           item.image || (typeof item.menu !== "string" ? item.menu.image : "");

  //         return {
  //           id: menuId,
  //           name: menuName,
  //           price: menuPrice,
  //           quantity: item.quantity,
  //           image: menuImage,
  //           subtotal: item.subtotal,
  //           // ✅ Added missing required fields
  //           description: "No description available",
  //           category: "General",
  //         };
  //       });

  //       setCartItems(convertedItems);
  //       setCartTotal(backendCart.total);
  //     } else {
  //       setCartItems([]);
  //       setCartTotal(0);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching cart:", error);
  //     setCartItems([]);
  //     setCartTotal(0);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchCartData();
  // }, [isAuthenticated]);

  // const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
  //   if (!isAuthenticated) {
  //     router.push("/login");
  //     return;
  //   }

  //   try {
  //     setIsUpdating(String(itemId));

  //     if (newQuantity === 0) {
  //       await apiClient.removeFromCart(String(itemId));
  //     } else {
  //       await apiClient.updateCartItem(String(itemId), newQuantity);
  //     }

  //     await fetchCartData();
  //   } catch (error) {
  //     console.error("Error updating cart item:", error);
  //     alert("Failed to update cart. Please try again.");
  //   } finally {
  //     setIsUpdating(null);
  //   }
  // };

  // const handleRemoveItem = async (itemId: number) => {
  //   if (!isAuthenticated) {
  //     router.push("/login");
  //     return;
  //   }

  //   try {
  //     setIsUpdating(String(itemId));
  //     await apiClient.removeFromCart(String(itemId));
  //     await fetchCartData();
  //   } catch (error) {
  //     console.error("Error removing cart item:", error);
  //     alert("Failed to remove item from cart. Please try again.");
  //   } finally {
  //     setIsUpdating(null);
  //   }
  // };

  // const handleClearCart = async () => {
  //   if (!isAuthenticated) {
  //     router.push("/login");
  //     return;
  //   }

  //   try {
  //     setIsLoading(true);
  //     await apiClient.clearCart();
  //     setCartItems([]);
  //     setCartTotal(0);
  //   } catch (error) {
  //     console.error("Error clearing cart:", error);
  //     alert("Failed to clear cart. Please try again.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const handleProceedToCheckout = () => {
  //   if (cartItems.length === 0) {
  //     alert("Your cart is empty!");
  //     return;
  //   }

  //   if (!isAuthenticated) {
  //     localStorage.setItem("redirectAfterLogin", "/cart/checkout");
  //     router.push("/login");
  //     return;
  //   }

  //   router.push("/cart/checkout");
  // };

  // const handleContinueShopping = () => {
  //   router.push("/menu");
  // };

  if (!isAuthenticated && !isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Please Login
          </h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to view your cart and place orders.
          </p>
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

  if (isLoading) {
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
        {/* <Cart
          cartItems={cartItems}
          cartTotal={cartTotal}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
          onProceedToCheckout={handleProceedToCheckout}
          onContinueShopping={handleContinueShopping}
          isUpdating={isUpdating}
          isLoading={isLoading}
        /> */}
      </main>
    </ErrorBoundary>
  );
}
