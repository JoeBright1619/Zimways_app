import {React, useState, useEffect} from 'react';
import { View,ScrollView, Text, TouchableOpacity } from 'react-native';
import colors_fonts from '../constants/colors_fonts';
import { orderAPI } from '../services/api.service';
const OrderHistoryScreen = async() => {
  const [processing, setProcessing] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [failed, setFailed] = useState(false);
  const [orders, setOrders] = useState([]); // Fetch orders from API

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderAPI.getOrders(); // Adjust this to your API call
        setOrders(response.data); // Assuming response.data contains the orders
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    }
    fetchOrders();
  }, []);


  const toggleScreen = (screen) => {
    if (screen === 'processing') {
      setProcessing(true);
      setCompleted(false);
      setFailed(false);
      setOrders(orders.filter(order => order.status !== 'COMPLETED')); // Filter processing orders
    }
    else if (screen === 'completed') {
      setProcessing(false);
      setCompleted(true);
      setFailed(false);
      setOrders(orders.filter(order => order.status === 'COMPLETED')); // Filter completed orders
    } else if (screen === 'failed') {
      setProcessing(false);
      setCompleted(false);
      setFailed(true);
      setOrders(orders.filter(order => order.status === 'FAILED')); // Filter failed orders
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
  <TouchableOpacity
    style={{
      backgroundColor: processing ? colors_fonts.background : colors_fonts.primary,
      ...styles.processing,
    }}
    onPress={() => toggleScreen('processing')}
  >
    <Text>Processing</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={{
      backgroundColor: completed ? colors_fonts.background : colors_fonts.primary,
      ...styles.completed,
    }}
    onPress={() => toggleScreen('completed')}
  >
    <Text>Completed</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={{
      backgroundColor: failed ? colors_fonts.background : colors_fonts.primary,
      ...styles.failed,
    }}
    onPress={() => toggleScreen('failed')}
  >
    <Text>Failed</Text>
  </TouchableOpacity>
</View>

      <ScrollView>
        <Text>Order History Screen</Text>
      </ScrollView>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors_fonts.background,
  },
  header: {
    width: '100%',
    height: '19%',
    backgroundColor: colors_fonts.primary,
    justifyContent: 'center',
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
  processing: {

    padding: 10,
    borderRadius: 5,
    marginBottom: -5,
    height: '35%',
    width: '34%',
    zIndex: 1,
  },
  completed: {

    padding: 10,
    borderRadius: 5,
    marginBottom: -5,
    height: '35%',
    width: '32%',
    zIndex: 1,
  },
  failed: {
    
    padding: 10,
    borderRadius: 5,
    marginBottom: -5,
    height: '35%',
    width: '34%',
    zIndex: 1,
  },
  text: {
    fontSize: 20,
    color: '#333',
  },
};
export default OrderHistoryScreen;
