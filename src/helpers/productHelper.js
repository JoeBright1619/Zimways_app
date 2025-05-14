import {  collection, query, where, getDocs  } from 'firebase/firestore';
import { db } from '../../firebase';
import { getVendorById } from './vendorHelper';

export const getAllProducts = async () => {
  const productsCol = collection(db, 'products');
  const snapshot = await getDocs(productsCol);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};




export const getProductsByVendor = async (vendorId) => {
  const q = query(
    collection(db, 'products'),
    where('vendorId', 'array-contains', vendorId)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};


export const getProductsByCategory = async (category) => {
  const q = query(
    collection(db, 'products'),
    where('category', 'array-contains', category)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const searchByProductName = async (searchText) => {
  const q = query(
    collection(db, 'products'),
    where('productName', '>=', searchText),
    where('productName', '<=', searchText + '\uf8ff')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getTopRatedProducts = async () => {
  const products = await getAllProducts();
  return products
    .toSorted((a, b) => b.rating - a.rating)  // does NOT mutate original array
    .slice(0, 5);
};
