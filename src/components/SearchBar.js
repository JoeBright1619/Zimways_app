import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import icons from Expo
import style from '../constants/colors_fonts'; // Adjust the import path as needed
const SearchBar = ({ placeholder = "Search...", onChangeText, value }) => {
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: style.background, // Replace with your actual background color
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    margin: 16,
    width: '90%', // Occupy most of the screen width
    alignSelf: 'center',
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000', // Text color
  },
});

export default SearchBar;