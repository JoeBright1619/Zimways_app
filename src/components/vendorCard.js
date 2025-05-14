import { View, Text, Image, StyleSheet } from 'react-native';
import {useEffect,useState, React} from 'react';
import imageMap from '../constants/imageMap'; // adjust path as needed

export default function VendorCard({ vendor }) {
  const imageSource = imageMap[vendor.imageurl] || require('../../assets/placeholder.jpg');
  return (
    <View style={styles.card}>
      <Image source={imageSource} style={styles.image} />
      <Text style={styles.name}>{vendor.vendorName}</Text>
      <Text style={styles.type}>{vendor.vendorType}</Text>
      <Text style={styles.address}>{vendor.address}</Text>
      <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>⭐ {vendor.rating}</Text>
        </View>
    </View>
  );
  
}

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
  type: {
    color: '#555',
    fontSize: 12,
    marginTop: 4,
  },
  address: {
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

