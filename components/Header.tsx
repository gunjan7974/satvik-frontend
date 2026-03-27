"use client";

import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Menu, Phone, ShoppingCart, User, Lock, LayoutDashboard, LogOut } from "lucide-react";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

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
}

export function Header({
  cart,
  onViewCart,
  onLoginClick,
  onLogoutClick,
  onAdminClick,
  onDashboardClick,
  isLoggedIn,
  isAdmin,
  username
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

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  const navigateTo = (path: string) => {
    router.push(path);
    setIsMenuOpen(false);
  };

  const handleCartClick = () => {
    onViewCart();
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="w-full px-6 lg:px-10">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => navigateTo('/')}>
            <img
              src="/assets/logo.png"
              alt="Sattvik Kaleva Logo"
              className="h-16 w-16 mr-3"
            />
            <div>
              <h1 className="text-2xl font-bold text-orange-600">Sattvik Kaleva</h1>
              <p className="text-sm text-gray-600">Pure Veg • Veggy and Choosy</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {NAV_LINKS.map(({ label, path }) => {
              const active = isActive(path);
              return (
                <button
                  key={path}
                  onClick={() => navigateTo(path)}
                  className="relative flex flex-col items-center gap-0.5 font-semibold text-[14px] transition-all duration-200"
                  style={{
                    color: active ? "transparent" : "#374151",
                    background: active
                      ? "linear-gradient(90deg, #EA580C, #F97316)"
                      : "none",
                    WebkitBackgroundClip: active ? "text" : "unset",
                    WebkitTextFillColor: active ? "transparent" : "#374151",
                  }}
                >
                  {label}
                  {active && (
                    <span
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full"
                      style={{
                        width: "20px",
                        height: "3px",
                        background: "linear-gradient(90deg, #EA580C, #F97316)",
                        borderRadius: "999px",
                      }}
                    />
                  )}
                </button>
              );
            })}
            
            <Button 
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold relative"
              onClick={() => navigateTo('/cart')}
            >
              Order Now
              {totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-red-600 text-white border-none px-1.5 py-0.5 text-[10px] min-w-[18px] h-[18px] flex items-center justify-center rounded-full">
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
                  <User className="h-4 w-4" />
                  <span>{username || "Profile"}</span>
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
                onClick={() => navigateTo('/login')}
                className="flex items-center space-x-2 border-orange-600 text-orange-600 hover:bg-orange-50"
              >
                <User className="h-4 w-4" />
                <span>Login</span>
              </Button>
            )}

            <div className="flex items-center space-x-2 text-sm text-orange-600 font-medium">
              <Phone className="h-4 w-4" />
              <span>96449 74442</span>
            </div>

            {/* Desktop Cart */}
            {totalItems > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCartClick}
                className="relative border-orange-600 text-orange-600 hover:bg-orange-50"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart
                <Badge className="absolute -top-2 -right-2 bg-orange-600 text-white px-1.5 py-0.5 text-xs min-w-[20px] flex items-center justify-center">
                  {totalItems}
                </Badge>
              </Button>
            )}
          </nav>

          {/* Mobile Cart & Menu */}
          <div className="flex items-center space-x-2 lg:hidden">
            {totalItems > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCartClick}
                className="relative border-orange-600 text-orange-600 hover:bg-orange-50"
              >
                <ShoppingCart className="h-4 w-4" />
                <Badge className="absolute -top-2 -right-2 bg-orange-600 text-white px-1.5 py-0.5 text-xs min-w-[20px] flex items-center justify-center">
                  {totalItems}
                </Badge>
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="border-orange-600 text-orange-600 hover:bg-orange-50"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 bg-white">
            <nav className="flex flex-col space-y-1">
              {NAV_LINKS.map(({ label, path }) => {
                const active = isActive(path);
                return (
                  <button
                    key={path}
                    onClick={() => navigateTo(path)}
                    className="flex items-center gap-3 text-left py-2.5 px-3 rounded-xl font-medium text-[14px] transition-all duration-200"
                    style={{
                      background: active
                        ? "linear-gradient(135deg, rgba(234,88,12,0.1), rgba(249,115,22,0.06))"
                        : "transparent",
                      color: active ? "#EA580C" : "#374151",
                      borderLeft: active ? "3px solid #F97316" : "3px solid transparent",
                      fontWeight: active ? 700 : 500,
                    }}
                  >
                    {label}
                  </button>
                );
              })}
              
              <Button 
                className="bg-orange-600 hover:bg-orange-700 text-white font-semibold w-fit"
                onClick={() => navigateTo('/order')}
              >
                Order Now
              </Button>

              {isLoggedIn ? (
                <div className="flex flex-col space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onDashboardClick}
                    className="flex items-center space-x-2 w-fit border-orange-600 text-orange-600 hover:bg-orange-50"
                  >
                    <User className="h-4 w-4" />
                    <span>{username || "Profile"}</span>
                  </Button>
                  
                  {isAdmin && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onAdminClick}
                      className="flex items-center space-x-2 w-fit border-orange-600 text-orange-600 hover:bg-orange-50"
                    >
                      <Lock className="h-4 w-4" />
                      <span>Admin</span>
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onLogoutClick}
                    className="flex items-center space-x-2 w-fit text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onLoginClick}
                  className="flex items-center space-x-2 w-fit border-orange-600 text-orange-600 hover:bg-orange-50"
                >
                  <User className="h-4 w-4" />
                  <span>Login</span>
                </Button>
              )}

              <div className="flex items-center space-x-2 text-sm text-orange-600 font-medium pt-2">
                <Phone className="h-4 w-4" />
                <span>96449 74442</span>
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* Floating Cart for Desktop */}
      {totalItems > 0 && (
        <div className="hidden lg:block fixed top-24 right-6 z-40">
          <Button
            onClick={handleCartClick}
            className="bg-orange-600 hover:bg-orange-700 shadow-lg relative text-white font-semibold"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Cart
            <Badge className="absolute -top-2 -right-2 bg-red-600 text-white px-1.5 py-0.5 text-xs min-w-[20px] flex items-center justify-center">
              {totalItems}
            </Badge>
          </Button>
        </div>
      )}
    </header>
  );
}