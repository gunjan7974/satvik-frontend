"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../components/ui/alert-dialog";
import {
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  RefreshCcw,
  Package,
  Users,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  Loader2
} from "lucide-react";
import { toast } from "react-hot-toast";
import { apiClient } from "../../../lib/api";

export default function OrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<any>(null);

  const loadOrders = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const response = await apiClient.getOrders({ allOrders: true });
      if (response.success && response.data) {
        setOrders(response.data);
      }
    } catch (error) {
      console.error("Failed to load orders", error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
    // Optional: Polling for real-time updates every 30 seconds
    const interval = setInterval(() => loadOrders(true), 15000);
    return () => clearInterval(interval);
  }, [loadOrders]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const response = await apiClient.updateOrderStatus(id, newStatus);
      if (response.success) {
        setOrders(prev => 
          prev.map(order => order._id === id ? { ...order, status: newStatus } : order)
        );
        toast.success(`Order status updated to ${newStatus}`);
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDeleteOrder = async () => {
    if (!orderToDelete) return;
    try {
      await apiClient.deleteOrder(orderToDelete._id);
      setOrders(prev => prev.filter(order => order._id !== orderToDelete._id));
      toast.success("Order deleted");
      setDeleteDialogOpen(false);
    } catch (error) {
       toast.error("Failed to delete order");
    }
  };

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    switch (s) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'preparing': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'on the way': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredOrders = orders.filter(order => {
    const search = searchTerm.toLowerCase();
    const orderNum = (order.orderNumber || "").toLowerCase();
    const customer = (order.user?.name || "").toLowerCase();
    
    const matchesSearch = orderNum.includes(search) || customer.includes(search);
    const matchesStatus = statusFilter === "all" || order.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Loader2 className="h-10 w-10 animate-spin text-orange-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
       <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Order?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the order permanently.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteOrder} className="bg-red-600">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Orders Management</h1>
          <p className="text-gray-600">Manage all customer orders ({orders.length})</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => loadOrders(true)} variant="outline" disabled={refreshing}>
            <RefreshCcw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search order # or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Preparing">Preparing</SelectItem>
              <SelectItem value="On the way">On the way</SelectItem>
              <SelectItem value="Delivered">Delivered</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrders.map(order => (
          <Card key={order._id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">#{order._id.slice(-6).toUpperCase()}</CardTitle>
                <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <Badge variant="outline" className={getStatusColor(order.status)}>
                {order.status}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm font-medium">
                Customer: <span className="text-gray-600">{order.user?.name || "Guest"}</span>
                <p className="text-xs text-gray-500">{order.user?.phone}</p>
              </div>
              <div className="border-t pt-3">
                <p className="text-xs text-gray-400 mb-2 uppercase">Order Items</p>
                <div className="space-y-1">
                  {order.orderItems?.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>{item.food?.name} x {item.quantity}</span>
                      <span className="font-medium">₹{(item.food?.price || 0) * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t pt-3 flex justify-between items-center font-bold text-lg">
                <span>Total Amount</span>
                <span className="text-orange-600">₹{order.totalPrice}</span>
              </div>
              <div className="flex gap-2 pt-2">
                <Select
                  defaultValue={order.status}
                  onValueChange={(val) => handleStatusChange(order._id, val)}
                >
                  <SelectTrigger className="flex-1 h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Preparing">Preparing</SelectItem>
                    <SelectItem value="On the way">On the way</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="h-9 w-9"
                  onClick={() => {
                    setOrderToDelete(order);
                    setDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {filteredOrders.length === 0 && (
         <div className="text-center py-20 text-gray-500">
           No active orders found.
         </div>
      )}
    </div>
  );
}
