"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  Plus, Edit, Trash2, Save, X, LogOut, Users, ShoppingCart, Calendar as CalendarIcon, 
  BarChart3, Home, BookOpen, Image as ImageIcon, Video, Gift, Building2, Sparkles, 
  Heart, Star, PartyPopper, Clock, Phone, MapPin, Upload, Eye, MessageSquare, 
  TrendingUp, TrendingDown, Package, CheckCircle, XCircle, AlertTriangle, 
  Mail, Settings, Monitor, Check, Ban, UserCheck, UserX, Navigation, Truck,
  Menu as MenuIcon, Bell, Search, User, ChevronDown, ChevronRight,
  DollarSign, Activity, Coffee, Calendar
} from 'lucide-react';
import { useAuth } from '../hooks/AuthContext';
import { format } from 'date-fns';

// Types
interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isVeg: boolean;
  isAvailable: boolean;
}

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image: string;
  views: number;
  featured: boolean;
  type: 'article' | 'video' | 'photo';
  mediaUrl?: string;
}

interface EventBooking {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  eventType: string;
  eventDate: Date;
  guestCount: number;
  timeSlot: string;
  specialRequests: string;
  totalAmount: number;
  advanceAmount: number;
  status: "pending" | "confirmed" | "cancelled";
  bookingDate: Date;
  selectedServices: string[];
}

interface Order {
  id: string;
  customerName: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
  orderDate: Date;
  deliveryAddress: string;
  phone: string;
  paymentMethod: string;
  estimatedDelivery?: string;
  deliveryPerson?: {
    name: string;
    phone: string;
    location: { lat: number; lng: number };
  };
}

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  status: 'new' | 'replied' | 'closed';
}

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
}

interface AnimatedDashboardProps {
  menuItems: MenuItem[];
  blogPosts: BlogPost[];
  onUpdateMenuItems: (items: MenuItem[]) => void;
  onUpdateBlogPosts: (posts: BlogPost[]) => void;
  onGoBack: () => void;
}

// Mock Data
const mockEventBookings: EventBooking[] = [
  {
    id: "SK123456",
    customerName: "Rajesh Kumar",
    phone: "9876543210",
    email: "rajesh@email.com",
    eventType: "Birthday Party",
    eventDate: new Date(2024, 11, 25),
    guestCount: 30,
    timeSlot: "7:00 PM - 10:00 PM",
    specialRequests: "Need birthday cake arrangement and decorations in blue theme",
    totalAmount: 3250,
    advanceAmount: 975,
    status: "confirmed",
    bookingDate: new Date(2024, 11, 18),
    selectedServices: ["decoration", "manager", "customMenu"]
  },
  {
    id: "SK123457",
    customerName: "Priya Sharma",
    phone: "9876543211",
    email: "priya@email.com",
    eventType: "Corporate Event",
    eventDate: new Date(2024, 11, 28),
    guestCount: 50,
    timeSlot: "1:00 PM - 4:00 PM",
    specialRequests: "Need AV equipment for presentation and formal setup",
    totalAmount: 7250,
    advanceAmount: 2175,
    status: "pending",
    bookingDate: new Date(2024, 11, 20),
    selectedServices: ["manager", "groupPricing"]
  }
];

const mockOrders: Order[] = [
  {
    id: "ORD001",
    customerName: "Anjali Sharma",
    items: [
      { name: "Special Sattvik Thali", quantity: 2, price: 250 },
      { name: "Paneer Butter Masala", quantity: 1, price: 180 }
    ],
    total: 680,
    status: "preparing",
    orderDate: new Date(),
    deliveryAddress: "123 Main St, Raipur, Chhattisgarh",
    phone: "9876543210",
    paymentMethod: "Online",
    estimatedDelivery: "25-30 mins"
  },
  {
    id: "ORD002",
    customerName: "Vikash Kumar",
    items: [
      { name: "Dal Tadka", quantity: 1, price: 120 },
      { name: "Jeera Rice", quantity: 1, price: 90 }
    ],
    total: 210,
    status: "out_for_delivery",
    orderDate: new Date(Date.now() - 30 * 60 * 1000),
    deliveryAddress: "456 Park St, Raipur, Chhattisgarh",
    phone: "9876543211",
    paymentMethod: "COD",
    estimatedDelivery: "10-15 mins",
    deliveryPerson: {
      name: "Rajesh Delivery",
      phone: "9876543222",
      location: { lat: 21.2514, lng: 81.6296 }
    }
  }
];

