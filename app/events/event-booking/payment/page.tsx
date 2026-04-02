"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from "next/navigation";
import { withAuth } from "@/components/withAuth";
import { EventPayment } from "@/components/EventPayment";
import { Loader2, AlertCircle } from "lucide-react";
import { apiClient } from "@/lib/api";

function EventPaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (bookingId) {
      fetchBooking();
    } else {
      setLoading(false);
      setError("No booking ID provided in the terminal link.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      setError(null);
      // Attempting Galactic Archive Sync...
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
      const localData = typeof window !== "undefined" ? localStorage.getItem(`booking_${bookingId}`) : null;
      if (localData) {
        setBooking(JSON.parse(localData));
      } else {
        if (response.status === 404) throw new Error("Booking not found in our archive.");
        throw new Error("Failed to synchronize with event database.");
      }
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message || "An unexpected error occurred during synchronization.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (paymentData: any) => {
    // Redirect to the success page with the bookingId
    router.push(`/events/event-booking/payment/payment-successfull?bookingId=${bookingId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[#F8F9FB]">
        <div className="relative">
          <div className="absolute -inset-4 bg-orange-100 rounded-full blur-xl animate-pulse" />
          <Loader2 className="h-12 w-12 animate-spin text-orange-600 relative z-10" />
        </div>
        <div className="text-center">
           <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-[10px] mb-1 italic">Gastronomic Sync</p>
           <h3 className="text-xl font-bold text-gray-900 italic uppercase tracking-tighter">Retrieving Booking Data...</h3>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB] p-8">
        <div className="max-w-md w-full bg-white rounded-[3rem] p-12 shadow-2xl border border-red-50 text-center space-y-8">
           <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-10 h-10 text-red-500" />
           </div>
           <div className="space-y-2">
              <p className="text-red-500 font-black uppercase tracking-[0.3em] text-[10px] italic">Protocol Error</p>
              <h2 className="text-3xl font-black text-gray-950 uppercase italic tracking-tighter leading-none">Access Denied</h2>
              <p className="text-gray-400 font-medium italic text-sm">{error || "The requested booking module is inaccessible."}</p>
           </div>
           <button 
             onClick={() => router.push("/events")} 
             className="w-full h-16 bg-gray-950 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] italic hover:bg-orange-600 transition-all shadow-xl shadow-gray-200"
           >
              Back to Events Hub
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] font-sans">
      <EventPayment 
        booking={booking} 
        onGoBack={() => router.back()} 
        onPaymentSuccess={handlePaymentSuccess} 
      />
    </div>
  );
}

function EventPaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
      </div>
    }>
      <EventPaymentContent />
    </Suspense>
  );
}

export default withAuth(EventPaymentPage);