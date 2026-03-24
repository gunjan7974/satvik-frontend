"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { withAuth } from "@/components/withAuth";
// import { EventPaymentSuccess } from "@/components/EventPaymentSucces";

function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  const handleViewReceipt = () => {
    router.push(`/events/event-booking/payment/payment-successful/receipt?bookingId=${bookingId}`);
  };

  const handleBackToHome = () => {
    router.push("/");
  };

  if (!bookingId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Invalid booking ID</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <EventPaymentSuccess
        bookingId={bookingId}
        onViewReceipt={handleViewReceipt}
        onBackToHome={handleBackToHome}
      /> */}
    </div>
  );
}

export default withAuth(PaymentSuccessPage);
