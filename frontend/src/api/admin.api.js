import api from './api';

export const importProductImage = (productId, imageUrl) =>
  api.post(`/admin/products/${productId}/import-image`, { imageUrl });
