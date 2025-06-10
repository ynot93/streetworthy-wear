import HomePage from "./pages/HomePage";
import { Routes, Route } from 'react-router-dom';
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import { CartProvider } from './context/CartContext';
import CartPage from './pages/CartPage';
// import CartPage from './pages/CartPage'; // Will add later
// import CheckoutPage from './pages/CheckoutPage'; // Will add later
// import Dashboard from './pages/Dashboard'; // Admin dashboard later

function App() {
  return (
    <CartProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          {/* <Route path="/checkout" element={<CheckoutPage />} /> */}
        </Routes>
      </div>
    </CartProvider>
  );
}

export default App;