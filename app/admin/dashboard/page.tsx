'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { Loader2 } from 'lucide-react';
import AnimatedDashboard from '@/components/AdminPanel';

// Mock initial data
const initialMenuItems = [
  {
    id: 1,
    name: "Special Sattvik Thali",
    description: "A complete meal with dal, rice, vegetables, roti, and dessert",
    price: 250,
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "Thali",
    isVeg: true,
    isAvailable: true
  }
];

const initialBlogPosts = [
  {
    id: 1,
    title: "The Art of Sattvik Cooking",
    excerpt: "Discover the traditional methods of preparing pure vegetarian food",
    content: "Full content about Sattvik cooking traditions...",
    author: "Admin",
    date: "2024-12-20",
    category: "Food Specialties",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    views: 150,
    featured: true,
    type: "article"
  }
];

export default function AdminPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menusRes, blogRes] = await Promise.all([
          apiClient.getMenus({ page: 1, limit: 100 }),
          apiClient.getBlogPosts()
        ]);

        if (menusRes && (menusRes as any).menus) {
          setMenuItems((menusRes as any).menus.map((m: any) => ({
            id: m._id,
            name: m.title || m.name,
            description: m.description,
            price: m.price,
            image: m.image ? (m.image.startsWith('http') ? m.image : `http://localhost:5000${m.image}`) : "https://placehold.co/800x600?text=Menu",
            category: m.category?.title || m.category || 'General',
            isVeg: m.isVeg !== undefined ? m.isVeg : true,
            isAvailable: m.isAvailable !== false
          })));
        }

        if (blogRes && Array.isArray(blogRes)) {
          setBlogPosts(blogRes.map((p: any) => ({
            id: p._id,
            title: p.title,
            excerpt: p.excerpt,
            content: p.content,
            author: p.author,
            date: p.createdAt,
            category: p.category,
            image: p.image ? (p.image.startsWith('http') ? p.image : `http://localhost:5000${p.image}`) : "https://placehold.co/800x600?text=Blog",
            views: p.views || 0,
            featured: p.featured || false,
            type: p.type || 'article'
          })));
        }
      } catch (error) {
        console.error("Failed to fetch admin dashboard data", error);
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleUpdateMenuItems = (items: typeof initialMenuItems) => {
    setMenuItems(items);
  };

  const handleUpdateBlogPosts = (posts: typeof initialBlogPosts) => {
    setBlogPosts(posts);
  };

  const handleGoBack = () => {
    router.push('/');
  };

  return (
    <AnimatedDashboard
      menuItems={menuItems}
      blogPosts={blogPosts}
      onUpdateMenuItems={handleUpdateMenuItems}
      onUpdateBlogPosts={handleUpdateBlogPosts}
      onGoBack={handleGoBack}
    />
  );
}