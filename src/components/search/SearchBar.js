import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import style from '../../constants/colors_fonts';

const SearchBar = ({
  placeholder = "Search...",
  onChangeText,
  value,
  filter,
  onFilterChange,
  showFilter = true,
}) => {
  const [open, setOpen] = useState(false);
  const [items] = useState([
    { label: 'All', value: 'ALL' },
    { label: 'Products', value: 'PRODUCTS' },
    { label: 'Vendors', value: 'VENDORS' },
  ]);

  return (
    <View style={styles.container}>
      <Ionicons name="search" size={24} color="gray" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="gray"
        onChangeText={onChangeText}
        value={value}
      />
      {showFilter && (
        <DropDownPicker
          open={open}
          setOpen={setOpen}
          value={filter}
          setValue={onFilterChange}
          items={items}
          containerStyle={styles.dropdownContainer}
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropDownContainer}
          textStyle={{ fontSize: 14, color: style.text }}
          labelStyle={{ color: style.text }}
          arrowIconStyle={{ tintColor: 'gray' }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: style.background,
    borderRadius: 8,
    paddingLeft: 10,
    
    margin: 16,
    width: '90%',
    alignSelf: 'center',
    zIndex: 1000, // ensure dropdown floats above
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: style.text,
  },
  dropdownContainer: {
    width: 105,
    
    zIndex: 1000,
  },
  dropdown: {
    backgroundColor: style.background,
    borderColor: '#ccc',
  },
  dropDownContainer: {
    backgroundColor: style.background,
    borderColor: '#ccc',
    marginTop: 4,
    zIndex: 1000,
  },
});

export default SearchBar;
