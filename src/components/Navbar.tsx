import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext'; // Import AuthContext

function Navbar() {
  const { totalItems } = useCart();
  const { isLoggedIn, user, logoutUser } = useAuth(); // Use AuthContext
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold hover:text-blue-300">
          StreetWorthy Wear
        </Link>
        <div className="flex items-center space-x-6">
          <Link to="/products" className="hover:text-blue-300">
            Products
          </Link>
          <Link to="/cart" className="relative hover:text-blue-300">
            Cart
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          {isLoggedIn ? (
            <>
              <Link to="/myorders" className="hover:text-blue-300">
                My Orders
              </Link>
              <span className="text-gray-300">Hello, {user?.username || 'User'}</span>
              <button onClick={handleLogout} className="bg-red-600 px-3 py-1 rounded hover:bg-red-700">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-300">
                Login
              </Link>
              <Link to="/register" className="hover:text-blue-300">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;