const mockContacts: Contact[] = [
  {
    id: 1,
    name: "Rahul Verma",
    email: "rahul@email.com",
    phone: "9876543210",
    subject: "Great Food Experience",
    message: "I visited your restaurant last week and had an amazing experience. The food quality is exceptional!",
    date: "2024-12-20",
    status: "new"
  },
  {
    id: 2,
    name: "Sunita Agarwal",
    email: "sunita@email.com",
    phone: "9876543211",
    subject: "Event Booking Query",
    message: "I would like to book your restaurant for a family function. Please provide more details about packages.",
    date: "2024-12-19",
    status: "replied"
  }
];

const sidebarItems: SidebarItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Monitor, color: 'text-blue-600' },
  { id: 'menu', label: 'Menu Management', icon: Coffee, color: 'text-green-600' },
  { id: 'orders', label: 'Orders', icon: Package, color: 'text-orange-600' },
  { id: 'events', label: 'Event Bookings', icon: Calendar, color: 'text-purple-600' },
  { id: 'blog', label: 'Blog Posts', icon: BookOpen, color: 'text-pink-600' },
  { id: 'contacts', label: 'Contacts', icon: MessageSquare, color: 'text-indigo-600' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'text-red-600' },
];

const categories = ['Breakfast', 'Main Course', 'Chinese', 'Rice', 'Starters', 'Tandoor', 'Breads', 'Thali', 'Combos', 'Dal', 'Beverages'];
const blogCategories = ['Restaurant Events', 'Food Specialties', 'Festival Celebrations', 'Behind the Kitchen', 'Customer Stories', 'Seasonal Menu'];

