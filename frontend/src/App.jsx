import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ShoppingCartPage from './pages/ShoppingCartPage';
import ProfilePage         from './pages/ProfilePage';
import OrderHistoryPage   from './pages/OrderHistoryPage';
import OrderDetailPage    from './pages/OrderDetailPage';
import CheckoutPage       from './pages/CheckoutPage';
import AdminPanelPage    from './pages/AdminPanelPage';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage        from './pages/HomePage';
import LoginPage       from './pages/LoginPage';
import RegisterPage    from './pages/RegisterPage';
import ChallengePage   from './pages/ChallengePage';
<<<<<<< HEAD
import NotFoundPage    from './pages/NotFoundPage';
import ProductListing      from './pages/ProductListing';
import ProductDetailsPage  from './pages/ProductDetailsPage';
=======
import ScoreboardPage  from './pages/ScoreboardPage';
import NotFoundPage    from './pages/NotFoundPage';
import ProductListing  from './pages/ProductListing';
>>>>>>> 4d56395 (#10 Product listings page has been created, all images stored under assets)

const App = () => {
  return (
    <BrowserRouter>
      <CartProvider>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/"         element={<HomePage />} />
<<<<<<< HEAD
          <Route path="/products"     element={<ProductListing />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path="/cart"         element={<ShoppingCartPage />} />
          <Route path="/account"      element={<ProfilePage />} />
          <Route path="/orders"       element={<OrderHistoryPage />} />
          <Route path="/orders/:id"   element={<OrderDetailPage />} />
          <Route path="/checkout"     element={<CheckoutPage />} />
          <Route path="/admin"        element={<AdminPanelPage />} />
=======
          <Route path="/products" element={<ProductListing />} />
>>>>>>> 4d56395 (#10 Product listings page has been created, all images stored under assets)
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes — require login */}
          <Route path="/challenges" element={
            <ProtectedRoute><ChallengePage /></ProtectedRoute>
          } />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
      </CartProvider>
    </BrowserRouter>
  );
};

export default App;
