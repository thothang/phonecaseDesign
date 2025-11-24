import axios from 'axios';

// Hàm gọi API thực (sẽ bị MSW chặn trong môi trường dev)
export const fetchAllProduct = async () => {
  const response = await axios.get(`/api/products/all`);
  return response.data; // Trả về dữ liệu thô
};

// Admin product APIs
export const createProduct = async (productData, token) => {
    const response = await axios.post('/api/admin/products', productData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    return response.data;
};

export const updateProduct = async (productId, productData, token) => {
    const response = await axios.put(`/api/admin/products/${productId}`, productData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    return response.data;
};

export const deleteProduct = async (productId, token) => {
    const response = await axios.delete(`/api/admin/products/${productId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};
