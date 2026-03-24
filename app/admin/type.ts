export interface MenuItem {
  // backend uses string _id for items; frontend admin UI may also use numeric ids for demo items
  id: string | number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  // optional backend category id
  categoryId?: string;
  // optional backend document id from server
  serverId?: string;
  isVeg: boolean;
  isAvailable: boolean;
}

export interface BlogPost {
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

export interface EventBooking {
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

export interface Order {
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

export interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  status: 'new' | 'replied' | 'closed';
}

export interface Stats {
  totalItems: number;
  availableItems: number;
  categories: number;
  totalEvents: number;
  pendingEvents: number;
  confirmedEvents: number;
  totalBlogPosts: number;
  featuredPosts: number;
  totalOrders: number;
  activeOrders: number;
  newContacts: number;
  totalRevenue: number;
}