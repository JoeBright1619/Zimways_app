
import {React} from 'react';
import { View, Text, StyleSheet } from 'react-native';


const OrderHistoryItem = ({ order }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.orderId}>Order ID: {order.id}</Text>
      <Text style={styles.date}>Date: {new Date(order.date).toLocaleDateString()}</Text>
      <Text style={styles.status}>Status: {order.status}</Text>
      <Text style={styles.total}>Total: RWF {order.total.toFixed(2)}</Text>
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