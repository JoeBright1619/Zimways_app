import { useState, useEffect, useCallback } from 'react';
import { vendorsAPI, productsAPI } from '../services/api.service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import debounce from 'lodash.debounce';

export const useSearch = () => {
  const [searchText, setSearchText] = useState('');
  const [debouncedText, setDebouncedText] = useState('');
  const [filter, setFilter] = useState('ALL');
  
  const [products, setProducts] = useState([]);
  const [vendors, setVendors] = useState([]);
  
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingVendors, setLoadingVendors] = useState(false);
  
  const [searchHistory, setSearchHistory] = useState([]);
  const [error, setError] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Debounced search text update
  const debouncedUpdate = useCallback(
    debounce((text) => {
      setDebouncedText(text);
    }, 800),
    []
  );

  // Update debounced text when search text changes
  useEffect(() => {
    debouncedUpdate(searchText);
    return () => debouncedUpdate.cancel();
  }, [searchText, debouncedUpdate]);

  // Load search history on mount
  useEffect(() => {
    loadSearchHistory();
  }, []);

  // Main search effect
  useEffect(() => {
    const performSearch = async () => {
      if (debouncedText.trim() === '' && filter === 'ALL') {
        if (isInitialLoad) {
          await loadInitialData();
        }
        return;
      }

      setError(null);
      
      try {
        // Optimize API calls based on filter
        if (filter === 'ALL' || filter === 'PRODUCTS') {
          setLoadingProducts(true);
          const productData = await productsAPI.getBySearch(debouncedText);
          setProducts(productData);
        }

        if (filter === 'ALL' || filter === 'VENDORS') {
          setLoadingVendors(true);
          const vendorData = await vendorsAPI.getBySearch(debouncedText);
          setVendors(vendorData);
        }

        // Save to search history if search was successful
        if (debouncedText.trim() !== '') {
          await saveToSearchHistory(debouncedText);
        }

        console.log('Search performed for:', debouncedText);
      } catch (err) {
        console.error('Search error:', err);
        setError('Failed to load search results. Please try again.');
      } finally {
        setLoadingProducts(false);
        setLoadingVendors(false);
        setIsInitialLoad(false);
      }
    };

    performSearch();
  }, [debouncedText, filter, isInitialLoad]);

  // Load initial data
  const loadInitialData = async () => {
    try {
      setLoadingProducts(true);
      setLoadingVendors(true);
      
      const [productData, vendorData] = await Promise.all([
        productsAPI.getAll(),
        vendorsAPI.getAll()
      ]);
      
      setProducts(productData);
      setVendors(vendorData);
    } catch (err) {
      console.error('Error loading initial data:', err);
      setError('Failed to load initial data');
    } finally {
      setLoadingProducts(false);
      setLoadingVendors(false);
    }
  };

  // Search history management
  const loadSearchHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('searchHistory');
      if (history) {
        setSearchHistory(JSON.parse(history));
      }
    } catch (err) {
      console.error('Error loading search history:', err);
    }
  };

  const saveToSearchHistory = async (searchTerm) => {
    try {
      const newHistory = [
        searchTerm,
        ...searchHistory.filter(item => item !== searchTerm)
      ].slice(0, 10); // Keep only last 10 searches
      
      setSearchHistory(newHistory);
      await AsyncStorage.setItem('searchHistory', JSON.stringify(newHistory));
    } catch (err) {
      console.error('Error saving search history:', err);
    }
  };

  const clearSearchHistory = async () => {
    try {
      setSearchHistory([]);
      await AsyncStorage.removeItem('searchHistory');
    } catch (err) {
      console.error('Error clearing search history:', err);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchText('');
    setDebouncedText('');
    setError(null);
  };

  // Retry search
  const retrySearch = () => {
    setError(null);
    // Trigger search again by updating debounced text
    setDebouncedText(debouncedText);
  };

  // Set search text from history
  const setSearchFromHistory = (text) => {
    setSearchText(text);
  };

  return {
    // State
    searchText,
    debouncedText,
    filter,
    products,
    vendors,
    loadingProducts,
    loadingVendors,
    searchHistory,
    error,
    isInitialLoad,
    
    // Actions
    setSearchText,
    setFilter,
    clearSearch,
    retrySearch,
    setSearchFromHistory,
    clearSearchHistory,
    loadInitialData,
  };
}; 