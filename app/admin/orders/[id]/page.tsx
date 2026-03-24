"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import { Separator } from "../../../../components/ui/separator";
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  Clock,
  Phone,
  Mail,
  FileText,
  CreditCard,
  Truck,
  CheckCircle2,
  XCircle,
  Printer,
  Edit,
  Copy,
  Calendar,
  Hash,
  ShoppingCart,
  AlertCircle
} from "lucide-react";
import { toast } from "react-hot-toast";

// Default order data
const defaultOrder = {
  _id: "order_12345678",
  orderNumber: "ORD-1001",
  customer: {
    name: "John Doe",
    email: "john@example.com",
    phone: "9876543210",
    address: {
      line1: "123 Main Street",
      line2: "Apt 4B",
      city: "Bangalore",
      state: "Karnataka",
      postalCode: "560001",
      country: "India",
    },
  },
  items: [
    { _id: "item1", menu: "menu_1", title: "Veg Sandwich", price: 150, quantity: 2, subtotal: 300 },
    { _id: "item2", menu: "menu_2", title: "Paneer Pizza", price: 250, quantity: 1, subtotal: 250 },
  ],
  total: 550,
  status: "pending",
  specialInstructions: "Please make it extra spicy.",
  paymentStatus: "pending",
  paymentMethod: "Cash on Delivery",
  createdBy: { _id: "admin1", name: "Admin User", email: "admin@example.com" },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export default function OrderViewPage() {
  const router = useRouter();
  const [order] = useState(defaultOrder);
  const [printing, setPrinting] = useState(false);

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      confirmed: "bg-blue-100 text-blue-800 border-blue-200",
      preparing: "bg-orange-100 text-orange-800 border-orange-200",
      ready: "bg-purple-100 text-purple-800 border-purple-200",
      out_for_delivery: "bg-indigo-100 text-indigo-800 border-indigo-200",
      delivered: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getPaymentStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      paid: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
      refunded: "bg-blue-100 text-blue-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      pending: <Clock className="h-4 w-4" />,
      confirmed: <CheckCircle2 className="h-4 w-4" />,
      preparing: <Package className="h-4 w-4" />,
      ready: <CheckCircle2 className="h-4 w-4" />,
      out_for_delivery: <Truck className="h-4 w-4" />,
      delivered: <CheckCircle2 className="h-4 w-4" />,
      cancelled: <XCircle className="h-4 w-4" />,
    };
    return icons[status as keyof typeof icons] || <Package className="h-4 w-4" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handlePrint = async () => {
    setPrinting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      window.print();
    } finally {
      setPrinting(false);
    }
  };

  const handleCopyOrderNumber = () => {
    navigator.clipboard.writeText(order.orderNumber);
    toast.success("Order number copied to clipboard");
  };

  const handleEditOrder = () => {
    router.push(`/admin/orders/edit/${order._id}`);
  };

  return (
    <div className="space-y-6 p-6 print:p-0">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 print:flex-row">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/admin/orders")}
            className="print:hidden"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Hash className="h-3 w-3" />
                {order.orderNumber}
              </Badge>
              <Badge variant="outline" className={getStatusColor(order.status)}>
                <span className="flex items-center gap-1">
                  {getStatusIcon(order.status)}
                  {order.status.charAt(0).toUpperCase() +
                    order.status.slice(1).replace("_", " ")}
                </span>
              </Badge>
              <Badge variant="outline" className={getPaymentStatusColor(order.paymentStatus)}>
                <CreditCard className="h-3 w-3 mr-1" />
                {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 print:hidden">
          <Button
            variant="outline"
            onClick={handleCopyOrderNumber}
            className="flex items-center gap-2"
          >
            <Copy className="h-4 w-4" />
            Copy ID
          </Button>
          <Button
            variant="outline"
            onClick={handlePrint}
            disabled={printing}
            className="flex items-center gap-2"
          >
            <Printer className="h-4 w-4" />
            {printing ? "Printing..." : "Print"}
          </Button>
          <Button
            onClick={handleEditOrder}
            className="bg-orange-600 hover:bg-orange-700 flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit Order
          </Button>
        </div>
      </div>

      {/* ...rest of the component stays same, using `order` from state */}
      {/* Order Items, Customer Info, Payment, Metadata */}
      {/* All API calls removed, everything is using defaultOrder */}
    </div>
  );
}
