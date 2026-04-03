'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ClientLayout from './client-layout';
import { apiClient } from '../lib/api';
import { HomePage } from '@/components/HomePage';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [menus, setMenus] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [eventsRes, menusRes, galleryRes, blogsRes] = await Promise.all([
          apiClient.getEventTypes(),
          apiClient.getMenus({ page: 1, limit: 6 }),
          apiClient.getGallery(),
          apiClient.getBlogs()
        ]);

        // Map event types to display on home
        const mappedEvents = eventsRes.map((e: any) => {
          const name = e.name || 'Event';
          const backendUrl = "http://localhost:5000";
          let imageUrl = e.image;
          
          if (imageUrl && !imageUrl.startsWith('http')) {
            imageUrl = `${backendUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
          }

          if (!imageUrl || imageUrl.includes('placeholder') || imageUrl === backendUrl) {
            imageUrl = name.toLowerCase().includes('wedding') ? "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1000" :
                       name.toLowerCase().includes('birthday') ? "https://images.unsplash.com/photo-1464349172961-10af6abc7e1e?q=80&w=1000" :
                       name.toLowerCase().includes('corporate') ? "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1000" :
                       "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1000";
          }

          return {
            id: e._id,
            title: name,
            date: 'Book Now',
            time: 'Available Anytime',
            category: 'Event Category',
            guests: 'Flexible',
            image: imageUrl,
            price: `Starting ₹${e.basePrice || 0}`,
            featured: true
          }
        });

        // Map menus
        const mappedMenus = ((menusRes as any).menus || []).map((m: any) => ({
          id: m._id,
          name: m.title,
          cuisine: m.category ? (m.category.title || m.category) : 'Pure Vegetarian',
          rating: 4.8, 
          reviews: '2.4k',
          deliveryTime: '20-30 mins',
          distance: '1.2 km',
          image: m.image ? `http://localhost:5000${m.image}` : "https://placehold.co/800x600?text=Menu",
          offer: m.price < 100 ? 'Budget Friendly' : null,
          featured: m.isAvailable
        }));

        // Map Gallery
        const mappedGallery = (galleryRes || []).map((g: any) => ({
          id: g._id,
          src: g.image ? `http://localhost:5000${g.image}` : "https://placehold.co/800x600?text=Gallery",
          alt: g.title || 'Sattvik Kaleva Gallery'
        }));

        // Map Blogs
        const mappedBlogs = (blogsRes || []).map((b: any) => ({
          id: b._id,
          title: b.title,
          excerpt: b.excerpt,
          image: b.image ? `http://localhost:5000${b.image}` : "https://placehold.co/800x600?text=Blog",
          author: b.author || 'Admin',
          category: b.category || 'Restaurant',
          date: b.createdAt || b.date || new Date().toISOString(),
          views: b.views || 0,
          featured: b.featured,
          type: b.type || 'article'
        }));

        setEvents(mappedEvents.slice(0, 3));
        setMenus(mappedMenus.slice(0, 5));
        setGallery(mappedGallery);
        setBlogs(mappedBlogs);
      } catch (error) {
        console.error("Failed to fetch home data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const goToSearch = (query: string = "") => {
    setIsTransitioning(true);
    setTimeout(() => {
      if (query) {
        router.push(`/search?q=${encodeURIComponent(query)}`);
      } else {
        router.push('/search');
      }
    }, 50);
  };

  const goToRestaurant = () => {
    setIsTransitioning(true);
    setTimeout(() => router.push('/menu'), 50);
  };

  const goToEventListing = () => {
    setIsTransitioning(true);
    setTimeout(() => router.push('/events'), 50);
  };

  if (loading || isTransitioning) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white/70 backdrop-blur-md fixed inset-0 z-[100]">
        <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin shadow-xl"></div>
        <p className="mt-4 text-orange-600 font-bold tracking-widest uppercase text-sm">
          {isTransitioning ? "Navigating..." : "Sattvik Kaleva Loading..."}
        </p>
      </div>
    );
  }

  return (
    <ClientLayout>
      <HomePage 
        onOrderFoodClick={goToRestaurant}
        onExploreEventsClick={goToEventListing}
        onSearchClick={goToSearch}
        onRestaurantClick={goToRestaurant}
        onViewGallery={() => router.push('/gallery')}
        onBlogClick={(id) => router.push(`/blog?id=${id}`)}
        liveEvents={events}
        liveMenus={menus}
        liveGallery={gallery}
        liveBlogs={blogs}
      />
    </ClientLayout>
  );
}