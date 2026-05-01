import apiClient from './apiService';

const authService = {
  // User Auth
  userLogin: (credentials) => apiClient.post('/user/login', credentials),
  userSignup: (userData) => apiClient.post('/user/register', userData),
  userLogout: () => apiClient.get('/user/logout'),
  checkUserToken: () => apiClient.get('/user/token'),

  // Dealer Auth
  dealerLogin: (credentials) => apiClient.post('/dealer/login', credentials),
  dealerSignup: (userData) => apiClient.post('/dealer/register', userData),
  dealerLogout: () => apiClient.get('/dealer/logout'),
  checkDealerToken: () => apiClient.get('/dealer/token'),

  // Admin Auth
  adminLogin: (credentials) => apiClient.post('/admin/login', credentials),
  adminLogout: () => apiClient.get('/admin/logout'),
  checkAdminToken: () => apiClient.get('/admin/token'),
  
  // Generic profile fetch (based on role)
  getProfile: (role) => apiClient.get(`/${role}/showProfile`),
  updateProfile: (role, id, data) => {
    const url = id ? `/${role}/updateProfile/${id}` : `/${role}/updateProfile`;
    return apiClient.post(url, data);
  },
  updatePassword: (role, data, config = {}) => apiClient.put(`/${role}/changePassword`, data, config),
};

export default authService;
