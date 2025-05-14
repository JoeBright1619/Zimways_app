import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import imageMap from '../constants/imageMap';
import { getVendorById } from '../helpers/vendorHelper';
import { useNavigation } from '@react-navigation/native';

const ProductCard = ({ product }) => {
  const navigation = useNavigation();
  const imageSource = imageMap[product.imageUrl] || require('../../assets/placeholder.jpg');
  const [vendorName, setVendorName] = useState('Loading...');

  useEffect(() => {
    const fetchVendor = async () => {
      const vendor = await getVendorById(product.vendorId);
      setVendorName(vendor ? vendor.vendorName : 'Unknown Vendor');
    };

    fetchVendor();
  }, [product.vendorId]);

  return (
   <TouchableOpacity onPress={() => navigation.navigate('ProductDetails', { product })}>
      <View style={styles.card}>
        <Image source={imageSource} style={styles.image} />
        <Text style={styles.name}>{product.productName}</Text>
        <Text style={styles.desc}>{vendorName}</Text>
        <Text style={styles.price}>RWF {product.price}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>⭐ {product.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    width: 200,             // fixed width
    height: 190,            // fixed height
    borderRadius: 10,
    
    marginRight: 15,
    elevation: 3,
    alignItems: 'flex-start', // aligns content to left
  },
  image: {
    height: 100,
    width: '100%',
    borderTopEndRadius: 8,
    borderTopStartRadius: 8,
    resizeMode: 'cover',
    backgroundColor: '#f0f0f0',
  },
  name: {
    fontWeight: 'bold',
    marginTop: 6,
  },
  desc: {
    color: '#555',
    fontSize: 12,
    marginTop: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 6,
    color: '#000',
  },
  ratingContainer: {
  position: 'absolute',
  top: 0,
  right: 0,
  backgroundColor: 'rgba(255, 215, 0, 0.9)', // gold color with slight transparency
  paddingHorizontal: 6,
  paddingVertical: 2,
  borderRadius: 6,
  zIndex: 1,
},
ratingText: {
  fontSize: 12,
  fontWeight: 'bold',
  color: '#000',
},

});

export default ProductCard;
