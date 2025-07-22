import React, { useEffect, useState, useContext } from 'react';
import { View, Modal, TouchableOpacity, FlatList, ActivityIndicator, Text, Alert, StyleSheet, SafeAreaView } from 'react-native';
import { cartAPI } from '../services/api.service';
import { AuthContext } from '../context/AuthContext';
import VendorCartSection from '../components/cart/vendorCartSection';
import colors_fonts from '../constants/colors_fonts';
import AddressModal from '../components/cart/AddressModal';
import PaymentMethodModal from '../components/cart/PaymentMethodModal';

const CartScreen = () => {
  const { backendUser } = useContext(AuthContext);
  const [vendors, setVendors] = useState([]);
  const [vendorProducts, setVendorProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState({}); // { vendorId: message }
  const [updating, setUpdating] = useState(false);
  const [total, setTotal] = useState(0);
  const [DeliveryFee, setDeliveryFee] = useState(1500); // Assuming a fixed delivery fee
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const paymentMethods = [
    { id: '1', label: 'Mobile Money' },
    { id: '2', label: 'Cash on Delivery' },
    { id: '3', label: 'Card Payment' },
  ];
  useEffect(() => {
    const fetchVendorsAndProducts = async () => {
      setLoading(true);
      try {
        const vendorList = await cartAPI.cartVendors(backendUser.id);
        setVendors(vendorList);
        const productsByVendor = {};
        for (const vendor of vendorList) {
          const items = await cartAPI.cartItemsByVendor(backendUser.id, vendor.vendorId);
          productsByVendor[vendor.vendorId] = items.map(item => ({
            id: item.itemId,
            name: item.name || '',
            price: item.price || 0,
            quantity: item.quantity,
            description: item.description || '',
            imageUrl: item.imageUrl || '', // Assuming imageUrl is part of the item
          }));
        }
        setVendorProducts(productsByVendor);
        setTotal(await cartAPI.getTotal(backendUser.id)); // Initialize total
        setDeliveryFee(1500 * vendorList.length); // Example: 1500 RWF per vendor
      } catch (err) {
        Alert.alert('Error', 'Failed to load cart');
      } finally {
        setLoading(false);
      }
    };
    if (backendUser?.id) fetchVendorsAndProducts();
  }, [backendUser?.id]);

  const handleProductAction = async (action, product, vendorId) => {
    setUpdating(true);
    try {
      if (action === 'increase') {
        await cartAPI.addItem(backendUser.id, product.id, 1);
      } else if (action === 'decrease') {
        await cartAPI.removeItem(backendUser.id, product.id, 1);
      } else if (action === 'remove') {
        await cartAPI.deleteItem(backendUser.id, product.id);
      } else if (action === 'details') {
        // Implement navigation to product details if needed
        Alert.alert('Product Details', `Show details for ${product.name}`);
      }
    
    const vendorList = await cartAPI.cartVendors(backendUser.id);
    setVendors(vendorList);
    const productsByVendor = {};
    for (const vendor of vendorList) {
      const items = await cartAPI.cartItemsByVendor(backendUser.id, vendor.vendorId);
      productsByVendor[vendor.vendorId] = items.map(item => ({
        id: item.itemId,
        name: item.name || '',
        price: item.price || 0,
        quantity: item.quantity,
        description: item.description || '',
        imageUrl: item.imageUrl || '',
      }));
    }
    setVendorProducts(productsByVendor);
    setTotal(await cartAPI.getTotal(backendUser.id));} catch (err) {
      Alert.alert('Error', 'Action failed');
    } finally {
      setUpdating(false);
    }
  };

  const handleAddMore = (vendorName) => {
    // Implement navigation to vendor's product list if needed
    Alert.alert('Add More', `Navigate to ${vendorName}'s products`);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading cart...</Text>
      </SafeAreaView>
    );
  }

    if (!vendors.length) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Your cart is empty.</Text>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={{ backgroundColor: colors_fonts.primary, height: "90" }}></View>
      <FlatList
        data={vendors}
        keyExtractor={vendor => vendor.vendorId}
        renderItem={({ item: vendor }) => (
          <VendorCartSection
            vendorName={vendor.name}
            products={vendorProducts[vendor.vendorId] || []}
            onAddMore={() => handleAddMore(vendor.name)}
            onProductAction={(action, product) => handleProductAction(action, product, vendor.vendorId)}
            message={messages[vendor.vendorId] || ''}
            setMessage={msg => setMessages(prev => ({ ...prev, [vendor.vendorId]: msg }))}
          />
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListFooterComponent={
          
        <View style={styles.totalCard}>
          <View style={styles.totalLine}>
            <Text style={styles.totalLabel}>Sub Total</Text>
            <Text style={styles.totalValue}>RWF {total}</Text>
          </View>
          <View style={styles.totalLine}>
            <Text style={styles.totalLabel}>Container Charge</Text>
            <Text style={styles.totalValue}>RWF 0</Text>
          </View>
          <View style={styles.totalLine}>
            <Text style={styles.totalLabel}>Delivery Fee</Text>
            <Text style={styles.totalValue}>RWF {DeliveryFee}</Text>
          </View>
          <View style={styles.totalDivider} />
          <View style={styles.totalLine}>
            <Text style={styles.totalLabelBold}>Total Amount</Text>
            <Text style={styles.totalValueBold}>RWF {total + DeliveryFee}</Text>
          </View>
        </View>
      }
      />
    <View style={styles.fixedButtonContainer}>
      <TouchableOpacity
        style={styles.checkoutBtn}
        onPress={() => setShowAddressModal(true)}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>Checkout</Text>
      </TouchableOpacity>
    </View>
    <AddressModal
  visible={showAddressModal}
  addresses={backendUser.locations || [{ label: "kicukiro" }, { label: "remera" }]}
  onSelect={address => {
    setSelectedAddress(address);
    setShowAddressModal(false);
    setShowPaymentModal(true);
  }}
  onClose={() => setShowAddressModal(false)}
/>

<PaymentMethodModal
  visible={showPaymentModal}
  paymentMethods={paymentMethods}
  onSelect={method => {
    setSelectedPayment(method);
    setShowPaymentModal(false);
    navigation.navigate('PaymentInfo', { address: selectedAddress, paymentMethod: method });
  }}
  onClose={() => setShowPaymentModal(false)}
/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    backgroundColor: colors_fonts.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  itemName: {
    flex: 2,
    fontSize: 16,
  },
  itemQty: {
    flex: 1,
    fontSize: 15,
    textAlign: 'center',
  },
  itemPrice: {
    flex: 1,
    fontSize: 15,
    textAlign: 'right',
  },
  removeBtn: {
    backgroundColor: '#FF6347',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 10,
  },
  totalCard: {
  backgroundColor: colors_fonts.tile_background,

  marginBottom: 30,
  padding: 18,
  borderRadius: 12,
  width: '92%',
  alignSelf: 'center',
  elevation: 2,
},
totalLine: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginVertical: 4,
},
totalLabel: {
  fontSize: 15,
  color: colors_fonts.text,
},
totalValue: {
  fontSize: 15,
  color: colors_fonts.text,
},
totalLabelBold: {
  fontSize: 17,
  fontWeight: 'bold',
  color: colors_fonts.primary,
},
totalValueBold: {
  fontSize: 17,
  fontWeight: 'bold',
  color: colors_fonts.primary,
},
totalDivider: {
  borderBottomWidth: 1,
  borderColor: '#ddd',
  marginVertical: 10,
},
  fixedButtonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    alignItems: 'center',
    zIndex: 100,
    elevation: 20,
  },
  checkoutBtn: {
    backgroundColor: colors_fonts.secondary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    width: '80%',
  },

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

export default CartScreen;
