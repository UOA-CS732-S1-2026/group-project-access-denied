import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
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
import NotFoundPage    from './pages/NotFoundPage';
import ProductListing      from './pages/ProductListing';
import ProductDetailsPage  from './pages/ProductDetailsPage';
import HelpBot from './components/Helpbot';

const HELPBOT_HIDDEN_ROUTES = ['/challenges'];

const AppContent = () => {
  const { pathname } = useLocation();
  const showHelpBot = !HELPBOT_HIDDEN_ROUTES.includes(pathname);

  return (
    <CartProvider>
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes — require login */}
        <Route path="/"             element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/products"     element={<ProtectedRoute><ProductListing /></ProtectedRoute>} />
        <Route path="/products/:id" element={<ProtectedRoute><ProductDetailsPage /></ProtectedRoute>} />
        <Route path="/cart"         element={<ProtectedRoute><ShoppingCartPage /></ProtectedRoute>} />
        <Route path="/account"      element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/orders"       element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>} />
        <Route path="/orders/:id"   element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
        <Route path="/checkout"     element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path="/admin"        element={<ProtectedRoute><AdminPanelPage /></ProtectedRoute>} />
        <Route path="/challenges"   element={<ProtectedRoute><ChallengePage /></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      {showHelpBot && <HelpBot />}
    </AuthProvider>
    </CartProvider>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
