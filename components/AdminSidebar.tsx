"use client";

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Monitor, Coffee, Package, Calendar, BookOpen, 
  MessageSquare, BarChart3, ChevronLeft, ChevronRight,
  ChevronDown, Plus, List, Users, Tag, X, Warehouse, ShoppingCart, Sparkles, Heart, Star,
  PartyPopper, Building2, Image as ImageIcon
} from 'lucide-react';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
  path: string;
  hasDropdown?: boolean;
  dropdownItems?: {
    label: string;
    path: string;
    icon: React.ComponentType<any>;
  }[];
}

interface SidebarProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

const sidebarItems: SidebarItem[] = [
  { 
    id: 'dashboard', 
    label: 'Overview', 
    icon: Monitor, 
    color: 'text-blue-600', 
    path: '/admin' 
  },
  { 
    id: 'users', 
    label: 'Users', 
    icon: Users, 
    color: 'text-indigo-600', 
    path: '/admin/users',
    hasDropdown: true,
    dropdownItems: [
      { label: 'All Users', path: '/admin/users', icon: List },
      { label: 'Add User', path: '/admin/users/add', icon: Plus },
    ]
  },
  { 
    id: 'foods', 
    label: 'Foods (Menu)', 
    icon: Coffee, 
    color: 'text-green-600', 
    path: '/admin/menu',
    hasDropdown: true,
    dropdownItems: [
      { label: 'View All Dishes', path: '/admin/menu', icon: List },
      { label: 'Add New Food', path: '/admin/menu/add', icon: Plus },
    ]
  },
  { 
    id: 'categories', 
    label: 'Categories', 
    icon: Tag, 
    color: 'text-teal-600', 
    path: '/admin/category',
    hasDropdown: true,
    dropdownItems: [
      { label: 'All Categories', path: '/admin/category', icon: List },
      { label: 'Add Category', path: '/admin/category/add', icon: Plus },
    ]
  },
  { 
    id: 'gallery', 
    label: 'Gallery Management', 
    icon: ImageIcon, 
    color: 'text-indigo-500', 
    path: '/admin/gallery',
    hasDropdown: true,
    dropdownItems: [
      { label: 'View Gallery', path: '/admin/gallery', icon: List },
      { label: 'Add New Photo', path: '/admin/gallery/add', icon: Plus },
    ]
  },
  { 
    id: 'orders', 
    label: 'Orders', 
    icon: Package, 
    color: 'text-orange-600', 
    path: '/admin/orders',
    hasDropdown: true,
    dropdownItems: [
      { label: 'New Orders', path: '/admin/orders/new', icon: Plus },
      { label: 'All Orders', path: '/admin/orders', icon: List },
    ]
  },
  { 
    id: 'carts', 
    label: 'Active Carts', 
    icon: ShoppingCart, 
    color: 'text-yellow-600', 
    path: '/admin/carts' 
  },
  { 
    id: 'eventbookings', 
    label: 'Event Bookings', 
    icon: Calendar, 
    color: 'text-purple-600', 
    path: '/admin/events',
    hasDropdown: true,
    dropdownItems: [
      { label: 'View Events', path: '/admin/events', icon: List },
      { label: 'Add Event', path: '/admin/events/add', icon: Plus },
    ]
  },
  { 
    id: 'eventtypes', 
    label: 'Event Types', 
    icon: Tag, 
    color: 'text-pink-600', 
    path: '/admin/event-types',
    hasDropdown: true,
    dropdownItems: [
      { label: 'View All Types', path: '/admin/event-types', icon: List },
      { label: 'Add New Type', path: '/admin/event-types/add', icon: Plus },
    ]
  },
  { 
    id: 'partyhalls', 
    label: 'Party Halls', 
    icon: Warehouse, 
    color: 'text-blue-500', 
    path: '/admin/party-halls',
    hasDropdown: true,
    dropdownItems: [
      { label: 'View All Halls', path: '/admin/party-halls', icon: List },
      { label: 'Register New Hall', path: '/admin/party-halls/add', icon: Plus },
    ]
  },
  { 
    id: 'extraservices', 
    label: 'Extra Services', 
    icon: Sparkles, 
    color: 'text-cyan-600', 
    path: '/admin/extra-services',
    hasDropdown: true,
    dropdownItems: [
      { label: 'View All Services', path: '/admin/extra-services', icon: List },
      { label: 'Add New Service', path: '/admin/extra-services/add', icon: Plus },
    ]
  },
  { 
    id: 'blog', 
    label: 'Blog Posts', 
    icon: BookOpen, 
    color: 'text-pink-100', // Adjusted to match premium feel
    path: '/admin/blog',
    hasDropdown: true,
    dropdownItems: [
      { label: 'View All Posts', path: '/admin/blog', icon: List },
      { label: 'Add New Post', path: '/admin/blog/add', icon: Plus },
    ]
  },
  { 
    id: 'contacts', 
    label: 'Messages', 
    icon: MessageSquare, 
    color: 'text-cyan-600', 
    path: '/admin/contacts' 
  },
  { 
    id: 'analytics', 
    label: 'Report & Analytics', 
    icon: BarChart3, 
    color: 'text-red-600', 
    path: '/admin/analytics' 
  },
];