export default function AnimatedDashboard({ 
  menuItems, 
  blogPosts, 
  onUpdateMenuItems, 
  onUpdateBlogPosts, 
  onGoBack 
}: AnimatedDashboardProps) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [notifications] = useState(3);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isAddPostDialogOpen, setIsAddPostDialogOpen] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [eventBookings, setEventBookings] = useState<EventBooking[]>(mockEventBookings);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState<() => void>(() => {});
  const [confirmationMessage, setConfirmationMessage] = useState('');

  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: 0,
    image: '',
    category: '',
    isVeg: true,
    isAvailable: true
  });

  const [newPost, setNewPost] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: 'Admin',
    category: '',
    image: '',
    featured: false,
    type: 'article' as 'article' | 'video' | 'photo',
    mediaUrl: ''
  });

  // Statistics
  const stats = {
    totalItems: menuItems.length,
    availableItems: menuItems.filter(item => item.isAvailable).length,
    // categories: [...new Set(menuItems.map(item => item.category))].length,
    totalEvents: eventBookings.length,
    pendingEvents: eventBookings.filter(e => e.status === 'pending').length,
    confirmedEvents: eventBookings.filter(e => e.status === 'confirmed').length,
    totalBlogPosts: blogPosts.length,
    featuredPosts: blogPosts.filter(p => p.featured).length,
    totalOrders: orders.length,
    activeOrders: orders.filter(o => !['delivered', 'cancelled'].includes(o.status)).length,
    newContacts: contacts.filter(c => c.status === 'new').length,
    totalRevenue: orders.reduce((sum, order) => sum + order.total, 0)
  };

  // Utility functions
  const showSuccess = (message: string) => {
    setSuccess(message);
    setTimeout(() => setSuccess(''), 3000);
  };

  const showError = (message: string) => {
    setError(message);
    setTimeout(() => setError(''), 3000);
  };

  const confirmAction = (message: string, action: () => void) => {
    setConfirmationMessage(message);
    setConfirmationAction(() => action);
    setShowConfirmation(true);
  };

  const executeConfirmation = () => {
    confirmationAction();
    setShowConfirmation(false);
  };

  // Menu Management Functions
  const handleAddItem = async () => {
    if (!newItem.name || !newItem.description || newItem.price <= 0 || !newItem.category) {
      showError('Please fill all required fields');
      return;
    }

    let imageUrl = newItem.image;
    if (!imageUrl) {
      try {
        setIsLoadingImage(true);
      } catch (error) {
        imageUrl = 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBmb29kfGVufDF8fHx8MTc1NzQxODkyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';
      } finally {
        setIsLoadingImage(false);
      }
    }

    const item: MenuItem = {
      id: Math.max(...menuItems.map(item => item.id), 0) + 1,
      ...newItem,
      image: imageUrl
    };

    onUpdateMenuItems([...menuItems, item]);
    setNewItem({ name: '', description: '', price: 0, image: '', category: '', isVeg: true, isAvailable: true });
    setIsAddDialogOpen(false);
    showSuccess('Menu item added successfully!');
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setNewItem({
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image,
      category: item.category,
      isVeg: item.isVeg,
      isAvailable: item.isAvailable
    });
    setIsAddDialogOpen(true);
  };

  const handleUpdateItem = async () => {
    if (!editingItem || !newItem.name || !newItem.description || newItem.price <= 0 || !newItem.category) {
      showError('Please fill all required fields');
      return;
    }

    let imageUrl = newItem.image;
    if (!imageUrl) {
      try {
        setIsLoadingImage(true);
      } catch (error) {
        imageUrl = editingItem.image;
      } finally {
        setIsLoadingImage(false);
      }
    }

    const updatedItems = menuItems.map(item =>
      item.id === editingItem.id ? { ...item, ...newItem, image: imageUrl } : item
    );

    onUpdateMenuItems(updatedItems);
    setEditingItem(null);
    setNewItem({ name: '', description: '', price: 0, image: '', category: '', isVeg: true, isAvailable: true });
    setIsAddDialogOpen(false);
    showSuccess('Menu item updated successfully!');
  };

  const handleDeleteItem = (id: number) => {
    confirmAction('Are you sure you want to delete this menu item?', () => {
      const updatedItems = menuItems.filter(item => item.id !== id);
      onUpdateMenuItems(updatedItems);
      showSuccess('Menu item deleted successfully!');
    });
  };

  const toggleAvailability = (id: number) => {
    const updatedItems = menuItems.map(item =>
      item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
    );
    onUpdateMenuItems(updatedItems);
    showSuccess('Item availability updated!');
  };

  // Blog Management Functions
  const handleAddPost = async () => {
    if (!newPost.title || !newPost.excerpt || !newPost.content || !newPost.category) {
      showError('Please fill all required fields');
      return;
    }

    let imageUrl = newPost.image;
    if (!imageUrl) {
      try {
        setIsLoadingImage(true);
      } catch (error) {
        imageUrl = 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb29raW5nfGVufDF8fHx8MTc1NzQxOTEwOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';
      } finally {
        setIsLoadingImage(false);
      }
    }

    const post: BlogPost = {
      id: Math.max(...blogPosts.map(post => post.id), 0) + 1,
      ...newPost,
      date: new Date().toISOString(),
      views: 0,
      image: imageUrl
    };

    onUpdateBlogPosts([...blogPosts, post]);
    setNewPost({ title: '', excerpt: '', content: '', author: 'Admin', category: '', image: '', featured: false, type: 'article', mediaUrl: '' });
    setIsAddPostDialogOpen(false);
    showSuccess('Blog post added successfully!');
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setNewPost({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      category: post.category,
      image: post.image,
      featured: post.featured,
      type: post.type,
      mediaUrl: post.mediaUrl || ''
    });
    setIsAddPostDialogOpen(true);
  };

  const handleUpdatePost = async () => {
    if (!editingPost || !newPost.title || !newPost.excerpt || !newPost.content || !newPost.category) {
      showError('Please fill all required fields');
      return;
    }

    let imageUrl = newPost.image;
    if (!imageUrl) {
      try {
        setIsLoadingImage(true);
      } catch (error) {
        imageUrl = editingPost.image;
      } finally {
        setIsLoadingImage(false);
      }
    }

    const updatedPosts = blogPosts.map(post =>
      post.id === editingPost.id ? { ...post, ...newPost, image: imageUrl, date: editingPost.date } : post
    );

    onUpdateBlogPosts(updatedPosts);
    setEditingPost(null);
    setNewPost({ title: '', excerpt: '', content: '', author: 'Admin', category: '', image: '', featured: false, type: 'article', mediaUrl: '' });
    setIsAddPostDialogOpen(false);
    showSuccess('Blog post updated successfully!');
  };

  const handleDeletePost = (id: number) => {
    confirmAction('Are you sure you want to delete this blog post?', () => {
      const updatedPosts = blogPosts.filter(post => post.id !== id);
      onUpdateBlogPosts(updatedPosts);
      showSuccess('Blog post deleted successfully!');
    });
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'confirmed': return 'bg-blue-100 text-blue-700';
      case 'preparing': return 'bg-orange-100 text-orange-700';
      case 'ready': return 'bg-purple-100 text-purple-700';
      case 'out_for_delivery': return 'bg-indigo-100 text-indigo-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const renderMainContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                    <Package className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-700">{stats.totalOrders}</div>
                    <p className="text-xs text-blue-600">
                      {stats.activeOrders} active orders
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-700">₹{stats.totalRevenue}</div>
                    <p className="text-xs text-green-600">
                      Total revenue today
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Menu Items</CardTitle>
                    <Coffee className="h-4 w-4 text-orange-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-700">{stats.totalItems}</div>
                    <p className="text-xs text-orange-600">
                      {stats.availableItems} available
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Event Bookings</CardTitle>
                    <Calendar className="h-4 w-4 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-700">{stats.totalEvents}</div>
                    <p className="text-xs text-purple-600">
                      {stats.pendingEvents} pending
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(order.status)}`}>
                          {order.status.replace('_', ' ')}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{order.customerName}</p>
                          <p className="text-sm text-gray-500">₹{order.total}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {eventBookings.slice(0, 5).map((event) => (
                      <div key={event.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          event.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          event.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {event.status}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{event.customerName}</p>
                          <p className="text-sm text-gray-500">{event.eventType} - {event.guestCount} guests</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'menu':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Menu Management</h2>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => { setEditingItem(null); setNewItem({ name: '', description: '', price: 0, image: '', category: '', isVeg: true, isAvailable: true }); }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Item Name</Label>
                        <Input
                          id="name"
                          value={newItem.name}
                          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                          placeholder="Enter item name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="price">Price (₹)</Label>
                        <Input
                          id="price"
                          type="number"
                          value={newItem.price || ''}
                          onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })}
                          placeholder="Enter price"
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select value={newItem.category} onValueChange={(value) => setNewItem({ ...newItem, category: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="image">Image URL (optional)</Label>
                        <Input
                          id="image"
                          value={newItem.image}
                          onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                          placeholder="Enter image URL or leave blank for auto-generation"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={newItem.description}
                          onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                          placeholder="Enter item description"
                          rows={4}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="isVeg"
                            checked={newItem.isVeg}
                            onChange={(e) => setNewItem({ ...newItem, isVeg: e.target.checked })}
                          />
                          <Label htmlFor="isVeg">Vegetarian</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="isAvailable"
                            checked={newItem.isAvailable}
                            onChange={(e) => setNewItem({ ...newItem, isAvailable: e.target.checked })}
                          />
                          <Label htmlFor="isAvailable">Available</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 justify-end mt-6">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={editingItem ? handleUpdateItem : handleAddItem}
                      disabled={isLoadingImage}
                    >
                      {isLoadingImage ? 'Generating Image...' : editingItem ? 'Update Item' : 'Add Item'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="overflow-hidden">
                    <div className="relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 right-2 flex space-x-1">
                        {item.isVeg && (
                          <Badge className="bg-green-100 text-green-700">Veg</Badge>
                        )}
                        <Badge className={item.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                          {item.isAvailable ? 'Available' : 'Out of Stock'}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold">{item.name}</h3>
                          <span className="text-lg font-bold text-green-600">₹{item.price}</span>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
                        <Badge variant="outline">{item.category}</Badge>
                        <div className="flex space-x-2 pt-2">
                          <Button size="sm" variant="outline" onClick={() => handleEditItem(item)}>
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => toggleAvailability(item.id)}
                            className={item.isAvailable ? 'text-red-600' : 'text-green-600'}
                          >
                            {item.isAvailable ? <Ban className="h-3 w-3 mr-1" /> : <Check className="h-3 w-3 mr-1" />}
                            {item.isAvailable ? 'Disable' : 'Enable'}
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDeleteItem(item.id)} className="text-red-600">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'orders':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Order Management</h2>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.customerName}</p>
                            <p className="text-sm text-gray-500">{order.phone}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {order.items.map((item, index) => (
                              <p key={index} className="text-sm">
                                {item.name} x{item.quantity}
                              </p>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">₹{order.total}</TableCell>
                        <TableCell>
                          <Badge className={getOrderStatusColor(order.status)}>
                            {order.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>{format(order.orderDate, 'dd/MM/yyyy HH:mm')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      case 'events':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Event Bookings</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {eventBookings.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{event.eventType}</CardTitle>
                          <p className="text-gray-600">{event.customerName}</p>
                        </div>
                        <Badge className={
                          event.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          event.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }>
                          {event.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <CalendarIcon className="h-4 w-4 text-gray-500" />
                          <span>{format(event.eventDate, 'dd/MM/yyyy')}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>{event.timeSlot}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span>{event.guestCount} guests</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-gray-500" />
                          <span>₹{event.totalAmount}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span>{event.phone}</span>
                        </div>
                        {event.specialRequests && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-600">
                              <strong>Special Requests:</strong> {event.specialRequests}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'blog':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Blog Management</h2>
              <Dialog open={isAddPostDialogOpen} onOpenChange={setIsAddPostDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => { setEditingPost(null); setNewPost({ title: '', excerpt: '', content: '', author:  'Admin', category: '', image: '', featured: false, type: 'article', mediaUrl: '' }); }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Post
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>{editingPost ? 'Edit Blog Post' : 'Add New Blog Post'}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={newPost.title}
                          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                          placeholder="Enter post title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select value={newPost.category} onValueChange={(value) => setNewPost({ ...newPost, category: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {blogCategories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="excerpt">Excerpt</Label>
                      <Textarea
                        id="excerpt"
                        value={newPost.excerpt}
                        onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
                        placeholder="Enter post excerpt"
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label htmlFor="content">Content</Label>
                      <Textarea
                        id="content"
                        value={newPost.content}
                        onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                        placeholder="Enter post content"
                        rows={6}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="image">Image URL (optional)</Label>
                        <Input
                          id="image"
                          value={newPost.image}
                          onChange={(e) => setNewPost({ ...newPost, image: e.target.value })}
                          placeholder="Enter image URL or leave blank"
                        />
                      </div>
                      <div>
                        <Label htmlFor="type">Post Type</Label>
                        <Select value={newPost.type} onValueChange={(value: 'article' | 'video' | 'photo') => setNewPost({ ...newPost, type: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="article">Article</SelectItem>
                            <SelectItem value="video">Video</SelectItem>
                            <SelectItem value="photo">Photo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={newPost.featured}
                        onChange={(e) => setNewPost({ ...newPost, featured: e.target.checked })}
                      />
                      <Label htmlFor="featured">Featured Post</Label>
                    </div>
                  </div>
                  <div className="flex space-x-2 justify-end mt-6">
                    <Button variant="outline" onClick={() => setIsAddPostDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={editingPost ? handleUpdatePost : handleAddPost}
                      disabled={isLoadingImage}
                    >
                      {isLoadingImage ? 'Generating Image...' : editingPost ? 'Update Post' : 'Add Post'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="overflow-hidden">
                    <div className="relative">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 right-2 flex space-x-1">
                        {post.featured && (
                          <Badge className="bg-yellow-100 text-yellow-700">Featured</Badge>
                        )}
                        <Badge variant="outline">{post.type}</Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <h3 className="font-semibold line-clamp-2">{post.title}</h3>
                        <p className="text-gray-600 text-sm line-clamp-2">{post.excerpt}</p>
                        <div className="flex justify-between items-center">
                          <Badge variant="outline">{post.category}</Badge>
                          <span className="text-xs text-gray-500">{post.views} views</span>
                        </div>
                        <div className="flex space-x-2 pt-2">
                          <Button size="sm" variant="outline" onClick={() => handleEditPost(post)}>
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDeletePost(post.id)} className="text-red-600">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'contacts':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Contact Messages</h2>
            <div className="space-y-4">
              {contacts.map((contact) => (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold">{contact.name}</h3>
                          <p className="text-sm text-gray-600">{contact.email} • {contact.phone}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={
                            contact.status === 'new' ? 'bg-blue-100 text-blue-700' :
                            contact.status === 'replied' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-700'
                          }>
                            {contact.status}
                          </Badge>
                          <span className="text-sm text-gray-500">{contact.date}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">{contact.subject}</h4>
                        <p className="text-gray-700">{contact.message}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Analytics Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5" />
                    <span>Sales Overview</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Today's Revenue</span>
                      <span className="font-bold">₹{stats.totalRevenue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Orders</span>
                      <span className="font-bold">{stats.totalOrders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Orders</span>
                      <span className="font-bold">{stats.activeOrders}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Coffee className="h-5 w-5" />
                    <span>Menu Statistics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Items</span>
                      <span className="font-bold">{stats.totalItems}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Available Items</span>
                      <span className="font-bold">{stats.availableItems}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Categories</span>
                      {/* <span className="font-bold">{stats.categories}</span> */}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Events & Content</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Event Bookings</span>
                      <span className="font-bold">{stats.totalEvents}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Blog Posts</span>
                      <span className="font-bold">{stats.totalBlogPosts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>New Contacts</span>
                      <span className="font-bold">{stats.newContacts}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>{confirmationMessage}</p>
            <div className="flex space-x-2 justify-end">
              <Button variant="outline" onClick={() => setShowConfirmation(false)}>
                Cancel
              </Button>
              <Button onClick={executeConfirmation} className="bg-red-600 hover:bg-red-700 text-white">
                Confirm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -280 }}
        animate={{ x: sidebarOpen ? 0 : -288 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed left-0 top-0 h-full w-72 bg-white shadow-xl z-50 border-r border-gray-200"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <Coffee className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Sattvik Kaleva</h1>
              <p className="text-sm text-gray-600">Admin Dashboard</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                  activeSection === item.id
                    ? 'bg-orange-50 text-orange-700 border border-orange-200'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className={`h-5 w-5 ${activeSection === item.id ? item.color : 'text-gray-500'}`} />
                <span className="font-medium">{item.label}</span>
                {activeSection === item.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="ml-auto w-2 h-2 bg-orange-500 rounded-full"
                  />
                )}
              </motion.button>
            );
          })}
        </nav>
      </motion.div>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-0'}`}>
        {/* Header */}
        <motion.header
          initial={{ y: -60 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6"
        >
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2"
            >
              <MenuIcon className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onGoBack}
              className="flex items-center space-x-2"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Button>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </Button>

            <div className="flex items-center space-x-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src="" />
                <AvatarFallback className="bg-orange-100 text-orange-700">
                  { 'A'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium">{'Admin'}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.header>

        {/* Main Content Area */}
        <main className="p-6">
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Alert className="mb-6 border-green-200 bg-green-50">
                <AlertDescription className="text-green-700">{success}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderMainContent()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer */}
        <motion.footer
          initial={{ y: 60 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white border-t border-gray-200 p-4 text-center"
        >
          <p className="text-sm text-gray-600">
            Developed By <span className="font-semibold text-orange-600">Tsrijanali Food and Services Pvt. Ltd.</span>
          </p>
        </motion.footer>
      </div>
    </div>
  );
}