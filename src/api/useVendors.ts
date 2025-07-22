// hooks/useVendors.js
import { useEffect, useState } from 'react';
import axios from 'axios';
import { vendorsAPI } from '../services/api.service';


export default function useVendors() {
  const [vendors, setVendors] = useState([]);
  const [loadingVendors, setLoadingVendors] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await vendorsAPI.getAll();
        setVendors(response);
        console.log('Fetched vendors:', response);
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
