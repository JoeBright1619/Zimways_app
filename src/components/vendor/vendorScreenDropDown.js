import {useState, useRef, useEffect} from 'react';

import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView } from 'react-native';
import DottedLine from './DottedLine'; // adjust path as needed
import Ionicons from 'react-native-vector-icons/Ionicons'; // ensure you have this installed
import colors_fonts from '../../constants/colors_fonts'; 
import { getCategoriesByVendorId } from '../../api/categories';

export default function VendorScreenDropDown({ vendor, selectedCategory, setSelectedCategory, translateY}) {
    const [showCategories, setShowCategories] = useState(false);
    const [categories, setCategories] = useState([]);
    const dropdownHeight = useRef(new Animated.Value(0)).current;
    const [contentVisible, setContentVisible] = useState(false);

    useEffect(() => {
      const fetchCategories = async () => {
        const data = await getCategoriesByVendorId(vendor.id);
        setCategories(data);
      };
      fetchCategories();
    }, [vendor.id]);

    const toggleDropdown = () => {
      if (!showCategories) {
        setShowCategories(true);
        setContentVisible(true);
        Animated.timing(dropdownHeight, {
          toValue: 250, // or adjust as needed
          duration: 300,
          useNativeDriver: false,
        }).start();
      } else {
        Animated.timing(dropdownHeight, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }).start(() => {
          setShowCategories(false);
          setContentVisible(false);
        });
      }
    };

  return (
     <Animated.View
            style={[
                styles.dropdownContainer,
                {
                transform: [{ translateY }],
                backgroundColor: showCategories ? 'white' : 'transparent',
                borderColor: showCategories ? colors_fonts.primary : 'transparent',
                },
            ]}
            >
             <TouchableOpacity
        style={[styles.dropdownButton, ]}
        onPress={toggleDropdown}
      >
        <Text style={styles.dropdownButtonText}>{selectedCategory}</Text>
        <Ionicons
          name={showCategories ? 'caret-up' : 'caret-down'}
          size={18}
          color="#fff"
        />
      </TouchableOpacity>
     <Animated.View style={{ height: dropdownHeight, overflow: 'hidden' }}>
  {contentVisible && (
    <ScrollView style={styles.dropdownMenu}>
      {/* "All" option */}
      <TouchableOpacity onPress={() => setSelectedCategory('All')}>
        <View style={styles.dropdownItemRow}>
          <Ionicons
            name="checkmark-sharp"
            size={16}
            color={selectedCategory === 'All' ? '#000' : 'transparent'}
            style={styles.icon}
          />
          <Text style={styles.dropdownItem}>All</Text>
        </View>
        <DottedLine color="#ccc" dotSize={1} gap={1} lineWidth="100%" />
      </TouchableOpacity>

      {/* Category options */}
      {categories?.map((cat, index) => (
        <TouchableOpacity key={index} onPress={() => setSelectedCategory(cat)}>
          <View style={styles.dropdownItemRow}>
            <Ionicons
              name="checkmark-sharp"
              size={16}
              color={selectedCategory === cat ? '#000' : 'transparent'}
              style={styles.icon}
            />
            <Text style={styles.dropdownItem}>{cat}</Text>
          </View>
          <DottedLine color="#ccc" dotSize={1} gap={1} lineWidth="100%" />
        </TouchableOpacity>
      ))}
    </ScrollView>
  )}
</Animated.View>
    </Animated.View>
  );
}
const styles = StyleSheet.create({
   dropdownContainer: {
    position: 'absolute',
    top: 345, // same as stickyHeader height
    left: 10,
    zIndex: 200,
    backgroundColor: colors_fonts.primary,
    borderRadius: 15,
    width: '50%',
    
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    overflow: 'hidden',
    borderColor: colors_fonts.primary,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors_fonts.secondary,
    padding: 10,
    borderRadius: 15,
    zIndex: 210,
  },
  dropdownButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    
  },
  dropdownMenu: {
    
    backgroundColor: '#fff',
    borderEndEndRadius:15,
    borderEndStartRadius:15,
    height: 250,
    zIndex: 100,
    borderColor: colors_fonts.primary,
  },
  dropdownItem: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    fontSize: 14,
    color: '#333',
    
    
    borderBottomColor: '#eee',
  },
  
  dropdownItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  
  
  icon: {
    marginRight: 8,
  },
});