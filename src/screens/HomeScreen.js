import {useEffect,useState , useCallback} from 'react';
import {ScrollView, View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
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
import SearchSkeleton from '../components/search/SearchSkeleton';
import {VendorAndProductSearch} from '../components/search/Vendors&Products'; // your custom search component
import { VendorSearch } from '../components/search/Vendors';
import { ProductSearch } from '../components/search/Products'; // if you have a separate search for products
import { useSearch } from '../hooks/useSearch'; // Import the custom hook

const HomeScreen = () => {
  // Replace all the search-related state with the useSearch hook
  const {
    searchText,
    filter,
    products,
    vendors,
    loadingProducts,
    loadingVendors,
    searchHistory,
    error,
    setSearchText,
    setFilter,
    clearSearch,
    retrySearch,
    setSearchFromHistory,
  } = useSearch();

  const [profileImage, setProfileImage] = useState(null);

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
          searchHistory={searchHistory}
          onHistoryItemPress={setSearchFromHistory}
        />
      </View>

      {/* Error State */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={retrySearch}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {searchText === "" ? (
        <ScrollView>
          <CategoryGrid filter={filter} />

          <Text style={styles.categoryLabel}>All Products:</Text>
          {loadingProducts ? (
            <SearchSkeleton type=""/>
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
            <SearchSkeleton type=""/>
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
        <VendorSearch vendors={vendors} searchText={searchText} loading={loadingVendors} />
      ) : filter === "PRODUCTS" ? (
        <ProductSearch products={products} searchText={searchText} loading={loadingProducts} />
      ) : (
        <VendorAndProductSearch 
          products={products} 
          vendors={vendors} 
          searchText={searchText} 
          loadingProducts={loadingProducts}
          loadingVendors={loadingVendors}
        />
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
    height: 230,
  },
  // New styles for improved UX
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    color: '#c62828',
    flex: 1,
    marginRight: 12,
  },
  retryButton: {
    backgroundColor: '#c62828',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 8,
    color: '#666',
    fontSize: 14,
  },
});

export default HomeScreen;
