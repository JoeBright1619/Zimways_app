import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
type paymentMethod = {
  id?: string;
  label?: string;
};
type props = {
  visible: boolean;
  paymentMethods: paymentMethod[];
  onSelect: (method: paymentMethod) => void;
  onClose: () => void;
};
const PaymentMethodModal = ({
  visible,
  paymentMethods,
  onSelect,
  onClose,
}: props) => (
  <Modal visible={visible} transparent onRequestClose={onClose}>
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Choose Payment Method</Text>
        {(paymentMethods || []).map((method) => (
          <TouchableOpacity
            key={method.id}
            style={styles.modalOption}
            onPress={() => onSelect(method)}
          >
            <Text>{method.label}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.modalCancel}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
    width: '100%',
    alignItems: 'center',
  },
  modalCancel: {
    color: '#FF6347',
    marginTop: 20,
    fontWeight: 'bold',
  },
});

export default PaymentMethodModal;
