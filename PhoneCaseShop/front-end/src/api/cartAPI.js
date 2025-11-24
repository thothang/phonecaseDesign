import axios from 'axios';

export const getCart = async (userId, token) => {
    const response = await axios.get('/api/cart', {
        params: { userId },
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const addToCart = async (cartItem, token) => {
    const response = await axios.post('/api/cart', cartItem, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const removeFromCart = async (cartItemId, token) => {
    const response = await axios.delete(`/api/cart/${cartItemId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const updateCartQuantity = async (cartItemId, quantity, token) => {
    const response = await axios.put(`/api/cart/${cartItemId}/quantity`, null, {
        params: { quantity },
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const clearCart = async (userId, token) => {
    const response = await axios.delete('/api/cart/clear', {
        params: { userId },
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};
