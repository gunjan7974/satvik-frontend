"use client";

import { useState } from "react";
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
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function OrdersPage() {
  const router = useRouter();

  // Default orders
  const defaultOrders = [
    {
      _id: "o1",
      orderNumber: "ORD-1001",
      status: "pending",
      createdAt: new Date().toISOString(),
      customer: { name: "John Doe", phone: "9876543210", email: "john@example.com" },
      items: [
        { title: "Paneer Butter Masala", quantity: 2, price: 200 },
        { title: "Veg Pulao", quantity: 1, price: 150 },
      ],
      total: 550,
    },
    {
      _id: "o2",
      orderNumber: "ORD-1002",
      status: "delivered",
      createdAt: new Date().toISOString(),
      customer: { name: "Jane Smith", phone: "9123456780", email: "jane@example.com" },
      items: [
        { title: "Chicken Biryani", quantity: 1, price: 300 },
      ],
      total: 300,
    },
  ];

  const [orders, setOrders] = useState(defaultOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<any>(null);

  const orderStatuses = [
    "pending",
    "confirmed",
    "preparing",
    "ready",
    "out_for_delivery",
    "delivered",
    "cancelled",
  ];

  const handleDeleteClick = (order: any) => {
    setOrderToDelete(order);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!orderToDelete) return;
    setOrders(prev => prev.filter(order => order._id !== orderToDelete._id));
    toast.success(`Order ${orderToDelete.orderNumber} deleted successfully`);
    setDeleteDialogOpen(false);
    setOrderToDelete(null);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setOrderToDelete(null);
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order._id === id ? { ...order, status: newStatus } : order
      )
    );
    toast.success("Order status updated");
  };

  const handleEdit = (order: any) => router.push(`/admin/orders/edit/${order._id}`);
  const handleViewDetails = (order: any) => router.push(`/admin/orders/${order._id}`);
  const handleAddOrder = () => router.push('/admin/orders/new');

  const orderStats = {
    total: orders.length,
    pending: orders.filter(order => order.status === 'pending').length,
    preparing: orders.filter(order => order.status === 'preparing').length,
    delivered: orders.filter(order => order.status === 'delivered').length,
    cancelled: orders.filter(order => order.status === 'cancelled').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'preparing': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'ready': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'out_for_delivery': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle2 className="h-4 w-4" />;
      case 'preparing': return <Users className="h-4 w-4" />;
      case 'ready': return <Package className="h-4 w-4" />;
      case 'out_for_delivery': return <Truck className="h-4 w-4" />;
      case 'delivered': return <CheckCircle2 className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    const orderNumber = String(order?.orderNumber || "").toLowerCase();
    const customerName = String(order?.customer?.name || "").toLowerCase();
    const customerPhone = String(order?.customer?.phone || "");
    const search = searchTerm.toLowerCase();

    const matchesSearch = orderNumber.includes(search) || customerName.includes(search) || customerPhone.includes(search);
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 p-6">
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the order
              "{orderToDelete?.orderNumber}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600 mt-1">Manage and track all customer orders</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleAddOrder} className="bg-orange-600 hover:bg-orange-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Order
          </Button>
        </div>
      </div>

      {/* Order Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card><CardContent className="p-4"><p>Total: {orderStats.total}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p>Pending: {orderStats.pending}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p>Preparing: {orderStats.preparing}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p>Delivered: {orderStats.delivered}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p>Cancelled: {orderStats.cancelled}</p></CardContent></Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="all">All Status</option>
            {orderStatuses.map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <Card key={order._id}>
              <CardHeader>
                <CardTitle>
                  {order.orderNumber} <Badge className={getStatusColor(order.status)}>{getStatusIcon(order.status)} {order.status}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>Customer: {order.customer.name}</div>
                <div>Total: ₹{order.total}</div>
                <div className="flex justify-between mt-4 space-x-2">
                <Button onClick={() => handleStatusChange(order._id, 'delivered')}>Mark Delivered</Button>
                <Button onClick={() => handleDeleteClick(order)} className="bg-red-600">Delete</Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p>No orders found.</p>
        )}
      </div>
    </div>
  );
}
