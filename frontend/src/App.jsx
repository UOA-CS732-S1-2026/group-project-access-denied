import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

import HomePage        from './pages/HomePage';
import LoginPage       from './pages/LoginPage';
import RegisterPage    from './pages/RegisterPage';
import ChallengePage   from './pages/ChallengePage';
import ScoreboardPage  from './pages/ScoreboardPage';
import NotFoundPage    from './pages/NotFoundPage';
import ProductListing      from './pages/ProductListing';
import ProductDetailsPage  from './pages/ProductDetailsPage';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          {/* Public routes */}
          <Route path="/"         element={<HomePage />} />
          <Route path="/products"     element={<ProductListing />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes — require login */}
          <Route path="/challenges" element={
            <ProtectedRoute><ChallengePage /></ProtectedRoute>
          } />
          <Route path="/scoreboard" element={
            <ProtectedRoute><ScoreboardPage /></ProtectedRoute>
          } />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
