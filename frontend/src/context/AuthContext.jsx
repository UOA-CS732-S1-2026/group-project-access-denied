import { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../api/auth.api';
import PropTypes from 'prop-types';

const AuthContext = createContext(null);

const isFutureExpiry = (value) => {
  const expiry = Number(value);
  return Number.isFinite(expiry) && expiry > Date.now();
};

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    getMe()
      .then((res) => setUser(res.data))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []);

  const login = (token, userData, expiresAt) => {
    localStorage.setItem('token', token);
    const existingExpiry = localStorage.getItem('sessionExpiry');
    if (!isFutureExpiry(existingExpiry) && expiresAt) {
      localStorage.setItem('sessionExpiry', String(new Date(expiresAt).getTime()));
    }
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('sessionExpiry');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
