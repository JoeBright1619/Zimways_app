import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
// Adjust the path to your placeholder image
import imageMap from "../../constants/imageMap";
import colors_fonts from "../../constants/colors_fonts"; // Adjust the import based on your colors/fonts setup
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"; // Adjust the import based on your icon library
import { ProductProps } from "../../type/product.type"; // Adjust the import based on your types setup

type props = Pick<
  ProductProps,
  "name" | "price" | "description" | "imageUrl"
> & {
  quantity?: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
  onMoreDetails: () => void;
};

const ProductCartCard = ({
  name,
  price,
  quantity,
  description,
  imageUrl,
  onIncrease,
  onDecrease,
  onRemove,
  onMoreDetails,
}: props) => (
  <View style={styles.card}>
    <View style={styles.topRow}>
      <Image
        source={
          imageUrl && imageMap[imageUrl]
            ? imageMap[imageUrl]
            : require("../../../assets/placeholder.jpg")
        }
        style={styles.image} // optional: make sure to style it
      />
      <View style={styles.productdescription}>
        <Text style={styles.name}>{name || "Product name Unavailable"}</Text>
        <Text style={styles.description}>
          {description || "No description available"}
        </Text>
      </View>

      <Text style={styles.price}>RWF {price || "null"}</Text>
    </View>
    <View style={styles.middleRow}>
      <View style={styles.qtyControls}>
        <TouchableOpacity onPress={onDecrease} style={styles.qtyBtn}>
          <Text style={styles.qtyBtnText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.qtyText}>{quantity}</Text>
        <TouchableOpacity onPress={onIncrease} style={styles.qtyBtn}>
          <Text style={styles.qtyBtnText}>+</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={onRemove} style={styles.removeBtn}>
        <Ionicons
          name="trash-bin-outline"
          size={30}
          color={colors_fonts.secondary}
        />
      </TouchableOpacity>
    </View>
    <TouchableOpacity onPress={onMoreDetails} style={styles.moreDetails}>
      <Text style={styles.moreDetailsText}>More Details</Text>
      <MaterialCommunityIcons name="chevron-down" />
    </TouchableOpacity>
    <View style={styles.line} />
  </View>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    elevation: 2,
    marginVertical: 4,
    width: "100%",
    minHeight: 110,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30, // half of width/height makes it circular
    resizeMode: "cover", // ensures image covers the frame
    
  },
  productdescription: {
    marginRight: 30,
    width: "50%",
    
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  description: {
    fontSize: 11,
    color: colors_fonts.text,
    flex: 1,
    paddingBottom: 10, // optional: add some padding for better readability
  },
  price: {
    fontSize: 16,
    color: colors_fonts.text,
  },

  middleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    maxHeight: 35,
    width: "84%",
    marginLeft: 60,
    marginTop: -12,
    alignItems: "center",
  },
  qtyControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly", // evenly distribute space between buttons and text
    marginLeft: 5, // space between image and quantity controls
  },
  qtyBtn: {
    backgroundColor: "#eee",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colors_fonts.text,
    marginHorizontal: 0,
    width: 25,
    height: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  qtyBtnText: {
    fontSize: 18,
  },
  qtyText: {
    fontSize: 16,
    minWidth: 24,
    textAlign: "center",
  },
  removeBtn: {
    // Removed backgroundColor to make it transparent
    borderRadius: 4,

    alignSelf: "flex-end", // aligns the button to the end of the row
  },
  moreDetails: {
    alignItems: "center",
  },
  moreDetailsText: {
    fontSize: 10,
  },
  line: {
    height: 1,
    backgroundColor: "#aaa", // or any color you like
    width: "95%",
    alignSelf: "center", // centers the line
  },
});

export default ProductCartCard;
