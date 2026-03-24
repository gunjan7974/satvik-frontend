"use client";

import React, { useEffect, useState, useCallback, KeyboardEvent, useRef } from 'react';
import { apiClient } from '../../../lib/api';
import { Menu } from '../../../types/menu';
import { Button } from '../../../components/ui/button';
import { Plus, Minus, Trash2, Printer, IndianRupee, Search, Edit, CheckCircle, ChevronDown, X, Keyboard } from 'lucide-react';

const Pagination = ({ ordersPerPage, totalOrders, paginate, currentPage }: any) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalOrders / ordersPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className='flex justify-center space-x-2 mt-4'>
        {pageNumbers.map(number => (
          <li key={number} className=''>
            <a onClick={() => paginate(number)} href='#' className={`px-3 py-1 border rounded-md ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-white'}`}>
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default function SalesDashboardPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const [menus, setMenus] = useState<Menu[]>([]);
  const [selectedMenuId, setSelectedMenuId] = useState('');
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [tableNumber, setTableNumber] = useState('');
  const [date, setDate] = useState('');
  const [timing, setTiming] = useState('');
  const [lastCreated, setLastCreated] = useState<any | null>(null);
  const [settleMethodLocal, setSettleMethodLocal] = useState<'upi'|'cash'|'credit'|'other'>('upi');
  const [localUpiCode, setLocalUpiCode] = useState('');
  const [nextOrderNumber, setNextOrderNumber] = useState('ORD-001');
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  // Enhanced menu search state
  const [menuSearch, setMenuSearch] = useState('');
  const [isMenuDropdownOpen, setIsMenuDropdownOpen] = useState(false);
  const [currentDateString, setCurrentDateString] = useState('Loading date...');
  
  // Keyboard navigation for menu dropdown
  const [focusedMenuIndex, setFocusedMenuIndex] = useState<number>(0);
  const focusedMenuRef = useRef<HTMLButtonElement>(null);

  // State for keyboard shortcuts and selected order
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showShortcutHelp, setShowShortcutHelp] = useState(false);
  const [focusedOrderIndex, setFocusedOrderIndex] = useState<number>(-1);
  const [orderListRef, setOrderListRef] = useState<HTMLDivElement | null>(null);

  // per-order settle UI state
  const [activeSettleId, setActiveSettleId] = useState<string | null>(null);
  const [settlementsById, setSettlementsById] = useState<Record<string, { method: string; amount: number; upiCode: string }[]>>({});

  // per-order edit UI state
  const [activeEditId, setActiveEditId] = useState<string | null>(null);
  const [editFieldsById, setEditFieldsById] = useState<Record<string,{ tableNumber?: string; timing?: string; items?: any[] }>>({});

  const [unsettledPage, setUnsettledPage] = useState(1);
  const [settledPage, setSettledPage] = useState(1);
  const [ordersPerPage, setOrdersPerPage] = useState(5);
  const menuSearchInputRef = useRef<HTMLInputElement>(null);
  const menuDropdownRef = useRef<HTMLDivElement>(null);
  const tableNumberInputRef = useRef<HTMLInputElement>(null);
  const createOrderButtonRef = useRef<HTMLButtonElement>(null);
  const isCreatingRef = useRef(false);

  // Focus management for selected items
  const [focusedItemIndex, setFocusedItemIndex] = useState<number>(-1);
  const itemQuantityRefs = useRef<(HTMLInputElement | null)[]>([]);
  const itemButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Focus management for pending orders
  const [focusedPendingOrderIndex, setFocusedPendingOrderIndex] = useState<number>(-1);
  const pendingOrderButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Auto-scroll to focused menu item
  useEffect(() => {
    if (focusedMenuRef.current && isMenuDropdownOpen) {
      focusedMenuRef.current.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      });
    }
  }, [focusedMenuIndex, isMenuDropdownOpen]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuDropdownRef.current && !menuDropdownRef.current.contains(event.target as Node)) {
        setIsMenuDropdownOpen(false);
        setFocusedMenuIndex(0);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Focus on table number input on component mount
  useEffect(() => {
    if (tableNumberInputRef.current) {
      tableNumberInputRef.current.focus();
    }
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await apiClient.getSalesOrders({ page: 1, limit: 1000 }); // Fetch more to be sure
      const list = res && (res.salesOrders || res.data || res.salesOrders) || [];

      // Fetch the next order number from the backend
      try {
        const nextOrderNumberRes = await apiClient.getNextSalesOrderNumber();
        if (nextOrderNumberRes.success) {
          setNextOrderNumber(nextOrderNumberRes.orderNumber);
        }
      } catch (error) {
        console.error('Failed to fetch next order number', error);
      }

      // Ensure newest orders appear first (sort by createdAt or date)
      const sorted = list.slice().sort((a: any, b: any) => {
        const ta = new Date(a.createdAt || a.date || 0).getTime();
        const tb = new Date(b.createdAt || b.date || 0).getTime();
        return tb - ta;
      });

      setItems(sorted);
    } catch (err) {
      console.error('Failed to load sales orders', err);
    } finally { setLoading(false); }
  };

  useEffect(() => {
    // set default date/time
    const now = new Date();
    setDate(now.toISOString().slice(0,10));
    setTiming(now.toTimeString().slice(0,5));
    loadMenus();
    setCurrentDateString(new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    load();
  }, []);

  // Main keyboard shortcut handler
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement> | globalThis.KeyboardEvent) => {
    // Don't handle shortcuts if user is typing in an input field (except for specific cases)
    const activeElement = document.activeElement;
    const isInInput = activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'SELECT');
    
    // Special handling for quantity inputs
    if (activeElement && activeElement.tagName === 'INPUT' && activeElement.classList.contains('quantity-input')) {
      if (e.key === 'Enter') {
        e.preventDefault();
        // Move to next item or create order button
        if (focusedItemIndex < orderItems.length - 1) {
          setFocusedItemIndex(prev => prev + 1);
          setTimeout(() => itemButtonRefs.current[focusedItemIndex + 1]?.focus(), 10);
        } else {
          createOrderButtonRef.current?.focus();
        }
        return;
      }
      if (e.key === 'Tab' && !e.shiftKey) {
        e.preventDefault();
        if (focusedItemIndex < orderItems.length - 1) {
          setFocusedItemIndex(prev => prev + 1);
          setTimeout(() => itemButtonRefs.current[focusedItemIndex + 1]?.focus(), 10);
        } else {
          createOrderButtonRef.current?.focus();
        }
        return;
      }
      if (e.key === 'Tab' && e.shiftKey) {
        e.preventDefault();
        if (focusedItemIndex > 0) {
          setFocusedItemIndex(prev => prev - 1);
          setTimeout(() => itemButtonRefs.current[focusedItemIndex - 1]?.focus(), 10);
        } else {
          menuSearchInputRef.current?.focus();
        }
        return;
      }
      // Allow number input and arrow keys
      if (/^[0-9]$/.test(e.key) || e.key === 'ArrowUp' || e.key === 'ArrowDown' || 
          e.key === 'Backspace' || e.key === 'Delete' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        return;
      }
    }

    // Global shortcuts (work everywhere)
    // Escape key - Close dropdowns or modals
    if (e.key === 'Escape') {
      e.preventDefault();
      if (isMenuDropdownOpen) {
        setIsMenuDropdownOpen(false);
        setFocusedMenuIndex(0);
        menuSearchInputRef.current?.focus();
        return;
      }
      if (showShortcutHelp) {
        setShowShortcutHelp(false);
        return;
      }
      if (activeSettleId) {
        setActiveSettleId(null);
        return;
      }
      if (activeEditId) {
        setActiveEditId(null);
        return;
      }
      if (selectedOrder) {
        printKOT(selectedOrder);
        return;
      }
    }

    // Enter key - Print Bill for selected order (when not in input)
    if (e.key === 'Enter' && selectedOrder && !isInInput) {
      e.preventDefault();
      printBill(selectedOrder);
      return;
    }

    // '?' key - Toggle shortcut help
    if (e.key === '?' && !isInInput) {
      e.preventDefault();
      setShowShortcutHelp(prev => !prev);
      return;
    }

    // 'r' key - Refresh
    if (e.key === 'r' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      load();
      return;
    }

    // 'n' key - Focus on new order table number
    if (e.key === 'n' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      tableNumberInputRef.current?.focus();
      return;
    }

    // 'c' key - Create order
    if (e.key === 'c' && (e.ctrlKey || e.metaKey) && orderItems.length > 0 && !isCreatingOrder) {
      e.preventDefault();
      handleCreate();
      return;
    }

    // Arrow keys for order navigation
    if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && !isInInput) {
      e.preventDefault();
      
      const currentDate = getCurrentDate();
      const currentDateOrders = items.filter(item => {
        const orderDate = item.date ? new Date(item.date).toISOString().slice(0, 10) :
                          item.createdAt ? new Date(item.createdAt).toISOString().slice(0, 10) : '';
        return orderDate === currentDate;
      });
      
      const unsettledOrders = currentDateOrders.filter(item => item.status !== 'completed' && item.status !== 'cancelled');
      const settledOrders = currentDateOrders.filter(item => item.status === 'completed');
      
      const allOrders = [...unsettledOrders, ...settledOrders];
      
      if (allOrders.length === 0) return;
      
      let newIndex = focusedOrderIndex;
      
      if (e.key === 'ArrowDown') {
        newIndex = (focusedOrderIndex + 1) % allOrders.length;
      } else if (e.key === 'ArrowUp') {
        newIndex = focusedOrderIndex - 1;
        if (newIndex < 0) newIndex = allOrders.length - 1;
      }
      
      setFocusedOrderIndex(newIndex);
      setSelectedOrder(allOrders[newIndex]);
      
      // Scroll to the selected order
      if (orderListRef) {
        const orderElements = orderListRef.querySelectorAll('[data-order-id]');
        if (orderElements[newIndex]) {
          orderElements[newIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
      return;
    }

    // Tab navigation for selected items
    if (e.key === 'Tab' && orderItems.length > 0 && !isInInput) {
      if (focusedItemIndex === -1 && !e.shiftKey) {
        e.preventDefault();
        setFocusedItemIndex(0);
        setTimeout(() => itemButtonRefs.current[0]?.focus(), 10);
        return;
      }
    }

  }, [selectedOrder, focusedOrderIndex, items, orderListRef, orderItems, focusedItemIndex, isMenuDropdownOpen, showShortcutHelp, activeSettleId, activeEditId]);

  // Add event listener for keyboard shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: globalThis.KeyboardEvent) => {
      handleKeyDown(e as any);
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [handleKeyDown]);

  const loadMenus = async () => {
    try {
      // Using a high limit to fetch all available menus
      const res = await apiClient.getMenus({ limit: 1000 });
      if (res.success && Array.isArray(res.menus)) {
        setMenus(res.menus);
      } else {
        console.warn('Could not load menus from API.');
      }
    } catch (error) {
      console.error('Failed to load menus from API', error);
    }
  };

  // Enhanced menu search functionality
  const filteredMenus = menus.filter(menu =>
    menu.title.toLowerCase().includes(menuSearch.toLowerCase()) ||
    (typeof menu.category === 'string' ? menu.category.toLowerCase().includes(menuSearch.toLowerCase()) : menu.category?.title.toLowerCase().includes(menuSearch.toLowerCase()))
  );

  const addMenuToOrder = (menuId: string) => {
    const m = menus.find(x => x._id === menuId);
    if (!m) return;
    if (typeof m.price !== 'number' || isNaN(m.price)) {
      alert(`Menu item "${m.title}" has an invalid price and cannot be added.`);
      return;
    }
    setOrderItems(prev => {
      const found = prev.find(pi => pi.menu === m._id);
      if (found) {
        const newQty = found.quantity + 1;
        return prev.map(pi => pi.menu === m._id ? {
          ...pi,
          quantity: newQty,
          subtotal: newQty * pi.price
        } : pi);
      }
      // New item, add with qty 1
      return [...prev, {
        menu: m._id,
        title: m.title,
        price: m.price,
        quantity: 1,
        subtotal: m.price
      }];
    });
    setSelectedMenuId('');
    setMenuSearch('');
    setIsMenuDropdownOpen(false);
    setFocusedMenuIndex(0);
    
    // Auto-focus on the create order button
    setTimeout(() => {
      createOrderButtonRef.current?.focus();
    }, 100);
  };

 const incQty = (idx: number) => {
    setOrderItems(prev => {
      return prev.map((item, index) => {
        if (index === idx) {
          const newQty = item.quantity + 1;
          return {
            ...item,
            quantity: newQty,
            subtotal: newQty * item.price
          };
        }
        return item;
      });
    });
  };

  const decQty = (idx: number) => {
    setOrderItems(prev => {
      return prev.map((item, index) => {
        if (index === idx && item.quantity > 1) {
          const newQty = item.quantity - 1;
          return {
            ...item,
            quantity: newQty,
            subtotal: newQty * item.price
          };
        }
        return item;
      });
    });
  };

  const changeQty = (idx: number, newQtyStr: string) => {
    const newQty = parseInt(newQtyStr, 10);
    setOrderItems(prev => {
      return prev.map((item, index) => {
        if (index === idx) {
          const qty = isNaN(newQty) || newQty < 1 ? 1 : newQty;
          return {
            ...item,
            quantity: qty,
            subtotal: qty * item.price
          };
        }
        return item;
      });
    });
  };

  const removeItem = (idx: number) => {
    setOrderItems(prev => {
      const n = [...prev];
      n.splice(idx, 1);
      
      // Update focus
      if (focusedItemIndex >= idx && focusedItemIndex > 0) {
        setFocusedItemIndex(prevIdx => prevIdx - 1);
      } else if (focusedItemIndex === idx && idx === 0 && n.length > 0) {
        setFocusedItemIndex(0);
      } else if (n.length === 0) {
        setFocusedItemIndex(-1);
        menuSearchInputRef.current?.focus();
      }
      
      return n;
    });
  };

  const orderTotal = () => orderItems.reduce((s, it) => s + (it.subtotal || 0), 0);

  const handleCreate = async () => {
    if (isCreatingRef.current) return; // Prevent re-entrant calls
    if (orderItems.length === 0) return alert('Add at least one menu item');

    isCreatingRef.current = true;
    setIsCreatingOrder(true);
    try {
      const payload = {
        items: orderItems.map(it => ({
          menu: it.menu,
          title: it.title,
          price: it.price,
          quantity: it.quantity,
          subtotal: it.subtotal
        })),
        total: orderTotal(),
        tableNumber,
        date,
        timing,
        settlements: [], // Empty array for new orders
        status: 'pending'
      };

      const res = await apiClient.createSalesOrder(payload);
      const so = res && (res.salesOrder || res.data || res);
      setLastCreated(so);
      setOrderItems([]);
      setTableNumber('');
      alert('Sales order created');
      
      // Auto-select the newly created order
      setSelectedOrder(so);
      setFocusedOrderIndex(0);
      setFocusedItemIndex(-1);
      
      // Focus back on table number
      setTimeout(() => {
        tableNumberInputRef.current?.focus();
      }, 100);
      
      load();
    } catch (err) {
      console.error(err);
      alert('Failed to create');
    } finally {
      isCreatingRef.current = false;
      setIsCreatingOrder(false);
    }
  };

  const handleSettle = async (so: any) => {
    if (!so) return;
    const id = so._id || so._1d || so.id;
    try {
      await apiClient.updateSalesOrder(id, {
        status: 'completed',
        settlements: [{
          method: settleMethodLocal,
          amount: so.total,
          upiCode: localUpiCode,
        }]
      });
      alert('Order settled');
      const refreshed = await apiClient.getSalesOrderById(id);
      const updated = refreshed && (refreshed.salesOrder || refreshed.data || refreshed);
      printBill(updated || so);
      setLastCreated(null);
      setSettleMethodLocal('upi');
      setLocalUpiCode('');
      load();
    } catch (err) {
      console.error(err);
      alert('Failed to settle');
    }
  };

