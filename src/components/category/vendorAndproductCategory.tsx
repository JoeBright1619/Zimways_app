import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView} from 'react-native';
import ProductCard from '../product/productCard';
import VendorCard from '../vendor/vendorCard';
import SearchSkeleton from '../search/SearchSkeleton';

import { vendorsAPI, productsAPI } from '../../services/api.service';
import { ProductProps } from '../../type/productType';
import { VendorProps } from '../../type/vendorType';

export const VendorAndProductCategory = ({selectedCategoryName}: {selectedCategoryName: string}) => {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [vendors, setVendors] = useState<VendorProps[]>([]);
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
            
                <>
                    {/* Products Section */}
                    <View style={styles.section}>
              <Text style={styles.sectionTitle}>Products</Text>
              {loadingProducts ? (
                <SearchSkeleton type="horizantal" count={6}/>
            ) : products.length > 0 ? (
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
                <SearchSkeleton type="horizontal"/>
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