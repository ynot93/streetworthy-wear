import api from './api';
import { ApiResponse } from './api';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  stock: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

// Define the type for data sent to create/update
// It can either have an imageUrl (string) or an imageFile (File)
export interface ProductDataForApi {
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  stock: number;
  imageUrl?: string; // Optional if imageFile is provided
  imageFile?: File | null; // Optional for upload
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
  createProduct: async (productData: ProductDataForApi): Promise<Product> => {
    try {
      const formData = new FormData();
      formData.append('name', productData.name);
      formData.append('description', productData.description);
      formData.append('price', productData.price.toString());
      formData.append('category', productData.category);
      formData.append('brand', productData.brand);
      formData.append('stock', productData.stock.toString());

      if (productData.imageFile) {
        formData.append('image', productData.imageFile); // 'image' is the field name expected by Multer
      } else if (productData.imageUrl) {
        formData.append('imageUrl', productData.imageUrl);
      }
      const response = await api.post<ApiResponse<Product>>('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Important for file uploads
      },
    });
      return response.data.data;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  },

  updateProduct: async (id: string, productData: ProductDataForApi): Promise<Product> => {
    try {
      const formData = new FormData();
      formData.append('name', productData.name);
      formData.append('description', productData.description);
      formData.append('price', productData.price.toString());
      formData.append('category', productData.category);
      formData.append('brand', productData.brand);
      formData.append('stock', productData.stock.toString());

      if (productData.imageFile) {
        formData.append('image', productData.imageFile); // 'image' is the field name expected by Multer
      } else if (productData.imageUrl) {
        formData.append('imageUrl', productData.imageUrl);
      }

      const response = await api.put<ApiResponse<Product>>(`/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important for file uploads
        },
      });
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