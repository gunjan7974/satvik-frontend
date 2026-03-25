"use client";

import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Menu, Phone, ShoppingCart, User, Lock, LayoutDashboard, LogOut } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
  
  const totalItems = Object.values(cart || {}).reduce((sum, qty) => sum + qty, 0) || 0;

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <button onClick={() => navigateTo('/')} className="text-gray-700 hover:text-orange-600 transition-colors font-medium">Home</button>
            <button onClick={() => navigateTo('/about')} className="text-gray-700 hover:text-orange-600 transition-colors font-medium">About</button>
            <button onClick={() => navigateTo('/menu')} className="text-gray-700 hover:text-orange-600 transition-colors font-medium">Menu</button>
            <button onClick={() => navigateTo('/events')} className="text-gray-700 hover:text-orange-600 transition-colors font-medium">Events</button>
            <button onClick={() => navigateTo('/gallery')} className="text-gray-700 hover:text-orange-600 transition-colors font-medium">Gallery</button>
            <button onClick={() => navigateTo('/blog')} className="text-gray-700 hover:text-orange-600 transition-colors font-medium">Blog</button>
            <button onClick={() => navigateTo('/contacts')} className="text-gray-700 hover:text-orange-600 transition-colors font-medium">Contact</button>
            
            <Button 
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold"
              onClick={() => navigateTo('/orders')}
            >
              Order Now
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
            <nav className="flex flex-col space-y-4">
              <button onClick={() => navigateTo('/')} className="text-gray-700 hover:text-orange-600 transition-colors text-left py-2 font-medium">Home</button>
              <button onClick={() => navigateTo('/about')} className="text-gray-700 hover:text-orange-600 transition-colors text-left py-2 font-medium">About</button>
              <button onClick={() => navigateTo('/menu')} className="text-gray-700 hover:text-orange-600 transition-colors text-left py-2 font-medium">Menu</button>
              <button onClick={() => navigateTo('/events')} className="text-gray-700 hover:text-orange-600 transition-colors text-left py-2 font-medium">Events</button>
              <button onClick={() => navigateTo('/gallery')} className="text-gray-700 hover:text-orange-600 transition-colors text-left py-2 font-medium">Gallery</button>
              <button onClick={() => navigateTo('/blog')} className="text-gray-700 hover:text-orange-600 transition-colors text-left py-2 font-medium">Blog</button>
              <button onClick={() => navigateTo('/contact')} className="text-gray-700 hover:text-orange-600 transition-colors text-left py-2 font-medium">Contact</button>
              
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