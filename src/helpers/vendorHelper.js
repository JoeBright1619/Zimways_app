import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

export const getAllVendors = async () => {
  const vendorsCol = collection(db, 'vendors');
  const snapshot = await getDocs(vendorsCol);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getVendorById = async (vendorId) => {
  const vendorsCol = collection(db, 'vendors');
  const snapshot = await getDocs(vendorsCol);
  const vendor = snapshot.docs.find(doc => doc.id === vendorId);
  return vendor ? { id: vendor.id, ...vendor.data() } : null;
}

export const getTopRatedVendors = async () => {
  const vendors = await getAllVendors();
  return vendors
  .toSorted((a, b) => b.rating - a.rating)
  .slice(0, 5);
}