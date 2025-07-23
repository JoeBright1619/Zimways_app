import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  Dimensions,
} from "react-native";
import ProductCartCard from "./productCartCard";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors_fonts from "../../constants/colors_fonts";
import { ProductProps } from "../../type/product.type"; // Adjust the import based on your types setup
type props = {
  vendorName: string;
  products: ProductProps[];
  onAddMore: () => void;
  onProductAction: (
    action: "increase" | "decrease" | "remove" | "details",
    product: any
  ) => void;
  message: string;
  setMessage: (message: string) => void;
};

const VendorCartSection = ({
  vendorName,
  products,
  onAddMore,
  onProductAction,
  message,
  setMessage,
}: props) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <View style={styles.section}>
      <TouchableOpacity
        onPress={() => setExpanded((e) => !e)}
        style={styles.header}
      >
        <Text style={styles.vendorName}>{vendorName}</Text>
        <MaterialCommunityIcons
          name={expanded ? "menu-up" : "menu-down"}
          size={20}
          color="black"
          style={styles.foldIcon}
        />
      </TouchableOpacity>
      {expanded && (
        <>
          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ProductCartCard
                name={item.name}
                price={item.price}
                description={item.description}
                imageUrl={item.imageUrl}
                onIncrease={() => onProductAction("increase", item)}
                onDecrease={() => onProductAction("decrease", item)}
                onRemove={() => onProductAction("remove", item)}
                onMoreDetails={() => onProductAction("details", item)}
              />
            )}
            style={styles.productList}
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginHorizontal: 12,
              marginBottom: 8,
            }}
          >
            <MaterialCommunityIcons name="dots-grid" size={20} />
            <TouchableOpacity style={styles.addMoreBtn} onPress={onAddMore}>
              <Text style={styles.addMoreText}>Add more from {vendorName}</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.messageInput}
            placeholder="Optional: Any restrictions or request to the vendor?"
            value={message}
            onChangeText={setMessage}
            multiline
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    width: Dimensions.get("window").width,
    marginBottom: 18,
    borderRadius: 10,
    elevation: 1,
    paddingBottom: 3,
    backgroundColor: colors_fonts.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors_fonts.backgroundDark,
    padding: 5,
  },
  vendorName: {
    fontSize: 18,
    color: "#333",
  },
  foldIcon: {
    fontSize: 18,
    color: "#888",
  },
  productList: {
    width: "100%",
    paddingHorizontal: 8,
  },
  addMoreBtn: {
    backgroundColor: colors_fonts.tertiary,
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  addMoreText: {
    color: "#fff",
    fontSize: 10,
  },
  messageInput: {
    backgroundColor: "#fff",
    borderRadius: 6,
    marginHorizontal: 12,
    marginBottom: 8,
    padding: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    minHeight: 80,
    width: "91%",
    alignSelf: "center",
  },
});

export default VendorCartSection;
