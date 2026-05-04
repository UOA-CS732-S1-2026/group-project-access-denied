import api from './api';

export const getSecurityQuestion   = (data) => api.post('/auth/forgot-password', data);
export const verifySecurityAnswer  = (data) => api.post('/auth/forgot-password/verify', data);
