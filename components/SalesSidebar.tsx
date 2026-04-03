"use client";

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { 
  LayoutDashboard, Package, Receipt, ChevronLeft, X, BarChart3,
  FolderPlus, FolderOpen, Utensils, Menu as MenuIcon, Plus
} from 'lucide-react';
import { Button } from './ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  path?: string;
  children?: Omit<SidebarItem, 'children'>[];
}

interface SidebarProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  isMobile: boolean;
}

const sidebarItems: SidebarItem[] = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard, 
      path: '/sales/report' 
    },
    { 
      id: 'orders', 
      label: 'Orders', 
      icon: Package, 
      children: [
          { id: 'all-orders', label: 'All Orders', icon: Package, path: '/sales/order' },
          { id: 'add-order', label: 'Add Order', icon: Plus, path: '/sales/dashboard' },
      ]
    },
    { 
      id: 'expenses', 
      label: 'Expenses', 
      icon: Receipt, 
      path: '/sales/expenses' 
    },
    { 
      id: 'category', 
      label: 'Category', 
      icon: FolderOpen,
      children: [
          { id: 'add-category', label: 'Add Category', icon: FolderPlus, path: '/sales/category/add' },
          { id: 'all-categories', label: 'All Categories', icon: FolderOpen, path: '/sales/category' },
      ]
    },
    { 
      id: 'menu', 
      label: 'Menu', 
      icon: Utensils,
      children: [
          { id: 'add-menu', label: 'Add Menu Item', icon: Plus, path: '/sales/menu/add' },
          { id: 'all-menus', label: 'All Menu Items', icon: MenuIcon, path: '/sales/menu' },
      ]
    },
];

