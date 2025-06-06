// screens/ProductDetailsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import imageMap from '../constants/imageMap';
import colors_fonts from '../constants/colors_fonts';
import { getVendorById } from '../helpers/vendorHelper';

const ProductDetailsScreen = ({ route }) => {
  const { product } = route.params;
  const imageSource = imageMap[product.imageUrl] || require('../../assets/placeholder.jpg');

  const [vendorName, setVendorName] = useState('Loading...');
  const [vendor, setVendor] = useState({});
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchVendor = async () => {
      const vendor = await getVendorById(product.vendorId);
      setVendor(vendor || {});
      setVendorName(vendor ? vendor.vendorName : 'Unknown Vendor');
    };

    fetchVendor();
  }, [product.vendorId]);

  const increaseQty = () => setQuantity(q => q + 1);
  const decreaseQty = () => setQuantity(q => (q > 1 ? q - 1 : 1));

  const handleAddToCart = () => {
    // This should call your Cart Context or Redux dispatch
    console.log('Add to cart:', {
      productId: product.id,
      name: product.productName,
      quantity,
      price: product.price,
    });
  };

  const total = product.price * quantity;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={imageSource} style={styles.image} />

      <Text style={styles.name}>{product.productName}</Text>
      <Text style={styles.vendor}>Sold by: {product.vendorName}</Text>

      <Text style={styles.delivery}>🚚 Est. Delivery: {vendor.vendorType !== "Restaurant" && vendor.vendorType ? product.estimatedDelivery || '1-2 days' : 'N/A'}</Text>

      <Text style={styles.price}>RWF {product.price}</Text>
      <Text style={styles.rating}>⭐ {product.averageRating}</Text>
      <Text style={styles.description}>{product.description || "No description available"}</Text>

      <View style={styles.qtyRow}>
        <TouchableOpacity style={styles.qtyBtn} onPress={decreaseQty}>
          <Text style={styles.qtyText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.qtyNumber}>{quantity}</Text>
        <TouchableOpacity style={styles.qtyBtn} onPress={increaseQty}>
          <Text style={styles.qtyText}>+</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.total}>Total: RWF {total}</Text>

      <TouchableOpacity
        style={[styles.addToCartBtn, !product.available && styles.disabled]}
        onPress={handleAddToCart}
        disabled={!product.available}
      >
        <Text style={styles.cartText}>{product.available ? 'Add to Cart' : 'Out of Stock'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff'
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 10,
    marginBottom: 16
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 6
  },
  vendor: {
    fontSize: 16,
    marginBottom: 2,
    color: colors_fonts.secondary
  },
 
  
  delivery: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8
  },
  price: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4
  },
  rating: {
    fontSize: 16,
    marginBottom: 12
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    color: '#333',
    marginBottom: 12
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  qtyBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6
  },
  qtyText: {
    fontSize: 20
  },
  qtyNumber: {
    fontSize: 18,
    fontWeight: '500',
    marginHorizontal: 12
  },
  total: {
    fontSize: 18,
    marginBottom: 16
  },
  addToCartBtn: {
    backgroundColor: colors_fonts.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  disabled: {
    backgroundColor: '#ccc'
  },
  cartText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    
  }
});

export default ProductDetailsScreen;
