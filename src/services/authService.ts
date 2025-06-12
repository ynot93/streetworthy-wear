import api from './api';
import { ApiResponse } from './api';

export interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface UserData {
  _id: string;
  username: string;
  email: string;
  password?: string;
  role: 'customer' | 'admin';
  shippingAddress?: ShippingAddress;
}

const authService = {
  register: async (username: string, email: string, password: string, role: 'customer' | 'admin') => {
    const response = await api.post('/auth/register', { username, email, password, role });
    // The backend sets the JWT as an HTTP-only cookie, so we don't need to store it manually here.
    // If you were returning the token in the response body, you'd save it here (e.g., localStorage.setItem('token', response.data.token)).
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    // The backend sets the JWT as an HTTP-only cookie.
    return response.data;
  },

  // Example of getting user profile (requires being logged in)
  getMe: async () => {
    // Axios will automatically send the HTTP-only cookie if it's present and `withCredentials: true` is set.
    const response = await api.get<ApiResponse<UserData>>('/auth/me');
    return response.data.data;
  },

  logout: async () => {
    const response = await api.get('/auth/logout');
    // The backend clears the cookie. No client-side action needed for cookie-based logout.
    return response.data;
  },
};

export default authService;