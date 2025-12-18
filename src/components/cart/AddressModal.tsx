import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  FlatList,
  Dimensions,
} from 'react-native';
import { LocationProps } from '../../type/location.type';

type Props = {
  visible: boolean;
  addresses: LocationProps[] | undefined;
  onSelect: (address: LocationProps) => void;
  onClose: () => void;
  onAddNew: () => void; // 👈 new callback for navigation
  styles?: object;
};

const { height } = Dimensions.get('window');

const AddressModal = ({
  visible,
  addresses,
  onSelect,
  onClose,
  onAddNew,
  styles: parentStyles = {},
}: Props) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    onRequestClose={onClose}
  >
    {/* Overlay */}
    <Pressable style={styles.modalOverlay} onPress={onClose}>
      {/* Stop propagation so tapping inside doesn’t close modal */}
      <Pressable style={[styles.modalContent, parentStyles]} onPress={() => {}}>
        {/* Close (X) button */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>×</Text>
        </TouchableOpacity>

        <Text style={styles.modalTitle}>Choose Delivery Address</Text>

        {/* Scrollable address list */}
        <FlatList
          data={addresses || []}
          keyExtractor={(item, index) => item.id ?? index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => onSelect(item)}
            >
              <Text>
                {item.fullAddress
                  ? item.fullAddress
                  : `${item.district || ''}, ${item.sector || ''}`}
              </Text>
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={false}
          snapToInterval={60} // 👈 gives it that snapping effect
          decelerationRate="fast"
          style={styles.list}
          contentContainerStyle={{ paddingBottom: 20 }}
        />

        {/* Add new address */}
        <TouchableOpacity onPress={onAddNew}>
          <Text style={styles.addNewText}>+ Add New Address</Text>
        </TouchableOpacity>
      </Pressable>
    </Pressable>
  </Modal>
);

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    maxHeight: height * 0.6, // limit height so list can scroll
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  list: {
    width: '100%',
    flexGrow: 0,
  },
  modalOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
    width: '100%',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    padding: 5,
  },
  closeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  addNewBtn: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  addNewText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007bff',
  },
});

export default AddressModal;
