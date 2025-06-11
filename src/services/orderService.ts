import api from './api';
import { ApiResponse } from './api';

// Define interfaces for order related data (matching backend models)
export interface OrderItem {
  product: string; // Product ID
  name: string;
  imageUrl: string;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface PaymentResult {
  id: string;
  status: string;
  update_time: string;
  email_address?: string;
}

export interface Order {
  _id: string;
  user: string; // User ID
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentResult?: PaymentResult;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string; // Date string
  isDelivered: boolean;
  deliveredAt?: string; // Date string
  orderStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
  updatedAt: string;
}

const orderService = {
  createOrder: async (orderData: {
    orderItems: OrderItem[];
    shippingAddress: ShippingAddress;
    paymentMethod: string;
    taxPrice: number;
    shippingPrice: number;
    totalPrice: number;
  }): Promise<Order> => {
    const response = await api.post<ApiResponse<Order>>('/orders', orderData);
    return response.data.data;
  },

  getOrderById: async (id: string): Promise<Order> => {
    const response = await api.get<ApiResponse<Order>>(`/orders/${id}`);
    return response.data.data;
  },

  payOrder: async (orderId: string, paymentResult: Omit<PaymentResult, 'update_time'>): Promise<Order> => {
    // We'll simulate `update_time` and `email_address` on the backend if not provided fully.
    const response = await api.put<ApiResponse<Order>>(`/orders/${orderId}/pay`, paymentResult);
    return response.data.data;
  },

  getMyOrders: async (): Promise<Order[]> => {
    const response = await api.get<ApiResponse<Order[]>>('/orders/myorders');
    return response.data.data;
  },

  // Admin only (for later if you build an admin dashboard)
  getAllOrders: async (): Promise<Order[]> => {
    const response = await api.get<ApiResponse<Order[]>>('/orders');
    return response.data.data;
  },

  deliverOrder: async (orderId: string): Promise<Order> => {
    const response = await api.put<ApiResponse<Order>>(`/orders/${orderId}/deliver`);
    return response.data.data;
  }
};

export default orderService;