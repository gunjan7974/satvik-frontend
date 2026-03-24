"use client";

import React, { useEffect, useState } from 'react';
import { apiClient } from '../../../lib/api';
import { Button } from '../../../components/ui/button';

// Simple admin order item editor UI
function OrderEditor({ order, menus, onCancel, onSave }: any) {
  const [customerName, setCustomerName] = useState(order?.customer?.name || '');
  const [customerPhone, setCustomerPhone] = useState(order?.customer?.phone || '');
  const [items, setItems] = useState(order?.items?.map((it: any) => ({ ...it })) || []);

  const updateItemQty = (idx: number, q: number) => {
    const next = [...items];
    next[idx].quantity = q;
    next[idx].subtotal = (next[idx].price || 0) * q;
    setItems(next);
  };

  const removeItem = (idx: number) => {
    const next = [...items];
    next.splice(idx, 1);
    setItems(next);
  };

  const addMenuItem = (menuId: string) => {
    const m = menus.find((x: any) => x._id === menuId);
    if (!m) return;
    setItems((prev: any[]) => [...prev, { menu: m._id, title: m.title, price: m.price, quantity: 1, subtotal: m.price }]);
  };

  const total = items.reduce((s: number, it: any) => s + (it.subtotal || 0), 0);

  const handleSave = () => {
    const payload = {
      customer: { name: customerName, phone: customerPhone },
      items: items.map((it: any) => ({ menu: it.menu, title: it.title, price: it.price, quantity: it.quantity, subtotal: it.subtotal })),
      total,
    };
    onSave(payload);
  };

  return (
    <div className="p-4 bg-gray-50 rounded border">
      <div className="grid grid-cols-2 gap-2">
        <input value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Customer name" className="p-2 border" />
        <input value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} placeholder="Phone" className="p-2 border" />
      </div>

      <div className="mt-3">
        <label className="block text-sm font-medium">Add item</label>
        <div className="flex items-center space-x-2 mt-2">
          <select className="p-2 border" onChange={e => addMenuItem(e.target.value)} defaultValue="">
            <option value="">Select menu</option>
            {menus.map((m: any) => <option key={m._id} value={m._id}>{m.title} — ₹{m.price}</option>)}
          </select>
        </div>
      </div>

      <div className="mt-3">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left">Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((it: any, idx: number) => (
              <tr key={idx}>
                <td>{it.title}</td>
                <td><input type="number" value={it.quantity} min={1} onChange={e => updateItemQty(idx, parseInt(e.target.value || '1'))} className="w-20 p-1 border" /></td>
                <td>₹{it.price}</td>
                <td>₹{it.subtotal}</td>
                <td><button className="text-red-500" onClick={() => removeItem(idx)}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex justify-between items-center">
        <div><strong>Total:</strong> ₹{total}</div>
        <div className="space-x-2">
          <Button onClick={handleSave} size="sm">Save</Button>
          <Button onClick={onCancel} variant="ghost" size="sm">Cancel</Button>
        </div>
      </div>
    </div>
  );
}

