import React from 'react';
import { Alert, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import NavigationBar from '../screens/NavigationBar';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import ProductDetailsScreen from '../screens/productDetailsScreen';
import MainTabs from './MainTabs'; // Assuming you have a MainTabs component for the main navigation
import VendorScreen from '../screens/vendorScreen'; // Assuming you have a VendorScreen component
import CategoryScreen from '../screens/CategoryScreen';
import OrderDetailsScreen from '../screens/OrderDetailsScreen';
import { RootStackParamList } from '../type/navigation.type';
import PaymentScreen from '../screens/PaymentScreen';
import ContactScreen from '../screens/ContactScreen';
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

// 🔴 Custom Drawer Content
import type { DrawerContentComponentProps } from '@react-navigation/drawer';

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut(auth);
            } catch (err) {
              console.error(err);
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />

      {/* 🔘 Logout button below drawer items */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

// 🧭 Drawer Navigator using the custom drawer
function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="NavigationBar"
        component={NavigationBar}
        options={{ headerShown: false }}
      />
    </Drawer.Navigator>
  );
}

export default function MainStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }} // Hide header for MainTabs
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={{ headerShown: false }} // Optional title
      />
      <Stack.Screen
        name="Vendor"
        component={VendorScreen}
        options={{ headerShown: false }} // Optional title
      />
      <Stack.Screen
        name="Category"
        component={CategoryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OrderDetails"
        component={OrderDetailsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Payment"
        component={PaymentScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Contact"
        component={ContactScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  logoutBtn: {
    marginTop: 20,
    marginHorizontal: 16,
    backgroundColor: '#FF6347',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
