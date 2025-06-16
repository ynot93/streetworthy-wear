import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import productService, { Product } from '../services/productService';
import { useAuth } from '../context/AuthContext';

function AdminProductCreatePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();

  useEffect(() => {
    // Redirect if not logged in or not an admin
    if (!isLoggedIn || user?.role !== 'admin') {
      navigate('/');
      return;
    }
  }, [isLoggedIn, user, navigate]);

  const handleCreate = async (productData: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);
    try {
      await productService.createProduct(productData);
      alert('Product created successfully!');
      navigate('/admin/products'); // Redirect to product list after creation
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to create product.');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn || user?.role !== 'admin') {
    return null; // Will be redirected by useEffect
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl bg-white rounded-lg shadow-md my-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Create Product</h1>
      <ProductForm onSubmit={handleCreate} loading={loading} error={error} />
    </div>
  );
}

export default AdminProductCreatePage;