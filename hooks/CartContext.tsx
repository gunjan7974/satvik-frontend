'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiClient, Cart } from '@/lib/api';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: { [key: string]: number };
  cartData: Cart | null;
  loading: boolean;
  addToCart: (menuId: string, quantity?: number) => Promise<void>;
  removeFromCart: (menuId: string) => Promise<void>;
  updateQuantity: (menuId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartData, setCartData] = useState<Cart | null>(null);
  const [cartMap, setCartMap] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Load guest cart from localStorage on mount
  useEffect(() => {
    if (!isAuthenticated) {
      const savedCart = localStorage.getItem('guest_cart');
      if (savedCart) {
        try {
          setCartMap(JSON.parse(savedCart));
        } catch (e) {
          console.error("Failed to parse guest cart", e);
        }
      }
    }
  }, [isAuthenticated]);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const res = await apiClient.getCart();
      if (res.success) {
        setCartData(res.cart);
        const map: { [key: string]: number } = {};
        res.cart?.items?.forEach((item: any) => {
          const menuId = typeof item.menu === 'string' ? item.menu : item.menu?._id;
          if (menuId) map[menuId] = item.quantity;
        });
        setCartMap(map);
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const updateLocalStorage = (newMap: { [key: string]: number }) => {
    setCartMap(newMap);
    localStorage.setItem('guest_cart', JSON.stringify(newMap));
  };

  const addToCart = async (menuId: string, quantity: number = 1) => {
    if (!isAuthenticated) {
      const newMap = { ...cartMap };
      newMap[menuId] = (newMap[menuId] || 0) + quantity;
      updateLocalStorage(newMap);
      return;
    }
    try {
      const res = await apiClient.addToCart(menuId, quantity);
      if (res.success) {
        setCartData(res.cart);
        refreshCart();
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const removeFromCart = async (menuId: string) => {
    if (!isAuthenticated) {
      const newMap = { ...cartMap };
      delete newMap[menuId];
      updateLocalStorage(newMap);
      return;
    }
    try {
      const res = await apiClient.removeFromCart(menuId);
      if (res.success) {
        refreshCart();
      }
    } catch (error) {
      console.error('Failed to remove from cart:', error);
    }
  };

  const updateQuantity = async (menuId: string, quantity: number) => {
    if (!isAuthenticated) {
      if (quantity <= 0) {
        removeFromCart(menuId);
      } else {
        const newMap = { ...cartMap };
        newMap[menuId] = quantity;
        updateLocalStorage(newMap);
      }
      return;
    }
    try {
      const currentQty = cartMap[menuId] || 0;
      if (quantity <= 0) {
        await removeFromCart(menuId);
      } else if (quantity > currentQty) {
        const res = await apiClient.updateCartItem(menuId, 'increase');
        if (res.success) refreshCart();
      } else if (quantity < currentQty) {
        const res = await apiClient.updateCartItem(menuId, 'decrease');
        if (res.success) refreshCart();
      }
    } catch (error) {
      console.error('Failed to update cart:', error);
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) {
      updateLocalStorage({});
      return;
    }
    try {
      const res = await apiClient.clearCart();
      if (res.success) {
        setCartData(null);
        setCartMap({});
      }
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  };

  const totalItems = Object.values(cartMap).reduce((sum, qty) => sum + qty, 0);
  const totalPrice = cartData?.total || 0; // In guest mode, this might need more logic if backend prices are needed

  return (
    <CartContext.Provider
      value={{
        cart: cartMap,
        cartData,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        refreshCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
