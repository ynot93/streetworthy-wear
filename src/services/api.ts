import axios from 'axios';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Get the base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create an Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // This is crucial for sending/receiving HTTP-only cookies
});

// You can add request/response interceptors here later for things like:
// - Attaching JWT token from local storage (if not using httpOnly cookies)
// - Refreshing tokens
// - Handling global errors

export default api;