const CollapsedSidebarItem = ({ item, pathname }: { item: SidebarItem, pathname: string }) => {
    const Icon = item.icon;
    const hasActiveChild = item.children?.some(child => (pathname || '').startsWith(child.path || '')) || false;
    const isActive = item.path ? ((pathname || '') === item.path || (pathname || '').startsWith(item.path + '/')) : hasActiveChild;

    if (item.children) {
        return (
            <HoverCard openDelay={100} closeDelay={50}>
                <HoverCardTrigger asChild>
                    <Link href={item.children[0]?.path || '#'}>
                        <div className={cn("flex items-center justify-center p-3 rounded-lg", isActive ? 'bg-blue-50' : 'hover:bg-gray-100')}>
                            <Icon className={cn("h-5 w-5", isActive ? 'text-blue-600' : 'text-gray-500')} />
                        </div>
                    </Link>
                </HoverCardTrigger>
                <HoverCardContent side="right" align="start" className="w-52 p-2">
                    <div className="space-y-1">
                        <div className="font-bold text-sm px-3 py-2 text-black">{item.label}</div>
                        {item.children.map(child => {
                            const ChildIcon = child.icon;
                            const isChildActive = child.path ? ((pathname || '') === child.path || (pathname || '').startsWith(child.path + '/')) : false;
                            return (
                                <Link key={child.id} href={child.path || '#'}>
                                    <div className={cn("flex items-center p-3 rounded-md hover:bg-gray-100 text-sm", isChildActive ? "bg-blue-50 text-blue-700" : "text-black hover:text-black")}>
                                        <ChildIcon className={cn("h-4 w-4 mr-3", isChildActive ? "text-blue-600" : "text-gray-500")} />
                                        <span>{child.label}</span>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </HoverCardContent>
            </HoverCard>
        )
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Link href={item.path || '#'}>
                    <div className={cn("flex items-center justify-center p-3 rounded-lg", isActive ? 'bg-blue-50' : 'hover:bg-gray-100')}>
                        <Icon className={cn("h-5 w-5", isActive ? 'text-blue-600' : 'text-gray-500')} />
                    </div>
                </Link>
            </TooltipTrigger>
            <TooltipContent side="right">
                <p className="text-white">{item.label}</p>
            </TooltipContent>
        </Tooltip>
    )
}

const ExpandedSidebarItem = ({ item, pathname, isMobile, onToggleSidebar }: { item: SidebarItem, pathname: string, isMobile: boolean, onToggleSidebar: () => void }) => {
    const Icon = item.icon;
    const hasActiveChild = item.children?.some(child => (pathname || '').startsWith(child.path || '')) || false;
    const isActive = item.path ? ((pathname || '') === item.path || (pathname || '').startsWith(item.path + '/')) : hasActiveChild;

    if (item.children) {
        return (
            <Accordion type="single" collapsible defaultValue={hasActiveChild ? item.id : undefined}>
                <AccordionItem value={item.id} className="border-b-0">
                    <AccordionTrigger className={cn("flex items-center w-full rounded-lg text-left transition-all duration-200 cursor-pointer group hover:no-underline px-4 py-3", isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900")}>
                        <div className="flex items-center">
                            <Icon className={cn("h-5 w-5 mr-3", isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700')} />
                            <span className="font-medium whitespace-nowrap truncate">{item.label}</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-8 pt-1">
                        {item.children.map(child => {
                            const ChildIcon = child.icon;
                            const isChildActive = child.path ? ((pathname || '') === child.path || (pathname || '').startsWith(child.path + '/')) : false;
                            return(
                                <Link 
                                    key={child.id}
                                    href={child.path || '#'}
                                    onClick={() => { if (isMobile) onToggleSidebar(); }}
                                >
                                    <div className={cn(
                                        "flex items-center rounded-lg text-left transition-all duration-200 cursor-pointer group mt-1 px-4 py-3 space-x-3",
                                        isChildActive ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    )}
                                    >
                                        <ChildIcon className={cn("h-5 w-5", isChildActive ? 'text-blue-700' : 'text-gray-500')} />
                                        <span className="font-medium whitespace-nowrap truncate text-sm">{child.label}</span>
                                    </div>
                                </Link>
                            )
                        })}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        )
    }

    return (
        <Link 
            href={item.path || '#'}
            onClick={() => { if (isMobile) onToggleSidebar(); }}
        >
            <div className={cn(
                "flex items-center rounded-lg text-left transition-all duration-200 cursor-pointer group px-4 py-3 space-x-3",
                isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            )}>
                <Icon className={cn("h-5 w-5", isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700')} />
                <span className="font-medium whitespace-nowrap truncate">{item.label}</span>
            </div>
        </Link>
    )
}

export default function SalesSidebar({ sidebarOpen, onToggleSidebar, isMobile }: SidebarProps) {
  const pathname = usePathname();
  const showLabels = sidebarOpen || isMobile;

  return (
    <>
      <motion.div
        initial={false}
        animate={{ width: showLabels ? (isMobile ? '256px' : '256px') : '80px' }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`h-screen bg-white shadow-lg border-r border-gray-200 overflow-y-auto overflow-x-hidden flex-shrink-0 z-50 ${
          isMobile ? 'fixed inset-y-0 left-0' : 'relative'
        }`}
        style={{ maxWidth: isMobile ? '256px' : undefined }}
      >
        <div className={cn("h-screen flex flex-col", showLabels ? "w-64" : "w-20")}>
          <div className="p-4 border-b border-gray-200 flex items-center justify-between min-h-[64px]">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <AnimatePresence>
                {showLabels && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <h1 className="font-bold text-lg whitespace-nowrap">Sales</h1>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {showLabels && (
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

          <nav className="p-2 space-y-1 flex-1">
            {!showLabels && (
              <div className="text-center mb-2">
                <Button variant="ghost" size="sm" onClick={onToggleSidebar} className="p-3">
                  <MenuIcon className="h-5 w-5" />
                </Button>
              </div>
            )}
            
            <TooltipProvider>
                {sidebarItems.map((item) => (
                    showLabels 
                        ? <ExpandedSidebarItem key={item.id} item={item} pathname={pathname} isMobile={isMobile} onToggleSidebar={onToggleSidebar} />
                        : <CollapsedSidebarItem key={item.id} item={item} pathname={pathname} />
                ))}
            </TooltipProvider>
          </nav>
        </div>
      </motion.div>

      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
            onClick={onToggleSidebar}
          />
        )}
      </AnimatePresence>
    </>
  );
}