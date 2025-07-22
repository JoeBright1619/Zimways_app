import React, {useEffect, useState} from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import VendorCard from '../vendor/vendorCard';
import { vendorsAPI } from '../../services/api.service';
import colors_fonts from '../../constants/colors_fonts';
import { VendorProps } from '../../type/vendorType';

export const VendorsCategory = ({ selectedCategoryName }: {selectedCategoryName: string}) => {
  // Filter vendors based on the selected category
  const [vendors, setVendors] = useState<VendorProps[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const vendorData = await vendorsAPI.getByCategory(selectedCategoryName);
        setVendors(vendorData);
  
      } catch (error) {
        console.error('Error fetching vendors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, [selectedCategoryName]);

  if (loading) {
    return <ActivityIndicator size="large" color={colors_fonts.primary} />;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Vendors</Text>
      {loading ? (
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
  );

}

const styles = StyleSheet.create({
  section: {
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  noItemsText: {
    textAlign: 'center',
    color: '#888',
  },
});