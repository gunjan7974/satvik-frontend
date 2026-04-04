"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Menu, Phone, ShoppingCart, User, Lock, LayoutDashboard, LogOut } from "lucide-react";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

interface HeaderProps {
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
  onStartNav?: () => void;
}

export function Header({
  cart,
  onViewCart,
  onNavigateToMenu,
  onLoginClick,
  onLogoutClick,
  onAdminClick,
  onDashboardClick,
  isLoggedIn,
  isAdmin,
  username,
  onStartNav
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const totalItems = Object.values(cart || {}).reduce((sum, qty) => sum + qty, 0) || 0;

  const NAV_LINKS = [
    { label: "Home",    path: "/"        },
    { label: "About",   path: "/about"   },
    { label: "Menu",    path: "/menu"    },
    { label: "Events",  path: "/events"  },
    { label: "Gallery", path: "/gallery" },
    { label: "Blog",    path: "/blog"    },
    { label: "Contact", path: "/contacts"},
  ];

  const [clickedPath, setClickedPath] = useState<string | null>(null);

  const isActive = (path: string) => {
    if (clickedPath === path) return true;
    return path === "/" ? (pathname || "") === "/" : (pathname || "").startsWith(path);
  };

  const handleLinkClick = (path: string) => {
    if (path === pathname) return;
    setClickedPath(path);
    setIsMenuOpen(false);
    if (onStartNav) {
      onStartNav();
    }
    // Reset clicked path after a delay
    setTimeout(() => setClickedPath(null), 1000);
  };

  const handleCartClick = () => {
    onViewCart();
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="w-full px-6 lg:px-10">
        <div className="flex justify-between items-center h-24">
          {/* Logo - Left side */}
          <div className="flex flex-shrink-0 justify-start">
            <Link 
              href="/" 
              className="flex items-center cursor-pointer group" 
              onClick={() => handleLinkClick("/")}
            >
              <img
                src="/assets/logo.png"
                alt="Sattvik Kaleva Logo"
                className="h-14 w-14 md:h-16 md:w-16 mr-3 transition-transform group-hover:scale-105"
              />
              <div className="hidden sm:block">
                <h1 className="text-xl md:text-2xl font-black text-orange-600 tracking-tight leading-none">Sattvik Kaleva</h1>
                <p className="text-[10px] md:text-sm text-gray-500 font-medium tracking-wide">Pure Veg • Veggy and Choosy</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Shifted Right */}
          <nav className="hidden lg:flex items-center justify-center flex-1 ml-12 space-x-1">
            {NAV_LINKS.map(({ label, path }) => {
              const active = isActive(path);
              return (
                <a
                  key={path}
                  href={path}
                  onClick={(e) => {
                    e.preventDefault();
                    if (path === pathname) return;
                    setClickedPath(path);
                    setIsMenuOpen(false);
                    if (onStartNav) onStartNav();
                    setTimeout(() => {
                      router.push(path);
                    }, 50); // Delay push slightly to allow spinner to render
                    setTimeout(() => setClickedPath(null), 1000);
                  }}
                  className="relative flex flex-col items-center gap-0.5 font-semibold text-[14px] transition-all duration-300 px-2 py-2 group cursor-pointer"
                >
                  <motion.span
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      color: active ? "transparent" : "#374151",
                      background: active
                        ? "linear-gradient(90deg, #EA580C, #F97316)"
                        : "none",
                      WebkitBackgroundClip: active ? "text" : "unset",
                      WebkitTextFillColor: active ? "transparent" : "#374151"
                    }}
                    className="relative z-10"
                  >
                    {label}
                  </motion.span>
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-2 right-2 rounded-full"
                      style={{
                        height: "3px",
                        background: "linear-gradient(90deg, #EA580C, #F97316)",
                        borderRadius: "999px",
                      }}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {!active && (
                    <motion.span 
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute inset-0 bg-gray-50 rounded-lg -z-0"
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Desktop Actions - Right side */}
          <div className="hidden lg:flex items-center justify-end space-x-4 flex-none ml-auto">
            {/* Updated Cart/Order Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={onViewCart}
              className="relative border-orange-600 text-orange-600 hover:bg-orange-50 px-6 h-12 rounded-xl transition-all duration-300 group"
            >
              <ShoppingCart className="h-5 w-5 mr-1 group-hover:scale-110 transition-transform" />
              <span className="font-bold">Cart</span>
              {totalItems > 0 && (
                <Badge className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-600 text-white px-2 py-0.5 text-[11px] min-w-[24px] h-[24px] flex items-center justify-center rounded-full border-2 border-white shadow-2xl font-black z-10 transition-transform group-hover:scale-110">
                  {totalItems}
                </Badge>
              )}
            </Button>

            {isLoggedIn ? (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onDashboardClick}
                  className="flex items-center space-x-2 border-orange-600 text-orange-600 hover:bg-orange-50"
                >
                  <div className="h-7 w-7 rounded-full bg-orange-500 text-white flex items-center justify-center text-[11px] font-black shadow-sm border border-white/20 transition-transform group-hover:scale-110">
                    {username ? username.charAt(0).toUpperCase() : <User className="h-3.5 w-3.5" />}
                  </div>
                </Button>
          
                {isAdmin && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onAdminClick}
                    className="flex items-center space-x-2 border-orange-600 text-orange-600 hover:bg-orange-50"
                  >
                    <Lock className="h-4 w-4" />
                    <span>Admin</span>
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLogoutClick}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden xl:inline">Logout</span>
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={onLoginClick}
                className="flex items-center space-x-2 border-orange-600 text-orange-600 hover:bg-orange-50"
              >
                <User className="h-4 w-4" />
                <span>Login</span>
              </Button>
            )}

            <div className="flex items-center space-x-2 text-sm text-orange-600 font-bold border-l pl-4 border-gray-100">
              <Phone className="h-4 w-4 shrink-0" />
              <span className="whitespace-nowrap">96449 74442</span>
            </div>
            
          </div>

          {/* Mobile Cart & Menu Toggle */}
          <div className="flex items-center space-x-3 lg:hidden">
            {totalItems > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={onViewCart}
                className="relative border-orange-600 text-orange-600 p-2"
              >
                <ShoppingCart className="h-4 w-4" />
                <Badge className="absolute -top-2 -right-2 bg-orange-600 text-white px-1.5 py-0.5 text-[10px] min-w-[18px] flex items-center justify-center">
                  {totalItems}
                </Badge>
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="border-orange-600 text-orange-600 p-2"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden py-4 border-t border-gray-100 bg-white"
            >
              <nav className="flex flex-col space-y-2">
                {NAV_LINKS.map(({ label, path }) => {
                  const active = isActive(path);
                  return (
                    <a
                      key={path}
                      href={path}
                      onClick={(e) => {
                        e.preventDefault();
                        if (path === pathname) return;
                        setClickedPath(path);
                        setIsMenuOpen(false);
                        if (onStartNav) onStartNav();
                        setTimeout(() => {
                          router.push(path);
                        }, 50);
                        setTimeout(() => setClickedPath(null), 1000);
                      }}
                      className="flex items-center gap-3 text-left py-3 px-4 rounded-xl font-bold text-[15px] relative overflow-hidden transition-colors cursor-pointer"
                    >
                      {active && (
                        <motion.div
                          layoutId="mobile-nav-bg"
                          className="absolute inset-0 bg-orange-50 -z-10"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      <span className={active ? "text-orange-600" : "text-gray-700"}>
                        {label}
                      </span>
                      {active && (
                        <motion.div 
                          layoutId="mobile-active-indicator"
                          className="ml-auto w-1.5 h-1.5 bg-orange-600 rounded-full"
                        />
                      )}
                    </a>
                  );
                })}
                
                <div className="pt-4 mt-2 border-t border-gray-50 flex flex-col gap-3 px-2">
                  <Button 
                    onClick={() => {
                      onNavigateToMenu();
                      setIsMenuOpen(false);
                    }}
                    className="bg-orange-600 text-white font-bold w-full h-12"
                  >
                    Order Now
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 h-12 border-orange-600 text-orange-600 font-bold"
                      onClick={() => {
                        onDashboardClick?.();
                        setIsMenuOpen(false);
                      }}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Account
                    </Button>
                    
                    {!isLoggedIn && (
                      <Button
                        className="flex-1 h-12 bg-gray-900 text-white font-bold"
                        onClick={() => {
                          onLoginClick();
                          setIsMenuOpen(false);
                        }}
                      >
                        Login
                      </Button>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-center space-x-2 text-sm text-orange-600 font-black pt-4 border-t border-gray-50 mt-2">
                  <Phone className="h-4 w-4" />
                  <span>96449 74442</span>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </header>
  );
}