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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [eventsRes, menusRes] = await Promise.all([
          apiClient.getEventBookings(),
          apiClient.getMenus({ page: 1, limit: 6 })
        ]);

        // Map events
        const mappedEvents = eventsRes.map((e: any) => ({
          id: e._id,
          title: e.title,
          date: e.date || 'Book Now',
          time: e.time || '',
          category: e.category || 'Celebration',
          guests: `${e.maxAttendees || 100}+ Guests`,
          image: e.image ? `http://localhost:5000${e.image}` : "https://via.placeholder.com/800x600?text=Event",
          price: `From ₹${e.price || 0}`,
          featured: e.featured || false
        }));

        // Map menus
        const mappedMenus = ((menusRes as any).menus || []).map((m: any) => ({
          id: m._id,
          name: m.title,
          cuisine: m.category ? (m.category.title || m.category) : 'Pure Vegetarian',
          rating: 4.8, // Static for now as no reviews in backend yet
          reviews: '2.4k',
          deliveryTime: '20-30 mins',
          distance: '1.2 km',
          image: m.image ? `http://localhost:5000${m.image}` : "https://via.placeholder.com/800x600?text=Menu",
          offer: m.price < 100 ? 'Budget Friendly' : null,
          featured: m.isAvailable
        }));

        setEvents(mappedEvents.slice(0, 3));
        setMenus(mappedMenus.slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch home data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const goToSearch = (query: string = "") => {
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    } else {
      router.push('/search');
    }
  };

  const goToRestaurant = () => {
    router.push('/menu');
  };

  const goToEventListing = () => {
    router.push('/events');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white">
        <Loader2 className="h-12 w-12 animate-spin text-orange-600" />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Sattvik Kaleva Loading...</p>
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
        liveEvents={events}
        liveMenus={menus}
      />
    </ClientLayout>
  );
}