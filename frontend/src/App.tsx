import HomePage from "./pages/HomePage";
import { Routes, Route } from 'react-router-dom';
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import Navbar from "./components/Navbar";
import CheckoutPage from "./pages/CheckoutPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import AdminProductListPage from './pages/AdminProductListPage';
import AdminProductCreatePage from './pages/AdminProductCreatePage';
import AdminProductEditPage from './pages/AdminProductEditPage';
// import Dashboard from './pages/Dashboard'; // Admin dashboard later

import { CartProvider } from './context/CartContext';
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Navbar />
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order/:id" element={<OrderDetailsPage />} />
            <Route path="/myorders" element={<MyOrdersPage />} />
            {/* Admin Routes */}
            <Route path="/admin/products" element={<AdminProductListPage />} />
            <Route path="/admin/products/create" element={<AdminProductCreatePage />} />
            <Route path="/admin/products/:id/edit" element={<AdminProductEditPage />} /> 
          </Routes>
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;