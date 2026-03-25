"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { OrderTracking } from "../../../../../../components/OrderTracking";
import { Loader2 } from "lucide-react";

export default function OrderTrackingPage() {
  const router = useRouter();
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const completedOrder = localStorage.getItem('completedOrder');
    if (completedOrder) {
      try {
        const order = JSON.parse(completedOrder);
        if (order._id) {
          setOrderId(order._id);
        } else if (order.id) {
           setOrderId(order.id);
        }
      } catch (e) {
        console.error("Failed to parse order from localStorage", e);
      }
    }
  }, []);

  const handleGoBack = () => {
    router.push('/menu');
  };

  if (!orderId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
         <Loader2 className="w-12 h-12 text-orange-600 animate-spin mb-4" />
         <p className="text-gray-500 font-bold tracking-widest text-sm">Identifying your order...</p>
      </div>
    );
  }

  return <OrderTracking orderId={orderId} onGoBack={handleGoBack} />;
}
