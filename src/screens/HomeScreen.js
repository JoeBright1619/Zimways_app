import {useEffect,useState , useCallback} from 'react';
import {ScrollView, View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import style from '../constants/colors_fonts'; // adjust if needed
import SearchBar from '../components/search/SearchBar'; // your custom search bar
import { Feather } from '@expo/vector-icons';
import ProductCard from '../components/product/productCard'; // your custom product card
import VendorCard from '../components/vendor/vendorCard'; 
import { FlatList } from 'react-native-gesture-handler'; // for better performance with large lists
import debounce from 'lodash.debounce';
import { pickAndSaveProfileImage } from '../helpers/profileHelper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CategoryGrid from '../components/CategoryGrid';
import { vendorsAPI, productsAPI } from '../services/api.service';
import {VendorAndProductSearch} from '../components/search/Vendors&Products'; // your custom search component
import { VendorSearch } from '../components/search/Vendors';
import { ProductSearch } from '../components/search/Products'; // if you have a separate search for products


const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingVendors, setLoadingVendors] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  const [searchText, setSearchText] = useState('');
  const [debouncedText, setDebouncedText] = useState('');
  const [filter, setFilter] = useState('ALL');

  // ✅ Debounced update function
  const debouncedUpdate = useCallback(
    debounce((text) => {
      setDebouncedText(text);
    }, 1000),
    []
  );

  // ✅ Call debounce when searchText changes
  useEffect(() => {
    debouncedUpdate(searchText);
    return () => debouncedUpdate.cancel();
  }, [searchText]);

  // ✅ Fetch on debouncedText or filter change
  useEffect(() => {
    const fetch = async () => {
      try {
        if (filter === 'ALL' || filter === 'PRODUCTS') {
          setLoadingProducts(true);
          const productData = await productsAPI.getBySearch(debouncedText);
          setProducts(productData);
        }

        if (filter === 'ALL' || filter === 'VENDORS') {
          setLoadingVendors(true);
          const vendorData = await vendorsAPI.getBySearch(debouncedText);
          setVendors(vendorData);
        }

        console.log('Fetching for:', debouncedText);
      } catch (err) {
        console.error('Error fetching search data:', err);
      } finally {
        setLoadingProducts(false);
        setLoadingVendors(false);
      }
    };

    fetch();
  }, [debouncedText, filter]); // <-- this was wrong before

  // ✅ Load profile image
  useEffect(() => {
    const loadProfileImage = async () => {
      const storedUri = await AsyncStorage.getItem('profileImageUri');
      if (storedUri) setProfileImage(storedUri);
    };
    loadProfileImage();
  }, []);

  const handleProfileImageChange = async () => {
    const newUri = await pickAndSaveProfileImage();
    if (newUri) {
      setProfileImage(newUri);
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

        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          filter={filter}
          onFilterChange={setFilter}
          showFilter={true}
        />
      </View>
{searchText === "" ? (
      <ScrollView>


        <CategoryGrid filter={filter} />

        <Text style={styles.categoryLabel}>All Products:</Text>
        {
          loadingProducts ? (
          <ActivityIndicator size="large" color={style.primary} />
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ProductCard product={item} variant="home" />}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.list}
          />
        )}

        <Text style={styles.categoryLabel}>All Vendors:</Text>
        {loadingVendors ? (
          <ActivityIndicator size="large" color={style.primary} />
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
      ) : filter === "VENDORS" ? (
  <VendorSearch vendors={vendors} searchText={searchText} />
) : filter === "PRODUCTS" ? (
  <ProductSearch products={products} searchText={searchText} />
) : (
  <VendorAndProductSearch products={products} vendors={vendors} searchText={searchText} />
)}
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
