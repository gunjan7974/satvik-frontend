"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { Label } from "../../../../../components/ui/label";
import { Textarea } from "../../../../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select";
import { Badge } from "../../../../../components/ui/badge";
import { Plus, Minus, X, ArrowLeft, Package } from "lucide-react";
import { toast } from "react-hot-toast";

interface MenuItem {
  _id: string;
  title: string;
  name?: string;
  price: number;
  discountedPrice?: number;
  image?: string;
  isAvailable: boolean;
}

interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
  price: number;
}

export default function EditOrderPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [orderStatus, setOrderStatus] = useState("pending");
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [orderNumber, setOrderNumber] = useState("ORD-123456");

  const [selectedMenuItem, setSelectedMenuItem] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  // ✅ Default data for menu items
  useEffect(() => {
    const defaultMenuItems: MenuItem[] = [
      { _id: "1", title: "Margherita Pizza", price: 300, discountedPrice: 250, isAvailable: true },
      { _id: "2", title: "Veg Burger", price: 120, isAvailable: true },
      { _id: "3", title: "Pasta Alfredo", price: 250, isAvailable: true },
      { _id: "4", title: "Coke 500ml", price: 50, isAvailable: true },
    ];
    setMenuItems(defaultMenuItems);

    // ✅ Default order items
    const defaultOrderItems: OrderItem[] = [
      { menuItem: defaultMenuItems[0], quantity: 2, price: defaultMenuItems[0].discountedPrice || defaultMenuItems[0].price },
      { menuItem: defaultMenuItems[3], quantity: 3, price: defaultMenuItems[3].price },
    ];
    setOrderItems(defaultOrderItems);

    // Default customer info
    setCustomerName("John Doe");
    setCustomerPhone("9876543210");
    setCustomerEmail("john@example.com");
    setDeliveryAddress("123, Elm Street, Springfield");
    setSpecialInstructions("Please deliver between 7-8 PM");
  }, []);

  const addItemToOrder = () => {
    if (!selectedMenuItem) {
      toast.error("Please select a menu item");
      return;
    }

    const menuItem = menuItems.find((item) => item._id === selectedMenuItem);
    if (!menuItem) {
      toast.error("Item not found");
      return;
    }

    const existing = orderItems.find((i) => i.menuItem._id === selectedMenuItem);
    const price = menuItem.discountedPrice || menuItem.price;

    if (existing) {
      setOrderItems((prev) =>
        prev.map((i) =>
          i.menuItem._id === selectedMenuItem
            ? { ...i, quantity: i.quantity + selectedQuantity }
            : i
        )
      );
      toast.success(`Updated ${menuItem.title}`);
    } else {
      setOrderItems((prev) => [
        ...prev,
        { menuItem, quantity: selectedQuantity, price },
      ]);
      toast.success(`Added ${menuItem.title}`);
    }

    setSelectedMenuItem("");
    setSelectedQuantity(1);
  };

  const removeItemFromOrder = (id: string) => {
    setOrderItems((prev) => prev.filter((i) => i.menuItem._id !== id));
    toast.success("Item removed from order");
  };

  const updateItemQuantity = (id: string, qty: number) => {
    if (qty < 1) {
      removeItemFromOrder(id);
      return;
    }
    setOrderItems((prev) =>
      prev.map((i) =>
        i.menuItem._id === id ? { ...i, quantity: qty } : i
      )
    );
  };

  const totalAmount = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Order updated successfully (mock)");
  };

  const handleBack = () => router.push("/admin/orders");

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Edit Order (Default Data)</h1>
          <p className="text-gray-600">This is mock data for demonstration</p>
          <div className="flex gap-2 mt-1">
            <Badge variant="secondary">Order: {orderNumber}</Badge>
            <Badge variant="outline">ID: MOCK1234</Badge>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader><CardTitle>Customer Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="customerName">Customer Name *</Label>
                  <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="customerPhone">Phone *</Label>
                  <Input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="customerEmail">Email</Label>
                  <Input value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="deliveryAddress">Delivery Address</Label>
                  <Textarea value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} rows={3} />
                </div>
                <div>
                  <Label htmlFor="specialInstructions">Special Instructions</Label>
                  <Textarea value={specialInstructions} onChange={(e) => setSpecialInstructions(e.target.value)} rows={2} />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader><CardTitle>Add Menu Items</CardTitle></CardHeader>
              <CardContent>
                <div className="flex gap-4 flex-col sm:flex-row">
                  <div className="flex-1">
                    <Label>Select Menu Item</Label>
                    <Select value={selectedMenuItem} onValueChange={setSelectedMenuItem}>
                      <SelectTrigger><SelectValue placeholder="Choose item" /></SelectTrigger>
                      <SelectContent>
                        {menuItems.map(item => (
                          <SelectItem key={item._id} value={item._id}>
                            {item.title} - ₹{item.discountedPrice || item.price}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-32">
                    <Label>Qty</Label>
                    <Input type="number" min="1" value={selectedQuantity} onChange={(e) => setSelectedQuantity(Math.max(1, Number(e.target.value)))} />
                  </div>
                  <div className="flex items-end">
                    <Button type="button" onClick={addItemToOrder} disabled={!selectedMenuItem}><Plus className="h-4 w-4 mr-2" /> Add</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Order Items</span>
                  {orderItems.length > 0 && (
                    <div className="flex gap-2">
                      <Badge variant="secondary">{orderItems.length} item{orderItems.length !== 1 ? 's' : ''}</Badge>
                      <Badge variant="outline" className="bg-green-50 text-green-700">Total: ₹{totalAmount}</Badge>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {orderItems.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No items in this order</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orderItems.map((item) => (
                      <div key={item.menuItem._id} className="flex justify-between items-center p-3 border rounded-lg bg-gray-50 hover:bg-gray-100">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="flex-1">
                            <p className="font-medium">{item.menuItem.title}</p>
                            <p className="text-sm text-gray-600">₹{item.price} × {item.quantity}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Button type="button" variant="outline" size="icon" onClick={() => updateItemQuantity(item.menuItem._id, item.quantity - 1)}><Minus className="h-3 w-3" /></Button>
                            <span className="w-8 text-center font-medium bg-white px-2 py-1 rounded border">{item.quantity}</span>
                            <Button type="button" variant="outline" size="icon" onClick={() => updateItemQuantity(item.menuItem._id, item.quantity + 1)}><Plus className="h-3 w-3" /></Button>
                          </div>
                          <div className="w-20 text-right font-semibold">₹{item.price * item.quantity}</div>
                          <Button type="button" variant="ghost" size="icon" className="text-red-600" onClick={() => removeItemFromOrder(item.menuItem._id)}><X className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={handleBack}>Cancel</Button>
              <Button type="submit" className="bg-orange-600 hover:bg-orange-700">Update Order</Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
