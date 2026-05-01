import apiClient from './apiService';

const carService = {
  // Public
  getCategories: () => apiClient.get('/fetchCategories'),
  getCars: (categoryId = 'all', params = {}) => apiClient.get(`/fetchcars/${categoryId}`, { params }),
  getSingleCar: (id) => apiClient.get(`/fetchSingleCar/${id}`),
  getReviews: (params = {}) => apiClient.get('/fetchreviews', { params }),

  // User Actions
  getUserStats: () => apiClient.get('/user/stats'),
  addCarRequest: (data) => apiClient.post('/user/addCarRequest', data),
  addReview: (data) => apiClient.post('/user/addreview', data),
  addBooking: (data) => apiClient.post('/user/addBooking', data),
  getUserCars: () => apiClient.get('/user/fetchMycars'),
  getUserBookings: () => apiClient.get('/user/fetchMyBookings'),

  // Dealer Actions
  getDealerStats: () => apiClient.get('/dealer/stats'),
  getDealerCars: () => apiClient.get('/dealer/fetchcars'),
  addCar: (data) => apiClient.post('/dealer/addcar', data),
  updateCar: (id, data) => apiClient.put(`/dealer/updatecar/${id}`, data),
  deleteCar: (id) => apiClient.delete(`/dealer/deletecar/${id}`),
  
  getDealerRequests: (params = {}) => apiClient.get('/dealer/fetchcarreq', { params }),
  getDealerApprovedRequests: (params = {}) => apiClient.get('/dealer/fetchapprovedbooking', { params }),
  getDealerCompletedRequests: (params = {}) => apiClient.get('/dealer/fetchcompletedbooking', { params }),
  getDealerCancelledRequests: (params = {}) => apiClient.get('/dealer/fetchcancelledbooking', { params }),
  
  updateRequestStatus: (id, status) => apiClient.put(`/dealer/updatereq/${id}`, { status }),
  updateCarStatus: (id, status) => apiClient.put(`/dealer/updateCar/${id}`, { status }),
};

export default carService;
