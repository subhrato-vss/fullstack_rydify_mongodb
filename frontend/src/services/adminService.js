import apiClient from './apiService';

const adminService = {
  // Dealer Management
  getDealers: () => apiClient.get('/admin/fetchDealer'),
  updateDealerStatus: (id, status) => apiClient.put(`/admin/update_dealerstatus/${id}`, { status }),
  deleteDealer: (id) => apiClient.delete(`/admin/delete_dealer/${id}`),

  // Category Management
  getCategories: () => apiClient.get('/admin/viewcategory'),
  addCategory: (formData) => apiClient.post('/admin/add_category', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateCategory: (id, formData) => apiClient.put(`/admin/update_category/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteCategory: (id) => apiClient.delete(`/admin/delete_category/${id}`),

  // Bookings & Users
  getBookings: () => apiClient.get('/admin/fetchbooking'),
  getUsers: () => apiClient.get('/admin/fetchUsers'),
};

export default adminService;