const printKOT = (so: any) => {
  if (!so) return;
  const isNewOrder = !so.updatedAt || new Date(so.createdAt).getTime() === new Date(so.updatedAt).getTime();
  
  const printWindow = window.open('', '_blank', 'width=320,height=600');
  if (!printWindow) {
    alert('Popup blocked! Please allow popups for this site to print.');
    return;
  }

  // Filter out any items with zero or negative quantity (safety check)
  const validItems = (so.items || []).filter((item: any) => item.quantity > 0);
  
  const itemsHtml = validItems.map((it: any) => `
    <tr>
      <td style="font-size: 14px; padding: 3px 0; font-weight: 500;">${it.title}</td>
      <td style="font-size: 14px; padding: 3px 0; text-align: center; width: 30px; font-weight: bold;">${it.quantity}</td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>KOT - ${so.tableNumber || 'TAKE AWAY'}</title>
      <meta charset="UTF-8">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@400;700&family=Roboto+Mono:wght@400;700&display=swap');
        
        @media print {
          @page {
            margin: 0;
            padding: 0;
            size: 80mm auto;
          }
          
          body {
            margin: 0;
            padding: 4mm;
            width: 72mm;
            font-family: 'Roboto Mono', monospace, sans-serif;
            font-size: 12px;
            line-height: 1.2;
            background: white;
            color: black;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          .ticket {
            width: 72mm;
            margin: 0 auto;
          }
          
          * {
            color: black !important;
            background: transparent !important;
            border-color: black !important;
          }
        }
        
        body {
          margin: 0;
          padding: 4mm;
          width: 72mm;
          font-family: 'Roboto Mono', monospace, sans-serif;
          font-size: 12px;
          line-height: 1.2;
          background: white;
          color: black;
        }
        
        .ticket {
          width: 72mm;
          margin: 0 auto;
        }
        
        .header, .footer {
          text-align: center;
          padding: 3mm 0;
          border-bottom: 2px solid #000;
        }
        
        .restaurant-name {
          font-family: 'Roboto Condensed', sans-serif;
          font-weight: 700;
          font-size: 18px;
          margin-bottom: 2mm;
          letter-spacing: 1px;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 3mm 0;
        }
        
        th, td {
          padding: 2px 0;
          font-size: 12px;
        }
        
        th {
          font-weight: 700;
          border-bottom: 1px solid #000;
          padding-bottom: 2mm;
        }
        
        .total-row {
          border-top: 2px solid #000;
          font-weight: bold;
          padding-top: 2mm;
        }
        
        .kot-title {
          font-family: 'Roboto Condensed', sans-serif;
          font-weight: 700;
          font-size: 16px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
      </style>
    </head>
    <body onload="window.print(); setTimeout(() => window.close(), 1000);">
      <div class="ticket">
        <div class="header">
          <div class="restaurant-name">Sattvik Kaleva</div>
          <div style="font-weight: 500;">Pure Veg Restaurant</div>
        </div>
        
        <div style="text-align: center; margin: 3mm 0;">
          <div class="kot-title">KITCHEN ORDER TICKET</div>
          <div style="font-weight: 500; margin-top: 1mm;">
            Table: <strong>${so.tableNumber || 'TAKE AWAY'}</strong> | ${so.timing || ''}
          </div>
          <div style="font-size: 11px; margin-top: 1mm;">
            ${isNewOrder ? '** NEW ORDER **' : '** ORDER UPDATE **'}
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th style="text-align: left;">Item</th>
              <th style="text-align: center;">Qty</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        
        <div class="footer">
          <div style="font-weight: 700; margin-bottom: 1mm;">*** Thank You ***</div>
          <div>${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
      </div>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
};

const printChangeKOT = (originalOrder: any, updatedOrder: any) => {
  if (!originalOrder || !updatedOrder) return;

  const originalItemsMap = new Map(originalOrder.items.map((item: any) => [item.menu || item.title, item]));
  const updatedItemsMap = new Map(updatedOrder.items.map((item: any) => [item.menu || item.title, item]));

  const newItems: any[] = [];

  // Find new/changed items (ONLY ADDITIONS/INCREASES)
  updatedItemsMap.forEach((newItem, key) => {
    const originalItem = originalItemsMap.get(key);
    if (!originalItem) {
      newItems.push(newItem); // Completely new item
    } else if (newItem.quantity > originalItem.quantity) {
      // Only show the increased quantity, not the entire item
      newItems.push({
        ...newItem,
        quantity: newItem.quantity - originalItem.quantity,
        title: `${newItem.title}`
      });
    }
  });

  // If no new items were added, don't print
  if (newItems.length === 0) {
    alert("No new items were added to the order.");
    return;
  }

  const printWindow = window.open('', '_blank', 'width=320,height=600');
  if (!printWindow) {
    alert('Popup blocked! Please allow popups for this site to print.');
    return;
  }

  const itemsHtml = newItems.map((it: any) => `
    <tr>
      <td style="font-size: 14px; padding: 3px 0; font-weight: 500;">${it.title}</td>
      <td style="font-size: 14px; padding: 3px 0; text-align: center; width: 30px; font-weight: bold;">${it.quantity}</td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>CHANGE KOT - ${updatedOrder.tableNumber || 'TAKE AWAY'}</title>
      <meta charset="UTF-8">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@400;700&family=Roboto+Mono:wght@400;700&display=swap');
        
        @media print {
          @page {
            margin: 0;
            padding: 0;
            size: 80mm auto;
          }
          
          body {
            margin: 0;
            padding: 4mm;
            width: 72mm;
            font-family: 'Roboto Mono', monospace, sans-serif;
            font-size: 12px;
            line-height: 1.2;
            background: white;
            color: black;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          .ticket {
            width: 72mm;
            margin: 0 auto;
          }
          
          * {
            color: black !important;
            background: transparent !important;
            border-color: black !important;
          }
        }
        
        body {
          margin: 0;
          padding: 4mm;
          width: 72mm;
          font-family: 'Roboto Mono', monospace, sans-serif;
          font-size: 12px;
          line-height: 1.2;
          background: white;
          color: black;
        }
        
        .ticket {
          width: 72mm;
          margin: 0 auto;
        }
        
        .header, .footer {
          text-align: center;
          padding: 3mm 0;
          border-bottom: 2px solid #000;
        }
        
        .restaurant-name {
          font-family: 'Roboto Condensed', sans-serif;
          font-weight: 700;
          font-size: 18px;
          margin-bottom: 2mm;
          letter-spacing: 1px;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 3mm 0;
        }
        
        th, td {
          padding: 2px 0;
          font-size: 12px;
        }
        
        th {
          font-weight: 700;
          border-bottom: 1px solid #000;
          padding-bottom: 2mm;
        }
        
        .change-title {
          font-family: 'Roboto Condensed', sans-serif;
          font-weight: 700;
          font-size: 16px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #e67e22;
          text-align: center;
          margin: 2mm 0;
          border: 2px dashed #e67e22;
          padding: 2mm;
          background: #fff8e1;
        }
        
        .change-label {
          background: #e67e22;
          color: white;
          padding: 1mm 3mm;
          border-radius: 3px;
          font-size: 11px;
          font-weight: bold;
          margin-left: 5mm;
        }
        
        .section-title {
          font-weight: 700;
          font-size: 14px;
          text-align: center;
          border-top: 1px dashed #000;
          border-bottom: 1px dashed #000;
          padding: 2mm 0;
          margin-top: 3mm;
          background: #f8f9fa;
        }
      </style>
    </head>
    <body onload="window.print(); setTimeout(() => window.close(), 1000);">
      <div class="ticket">
        <div class="header">
          <div class="restaurant-name">Sattvik Kaleva</div>
          <div style="font-weight: 500;">Pure Veg Restaurant</div>
        </div>
        
        <div style="text-align: center; margin: 2mm 0;">
          <div class="change-title">CHANGE ORDER KOT</div>
          <div style="font-weight: 500; margin-top: 1mm; display: flex; align-items: center; justify-content: center;">
            Table: <strong>${updatedOrder.tableNumber || 'TAKE AWAY'}</strong>
            <span style="margin: 0 5px">|</span>
            ${updatedOrder.timing || ''}
          </div>
          <div style="font-size: 11px; color: #666; margin-top: 1mm;">
            Order Update: ${new Date().toLocaleString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
              day: '2-digit',
              month: 'short'
            })}
          </div>
        </div>
        
        <div class="section-title">NEW / ADDED ITEMS</div>
        
        <table>
          <thead>
            <tr>
              <th style="text-align: left;">Item</th>
              <th style="text-align: center;">Qty</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        
        <div class="footer">
          <div style="font-weight: 700; margin-bottom: 1mm; color: #e67e22;">*** KITCHEN NOTICE ***</div>
          <div>Previous Order No: ${originalOrder.orderNumber || originalOrder._id?.slice(-6) || 'N/A'}</div>
          <div style="font-size: 11px; margin-top: 1mm;">
            ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
};

