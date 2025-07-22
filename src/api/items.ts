import axios from 'axios';
import { productsAPI } from '../services/api.service';

export const fetchAllItems = async () => {
  const response = await productsAPI.getAll();

  return response;
};

export const fetchItemsByVendor = async (vendorId: string) => {
  const response = await productsAPI.getByVendor(vendorId);
  return response;
};

export const fetchItemById = async (id: string) => {
  const response = await productsAPI.getById(id);
  return response;
};

// Add more as needed...
