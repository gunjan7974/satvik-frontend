"use client";

import { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Trash2, ShoppingCart, User, Clock, Eye } from "lucide-react";
import { apiClient } from "../../../lib/api";

interface CartItem {
  menu: any;
  title: string;
  price: number;
  quantity: number;
  subtotal: number;
}

interface Cart {
  _id: string;
  user: any;
  items: CartItem[];
  total: number;
  updatedAt: string;
}

export default function AdminCartsPage() {
  const [carts, setCarts] = useState<Cart[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCarts();
  }, []);

  const fetchCarts = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getAllCarts();
      if (Array.isArray(data)) {
        setCarts(data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching carts:", error);
      setLoading(false);
    }
  };

  const handleDeleteCart = async (id: string) => {
    if (confirm("Are you sure you want to clear this cart?")) {
      // Implementation for delete
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Active Shopping Carts</h2>
        <Button variant="outline" onClick={fetchCarts} disabled={loading}>
          Refresh List
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-orange-600" />
            Live Customer Carts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-10 text-center">Loading carts...</div>
          ) : carts.length === 0 ? (
            <div className="py-10 text-center text-gray-500 underline decoration-orange-300">
              No active shopping carts found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items Count</TableHead>
                    <TableHead>Total Value</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {carts.map((cart) => (
                    <TableRow key={cart._id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          {typeof cart.user === 'object' ? cart.user.name : "Guest User"}
                        </div>
                      </TableCell>
                      <TableCell>{cart.items.length} items</TableCell>
                      <TableCell className="font-semibold text-green-600">₹{cart.total}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          {new Date(cart.updatedAt).toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="ghost" title="View Details">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteCart(cart._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="pt-6">
            <h3 className="font-bold text-orange-800">Abandoned Carts</h3>
            <p className="text-2xl font-bold text-orange-600">0</p>
            <p className="text-xs text-orange-700">Carts older than 24h</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <h3 className="font-bold text-green-800">Total Cart Value</h3>
            <p className="text-2xl font-bold text-green-600">₹0</p>
            <p className="text-xs text-green-700">Potential Revenue</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <h3 className="font-bold text-blue-800">Active Sessions</h3>
            <p className="text-2xl font-bold text-blue-600">0</p>
            <p className="text-xs text-blue-700">Users currently browsing</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
