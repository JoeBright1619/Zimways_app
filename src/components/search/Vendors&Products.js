import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
} from "react-native";
import VendorCard from "../vendor/vendorCard";
import ProductCard from "../product/productCard";
import colors_fonts from "../../constants/colors_fonts";

const screenWidth = Dimensions.get("window").width;

export const VendorAndProductSearch = ({ products, vendors, searchText }) => {
  const renderVendor = ({ item }) => (
    <View style={styles.cardWrapper}>
      <VendorCard vendor={item} />
    </View>
  );

  const renderProduct = ({ item }) => (
    <View style={styles.cardWrapper}>
      <ProductCard product={item} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.searchTitle}>
        Search results for <Text style={styles.highlightText}>"{searchText}"</Text>
      </Text>

      {/* Vendors */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vendors</Text>
        {vendors.length > 0 ? (
          <FlatList
            data={vendors}
            renderItem={renderVendor}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.list}
          />
        ) : (
          <Text style={styles.noItemsText}>No vendors found</Text>
        )}
      </View>

      {/* Products */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Products</Text>
        {products.length > 0 ? (
          <FlatList
            data={products}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.list}
          />
        ) : (
          <Text style={styles.noItemsText}>No products found</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: colors_fonts.backgroundLight || '#F2F2F2',
    flex: 1,
  },
  searchTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: colors_fonts.text,
  },
  highlightText: {
    fontWeight: "bold",
    color: colors_fonts.primary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors_fonts.text,
    marginBottom: 10,
  },
  noItemsText: {
    fontSize: 14,
    textAlign: "center",
    color: "#999",
    marginTop: 8,
  },
  cardWrapper: {
    marginRight: 12,
  },
  list: {
    paddingHorizontal: 2,
  },
});
