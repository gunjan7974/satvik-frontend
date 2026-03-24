"use client";

import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { getSalesOrders, updateSalesOrder } from '../../../utils/services/salesOrderService';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  Eye, 
  Edit, 
  SortAsc, 
  SortDesc,
  Calendar,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  FileDown
} from 'lucide-react';

// Define interfaces based on backend schema
interface Item {
  menu?: string; // ObjectId
  title: string;
  price: number;
  quantity: number;
  subtotal: number;
}

interface Settlement {
  method: 'upi' | 'cash' | 'credit' | 'other';
  amount: number;
  upiCode?: string;
  settledAt: string; // Date string
}

interface SalesOrder {
  _id: string;
  orderNumber: string;
  items: Item[];
  total: number;
  tableNumber?: string;
  date: string; // Date string
  timing?: string;
  settlements: Settlement[];
  status: 'pending' | 'completed' | 'cancelled';
  createdBy?: string; // ObjectId
  createdAt: string; // Date string
  updatedAt: string; // Date string
  totalSettled?: number; // Virtual
  remainingAmount?: number; // Virtual
  isFullySettled?: boolean; // Virtual method
  notes?: string;
}

const SalesOrderPage: React.FC = () => {
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingSalesOrder, setEditingSalesOrder] = useState<SalesOrder | null>(null);
  const [editedTableNumber, setEditedTableNumber] = useState<string>('');
  const [editedItems, setEditedItems] = useState<Item[]>([]);
  const [editedSettlements, setEditedSettlements] = useState<Settlement[]>([]);
  const [editNotes, setEditNotes] = useState<string>('');
  const [editError, setEditError] = useState<string | null>(null);
  const [filterDate, setFilterDate] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof SalesOrder; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [viewOrder, setViewOrder] = useState<SalesOrder | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchSalesOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getSalesOrders();
        setSalesOrders(data.salesOrders);
      } catch (err) {
        setError('Failed to fetch sales orders.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesOrders();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPaymentStatus = (order: SalesOrder) => {
    const totalPaid = order.settlements?.reduce((sum, s) => sum + s.amount, 0) || 0;
    if (totalPaid >= order.total) return 'Paid';
    if (totalPaid > 0) return 'Partial';
    return 'Unpaid';
  };

  const getPaymentBadgeVariant = (status: string) => {
    switch (status) {
      case 'Paid': return 'success';
      case 'Partial': return 'warning';
      case 'Unpaid': return 'destructive';
      default: return 'secondary';
    }
  };

  const handleEditClick = (order: SalesOrder) => {
    setEditingSalesOrder(order);
    setEditedTableNumber(order.tableNumber || '');
    setEditedItems(order.items);
    setEditedSettlements(order.settlements || []);
    setEditNotes(order.notes || '');
    setEditError(null);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingSalesOrder) return;

    const wordCount = editNotes.trim().split(/\s+/).filter(w => w.length > 0).length;
    if (wordCount > 0 && wordCount < 5) {
      setEditError('Notes must be at least 5 words.');
      return;
    }

    try {
      setIsSaving(true);
      setEditError(null);
      setError(null);
      setSuccessMessage(null);

      const updatedItems = editedItems.map(item => ({
        ...item,
        subtotal: item.price * item.quantity,
      }));
      const newTotal = updatedItems.reduce((sum, item) => sum + item.subtotal, 0);

      const payload = { 
        tableNumber: editedTableNumber, 
        items: updatedItems,
        total: newTotal,
        settlements: editedSettlements,
        notes: editNotes.trim(),
        status: editingSalesOrder.status,
      };
      await updateSalesOrder(editingSalesOrder._id, payload);
      
      setSalesOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === editingSalesOrder._id ? { ...order, ...payload, updatedAt: new Date().toISOString() } : order
        )
      );
      setIsEditModalOpen(false);
      setSuccessMessage('Order updated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setEditError(err.response?.data?.message || 'Failed to update sales order.');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleItemQuantityChange = (index: number, newQuantity: number) => {
    setEditedItems(prevItems =>
      prevItems.map((item, i) =>
        i === index ? { ...item, quantity: newQuantity > 0 ? newQuantity : 1 } : item
      )
    );
  };

  const handleAddSettlement = () => {
    setEditedSettlements([...editedSettlements, { 
      method: 'cash', 
      amount: 0, 
      settledAt: new Date().toISOString() 
    }]);
  };

  const handleRemoveSettlement = (index: number) => {
    setEditedSettlements(editedSettlements.filter((_, i) => i !== index));
  };

  const handleSettlementChange = (index: number, field: keyof Settlement, value: any) => {
    setEditedSettlements(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
  };

  const handleSort = (key: keyof SalesOrder) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleExportExcel = () => {
    const dataToExport = processedOrders.map(order => ({
      'Order #': order.orderNumber,
      'Date': formatDate(order.date),
      'Time': order.timing,
      'Table': order.tableNumber || '-',
      'Total': order.total,
      'Paid': order.settlements?.reduce((sum, s) => sum + s.amount, 0) || 0,
      'Remaining': (order.total - (order.settlements?.reduce((sum, s) => sum + s.amount, 0) || 0)),
      'Payment Status': getPaymentStatus(order),
      'Notes': order.notes || '-',
      'Items': order.items.map(item => `${item.quantity} x ${item.title} (@ ₹${item.price})`).join('\n'),
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sales Orders');
    XLSX.writeFile(wb, 'SalesOrders.xlsx');
  };
  
  const handleExportPdf = () => {
    const doc = new jsPDF();
    
    const autoTable = (doc as any).autoTable;

    autoTable({
        head: [['Order #', 'Date', 'Table', 'Total', 'Payment Status']],
        body: processedOrders.map(order => [
            order.orderNumber,
            formatDate(order.date),
            order.tableNumber || '-',
            `₹${order.total.toFixed(2)}`,
            getPaymentStatus(order),
        ]),
    });

    doc.save('SalesOrders.pdf');
  };

  const processedOrders = salesOrders
    .filter((order) => {
      const matchesDate = !filterDate || (() => {
        const orderDate = new Date(order.date);
        const year = orderDate.getFullYear();
        const month = String(orderDate.getMonth() + 1).padStart(2, '0');
        const day = String(orderDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}` === filterDate;
      })();

      const matchesSearch = 
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.tableNumber && order.tableNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (order.notes && order.notes.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchesDate && matchesSearch;
    })
    .sort((a, b) => {
      if (!sortConfig) return 0;
      const { key, direction } = sortConfig;
      
      let valA: any = key === 'date' ? new Date(a.date).getTime() : a[key];
      let valB: any = key === 'date' ? new Date(b.date).getTime() : b[key];
      if (key === 'tableNumber') { valA = a.tableNumber || ''; valB = b.tableNumber || ''; }

      if (valA < valB) return direction === 'asc' ? -1 : 1;
      if (valA > valB) return direction === 'asc' ? 1 : -1;
      return 0;
    });

  const totalPages = Math.ceil(processedOrders.length / itemsPerPage);
  const paginatedOrders = processedOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading sales orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Orders</h1>
          <p className="text-gray-600 mt-1">
            Total {processedOrders.length} orders found
            {filterDate && ` for ${filterDate}`}
          </p>
        </div>
        
        {/* Search and Filter Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="text-gray-400 h-4 w-4" />
            <Input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-[140px]"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const today = new Date();
                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, '0');
                const day = String(today.getDate()).padStart(2, '0');
                setFilterDate(`${year}-${month}-${day}`);
              }}
            >
              Today
            </Button>
            
            {filterDate && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilterDate('')}
              >
                Clear Filter
              </Button>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={handleExportExcel}>
              <FileDown className="h-4 w-4 mr-2" />
              Export Excel
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportPdf}>
              <FileDown className="h-4 w-4 mr-2" />
              Export PDF
          </Button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Orders Table */}
      {processedOrders.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
          <div className="mx-auto w-12 h-12 text-gray-400 mb-4">
            <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No orders found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-[100px] font-semibold text-gray-700">
                    <button 
                      onClick={() => handleSort('orderNumber')}
                      className="flex items-center gap-1 hover:text-gray-900"
                    >
                      Order #
                      {sortConfig?.key === 'orderNumber' ? (
                        sortConfig.direction === 'asc' ? 
                          <SortAsc className="h-4 w-4" /> : 
                          <SortDesc className="h-4 w-4" />
                      ) : (
                        <SortAsc className="h-4 w-4 opacity-30" />
                      )}
                    </button>
                  </TableHead>
                  
                  <TableHead className="w-[120px] font-semibold text-gray-700">
                    <button 
                      onClick={() => handleSort('date')}
                      className="flex items-center gap-1 hover:text-gray-900"
                    >
                      Date
                      {sortConfig?.key === 'date' ? (
                        sortConfig.direction === 'asc' ? 
                          <SortAsc className="h-4 w-4" /> : 
                          <SortDesc className="h-4 w-4" />
                      ) : (
                        <SortAsc className="h-4 w-4 opacity-30" />
                      )}
                    </button>
                  </TableHead>
                  
                  <TableHead className="w-[80px] font-semibold text-gray-700">
                    <button 
                      onClick={() => handleSort('tableNumber')}
                      className="flex items-center gap-1 hover:text-gray-900"
                    >
                      Table
                      {sortConfig?.key === 'tableNumber' ? (
                        sortConfig.direction === 'asc' ? 
                          <SortAsc className="h-4 w-4" /> : 
                          <SortDesc className="h-4 w-4" />
                      ) : (
                        <SortAsc className="h-4 w-4 opacity-30" />
                      )}
                    </button>
                  </TableHead>
                  
                  <TableHead className="w-[100px] font-semibold text-gray-700 text-right">
                    <button 
                      onClick={() => handleSort('total')}
                      className="flex items-center justify-end gap-1 hover:text-gray-900 ml-auto"
                    >
                      Total
                      {sortConfig?.key === 'total' ? (
                        sortConfig.direction === 'asc' ? 
                          <SortAsc className="h-4 w-4" /> : 
                          <SortDesc className="h-4 w-4" />
                      ) : (
                        <SortAsc className="h-4 w-4 opacity-30" />
                      )}
                    </button>
                  </TableHead>
                  
                  <TableHead className="w-[120px] font-semibold text-gray-700">Payment</TableHead>
                  
                  <TableHead className="font-semibold text-gray-700">Notes</TableHead>
                  
                  <TableHead className="w-[140px] font-semibold text-gray-700 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              
              <TableBody>
                {paginatedOrders.map((order) => {
                  const paymentStatus = getPaymentStatus(order);
                  const totalPaid = order.settlements?.reduce((sum, s) => sum + s.amount, 0) || 0;
                  
                  return (
                    <TableRow key={order._id} className="hover:bg-gray-50/50">
                      <TableCell className="font-medium text-gray-900">
                        <div className="font-semibold">{order.orderNumber}</div>
                        <div className="text-xs text-gray-500">
                          {order.timing || 'No time'}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="font-medium">{formatDate(order.date)}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${order.tableNumber ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                          <span className="font-semibold text-sm">
                            {order.tableNumber || '-'}
                          </span>
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-right">
                        <div className="font-bold text-gray-900">₹{order.total.toFixed(2)}</div>
                        {totalPaid < order.total && (
                          <div className="text-xs text-red-600">
                            Due: ₹{(order.total - totalPaid).toFixed(2)}
                          </div>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge variant={getPaymentBadgeVariant(paymentStatus)}>
                            {paymentStatus}
                          </Badge>
                          {order.settlements?.length > 0 && (
                            <div className="text-xs text-gray-500">
                              {order.settlements.length} payment{order.settlements.length > 1 ? 's' : ''}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="max-w-[200px] truncate text-gray-600">
                                {order.notes || '-'}
                              </div>
                            </TooltipTrigger>
                            {/* {order.notes && (
                              <TooltipContent>
                                <p className="max-w-xs">{order.notes}</p>
                              </TooltipContent>
                            )} */}
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setViewOrder(order)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditClick(order)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, processedOrders.length)}
                </span>{' '}
                of <span className="font-medium">{processedOrders.length}</span> results
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="h-8 px-3"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`h-8 w-8 rounded-md text-sm font-medium ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="h-8 px-3"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {editingSalesOrder && (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="text-xl">Edit Order #{editingSalesOrder.orderNumber}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4 overflow-y-auto px-1">
              {/* Table Number */}
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="tableNumber" className="text-right font-medium">
                  Table Number
                </label>
                <Input
                  id="tableNumber"
                  value={editedTableNumber}
                  onChange={(e) => setEditedTableNumber(e.target.value)}
                  className="col-span-3"
                />
              </div>

              {/* Items Section */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Items</h3>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead className="font-semibold">Item</TableHead>
                        <TableHead className="font-semibold text-right">Price</TableHead>
                        <TableHead className="font-semibold text-right w-32">Quantity</TableHead>
                        <TableHead className="font-semibold text-right">Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {editedItems.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.title}</TableCell>
                          <TableCell className="text-right">₹{item.price.toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end">
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleItemQuantityChange(index, parseInt(e.target.value))}
                                className="w-24 text-right"
                                min="1"
                              />
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="bg-gray-50 p-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total:</span>
                      <span className="text-xl font-bold">
                        ₹{editedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payments Section */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Payments</h3>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddSettlement}>
                    + Add Payment
                  </Button>
                </div>
                <div className="space-y-3 border rounded-lg p-4 bg-gray-50">
                  {editedSettlements.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">No payments recorded.</p>
                  ) : (
                    editedSettlements.map((settlement, index) => (
                      <div key={index} className="flex gap-3 items-center p-3 bg-white rounded-lg border">
                        <Select 
                          value={settlement.method} 
                          onValueChange={(value) => handleSettlementChange(index, 'method', value)}
                        >
                          <SelectTrigger className="w-[130px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="upi">UPI</SelectItem>
                            <SelectItem value="credit">Credit</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          value={settlement.amount}
                          onChange={(e) => handleSettlementChange(index, 'amount', parseFloat(e.target.value) || 0)}
                          className="w-[120px]"
                          placeholder="Amount"
                        />
                        <Input
                          value={settlement.upiCode || ''}
                          onChange={(e) => handleSettlementChange(index, 'upiCode', e.target.value)}
                          className="flex-1"
                          placeholder="UPI/Reference Code"
                        />
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleRemoveSettlement(index)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        >
                          Remove
                        </Button>
                      </div>
                    ))
                  )}
                  {editedSettlements.length > 0 && (
                    <div className="pt-3 border-t">
                      <div className="flex justify-between items-center font-semibold">
                        <span>Total Paid:</span>
                        <span className="text-lg">
                          ₹{editedSettlements.reduce((sum, s) => sum + (s.amount || 0), 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes Section */}
              <div className="space-y-2">
                <label htmlFor="editNotes" className="font-semibold">
                  Notes
                </label>
                <textarea
                  id="editNotes"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Enter notes (minimum 5 words if provided)..."
                  className="min-h-[100px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                {editError && (
                  <div className="text-red-600 text-sm font-medium">
                    {editError}
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button 
                type="button" 
                onClick={handleSaveEdit} 
                disabled={isSaving}
                className="min-w-[120px]"
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : 'Save Changes'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* View Modal */}

{viewOrder && (
  <Dialog open={!!viewOrder} onOpenChange={(open) => !open && setViewOrder(null)}>
    <DialogContent className="sm:max-w-[550px]">
      <DialogHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <div>
            <DialogTitle className="text-lg">Order #{viewOrder.orderNumber}</DialogTitle>
            <p className="text-sm text-gray-500">{formatDate(viewOrder.date)}</p>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold">₹{viewOrder.total.toFixed(2)}</div>
            <Badge 
              variant={getPaymentBadgeVariant(getPaymentStatus(viewOrder))}
              className="mt-1 text-xs"
            >
              {getPaymentStatus(viewOrder)}
            </Badge>
          </div>
        </div>
      </DialogHeader>

      <div className="space-y-4 py-2">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2 bg-gray-50 rounded">
            <p className="text-xs text-gray-500">Table</p>
            <p className="font-semibold">{viewOrder.tableNumber || '—'}</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <p className="text-xs text-gray-500">Items</p>
            <p className="font-semibold">{viewOrder.items.length}</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <p className="text-xs text-gray-500">Paid</p>
            <p className="font-semibold">
              ₹{(viewOrder.settlements?.reduce((acc, curr) => acc + curr.amount, 0) || 0).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Items - Compact Table */}
        <div>
          <h4 className="font-medium text-sm text-gray-700 mb-2">ITEMS</h4>
          <div className="space-y-1 max-h-[180px] overflow-y-auto pr-1">
            {viewOrder.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-1.5 border-b last:border-0">
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-gray-500">
                    {item.quantity} × ₹{item.price.toFixed(2)}
                  </p>
                </div>
                <p className="font-semibold text-sm">₹{item.subtotal.toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center pt-2 mt-1 border-t">
            <span className="font-medium">Total</span>
            <span className="font-bold">₹{viewOrder.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Payments - Only if exists */}
        {viewOrder.settlements && viewOrder.settlements.length > 0 && (
          <div>
            <h4 className="font-medium text-sm text-gray-700 mb-2">PAYMENTS</h4>
            <div className="space-y-2">
              {viewOrder.settlements.map((settlement, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <span className="capitalize">{settlement.method}</span>
                    {settlement.upiCode && (
                      <span className="text-xs text-gray-500">({settlement.upiCode})</span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="font-semibold">₹{settlement.amount.toFixed(2)}</span>
                    <p className="text-xs text-gray-500">
                      {new Date(settlement.settledAt).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes - Only if exists */}
        {viewOrder.notes && (
          <div>
            <h4 className="font-medium text-sm text-gray-700 mb-2">NOTES</h4>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
              {viewOrder.notes}
            </div>
          </div>
        )}
      </div>

      <DialogFooter className="pt-4 border-t">
        <div className="flex justify-end gap-2 w-full">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              setViewOrder(null);
              handleEditClick(viewOrder);
            }}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button 
            onClick={() => setViewOrder(null)}
            size="sm"
          >
            Close
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)}
    </div>
  );
};

export default SalesOrderPage;