import axios from 'axios';

// Đăng nhập: trả về { user, token } hoặc throw lỗi
export const login = async ({ email, password }) => {
  const response = await axios.post('/api/auth/login', { email, password });
  return response.data;
};

// Đăng ký: trả về { user, token } hoặc throw lỗi
export const register = async ({ name, email, password }) => {
  const response = await axios.post('/api/auth/register', { name, email, password });
  return response.data;
};

export const adminLogin = async ({ email, password }) => {
  const response = await axios.post('/api/admin/login', { email, password });
  return response.data;
};

export const checkAdminAuth = async (token) => {
  const response = await axios.get('/api/admin/check-auth', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const getUserById = async (userId, token) => {
  try {
    const response = await axios.get(`/api/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    if (error.response?.status === 404) {
      throw new Error('Người dùng không tồn tại');
    } else if (error.response?.status === 401) {
      throw new Error('Bạn cần đăng nhập để xem thông tin này');
    } else {
      throw new Error(error.response?.data?.message || 'Lỗi khi tải thông tin người dùng');
    }
  }
};

export const updateUser = async (userId, userData, token) => {
  const response = await axios.put(`/api/users/${userId}`, userData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const getAdminUsers = async (token) => {
  const response = await axios.get('/api/admin/users', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const getAdminProducts = async (token) => {
  const response = await axios.get('/api/admin/products', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const getAdminInventory = async (token) => {
  const response = await axios.get('/api/admin/inventory', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const deleteUser = async (userId, token) => {
  const response = await axios.delete(`/api/admin/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};