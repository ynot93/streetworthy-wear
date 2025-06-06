import api from './api';
import { ApiResponse } from './api';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  brand?: string;
  stock: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

const productService = {
  getAllProducts: async (): Promise<Product[]> => {
    try {
      const response = await api.get<ApiResponse<Product[]>>('/products');
      return response.data.data; // Backend response has a 'data' key
    } catch (error) {
      console.error("Error fetching all products:", error);
      throw error;
    }
  },

  getProductById: async (id: string): Promise<Product> => {
    try {
      const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
      return response.data.data; // Backend response has a 'data' key
    } catch (error) {
      console.error(`Error fetching product with ID ${id}:`, error);
      throw error;
    }
  },

  // Admin only methods (will be used later, but included for completeness)
  createProduct: async (productData: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    try {
      const response = await api.post<ApiResponse<Product>>('/products', productData);
      return response.data.data;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  },

  updateProduct: async (id: string, productData: Partial<Omit<Product, '_id' | 'createdAt' | 'updatedAt'>>): Promise<Product> => {
    try {
      const response = await api.put<ApiResponse<Product>>(`/products/${id}`, productData);
      return response.data.data;
    } catch (error) {
      console.error(`Error updating product with ID ${id}:`, error);
      throw error;
    }
  },

  deleteProduct: async (id: string): Promise<{ message: string }> => {
    try {
      const response = await api.delete<{ success: boolean, message: string }>(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting product with ID ${id}:`, error);
      throw error;
    }
  },
};

export default productService;