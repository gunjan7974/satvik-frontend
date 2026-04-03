"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu } from "../../components/Menu";
import { apiClient } from "../../lib/api";
import { useAuth } from "../../hooks/AuthContext";
import { useCart } from "../../hooks/CartContext";
import { Loader2 } from "lucide-react";

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { cart, addToCart, removeFromCart, updateQuantity, refreshCart } = useCart();
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
        image: m.image ? `http://localhost:5000${m.image}` : "https://placehold.co/300?text=No+Image",
        category: m.category ? (m.category.title || m.category) : 'Uncategorized',
        isVeg: m.isVeg !== undefined ? m.isVeg : true,
        isAvailable: m.isAvailable !== false,
        serverId: m._id
      })));

      // Cart fetching is now handled by CartContext
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (id: any) => {
    await addToCart(id);
    router.push("/cart");
  };

  const handleRemoveFromCart = async (id: any) => {
    if (!isAuthenticated) return;
    const currentQuantity = cart[id] || 0;
    await updateQuantity(id, currentQuantity - 1);
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
      cart={cart}
      onAddToCart={handleAddToCart}
      onRemoveFromCart={handleRemoveFromCart}
      onViewCart={() => router.push("/cart")}
      onLoginClick={() => router.push("/login")}
      onProfileClick={() => router.push("/profile")}
      menuItems={menuItems}
    />
  );
}