"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Textarea } from "../../../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { Badge } from "../../../../components/ui/badge";
import { Plus, Minus, X, ArrowLeft, Package, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { apiClient } from "../../../../lib/api";

export interface Category {
  _id: string;
  title: string;
}

export interface MenuItem {
  _id: string;
  title: string;
  name?: string;
  price: number;
  discountedPrice?: number;
  category?: any;
}

interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
  price: number;
}

export default function AddOrderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchingMenu, setFetchingMenu] = useState(true);

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  // Form state
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [orderStatus, setOrderStatus] = useState("Pending");

  // Menu selection
  const [selectedMenuItem, setSelectedMenuItem] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const loadMenuData = useCallback(async () => {
    try {
      setFetchingMenu(true);
      const response = await apiClient.getMenus();
      if (response.success && response.menus) {
        setMenuItems(response.menus);
      }
    } catch (error) {
      console.error("Failed to fetch menu:", error);
      toast.error("Failed to load dishes");
    } finally {
      setFetchingMenu(false);
    }
  }, []);

  useEffect(() => {
    loadMenuData();
  }, [loadMenuData]);

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
      setOrderItems(prev => [...prev, { 
        menuItem, 
        quantity: selectedQuantity, 
        price: menuItem.price 
      }]);
    }

    setSelectedMenuItem("");
    setSelectedQuantity(1);
    toast.success(`${menuItem.title} added`);
  };

  const removeItemFromOrder = (id: string) => setOrderItems(prev => prev.filter(item => item.menuItem._id !== id));
  
  const updateItemQuantity = (id: string, qty: number) => { 
    if (qty < 1) return removeItemFromOrder(id);
    setOrderItems(prev => prev.map(item => item.menuItem._id === id ? { ...item, quantity: qty } : item)); 
  };

  const totalAmount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (orderItems.length === 0) return toast.error("Please add at least one item to the order");

    setLoading(true);
    try {
      // Direct Order format for backend: { orderItems: [{ food, quantity }], totalPrice, status }
      const orderData = { 
        orderItems: orderItems.map(i => ({ 
          food: i.menuItem._id, 
          quantity: i.quantity 
        })),
        totalPrice: totalAmount,
        status: orderStatus 
      };

      const response = await apiClient.createOrder(orderData as any);
      
      if (response.success) {
        toast.success("Order created successfully!");
        router.push("/admin/orders");
      }
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
        <Button variant="outline" size="icon" onClick={() => router.push("/admin/orders")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Create New Order</h1>
          <p className="text-gray-600">Select dishes from the menu to create a new order</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer info column */}
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

          {/* Menu selection column */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader><CardTitle>Add Menu Items</CardTitle></CardHeader>
              <CardContent className="flex gap-4">
                <div className="flex-1">
                  <Label>Select Menu Item</Label>
                  {fetchingMenu ? (
                    <div className="h-10 flex items-center px-3 border rounded-md">
                       <Loader2 className="h-4 w-4 animate-spin mr-2" />
                       Loading...
                    </div>
                  ) : (
                    <Select value={selectedMenuItem} onValueChange={setSelectedMenuItem}>
                      <SelectTrigger><SelectValue placeholder="Choose a menu item" /></SelectTrigger>
                      <SelectContent>
                        {menuItems.map(item => (
                          <SelectItem key={item._id} value={item._id}>
                            {item.title || item.name} - ₹{item.price}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <div className="w-32">
                  <Label>Quantity</Label>
                  <Input type="number" min="1" value={selectedQuantity} onChange={e => setSelectedQuantity(Math.max(1, Number(e.target.value)))} />
                </div>
                <div className="flex items-end">
                  <Button 
                    type="button" 
                    onClick={addItemToOrder}
                    disabled={fetchingMenu || !selectedMenuItem}
                  >
                    <Plus className="h-4 w-4 mr-2" />Add
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center text-lg">
                  <span>Selected Items</span>
                  <div className="flex gap-2">
                    <Badge variant="secondary">{orderItems.length} item{orderItems.length !== 1 ? 's' : ''}</Badge>
                    {orderItems.length > 0 && <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-100 font-bold">Total: ₹{totalAmount}</Badge>}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {orderItems.length === 0 ? (
                  <div className="text-center py-10 text-gray-500 border-2 border-dashed rounded-lg">
                    <Package className="h-12 w-12 mx-auto mb-4 text-gray-200" />
                    <p>No items added yet</p>
                  </div>
                ) : orderItems.map(item => (
                  <div key={item.menuItem._id} className="flex flex-col sm:flex-row justify-between sm:items-center p-4 border rounded-xl bg-orange-50/20 gap-4">
                    <div className="flex-1">
                      <p className="font-semibold">{item.menuItem.title}</p>
                      <p className="text-sm text-gray-500">₹{item.price} x {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-4 justify-between">
                      <div className="flex items-center gap-2 border rounded-full px-2 py-1 bg-white">
                        <Button type="button" variant="ghost" size="icon" className="h-7 w-7 rounded-full" onClick={() => updateItemQuantity(item.menuItem._id, item.quantity - 1)}><Minus className="h-3 w-3" /></Button>
                        <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                        <Button type="button" variant="ghost" size="icon" className="h-7 w-7 rounded-full" onClick={() => updateItemQuantity(item.menuItem._id, item.quantity + 1)}><Plus className="h-3 w-3" /></Button>
                      </div>
                      <div className="flex items-center gap-4 min-w-[80px] justify-end">
                        <span className="font-bold">₹{item.price * item.quantity}</span>
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeItemFromOrder(item.menuItem._id)} className="text-red-500 hover:text-red-700 hover:bg-red-50"><X className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="ghost" onClick={() => router.push("/admin/orders")} disabled={loading}>Cancel</Button>
              <Button type="submit" className="bg-orange-600 hover:bg-orange-700 px-10 shadow-lg shadow-orange-200" disabled={loading || orderItems.length === 0}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Place Order"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
