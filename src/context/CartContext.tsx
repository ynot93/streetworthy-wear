import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import cartService from '../services/cartService';
import { Product } from '../services/productService'; // Import the Product interface
import { Cart } from '../services/cartService';

// Define the shape of a cart item (similar to ICartItem on the backend)
export interface CartItem {
  product: Product;
  quantity: number;
}

// Define the shape of the cart context
interface CartContextProps {
  cartItems: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItemToCart: (product: Product, quantity: number) => Promise<void>;
  updateCartItemQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItemFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

// Create the cart context
const CartContext = createContext<CartContextProps | undefined>(undefined);

// Create a provider component
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      setError(null);
      try {
        const cartData: Cart = await cartService.getCart();
        // Map the backend cart items to the frontend CartItem interface
        const mappedCartItems: CartItem[] = cartData.items.map(item => ({
          product: item.product as Product, // Cast to Product
          quantity: item.quantity,
        }));
        setCartItems(mappedCartItems);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch cart');
        // If the cart doesn't exist yet, we'll just start with an empty cart
        if (err.response?.status === 404) {
          setCartItems([]);
        } else {
          console.error('Error fetching cart:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const addItemToCart = async (product: Product, quantity: number) => {
    setLoading(true);
    setError(null);
    try {
      const cartData = await cartService.addItemToCart(product._id, quantity);
       // Map the backend cart items to the frontend CartItem interface
       const mappedCartItems: CartItem[] = cartData.items.map(item => ({
        product: item.product as Product, // Cast to Product
        quantity: item.quantity,
      }));
      setCartItems(mappedCartItems);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to add item to cart');
    } finally {
      setLoading(false);
    }
  };

  const updateCartItemQuantity = async (productId: string, quantity: number) => {
    setLoading(true);
    setError(null);
    try {
      const cartData = await cartService.updateCartItemQuantity(productId, quantity);
       // Map the backend cart items to the frontend CartItem interface
       const mappedCartItems: CartItem[] = cartData.items.map(item => ({
        product: item.product as Product, // Cast to Product
        quantity: item.quantity,
      }));
      setCartItems(mappedCartItems);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to update cart item quantity');
    } finally {
      setLoading(false);
    }
  };

  const removeItemFromCart = async (productId: string) => {
    setLoading(true);
    setError(null);
    try {
      const cartData = await cartService.removeItemFromCart(productId);
       // Map the backend cart items to the frontend CartItem interface
       const mappedCartItems: CartItem[] = cartData.items.map(item => ({
        product: item.product as Product, // Cast to Product
        quantity: item.quantity,
      }));
      setCartItems(mappedCartItems);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to remove item from cart');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    setError(null);
    try {
      await cartService.clearCart();
      setCartItems([]);
      navigate('/'); // Redirect to home page after clearing cart
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to clear cart');
    } finally {
      setLoading(false);
    }
  };

  // Calculate total items and price
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.quantity * item.product.price, 0);

  const value = {
    cartItems,
    totalItems,
    totalPrice,
    addItemToCart,
    updateCartItemQuantity,
    removeItemFromCart,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {!loading ? children : <div className="flex justify-center items-center h-screen text-xl font-semibold">Loading Cart...</div>}
      {error && <div className="flex justify-center items-center h-screen text-red-600 text-lg">{error}</div>}
    </CartContext.Provider>
  );
};

// Create a custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};