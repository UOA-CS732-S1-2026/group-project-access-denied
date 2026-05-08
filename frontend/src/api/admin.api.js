import api from './api';

export const importProductImage = (productId, imageUrl) =>
  api.post(`/admin/products/${productId}/import-image`, { imageUrl });

export const getAllProducts = () => api.get('/admin/products');
