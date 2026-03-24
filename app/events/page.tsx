'use client'

import { EventListing } from "@/components/Events";
import { useRouter } from "next/navigation";

export default function EventsPage() {
  const router = useRouter();
  
  const handleEventClick = (eventId: number) => {
    // Navigate to event booking page with the event ID
    router.push(`/events/event-booking?eventId=${eventId}`);
  };

  const handleBack = () => {
    router.back(); // Go back to previous page
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <EventListing 
        onEventClick={handleEventClick} 
        onBack={handleBack} 
      />
    </div>
  );
}