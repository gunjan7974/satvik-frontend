"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu } from "../../components/Menu";
import { apiClient } from "../../lib/api";
import { useAuth } from "../../hooks/AuthContext";

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<any>(null);
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // Fetch menu items
  useEffect(() => {
    let mounted = true;
    
    const fetchData = async () => {
      try {
        const [menusRes, cartRes] = await Promise.all([
          apiClient.getMenus({ page: 1, limit: 100 }),
          isAuthenticated ? apiClient.getCart().catch(() => null) : Promise.resolve(null)
        ]);

        if (mounted) {
          // Process menu items
          const items = menusRes && menusRes.menus ? menusRes.menus : [];
          setMenuItems(items.map((m: any, idx: number) => ({
            id: m._id || idx,
            name: m.title,
            description: m.description,
            price: m.price || 0,
            image: m.image || '',
            category: m.category ? (m.category.title || '') : (m.category || ''),
            isVeg: true,
            isAvailable: m.isAvailable !== false,
            serverId: m._id
          })));

          // Set cart data if authenticated
          if (cartRes && cartRes.success) {
            setCart(cartRes.cart);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        if (mounted) {
          setMenuItems([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => { mounted = false };
  }, [isAuthenticated]);

  // Convert cart to the format expected by Menu component
  const getCartItemsMap = () => {
    if (!cart || !cart.items) return {};
    
    const cartMap: { [key: string]: number } = {};
    cart.items.forEach((item: any) => {
      const menuId = typeof item.menu === 'string' ? item.menu : item.menu?._id;
      if (menuId) {
        cartMap[menuId] = item.quantity;
      }
    });
    return cartMap;
  };

  const handleAddToCart = async (itemId: number) => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    try {
      const serverId = menuItems.find(item => item.id === itemId)?.serverId;
      if (!serverId) return;

      const response = await apiClient.addToCart(serverId, 1);
      if (response.success) {
        setCart(response.cart);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    }
  };

  const handleRemoveFromCart = async (itemId: number) => {
    if (!isAuthenticated) return;

    try {
      const serverId = menuItems.find(item => item.id === itemId)?.serverId;
      if (!serverId) return;

      const currentQuantity = getCartItemsMap()[serverId] || 0;
      
      if (currentQuantity <= 1) {
        // Remove item completely
        const response = await apiClient.removeFromCart(serverId);
        if (response.success) {
          setCart(response.cart);
        }
      } else {
        // Decrease quantity
        const response = await apiClient.updateCartItem(serverId, currentQuantity - 1);
        if (response.success) {
          setCart(response.cart);
        }
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      alert('Failed to update cart. Please try again.');
    }
  };

  const handleViewCart = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    router.push("/cart");
  };

  const handleLoginClick = () => {
    router.push("/login");
  };

  const handleProfileClick = () => {
    router.push("/profile");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    // <Menu
    //   cart={getCartItemsMap()}
    //   onAddToCart={handleAddToCart}
    //   onRemoveFromCart={handleRemoveFromCart}
    //   onViewCart={handleViewCart}
    //   onLoginClick={handleLoginClick}
    //   onProfileClick={handleProfileClick}
    //   menuItems={menuItems}
    // />
    <>
    </>
  );
}