"use client";

// import React, { useEffect, useState } from 'react';
// import { useRouter, useSearchParams } from "next/navigation";
import { withAuth } from "@/components/withAuth";

function EventPaymentPage() {
  // const router = useRouter();
  // const searchParams = useSearchParams();
  // const bookingId = searchParams.get("bookingId");

  // const handlePaymentSuccess = () => {
  //   router.push(`/events/event-booking/payment/payment-successful?bookingId=${bookingId}`);
  // };

  // if (!bookingId) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <p className="text-red-600">Invalid booking ID</p>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <EventPaymentWrapper bookingId={bookingId} onPaymentSuccess={handlePaymentSuccess} /> */}
    </div>
  );
}

export default withAuth(EventPaymentPage);

// interface EventPaymentProps {
//   bookingId: string;
//   onPaymentSuccess: () => void;
// }

// export function EventPaymentWrapper({ bookingId, onPaymentSuccess }: EventPaymentProps) {
//   const [booking, setBooking] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchBooking();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [bookingId]);

//   const fetchBooking = async () => {
//     try {
//       const response = await fetch(
//         `http://localhost:5000/api/events/booking/${bookingId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
//           },
//         }
//       );

//       if (!response.ok) throw new Error("Failed to fetch booking");

//       const data = await response.json();
//       setBooking(data);
//     } catch (error) {
//       console.error("Fetch error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePayment = async (paymentDetails: any) => {
//     try {
//       const response = await fetch(
//         `http://localhost:5000/api/events/booking/${bookingId}/payment`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
//           },
//           body: JSON.stringify(paymentDetails),
//         }
//       );

//       if (!response.ok) throw new Error("Payment failed");

//       onPaymentSuccess();
//     } catch (error) {
//       console.error("Payment error:", error);
//     }
//   };

//   return (
//     <div className="p-6">
//       {loading ? (
//         <p>Loading booking...</p>
//       ) : booking ? (
//         <div>
//           <h3 className="text-lg font-bold">Pay for booking #{bookingId}</h3>
//           <p className="text-sm text-gray-600">Amount: ₹{booking.totalAmount || '—'}</p>
//           <button onClick={() => handlePayment({ amount: booking.totalAmount || 0 })} className="mt-4 px-4 py-2 bg-orange-600 text-white rounded">Pay</button>
//         </div>
//       ) : (
//         <p className="text-red-600">Booking not found</p>
//       )}
//     </div>
//   );
// }