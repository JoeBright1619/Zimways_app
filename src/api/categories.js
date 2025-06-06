import axios from 'axios';

const API_URL = 'http://192.168.1.68:8080/api/categories';

export const getCategories = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const getCategoriesByVendorId = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/vendors/${id}/categories`);
    if (!response.data || response.data.length === 0) {
      return [];
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching categories by vendor ID:', error);
    throw error;
  }
};
