import React from 'react';
import { Alert, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {createStackNavigator, createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';
import NavigationBar from '../screens/NavigationBar';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import ProductDetailsScreen from '../screens/productDetailsScreen';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
// 🔴 Custom Drawer Content
function CustomDrawerContent(props) {
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
      { cancelable: true }
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
export default function DrawerNavigator() {
  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Drawer.Screen name="NavigationBar" component={NavigationBar} options={{ headerShown: false }} />
    </Drawer.Navigator>
  );
}

export default function MainStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={DrawerNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={{ title: 'Product Details' }} // Optional title
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
