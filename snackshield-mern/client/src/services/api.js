import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 errors (token expired or invalid)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);
export const getProfile = () => api.get('/auth/profile');

// Products
export const verifyProduct = (data) => api.post('/products/verify-product', data);
export const getProducts = () => api.get('/products');
export const createProduct = (data) => api.post('/products/create-product', data);
export const getProductJourney = (productId) => api.get(`/products/${productId}/journey`);
export const getRiskScore = (productId) => api.get(`/products/${productId}/risk-score`);

// Batches
export const getBatches = () => api.get('/batches');
export const createBatch = (data) => api.post('/batches/create-batch', data);
export const getBatchUnits = (batchId) => api.get(`/batches/${batchId}/units`);

// Company Services
export const getCompanies = () => api.get('/companies');
export const getCompanyById = (id) => api.get(`/companies/${id}`);
export const createCompany = (data) => api.post('/companies', data);

// Scans
export const getScanHistory = () => api.get('/scans/scan-history');
export const recordScan = (data) => api.post('/scans/scan-product', data);

// Analytics
export const getScanStats = () => api.get('/analytics/scan-stats');
export const getFraudStats = () => api.get('/analytics/fraud-stats');
export const getGlobalStats = () => api.get('/analytics/global-stats');
export const downloadAuditPDF = () => api.get('/analytics/download-audit-pdf', { responseType: 'blob' });
export const downloadBatchPDF = (batchId) => api.get(`/batches/${batchId}/download-pdf`, { responseType: 'blob' });

// Alerts
export const getAlerts = (params) => api.get('/alerts', { params });
export const markAlertAsRead = (alertId) => api.patch(`/alerts/${alertId}/read`);
export const resolveAlert = (alertId) => api.patch(`/alerts/${alertId}/resolve`);
export const createAlert = (data) => api.post('/alerts', data);

// Distributor
export const getDistributorDashboard = () => api.get('/distributor/dashboard');
export const getDistributorShipments = () => api.get('/distributor/shipments');

// Retailer
export const getRetailerDashboard = () => api.get('/retailer/dashboard');
export const quickVerifyProduct = (qrCode) => api.get('/retailer/verify-quick', { params: { qrCode } });

export default api;
