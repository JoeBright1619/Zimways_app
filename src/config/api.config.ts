const DEV_API_URL = 'http://192.168.1.67:8080/api';
const PROD_API_URL = 'https://your-production-url.com/api';

type EndpointFn<T extends any[] = any[]> = (...args: T) => string;

interface AuthEndpoints {
  LOGIN: string;
  REGISTER: string;
  VERIFY_2FA: string;
  SETUP_2FA: string;
}

interface VendorEndpoints {
  BASE: string;
  BY_ID: EndpointFn<[string]>;
  CATEGORIES: EndpointFn<[string]>;
  BY_CATEGORY: EndpointFn<[string]>;
  BY_SEARCH: EndpointFn<[string]>;
}

interface ProductEndpoints {
  BASE: string;
  BY_ID: EndpointFn<[string]>;
  BY_VENDOR: EndpointFn<[string]>;
  BY_CATEGORY: EndpointFn<[string]>;
  BY_SEARCH: EndpointFn<[string]>;
}

interface CategoryEndpoints {
  BASE: string;
  BY_NAME: EndpointFn<[string]>;
  BY_VENDOR: EndpointFn<[string]>;
  BY_TYPE: EndpointFn<[string]>;
}

interface OrderEndpoints {
  BASE: string;
  BY_ID: EndpointFn<[string]>;
  BY_CUSTOMER: EndpointFn<[string]>;
}

interface CartEndpoints {
  BASE: string;
  BY_ID: EndpointFn<[string]>;
  ALL: string;
  BY_CUSTOMER: EndpointFn<[string]>;
  CREATE: EndpointFn<[string]>;
  ADD_ITEM: EndpointFn<[string]>;
  REMOVE_ITEM: EndpointFn<[string]>;
  UPDATE_ITEM: EndpointFn<[string]>;
  ITEMS: EndpointFn<[string]>;
  TOTAL: EndpointFn<[string]>;
  CHECKOUT: EndpointFn<[string]>;
  DELETE: EndpointFn<[string]>;
  DELETE_ITEM: EndpointFn<[string, string]>;
  VENDORS: EndpointFn<[string]>;
  ITEMS_BY_VENDOR: EndpointFn<[string, string]>;
}

interface ApiConfig {
  API_URL: string;
  ENDPOINTS: {
    AUTH: AuthEndpoints;
    VENDORS: VendorEndpoints;
    PRODUCTS: ProductEndpoints;
    CATEGORIES: CategoryEndpoints;
    ORDERS: OrderEndpoints;
    CART: CartEndpoints;
  };
  TIMEOUT: number;
}

const config: ApiConfig = {
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
      BY_ID: (id: string) => `/vendors/${id}`,
      CATEGORIES: (id: string) => `/vendors/${id}/categories`,
      BY_CATEGORY: (category: string) => `/categories/${category}/vendors`,
      BY_SEARCH: (query: string) => `/vendors/search?keyword=${encodeURIComponent(query)}`,
    },
    PRODUCTS: {
      BASE: '/items',
      BY_ID: (id: string) => `/items/${id}`,
      BY_VENDOR: (vendorId: string) => `/items/vendor/${vendorId}`,
      BY_CATEGORY: (category: string) => `/categories/${category}/items`,
      BY_SEARCH: (query: string) => `/items/search?keyword=${encodeURIComponent(query)}`,
    },
    CATEGORIES: {
      BASE: '/categories',
      BY_NAME: (name: string) => `/categories/${name}`,
      BY_VENDOR: (id: string) => `/categories/vendors/${id}/categories`,
      BY_TYPE: (type: string) => `/categories/by-type/${type}`,
    },
    ORDERS: {
      BASE: '/orders',
      BY_ID: (id: string) => `/orders/${id}`,
      BY_CUSTOMER: (customerId: string) => `/orders/customer/${customerId}`,
    },
    CART: {
      BASE: '/carts',
      BY_ID: (cartId: string) => `/carts/${cartId}`,
      ALL: '/carts',
      BY_CUSTOMER: (customerId: string) => `/carts/customer/${customerId}`,
      CREATE: (customerId: string) => `/carts/customer/${customerId}`,
      ADD_ITEM: (customerId: string) => `/carts/customer/${customerId}/add-item`,
      REMOVE_ITEM: (customerId: string) => `/carts/customer/${customerId}/remove-item`,
      UPDATE_ITEM: (customerId: string) => `/carts/customer/${customerId}/update-item`,
      ITEMS: (customerId: string) => `/carts/customer/${customerId}/items`,
      TOTAL: (customerId: string) => `/carts/customer/${customerId}/total`,
      CHECKOUT: (customerId: string) => `/carts/customer/${customerId}/checkout`,
      DELETE: (cartId: string) => `/carts/${cartId}`,
      DELETE_ITEM: (customerId: string, itemId: string) => `/carts/customer/${customerId}/items/${itemId}`,
      VENDORS: (customerId: string) => `/carts/customer/${customerId}/vendors`,
      ITEMS_BY_VENDOR: (customerId: string, vendorId: string) => `/carts/customer/${customerId}/vendor/${vendorId}/items`,
    },
  },
  TIMEOUT: 30000,
};

export default config;