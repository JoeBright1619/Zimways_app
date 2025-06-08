const DEV_API_URL = 'http://192.168.1.70:8080/api';
const PROD_API_URL = 'https://your-production-url.com/api';

const config = {
  API_URL: __DEV__ ? DEV_API_URL : PROD_API_URL,
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/customers/login',
      REGISTER: '/customers',
      VERIFY_2FA: '/customers/2fa/verify',
      SETUP_2FA: '/customers/2fa/setup',
    },
    VENDORS: {
      BASE: '/vendors',
      BY_ID: (id) => `/vendors/${id}`,
      CATEGORIES: (id) => `/vendors/${id}/categories`,
    },
    PRODUCTS: {
      BASE: '/items',
      BY_ID: (id) => `/items/${id}`,
      BY_VENDOR: (vendorId) => `/items/vendor/${vendorId}`,
    },
    CATEGORIES: {
      BASE: '/categories',
      BY_VENDOR: (id) => `/categories/vendor/${id}/categories`,
    },
    ORDERS: {
      BASE: '/orders',
      BY_ID: (id) => `/orders/${id}`,
      BY_CUSTOMER: (customerId) => `/orders/customer/${customerId}`,
    },
  },
  TIMEOUT: 30000, // Increased to 30 seconds
};

export default config; 