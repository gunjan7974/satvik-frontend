"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Chatbot } from "./Chatbot";
import { MobileBottomNav } from "./MobileBottomNav";
import { useAuth } from "@/hooks/AuthContext";
import { useCart } from "@/hooks/CartContext";

interface GlobalShellProps {
  children: React.ReactNode;
}

export function GlobalShell({ children }: GlobalShellProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const { cart, cartData, totalItems } = useCart();
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  // Trigger loading state when pathname changes
  useEffect(() => {
    setIsNavigating(false); // Stop when pathname is updated
  }, [pathname]);

  const handleNavigation = (path: string) => {
    if (path === pathname) return;
    setIsNavigating(true);
    setTimeout(() => {
      router.push(path);
    }, 50);
  };

  const handleLogout = () => {
    logout();
    handleNavigation('/login');
  };

  const headerProps = {
    cart: cart || {},
    cartTotal: cartData?.total || 0,
    isLoggedIn: isAuthenticated,
    isAdmin: user?.role === 'admin',
    username: user?.name,
    onViewCart: () => handleNavigation('/cart'),
    onNavigateToMenu: () => handleNavigation('/menu'),
    onLoginClick: () => handleNavigation('/login'),
    onLogoutClick: handleLogout,
    onAdminClick: () => handleNavigation('/admin'),
    onDashboardClick: () => {
      const role = (user as any)?.role || 'user';
      if (role === 'admin') handleNavigation('/admin');
      else if (role === 'vendor') handleNavigation('/vendor/dashboard');
      else if (role === 'sales') handleNavigation('/sales/dashboard');
      else handleNavigation('/profile');
    },
    onNavigateToHome: () => handleNavigation('/'),
    onNavigateToBlog: () => handleNavigation('/blog'),
    onNavigateToGallery: () => handleNavigation('/gallery'),
    onStartNav: () => setIsNavigating(true),
  };

  const safeHeaderProps = headerProps ?? {
    cart: {},
    isLoggedIn: false,
    onViewCart: () => {},
    onNavigateToMenu: () => {},
    onLoginClick: () => {},
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767.98px)");
    const handle = (e: MediaQueryListEvent | MediaQueryList) => setIsMobile(e.matches);

    setIsMobile(mq.matches);

    if (mq.addEventListener) {
      mq.addEventListener("change", handle as any);
      return () => mq.removeEventListener("change", handle as any);
    }
    if (mq.addListener) {
      mq.addListener(handle as any);
      return () => mq.removeListener(handle as any);
    }
  }, []);

  const isAdmin = pathname.startsWith("/admin") || pathname.startsWith("/sales");


  if (isAdmin) return <>{children}</>;

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Navigation Overlay */}
      <AnimatePresence>
        {isNavigating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center"
          >
            <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin shadow-xl"></div>
            <p className="mt-4 text-orange-600 font-bold tracking-widest uppercase text-sm">Loading...</p>
          </motion.div>
        )}
      </AnimatePresence>

      <Header {...headerProps} />
      <main className="flex-1 transition-all duration-300">
        <motion.div
          key={pathname}
          initial={{ opacity: 0.8, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-full h-full"
        >
          {children}
        </motion.div>
      </main>
      <Footer />


      {isMobile && (
        <MobileBottomNav
          currentPage={
            pathname === "/" ? "homepage" : (pathname.split("/")[1] || "home")
          }
          cartCount={totalItems}
          onNavigate={(page: string) => {
            switch (page) {
              case "home":
              case "homepage":
                handleNavigation("/");
                break;
              case "menu":
                handleNavigation("/menu");
                break;
              case "orders":
                handleNavigation("/orders");
                break;
              case "events":
                handleNavigation("/events");
                break;
              case "cart":
                handleNavigation("/cart");
                break;
              case "login":
                handleNavigation("/login");
                break;
              case "profile":
                handleNavigation("/profile");
                break;
              default:
                handleNavigation(`/${page}`);
            }
          }}
          isAuthenticated={safeHeaderProps.isLoggedIn}
        />
      )}
      <Chatbot />
    </div>
  );
}
