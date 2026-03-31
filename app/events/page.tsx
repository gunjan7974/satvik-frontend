"use client";

import { useState, useEffect } from "react";
import { EventListing } from "../../components/Events";
import { EventDetail } from "../../components/EventDetail";
import { EventBooking } from "../../components/EventBooking";
import { useRouter, useSearchParams } from "next/navigation";
import { apiClient } from "../../lib/api";
import { Loader2 } from "lucide-react";
import ClientLayout from "../client-layout";

export default function EventsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"listing" | "details" | "booking">("listing");
  const [selectedEventId, setSelectedEventId] = useState<string | number | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await apiClient.getEventTypes();
        const mappedEvents = data.map((e: any) => {
          const name = e.name || e.title || "";
          let category = 'Celebration';
          if (name.toLowerCase().includes('wedding')) category = 'Wedding';
          else if (name.toLowerCase().includes('corporate')) category = 'Corporate';
          else if (name.toLowerCase().includes('birthday')) category = 'Birthday';
          else if (name.toLowerCase().includes('festival') || name.toLowerCase().includes('navratri')) category = 'Festival';
          else if (name.toLowerCase().includes('party')) category = 'Birthday';

          let imageUrl = e.image;
          const backendUrl = "http://localhost:5000";
          if (imageUrl && !imageUrl.startsWith('http')) {
            imageUrl = `${backendUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
          }

          if (!imageUrl || imageUrl.includes('placeholder') || imageUrl === backendUrl) {
            if (category === 'Wedding') imageUrl = "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600";
            else if (category === 'Corporate') imageUrl = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600";
            else if (category === 'Birthday') imageUrl = "https://images.unsplash.com/photo-1530103043960-ef38714abb15?w=600";
            else if (category === 'Festival') imageUrl = "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600";
            else imageUrl = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600";
          }

          return {
            id: e._id,
            name: name,
            date: 'Available Now',
            time: 'Flexible Timing',
            location: 'Sattvik Kaleva',
            attendees: 0,
            maxAttendees: 500,
            price: e.basePrice || e.price || 0,
            category: category,
            image: imageUrl,
            description: e.description || `Special ${name} package at Sattvik Kaleva.`,
            tags: e.tags || ['Premium', 'Pure Veg', 'Customizable'],
            organizer: "Sattvik Events"
          };
        });
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
    setSelectedEventId(eventId);
    setView("details");
  };

  const handleBookNow = () => {
    setView("booking");
  };

  const handleBookingSubmit = (bookingData: any) => {
    console.log("Booking submitted:", bookingData);
    router.push("/events/event-booking/payment");
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
    <ClientLayout>
      <div className="min-h-screen bg-gray-50">
        {view === "listing" && (
          <EventListing 
            onEventClick={handleEventClick as any} 
            onBack={() => router.push("/")} 
            externalEvents={events}
          />
        )}

        {view === "details" && selectedEventId && (
          <EventDetail 
            eventId={selectedEventId as any} 
            onBack={() => setView("listing")}
            onBookNow={handleBookNow}
          />
        )}

        {view === "booking" && (
          <EventBooking 
            onGoBack={() => setView("details")}
            onBookingSubmit={handleBookingSubmit}
          />
        )}
      </div>
    </ClientLayout>
  );
}