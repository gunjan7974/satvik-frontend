"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const headerProps = {
    cart: cart || {},
    cartTotal: cartData?.total || 0,
    isLoggedIn: isAuthenticated,
    isAdmin: user?.role === 'admin',
    username: user?.name,
    onViewCart: () => router.push('/cart'),
    onNavigateToMenu: () => router.push('/menu'),
    onLoginClick: () => router.push('/login'),
    onLogoutClick: handleLogout,
    onAdminClick: () => router.push('/admin'),
    onDashboardClick: () => {
      const role = user?.role || 'user';
      if (role === 'admin') router.push('/admin');
      else if (role === 'vendor') router.push('/vendor/dashboard');
      else if (role === 'sales') router.push('/sales/dashboard');
      else router.push('/profile');
    },
    onNavigateToHome: () => router.push('/'),
    onNavigateToBlog: () => router.push('/blog'),
    onNavigateToGallery: () => router.push('/gallery'),
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
    <div className="min-h-screen flex flex-col">
        <Header {...headerProps} />
      <main className="flex-1">{children}</main>
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
                router.push("/");
                break;
              case "menu":
                router.push("/menu");
                break;
              case "orders":
                router.push("/orders");
                break;
              case "events":
                router.push("/events");
                break;
              case "cart":
                router.push("/cart");
                break;
              case "login":
                router.push("/login");
                break;
              case "profile":
                router.push("/profile");
                break;
              default:
                router.push(`/${page}`);
            }
          }}
          isAuthenticated={safeHeaderProps.isLoggedIn}
        />
      )}
      <Chatbot />
    </div>
  );
}
