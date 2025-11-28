import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useSearch } from "../hooks/useSearch";
import SearchBar from "../components/search/SearchBar";
import { VendorSearch } from "../components/search/Vendors";
import { ProductSearch } from "../components/search/Products";
import { VendorAndProductSearch } from "../components/search/Vendors&Products";
import colors_fonts from "../constants/colors_fonts";
import { VendorProps } from "../type/vendor.type";
import { ProductProps } from "../type/product.type";

type FilterType = "VENDORS" | "PRODUCTS" | "ALL";

interface UseSearchReturn {
  searchText: string;
  filter: string;
  products: ProductProps[];
  vendors: VendorProps[];
  loadingProducts: boolean;
  loadingVendors: boolean;
  searchHistory: string[];
  error: string | null;
  setSearchText: (text: string) => void;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  clearSearch: () => void;
  retrySearch: () => void;
  setSearchFromHistory: (text: string) => void;
}

const SearchScreen = () => {
  // Reuse the same search logic from HomeScreen
  const {
    searchText,
    filter,
    products,
    vendors,
    loadingProducts,
    loadingVendors,
    searchHistory,
    error,
    setSearchText,
    setFilter,
    clearSearch,
    retrySearch,
    setSearchFromHistory,
  }: UseSearchReturn = useSearch();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          filter={filter}
          onFilterChange={setFilter}
          showFilter={true}
          searchHistory={searchHistory}
          onHistoryItemPress={setSearchFromHistory}
        />
      </View>

      {/* Error State */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={retrySearch}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Search Results */}
      {searchText === "" ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Start typing to search...</Text>
        </View>
      ) : filter === "VENDORS" ? (
        <VendorSearch
          vendors={vendors}
          searchText={searchText}
          loading={loadingVendors}
        />
      ) : filter === "PRODUCTS" ? (
        <ProductSearch
          products={products}
          searchText={searchText}
          loading={loadingProducts}
        />
      ) : (
        <VendorAndProductSearch
          products={products}
          vendors={vendors}
          searchText={searchText}
          loadingProducts={loadingProducts}
          loadingVendors={loadingVendors}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors_fonts.backgroundLight || "#F2F2F2",
  },
  header: {
    backgroundColor: colors_fonts.primary,
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 16,
  },
  errorContainer: {
    backgroundColor: "#ffebee",
    padding: 16,
    margin: 16,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  errorText: {
    color: "#c62828",
    flex: 1,
    marginRight: 12,
  },
  retryButton: {
    backgroundColor: "#c62828",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "600",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
});

export default SearchScreen;
