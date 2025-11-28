import React, { useEffect, useState, useRef } from 'react';
import {    Animated, View, Text, StyleSheet, ScrollView, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons'; // ensure you have this installed
import { RouteProp, useNavigation } from '@react-navigation/native';
import colors_fonts from '../constants/colors_fonts'; // adjust path as needed
import ProductCard from '../components/product/productCard';
import VendorScreenInfo from '../components/vendor/VendorScreenInfo';
import VendorScreenDropDown from '../components/vendor/vendorScreenDropDown';
import { fetchItemsByVendor } from '../api/items';
import { RootStackParamList } from '../type/navigation.type';
import { ProductProps } from '../type/product.type';

// (imports remain the same)

const VendorScreen = ({ route }: {
  route: RouteProp<RootStackParamList, "Vendor">;
}) =>{
  const { vendor } = route.params;
  const [products, setProducts] = useState<ProductProps[]>([]);
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true); // Add loading state


 useEffect(() => {
  const fetchVendorProducts = async () => {
    setLoading(true);
    try {
      const result = await fetchItemsByVendor(vendor.id);
      console.log('Fetched products in vendorscreen:', result);
      setProducts(result || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };
  fetchVendorProducts();
}, [vendor.id]);


 
  const scrollY = useRef(new Animated.Value(0)).current;
  const translateY = scrollY.interpolate({
    inputRange: [0, 245],
    outputRange: [0, -245],
    extrapolate: 'clamp',
  });



const filteredProducts =
  selectedCategory === 'All'
    ? products
    : products.filter(
        (p) => Array.isArray(p.categoryNames) && p.categoryNames.includes(selectedCategory)
      );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{vendor.name}</Text>
      </View>

      {/* Vendor Image */}
      

      <View style={styles.vendorInfo}>

      <VendorScreenInfo 
        vendor={vendor}
        translateY={translateY} 
      />


      <VendorScreenDropDown
        vendor={vendor}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        translateY={translateY}
      />

        <Animated.ScrollView
          contentContainerStyle={{ paddingTop: 400, paddingBottom: 100 }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
        >
          {loading ? (
            <View style={styles.centerContent}>
              <ActivityIndicator size="large" color={colors_fonts.primary} />
              <Text style={styles.loadingText}>Loading products...</Text>
            </View>
          ) : filteredProducts.length === 0 ? (
  <View style={styles.centerContent}>
    <Text style={styles.noItemsText}>No products in this category.</Text>
  </View>
) : (
  <FlatList
    data={filteredProducts}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => <ProductCard product={item} variant="vendor" />}
    scrollEnabled={false}
  />
)}


        </Animated.ScrollView>
      </View>
    </View>
  );
};

// Add or modify these styles:
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors_fonts.background,
    paddingBottom: 20,

  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: colors_fonts.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    zIndex: 120,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    flexShrink: 1,
  },
 
  vendorInfo: {

  },

  productsHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingHorizontal: 16,
    marginTop: 12,
  },
 

  centerContent: {
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 40,
},
loadingText: {
  marginTop: 10,
  fontSize: 16,
  color: '#666',
},
noItemsText: {
  fontSize: 16,
  color: '#999',
  fontStyle: 'italic',
},

});

export default VendorScreen;
