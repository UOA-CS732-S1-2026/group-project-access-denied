import api from './api';

export const getAllProducts = () => api.get('/admin/products');