export default function SalesOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [menus, setMenus] = useState<any[]>([]);
  const [newItems, setNewItems] = useState<any[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [editingOrder, setEditingOrder] = useState<any | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await apiClient.getSalesOrders({ page: 1, limit: 100 });
      const orderList = (res && (res.orders || res.data || res)) as any[];
      setOrders(orderList || []);

      // fetch menus for create/edit
      try {
        const mres = await apiClient.getMenus({ limit: 100 });
        setMenus(mres.menus || mres.data || []);
      } catch (e) {
        console.warn('Failed to load menus for order creation', e);
      }
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSettle = async (id: string) => {
    if (!confirm('Mark this order as paid?')) return;
    try {
      const res = await apiClient.settleOrder(id, { status: 'confirmed' });
      // backend returns { success: true, order }
      const order = res && res.order ? res.order : res;
      alert('Order settled');
      // refresh list
      load();
      // print settlement receipt
      printReceipt(order);
    } catch (err) {
      console.error(err);
      alert('Failed to settle order');
    }
  };

  // Create new order flow
  const addNewItem = (menuId: string) => {
    const m = menus.find(m => m._id === menuId);
    if (!m) return;
    setNewItems((prev: any[]) => [...prev, { menu: m._id, title: m.title, price: m.price, quantity: 1, subtotal: m.price }]);
  };

  const updateNewItemQty = (idx: number, q: number) => {
    const next = [...newItems];
    next[idx].quantity = q;
    next[idx].subtotal = (next[idx].price || 0) * q;
    setNewItems(next);
  };

  const removeNewItem = (idx: number) => {
    const next = [...newItems];
    next.splice(idx, 1);
    setNewItems(next);
  };

  const createOrder = async () => {
    if (!customerName) return alert('Provide customer name');
    if (newItems.length === 0) return alert('Add at least one item');
    const total = newItems.reduce((s, it) => s + (it.subtotal || 0), 0);
    try {
      await apiClient.createOrder({
        customer: { name: customerName, phone: customerPhone },
        items: newItems.map(it => ({ menu: it.menu, title: it.title, price: it.price, quantity: it.quantity, subtotal: it.subtotal })),
        total,
      });
      alert('Order created');
      setCustomerName(''); setCustomerPhone(''); setNewItems([]);
      load();
    } catch (err) {
      console.error(err);
      alert('Failed to create order');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this order?')) return;
    try {
      await apiClient.deleteOrder(id);
      alert('Order deleted');
      load();
    } catch (err) {
      console.error(err);
      alert('Failed to delete order');
    }
  };

  const startEdit = (order: any) => {
    setEditingOrder(order);
  };

  const saveEdit = async (payload: any) => {
    if (!editingOrder) return;
    try {
      await apiClient.updateOrder(editingOrder._id, payload);
      alert('Order updated');
      setEditingOrder(null);
      load();
    } catch (err) {
      console.error(err);
      alert('Failed to update order');
    }
  };

  const printReceipt = (order: any) => {
    if (!order) return alert('No order to print');
    const win = window.open('', '_blank', 'width=800,height=900');
    if (!win) return alert('Unable to open print window');

    const createdAt = order.createdAt ? new Date(order.createdAt).toLocaleString() : '';
    const settledAt = order.updatedAt ? new Date(order.updatedAt).toLocaleString() : new Date().toLocaleString();

    const itemsHtml = (order.items || []).map((it: any) => `
      <tr>
        <td style="padding:6px;border:1px solid #ddd">${it.title || ''}</td>
        <td style="padding:6px;border:1px solid #ddd">${it.quantity || 1}</td>
        <td style="padding:6px;border:1px solid #ddd">₹${it.price || 0}</td>
        <td style="padding:6px;border:1px solid #ddd">₹${it.subtotal || (it.price * it.quantity) || 0}</td>
      </tr>
    `).join('');

    const html = `
      <html>
      <head>
        <title>Settlement Receipt - ${order.orderNumber || ''}</title>
      </head>
      <body style="font-family: Arial, Helvetica, sans-serif; padding:20px;">
        <h2>Settlement Receipt</h2>
        <p><strong>Order:</strong> ${order.orderNumber || ''}</p>
        <p><strong>Customer:</strong> ${order.customer?.name || ''} — ${order.customer?.phone || ''}</p>
        <p><strong>Created:</strong> ${createdAt}</p>
        <p><strong>Settled:</strong> ${settledAt}</p>
        <table style="width:100%;border-collapse:collapse;margin-top:12px">
          <thead>
            <tr>
              <th style="padding:6px;border:1px solid #ddd;text-align:left">Item</th>
              <th style="padding:6px;border:1px solid #ddd;text-align:right">Qty</th>
              <th style="padding:6px;border:1px solid #ddd;text-align:right">Price</th>
              <th style="padding:6px;border:1px solid #ddd;text-align:right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="padding:6px;border:1px solid #ddd;text-align:right"><strong>Total</strong></td>
              <td style="padding:6px;border:1px solid #ddd;text-align:right"><strong>₹${order.total || 0}</strong></td>
            </tr>
          </tfoot>
        </table>
        <p style="margin-top:18px">Payment Status: <strong>${order.paymentStatus || ''}</strong></p>
        <script>
          setTimeout(() => { window.print(); }, 300);
        </script>
      </body>
      </html>
    `;

    win.document.open();
    win.document.write(html);
    win.document.close();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Orders & Settlements</h1>
      {loading ? <p>Loading...</p> : (
        <div className="space-y-4">
          {/* Create Order Form */}
          <div className="p-4 bg-white rounded shadow">
            <h3 className="font-semibold">Create Order</h3>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <input value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Customer name" className="p-2 border" />
              <input value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} placeholder="Phone" className="p-2 border" />
            </div>

            <div className="mt-3">
              <select className="p-2 border" onChange={e => addNewItem(e.target.value)} defaultValue="">
                <option value="">Select menu to add</option>
                {menus.map(m => <option key={m._id} value={m._id}>{m.title} — ₹{m.price}</option>)}
              </select>
            </div>

            {newItems.length > 0 && (
              <div className="mt-3">
                <table className="w-full text-sm">
                  <thead>
                    <tr><th>Item</th><th>Qty</th><th>Price</th><th>Subtotal</th><th></th></tr>
                  </thead>
                  <tbody>
                    {newItems.map((it, idx) => (
                      <tr key={idx}>
                        <td>{it.title}</td>
                        <td><input type="number" value={it.quantity} min={1} onChange={e => updateNewItemQty(idx, parseInt(e.target.value || '1'))} className="w-20 p-1 border" /></td>
                        <td>₹{it.price}</td>
                        <td>₹{it.subtotal}</td>
                        <td><button className="text-red-500" onClick={() => removeNewItem(idx)}>Remove</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-3 flex items-center justify-between">
              <div><strong>Total:</strong> ₹{newItems.reduce((s, it) => s + (it.subtotal || 0), 0)}</div>
              <div className="space-x-2">
                <Button onClick={createOrder} size="sm">Create</Button>
                <Button onClick={() => { setCustomerName(''); setCustomerPhone(''); setNewItems([]); }} variant="ghost" size="sm">Reset</Button>
              </div>
            </div>
          </div>

          {orders.length === 0 && <p>No orders found.</p>}

          {orders.map((o: any) => (
            <div key={o._id} className="p-4 bg-white rounded shadow flex justify-between items-center">
              <div>
                <div className="font-medium">{o.orderNumber} — ₹{o.total}</div>
                <div className="text-sm text-gray-600">{o.customer?.name} • {o.status} • {o.paymentStatus}</div>
              </div>
              <div className="flex items-center space-x-2">
                <Button onClick={() => handleSettle(o._id)} size="sm">Settle</Button>
                <Button onClick={() => startEdit(o)} size="sm">Edit</Button>
                <Button onClick={() => handleDelete(o._id)} size="sm" variant="destructive">Delete</Button>
              </div>
            </div>
          ))}

          {editingOrder && (
            <div className="p-4 bg-white rounded shadow">
              <h3 className="font-semibold">Edit Order</h3>
              <OrderEditor order={editingOrder} menus={menus} onCancel={() => setEditingOrder(null)} onSave={saveEdit} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
