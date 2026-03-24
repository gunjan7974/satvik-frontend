import { Home, Menu as MenuIcon, ShoppingBag, User, Calendar } from "lucide-react";
import { motion } from "framer-motion";

interface MobileBottomNavProps {
  currentPage: string;
  cartCount: number;
  onNavigate: (page: string) => void;
  isAuthenticated: boolean;
}

export function MobileBottomNav({ currentPage, cartCount, onNavigate, isAuthenticated }: MobileBottomNavProps) {
  const navItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "menu", icon: MenuIcon, label: "Menu" },
    { id: "orders", icon: ShoppingBag, label: "Orders" },
    { id: "events", icon: Calendar, label: "Events" },
    { id: "cart", icon: ShoppingBag, label: "Cart" },
    { id: isAuthenticated ? "profile" : "login", icon: User, label: isAuthenticated ? "Profile" : "Login" }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50 safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id || 
                          (item.id === "home" && currentPage === "homepage") ||
                          (item.id === "orders" && (currentPage === "dashboard" || currentPage === "orderTracking"));
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="flex flex-col items-center justify-center flex-1 h-full relative"
            >
              <div className="relative">
                <Icon 
                  className={`w-6 h-6 ${isActive ? 'text-teal-600' : 'text-gray-600'}`} 
                  fill={isActive ? 'currentColor' : 'none'}
                />
                {item.id === "cart" && cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    {cartCount > 9 ? '9+' : cartCount}
                  </motion.span>
                )}
              </div>
              <span className={`text-xs mt-1 ${isActive ? 'text-teal-600' : 'text-gray-600'}`}>
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute top-0 left-0 right-0 h-0.5 bg-teal-600"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}