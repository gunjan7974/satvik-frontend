import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { TrendingUp, Eye, CalendarIcon } from 'lucide-react';

// Default data
const defaultMenuItems = [
  { id: '1', name: 'Margherita Pizza', price: 12.99, category: 'Pizza', image: '/images/pizza.jpg' },
  { id: '2', name: 'Caesar Salad', price: 8.99, category: 'Salad', image: '/images/salad.jpg' },
  { id: '3', name: 'Chocolate Cake', price: 6.99, category: 'Dessert', image: '/images/cake.jpg' },
  { id: '4', name: 'Burger', price: 10.99, category: 'Main Course', image: '/images/burger.jpg' },
  { id: '5', name: 'Pasta', price: 11.99, category: 'Main Course', image: '/images/pasta.jpg' },
];

const defaultBlogPosts = [
  { id: '1', title: 'Introduction to Cooking', views: 150 },
  { id: '2', title: 'Healthy Eating Tips', views: 89 },
  { id: '3', title: 'Seasonal Recipes', views: 203 },
];

const defaultEventBookings = [
  { id: '1', totalAmount: 1200 },
  { id: '2', totalAmount: 800 },
  { id: '3', totalAmount: 1500 },
];

const defaultOrders = [
  { id: '1', customerName: 'John Doe', total: 45.99 },
  { id: '2', customerName: 'Jane Smith', total: 32.50 },
  { id: '3', customerName: 'Mike Johnson', total: 67.25 },
  { id: '4', customerName: 'Sarah Wilson', total: 28.75 },
  { id: '5', customerName: 'David Brown', total: 52.00 },
];

const defaultStats = {
  totalRevenue: 12500,
};

export default function AnalyticsPage() {
  const menuItems = defaultMenuItems;
  const blogPosts = defaultBlogPosts;
  const eventBookings = defaultEventBookings;
  const orders = defaultOrders;
  const stats = defaultStats;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Analytics Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-700">₹{stats.totalRevenue}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-xs text-green-600 mt-2">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Total Blog Views</p>
                <p className="text-2xl font-bold text-blue-700">
                  {blogPosts.reduce((sum, post) => sum + (post.views || 0), 0)}
                </p>
              </div>
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-xs text-blue-600 mt-2">Total blog views</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600">Popular Items</p>
                <p className="text-2xl font-bold text-purple-700">{menuItems.length}</p>
              </div>
              <Eye className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-xs text-purple-600 mt-2">Top menu items</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-amber-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600">Event Revenue</p>
                <p className="text-2xl font-bold text-orange-700">
                  ₹{eventBookings.reduce((sum, ev) => sum + (ev.totalAmount || 0), 0)}
                </p>
              </div>
              <CalendarIcon className="h-8 w-8 text-orange-600" />
            </div>
            <p className="text-xs text-orange-600 mt-2">From {eventBookings.length} events</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Popular Menu Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {menuItems.slice(0, 5).map((item) => (
                <div key={String(item.id)} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-12 h-12 object-cover rounded" 
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.category}</p>
                    </div>
                  </div>
                  <div className="font-bold">₹{item.price}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.slice(0, 5).map((o) => (
                <div key={o.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Order #{o.id}</p>
                    <p className="text-sm text-gray-500">{o.customerName}</p>
                  </div>
                  <div className="font-bold">₹{o.total}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}