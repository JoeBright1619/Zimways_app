import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
} from "react-native";
import VendorCard from "../vendor/vendorCard";
import colors_fonts from "../../constants/colors_fonts";

const screenWidth = Dimensions.get("window").width;

export const VendorSearch = ({ vendors, searchText }) => {
  const renderItem = ({ item }) => (
    <View style={styles.gridItem}>
      <VendorCard vendor={item} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.searchTitle}>
        Search results for <Text style={styles.highlightText}>"{searchText}"</Text>
      </Text>

      {vendors.length > 0 ? (
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
        <Text style={styles.noItemsText}>No vendors found</Text>
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
  noItemsText: {
    fontSize: 14,
    textAlign: "center",
    color: "#999",
    marginTop: 12,
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
