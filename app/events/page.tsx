"use client";

import { useState, useEffect } from "react";
import { EventListing } from "../../components/Events";
import { useRouter } from "next/navigation";
import { apiClient } from "../../lib/api";
import { Loader2 } from "lucide-react";

export default function EventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await apiClient.getEventTypes(); // This returns all available event categories
        const mappedEvents = data.map((e: any) => ({
          id: e._id,
          name: e.name || e.title,
          date: 'Available Now',
          dateObj: new Date(),
          time: 'Flexible Timing',
          location: 'Sattvik Kaleva',
          attendees: 0,
          maxAttendees: 500,
          price: e.basePrice || e.price || 0,
          category: 'Celebration',
          image: e.image ? `http://localhost:5000${e.image}` : "https://via.placeholder.com/600x400?text=Event",
          description: e.description || `Special ${e.name} package at Sattvik Kaleva.`,
          tags: e.tags || ['Premium', 'Pure Veg', 'Customizable'],
          organizer: "Sattvik Events"
        }));
        setEvents(mappedEvents);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleEventClick = (eventId: string | number) => {
    router.push(`/events/event-booking?eventId=${eventId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
        <p className="text-gray-500 font-medium">Setting up celebrations...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <EventListing 
        onEventClick={handleEventClick as any} 
        onBack={() => router.back()} 
        externalEvents={events} // Pass the live data
      />
    </div>
  );
}