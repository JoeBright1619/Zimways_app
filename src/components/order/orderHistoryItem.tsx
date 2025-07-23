
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {OrderProps} from '../../type/order.type'; 

const OrderHistoryItem = ({ order }: {order: OrderProps}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.orderId}>Order ID: {order.id}</Text>
      <Text style={styles.date}>Date: {new Date(order.orderDate).toLocaleDateString()}</Text>
      <Text style={styles.status}>Status: {order.status}</Text>
      <Text style={styles.total}>
        Total: RWF {order.total !== undefined ? order.total.toFixed(2) : 'N/A'}
      </Text>
      <View style={styles.itemsContainer}>
        {order.items.map((item, index) => (
          <View key={index} style={styles.item}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>RWF {item.price.toFixed(2)}</Text>
            <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {},
  orderId: {},
  date: {},
  status: {},
  total: {},
  itemsContainer: {
    marginTop: 10,
  },
  item: {
    marginBottom: 10,
  },
  itemName: {
    fontWeight: 'bold',
  },
  itemPrice: {
    color: 'gray',
  },
  itemQuantity: {
    color: 'blue',
  },
});