const printBill = (so: any) => {
  if (!so) return;
  
  const printWindow = window.open('', '_blank', 'width=320,height=600');
  if (!printWindow) {
    alert('Popup blocked! Please allow popups for this site to print.');
    return;
  }

  const itemsHtml = (so.items || []).map((it: any) => `
    <tr>
      <td style="font-size: 12px; padding: 2px 0; font-weight: 500;">${it.title}</td>
      <td style="font-size: 12px; padding: 2px 0; text-align: center; font-weight: 500;">${it.quantity}</td>
      <td style="font-size: 12px; padding: 2px 0; text-align: right; font-weight: 500;">₹${it.price}</td>
      <td style="font-size: 12px; padding: 2px 0; text-align: right; font-weight: 500;">₹${it.subtotal}</td>
    </tr>
  `).join('');

  const settlementsHtml = (so.settlements && so.settlements.length > 0 ? so.settlements : []).map((p: any) => `
    <div>
      <strong>Payment (${(p.method || 'cash').toUpperCase()}):</strong> ₹${p.amount || so.total}
      ${p.method === 'upi' && p.upiCode ? ` (Ref: ${p.upiCode})` : ''}
    </div>
  `).join('');

  // Get display ID (orderNumber or last 6 chars of _id)
  const getDisplayId = (order: any) => {
    if (order.orderNumber) {
      return order.orderNumber;
    }
    const id = order._id || order._1d || order.id;
    return `#${id?.slice(-6)}`;
  };

  const orderNumberDisplay = getDisplayId(so);

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Bill - ${so.tableNumber || 'TAKE AWAY'}</title>
      <meta charset="UTF-8">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@400;700&family=Roboto+Mono:wght@400;700&display=swap');
        
        @media print {
          @page {
            margin: 0;
            padding: 0;
            size: 80mm auto;
          }
          
          body {
            margin: 0;
            padding: 4mm;
            width: 72mm;
            font-family: 'Roboto Mono', monospace, sans-serif;
            font-size: 12px;
            line-height: 1.2;
            background: white;
            color: black;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          .ticket {
            width: 72mm;
            margin: 0 auto;
          }
          
          * {
            color: black !important;
            background: transparent !important;
            border-color: black !important;
          }
        }
        
        body {
          margin: 0;
          padding: 4mm;
          width: 72mm;
          font-family: 'Roboto Mono', monospace, sans-serif;
          font-size: 12px;
          line-height: 1.2;
          background: white;
          color: black;
        }
        
        .ticket {
          width: 72mm;
          margin: 0 auto;
        }
        
        .header, .footer {
          text-align: center;
          padding: 3mm 0;
          border-bottom: 2px solid #000;
        }
        
        .restaurant-name {
          font-family: 'Roboto Condensed', sans-serif;
          font-weight: 700;
          font-size: 18px;
          margin-bottom: 1mm;
          letter-spacing: 1px;
        }
        
        .restaurant-address {
          font-size: 11px;
          line-height: 1.3;
          margin-top: 1mm;
          margin-bottom: 1mm;
          color: #444;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 3mm 0;
        }
        
        th, td {
          padding: 2px 0;
          font-size: 12px;
        }
        
        th {
          font-weight: 700;
          border-bottom: 1px solid #000;
          padding-bottom: 2mm;
        }
        
        .total-row {
          border-top: 2px solid #000;
          font-weight: bold;
          padding-top: 2mm;
        }
        
        .bill-title {
          font-family: 'Roboto Condensed', sans-serif;
          font-weight: 700;
          font-size: 16px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .payment-info {
          font-weight: 700;
          border: 2px solid #000;
          padding: 3mm;
          margin: 3mm 0;
        }
        
        .order-number {
          font-size: 13px;
          font-weight: 600;
          margin-top: 2mm;
          padding: 1mm 2mm;
          background-color: #f0f0f0;
          display:inline-block;
          border-radius: 3px;
        }
      </style>
    </head>
    <body onload="window.print(); setTimeout(() => window.close(), 1000);">
      <div class="ticket">
        <div class="header">
          <div class="restaurant-name">Sattvik Kaleva</div>
          <div style="font-weight: 500; font-size: 14px;">TAX INVOICE</div>
          <div class="restaurant-address">
            Devpuri, Raipur, Chhattisgarh 492015
          </div>
          <div class="order-number">Order: ${orderNumberDisplay}</div>
        </div>
        
        <div style="text-align: center; margin: 3mm 0;">
          <div style="font-weight: 500;">
            Table: <strong>${so.tableNumber || 'TAKE AWAY'}</strong> | ${so.timing || ''}
          </div>
          <div style="font-size: 11px; margin-top: 1mm;">
            ${so.date ? new Date(so.date).toLocaleDateString('en-IN') : ''}
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th style="text-align: left;">Item</th>
              <th style="text-align: center;">Qty</th>
              <th style="text-align: right;">Rate</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr class="total-row">
              <td colspan="3" style="text-align: right; font-size: 14px;">Total:</td>
              <td style="text-align: right; font-size: 14px; font-weight: 700;">₹${so.total || 0}</td>
            </tr>
          </tfoot>
        </table>
        
        <div class="payment-info">
          ${settlementsHtml}
        </div>
        
        <div class="footer">
          <div style="font-weight: 700; margin-bottom: 1mm;">*** Thank You ***</div>
          <div>${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
      </div>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
};

  // per-order settle UI state handlers
 const toggleSettleFor = (so: any) => {
  const id = so._id || so._1d || so.id;
  setActiveSettleId(prev => prev === id ? null : id);
  
  // Initialize settlements if not exists or if order already has settlements from backend
  if (!settlementsById[id]) {
    // If order already has settlements, use them
    if (so.settlements && so.settlements.length > 0) {
      setSettlementsById(prev => ({
        ...prev,
        [id]: so.settlements.map(s => ({
          method: s.method,
          amount: s.amount,
          upiCode: s.upiCode || ''
        }))
      }));
    } else {
      // Otherwise start with one cash settlement for the full amount
      setSettlementsById(prev => ({
        ...prev,
        [id]: [{
          method: 'cash',
          amount: so.total || 0,
          upiCode: ''
        }]
      }));
    }
  }
};

 const confirmSettle = async (so: any) => {
  const id = so._id || so._1d || so.id;
  const settlements = settlementsById[id] || [];
  const totalSettled = settlements.reduce((sum, s) => sum + s.amount, 0);
  try {
    // Create valid settlement objects
    const validSettlements = settlements.map(settlement => ({
      method: settlement.method,
      amount: parseFloat(settlement.amount),
      upiCode: settlement.method === 'upi' ? settlement.upiCode : undefined
    }));

    await apiClient.updateSalesOrder(id, {
      status: 'completed',
      settlements: validSettlements,
    });
    
    alert('Order settled');
    const refreshed = await apiClient.getSalesOrderById(id);
    const updated = refreshed && (refreshed.salesOrder || refreshed.data || refreshed);
    printBill(updated || so);
    setActiveSettleId(null);
    load();
  } catch (err) {
    console.error(err);
    alert('Failed to settle');
  }
};

 const handleSettlementChange = (orderId: string, index: number, field: string, value: any) => {
  setSettlementsById(prev => {
    const updatedSettlements = [...(prev[orderId] || [])];
    
    // For amount field, ensure it's a valid number
    if (field === 'amount') {
      const amountValue = parseFloat(value);
      const validAmount = isNaN(amountValue) ? 0 : Math.max(0, amountValue);
      updatedSettlements[index] = {
        ...updatedSettlements[index],
        [field]: validAmount
      };
    } else {
      updatedSettlements[index] = {
        ...updatedSettlements[index],
        [field]: value
      };
    }
    
    return { ...prev, [orderId]: updatedSettlements };
  });
};

  const addSettlement = (orderId: string, orderTotal: number) => {
  setSettlementsById(prev => {
    const existingSettlements = prev[orderId] || [];
    const settledAmount = existingSettlements.reduce((sum, s) => sum + (s.amount || 0), 0);
    const remainingAmount = orderTotal - settledAmount;
    
    // If remaining amount is zero or negative, add a settlement with zero amount
    const newAmount = Math.max(0, remainingAmount);
    
    const newSettlements = [
      ...existingSettlements,
      {
        method: 'cash',
        amount: newAmount,
        upiCode: ''
      }
    ];
    
    return { ...prev, [orderId]: newSettlements };
  });
};

  const removeSettlement = (orderId: string, index: number) => {
    setSettlementsById(prev => ({ ...prev, [orderId]: prev[orderId].filter((_, i) => i !== index) }));
  };

  // per-order edit UI state handlers
  const toggleEditFor = (so: any) => {
    const id = so._1d || so._id || so.id;
    setActiveEditId(prev => prev === id ? null : id);
    setEditFieldsById(prev => ({
      ...prev,
      [id]: prev[id] || {
        tableNumber: so.tableNumber || '',
        timing: so.timing || '',
        items: (so.items || []).map((it: any) => ({ ...it }))
      }
    }));
  };

  const changeEditField = (id: string, field: 'tableNumber' | 'timing', value: string) => {
    setEditFieldsById(prev => ({ ...prev, [id]: { ...(prev[id] || {}), [field]: value } }));
  };

const changeEditItemQty = (orderId: string, itemIdx: number, delta: number) => {
    setEditFieldsById(prev => {
      const orderEdit = { ...(prev[orderId] || {}) };
      const items = [...(orderEdit.items || [])];
      if (items[itemIdx]) {
        const newQty = Math.max(1, (items[itemIdx].quantity || 0) + delta);
        items[itemIdx] = { ...items[itemIdx], quantity: newQty, subtotal: newQty * (items[itemIdx].price || 0) };
      }
      return { ...prev, [orderId]: { ...orderEdit, items } };
    });
  };

  const removeEditItem = (orderId: string, itemIdx: number) => {
    setEditFieldsById(prev => {
      const orderEdit = { ...(prev[orderId] || {}) };
      const items = [...(orderEdit.items || [])];
      items.splice(itemIdx, 1);
      return { ...prev, [orderId]: { ...orderEdit, items } };
    });
  };

  const addMenuToEditOrder = (orderId: string, menuId: string) => {
    const m = menus.find(x => x._id === menuId);
    if (!m) return;
    setEditFieldsById(prev => {
      const orderEdit = { ...(prev[orderId] || {}) };
      const items = [...(orderEdit.items || [])];
      const found = items.findIndex(it => it.menu === m._id);
      if (found >= 0) {
        const qty = (items[found].quantity || 0) + 1;
        items[found] = { ...items[found], quantity: qty, subtotal: qty * items[found].price };
      } else {
        items.push({ menu: m._id, title: m.title, price: m.price, quantity: 1, subtotal: m.price * 1 });
      }
      return { ...prev, [orderId]: { ...orderEdit, items } };
    });
  };

  const editOrderTotal = (orderId: string): number => {
    const items = editFieldsById[orderId]?.items || [];
    return items.reduce((s, it) => s + (it.subtotal || 0), 0);
  };

  const saveEdit = async (so: any) => {
    const id = so._id || so._1d || so.id;
    const fields = editFieldsById[id] || {};
    try {
      const updateData: any = { tableNumber: fields.tableNumber, timing: fields.timing };
      if (fields.items) {
        updateData.items = fields.items.map((it: any) => ({
          menu: it.menu || undefined,
          title: it.title,
          price: it.price,
          quantity: it.quantity,
          subtotal: it.subtotal
        }));
        updateData.total = editOrderTotal(id);
      }
      await apiClient.updateSalesOrder(id, updateData);
      const refreshed = await apiClient.getSalesOrderById(id);
      const updatedOrder = refreshed && (refreshed.salesOrder || refreshed.data || refreshed);
      
      printChangeKOT(so, updatedOrder);
      alert('Order updated');
      setActiveEditId(null);
      load();
    } catch (err) {
      console.error(err);
      alert('Failed to update order');
    }
  };

  // Get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    return new Date().toISOString().slice(0, 10);
  };

  // Filter orders to show only current date
  const currentDate = getCurrentDate();
  const currentDateOrders = items.filter(item => {
    const orderDate = item.date ? new Date(item.date).toISOString().slice(0, 10) :
                      item.createdAt ? new Date(item.createdAt).toISOString().slice(0, 10) : '';
    return orderDate === currentDate;
  });

  // Separate settled and unsettled orders for current date only
  const unsettledOrders = currentDateOrders.filter(item => item.status !== 'completed' && item.status !== 'cancelled');
  const settledOrders = currentDateOrders.filter(item => item.status === 'completed');

  // Pagination for unsettled orders
  const indexOfLastUnsettledOrder = unsettledPage * ordersPerPage;
  const indexOfFirstUnsettledOrder = indexOfLastUnsettledOrder - ordersPerPage;
  const currentUnsettledOrders = unsettledOrders.slice(indexOfFirstUnsettledOrder, indexOfLastUnsettledOrder);

  // Pagination for settled orders
  const indexOfLastSettledOrder = settledPage * ordersPerPage;
  const indexOfFirstSettledOrder = indexOfLastSettledOrder - ordersPerPage;
  const currentSettledOrders = settledOrders.slice(indexOfFirstSettledOrder, indexOfLastSettledOrder);

  const paginateUnsettled = (pageNumber: number) => setUnsettledPage(pageNumber);
  const paginateSettled = (pageNumber: number) => setSettledPage(pageNumber);

  // Handle order click to select
  const handleOrderClick = (order: any, index: number) => {
    setSelectedOrder(order);
    setFocusedOrderIndex(index);
  };

  // Function to get display ID (orderNumber or last 6 chars of _id)
  const getDisplayId = (order: any) => {
    if (order.orderNumber) {
      return order.orderNumber;
    }
    const id = order._id || order._1d || order.id;
    return `#${id?.slice(-6)}`;
  };

  // Handle keyboard for selected items
  const handleItemKeyDown = (e: KeyboardEvent, idx: number) => {
    switch(e.key) {
      case '+':
      case '=':
        e.preventDefault();
        incQty(idx);
        break;
      case '-':
      case '_':
        e.preventDefault();
        decQty(idx);
        break;
      case 'Delete':
      case 'Backspace':
        if (e.ctrlKey) {
          e.preventDefault();
          removeItem(idx);
        }
        break;
      case 'ArrowRight':
      case 'Tab':
        if (!e.shiftKey) {
          e.preventDefault();
          if (idx < orderItems.length - 1) {
            setFocusedItemIndex(idx + 1);
            setTimeout(() => itemButtonRefs.current[idx + 1]?.focus(), 10);
          } else {
            createOrderButtonRef.current?.focus();
          }
        }
        break;
      case 'ArrowLeft':
      case 'Tab':
        if (e.shiftKey) {
          e.preventDefault();
          if (idx > 0) {
            setFocusedItemIndex(idx - 1);
            setTimeout(() => itemButtonRefs.current[idx - 1]?.focus(), 10);
          } else {
            menuSearchInputRef.current?.focus();
          }
        }
        break;
      case 'Enter':
        e.preventDefault();
        // Focus on quantity input
        itemQuantityRefs.current[idx]?.focus();
        itemQuantityRefs.current[idx]?.select();
        break;
      case ' ':
        e.preventDefault();
        incQty(idx);
        break;
    }
  };

  // Handle keyboard for pending orders
  const handlePendingOrderKeyDown = (e: KeyboardEvent, order: any, idx: number) => {
    const id = order._id || order._1d || order.id;
    const isSettled = order.status === 'completed';
    
    switch(e.key) {
      case 'Enter':
        e.preventDefault();
        if (!isSettled) {
          printKOT(order);
        }
        break;
      case ' ':
        e.preventDefault();
        printBill(order);
        break;
      case 's':
        if (!isSettled && !e.ctrlKey) {
          e.preventDefault();
          toggleSettleFor(order);
        }
        break;
      case 'e':
        if (!isSettled && !e.ctrlKey) {
          e.preventDefault();
          toggleEditFor(order);
        }
        break;
      case 'k':
        if (!isSettled && !e.ctrlKey) {
          e.preventDefault();
          printKOT(order);
        }
        break;
      case 'b':
        if (!e.ctrlKey) {
          e.preventDefault();
          printBill(order);
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (idx < currentUnsettledOrders.length - 1) {
          const nextIdx = idx + 1;
          setFocusedPendingOrderIndex(nextIdx);
          setTimeout(() => pendingOrderButtonRefs.current[nextIdx]?.focus(), 10);
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (idx > 0) {
          const prevIdx = idx - 1;
          setFocusedPendingOrderIndex(prevIdx);
          setTimeout(() => pendingOrderButtonRefs.current[prevIdx]?.focus(), 10);
        }
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Keyboard Shortcuts Help Modal */}
        {showShortcutHelp && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Keyboard Shortcuts</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowShortcutHelp(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">↑ / ↓ Arrow Keys</span>
                  <span className="text-gray-600">Navigate orders</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">Ctrl + N / Cmd + N</span>
                  <span className="text-gray-600">Focus on new order table number</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">Ctrl + C / Cmd + C</span>
                  <span className="text-gray-600">Create order</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">Escape (ESC)</span>
                  <span className="text-gray-600">Print KOT for selected order</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">Enter</span>
                  <span className="text-gray-600">Print Bill for selected order</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">+ / =</span>
                  <span className="text-gray-600">Increase quantity (when focused on item)</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">- / _</span>
                  <span className="text-gray-600">Decrease quantity (when focused on item)</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">Space</span>
                  <span className="text-gray-600">Increase quantity / Print Bill</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">Ctrl + Delete</span>
                  <span className="text-gray-600">Remove item from order</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">Tab / Shift + Tab</span>
                  <span className="text-gray-600">Navigate between items</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">S</span>
                  <span className="text-gray-600">Settle focused order</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">E</span>
                  <span className="text-gray-600">Edit focused order</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">K</span>
                  <span className="text-gray-600">Print KOT for focused order</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">B</span>
                  <span className="text-gray-600">Print Bill for focused order</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">Ctrl + R / Cmd + R</span>
                  <span className="text-gray-600">Refresh orders</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">?</span>
                  <span className="text-gray-600">Show this help</span>
                </div>
              </div>
              <div className="mt-6 text-center text-sm text-gray-500">
                Click anywhere or press Escape to close
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Sales Order - {nextOrderNumber}</h1>
          
            <div className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-lg mt-2 inline-block">
              📅 Showing orders for: {currentDateString}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search orders..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button
              onClick={() => setShowShortcutHelp(true)}
              variant="outline"
              className="whitespace-nowrap"
              title="Keyboard Shortcuts (?)"
            >
              <Keyboard className="h-4 w-4 mr-2" />
              Shortcuts
            </Button>
            <Button onClick={load} variant="outline" className="whitespace-nowrap">
              Refresh
            </Button>
          </div>
        </div>

        {/* Selected Order Indicator */}
        {selectedOrder && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
            <div>
              <span className="font-medium">Selected Order:</span>
              <span className="ml-2 text-blue-700">
                Table {selectedOrder.tableNumber || 'TAKE AWAY'} •
                ₹{selectedOrder.total} •
                {selectedOrder.status === 'completed' ? ' Settled' : ' Pending'} •
                {getDisplayId(selectedOrder)}
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => printKOT(selectedOrder)}
                className="bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
              >
                <Printer className="h-3 w-3 mr-1" />
                KOT (ESC)
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => printBill(selectedOrder)}
                className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
              >
                <IndianRupee className="h-3 w-3 mr-1" />
                Bill (Enter)
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Create Order Section - Always on left */}
          <div className="xl:col-span-1">
            <div className="p-6 bg-white rounded-lg shadow-lg border sticky top-4">
              <h2 className="font-semibold text-lg mb-4">Create Sales Order (KOT)</h2>
              
              {/* Enhanced Menu Selection with Search */}
              <div className="space-y-4">
                 {/* Order Details */}
                <div className="space-y-3 mt-4">
                  <input
                    ref={tableNumberInputRef}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Table number (Press Enter to search menu)"
                    required
                    value={tableNumber}
                    onChange={e => setTableNumber(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        menuSearchInputRef.current?.focus();
                      }
                    }}
                  />
                  <div className="flex space-x-3">
                    <input
                      type="date"
                      hidden
                      className="p-3 border rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={date}
                      onChange={e => setDate(e.target.value)}
                    />
                    <input
                      type="time"
                      hidden
                      className="p-3 border rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={timing}
                      onChange={e => setTiming(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="relative">
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Search and Add Menu Items:
                  </label>
                  
                  {/* Search Input with Dropdown */}
                  <div className="relative" ref={menuDropdownRef}>
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      ref={menuSearchInputRef}
                      type="text"
                      placeholder="Search menu items by name or category... (Use ↑↓ arrows to navigate, Enter to select)"
                      value={menuSearch}
                      onChange={(e) => {
                        setMenuSearch(e.target.value);
                        setIsMenuDropdownOpen(true);
                        setFocusedMenuIndex(0); // Reset focus to first item when typing
                      }}
                      onFocus={() => {
                        setIsMenuDropdownOpen(true);
                        setFocusedMenuIndex(0);
                      }}
                      onKeyDown={(e) => {
                        // Enter key - add the currently focused menu item
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          
                          // If dropdown is open and we have filtered menus
                          if (isMenuDropdownOpen && filteredMenus.length > 0) {
                            // Get the currently focused menu item
                            const menuToAdd = filteredMenus[focusedMenuIndex];
                            if (menuToAdd) {
                              addMenuToOrder(menuToAdd._id);
                              setMenuSearch('');
                              setIsMenuDropdownOpen(false);
                              setFocusedMenuIndex(0);
                            }
                          } 
                          // If dropdown is not open but we have a search term, add the first matching item
                          else if (menuSearch.trim() !== '' && filteredMenus.length > 0) {
                            const firstMenu = filteredMenus[0];
                            if (firstMenu) {
                              addMenuToOrder(firstMenu._id);
                              setMenuSearch('');
                              setFocusedMenuIndex(0);
                            }
                          }
                          return;
                        }
                        
                        // Arrow down - navigate to next menu item
                        if (e.key === 'ArrowDown' && isMenuDropdownOpen && filteredMenus.length > 0) {
                          e.preventDefault();
                          setFocusedMenuIndex(prev => 
                            prev < filteredMenus.length - 1 ? prev + 1 : 0
                          );
                          return;
                        }
                        
                        // Arrow up - navigate to previous menu item
                        if (e.key === 'ArrowUp' && isMenuDropdownOpen && filteredMenus.length > 0) {
                          e.preventDefault();
                          setFocusedMenuIndex(prev => 
                            prev > 0 ? prev - 1 : filteredMenus.length - 1
                          );
                          return;
                        }
                        
                        // Escape - close dropdown
                        if (e.key === 'Escape' && isMenuDropdownOpen) {
                          e.preventDefault();
                          setIsMenuDropdownOpen(false);
                          setFocusedMenuIndex(0);
                          return;
                        }
                        
                        // Tab key - close dropdown if open
                        if (e.key === 'Tab' && isMenuDropdownOpen) {
                          setIsMenuDropdownOpen(false);
                          setFocusedMenuIndex(0);
                        }
                      }}
                      className="pl-10 pr-10 py-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {menuSearch && (
                      <button
                        onClick={() => {
                          setMenuSearch('');
                          setIsMenuDropdownOpen(false);
                          setFocusedMenuIndex(0);
                        }}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 menu-dropdown-close-button"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setIsMenuDropdownOpen(!isMenuDropdownOpen);
                        if (!isMenuDropdownOpen) {
                          setFocusedMenuIndex(0);
                        }
                      }}
                      className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 menu-dropdown-close-button"
                    >
                      <ChevronDown className={`h-4 w-4 transition-transform ${isMenuDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  {/* Enhanced Dropdown Menu - Now scrollable after certain height */}
                  {isMenuDropdownOpen && (
                    <div 
                      className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg" 
                      style={{ maxHeight: '400px', overflowY: 'auto' }}
                    >
                      {filteredMenus.length === 0 ? (
                        <div className="p-4 text-center text-gray-500 text-sm">
                          No menu items found matching "{menuSearch}"
                        </div>
                      ) : (
                        <div className="py-2">
                          {filteredMenus.map((menu: any, index: number) => {
                            const isFocused = index === focusedMenuIndex;
                            
                            return (
                              <button
                                key={menu._id}
                                ref={isFocused ? focusedMenuRef : null}
                                onClick={() => {
                                  addMenuToOrder(menu._id);
                                  setMenuSearch('');
                                  setIsMenuDropdownOpen(false);
                                  setFocusedMenuIndex(0);
                                }}
                                className={`w-full text-left px-4 py-3 hover:bg-blue-50 border-b last:border-b-0 transition-colors ${
                                  isFocused ? 'bg-blue-50 ring-1 ring-blue-300' : ''
                                }`}
                                onMouseEnter={() => setFocusedMenuIndex(index)}
                                onKeyDown={(e) => {
                                  // Enter key on individual menu item
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addMenuToOrder(menu._id);
                                    setMenuSearch('');
                                    setIsMenuDropdownOpen(false);
                                    setFocusedMenuIndex(0);
                                    return;
                                  }
                                  
                                  // Arrow down - navigate to next menu item
                                  if (e.key === 'ArrowDown') {
                                    e.preventDefault();
                                    setFocusedMenuIndex(prev => 
                                      prev < filteredMenus.length - 1 ? prev + 1 : 0
                                    );
                                    return;
                                  }
                                  
                                  // Arrow up - navigate to previous menu item
                                  if (e.key === 'ArrowUp') {
                                    e.preventDefault();
                                    setFocusedMenuIndex(prev => 
                                      prev > 0 ? prev - 1 : filteredMenus.length - 1
                                    );
                                    return;
                                  }
                                  
                                  // Escape - close dropdown
                                  if (e.key === 'Escape') {
                                    e.preventDefault();
                                    setIsMenuDropdownOpen(false);
                                    setFocusedMenuIndex(0);
                                    menuSearchInputRef.current?.focus();
                                    return;
                                  }
                                }}
                              >
                                <div className="flex justify-between items-center">
                                  <div>
                                    <div className="font-medium text-gray-900">{menu.title}</div>
                                    <div className="text-xs text-gray-500 mt-1">
                                      {typeof menu.category === 'string' ? menu.category : menu.category?.title || 'Uncategorized'}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-semibold text-green-600">₹{menu.price}</div>
                                    <div className="text-xs text-gray-400">Click or press Enter to add</div>
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Selected Items Display */}
                {orderItems.length > 0 && (
                  <div className="border rounded-lg p-4 bg-gray-50 mt-4">
                    <h3 className="font-medium mb-3 text-gray-700">Selected Items: (Tab to navigate, +/- to adjust quantity)</h3>
                    <div className="space-y-3">
                      {orderItems.map((it, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg border shadow-sm">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{it.title}</div>
                            <div className="text-sm text-gray-600"  >₹{it.price} each</div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            {/* Quantity Controls */}
                            <div className="flex items-center space-x-3 bg-blue-50 rounded-lg p-1">
                              <Button
                                ref={el => itemButtonRefs.current[idx] = el}
                                variant="outline"
                                size="sm"
                                onClick={() => decQty(idx)}
                                onKeyDown={(e) => handleItemKeyDown(e, idx)}
                                className="h-8 w-8 p-0 hover:bg-blue-100 focus:ring-2 focus:ring-blue-500"
                                tabIndex={focusedItemIndex === idx ? 0 : -1}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              
                              <input
                                ref={el => itemQuantityRefs.current[idx] = el}
                                type="number"
                                value={it.quantity}
                                onChange={(e) => changeQty(idx, e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'ArrowUp') {
                                    e.preventDefault();
                                    incQty(idx);
                                  } else if (e.key === 'ArrowDown') {
                                    e.preventDefault();
                                    decQty(idx);
                                  }
                                }}
                                className="w-12 text-center font-medium text-blue-700 bg-transparent border-none focus:ring-2 focus:ring-blue-500 focus:outline-none quantity-input"
                                min="1"
                                tabIndex={-1}
                              />
                              
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => incQty(idx)}
                                className="h-8 w-8 p-0 hover:bg-blue-100"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>

                            {/* Subtotal */}
                            <div className="w-20 text-right">
                              <div className="font-medium text-green-600">₹{it.subtotal}</div>
                            </div>

                            {/* Remove Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(idx)}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                              title="Ctrl+Delete to remove"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Order Total */}
                    <div className="mt-4 pt-3 border-t">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-700">Order Total:</span>
                        <span className="text-xl font-bold text-green-600">₹{orderTotal()}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Create Order Button */}
                <div className="mt-4">
                  <Button
                    ref={createOrderButtonRef}
                    onClick={handleCreate}
                    disabled={orderItems.length === 0 || isCreatingOrder}
                    className="w-full py-3 text-lg bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-500"
                    size="lg"
                    onKeyDown={(e) => {
                      if (e.key === 'Tab' && e.shiftKey) {
                        e.preventDefault();
                        if (orderItems.length > 0) {
                          setFocusedItemIndex(orderItems.length - 1);
                          setTimeout(() => itemButtonRefs.current[orderItems.length - 1]?.focus(), 10);
                        } else {
                          menuSearchInputRef.current?.focus();
                        }
                      }
                    }}
                  >
                    {isCreatingOrder ? 'Creating...' : 'Create Order (Ctrl+C)'}
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Pending Orders Section */}
            <div className="p-6 bg-white rounded-lg shadow-lg border mt-12">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg text-orange-600">Pending Orders</h2>
                <div className="text-sm text-gray-500 bg-orange-100 px-2 py-1 rounded-full">
                  {unsettledOrders.length} pending
                </div>
              </div>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading orders...</p>
                </div>
              ) : (
                <div
                  ref={setOrderListRef}
                  className="space-y-3 max-h-[600px] overflow-y-auto"
                >
                  {currentUnsettledOrders.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                      <p>No pending orders for today</p>
                      <p className="text-sm mt-1">Create a new order to get started</p>
                    </div>
                  ) : (
                    currentUnsettledOrders.map((it, index) => (
                      <OrderCard
                        key={it._id}
                        order={it}
                        index={index}
                        activeSettleId={activeSettleId}
                        activeEditId={activeEditId}
                        settlementsById={settlementsById}
                        editFieldsById={editFieldsById}
                        onToggleSettle={toggleSettleFor}
                        onToggleEdit={toggleEditFor}
                        onSettlementChange={handleSettlementChange}
                        onAddSettlement={addSettlement}
                        onRemoveSettlement={removeSettlement}
                        onChangeEditField={changeEditField}
                        onChangeEditItemQty={changeEditItemQty}
                        onRemoveEditItem={removeEditItem}
                        onAddMenuToEdit={addMenuToEditOrder}
                        onConfirmSettle={confirmSettle}
                        onSaveEdit={saveEdit}
                        onPrintKOT={printKOT}
                        onPrintBill={printBill}
                        editOrderTotal={editOrderTotal}
                        menus={menus}
                        isSelected={selectedOrder?._id === it._id}
                        onClick={() => handleOrderClick(it, index)}
                        onKeyDown={(e) => handlePendingOrderKeyDown(e, it, index)}
                        buttonRef={(el: HTMLButtonElement | null) => {
                          pendingOrderButtonRefs.current[index] = el;
                        }}
                        isFocused={focusedPendingOrderIndex === index}
                        setFocusedIndex={setFocusedPendingOrderIndex}
                      />
                    ))
                  )}
                  {unsettledOrders.length > ordersPerPage && (
                    <Pagination
                      ordersPerPage={ordersPerPage}
                      totalOrders={unsettledOrders.length}
                      paginate={paginateUnsettled}
                      currentPage={unsettledPage}
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Orders Display Section - Unsettled and Settled side by side on larger screens */}
          <div className="xl:col-span-2">
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
              {/* Settled Orders */}
              <div className="p-6 bg-white rounded-lg shadow-lg border">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold text-lg text-green-600">Settled Orders</h2>
                  <div className="text-sm text-gray-500 bg-green-100 px-2 py-1 rounded-full">
                    {settledOrders.length} settled
                  </div>
                </div>
                
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading orders...</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {currentSettledOrders.length === 0 ? (
                      <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                        <p>No settled orders for today</p>
                        <p className="text-sm mt-1">Settle pending orders to see them here</p>
                      </div>
                    ) : (
                      currentSettledOrders.map((it, index) => (
                        <OrderCard
                          key={it._id}
                          order={it}
                          index={index + unsettledOrders.length}
                          activeSettleId={activeSettleId}
                          activeEditId={activeEditId}
                          settlementsById={settlementsById}
                          editFieldsById={editFieldsById}
                          onToggleSettle={toggleSettleFor}
                          onToggleEdit={toggleEditFor}
                          onSettlementChange={handleSettlementChange}
                          onAddSettlement={addSettlement}
                          onRemoveSettlement={removeSettlement}
                          onChangeEditField={changeEditField}
                          onChangeEditItemQty={changeEditItemQty}
                          onRemoveEditItem={removeEditItem}
                          onAddMenuToEdit={addMenuToEditOrder}
                          onConfirmSettle={confirmSettle}
                          onSaveEdit={saveEdit}
                          onPrintKOT={printKOT}
                          onPrintBill={printBill}
                          editOrderTotal={editOrderTotal}
                          menus={menus}
                          isSelected={selectedOrder?._id === it._id}
                          onClick={() => handleOrderClick(it, index + unsettledOrders.length)}
                          onKeyDown={(e) => handlePendingOrderKeyDown(e, it, index)}
                          buttonRef={(el: HTMLButtonElement | null) => {
                            pendingOrderButtonRefs.current[index + unsettledOrders.length] = el;
                          }}
                          isFocused={focusedPendingOrderIndex === index + unsettledOrders.length}
                          setFocusedIndex={setFocusedPendingOrderIndex}
                        />
                      ))
                    )}
                    {settledOrders.length > ordersPerPage && (
                      <Pagination
                        ordersPerPage={ordersPerPage}
                        totalOrders={settledOrders.length}
                        paginate={paginateSettled}
                        currentPage={settledPage}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Separate Order Card Component for better organization
const OrderCard = ({
  order,
  index,
  activeSettleId,
  activeEditId,
  settlementsById,
  editFieldsById,
  onToggleSettle,
  onToggleEdit,
  onSettlementChange,
  onAddSettlement,
  onRemoveSettlement,
  onChangeEditField,
  onChangeEditItemQty,
  onRemoveEditItem,
  onAddMenuToEdit,
  onConfirmSettle,
  onSaveEdit,
  onPrintKOT,
  onPrintBill,
  editOrderTotal,
  menus,
  isSelected,
  onClick,
  onKeyDown,
  buttonRef,
  isFocused,
  setFocusedIndex
}: any) => {
  const id = order._id || order._1d || order.id;
  const isSettled = order.status === 'completed';

  // Function to get display ID (orderNumber or last 6 chars of _id)
  const getDisplayId = (order: any) => {
    if (order.orderNumber) {
      return order.orderNumber;
    }
    const id = order._id || order._1d || order.id;
    return `#${id?.slice(-6)}`;
  };

  // Calculate the total based on actual payments if settled, otherwise use order total.
  const displayTotal = isSettled && order.settlements && order.settlements.length > 0
    ? order.settlements.reduce((sum: number, s: any) => sum + (s.amount || 0), 0)
    : order.total;

  // State for the searchable dropdown in the edit form
  const [editMenuSearch, setEditMenuSearch] = useState('');
  const [isEditMenuDropdownOpen, setIsEditMenuDropdownOpen] = useState(false);
  const editMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (editMenuRef.current && !editMenuRef.current.contains(event.target as Node)) {
            setIsEditMenuDropdownOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const settlements = settlementsById[id] || [];
  const totalSettled = settlements.reduce((sum, s) => sum + s.amount, 0);
  
  return (
    <div
      data-order-id={id}
      className={`p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer ${
        isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'bg-white'
      } ${isFocused ? 'ring-2 ring-orange-500' : ''}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <div className="font-medium text-gray-900">
            {(order.items && order.items[0] && order.items[0].title) || 'Order'}
            {order.items && order.items.length > 1 && ` +${order.items.length - 1} more`}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            Table: <span className="font-medium">{order.tableNumber || 'TAKE AWAY'}</span> •
            Total: <span className="font-medium text-green-600">₹{displayTotal}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">
            {order.date ? new Date(order.date).toLocaleDateString('en-IN') : '-'}
          </div>
          <div className="text-xs text-gray-500">
            {order.timing || ''}
          </div>
          <div className={`text-xs mt-1 px-2 py-1 rounded-full ${
            isSettled
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {isSettled ? 'Completed' : (order.status || 'Pending')}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex space-x-2">
        
         {!isSettled && (
           
          
              <Button 
                ref={buttonRef}
                size="sm" 
                onClick={() => onPrintKOT(order)} 
                variant="outline"
                onKeyDown={onKeyDown}
                onFocus={() => setFocusedIndex?.(index)}
              >
            <Printer className="h-3 w-3 mr-1" />
            KOT
          </Button>
         )}
          <Button 
            size="sm" 
            onClick={() => onPrintBill(order)} 
            variant="outline"
            onKeyDown={onKeyDown}
          >
              <IndianRupee className="h-3 w-3 mr-1" />
              Bill
            </Button>
            {!isSettled && (
              <>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onToggleSettle(order)}
                onKeyDown={onKeyDown}
              >
                {activeSettleId === id ? 'Cancel' : 'Settle'}
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => onToggleEdit(order)}
                onKeyDown={onKeyDown}
              >
                <Edit className="h-3 w-3 mr-1" />
                {activeEditId === id ? 'Close' : 'Edit'}
              </Button>
              </>)}
           
        </div>
        <div className="text-sm text-gray-500 font-mono">{getDisplayId(order)}</div>
      </div>

      {/* Settle UI */}
     {activeSettleId === id && (
  <div className="mt-3 p-4 border rounded bg-blue-50">
    <h4 className="font-semibold mb-3 text-blue-800">Settle Order</h4>
    <div className="space-y-3">
      {settlements.map((settlement: any, index: number) => (
        <div key={index} className="p-3 bg-white rounded border grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
          <select
            className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={settlement.method}
            onChange={e => onSettlementChange(id, index, 'method', e.target.value)}
          >
            <option value="cash">Cash</option>
            <option value="upi">UPI</option>
            <option value="credit">Credit</option>
            <option value="other">Other</option>
          </select>
          <input
            type="number"
            step="0.01"
            className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Amount"
            value={settlement.amount}
            onChange={e => onSettlementChange(id, index, 'amount', e.target.value)}
          />
          {settlement.method === 'upi' && (
            <input
              className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="UPI Reference"
              value={settlement.upiCode || ''}
              onChange={e => onSettlementChange(id, index, 'upiCode', e.target.value)}
            />
          )}
          <div className="flex justify-end">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onRemoveSettlement(id, index)}
              className="text-red-500 hover:bg-red-100 p-2"
              disabled={settlements.length <= 1}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
    
    <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-3">
      <Button
        size="sm"
        variant="outline"
        onClick={() => onAddSettlement(id, order.total)}
        className="w-full sm:w-auto"
      >
        <Plus className="h-4 w-4 mr-1" /> Add Payment Method
      </Button>
      
      <div className="text-sm font-medium">
        <div>Order Total: <span className="font-bold text-blue-600">₹{order.total}</span></div>
        <div>Total Settled: <span className="font-bold text-green-600">₹{totalSettled.toFixed(2)}</span></div>
        <div>Remaining: <span className={`font-bold ${(order.total - totalSettled) > 0.01 ? 'text-red-600' : 'text-green-600'}`}>
          ₹{(order.total - totalSettled).toFixed(2)}
        </span></div>
      </div>
    </div>
    
    <div className="mt-4">
      <Button
        size="sm"
        onClick={() => onConfirmSettle(order)}
        className="w-full bg-green-600 hover:bg-green-700"
      >Confirm Settlement
      </Button>
    </div>
  </div>
)}

      {/* Edit UI - Only show for non-settled orders */}
      {activeEditId === id && !isSettled && (
        <div className="mt-3 p-4 border rounded bg-yellow-50">
          <h4 className="font-semibold mb-3 text-yellow-800">Edit Order</h4>

          {/* Table & Timing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <input
              className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={(editFieldsById[id] && editFieldsById[id].tableNumber) || ''}
              onChange={e => onChangeEditField(id, 'tableNumber', e.target.value)}
              placeholder="Table number"
            />
            <input
              type="time"
              className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={(editFieldsById[id] && editFieldsById[id].timing) || ''}
              onChange={e => onChangeEditField(id, 'timing', e.target.value)}
            />
          </div>

          {/* Edit Items */}
          <div className="border-t pt-3 mb-3">
            <h5 className="text-sm font-medium mb-2 text-gray-700">Items:</h5>
            <div className="space-y-2 mb-3">
              {(editFieldsById[id]?.items || []).map((item: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-white rounded border">
                  <div className="flex-1">
                    <div className="text-sm font-medium">{item.title}</div>
                    <div className="text-xs text-gray-600">₹{item.price} each</div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onChangeEditItemQty(id, idx, -1)}
                      className="h-7 w-7 p-0"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onChangeEditItemQty(id, idx, 1)}
                      className="h-7 w-7 p-0"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <div className="w-16 text-right text-xs font-medium text-green-600">₹{item.subtotal}</div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveEditItem(id, idx)}
                      className="h-7 w-7 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative mb-3" ref={editMenuRef}>
              <input
                type="text"
                placeholder="Search to add item..."
                className="p-2 border rounded text-xs w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={editMenuSearch}
                onChange={e => {
                  setEditMenuSearch(e.target.value);
                  setIsEditMenuDropdownOpen(true);
                }}
                onFocus={() => setIsEditMenuDropdownOpen(true)}
              />
              {isEditMenuDropdownOpen && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                  {menus
                    .filter((m: Menu) => m.title.toLowerCase().includes(editMenuSearch.toLowerCase()))
                    .map((m: Menu) => (
                      <button
                        key={m._id}
                        onClick={() => {
                          onAddMenuToEdit(id, m._id);
                          setEditMenuSearch('');
                          setIsEditMenuDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs hover:bg-blue-50 border-b last:border-b-0"
                      >{m.title} — ₹{m.price}</button>
                    ))}
                </div>
              )}
            </div>

            {/* Total */}
            <div className="pt-2 border-t flex justify-between items-center text-sm">
              <span className="font-medium">Total:</span>
              <span className="font-bold text-green-600">₹{editOrderTotal(id)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button size="sm" onClick={() => onSaveEdit(order)} >
              Save Changes
            </Button>
            <Button size="sm" variant="ghost" onClick={() => onToggleEdit(order)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};