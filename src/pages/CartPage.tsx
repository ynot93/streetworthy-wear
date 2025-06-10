import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatCurrency'; // Utility function for formatting prices

function CartPage() {
  const { cartItems, totalItems, totalPrice, updateCartItemQuantity, removeItemFromCart, clearCart } = useCart();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    updateCartItemQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId: string) => {
    removeItemFromCart(productId);
  };

  const handleClearCart = () => {
    clearCart();
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
        <p className="text-gray-600">Your cart is empty. <Link to="/products" className="text-blue-600 hover:underline">Browse products</Link>.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

      {/* Cart Items */}
      <div className="mb-8">
        {cartItems.map((item) => (
          <div key={item.product._id} className="flex items-center justify-between border-b py-4">
            <div className="flex items-center">
              <Link to={`/products/${item.product._id}`} className="mr-4">
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded"
                />
              </Link>
              <div>
                <Link to={`/products/${item.product._id}`} className="text-lg font-semibold hover:text-blue-600">
                  {item.product.name}
                </Link>
                <p className="text-gray-600 text-sm">{item.product.category}</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex items-center mr-4">
                <label htmlFor={`quantity-${item.product._id}`} className="mr-2 font-semibold">Quantity:</label>
                <input
                  type="number"
                  id={`quantity-${item.product._id}`}
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.product._id, Math.max(1, parseInt(e.target.value)))}
                  min="1"
                  max={item.product.stock}
                  className="w-16 border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <p className="font-bold">{formatCurrency(item.product.price * item.quantity)}</p>
              <button onClick={() => handleRemoveItem(item.product._id)} className="ml-4 text-red-600 hover:text-red-800">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Summary */}
      <div className="text-right">
        <p className="text-lg font-semibold">Total Items: {totalItems}</p>
        <p className="text-2xl font-bold">Total Price: {formatCurrency(totalPrice)}</p>
        <button onClick={handleClearCart} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4">
          Clear Cart
        </button>
        {/* Checkout will be implemented later */}
        {/* <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4 ml-4">
          Proceed to Checkout
        </button> */}
      </div>
    </div>
  );
}

export default CartPage;