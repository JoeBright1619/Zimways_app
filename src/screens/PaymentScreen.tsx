import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { CommonActions, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import colors_fonts from "../constants/colors_fonts";
import DropDownPicker from "react-native-dropdown-picker";
import KeyboardDismissWrapper from "../components/keyboardDismissWrapper";
import LoadingOverlay from "../components/LoadingOverlay";
import { orderAPI } from "../services/api.service";
type PaymentMethod = {
  id: string;
  label: string;
};

type PaymentScreenParams = {
  Payment: {
    paymentMethod: PaymentMethod;
    total?: number;
    address?: any;
    orderId?: any
  };
};

const PaymentScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<PaymentScreenParams, "Payment">>();
  const { paymentMethod, total, address, orderId } =
    route.params || ({ paymentMethod: { label: "Payment" } } as any);

  const methodLabel = (paymentMethod?.label || "").toLowerCase();

  const isCard = useMemo(() => methodLabel.includes("card"), [methodLabel]);
  const isMobileMoney = useMemo(
    () => methodLabel.includes("mobile"),
    [methodLabel]
  );
  const isCash = useMemo(() => methodLabel.includes("cash"), [methodLabel]);
  const isBank = useMemo(() => methodLabel.includes("bank"), [methodLabel]);

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const [mobileNumber, setMobileNumber] = useState("");
  const [mobileProvider, setMobileProvider] = useState<string | null>("MTN");
  const [openProvider, setOpenProvider] = useState(false);
  const [mobileProviders] = useState([
    { label: "MTN", value: "MTN" },
    { label: "Airtel", value: "Airtel" },
    { label: "Econet", value: "Econet" },
  ]);
  const [recipientName, setRecipientName] = useState("");
  const [notes, setNotes] = useState("");

  const [accountNumber, setAccountNumber] = useState("");
  const [reference, setReference] = useState("");

  const [processing, setProcessing] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [paymentId, setPaymentId] = useState("");
  
  useEffect(() => {
    let isMounted = true;
  
    const updateOrderStatus = async () => {
      if (!orderId) return;
      
      setUpdatingStatus(true);
      try {
        const response = await orderAPI.createPayment(orderId, paymentMethod.id);
        setPaymentId(response.data.id);
        if (isMounted) {
          console.log('Order status updated:', response);
          // You might want to update local state with the new status
        }
      } catch (error) {
        if (isMounted) {
          console.error('Update failed:', error);
          Alert.alert('Error', 'Could not update order status');
        }
      } finally {
        if (isMounted) {
          setUpdatingStatus(false);
        }
      }
    };
  
    updateOrderStatus();
  
    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
    };
  }, [orderId]); // Only run when orderId changes
  
  const handlePay = async () => {
    if (!orderId || !paymentMethod?.id) {
      Alert.alert('Error', 'Missing required information');
      return;
    }
  
    setProcessing(true);
  
    try {
      // Show processing state for 2-4 seconds (random for realism)
      const processingTime = 2000 + Math.random() * 2000;
      await new Promise(resolve => setTimeout(resolve, processingTime));
  
      // Update order status in backend
      const response = await orderAPI.processPayment(paymentId);
      
      if (response.status === 200) {
        // Navigate to success screen
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              { 
                name: 'MainTabs', 
                params: { 
                  screen: 'Home' 
                } 
              }
            ],
          })
        );
      } else {
        throw new Error('Payment processing failed');
      }
    } catch (error: any) {
      Alert.alert(
        'Payment Processing', 
        error.message || 'Payment failed. Please try again.'
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <KeyboardDismissWrapper>
      <View style={styles.container}>
        <LoadingOverlay visible={processing} message="Payment processing..." />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {paymentMethod?.label || "Payment"}
          </Text>
          {typeof total === "number" && (
            <Text style={styles.headerSubtitle}>Total: RWF {total}</Text>
          )}
        </View>

        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.content}>
            {/* Address summary if provided */}
            {address ? (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Delivery Address</Text>
                <Text style={styles.cardText}>
                  {JSON.stringify(address.fullAddress)}
                </Text>
              </View>
            ) : null}

            {/* Mobile Money Form */}
            {isMobileMoney && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Mobile Money Details</Text>
                <TextInput
                  placeholder="Mobile Number"
                  value={mobileNumber}
                  onChangeText={setMobileNumber}
                  keyboardType="phone-pad"
                  style={styles.input}
                />
                <DropDownPicker
                  open={openProvider}
                  setOpen={setOpenProvider}
                  value={mobileProvider}
                  setValue={setMobileProvider}
                  multiple={false}
                  items={mobileProviders}
                  flatListProps={{
                    nestedScrollEnabled: true,
                  }}
                />
              </View>
            )}

            {/* Card Payment Form (Credit/Debit) */}
            {isCard && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Card Details</Text>
                <TextInput
                  placeholder="Name on Card"
                  value={cardName}
                  onChangeText={setCardName}
                  style={styles.input}
                  returnKeyType="next"
                />
                <TextInput
                  placeholder="Card Number"
                  value={cardNumber}
                  onChangeText={setCardNumber}
                  keyboardType="numeric"
                  style={styles.input}
                  returnKeyType="next"
                />
                <View style={{ flexDirection: "row", gap: 12 }}>
                  <TextInput
                    placeholder="MM/YY"
                    value={expiry}
                    onChangeText={setExpiry}
                    style={[styles.input, { flex: 1 }]}
                    returnKeyType="next"
                  />
                  <TextInput
                    placeholder="CVV"
                    value={cvv}
                    onChangeText={setCvv}
                    keyboardType="numeric"
                    style={[styles.input, { flex: 1 }]}
                    returnKeyType="done"
                  />
                </View>
              </View>
            )}

            {/* Cash on Delivery */}
            {isCash && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Cash on Delivery</Text>
                <TextInput
                  placeholder="Recipient Name"
                  value={recipientName}
                  onChangeText={setRecipientName}
                  style={styles.input}
                  returnKeyType="next"
                />
                <TextInput
                  placeholder="Delivery Notes (optional)"
                  value={notes}
                  onChangeText={setNotes}
                  style={styles.input}
                  returnKeyType="done"
                />
              </View>
            )}

            {/* Bank Transfer */}
            {isBank && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Bank Transfer Details</Text>
                <TextInput
                  placeholder="Account Number"
                  value={accountNumber}
                  onChangeText={setAccountNumber}
                  keyboardType="numeric"
                  style={styles.input}
                  returnKeyType="next"
                />
                <TextInput
                  placeholder="Payment Reference"
                  value={reference}
                  onChangeText={setReference}
                  style={styles.input}
                  returnKeyType="done"
                />
                <Text style={styles.helperText}>
                  We will verify your transfer and confirm the order.
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.payButton}
              onPress={handlePay}
              disabled={processing}
            >
              <Text style={styles.payButtonText}>
                {processing ? "Processing..." : "Pay Now"}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </KeyboardDismissWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors_fonts.background,
  },
  header: {
    backgroundColor: colors_fonts.primary,
    paddingTop: 50,
    paddingBottom: 16,
    alignItems: "center",
  },
  headerTitle: {
    color: colors_fonts.white,
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: colors_fonts.primary_font,
  },
  headerSubtitle: {
    color: colors_fonts.white,
    marginTop: 4,
    fontFamily: colors_fonts.secondary_font,
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: colors_fonts.tile_background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors_fonts.text,
    marginBottom: 12,
    fontFamily: colors_fonts.primary_font,
  },
  cardText: {
    color: colors_fonts.text,
    fontFamily: colors_fonts.secondary_font,
  },
  input: {
    backgroundColor: colors_fonts.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  helperText: {
    color: "#666",
    fontSize: 12,
  },
  payButton: {
    backgroundColor: colors_fonts.secondary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  payButtonText: {
    color: colors_fonts.white,
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default PaymentScreen;
