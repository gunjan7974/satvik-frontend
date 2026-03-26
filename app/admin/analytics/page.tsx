"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { TrendingUp, Eye, CalendarIcon, Users, ShoppingBag, Utensils, Loader2, ArrowUpRight, BarChart3 } from 'lucide-react';
import { apiClient } from '../../../lib/api';
import { toast } from 'react-hot-toast';

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await apiClient.adminGetStats();
      if (res.success) {
        setData(res);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
        <p className="text-gray-500 font-medium">Analyzing business data...</p>
      </div>
    );
  }

  const stats = data?.stats || {};
  const recentOrders = data?.recentOrders || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Business Intelligence</h2>
          <p className="text-sm text-gray-500">Real-time performance metrics and growth insights</p>
        </div>
        <button 
          onClick={fetchStats}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors border shadow-sm flex items-center gap-2 text-sm font-medium"
        >
          <BarChart3 className="h-4 w-4" /> Refresh Data
        </button>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-white to-green-50/30 border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-green-600 mb-1">Total Revenue</p>
                <p className="text-2xl font-black text-gray-900 font-sans">₹{stats.totalRevenue?.toLocaleString() || 0}</p>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-green-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3">
              <ArrowUpRight className="h-3 w-3 text-green-500" />
              <span className="text-[11px] font-bold text-green-600">+12.5% vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-blue-50/30 border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-blue-600 mb-1">Blog Visibility</p>
                <p className="text-2xl font-black text-gray-900">{stats.totalBlogViews?.toLocaleString() || 0}</p>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-blue-100 flex items-center justify-center">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <p className="text-[11px] font-medium text-blue-500 mt-3">Total engaging readers</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-purple-50/30 border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-purple-600 mb-1">Event Revenue</p>
                <p className="text-2xl font-black text-gray-900 font-sans">₹{stats.totalEventRevenue?.toLocaleString() || 0}</p>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-purple-100 flex items-center justify-center">
                <CalendarIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <p className="text-[11px] font-medium text-purple-500 mt-3">From catering & bookings</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-orange-50/30 border-l-4 border-l-orange-500 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-orange-600 mb-1">Growth Engine</p>
                <p className="text-2xl font-black text-gray-900">{stats.totalOrders + stats.totalUsers || 0}</p>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-orange-100 flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <p className="text-[11px] font-medium text-orange-500 mt-3">Orders & New Users combined</p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Metrics & Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="border-b bg-gray-50/30">
              <CardTitle className="text-lg flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-orange-500" />
                Latest Orders
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {recentOrders.length === 0 ? (
                <div className="p-10 text-center text-gray-400">No orders recorded yet</div>
              ) : (
                <div className="divide-y">
                  {recentOrders.map((order: any) => (
                    <div key={order._id} className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-600">
                           {order.customer?.name?.charAt(0) || 'C'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Order #{order.orderNumber}</p>
                          <p className="text-xs text-gray-400 capitalize">{order.status} • {new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-gray-900 font-sans">₹{order.total?.toLocaleString()}</p>
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{order.items?.length || 0} items</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
           <Card className="bg-slate-900 text-white overflow-hidden relative">
              <div className="absolute -top-10 -right-10 h-40 w-40 bg-orange-500/10 rounded-full blur-3xl"></div>
              <CardHeader className="relative">
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-orange-400" />
                  Community Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 relative">
                 <div className="flex justify-between items-end border-b border-white/10 pb-4">
                    <div>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Active Customers</p>
                      <p className="text-3xl font-black">{stats.totalUsers || 0}</p>
                    </div>
                    <Badge className="bg-green-500 hover:bg-green-600">Vibrant</Badge>
                 </div>
                 <div className="flex justify-between items-end">
                    <div>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Our Partners (Vendors)</p>
                      <p className="text-3xl font-black">{stats.totalVendors || 0}</p>
                    </div>
                    <Badge className="bg-blue-500 hover:bg-blue-600">Trusted</Badge>
                 </div>
              </CardContent>
           </Card>

           <Card className="border-2 border-orange-100 bg-orange-50/20">
              <CardContent className="p-6 text-center">
                 <div className="h-16 w-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3 transform shadow-lg shadow-orange-200">
                    <Utensils className="h-8 w-8 text-white" />
                 </div>
                 <h4 className="text-lg font-black text-gray-900">The Kitchen Portfolio</h4>
                 <p className="text-sm text-gray-600 mt-2">Currently serving <span className="font-bold text-orange-600">{stats.totalMenuItems || 0}</span> unique flavors across our premium categories.</p>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}