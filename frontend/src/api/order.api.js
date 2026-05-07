import api from './api';

export const getOrders   = ()      => api.get('/orders');
export const getOrder    = (orderNumber) => api.get(`/orders/${orderNumber}`);
export const createOrder = (data)  => api.post('/orders', data);
