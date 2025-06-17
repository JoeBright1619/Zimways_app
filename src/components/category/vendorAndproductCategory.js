import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import ProductCard from '../product/productCard';
import VendorCard from '../vendor/vendorCard';
import colors_fonts from '../../constants/colors_fonts';

import { vendorsAPI, productsAPI } from '../../services/api.service';

export const VendorAndProductCategory = ({selectedCategoryName}) => {
  const [products, setProducts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingVendors, setLoadingVendors] = useState(true);
    useEffect(() => {
        const fetchProducts = async () => {
          try {
            const productData = await productsAPI.getByCategory(selectedCategoryName);
            setProducts(productData);
            const vendorData = await vendorsAPI.getByCategory(selectedCategoryName);
            setVendors(vendorData);
          } catch (error) {
            console.error('Error fetching products:', error);
          } finally {
            setLoadingProducts(false);
            setLoadingVendors(false);
          }
        };

        fetchProducts();
    }, [selectedCategoryName]);

    return (
        <ScrollView style={styles.content}>
            {loadingProducts ? (
                <ActivityIndicator size="large" color={colors_fonts.primary} style={styles.loader} />
            ) : (
                <>
                    {/* Products Section */}
                    <View style={styles.section}>
              <Text style={styles.sectionTitle}>Products</Text>
              {products.length > 0 ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {products.map(product => (
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
              ) : vendors?.length > 0 ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {vendors.map(vendor => (
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
        
    );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  noItemsText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
  loader: {
    marginTop: 20,
  },
});