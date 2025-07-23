import React, { useState, useRef } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, FlatList, Modal } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import style from '../../constants/colors_fonts';

type searchBarProps = {
  placeholder: string;
  onChangeText: (text: string) => void;
  value: string;
  filter: string;
  onFilterChange: React.Dispatch<React.SetStateAction<string>>; // ✅ correct
  showFilter: boolean;
 
  searchHistory: string[];
  onHistoryItemPress: (item: string) => void;
}

const SearchBar = ({
  placeholder = "Search...",
  onChangeText,
  value,
  filter,
  onFilterChange,
  showFilter = true,
  searchHistory = [],
  onHistoryItemPress,
}: searchBarProps) => {
  const [open, setOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [items] = useState([
    { label: 'All', value: 'ALL' },
    { label: 'Products', value: 'PRODUCTS' },
    { label: 'Vendors', value: 'VENDORS' },
  ]);

  const inputRef = useRef<TextInput>(null);

  const handleFocus = () => {
    if (searchHistory.length > 0 && !value) {
      setShowHistory(true);
    }
  };

  const handleBlur = () => {
    // Delay hiding history to allow for item selection
    setTimeout(() => setShowHistory(false), 200);
  };

  const handleHistoryItemPress = (item: string) => {
    onHistoryItemPress?.(item);
    setShowHistory(false);
    inputRef.current?.blur();
  };

  const clearSearch = () => {
    onChangeText('');
    setShowHistory(false);
  };

  const renderHistoryItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.historyItem}
      onPress={() => handleHistoryItemPress(item)}
    >
      <Ionicons name="time-outline" size={16} color="#666" />
      <Text style={styles.historyText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={24} color="gray" style={styles.icon} />
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="gray"
          onChangeText={onChangeText}
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          returnKeyType="search"
        />
        {value ? (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color="gray" />
          </TouchableOpacity>
        ) : null}
      </View>
      
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
          ArrowDownIconComponent={() => (
            <MaterialCommunityIcons name="chevron-down" size={20} color="grey" />
          )}
          ArrowUpIconComponent={() => (
            <MaterialCommunityIcons name="chevron-up" size={20} color="black" />
          )}
        />
      )}

      {/* Search History Modal */}
      <Modal
        visible={showHistory}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowHistory(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowHistory(false)}
        >
          <View style={styles.historyContainer}>
            <View style={styles.historyHeader}>
              <Text style={styles.historyTitle}>Recent Searches</Text>
              <TouchableOpacity onPress={() => setShowHistory(false)}>
                <Ionicons name="close" size={20} color="#666" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={searchHistory}
              renderItem={renderHistoryItem}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </TouchableOpacity>
      </Modal>
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
    zIndex: 1000,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: style.text,
    paddingVertical: 12,
  },
  clearButton: {
    padding: 4,
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
  // New styles for search history
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 200, // Position below search bar
  },
  historyContainer: {
    backgroundColor: style.background,
    borderRadius: 8,
    width: '90%',
    maxHeight: 300,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: style.text,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  historyText: {
    marginLeft: 12,
    fontSize: 14,
    color: style.text,
  },
});

export default SearchBar;
