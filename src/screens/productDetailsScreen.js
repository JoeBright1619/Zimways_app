// screens/ProductDetailsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import imageMap from '../constants/imageMap';
import { getVendorById } from '../helpers/vendorHelper';

const ProductDetailsScreen = ({ route }) => {
  const { product } = route.params;
  const imageSource = imageMap[product.imageUrl] || require('../../assets/placeholder.jpg');
  const [vendorName, setVendorName] = useState('Loading...');

  useEffect(() => {
    const fetchVendor = async () => {
      const vendor = await getVendorById(product.vendorId);
      setVendorName(vendor ? vendor.vendorName : 'Unknown Vendor');
    };

    fetchVendor();
  }, [product.vendorId]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={imageSource} style={styles.image} />
      <Text style={styles.name}>{product.productName}</Text>
      <Text style={styles.vendor}>Sold by: {vendorName}</Text>
      <Text style={styles.price}>RWF {product.price}</Text>
      <Text style={styles.rating}>⭐ {product.rating}</Text>
      <Text style={styles.description}>{product.description}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff'
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 16
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8
  },
  vendor: {
    fontSize: 16,
    marginBottom: 4
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4
  },
  rating: {
    fontSize: 16,
    marginBottom: 12
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    color: '#333'
  }
});

export default ProductDetailsScreen;
