import axios from 'axios';

export const createOrder = async (orderData, token) => {
    const response = await axios.post('/api/orders', orderData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const getOrders = async (userId, token) => {
    const response = await axios.get('/api/orders', {
        params: { userId },
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const getOrderById = async (orderId, token) => {
    const response = await axios.get(`/api/orders/${orderId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const getAdminOrders = async (token) => {
    const response = await axios.get('/api/admin/orders', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const updateOrderStatus = async (orderId, status, reason, token) => {
    const response = await axios.put(`/api/admin/orders/${orderId}/status`, null, {
        params: { status, reason },
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};
