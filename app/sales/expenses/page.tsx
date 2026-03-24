"use client";

import React, { useEffect, useState, useRef } from 'react';
import { apiClient } from '../../../lib/api';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';

const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }: any) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className='flex justify-center space-x-2 mt-4'>
        {pageNumbers.map(number => (
          <li key={number} className=''>
            <button
              onClick={() => paginate(number)}
              className={`px-3 py-1 border rounded-md transition-colors ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-50'}`}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default function ExpensesPage() {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [rate, setRate] = useState<number>(0);
  const [cash, setCash] = useState<number>(0);
  const [upi, setUpi] = useState<number>(0);
  const [credit, setCredit] = useState<number>(0);
  const [person, setPerson] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [editId, setEditId] = useState<string|null>(null);
  const [editFields, setEditFields] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Pagination state
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Refs for form inputs
  const nameInputRef = useRef<HTMLInputElement>(null);
  const personInputRef = useRef<HTMLInputElement>(null);
  const quantityInputRef = useRef<HTMLInputElement>(null);
  const rateInputRef = useRef<HTMLInputElement>(null);
  const cashInputRef = useRef<HTMLInputElement>(null);
  const upiInputRef = useRef<HTMLInputElement>(null);
  const creditInputRef = useRef<HTMLInputElement>(null);
  
  // Focus first input on component mount
  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  // Start editing an expense
  const handleEdit = (item: any) => {
    setEditId(item._id);
    setEditFields({
      name: item.name,
      person: item.person || '',
      quantity: item.quantity,
      rate: item.rate,
      cash: item.payment?.cash || 0,
      upi: item.payment?.upi || 0,
      credit: item.payment?.credit || 0,
    });
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditId(null);
    setEditFields({});
  };

  // Save edited expense
  const handleSaveEdit = async () => {
    if (!editId) return;
    try {
      const updatedData = {
        name: editFields.name,
        person: editFields.person,
        quantity: editFields.quantity,
        rate: editFields.rate,
        cash: editFields.cash,
        upi: editFields.upi,
        credit: editFields.credit,
      };
      await apiClient.updateExpense(editId, updatedData);
      alert('Expense updated');
      setEditId(null);
      setEditFields({});
      load(currentPage);
    } catch (err) {
      console.error(err);
      alert('Failed to update expense');
    }
  };

  const load = async (page = 1) => {
    setLoading(true);
    try {
      const res = await apiClient.getExpenses({ page: page, limit: itemsPerPage });
      const list = res && (res.expenses || res.data || res.expenses) || [];
      // Sort by updatedAt by default, then createdAt as a fallback
      const sorted = list.slice().sort((a: any, b: any) => {
        const ta = new Date(a.updatedAt || a.createdAt || a.date || 0).getTime();
        const tb = new Date(b.updatedAt || b.createdAt || b.date || 0).getTime();
        return tb - ta;
      });
      setItems(sorted);
      setTotalItems(res.total || 0);
    } catch (err) {
      console.error('Failed to load expenses', err);
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => {
    load(currentPage);
  }, [currentPage]);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleKeyDown = (e: React.KeyboardEvent, nextFieldRef?: React.RefObject<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (nextFieldRef?.current) {
        nextFieldRef.current.focus();
        nextFieldRef.current.select();
      } else {
        handleCreate();
      }
    }
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      alert('Expense name is required');
      nameInputRef.current?.focus();
      return;
    }

    if (quantity <= 0) {
      alert('Quantity must be at least 1');
      quantityInputRef.current?.focus();
      return;
    }

    if (rate < 0) {
      alert('Rate cannot be negative');
      rateInputRef.current?.focus();
      return;
    }

    const totalPayment = cash + upi + credit;
    const totalAmount = quantity * rate;
    
    if (totalPayment > totalAmount) {
      alert('Payment amount cannot be greater than total expense amount');
      cashInputRef.current?.focus();
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.createExpense({ name, quantity, rate, cash, upi, credit, person });
      
      // Reset form
      setName('');
      setQuantity(1);
      setRate(0);
      setCash(0);
      setUpi(0);
      setCredit(0);
      setPerson('');
      
      // Focus back to first input
      nameInputRef.current?.focus();
      
      // Show success and reload
      alert('Expense created successfully!');
      load();
    } catch (err) {
      console.error(err);
      alert('Failed to create expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;
    try {
      await apiClient.deleteExpense(id);
      load();
    } catch (err) {
      console.error(err);
      alert('Failed to delete expense');
    }
  };

  const getPaymentMethod = (item: any) => {
    const payments = [];
    if (item.payment?.cash > 0) payments.push('Cash');
    if (item.payment?.upi > 0) payments.push('UPI');
    if (item.payment?.credit > 0) payments.push('Credit');
    return payments.join(' + ') || 'Cash';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate totals for preview
  const totalAmount = quantity * rate;
  const totalPayment = cash + upi + credit;
  const balance = totalAmount - totalPayment;

  return (
    <div className="min-h-screen bg-gray-50/30 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Expense Management</h1>
          <p className="text-gray-600 mt-2">Track and manage your business expenses</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create Expense Card */}
          <Card className="shadow-sm border-0">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center gap-2">
                <div className="w-2 h-6 bg-blue-600 rounded"></div>
                Add New Expense
              </CardTitle>
              <CardDescription>
                Press Enter to move between fields. Press Enter on the last field to submit.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {/* Expense Name */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Expense Name *
                  </label>
                  <Input
                    ref={nameInputRef}
                    placeholder="e.g., Office Supplies, Client Lunch, etc."
                    value={name}
                    onChange={e => setName(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, personInputRef)}
                    className="w-full"
                    aria-label="Expense name"
                  />
                </div>

                {/* Paid By */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Paid By (Optional)
                  </label>
                  <Input
                    ref={personInputRef}
                    placeholder="Person who paid for this expense"
                    value={person}
                    onChange={e => setPerson(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, quantityInputRef)}
                    className="w-full"
                    aria-label="Paid by"
                  />
                </div>

                {/* Quantity and Rate */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Quantity *
                    </label>
                    <Input
                      ref={quantityInputRef}
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={e => setQuantity(parseInt(e.target.value || '1'))}
                      onKeyDown={(e) => handleKeyDown(e, rateInputRef)}
                      aria-label="Quantity"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Rate (₹) *
                    </label>
                    <Input
                      ref={rateInputRef}
                      type="number"
                      min="0"
                      step="0.01"
                      value={rate}
                      onChange={e => setRate(parseFloat(e.target.value || '0'))}
                      onKeyDown={(e) => handleKeyDown(e, cashInputRef)}
                      aria-label="Rate"
                    />
                  </div>
                </div>

                {/* Payment Breakdown */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Payment Breakdown (Optional)
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Input
                        ref={cashInputRef}
                        type="number"
                        min="0"
                        step="0.01"
                        value={cash}
                        onChange={e => setCash(parseFloat(e.target.value || '0'))}
                        onKeyDown={(e) => handleKeyDown(e, upiInputRef)}
                        placeholder="0"
                        className="text-center"
                        aria-label="Cash amount"
                      />
                      <p className="text-xs text-gray-500 text-center mt-1">Cash</p>
                    </div>
                    <div>
                      <Input
                        ref={upiInputRef}
                        type="number"
                        min="0"
                        step="0.01"
                        value={upi}
                        onChange={e => setUpi(parseFloat(e.target.value || '0'))}
                        onKeyDown={(e) => handleKeyDown(e, creditInputRef)}
                        placeholder="0"
                        className="text-center"
                        aria-label="UPI amount"
                      />
                      <p className="text-xs text-gray-500 text-center mt-1">UPI</p>
                    </div>
                    <div>
                      <Input
                        ref={creditInputRef}
                        type="number"
                        min="0"
                        step="0.01"
                        value={credit}
                        onChange={e => setCredit(parseFloat(e.target.value || '0'))}
                        onKeyDown={(e) => handleKeyDown(e)} // Last field, Enter will submit
                        placeholder="0"
                        className="text-center"
                        aria-label="Credit amount"
                      />
                      <p className="text-xs text-gray-500 text-center mt-1">Credit</p>
                    </div>
                  </div>
                </div>

                {/* Total Preview */}
                {(quantity > 0 || rate > 0) && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-blue-700 font-medium">Item Total:</span>
                        <span className="text-blue-700 font-bold">
                          {formatCurrency(totalAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-blue-600">Payment Total:</span>
                        <span>{formatCurrency(totalPayment)}</span>
                      </div>
                      {balance > 0 && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-amber-600">Balance (Unpaid):</span>
                          <span className="text-amber-600 font-medium">{formatCurrency(balance)}</span>
                        </div>
                      )}
                      {balance < 0 && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-red-600">Overpayment:</span>
                          <span className="text-red-600 font-medium">{formatCurrency(Math.abs(balance))}</span>
                        </div>
                      )}
                      {balance === 0 && totalPayment > 0 && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-green-600">Status:</span>
                          <span className="text-green-600 font-medium">Fully Paid</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Create Button */}
                <Button 
                  onClick={handleCreate} 
                  className="w-full h-11 text-base"
                  disabled={!name.trim() || isSubmitting}
                  aria-label="Create expense"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    'Create Expense (Enter)'
                  )}
                </Button>
                
                {/* Keyboard Shortcuts Help */}
                <div className="text-xs text-gray-500 pt-2 border-t">
                  <p className="font-medium mb-1">Keyboard Shortcuts:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li><kbd className="px-1.5 py-0.5 bg-gray-100 rounded border text-xs">Enter</kbd> - Next field / Submit</li>
                    <li><kbd className="px-1.5 py-0.5 bg-gray-100 rounded border text-xs">Tab</kbd> - Next field</li>
                    <li><kbd className="px-1.5 py-0.5 bg-gray-100 rounded border text-xs">Shift</kbd> + <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border text-xs">Tab</kbd> - Previous field</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Expenses Card */}
          <Card className="shadow-sm border-0">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center gap-2">
                <div className="w-2 h-6 bg-green-600 rounded"></div>
                Recent Expenses
                <Badge variant="secondary" className="ml-2">
                  {totalItems} total
                </Badge>
              </CardTitle>
              <CardDescription>
                Your most recent expense transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <>
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {items.map((it, index) => (
                      <div
                        key={it._id}
                        className="p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                      >
                        {editId === it._id ? (
                          <div className="space-y-3">
                            {/* Edit Form */}
                            <div className="flex items-center gap-2 mb-2">
                              <Input
                                value={editFields.name}
                                onChange={e => setEditFields((f: any) => ({ ...f, name: e.target.value }))}
                                className="font-semibold text-gray-900"
                                placeholder="Expense Name"
                                onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                                autoFocus
                              />
                              <Input
                                value={editFields.person}
                                onChange={e => setEditFields((f: any) => ({ ...f, person: e.target.value }))}
                                className="text-xs"
                                placeholder="Person"
                                onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3 items-center">
                              <div className="flex items-center gap-2">
                                <label className="text-gray-500 text-xs">Qty:</label>
                                <Input
                                  type="number"
                                  min="1"
                                  value={editFields.quantity}
                                  onChange={e => setEditFields((f: any) => ({ ...f, quantity: parseInt(e.target.value || '1') }))}
                                  className="w-20"
                                  onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                                />
                              </div>
                              <div className="flex items-center gap-2">
                                <label className="text-gray-500 text-xs">Rate:</label>
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={editFields.rate}
                                  onChange={e => setEditFields((f: any) => ({ ...f, rate: parseFloat(e.target.value || '0') }))}
                                  className="w-24"
                                  onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3 mb-2">
                              <div>
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={editFields.cash}
                                  onChange={e => setEditFields((f: any) => ({ ...f, cash: parseFloat(e.target.value || '0') }))}
                                  placeholder="Cash"
                                  className="text-center"
                                  onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                                />
                                <p className="text-xs text-gray-500 text-center mt-1">Cash</p>
                              </div>
                              <div>
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={editFields.upi}
                                  onChange={e => setEditFields((f: any) => ({ ...f, upi: parseFloat(e.target.value || '0') }))}
                                  placeholder="UPI"
                                  className="text-center"
                                  onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                                />
                                <p className="text-xs text-gray-500 text-center mt-1">UPI</p>
                              </div>
                              <div>
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={editFields.credit}
                                  onChange={e => setEditFields((f: any) => ({ ...f, credit: parseFloat(e.target.value || '0') }))}
                                  placeholder="Credit"
                                  className="text-center"
                                  onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                                />
                                <p className="text-xs text-gray-500 text-center mt-1">Credit</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                onClick={handleSaveEdit} 
                                className="bg-green-600 text-white"
                                onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                              >
                                Save (Enter)
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={handleCancelEdit}
                                onKeyDown={(e) => e.key === 'Escape' && handleCancelEdit()}
                              >
                                Cancel (Esc)
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-between items-start">
                            {/* Expense Details View */}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-gray-900">{it.name}</h3>
                                {it.person && (
                                  <Badge variant="outline" className="text-xs">
                                    {it.person}
                                  </Badge>
                                )}
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                                <div>
                                  <span className="text-gray-500">Quantity: </span>
                                  {it.quantity} × {formatCurrency(it.rate)}
                                </div>
                                <div>
                                  <span className="text-gray-500">Method: </span>
                                  {getPaymentMethod(it)}
                                </div>
                              </div>
                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>{new Date(it.createdAt).toLocaleDateString('en-IN', {
                                  weekday: 'short',
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}</span>
                                <span className={`px-2 py-1 rounded-full ${
                                  index === 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {index === 0 ? 'Latest' : `#${index + 1}`}
                                </span>
                              </div>
                            </div>
                            <div className="text-right ml-4">
                              <div className="text-lg font-bold text-gray-900 mb-2">
                                {formatCurrency(it.total)}
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleEdit(it)}
                                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                  aria-label={`Edit expense: ${it.name}`}
                                >
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDelete(it._id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  aria-label={`Delete expense: ${it.name}`}
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {items.length === 0 && (
                      <div className="text-center py-12">
                        <div className="text-gray-400 mb-2">No expenses recorded yet</div>
                        <div className="text-sm text-gray-500">Create your first expense to get started</div>
                      </div>
                    )}
                  </div>
                  <Pagination 
                    itemsPerPage={itemsPerPage}
                    totalItems={totalItems}
                    paginate={paginate}
                    currentPage={currentPage}
                  />
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}