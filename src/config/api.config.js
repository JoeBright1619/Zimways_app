const DEV_API_URL = 'http://192.168.1.67:8080/api';
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
      BY_CATEGORY: (category) => `/categories/${category}/vendors`,
      BY_SEARCH: (query) => `/vendors/search?keyword=${encodeURIComponent(query)}`,
    },
    PRODUCTS: {
      BASE: '/items',
      BY_ID: (id) => `/items/${id}`,
      BY_VENDOR: (vendorId) => `/items/vendor/${vendorId}`,
      BY_CATEGORY: (category) => `/categories/${category}/items`,
      BY_SEARCH: (query) => `/items/search?keyword=${encodeURIComponent(query)}`,

    },
    CATEGORIES: {
      BASE: '/categories',
      BY_NAME: (name) => `/categories/${name}`,
      BY_VENDOR: (id) => `/categories/vendors/${id}/categories`,
      BY_TYPE: (type) => `/categories/by-type/${type}`
    },
    ORDERS: {
      BASE: '/orders',
      BY_ID: (id) => `/orders/${id}`,
      BY_CUSTOMER: (customerId) => `/orders/customer/${customerId}`,
    },
    CART: {
      BASE: '/carts',
      BY_ID: (cartId) => `/carts/${cartId}`,
      ALL: '/carts',
      BY_CUSTOMER: (customerId) => `/carts/customer/${customerId}`,
      CREATE: (customerId) => `/carts/customer/${customerId}`,
      ADD_ITEM: (customerId) => `/carts/customer/${customerId}/add-item`,
      REMOVE_ITEM: (customerId) => `/carts/customer/${customerId}/remove-item`,
      UPDATE_ITEM: (customerId) => `/carts/customer/${customerId}/update-item`,
      ITEMS: (customerId) => `/carts/customer/${customerId}/items`,
      TOTAL: (customerId) => `/carts/customer/${customerId}/total`,
      CHECKOUT: (customerId) => `/carts/customer/${customerId}/checkout`,
      DELETE: (cartId) => `/carts/${cartId}`,
      DELETE_ITEM: (customerId, itemId) => `/carts/customer/${customerId}/items/${itemId}`,
      VENDORS: (customerId) => `/carts/customer/${customerId}/vendors`,
      ITEMS_BY_VENDOR: (customerId, vendorId) => `/carts/customer/${customerId}/vendor/${vendorId}/items`,
    },
  },
  TIMEOUT: 30000, // Increased to 30 seconds
};

export default config;