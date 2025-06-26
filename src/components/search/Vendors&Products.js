import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import VendorCard from "../vendor/vendorCard";
import ProductCard from "../product/productCard";
import colors_fonts from "../../constants/colors_fonts";
import SearchSkeleton from "./SearchSkeleton";

const screenWidth = Dimensions.get("window").width;

export const VendorAndProductSearch = ({ 
  products, 
  vendors, 
  searchText, 
  loadingProducts = false,
  loadingVendors = false 
}) => {
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

  const renderLoadingState = (type) => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors_fonts.primary} />
      <Text style={styles.loadingText}>Searching {type}...</Text>
    </View>
  );

  const renderEmptyState = (type) => (
    <View style={styles.emptyContainer}>
      <Text style={styles.noItemsText}>No {type} found</Text>
      <Text style={styles.emptySubText}>
        Try adjusting your search
      </Text>
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
        {loadingVendors ? (
          <SearchSkeleton type=""/>
        ) : vendors.length > 0 ? (
          <FlatList
            data={vendors}
            renderItem={renderVendor}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.list}
          />
        ) : (
          renderEmptyState('vendors')
        )}
      </View>

      {/* Products */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Products</Text>
        {loadingProducts ? (
          <SearchSkeleton type=""/>
        ) : products.length > 0 ? (
          <FlatList
            data={products}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.list}
          />
        ) : (
          renderEmptyState('products')
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
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  noItemsText: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    fontWeight: "600",
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    textAlign: "center",
    color: "#999",
    paddingHorizontal: 20,
  },
  cardWrapper: {
    marginRight: 12,
  },
  list: {
    paddingHorizontal: 2,
  },
});
