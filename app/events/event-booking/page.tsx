"use client";

import { EventBooking } from "@/components/EventBooking";
import { useRouter } from "next/navigation";
import { withAuth } from "@/components/withAuth";

function EventBookingPage() {
  const router = useRouter();

  const handleBookingSuccess = (bookingId: string) => {
    router.push(`/events/event-booking/payment?bookingId=${bookingId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <EventBooking onBookingSuccess={handleBookingSuccess} /> */}
    </div>
  );
}

export default withAuth(EventBookingPage);
