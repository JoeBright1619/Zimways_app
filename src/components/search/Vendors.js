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
import colors_fonts from "../../constants/colors_fonts";
import SearchSkeleton from "./SearchSkeleton";

const screenWidth = Dimensions.get("window").width;

export const VendorSearch = ({ vendors, searchText, loading = false }) => {
  const renderItem = ({ item }) => (
    <View style={styles.gridItem}>
      <VendorCard vendor={item} />
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors_fonts.primary} />
      <Text style={styles.loadingText}>Searching vendors...</Text>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.noItemsText}>No vendors found</Text>
      <Text style={styles.emptySubText}>
        Try adjusting your search or browse all vendors
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.searchTitle}>
        Search results for vendors: <Text style={styles.highlightText}>"{searchText}"</Text>
      </Text>

      {loading ? (
        <SearchSkeleton />
      ) : vendors.length > 0 ? (
        <FlatList
          data={vendors}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        />
      ) : (
        renderEmptyState()
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
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
  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  gridItem: {
    width: (screenWidth - 48) / 2, // padding + spacing
    marginBottom: 10,
  },
  list: {
    paddingBottom: 16,
  },
});
