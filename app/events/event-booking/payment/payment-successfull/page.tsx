"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from "next/navigation";
import { withAuth } from "@/components/withAuth";
import { EventPaymentSuccess } from "@/components/EventPaymentSuccess";
import { Loader2, AlertCircle } from "lucide-react";

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simulated payment data (in a real app, this would come from the backend or redirect params)
  const [paymentData] = useState({
    transactionId: `TXN${Date.now()}`,
    paymentMethod: "Online Payment",
    amount: 0, // Will be updated once booking is fetched
    status: "Success",
    timestamp: new Date().toISOString(),
    bookingId: bookingId || ""
  });

  useEffect(() => {
    if (bookingId) {
      fetchBooking();
    } else {
      setLoading(false);
      setError("Payment verification failed: No booking ID found.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `http://localhost:5000/api/events/booking/${bookingId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setBooking(data);
        return;
      }

      // ARCHIVE FALLBACK: Try loading from local storage if API fails
      console.warn("API Archive unreachable. Attempting Local Registry Fetch...");
      const localData = localStorage.getItem(`booking_${bookingId}`);
      if (localData) {
        setBooking(JSON.parse(localData));
      } else {
        throw new Error("Celebration Record not found in local or remote archives.");
      }
    } catch (err: any) {
      console.error("Archive retrieval failure:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReceipt = () => {
    // Generate a professional bill PDF layout
    const originalTitle = document.title;
    document.title = `BILL-INV-${bookingId?.toUpperCase()}`;
    window.print();
    document.title = originalTitle;
  };

  const handleGoHome = () => {
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[#F8F9FB]">
        <Loader2 className="h-12 w-12 animate-spin text-green-600" />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] italic">Verifying Celebration Protocol...</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB] p-8">
        <div className="max-w-md w-full bg-white rounded-[3rem] p-12 shadow-2xl text-center space-y-6">
           <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
           <h2 className="text-2xl font-black italic">Verification Error</h2>
           <p className="text-gray-500">{error || "Critical failure in receipt generation."}</p>
           <button onClick={() => router.push("/")} className="w-full h-14 bg-gray-950 text-white rounded-xl font-bold uppercase tracking-widest text-[10px]">Return to Base</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      <EventPaymentSuccess
        booking={booking}
        paymentData={{ ...paymentData, amount: booking.advanceAmount }}
        onDownloadReceipt={handleDownloadReceipt}
        onGoHome={handleGoHome}
      />
    </div>
  );
}

function PaymentSuccessPage() {
  return (
    <Suspense fallback={
       <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Loader2 className="h-10 w-10 animate-spin text-green-500" />
       </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}

export default withAuth(PaymentSuccessPage);
