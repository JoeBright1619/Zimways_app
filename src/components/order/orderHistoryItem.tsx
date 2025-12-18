import React, { JSX } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { OrderProps } from '../../type/order.type';
import colors_fonts from '../../constants/colors_fonts';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../type/navigation.type';
import { useNavigation } from '@react-navigation/native';

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'OrderDetails'
>;

const FAILED_STATES = [
  'FAILED',
  'PAYMENT_FAILED',
  'CANCELLED_BY_CUSTOMER',
  'CANCELLED_BY_RESTAURANT',
  'CANCELLED_BY_SYSTEM',
  'REFUNDED',
];

const getStatusColor = (status: string): string => {
  if (status === 'COMPLETED') {
    return colors_fonts.tertiary;
  }
  if (FAILED_STATES.includes(status)) {
    return colors_fonts.secondary;
  }
  return colors_fonts.backgroundDark; // fallback
};

const getStatusText = (status: string): string => {
  switch (status) {
    case 'COMPLETED':
      return 'Completed';
    case 'FAILED':
      return 'Failed';
    case 'PROCESSING':
      return 'Processing';
    case 'PREPARING':
      return 'Preparing';
    case 'ON_THE_WAY':
      return 'On the Way';
    default:
      return status;
  }
};

export const OrderHistoryItem = ({
  order,
}: {
  order: OrderProps;
}): JSX.Element => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <TouchableOpacity
      key={order.id}
      style={styles.orderCard}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('OrderDetails', { order })}
    >
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderId}>
            {order.vendors?.length
              ? order.vendors.length > 1
                ? `${order.vendors[0].vendorName} & More`
                : order.vendors[0].vendorName
              : 'No vendors'}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(order.status) },
          ]}
        >
          <Text style={styles.statusText}>{getStatusText(order.status)}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <Text>Date & Time:</Text>
        <Text>Type:</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.orderDate}>
          {new Date(order.orderDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
        <Text style={styles.type}>
          {order.orderType == 'MULTIPLE_VENDORS'
            ? 'Combined Order'
            : 'Single Order'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  orderCard: {
    backgroundColor: colors_fonts.white,
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors_fonts.text,
    fontFamily: colors_fonts.primary_font,
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: colors_fonts.backgroundDark,
    fontFamily: colors_fonts.secondary_font,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors_fonts.white,
    fontFamily: colors_fonts.secondary_font,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  type: {
    color: colors_fonts.secondary,
  },
});
