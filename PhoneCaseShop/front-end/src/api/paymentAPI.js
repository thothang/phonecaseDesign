import axios from 'axios';

export const createPayment = async (paymentData, token) => {
    const response = await axios.post('/api/payments', paymentData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const processCODPayment = async (orderId, token) => {
    const response = await axios.post(`/api/payments/cod/${orderId}`, null, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const getPaymentByOrderId = async (orderId, token) => {
    const response = await axios.get(`/api/payments/order/${orderId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

