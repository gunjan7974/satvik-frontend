"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Chatbot } from "./Chatbot";
import { MobileBottomNav } from "./MobileBottomNav";

interface GlobalShellProps {
  children: React.ReactNode;
  headerProps: {
    cart: { [key: number]: number };
    onViewCart: () => void;
    onNavigateToMenu: () => void;
    onLoginClick: () => void;
    onLogoutClick?: () => void;
    onAdminClick?: () => void;
    onDashboardClick?: () => void;
    isLoggedIn: boolean;
    isAdmin?: boolean;
    username?: string;
    onNavigateToHome?: () => void;
    onNavigateToBlog?: () => void;
    onNavigateToGallery?: () => void;
  };
}

export function GlobalShell({ children, headerProps }: GlobalShellProps) {
  const pathname = usePathname() ?? "";
  const router = useRouter();

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
          cartCount={Object.values(safeHeaderProps.cart ?? {}).reduce(
            (acc, v) => acc + (typeof v === "number" ? v : 0),
            0
          )}
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
