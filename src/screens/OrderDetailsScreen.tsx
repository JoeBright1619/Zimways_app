import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import colors_fonts from "../constants/colors_fonts";
import { RootStackParamList } from "../type/navigation.type";
import { RouteProp } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // Adjust the import based on your icon library
import OrderProgress from "../components/order/orderStatus";
import { orderAPI } from "../services/api.service";
import { OrderProps } from "../type/order.type";

type OrderDetailsScreenProps = {
  route: RouteProp<RootStackParamList, "OrderDetails">;
};

const OrderDetailsScreen: React.FC<OrderDetailsScreenProps> = ({ route }) => {
  const { order } = route.params;
  const [loading, setLoading] = useState<boolean>(false);
  const [currentOrder, setCurrentOrder] = useState<OrderProps>(order);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [expandVendor, setExpandVendor] = useState<{ [key: string]: boolean }>(
    {}
  );

  useEffect(() => {
    if (currentOrder?.vendors) {
      const initialExpand: { [key: string]: boolean } = {};
      currentOrder.vendors.forEach((vendor) => {
        initialExpand[vendor.vendorId] = false;
      });
      setExpandVendor(initialExpand);
    }
  }, [currentOrder]);

  // Poll order status periodically and update UI live
  useEffect(() => {
    const terminalStatuses = new Set([
      "DELIVERED",
      "COMPLETED",
      "PAYMENT_FAILED",
      "CANCELLED_BY_CUSTOMER",
      "REFUNDED",
      "CANCELLED_BY_RESTAURANT",
      "FAILED",
      "CANCELLED_BY_SYSTEM",
    ]);

    if (!currentOrder?.id) return;
    if (terminalStatuses.has(currentOrder.status)) return;

    let isMounted = true;
    const intervalId = setInterval(async () => {
      try {
        const latest = await orderAPI.getOrderById(currentOrder.id);
        if (!isMounted) return;
        if (latest && latest.status && latest.status !== currentOrder.status) {
          setCurrentOrder((prev) => ({ ...prev, ...latest }));
        }
      } catch (e) {
        // Silently ignore polling errors
      }
    }, 5000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [currentOrder?.id, currentOrder?.status]);

  const toggleVendor = (vendorId: string) => {
    setExpandVendor((prev) => ({
      ...prev,
      [vendorId]: !prev[vendorId],
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors_fonts.primary} />
        <Text style={styles.loadingText}>Loading order details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.detailsContainer}>
          {/* Order Summary Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Delivery Status:</Text>
            </View>

            <OrderProgress status={currentOrder.status} />
          </View>

          {/* Order Items */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Order Details:</Text>
            <Text style={styles.subTitle}>Vendors:</Text>
            <View style={styles.vendorsContainer}>
              {currentOrder.vendors.map((vendor, index) => (
                <View key={vendor.vendorId} style={styles.vendor}>
                  {/* Dropdown header */}
                  <TouchableOpacity
                    style={styles.vendorHeader}
                    onPress={() => toggleVendor(vendor.vendorId)}
                  >
                    <Text style={styles.vendorName}>
                      {index + 1}. {vendor.vendorName}
                    </Text>
                    <MaterialCommunityIcons
                      name={
                        expandVendor[vendor.vendorId] === true
                          ? "chevron-up"
                          : "chevron-down"
                      }
                      size={24}
                    />
                  </TouchableOpacity>

                  {/* Dropdown body */}
                  {expandVendor[vendor.vendorId] === true && (
                    <View style={styles.vendorDetails}>
                      <View style={styles.vendorInfo}>
                        <Text style={styles.label}>Place: </Text>
                        <Text>{vendor.place ?? "N/A"} </Text>
                      </View>
                      <View style={styles.vendorInfo}>
                        <Text style={styles.label}>Street: </Text>
                        <Text>{vendor.street ?? "N/A"}</Text>
                      </View>

                      <View style={styles.vendorInfo}>
                        <Text style={styles.label}>Contact: </Text>
                        <Text>{vendor.phone}</Text>
                      </View>
                    </View>
                  )}
                </View>
              ))}
            </View>
            <View style={styles.detailContainer}>
              <Text>Order ID</Text>
              <Text>{currentOrder.id}</Text>
            </View>
            <View style={styles.detailContainer}>
              <Text>Order Type</Text>
              <Text style={styles.type}>
                {currentOrder.orderType == "MULTIPLE_VENDORS"
                  ? "Combined Order"
                  : "Single Order"}
              </Text>
            </View>
            <View style={styles.detailContainer}>
              <Text>Date & Time</Text>
              <Text>{formatDate(currentOrder.orderDate)}</Text>
            </View>
            <Text style={styles.subTitle}>Products:</Text>
            {currentOrder.items.map((item, index) => (
              <View key={index} style={styles.detailContainer}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>
                    {item.quantity} x {item.name}
                  </Text>
                </View>
                <View style={styles.itemPriceContainer}>
                  <Text style={styles.itemPrice}>
                    RWF {(item.price * item.quantity).toFixed(2)}
                  </Text>
                  <Text style={styles.itemUnitPrice}>
                    RWF {item.price.toFixed(2)} each
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Payment Information */}
          {currentOrder.payment && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Payment Information</Text>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentMethod}>
                  Method: {currentOrder.payment.paymentMethod}
                </Text>
                <Text style={styles.paymentStatus}>
                  Status: {currentOrder.payment.status}
                </Text>
                {currentOrder.payment.id && (
                  <Text style={styles.transactionId}>
                    Transaction ID: {currentOrder.payment.id}
                  </Text>
                )}
              </View>
            </View>
          )}

          {/* Total */}
          <View style={styles.totalCard}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Amount:</Text>
              <Text style={styles.totalAmount}>
                RWF {currentOrder.total?.toFixed(2) || "0.00"}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  detailsContainer: {
    flex: 1,
    backgroundColor: colors_fonts.white,
    borderRadius: 20,
    borderStyle: "dashed",
    borderColor: colors_fonts.primary,
    borderWidth: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors_fonts.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors_fonts.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors_fonts.text,
    fontFamily: colors_fonts.primary_font,
  },
  header: {
    backgroundColor: colors_fonts.primary,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    color: colors_fonts.white,
    fontSize: 16,
    fontFamily: colors_fonts.primary_font,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors_fonts.white,
    fontFamily: colors_fonts.primary_font,
    flex: 1,
    marginLeft: 50,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: colors_fonts.text,
    fontFamily: colors_fonts.primary_font,
    marginLeft: 20,
  },
  vendorsContainer: {
    marginVertical: 10,
  },
  vendor: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    overflow: "hidden",
  },
  vendorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors_fonts.backgroundDark,
    paddingLeft: 10,
  },
  vendorName: {
    fontSize: 12,
    fontWeight: "500",
  },
  vendorDetails: {
    backgroundColor: "#fff",
    padding: 10,
  },
  vendorInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontWeight: "bold",
  },
  subTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: colors_fonts.text,
    fontFamily: colors_fonts.primary_font,
    marginTop: 15,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors_fonts.white,
    fontFamily: colors_fonts.secondary_font,
    textTransform: "uppercase",
  },
  type: {
    color: colors_fonts.secondary,
  },

  detailContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors_fonts.backgroundLight,
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
  itemName: {
    fontSize: 12,
    fontWeight: "600",
    color: colors_fonts.secondary,
    fontFamily: colors_fonts.primary_font,
    marginBottom: 4,
  },

  itemPriceContainer: {
    alignItems: "flex-end",
  },
  itemPrice: {
    color: colors_fonts.primary,
    fontFamily: colors_fonts.primary_font,
  },
  itemUnitPrice: {
    fontSize: 12,
    color: colors_fonts.backgroundDark,
    fontFamily: colors_fonts.secondary_font,
  },
  paymentInfo: {
    gap: 8,
  },
  paymentMethod: {
    fontSize: 14,
    color: colors_fonts.text,
    fontFamily: colors_fonts.secondary_font,
  },
  paymentStatus: {
    fontSize: 14,
    color: colors_fonts.text,
    fontFamily: colors_fonts.secondary_font,
  },
  transactionId: {
    fontSize: 14,
    color: colors_fonts.backgroundDark,
    fontFamily: colors_fonts.secondary_font,
  },
  totalCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 10,
  },
  totalLabel: {
    fontWeight: "600",
    color: colors_fonts.text,
    fontFamily: colors_fonts.primary_font,
  },
  totalAmount: {
    fontWeight: "bold",
    color: colors_fonts.primary,
    fontFamily: colors_fonts.primary_font,
    fontStyle: "italic",
  },
});

export default OrderDetailsScreen;
