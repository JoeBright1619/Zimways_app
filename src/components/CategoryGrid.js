import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors_fonts from '../constants/colors_fonts';
import { useNavigation } from '@react-navigation/native';

const categories = [
  { id: 1, name: 'Restaurants', icon: 'restaurant' },
  { id: 2, name: 'Groceries', icon: 'cart' },
  { id: 3, name: 'Pharmacy', icon: 'medical' },
  { id: 4, name: 'Electronics', icon: 'phone-portrait' },
  { id: 5, name: 'Fashion', icon: 'shirt' },
];

const CategoryGrid = () => {
  const navigation = useNavigation();

  const handleCategoryPress = (category) => {
    navigation.navigate('Category', { category });
  };

  return (
    <View style={styles.container}>
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={styles.categoryBox}
          onPress={() => handleCategoryPress(category)}
        >
          <Ionicons name={category.icon} size={32} color={colors_fonts.primary} />
          <Text style={styles.categoryText}>{category.name}</Text>
        </TouchableOpacity>
      ))}
      
      {/* More Categories Box */}
      <TouchableOpacity
        style={[styles.categoryBox, styles.moreCategoriesBox]}
        onPress={() => handleCategoryPress({ id: 'more', name: 'More Categories' })}
      >
        <Ionicons name="grid" size={32} color={colors_fonts.primary} />
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