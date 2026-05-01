import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="text-white text-center mt-20">Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (user.role === 'admin' && location.pathname !== '/admin') {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired
};

export default ProtectedRoute;