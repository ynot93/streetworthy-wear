import api from './api';
import { ApiResponse } from './api';
import { CartItem } from '../context/CartContext';

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

const cartService = {
  getCart: async () => {
    const response = await api.get<ApiResponse<Cart>>('/cart');
    return response.data.data;
  },

  addItemToCart: async (productId: string, quantity: number) => {
    const response = await api.post<ApiResponse<Cart>>('/cart/add', { productId, quantity });
    return response.data.data;
  },

  updateCartItemQuantity: async (productId: string, quantity: number) => {
    const response = await api.put<ApiResponse<Cart>>(`/cart/update/${productId}`, { quantity });
    return response.data.data;
  },

  removeItemFromCart: async (productId: string) => {
    const response = await api.delete<ApiResponse<Cart>>(`/cart/remove/${productId}`);
    return response.data.data;
  },

  clearCart: async () => {
    const response = await api.delete<ApiResponse<Cart>>('/cart/clear');
    return response.data.data;
  },
};

export default cartService;