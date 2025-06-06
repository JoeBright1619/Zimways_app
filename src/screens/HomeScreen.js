import {useEffect,useState ,React} from 'react';
import {ScrollView, View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import style from '../constants/colors_fonts'; // adjust if needed
import SearchBar from '../components/SearchBar'; // your custom search bar
import { Feather } from '@expo/vector-icons';
import ProductCard from '../components/product/productCard'; // your custom product card
import VendorCard from '../components/vendor/vendorCard'; 
import { FlatList } from 'react-native-gesture-handler'; // for better performance with large lists
import { pickAndSaveProfileImage } from '../helpers/profileHelper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchAllItems } from '../api/items';
import useVendors from '../api/useVendors';


const HomeScreen = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
   const { vendors, loadingVendors } = useVendors();
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
  const fetch = async () => {
    const data = await fetchAllItems();
    setProducts(data);
  };
  fetch();
}, []);


useEffect(() => {
  const loadProfileImage = async () => {
    const storedUri = await AsyncStorage.getItem('profileImageUri');
    if (storedUri) setProfileImage(storedUri);
  };
  loadProfileImage();
}, []);


  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  const handleProfileImageChange = async () => {
  const newUri = await pickAndSaveProfileImage();
  if (newUri) {
    setProfileImage(newUri); // 💥 this triggers UI to update
  }
};

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profiledetails}>
          <View style={styles.locationContainer}>
        <Text style={styles.label}>Delivery location:</Text>
        <TouchableOpacity style={styles.dropdown}>
          <Text style={styles.dropdownText}>Kigali, Rwanda</Text>
          <Feather name="chevron-down" size={16} color="black" />
        </TouchableOpacity>
      </View>
        <TouchableOpacity onPress={handleProfileImageChange} style={styles.profile}>
          <Image
            source={
              profileImage
                ? { uri: profileImage }
                : { uri: 'https://i.pravatar.cc/40' }
            }
            style={styles.profilePic}
          />
          <Feather name="chevron-down" size={16} color="black" style={styles.iconBelow} />
        </TouchableOpacity>

        </View>
        <SearchBar style={styles.searchBar} />

        
      </View>
    <ScrollView>
      <Text style={styles.categoryLabel}>All Products:</Text>
      <FlatList
    data={products}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => <ProductCard product={item} variant="home"/>}
    horizontal={true}
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.list}
    />
      <Text style={styles.categoryLabel}>All Vendors:</Text>
{
  loadingVendors ? (
    <ActivityIndicator size="large" color="#899305" />
  ) : (
    <FlatList
      data={vendors}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <VendorCard vendor={item} />}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.list}
    />
  )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'style.background',
  },
  header: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: style.primary,
    paddingTop: 60,
    width: '100%',
  },
  profiledetails:{
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',

  },
  profile:{
     alignItems: 'center',
     justifyContent: 'center',
  },
   locationContainer: {
    justifyContent: 'center',
  },
  label: {
    fontSize: 15,
    color: style.background,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownText: {
    marginRight: 4,
    fontSize: 20,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logoutBtn: {
    marginTop: 20,
    backgroundColor: 'crimson',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    width: '60%',
    alignSelf: 'center',
  },
  categoryLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  list: {
  paddingLeft: 20,
  paddingRight: 10,
  paddingVertical: 10,
  height: 230 ,
},

});

export default HomeScreen;
