import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import colors_fonts from '../../constants/colors_fonts';
import { categoriesAPI } from '../../services/api.service';

export const VerticalCategoryList = () => {
  const navigation = useNavigation();
  const [categories, setCategories] = React.useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryData = await categoriesAPI.getAll();
        setCategories(categoryData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);


  const handlePress = (category) => {
    navigation.navigate('Category', {
      selectedCategory: category,
      type: category.type, // if your category has type (e.g. PRODUCTS, VENDORS, BOTH)
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.tile} onPress={() => handlePress(item)}>
      <Text style={styles.tileText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.verticalList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};




export const HorizontalCategoryList = ({ categories }) => {
  const navigation = useNavigation();

  const handlePress = (category) => {
    navigation.navigate('Category', {
      category,
      type: category.type, // if your category has type (e.g. PRODUCTS, VENDORS, BOTH)
    });
  };

  return (
    <FlatList
      data={categories}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.tile} onPress={() => handlePress(item)}>
          <Text style={styles.tileText}>{item.name}</Text>
        </TouchableOpacity>
      )}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.horizontalList}
    />
  );
};


const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    flex: 1,
  },
  verticalList: {
    paddingBottom: 20,
  },
  horizontalList: {
    paddingVertical: 10,
  },
  tile: {
    backgroundColor: colors_fonts.tile_background,
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tileText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors_fonts.text,
  },
});