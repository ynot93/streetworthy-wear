import HomePage from "./pages/HomePage";
import { Routes, Route } from 'react-router-dom';
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
// import ProductListPage from './pages/ProductListPage'; // Will add later
// import ProductDetailPage from './pages/ProductDetailPage'; // Will add later
// import CartPage from './pages/CartPage'; // Will add later
// import CheckoutPage from './pages/CheckoutPage'; // Will add later
// import Dashboard from './pages/Dashboard'; // Admin dashboard later

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* <Route path="/products" element={<ProductListPage />} /> */}
        {/* <Route path="/products/:id" element={<ProductDetailPage />} /> */}
        {/* <Route path="/cart" element={<CartPage />} /> */}
        {/* <Route path="/checkout" element={<CheckoutPage />} /> */}
      </Routes>
    </div>
  );
}

export default App;