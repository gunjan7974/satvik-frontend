"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Textarea } from "../../../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { Badge } from "../../../../components/ui/badge";
import { Plus, Minus, X, ArrowLeft, Package } from "lucide-react";
import { toast } from "react-hot-toast";

export interface Category {
  _id: string;
  title: string;
}

export interface MenuItem {
  _id: string;
  title: string;
  price: number;
  discountedPrice?: number;
  category?: Category;
}

interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
  price: number;
}

export default function AddOrderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Default menu items
  const defaultMenuItems: MenuItem[] = [
    { _id: "1", title: "Paneer Butter Masala", price: 250, discountedPrice: 200, category: { _id: "c1", title: "Veg" } },
    { _id: "2", title: "Chicken Biryani", price: 300, category: { _id: "c2", title: "Non-Veg" } },
    { _id: "3", title: "Veg Pulao", price: 150, category: { _id: "c1", title: "Veg" } },
  ];

  const [menuItems] = useState<MenuItem[]>(defaultMenuItems);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    { menuItem: defaultMenuItems[0], quantity: 2, price: defaultMenuItems[0].discountedPrice || defaultMenuItems[0].price },
    { menuItem: defaultMenuItems[1], quantity: 1, price: defaultMenuItems[1].price },
  ]);

  // Default form state
  const [customerName, setCustomerName] = useState("John Doe");
  const [customerPhone, setCustomerPhone] = useState("9876543210");
  const [customerEmail, setCustomerEmail] = useState("john@example.com");
  const [deliveryAddress, setDeliveryAddress] = useState("123, MG Road, Bangalore, Karnataka, 560001");
  const [orderStatus, setOrderStatus] = useState("pending");

  // Menu selection
  const [selectedMenuItem, setSelectedMenuItem] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const addItemToOrder = () => {
    if (!selectedMenuItem) return toast.error("Please select a menu item");

    const menuItem = menuItems.find(item => item._id === selectedMenuItem);
    if (!menuItem) return toast.error("Selected menu item not found");

    const existingItem = orderItems.find(item => item.menuItem._id === selectedMenuItem);
    if (existingItem) {
      setOrderItems(prev => prev.map(item =>
        item.menuItem._id === selectedMenuItem
          ? { ...item, quantity: item.quantity + selectedQuantity }
          : item
      ));
    } else {
      setOrderItems(prev => [...prev, { menuItem, quantity: selectedQuantity, price: menuItem.discountedPrice || menuItem.price }]);
    }

    setSelectedMenuItem("");
    setSelectedQuantity(1);
  };

  const removeItemFromOrder = (id: string) => setOrderItems(prev => prev.filter(item => item.menuItem._id !== id));
  const updateItemQuantity = (id: string, qty: number) => { 
    if (qty < 1) return removeItemFromOrder(id);
    setOrderItems(prev => prev.map(item => item.menuItem._id === id ? { ...item, quantity: qty } : item)); 
  };

  const totalAmount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || orderItems.length === 0) return toast.error("Please fill all required fields and add items");

    setLoading(true);
    try {
      const orderData = { 
        customer: { name: customerName, email: customerEmail, phone: customerPhone }, 
        deliveryAddress, 
        items: orderItems.map(i => ({ menu: i.menuItem._id, title: i.menuItem.title, price: i.price, quantity: i.quantity, subtotal: i.price * i.quantity })), 
        totalAmount, 
        status: orderStatus 
      };
      console.log("Order Data:", orderData);
      toast.success("Order created successfully!");
      router.push("/admin/orders");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.push("/admin/orders")}><ArrowLeft className="h-4 w-4" /></Button>
        <div>
          <h1 className="text-2xl font-bold">Create New Order</h1>
          <p className="text-gray-600">Add a new customer order manually (with default data)</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader><CardTitle>Customer Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div><Label>Customer Name *</Label><Input value={customerName} onChange={e => setCustomerName(e.target.value)} /></div>
                <div><Label>Phone Number *</Label><Input value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} /></div>
                <div><Label>Email Address</Label><Input value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} /></div>
                <div><Label>Delivery Address</Label><Textarea value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)} rows={3} /></div>
                <div>
                  <Label>Order Status</Label>
                  <Select value={orderStatus} onValueChange={setOrderStatus}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="preparing">Preparing</SelectItem>
                      <SelectItem value="ready">Ready</SelectItem>
                      <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader><CardTitle>Add Menu Items</CardTitle></CardHeader>
              <CardContent className="flex gap-4">
                <div className="flex-1">
                  <Label>Select Menu Item</Label>
                  <Select value={selectedMenuItem} onValueChange={setSelectedMenuItem}>
                    <SelectTrigger><SelectValue placeholder="Choose a menu item" /></SelectTrigger>
                    <SelectContent>
                      {menuItems.map(item => <SelectItem key={item._id} value={item._id}>{item.title} - ₹{item.discountedPrice || item.price}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-32">
                  <Label>Quantity</Label>
                  <Input type="number" min="1" value={selectedQuantity} onChange={e => setSelectedQuantity(Math.max(1, Number(e.target.value)))} />
                </div>
                <div className="flex items-end">
                  <Button type="button" onClick={addItemToOrder}><Plus className="h-4 w-4 mr-2" />Add</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Order Items</span>
                  <div className="flex gap-2">
                    <Badge variant="secondary">{orderItems.length} item{orderItems.length !== 1 ? 's' : ''}</Badge>
                    {orderItems.length > 0 && <Badge variant="outline">Total: ₹{totalAmount}</Badge>}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {orderItems.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No items added</p>
                  </div>
                ) : orderItems.map(item => (
                  <div key={item.menuItem._id} className="flex justify-between items-center p-3 border rounded-lg bg-gray-50/50">
                    <div className="flex items-center gap-3 flex-1">
                      <p>{item.menuItem.title}</p>
                      <p>₹{item.price} each</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button type="button" variant="outline" size="icon" onClick={() => updateItemQuantity(item.menuItem._id, item.quantity - 1)}><Minus className="h-3 w-3" /></Button>
                      <span>{item.quantity}</span>
                      <Button type="button" variant="outline" size="icon" onClick={() => updateItemQuantity(item.menuItem._id, item.quantity + 1)}><Plus className="h-3 w-3" /></Button>
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeItemFromOrder(item.menuItem._id)} className="text-red-600"><X className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => router.push("/admin/orders")} disabled={loading}>Cancel</Button>
              <Button type="submit" className="bg-orange-600 hover:bg-orange-700" disabled={loading || orderItems.length === 0}>{loading ? "Creating..." : "Create Order"}</Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
