// frontend/types/cart.ts
export interface CartItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
}

export interface OrderDetails {
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  deliveryInfo: {
    type: 'delivery' | 'pickup';
    address?: string;
    landmark?: string;
    city: string;
    pincode?: string;
  };
  paymentInfo: {
    method: 'cod' | 'online';
    status: 'pending' | 'completed' | 'failed';
    transactionId?: string;
  };
  items: CartItem[];
  totalAmount: number;
  tax: number;
  deliveryFee: number;
  finalAmount: number;
  instructions?: string;
  orderId?: string;
  orderDate?: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered';
}