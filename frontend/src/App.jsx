import { useEffect } from 'react';
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
import TermsOfServicePage  from './pages/TermsOfServicePage';
import AboutPage           from './pages/AboutPage';
import ShippingPage        from './pages/ShippingPage';
import ReturnsPage         from './pages/ReturnsPage';
import PrivacyPolicyPage   from './pages/PrivacyPolicyPage';
import HelpBot from './components/Helpbot';

const HELPBOT_HIDDEN_ROUTES = ['/challenges'];

const AppContent = () => {
  const { pathname } = useLocation();

  // Scroll to top on every route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
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
        <Route path="/orders/:orderNumber" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
        <Route path="/checkout"     element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path="/admin"        element={<ProtectedRoute><AdminPanelPage /></ProtectedRoute>} />
        <Route path="/challenges"   element={<ProtectedRoute><ChallengePage /></ProtectedRoute>} />
        <Route path="/terms"    element={<ProtectedRoute><TermsOfServicePage /></ProtectedRoute>} />
        <Route path="/about"    element={<ProtectedRoute><AboutPage /></ProtectedRoute>} />
        <Route path="/shipping" element={<ProtectedRoute><ShippingPage /></ProtectedRoute>} />
        <Route path="/returns"  element={<ProtectedRoute><ReturnsPage /></ProtectedRoute>} />
        <Route path="/privacy"  element={<ProtectedRoute><PrivacyPolicyPage /></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={<ProtectedRoute><NotFoundPage /></ProtectedRoute>} />
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
