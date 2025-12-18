// screens/ProductDetailsScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import imageMap from '../constants/imageMap';
import colors_fonts from '../constants/colors_fonts';
// Adjust the import based on your auth context setup
import { cartAPI } from '../services/api.service';
import { useAuth } from '../hooks/useAuth';
import { RootStackParamList } from '../type/navigation.type';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { VendorProps } from '../type/vendor.type';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const ProductDetailsScreen = ({
  route,
}: {
  route: RouteProp<RootStackParamList, 'ProductDetails'>;
}) => {
  const { product } = route.params;
  const imageSource =
    imageMap[product.imageUrl] || require('../../assets/placeholder.jpg');
  const { backendUser } = useAuth();
  const [vendor] = useState<VendorProps | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const increaseQty = () => setQuantity((q) => q + 1);
  const decreaseQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleAddToCart = async () => {
    setLoading(true);
    setMessage('');
    try {
      if (!backendUser?.id) {
        throw new Error('No backend user found');
      }
      await cartAPI.addItem(backendUser.id, product.id, quantity);
      setMessage('Added to cart!');
    } catch (error) {
      setMessage('Failed to add to cart');
      console.error('Add to cart error:', error);
    } finally {
      setLoading(false);
      // Set timeout to clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // Calculate discounted price
  const discountedPrice =
    product.discountPercentage > 0
      ? product.price * (1 - product.discountPercentage / 100)
      : product.price;

  const total = discountedPrice * quantity;
  const originalTotal = product.price * quantity; // For comparison

  return (
    <View style={styles.MainContainer}>
      {/* Hero Section */}
      <View style={styles.heroContainer}>
        <Image source={imageSource} style={styles.image} />
        <View style={styles.heroOverlay} />
        <View style={styles.heroTopBar}>
          <TouchableOpacity
            style={styles.iconBtnRound}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={20} color="#000" />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity style={styles.iconBtnRound}>
              <Ionicons name="share-outline" size={20} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtnRound}>
              <Ionicons name="heart-outline" size={20} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
        {/* Badges */}
        <View style={styles.badgesRow}>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>
              ⭐ {product.averageRating.toFixed(1)}
            </Text>
          </View>
          {product.discountPercentage > 0 ? (
            <View style={styles.discountBadge}>
              <MaterialCommunityIcons
                name="tag-outline"
                size={14}
                color={colors_fonts.white}
              />
              <Text style={styles.discountText}>
                -{product.discountPercentage}%
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Title and vendor */}
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.vendor}>Sold by: {product.vendorName}</Text>

        {/* Delivery estimate */}
        <Text style={styles.delivery}>
          🚚 Est. Delivery:{' '}
          {vendor?.vendorType !== 'Restaurant' && vendor?.vendorType
            ? product.estimatedDelivery || '1-2 days'
            : 'N/A'}
        </Text>

        {/* Category chips */}
        {Array.isArray(product.categoryNames) &&
        product.categoryNames.length > 0 ? (
          <View style={styles.chipsRow}>
            {product.categoryNames.map((cat) => (
              <View key={cat} style={styles.chip}>
                <Text style={styles.chipText}>{cat}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* Description */}
        <Text style={styles.description}>
          {product.description || 'No description available'}
        </Text>

        {/* Quantity stepper */}
        <View style={styles.qtyRow}>
          <TouchableOpacity
            style={[styles.qtyBtnLg, styles.qtyBtn]}
            onPress={decreaseQty}
          >
            <Text>-</Text>
          </TouchableOpacity>
          <Text style={styles.qtyNumber}>{quantity}</Text>
          <TouchableOpacity
            style={[styles.qtyBtnLg, styles.qtyBtn]}
            onPress={increaseQty}
          >
            <Text>+</Text>
          </TouchableOpacity>
        </View>

        {/* Spacer to avoid content under sticky bar */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Sticky Action Bar */}
      <View style={styles.stickyBar}>
        <View>
          <Text style={styles.totalLabel}>Total</Text>
          {product.discountPercentage > 0 ? (
            <View style={styles.totalPriceContainer}>
              <Text style={styles.originalTotalPrice}>
                RWF {originalTotal.toLocaleString()}
              </Text>
              <Text style={styles.discountedTotalPrice}>
                RWF {total.toLocaleString()}
              </Text>
            </View>
          ) : (
            <Text style={styles.totalPrice}>RWF {total.toLocaleString()}</Text>
          )}
        </View>
        <TouchableOpacity
          style={[styles.addToCartBtn, !product.available && styles.disabled]}
          onPress={handleAddToCart}
          disabled={!product.available || loading}
        >
          <MaterialCommunityIcons name="cart-plus" size={20} color="#fff" />
          <Text style={styles.cartText}>
            {(() => {
              if (loading) return 'Adding...';
              if (product.available) return 'Add to Cart';
              return 'Out of Stock';
            })()}
          </Text>
        </TouchableOpacity>
      </View>
      {message ? (
        <Text
          style={{
            color: message.includes('Failed') ? 'red' : 'green',
            marginTop: 8,
            textAlign: 'center',
          }}
        >
          {message}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: colors_fonts.background,
  },
  heroContainer: {
    position: 'relative',
  },
  container: {
    padding: 16,
  },
  image: {
    width: '100%',
    height: 220,
    marginBottom: 16,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 10,
  },
  heroTopBar: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconBtnRound: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  badgesRow: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingContainer: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 215, 0, 0.9)',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingText: { fontSize: 12, fontWeight: 'bold', color: '#000' },
  discountBadge: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: colors_fonts.secondary,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  discountText: {
    color: '#fff',
    fontWeight: '600',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  vendor: {
    fontSize: 16,
    marginBottom: 2,
    color: colors_fonts.secondary,
  },
  delivery: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
  },
  chipText: {
    color: '#333',
    fontSize: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    color: '#333',
    marginBottom: 12,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  qtyBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  qtyBtnLg: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    fontSize: 20,
  },
  qtyNumber: {
    fontSize: 18,
    fontWeight: '500',
    marginHorizontal: 12,
  },
  stickyBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    padding: 16,
    paddingBottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalLabel: {
    color: '#777',
    fontSize: 12,
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 2,
  },
  addToCartBtn: {
    backgroundColor: colors_fonts.primary,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  disabled: {
    backgroundColor: '#ccc',
  },
  cartText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  originalPrice: {
    fontSize: 16,
    color: '#999',
    textDecorationLine: 'line-through',
    textDecorationColor: 'red',
  },
  discountedPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors_fonts.primary,
  },
  regularPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors_fonts.primary,
  },
  discountBadgeSmall: {
    backgroundColor: colors_fonts.secondary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountTextSmall: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Total price styles
  totalPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  originalTotalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
    textDecorationColor: 'red',
  },
  discountedTotalPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: colors_fonts.primary,
  },
});

export default ProductDetailsScreen;
