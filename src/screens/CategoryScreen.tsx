import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors_fonts from '../constants/colors_fonts';
import { VendorsCategory } from '../components/category/vendorsCategory';
import { ProductsCategory } from '../components/category/productsCategory';
import {  VendorAndProductCategory } from '../components/category/vendorAndproductCategory';
import { VerticalCategoryList } from '../components/category/allCategoriesList';
import { RouteProp } from '@react-navigation/native';

type CategoryScreenRouteParams = {
  selectedCategory: {
    name: string;
    icon: string;
    // add other properties if needed
  };
  type: 'BOTH' | 'VENDOR' | 'PRODUCT' | 'ALL';
};

type RootStackParamList = {
  CategoryScreen: CategoryScreenRouteParams;
};



const CategoryScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'CategoryScreen'>>();
  const navigation = useNavigation();
  const { selectedCategory, type } = route.params;

  console.log('Selected Category:', selectedCategory);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="chevron-left" size={30} color="white" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <MaterialCommunityIcons name={selectedCategory.icon as any} size={32} color="white" />
          <Text style={styles.headerTitle}>{selectedCategory.name}</Text>
        </View>
      </View>
    
        {/* Render based on category type */}
  {type === 'BOTH' && <VendorAndProductCategory selectedCategoryName={selectedCategory.name} />}
  {type === 'VENDOR' && <VendorsCategory selectedCategoryName={selectedCategory.name} />}
  {type === 'PRODUCT' && <ProductsCategory selectedCategoryName={selectedCategory.name} />}
  {type === 'ALL' && <VerticalCategoryList />}

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