import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import imageMap from '../../constants/imageMap'; // adjust path as needed
import { useNavigation } from '@react-navigation/native';
import { VendorProps } from '../../type/vendor.type'; // adjust path as needed
import { RootStackParamList } from '../../type/navigation.type';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Vendor'>;

const VendorCard = ({ vendor }: { vendor: VendorProps }) => {
  const navigation = useNavigation<NavigationProp>();
  const imageSource =
    imageMap[vendor.imageUrl] || require('../../../assets/placeholder.jpg');
  return (
    <TouchableOpacity onPress={() => navigation.navigate('Vendor', { vendor })}>
      <View style={styles.card}>
        <Image source={imageSource} style={styles.image} />
        <Text style={styles.name}>{vendor.name}</Text>
        <Text style={styles.type}>{vendor.vendorType}</Text>
        <Text style={styles.address}>{vendor.location}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>⭐ {vendor.averageRating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    width: 200, // fixed width
    height: 190, // fixed height
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

export default React.memo(VendorCard);
