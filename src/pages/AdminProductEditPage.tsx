import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import productService, { Product } from '../services/productService';
import { useAuth } from '../context/AuthContext';

function AdminProductEditPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false); // For form submission loading
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();

  useEffect(() => {
    // Redirect if not logged in or not an admin
    if (!isLoggedIn || user?.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchProduct = async () => {
      if (!id) {
        setError('Product ID is missing.');
        setLoading(false);
        return;
      }
      try {
        const data = await productService.getProductById(id);
        setProduct(data);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch product details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, isLoggedIn, user, navigate]);

  const handleUpdate = async (productData: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>) => {
    if (!id) return; // Should not happen if page is rendered correctly
    setSubmitting(true);
    setError(null);
    try {
      await productService.updateProduct(id, productData);
      alert('Product updated successfully!');
      navigate('/admin/products'); // Redirect to product list after update
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to update product.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isLoggedIn || user?.role !== 'admin') {
    return null; // Will be redirected by useEffect
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-xl font-semibold">Loading product for edit...</div>;
  }

  if (error && !product) { // Only show error if product couldn't be loaded
    return <div className="flex justify-center items-center h-screen text-red-600 text-lg">{error}</div>;
  }

  if (!product) {
    return <div className="flex justify-center items-center h-screen text-gray-600 text-lg">Product not found.</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl bg-white rounded-lg shadow-md my-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Edit Product</h1>
      <ProductForm
        initialData={product}
        onSubmit={handleUpdate}
        loading={submitting}
        error={error}
      />
    </div>
  );
}

export default AdminProductEditPage;