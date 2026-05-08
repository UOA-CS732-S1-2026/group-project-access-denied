import api from './api';

export const getProducts = (params) => api.get('/products', { params });
export const getProduct  = (id)     => api.get(`/products/${id}`);
export const getSqlInjectionFlag = (productId) => api.get('/products/sql-injection-flag', { params: { productId } });
export const getReviews  = (id)     => api.get(`/products/${id}/reviews`);
export const createReview = (id, data) => api.post(`/products/${id}/reviews`, data);
