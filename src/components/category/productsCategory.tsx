import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Dimensions,
  ListRenderItem
} from "react-native";
import ProductCard from "../product/productCard";
import { productsAPI } from "../../services/api.service";
import colors_fonts from "../../constants/colors_fonts";
import { ProductProps } from "../../type/product.type";

const screenWidth = Dimensions.get("window").width;

export const ProductsCategory = ({ selectedCategoryName }: {selectedCategoryName: string}) => {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productData = await productsAPI.getByCategory(selectedCategoryName);
        setProducts(productData);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategoryName]);

  const renderItem:ListRenderItem<ProductProps> = ({ item }) => (
    <View style={styles.gridItem}>
      <ProductCard product={item} />
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color={colors_fonts.primary} />;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Products</Text>
      {products.length > 0 ? (
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Text style={styles.noItemsText}>No products found in this category</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginVertical: 20,
    paddingHorizontal: 10,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: colors_fonts.text,
  },
  noItemsText: {
    textAlign: "center",
    color: "#888",
    marginTop: 20,
  },
  row: {
    justifyContent: "space-evenly",
    marginBottom: 12,
  },
  gridItem: {
    width: (screenWidth - 65) / 2, // 10px padding left + right + 10px between items

  },
});
