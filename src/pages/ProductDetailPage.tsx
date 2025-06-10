import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import productService, { Product } from '../services/productService';
import { useCart } from '../context/CartContext';

function ProductDetailPage() {
  const { id } = useParams<{ id: string }>(); // Get product ID from URL params
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1); // Default quantity
  const { addItemToCart } = useCart();

  useEffect(() => {
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
  }, [id]); // Re-fetch if ID changes

  const handleAddToCart = () => {
    if (product) {
      addItemToCart(product, quantity); // Use the addItemToCart function from the context
      alert(`${quantity} ${product.name}(s) added to cart!`);
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-xl font-semibold">Loading product details...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-600 text-lg">{error}</div>;
  }

  if (!product) {
    return <div className="flex justify-center items-center h-screen text-gray-600 text-lg">Product not found.</div>;
  }

  return (
    <div className="container mx-auto p-6 md:p-8 lg:p-12">
      <div className="flex flex-col lg:flex-row bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="lg:w-1/2">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-80 object-cover lg:h-full"
          />
        </div>
        <div className="lg:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{product.name}</h1>
            <p className="text-gray-600 text-lg mb-2">{product.category} {product.brand && ` • ${product.brand}`}</p>
            <p className="text-gray-800 text-2xl font-bold mb-4">${product.price.toFixed(2)}</p>
            <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>
          </div>
          <div className="mt-auto">
            {product.stock > 0 ? (
              <p className="text-green-600 font-semibold mb-4">In Stock: {product.stock}</p>
            ) : (
              <p className="text-red-600 font-semibold mb-4">Out of Stock</p>
            )}
            <div className="flex items-center mb-4">
              <label htmlFor="quantity" className="mr-2 font-semibold">Quantity:</label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))} // Ensure quantity is at least 1
                min="1"
                max={product.stock}
                className="w-20 border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      <div className="mt-8 text-center">
        <Link to="/products" className="text-blue-600 hover:underline">
          ← Back to Products
        </Link>
      </div>
    </div>
  );
}

export default ProductDetailPage;