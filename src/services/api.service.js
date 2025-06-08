import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../../firebase';
import config from '../config/api.config';

const api = axios.create({
  baseURL: config.API_URL,
  timeout: config.TIMEOUT,
});

// Request interceptor for API calls
api.interceptors.request.use(
  async (config) => {
    const firebaseUser = auth.currentUser;
    if (firebaseUser) {
      const idToken = await firebaseUser.getIdToken();
      config.headers.Authorization = `Bearer ${idToken}`;
    }
    console.log('API Request:', {
      url: config.url,
      method: config.method,
      baseURL: config.baseURL,
      timeout: config.timeout,
    });
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    console.error('API Error:', {
      url: originalRequest?.url,
      method: originalRequest?.method,
      status: error.response?.status,
      message: error.message,
      response: error.response?.data,
    });

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const firebaseUser = auth.currentUser;
        if (firebaseUser) {
          // Force refresh the Firebase token
          const newToken = await firebaseUser.getIdToken(true);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Error refreshing auth token:', refreshError);
      }
    }
    
    // Enhance error message for timeout
    if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
      error.message = `Request timed out after ${config.TIMEOUT/1000} seconds. Please check your network connection and server status.`;
    }
    
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: async (email, idToken) => {
    try {
      const response = await api.post(config.ENDPOINTS.AUTH.LOGIN, {
        email,
        firebaseToken: idToken,
      });
      
      return response; // Return the entire response object
      
    } catch (error) {
      console.error('Login API Error:', error);
      throw error;
    }
  },

  register: async (userData) => {
    try {
      // Format the data to match backend expectations
      const customerData = {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        password: userData.password, // Backend needs this for initial setup
        address: userData.address || '',
        firebaseUid: userData.firebaseUid,
        firebaseToken: userData.firebaseToken
      };

      const response = await api.post(config.ENDPOINTS.AUTH.REGISTER, customerData);
      return response.data;
    } catch (error) {
      console.error('Register API Error:', error);
      throw error.response?.data || error.message;
    }
  },

  setup2FA: async (customerId) => {
    try {
      const response = await api.post(
        config.ENDPOINTS.AUTH.SETUP_2FA,
        null,
        { params: { customerId } }
      );
      return response.data;
    } catch (error) {
      console.error('2FA Setup API Error:', error);
      throw error.response?.data || error.message;
    }
  },

  verify2FA: async (customerId, verificationData) => {
    try {
      const response = await api.post(
        config.ENDPOINTS.AUTH.VERIFY_2FA,
        verificationData,
        { params: { customerId } }
      );
      return response.data;
    } catch (error) {
      console.error('2FA Verify API Error:', error);
      throw error.response?.data || error.message;
    }
  },
};

// Vendors API calls
export const vendorsAPI = {
  getAll: async () => {
    try {
      console.log('Fetching all vendors...');
      const response = await api.get(config.ENDPOINTS.VENDORS.BASE);
      return response.data;
    } catch (error) {
      console.error('Get All Vendors API Error:', error);
      throw error.response?.data || error.message;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(config.ENDPOINTS.VENDORS.BY_ID(id));
      return response.data;
    } catch (error) {
      console.error('Get Vendor By ID API Error:', error);
      throw error.response?.data || error.message;
    }
  },

  getCategories: async (vendorId) => {
    try {
      const response = await api.get(config.ENDPOINTS.VENDORS.CATEGORIES(vendorId));
      return response.data;
    } catch (error) {
      console.error('Get Vendor Categories API Error:', error);
      throw error.response?.data || error.message;
    }
  },
};

// Products API calls
export const productsAPI = {
  getAll: async () => {
    try {
      console.log('Fetching all products...');
      const response = await api.get(config.ENDPOINTS.PRODUCTS.BASE);
      return response.data;
    } catch (error) {
      console.error('Get All Products API Error:', error);
      throw error.response?.data || error.message;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(config.ENDPOINTS.PRODUCTS.BY_ID(id));
      return response.data;
    } catch (error) {
      console.error('Get Product By ID API Error:', error);
      throw error.response?.data || error.message;
    }
  },

  getByVendor: async (vendorId) => {
    try {
      const response = await api.get(config.ENDPOINTS.PRODUCTS.BY_VENDOR(vendorId));
      return response.data;
    } catch (error) {
      console.error('Get Products By Vendor API Error:', error);
      throw error.response?.data || error.message;
    }
  },
};

export default api; 