export default function Sidebar({ sidebarOpen, onToggleSidebar }: SidebarProps) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Auto-close sidebar on mobile when resizing to desktop
      if (!mobile && !sidebarOpen) {
        onToggleSidebar();
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, [sidebarOpen, onToggleSidebar]);

  const toggleDropdown = (id: string) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const handleDropdownItemClick = () => {
    // Close sidebar on mobile when dropdown item is clicked
    if (isMobile) {
      onToggleSidebar();
      setOpenDropdown(null);
    }
  };

  const handleMainItemClick = (item: SidebarItem) => {
    if (item.hasDropdown) {
      // Toggle dropdown for items with dropdown
      toggleDropdown(item.id);
    } else {
      // Navigate directly for items without dropdown and close sidebar on mobile
      if (isMobile) {
        onToggleSidebar();
      }
    }
  };

  const sidebarWidth = sidebarOpen ? '288px' : '80px';

  return (
    <>
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarWidth }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed left-0 top-0 h-screen z-50 bg-white shadow-lg border-r overflow-y-auto overflow-x-hidden custom-scrollbar"
      >
        <div className="flex flex-col min-h-full">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between min-h-[80px]">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Coffee className="h-6 w-6 text-white" />
              </div>
              <AnimatePresence>
                {(sidebarOpen || isMobile) && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <h1 className="font-bold text-lg whitespace-nowrap">Sattvik Kaleva</h1>
                    <p className="text-sm text-gray-600 whitespace-nowrap">Admin Dashboard</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {(sidebarOpen || isMobile) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleSidebar}
                className="p-1 h-8 w-8 flex-shrink-0"
              >
                {isMobile ? <X className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </Button>
            )}
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
              const showLabels = sidebarOpen || isMobile;
              const isDropdownOpen = openDropdown === item.id;
              
              return (
                <div key={item.id} className="space-y-1">
                  {/* Main Menu Item */}
                  {item.hasDropdown ? (
                    <div>
                      <motion.button
                        onClick={() => handleMainItemClick(item)}
                        className={`flex items-center w-full rounded-lg text-left transition-all duration-200 cursor-pointer group ${
                          isActive
                            ? 'bg-orange-50 text-orange-700 border border-orange-200'
                            : 'text-gray-700 hover:bg-gray-50'
                        } ${showLabels ? 'px-4 py-3 space-x-3' : 'p-3 justify-center'}`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="relative flex-shrink-0">
                          <Icon className={`h-5 w-5 ${isActive ? item.color : 'text-gray-500'}`} />
                          {!showLabels && isActive && (
                            <motion.div
                              layoutId="activeDot"
                              className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"
                            />
                          )}
                        </div>
                        
                        <AnimatePresence>
                          {showLabels && (
                            <motion.div
                              initial={{ opacity: 0, width: 0 }}
                              animate={{ opacity: 1, width: 'auto' }}
                              exit={{ opacity: 0, width: 0 }}
                              transition={{ duration: 0.2 }}
                              className="flex items-center justify-between flex-1 overflow-hidden min-w-0"
                            >
                              <span className="font-medium whitespace-nowrap truncate">{item.label}</span>
                              <ChevronDown 
                                className={`h-4 w-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${
                                  isDropdownOpen ? 'rotate-180' : ''
                                }`} 
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {!showLabels && (
                          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none">
                            {item.label}
                          </div>
                        )}
                      </motion.button>

                      {/* Dropdown Items */}
                      <AnimatePresence>
                        {isDropdownOpen && showLabels && item.dropdownItems && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="ml-4 pl-4 border-l-2 border-gray-200 space-y-1 mt-1"
                          >
                            {item.dropdownItems.map((dropdownItem, index) => {
                              const DropdownIcon = dropdownItem.icon;
                              const isDropdownActive = pathname === dropdownItem.path;
                              
                              return (
                                <Link 
                                  key={dropdownItem.path} 
                                  href={dropdownItem.path}
                                  onClick={handleDropdownItemClick}
                                >
                                  <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 cursor-pointer ${
                                      isDropdownActive
                                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                    whileHover={{ scale: 1.01 }}
                                  >
                                    <DropdownIcon className="h-4 w-4 flex-shrink-0" />
                                    <span className="truncate">{dropdownItem.label}</span>
                                  </motion.div>
                                </Link>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    // Regular menu item without dropdown
                    <Link 
                      href={item.path}
                      onClick={() => {
                        if (isMobile) {
                          onToggleSidebar();
                        }
                      }}
                    >
                      <motion.div
                        className={`flex items-center rounded-lg text-left transition-all duration-200 cursor-pointer group ${
                          isActive
                            ? 'bg-orange-50 text-orange-700 border border-orange-200'
                            : 'text-gray-700 hover:bg-gray-50'
                        } ${showLabels ? 'px-4 py-3 space-x-3' : 'p-3 justify-center'}`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="relative flex-shrink-0">
                          <Icon className={`h-5 w-5 ${isActive ? item.color : 'text-gray-500'}`} />
                          {!showLabels && isActive && (
                            <motion.div
                              layoutId="activeDot"
                              className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"
                            />
                          )}
                        </div>
                        
                        <AnimatePresence>
                          {showLabels && (
                            <motion.div
                              initial={{ opacity: 0, width: 0 }}
                              animate={{ opacity: 1, width: 'auto' }}
                              exit={{ opacity: 0, width: 0 }}
                              transition={{ duration: 0.2 }}
                              className="flex items-center flex-1 overflow-hidden min-w-0"
                            >
                              <span className="font-medium whitespace-nowrap truncate">{item.label}</span>
                              {isActive && (
                                <motion.div
                                  layoutId="activeTab"
                                  className="w-2 h-2 bg-orange-500 rounded-full ml-auto flex-shrink-0"
                                />
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {!showLabels && (
                          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none">
                            {item.label}
                          </div>
                        )}
                      </motion.div>
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200">
            <AnimatePresence>
              {(sidebarOpen || isMobile) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  <p className="text-xs text-gray-500 truncate">
                    Sattvik Kaleva © {new Date().getFullYear()}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Admin Panel v1.0
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={onToggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Toggle Button - Show when sidebar is closed on desktop */}
      {!sidebarOpen && !isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-4 left-4 z-30"
        >
          <Button
            variant="secondary"
            size="sm"
            onClick={onToggleSidebar}
            className="h-10 w-10 p-0 rounded-full shadow-md"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </motion.div>
      )}
    </>
  );
}