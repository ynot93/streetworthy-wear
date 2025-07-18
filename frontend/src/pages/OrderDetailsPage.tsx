import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import orderService, { Order } from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatCurrency';

function OrderDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isLoggedIn, user } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    const fetchOrder = async () => {
      if (!id) {
        setError('Order ID is missing.');
        setLoading(false);
        return;
      }
      try {
        const data = await orderService.getOrderById(id);
        setOrder(data);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch order details.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, isLoggedIn]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-xl font-semibold">Loading order details...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-600 text-lg">{error}</div>;
  }

  if (!order) {
    return <div className="flex justify-center items-center h-screen text-gray-600 text-lg">Order not found.</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Order {order._id}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Order Details Column */}
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 border-b pb-2">Shipping</h2>
          <p><strong>Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
          {order.isDelivered ? (
            <div className="bg-green-100 text-green-700 p-2 rounded mt-2">Delivered on {new Date(order.deliveredAt!).toLocaleDateString()}</div>
          ) : (
            <div className="bg-red-100 text-red-700 p-2 rounded mt-2">Not Delivered</div>
          )}

          <h2 className="text-2xl font-bold mt-6 mb-4 border-b pb-2">Payment Method</h2>
          <p><strong>Method:</strong> {order.paymentMethod}</p>
          {order.isPaid ? (
            <div className="bg-green-100 text-green-700 p-2 rounded mt-2">Paid on {new Date(order.paidAt!).toLocaleDateString()}</div>
          ) : (
            <div className="bg-red-100 text-red-700 p-2 rounded mt-2">Not Paid</div>
          )}

          <h2 className="text-2xl font-bold mt-6 mb-4 border-b pb-2">Order Items</h2>
          {order.orderItems.length === 0 ? (
            <p>Order is empty</p>
          ) : (
            <div>
              {order.orderItems.map((item) => (
                <div key={item.product} className="flex items-center justify-between border-b py-3">
                  <div className="flex items-center">
                    <Link to={`/products/${item.product}`} className="mr-4">
                      <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded" />
                    </Link>
                    <div>
                      <Link to={`/products/${item.product}`} className="text-lg font-semibold hover:text-blue-600">
                        {item.name}
                      </Link>
                      <p className="text-gray-600 text-sm">{item.quantity} x {formatCurrency(item.price)}</p>
                    </div>
                  </div>
                  <span className="font-bold">{formatCurrency(item.quantity * item.price)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Summary Column */}
        <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md h-fit"> {/* h-fit to prevent it from stretching */}
          <h2 className="text-2xl font-bold mb-4 border-b pb-2">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-700">Items:</span>
              <span className="font-semibold">{formatCurrency(order.orderItems.reduce((acc, item) => acc + item.quantity * item.price, 0))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Shipping:</span>
              <span className="font-semibold">{formatCurrency(order.shippingPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Tax:</span>
              <span className="font-semibold">{formatCurrency(order.taxPrice)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold pt-4 border-t mt-4">
              <span>Total:</span>
              <span>{formatCurrency(order.totalPrice)}</span>
            </div>
          </div>
          {!order.isPaid && (
            <button
              className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg text-lg transition duration-300 ease-in-out disabled:opacity-50"
              onClick={() => alert('Simulated payment success!')} // Replace with actual payment logic if desired
              disabled={loading} // Or a separate payment loading state
            >
              Pay Now
            </button>
          )}
          {user?.role === 'admin' && !order.isDelivered && order.isPaid && (
            <button
              className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg text-lg transition duration-300 ease-in-out"
              onClick={() => alert('Simulated deliver!')}
            >
              Mark As Delivered
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderDetailsPage;