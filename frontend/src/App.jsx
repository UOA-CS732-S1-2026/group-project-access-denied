import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ShoppingCartPage from './pages/ShoppingCartPage';
import ProfilePage from './pages/ProfilePage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import OrderDetailPage from './pages/OrderDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminPanelPage from './pages/AdminPanelPage';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChallengePage from './pages/ChallengePage';
import NotFoundPage from './pages/NotFoundPage';
import ProductListing from './pages/ProductListing';
import ProductDetailsPage from './pages/ProductDetailsPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import AboutPage from './pages/AboutPage';
import HelpBot from './components/Helpbot';

const HELPBOT_HIDDEN_ROUTES = ['/challenges'];

const AppContent = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const showHelpBot = !HELPBOT_HIDDEN_ROUTES.includes(pathname);

  return (
    <CartProvider>
    <AuthProvider>
      <Routes>
        {/* Public routes — redirect away if already logged in */}
        <Route path="/login"    element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

        {/* User-only routes */}
        <Route path="/"                    element={<ProtectedRoute allowedRoles={['user']}><HomePage /></ProtectedRoute>} />
        <Route path="/products"            element={<ProtectedRoute allowedRoles={['user']}><ProductListing /></ProtectedRoute>} />
        <Route path="/products/:id"        element={<ProtectedRoute allowedRoles={['user']}><ProductDetailsPage /></ProtectedRoute>} />
        <Route path="/cart"                element={<ProtectedRoute allowedRoles={['user']}><ShoppingCartPage /></ProtectedRoute>} />
        <Route path="/orders"              element={<ProtectedRoute allowedRoles={['user']}><OrderHistoryPage /></ProtectedRoute>} />
        <Route path="/orders/:orderNumber" element={<ProtectedRoute allowedRoles={['user']}><OrderDetailPage /></ProtectedRoute>} />
        <Route path="/checkout"            element={<ProtectedRoute allowedRoles={['user']}><CheckoutPage /></ProtectedRoute>} />
        <Route path="/challenges"          element={<ProtectedRoute allowedRoles={['user']}><ChallengePage /></ProtectedRoute>} />
        <Route path="/terms"               element={<ProtectedRoute allowedRoles={['user']}><TermsOfServicePage /></ProtectedRoute>} />
        <Route path="/about"               element={<ProtectedRoute allowedRoles={['user']}><AboutPage /></ProtectedRoute>} />

        {/* Admin-only routes */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminPanelPage /></ProtectedRoute>} />

        {/* Shared routes — all authenticated users */}
        <Route path="/account" element={<ProtectedRoute allowedRoles={['user', 'admin']}><ProfilePage /></ProtectedRoute>} />

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
