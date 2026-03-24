"use client";

import { EventReceiptPDF } from "@/components/EventReceiptPDF";
import { useRouter, useSearchParams } from "next/navigation";
import { withAuth } from "@/components/withAuth";

function ReceiptPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  const handleBack = () => {
    router.back();
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
      {/* <EventReceiptPDF
        bookingId={bookingId}
        onBack={handleBack}
      /> */}
    </div>
  );
}

export default withAuth(ReceiptPage);