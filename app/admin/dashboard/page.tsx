'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
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
  const [menuItems, setMenuItems] = useState(initialMenuItems);
  const [blogPosts, setBlogPosts] = useState(initialBlogPosts);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

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
   <>
   </>
  );
}