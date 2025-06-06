import { useEffect, useState, useRef } from "react";
import { View, Text, Image, StyleSheet, Animated } from "react-native";
import imageMap from "../../constants/imageMap"; // adjust path as needed
import { useNavigation } from "@react-navigation/native";
import colors_fonts from "../../constants/colors_fonts"; // adjust path as needed

export default function VendorScreenInfo({ vendor: vendor, translateY: translateY }) {

 

 

  return (
    <Animated.View style={[styles.stickyHeader, { transform: [{ translateY }] }]}>
                 <View style={styles.vendorImageWrapper}>
            <Image
              source={imageMap[vendor.imageurl] || require('../../../assets/placeholder.jpg')}
              style={styles.vendorImage}
              resizeMode="cover"
            />
          </View>
              <View style={styles.vendorDetailsRow}>
                <View style={styles.vendorLeft}>
                  <Text style={styles.vendorType}>{vendor.vendorType}</Text>

                  <Text style={styles.desc}>{vendor.description || "No description available"}</Text>
                </View>
                <View style={styles.vendorRight}>
                  <Text style={styles.contactText}>📌 {vendor.location}</Text>
                  <Text style={styles.contactText}>📞 {vendor.phone}</Text>
                  <Text style={styles.contactText}>⭐ {vendor.averageRating}</Text>
                </View>
              </View>
            </Animated.View>
  );
}

const styles = StyleSheet.create({
     vendorImageWrapper: {
        width: '100%',
        height: '70%',
        backgroundColor: '#eee',
      },
      vendorImage: {
        width: '100%',
        height: '100%',
      },
      stickyHeader: {
        position: 'absolute',
        top: 0,
        width: '100%',
        height: 350,
        zIndex: 100,
       
       
      },
      vendorDetailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: colors_fonts.primary,
        width: '100%',
       
        paddingHorizontal: 16,
        paddingVertical: 12,
      },
      vendorLeft: {
        flex: 2,
        paddingRight: 12,
      },
      vendorRight: {
        flex: 1,
        justifyContent: 'center',
      },
      vendorType: {
        fontSize: 16,
        fontStyle: 'italic',
        marginBottom: 4,
        color: '#fff',
      },
      bio: {
        fontSize: 15,
        marginBottom: 4,
        color: '#fff',
      },
      desc: {
        fontSize: 14,
        color: '#ddd',
      },
      contactText: {
        fontSize: 14,
        color: '#fff',
        marginBottom: 4,
      },
      vendorInfo: {
        flex: 1,
         position: 'relative', // 👈 Add this!
      },
});