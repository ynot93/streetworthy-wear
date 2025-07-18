// my-ecommerce-frontend/src/pages/MyOrdersPage.tsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import orderService, { Order } from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatCurrency';

function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login'); // Redirect to login if not authenticated
      return;
    }

    const fetchMyOrders = async () => {
      try {
        const data = await orderService.getMyOrders();
        setOrders(data);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [isLoggedIn, navigate]); // Re-fetch if login status changes

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-xl font-semibold">Loading your orders...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-600 text-lg">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">My Orders</h1>
      {orders.length === 0 ? (
        <p className="text-center text-gray-600">You haven't placed any orders yet.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DATE</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TOTAL</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PAID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DELIVERED</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Details</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 truncate" style={{ maxWidth: '150px' }}>{order._id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(order.totalPrice)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {order.isPaid ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Paid {new Date(order.paidAt!).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Not Paid
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {order.isDelivered ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Delivered {new Date(order.deliveredAt!).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Not Delivered
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.orderStatus}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/order/${order._id}`} className="text-blue-600 hover:text-blue-900">
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MyOrdersPage;