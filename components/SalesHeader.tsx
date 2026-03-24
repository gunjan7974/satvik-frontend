"use client";

import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { LogOut, User, Settings, Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface SalesHeaderProps {
  user?: {
    username?: string;
    email?: string;
  };
  onLogout: () => void;
  onToggleSidebar?: () => void;
  isMobile?: boolean;
}

export default function SalesHeader({ 
  user, 
  onLogout, 
  onToggleSidebar,
  isMobile = false
}: SalesHeaderProps) {

  const getInitials = (name?: string) => {
    if (!name) return 'S';
    const names = name.split(' ').filter(Boolean);
    if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-6 sticky top-0 z-40"
    >
      <div className="flex items-center space-x-3 md:space-x-4">
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
        <h1 className="text-lg md:text-xl font-semibold text-gray-800 truncate">
          Sales Dashboard
        </h1>
      </div>

      <div className="flex items-center space-x-2 md:space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2 p-1 md:p-2 rounded-full">
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarImage src="" alt={user?.username || 'Sales'} />
                <AvatarFallback className="bg-blue-100 text-blue-700 text-sm font-semibold">
                  {getInitials(user?.username)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block text-left min-w-0">
                <p className="text-sm font-medium truncate">{user?.username || 'Sales Team'}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="h-4 w-4 mr-2" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="h-4 w-4 mr-2" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} className="text-red-600 focus:bg-red-50 focus:text-red-700">
              <LogOut className="h-4 w-4 mr-2" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  );
}