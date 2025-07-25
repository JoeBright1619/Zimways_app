import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors_fonts from '../constants/colors_fonts';
import { useNavigation } from '@react-navigation/native';
import { categoriesAPI } from '../services/api.service';

import { RootStackParamList } from '../type/navigation.type';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const categories = [
   { id: 1, name: 'Restaurants', icon: 'food-fork-drink' },
  { id: 2, name: 'Groceries', icon: 'cart-variant' },
  { id: 3, name: 'Pharmacies', icon: 'pill' },
  { id: 4, name: 'Electronics', icon: 'monitor-cellphone' },
  { id: 5, name: 'Fashion', icon: 'tshirt-crew-outline' },
  { id: 6, name: 'Beauty & Health', icon: 'lipstick' },
];

type CategoryProps = {
  id: number;
  name: string;
  icon?: string;
}



const CategoryGrid = ({filter}: {filter: string}) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList,"Category">>();
  const [categoryData, setCategoryData] = useState(categories);

useEffect(() => {
  const fetchCategories = async () => {
    let fetchedCategories = [];

    try {
      if (filter === 'ALL') {
        fetchedCategories = categories;
        console.log('Fetched Categories:', fetchedCategories);
      } else if (filter === 'VENDORS') {
        fetchedCategories = await categoriesAPI.getByType('VENDOR');
        console.log('Fetched Vendor Categories:', fetchedCategories);
      } else if (filter === 'PRODUCTS') {
        fetchedCategories = await categoriesAPI.getByType('PRODUCT');
        console.log('Fetched Product Categories:', fetchedCategories);
      } else {
        console.warn('Unknown filter type:', filter);
        return;
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
     
      setCategoryData(fetchedCategories.length ? fetchedCategories : categories); // fallback to static
    }
  };

  fetchCategories();
}, [filter]);


 const handleCategoryPress = async (selectedCategory: CategoryProps) => {
  try {
    if(selectedCategory.name === 'More Categories') {
      navigation.navigate('Category', { selectedCategory, type: "ALL" });
      return;
    }
    const categoryObj = await categoriesAPI.getByName(selectedCategory.name);
    if (!categoryObj) {
      console.warn('Category not found:', selectedCategory.name);
      return;
    }
    console.log('whole category object:', categoryObj);
    navigation.navigate('Category', { selectedCategory: categoryObj, type: categoryObj.type });
  } catch (error) {
    console.error('Error fetching category:', error);
  }
};

const getIconForCategory = (name: string) => {
  const found = categories.find(cat => cat.name === name);
  return found?.icon || 'help-circle';
};
  return (
    <View style={styles.container}>
      {categoryData.slice(0, 5).map((category) => (
    <TouchableOpacity
      key={category.id}
      style={styles.categoryBox}
      onPress={() => handleCategoryPress(category)}
    >
   <MaterialCommunityIcons name={category.icon as any} size={32} color={colors_fonts.primary} />

    <Text style={styles.categoryText}>{category.name}</Text>
  </TouchableOpacity>
))}
      
      {/* More Categories Box */}
      <TouchableOpacity
        style={[styles.categoryBox, styles.moreCategoriesBox]}
        onPress={() => handleCategoryPress({ id: 7, name: 'More Categories' })}
      >
        <MaterialCommunityIcons name="view-grid" size={32} color={colors_fonts.primary} />
        <Text style={styles.categoryText}>More Categories</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'space-between',
  },
  categoryBox: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: colors_fonts.tile_background,
    borderRadius: 12,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  moreCategoriesBox: {
    backgroundColor: colors_fonts.background,
    borderWidth: 2,
    borderColor: colors_fonts.primary,
    borderStyle: 'dashed',
  },
  categoryText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    color: colors_fonts.text,
  },
});

export default CategoryGrid; 