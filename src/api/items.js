import axios from 'axios';

const BASE_URL = 'http://192.168.1.68:8080/api/items'; 


export const fetchAllItems = async () => {
  const response = await axios.get(BASE_URL);

  return response.data;
};

export const fetchItemsByVendor = async (vendorId) => {
  const response = await axios.get(`${BASE_URL}/vendor/${vendorId}`);
  return response.data;
};

export const fetchItemById = async (id) => {
  const response = await axios.get(`${BASE_URL}/${id}`);
  return response.data;
};

// Add more as needed...
