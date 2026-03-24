"use client";
import { useRouter } from "next/navigation";
import { OrderTracking } from "../../../../../../components/OrderTracking"

export default function OrderTrackingPage() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const orderId = "SATT-12345"; // Replace with real order ID from API or mock data

  return <OrderTracking orderId={orderId} onGoBack={handleGoBack} />;
}
