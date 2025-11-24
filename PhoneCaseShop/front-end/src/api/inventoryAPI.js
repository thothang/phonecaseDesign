import axios from 'axios';

export const updateInventory = async (productId, quantity, token) => {
    const response = await axios.put(`/api/admin/inventory/${productId}`, null, {
        params: { quantity },
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const getLowStockItems = async (token) => {
    const response = await axios.get('/api/admin/inventory/low-stock', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const deleteInventory = async (productId, token) => {
    const response = await axios.delete(`/api/admin/inventory/${productId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

