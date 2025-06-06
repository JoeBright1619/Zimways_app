// hooks/useVendors.js
import { useEffect, useState } from 'react';
import axios from 'axios';

const BASE_URL = 'http://192.168.1.68:8080/api/vendors'; // Replace <your-ip> with your machine's IP on the same network

export default function useVendors() {
  const [vendors, setVendors] = useState([]);
  const [loadingVendors, setLoadingVendors] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get(BASE_URL);
        setVendors(response.data);
        console.log('Fetched vendors:', response.data);
      } catch (error) {
        console.error('Failed to fetch vendors:', error);
      } finally {
        setLoadingVendors(false);
      }
    };

    fetchVendors();
  }, []);

  return { vendors, loadingVendors };
}
