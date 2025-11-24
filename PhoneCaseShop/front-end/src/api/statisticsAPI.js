import axios from 'axios';

export const getStatistics = async (token, period = null) => {
    const params = period && period !== 'all' ? { period } : {};
    const response = await axios.get('/api/statistics', {
        params,
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

