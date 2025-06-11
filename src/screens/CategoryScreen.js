import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { fetchAllItems } from '../api/items';
import useVendors from '../api/useVendors';
import ProductCard from '../components/product/productCard';
import VendorCard from '../components/vendor/vendorCard';
import colors_fonts from '../constants/colors_fonts';

const CategoryScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { category } = route.params;
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { vendors, loadingVendors } = useVendors();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await fetchAllItems();
        setProducts(data);
        // Filter products based on category
        const filtered = data.filter(product => 
          product.categoryNames?.includes(category.name) || 
          product.category?.includes(category.name)
        );
        setFilteredProducts(filtered);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  // Filter vendors based on category
  const filteredVendors = vendors?.filter(vendor => 
    vendor.vendorType?.toLowerCase() === category.name.toLowerCase() ||
    vendor.categories?.includes(category.name)
  );

  const getCategoryIcon = () => {
    switch (category.name.toLowerCase()) {
      case 'restaurants':
        return 'restaurant';
      case 'groceries':
        return 'cart';
      case 'pharmacy':
        return 'medical';
      case 'electronics':
        return 'phone-portrait';
      case 'fashion':
        return 'shirt';
      default:
        return 'grid';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Ionicons name={getCategoryIcon()} size={32} color="white" />
          <Text style={styles.headerTitle}>{category.name}</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color={colors_fonts.primary} style={styles.loader} />
        ) : (
          <>
            {/* Products Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Products</Text>
              {filteredProducts.length > 0 ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} variant="home" />
                  ))}
                </ScrollView>
              ) : (
                <Text style={styles.noItemsText}>No products found in this category</Text>
              )}
            </View>

            {/* Vendors Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Vendors</Text>
              {loadingVendors ? (
                <ActivityIndicator size="large" color={colors_fonts.primary} />
              ) : filteredVendors?.length > 0 ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {filteredVendors.map(vendor => (
                    <VendorCard key={vendor.id} vendor={vendor} />
                  ))}
                </ScrollView>
              ) : (
                <Text style={styles.noItemsText}>No vendors found in this category</Text>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors_fonts.background,
  },
  header: {
    backgroundColor: colors_fonts.primary,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  backButton: {
    marginBottom: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 10,
    color: colors_fonts.text,
  },
  loader: {
    marginTop: 50,
  },
  noItemsText: {
    textAlign: 'center',
    color: colors_fonts.text,
    fontStyle: 'italic',
    marginTop: 20,
  },
});

export default CategoryScreen; 