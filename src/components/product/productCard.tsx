import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import imageMap from '../../constants/imageMap';
import { ProductProps } from '../../type/product.type';
import { RootStackParamList } from '../../type/navigation.type';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProductDetails'>;

const ProductCard = ({ product, variant = 'home' }: {product: ProductProps, variant: 'home'|'vendor'}) => {
  
  const navigation = useNavigation<NavigationProp>();

  const imageSource = imageMap[product.imageUrl] || require('../../../assets/placeholder.jpg');
  const styles = variant === 'vendor' ? vendorStyles : homeStyles;
  
  return (
    <TouchableOpacity onPress={() => navigation.navigate('ProductDetails', { product })}>
      <View style={styles.card}>
        {variant === 'home' && (
          <>
            <Image source={imageSource} style={styles.image} />
            <Text style={styles.name}>{product.name}</Text>
            <Text style={styles.desc}>{product.vendorName || 'Unknown Vendor'}</Text>
            <Text style={styles.price}>RWF {product.price}</Text>
            <View style={homeStyles.ratingContainer}>
              <Text style={homeStyles.ratingText}>⭐ {product.averageRating || 0}</Text>
            </View>
          </>
        )}

        {variant === 'vendor' && (
          <>
            <View style={vendorStyles.info}>
              <Text style={styles.name}>{product.name }</Text>
              <Text style={styles.desc}>By {product.description || 'No description'}</Text>

              <Text style={styles.price}>RWF {product.price}</Text>
              
                
            </View>
            <Image source={imageSource} style={styles.image} />
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};


// Styles for home layout (horizontal scroll card)
const homeStyles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    width: 160,
    height: 190,
    borderRadius: 10,
    marginRight: 15,
    elevation: 3,
    alignItems: 'flex-start',
    position: 'relative',
  },
  image: {
    height: 100,
    width: '100%',
    borderTopEndRadius: 8,
    borderTopStartRadius: 8,
    resizeMode: 'cover',
    backgroundColor: '#f0f0f0',
  },
  name: { fontWeight: 'bold', marginTop: 6, paddingHorizontal: 6 },
  desc: { color: '#555', fontSize: 12, marginTop: 4, paddingHorizontal: 6 },
  price: { fontSize: 14, fontWeight: '600', marginTop: 6, color: '#000', paddingHorizontal: 6 },
  ratingContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(255, 215, 0, 0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderBottomLeftRadius: 6,
  },
  ratingText: { fontSize: 12, fontWeight: 'bold', color: '#000' },
});

// Styles for vendor layout (row card)
const vendorStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginVertical: 6,
    marginHorizontal: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  info: {
    flex: 1,
    paddingRight: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  desc: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    color: '#899305',
    marginBottom: 6,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginLeft: 10,
    backgroundColor: '#eee',
  },
});

export default ProductCard;
