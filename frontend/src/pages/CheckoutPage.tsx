import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import orderService, { OrderItem, ShippingAddress } from '../services/orderService';
import { formatCurrency } from '../utils/formatCurrency';

function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const { user, isLoggedIn } = useAuth(); // Get user details from AuthContext

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('PayPal'); // Default payment method
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not logged in or cart is empty
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    if (cartItems.length === 0) {
      navigate('/cart');
      return;
    }

    // Pre-fill shipping address if available from user profile
    if (user?.shippingAddress) {
      setShippingAddress(user.shippingAddress);
    }
  }, [isLoggedIn, cartItems, user, navigate]);

  // Calculate prices
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.quantity * item.product.price, 0);
  const shippingPrice = itemsPrice > 1000 ? 0 : 300; // Free shipping over 1000 bob
  const taxPrice = itemsPrice * 0.15; // 15% tax
  const finalTotalPrice = itemsPrice + shippingPrice + taxPrice;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Map cart items to order items format
    const orderItems: OrderItem[] = cartItems.map(item => ({
      product: item.product._id,
      name: item.product.name,
      imageUrl: item.product.imageUrl,
      quantity: item.quantity,
      price: item.product.price,
    }));

    try {
      const order = await orderService.createOrder({
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice, // Not directly stored in backend, but good for calculations
        taxPrice,
        shippingPrice,
        totalPrice: finalTotalPrice,
      });

      // Simulate payment right after order creation for simplicity
      // In a real app, this would involve a payment gateway interaction
      const paymentResult = {
        id: 'mock_transaction_id_' + new Date().getTime(),
        status: 'COMPLETED',
        email_address: user?.email,
      };
      await orderService.payOrder(order._id, paymentResult);

      alert('Order placed and paid successfully!');
      clearCart(); // Clear cart after successful order and payment
      navigate(`/order/${order._id}`); // Redirect to order details page
    } catch (err: any) {
      console.error('Order placement error:', err);
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn || cartItems.length === 0) {
    // Will be redirected by useEffect
    return null;
  }

  return (
    <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Shipping Address Form */}
      <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Shipping Address</h2>
        <form onSubmit={handlePlaceOrder} className="space-y-4">
          <div>
            <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">Address:</label>
            <input
              type="text"
              id="address"
              value={shippingAddress.address}
              onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-gray-700 text-sm font-bold mb-2">City:</label>
              <input
                type="text"
                id="city"
                value={shippingAddress.city}
                onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div>
              <label htmlFor="postalCode" className="block text-gray-700 text-sm font-bold mb-2">Postal Code:</label>
              <input
                type="text"
                id="postalCode"
                value={shippingAddress.postalCode}
                onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          </div>
          <div>
            <label htmlFor="country" className="block text-gray-700 text-sm font-bold mb-2">Country:</label>
            <input
              type="text"
              id="country"
              value={shippingAddress.country}
              onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          {/* Payment Method Selection */}
          <h3 className="text-xl font-bold mt-6 mb-2">Payment Method</h3>
          <div className="flex items-center mb-4">
            <input
              type="radio"
              id="paypal"
              name="paymentMethod"
              value="PayPal"
              checked={paymentMethod === 'PayPal'}
              onChange={() => setPaymentMethod('PayPal')}
              className="mr-2"
            />
            <label htmlFor="paypal" className="text-gray-700">PayPal</label>
          </div>
          {/* Add more payment methods here */}

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading || cartItems.length === 0}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing Order...' : 'Place Order & Pay'}
          </button>
        </form>
      </div>

      {/* Order Summary */}
      <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
        <div className="border-b pb-4 mb-4">
          {cartItems.map((item) => (
            <div key={item.product._id} className="flex justify-between items-center mb-2">
              <span className="text-gray-700">{item.product.name} x {item.quantity}</span>
              <span className="font-semibold">{formatCurrency(item.product.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-700">Items Price:</span>
            <span className="font-semibold">{formatCurrency(itemsPrice)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Shipping:</span>
            <span className="font-semibold">{formatCurrency(shippingPrice)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Tax (15%):</span>
            <span className="font-semibold">{formatCurrency(taxPrice)}</span>
          </div>
          <div className="flex justify-between text-xl font-bold pt-4 border-t mt-4">
            <span>Order Total:</span>
            <span>{formatCurrency(finalTotalPrice)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;