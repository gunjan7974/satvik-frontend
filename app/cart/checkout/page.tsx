"use client";

import { Checkout } from "@/components/Checkout";
import { ErrorBoundary } from "@/components/error-boundary";
import { useAuth } from "@/hooks/useAuth";
import type { CartItem } from "@/types/cart";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // ✅ Default data with all required fields (no type error)
  const defaultCart: CartItem[] = [
    {
      id: 1,
      name: "Paneer Butter Masala",
      description: "Soft paneer cubes cooked in a creamy tomato gravy",
      category: "Main Course",
      price: 220,
      quantity: 2,
      image: "/images/paneer-butter-masala.jpg",
    },
    {
      id: 2,
      name: "Butter Naan",
      description: "Tandoor baked naan brushed with butter",
      category: "Breads",
      price: 40,
      quantity: 3,
      image: "/images/butter-naan.jpg",
    },
  ];

  // ✅ Simulate loading cart
  useEffect(() => {
    const loadCart = () => {
      if (!isAuthenticated) {
        localStorage.setItem("redirectAfterLogin", "/cart/checkout");
        router.push("/login");
        return;
      }

      setIsLoading(true);
      setTimeout(() => {
        setCartItems(defaultCart);
        setCartTotal( 0);
        setIsLoading(false);
      }, 500);
    };

    loadCart();
  }, [isAuthenticated, router]);

  const handlePlaceOrder = async (orderData: any) => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    try {
      setIsPlacingOrder(true);
      
      const completeOrderData = {
        customer: {
          name: orderData.name || user?.name || "Guest User",
          email: orderData.email || user?.email || "guest@example.com",
          phone: orderData.phone || "9876543210",
          address:
            orderData.deliveryType === "delivery"
              ? {
                  line1: orderData.address || "Default Street",
                  line2: orderData.landmark || "",
                  city: orderData.city || "Raipur",
                  state: "Chhattisgarh",
                  postalCode: orderData.pincode || "492001",
                  country: "India",
                }
              : {},
        },
        items: cartItems.map((item) => ({
          menu: String(item.id),
          title: item.name,
          price: item.price,
          quantity: item.quantity,
          subtotal: item.price * item.quantity,
        })),
        total: cartItems.reduce((acc, current) => acc + (current.price * current.quantity), 0),
        status: "placed",
        paymentMethod: orderData.paymentMethod || "cod",
      };

      const response = await apiClient.createOrder(completeOrderData);
      
      if (response.success && response.data) {
        localStorage.setItem("completedOrder", JSON.stringify(response.data));
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0 && !isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-6">
            Please add some items to your cart before proceeding to checkout.
          </p>
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
        // cartTotal={cartTotal}
        onGoBack={handleGoBack}
        onPlaceOrder={handlePlaceOrder}
        // isPlacingOrder={isPlacingOrder}
        // defaultValues={{
        //   name: user?.name || "Guest User",
        //   email: user?.email || "guest@example.com",
        //   city: "Raipur",
        // }}
      />
    </ErrorBoundary>
  );
}
