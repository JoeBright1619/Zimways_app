import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ListRenderItem } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import colors_fonts from '../../constants/colors_fonts';
import { categoriesAPI } from '../../services/api.service';
import { RootStackParamList } from '../../type/navigationType';

type Category = {
  id: number | string;
  name: string;
  icon?: string;
  type?: string;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Category'>;

type HorizontalCategoryListProps = {
  categories: Category[];
};

export const VerticalCategoryList = () => {
   const navigation = useNavigation<NavigationProp>();
  const [categories, setCategories] = useState<Category[]>([]);
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


  const handlePress = (category: Category) => {
    navigation.navigate('Category', {
      selectedCategory: category,
      type: category.type ?? '', // if your category has type (e.g. PRODUCTS, VENDORS, BOTH)
    });
  };

 const renderItem: ListRenderItem<Category> = ({ item }) => (
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




export const HorizontalCategoryList = ({ categories }: HorizontalCategoryListProps) => {
  const navigation = useNavigation<NavigationProp>();

  const handlePress = (category: Category) => {
    navigation.navigate('Category', {
      category,
      type: category.type ?? '', // if your category has type (e.g. PRODUCTS, VENDORS, BOTH)
    });
  };

  const renderItem: ListRenderItem<Category> = ({ item }) => (
    <TouchableOpacity style={styles.tile} onPress={() => handlePress(item)}>
      <Text style={styles.tileText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={categories}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
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