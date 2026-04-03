"use client";

import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Bell, LogOut, User, Settings, Menu, ExternalLink, ChevronRight, Home } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface HeaderProps {
  user?: {
    username?: string;
    email?: string;
  };
  onLogout: () => void;
  notifications?: number;
  sidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  isMobile?: boolean;
}

export default function Header({ 
  user, 
  onLogout, 
  notifications = 0,
  sidebarOpen = true,
  onToggleSidebar,
  isMobile = false
}: HeaderProps) {
  const pathname = usePathname();

  // Generate breadcrumbs from pathname
  const generateBreadcrumbs = () => {
    const paths = (pathname || '').split('/').filter(p => p);
    return paths.map((path, index) => {
      const href = `/${paths.slice(0, index + 1).join('/')}`;
      const label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
      const isLast = index === paths.length - 1;

      return (
        <div key={href} className="flex items-center">
          <ChevronRight className="h-4 w-4 text-gray-400 mx-1" />
          {isLast ? (
            <span className="text-gray-800 font-semibold truncate max-w-[100px] md:max-w-none">{label}</span>
          ) : (
            <Link href={href} className="text-gray-500 hover:text-orange-600 transition-colors">
              {label}
            </Link>
          )}
        </div>
      );
    });
  };
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-6 sticky top-0 z-40"
    >
      {/* Left Section - Menu Toggle & Page Title */}
      <div className="flex items-center space-x-3 md:space-x-4">
        {/* Menu Toggle Button - Always show on mobile, show on desktop when sidebar is closed */}
        {isMobile && onToggleSidebar && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="p-2"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        {/* Breadcrumbs */}
        <nav className="hidden sm:flex items-center text-sm font-medium text-gray-500 overflow-hidden">
          <Link href="/admin" className="flex items-center hover:text-orange-600 transition-colors">
            <Home className="h-4 w-4" />
          </Link>
          {generateBreadcrumbs()}
        </nav>
        <h1 className="sm:hidden text-lg font-bold text-gray-800 truncate">
          Admin
        </h1>
      </div>

      {/* Right Section - User Menu & Notifications */}
      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Visit Website Button */}
        <Link href="/" target="_blank" className="hidden lg:flex">
          <Button variant="outline" size="sm" className="border-gray-200 text-gray-600 hover:bg-gray-50">
            <ExternalLink className="h-4 w-4 mr-2" />
            Live Site
          </Button>
        </Link>
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative p-2">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications > 9 ? '9+' : notifications}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="p-2">
              <div className="text-center text-gray-500 text-sm py-4">
                No new notifications
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2 p-1 md:p-2">
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarImage src="" alt={user?.username || 'Admin'} />
                <AvatarFallback className="bg-orange-100 text-orange-700 text-sm">
                  {user?.username?.charAt(0).toUpperCase() || 'A'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block text-left min-w-0">
                <p className="text-sm font-medium truncate">{user?.username || 'Admin'}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email || 'Administrator'}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex items-center w-full cursor-pointer">
                <User className="h-4 w-4 mr-2" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="h-4 w-4 mr-2" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} className="text-red-600">
              <LogOut className="h-4 w-4 mr-2" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  );
}