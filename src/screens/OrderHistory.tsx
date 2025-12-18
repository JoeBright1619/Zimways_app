import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import colors_fonts from '../constants/colors_fonts';
import { orderAPI } from '../services/api.service';
import { useAuth } from '../hooks/useAuth';
import { OrderProps } from '../type/order.type';
import { OrderHistoryItem } from '../components/order/orderHistoryItem';

const OrderHistoryScreen: React.FC = () => {
  const [processing, setProcessing] = useState<boolean>(true);
  const [completed, setCompleted] = useState<boolean>(false);
  const [failed, setFailed] = useState<boolean>(false);
  const [allOrders, setAllOrders] = useState<OrderProps[]>([]);
  const [orders, setOrders] = useState<OrderProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { backendUser } = useAuth();

  const FAILED_STATES = [
    'FAILED',
    'PAYMENT_FAILED',
    'CANCELLED_BY_CUSTOMER',
    'CANCELLED_BY_RESTAURANT',
    'CANCELLED_BY_SYSTEM',
    'REFUNDED',
  ];

  const fetchOrders = async (isRefresh: boolean = false) => {
    try {
      setError(null);
      if (!isRefresh) setLoading(true);

      if (!backendUser || !backendUser.id) {
        throw new Error('No backend user found');
      }

      const response = await orderAPI.getOrdersByCustomer(backendUser.id);
      console.log('Orders response:', response);

      setAllOrders(response || []);
      setOrders(
        (response || []).filter((order: OrderProps) => {
          if (processing) {
            return (
              order.status !== 'COMPLETED' &&
              !FAILED_STATES.includes(order.status)
            );
          }

          if (completed) {
            return order.status === 'COMPLETED';
          }

          return FAILED_STATES.includes(order.status);
        }),
      );
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setError('Failed to load orders. Please try again.');
      Alert.alert('Error', 'Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders(true);
  };

  const toggleScreen = (screen: 'processing' | 'completed' | 'failed') => {
    setProcessing(screen === 'processing');
    setCompleted(screen === 'completed');
    setFailed(screen === 'failed');

    let filteredOrders: OrderProps[] = [];

    switch (screen) {
      case 'processing':
        filteredOrders = (allOrders || []).filter(
          (order) =>
            order.status !== 'COMPLETED' &&
            !FAILED_STATES.includes(order.status),
        );
        break;
      case 'completed':
        filteredOrders = (allOrders || []).filter(
          (order) => order.status === 'COMPLETED',
        );
        break;
      case 'failed':
        filteredOrders = (allOrders || []).filter((order) =>
          FAILED_STATES.includes(order.status),
        );
        break;
    }

    setOrders(filteredOrders);
  };

  const renderTabButton = (
    title: string,
    isActive: boolean,
    onPress: () => void,
    style: any,
  ) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        style,
        {
          backgroundColor: isActive
            ? colors_fonts.background
            : colors_fonts.primary,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.tabButtonText,
          {
            color: isActive ? colors_fonts.text : colors_fonts.white,
            fontWeight: isActive ? '600' : '400',
          },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  const renderEmptyState = (message: string) => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{message}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors_fonts.primary} />
        <Text style={styles.loadingText}>Loading orders...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Order History</Text>
      </View>

      <View style={styles.tabContainer}>
        {renderTabButton(
          'Processing',
          processing,
          () => toggleScreen('processing'),
          styles.processingTab,
        )}
        {renderTabButton(
          'Completed',
          completed,
          () => toggleScreen('completed'),
          styles.completedTab,
        )}
        {renderTabButton(
          'Failed',
          failed,
          () => toggleScreen('failed'),
          styles.failedTab,
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors_fonts.primary]}
            tintColor={colors_fonts.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {error ? (
          renderEmptyState(error)
        ) : orders.length === 0 ? (
          renderEmptyState(
            processing
              ? 'No processing orders'
              : completed
                ? 'No completed orders'
                : 'No failed orders',
          )
        ) : (
          <View style={styles.ordersContainer}>
            {orders.map((order) => (
              <OrderHistoryItem key={order.id} order={order} />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors_fonts.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors_fonts.white,
    fontFamily: colors_fonts.primary_font,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors_fonts.primary,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonText: {
    fontSize: 14,
    fontFamily: colors_fonts.secondary_font,
  },
  processingTab: {
    marginLeft: 0,
  },
  completedTab: {
    marginHorizontal: 4,
  },
  failedTab: {
    marginRight: 0,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: colors_fonts.text,
    textAlign: 'center',
    fontFamily: colors_fonts.primary_font,
  },
  ordersContainer: {
    gap: 16,
  },
});

export default OrderHistoryScreen;
