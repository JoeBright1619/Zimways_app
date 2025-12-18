import React, { useEffect, useState, useContext, useCallback } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Text,
  Alert,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
import VendorCartSection from '../components/cart/vendorCartSection';
import colors_fonts from '../constants/colors_fonts';
import AddressModal from '../components/cart/AddressModal';
import PaymentMethodModal from '../components/cart/PaymentMethodModal';
import { VendorProps } from '../type/vendor.type';
import { ProductProps } from '../type/product.type';
import { LocationProps } from '../type/location.type';
import { orderAPI, cartAPI } from '../services/api.service';

type VendorProducts = {
  [vendorId: string]: ProductProps[];
};

type MessageMap = {
  [vendorId: string]: string;
};

type PaymentMethod = {
  id: string;
  label: string;
};

const CartScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { backendUser } = useAuth();
  const [vendors, setVendors] = useState<VendorProps[]>([]);
  const [vendorProducts, setVendorProducts] = useState<VendorProducts>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [messages, setMessages] = useState<MessageMap>({});
  const [updating, setUpdating] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [DeliveryFee, setDeliveryFee] = useState<number>(1500);
  const [showAddressModal, setShowAddressModal] = useState<boolean>(false);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [selectedAddress, setSelectedAddress] = useState<LocationProps | null>(
    null,
  );
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(
    null,
  );
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const paymentMethods: PaymentMethod[] = [
    { id: 'CASH', label: 'Cash' },
    { id: 'CREDIT_CARD', label: 'Credit Card' },
    { id: 'DEBIT_CARD', label: 'Debit Card' },
    { id: 'MOBILE_MONEY', label: 'Mobile Money' },
    { id: 'BANK_TRANSFER', label: 'Bank Transfer' },
    { id: 'CRYPTO', label: 'Crypto' },
  ];
  const fetchVendorsAndProducts = async () => {
    setLoading(true);
    try {
      if (!backendUser || !backendUser.id) {
        throw new Error('No backend user found');
      }

      const vendorList: VendorProps[] = await cartAPI.cartVendors(
        backendUser.id,
      );
      setVendors(vendorList);
      const productsByVendor: VendorProducts = {};
      for (const vendor of vendorList) {
        const items = await cartAPI.cartItemsByVendor(
          backendUser.id,
          vendor.vendorId,
        );
        productsByVendor[vendor.vendorId] = items.map((item: any) => ({
          id: item.itemId,
          name: item.name || '',
          price: item.price || 0,
          quantity: item.quantity,
          description: item.description || '',
          imageUrl: item.imageUrl || '',
        }));
      }
      setVendorProducts(productsByVendor);
      setTotal(await cartAPI.getTotal(backendUser.id));
      setDeliveryFee(1500 * vendorList.length);
    } catch (err) {
      Alert.alert('Error', 'Failed to load cart');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (backendUser?.id) fetchVendorsAndProducts();
  }, [backendUser?.id]);

  useFocusEffect(
    useCallback(() => {
      // Refresh cart data when screen comes into focus
      fetchVendorsAndProducts();
    }, []),
  );

  const handleProductAction = async (
    action: 'increase' | 'decrease' | 'remove' | 'details',
    product: ProductProps,
    vendorId: string,
  ) => {
    setUpdating(true);
    try {
      if (!backendUser || !backendUser.id) {
        throw new Error('No backend user found');
      }
      if (action === 'increase') {
        await cartAPI.addItem(backendUser.id, product.id, 1);
      } else if (action === 'decrease') {
        await cartAPI.removeItem(backendUser.id, product.id, 1);
      } else if (action === 'remove') {
        await cartAPI.deleteItem(backendUser.id, product.id);
      } else if (action === 'details') {
        Alert.alert('Product Details', `Show details for ${product.name}`);
      }

      const vendorList: VendorProps[] = await cartAPI.cartVendors(
        backendUser.id,
      );
      setVendors(vendorList);
      const productsByVendor: VendorProducts = {};
      for (const vendor of vendorList) {
        const items = await cartAPI.cartItemsByVendor(
          backendUser.id,
          vendor.vendorId,
        );
        productsByVendor[vendor.vendorId] = items.map((item: any) => ({
          id: item.itemId,
          name: item.name || '',
          price: item.price || 0,
          quantity: item.quantity,
          description: item.description || '',
          imageUrl: item.imageUrl || '',
        }));
      }
      setVendorProducts(productsByVendor);
      setTotal(await cartAPI.getTotal(backendUser.id));
    } catch (err) {
      Alert.alert('Error', 'Action failed');
    } finally {
      setUpdating(false);
    }
  };

  const handleAddMore = (vendorName: string) => {
    Alert.alert('Add More', `Navigate to ${vendorName}'s products`);
  };

  const handleCheckout = async (customerId: string): Promise<void> => {
    try {
      setShowAddressModal(true);
      const response = await orderAPI.createOrder(customerId);
      const orderId = response.id;
      setCreatedOrderId(orderId); // Store for later use
    } catch (error) {
      console.error('Error creating order:', error);
      Alert.alert('Error', 'Failed to create order');
    }
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
      <View style={{ backgroundColor: colors_fonts.primary, height: 90 }} />
      <FlatList
        data={vendors}
        keyExtractor={(vendor) => vendor.vendorId}
        renderItem={({ item: vendor }) => (
          <VendorCartSection
            vendorName={vendor.name}
            products={vendorProducts[vendor.vendorId] || []}
            onAddMore={() => handleAddMore(vendor.name)}
            onProductAction={(action, product) =>
              handleProductAction(action, product, vendor.vendorId)
            }
            message={messages[vendor.vendorId] || ''}
            setMessage={(msg) =>
              setMessages((prev) => ({ ...prev, [vendor.vendorId]: msg }))
            }
          />
        )}
        contentContainerStyle={{ paddingBottom: 50 }}
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
              <Text style={styles.totalValueBold}>
                RWF {total + DeliveryFee}
              </Text>
            </View>
          </View>
        }
      />
      <View style={styles.fixedButtonContainer}>
        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={() => {
            if (backendUser?.id) {
              handleCheckout(backendUser.id);
            } else {
              // Handle the case where user is not logged in
              Alert.alert(
                'Authentication Required',
                'Please log in to proceed with checkout',
              );
              navigation.navigate('Login');
            }
          }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>
            Checkout
          </Text>
        </TouchableOpacity>
      </View>
      <AddressModal
        visible={showAddressModal}
        addresses={
          backendUser?.locations || [{ label: 'kicukiro' }, { label: 'remera' }]
        }
        onSelect={(address) => {
          setSelectedAddress(address);
          setShowAddressModal(false);
          setShowPaymentModal(true);
        }}
        onClose={() => setShowAddressModal(false)}
        onAddNew={() => null}
      />

      <PaymentMethodModal
        visible={showPaymentModal}
        paymentMethods={paymentMethods}
        onSelect={(method) => {
          if (
            method &&
            typeof method.id === 'string' &&
            typeof method.label === 'string'
          ) {
            setSelectedPayment({ id: method.id, label: method.label });
            setShowPaymentModal(false);
            navigation.navigate('Payment', {
              paymentMethod: { id: method.id, label: method.label },
              total: total + DeliveryFee,
              address: selectedAddress,
              orderId: createdOrderId,
            });
          } else {
            setSelectedPayment(null);
            setShowPaymentModal(false);
          }
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
