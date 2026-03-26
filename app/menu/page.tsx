"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu } from "../../components/Menu";
import { apiClient } from "../../lib/api";
import { useAuth } from "../../hooks/AuthContext";
import { Loader2 } from "lucide-react";

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<any>(null);
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchData();
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [menusRes, cartRes] = await Promise.all([
        apiClient.getMenus({ page: 1, limit: 100 }),
        isAuthenticated ? apiClient.getCart().catch(() => null) : Promise.resolve(null)
      ]);

      const items = menusRes && (menusRes as any).menus ? (menusRes as any).menus : [];
      setMenuItems(items.map((m: any, idx: number) => ({
        id: m._id || idx,
        name: m.title,
        description: m.description,
        price: m.price || 0,
        image: m.image ? `http://localhost:5000${m.image}` : "https://via.placeholder.com/300?text=No+Image",
        category: m.category ? (m.category.title || m.category) : 'Uncategorized',
        isVeg: m.isVeg !== undefined ? m.isVeg : true,
        isAvailable: m.isAvailable !== false,
        serverId: m._id
      })));

      if (cartRes && (cartRes as any).success) {
        setCart((cartRes as any).cart);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCartItemsMap = () => {
    if (!cart || !cart.items) return {};
    const cartMap: { [key: string]: number } = {};
    cart.items.forEach((item: any) => {
      const menuId = typeof item.menu === 'string' ? item.menu : item.menu?._id;
      if (menuId) cartMap[menuId] = item.quantity;
    });
    return cartMap;
  };

  const handleAddToCart = async (id: any) => {
    if (!isAuthenticated) return router.push("/login");
    try {
      const res = await apiClient.addToCart(id, 1);
      if (res.success) setCart(res.cart);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveFromCart = async (id: any) => {
    if (!isAuthenticated) return;
    try {
      const currentQuantity = getCartItemsMap()[id] || 0;
      if (currentQuantity <= 1) {
        const res = await apiClient.removeFromCart(id);
        if (res.success) setCart(res.cart);
      } else {
        const res = await apiClient.updateCartItem(id, currentQuantity - 1);
        if (res.success) setCart(res.cart);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
        <p className="mt-4 text-gray-500 font-medium">Serving flavors...</p>
      </div>
    );
  }

  return (
    <Menu
      cart={getCartItemsMap()}
      onAddToCart={handleAddToCart}
      onRemoveFromCart={handleRemoveFromCart}
      onViewCart={() => router.push("/cart")}
      onLoginClick={() => router.push("/login")}
      onProfileClick={() => router.push("/profile")}
      menuItems={menuItems}
    />
  );
}