import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import productService, { Product } from '../services/productService';

function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAllProducts();
        setProducts(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-xl font-semibold">Loading products...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-600 text-lg">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Our Products</h1>
      {products.length === 0 ? (
        <p className="text-center text-gray-600">No products available. Please add some from the backend.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product._id} className="border rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 bg-white">
              <Link to={`/products/${product._id}`}>
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              </Link>
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2 truncate">
                  <Link to={`/products/${product._id}`} className="hover:text-blue-600">
                    {product.name}
                  </Link>
                </h2>
                <p className="text-gray-600 text-sm mb-2">{product.category}</p>
                <p className="text-gray-700 text-lg font-bold">${product.price.toFixed(2)}</p>
                <p className="text-gray-500 text-sm mt-2">In Stock: {product.stock}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductListPage;