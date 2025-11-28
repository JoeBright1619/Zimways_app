// filepath: c:\Users\user\Desktop\Projects\zimWays\Mobile\zimways\src\screens\NavigationBar.js
import React from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

import {
  addProductToFirestore,
  addOrderToFirestore,
  addVendorToFirestore,
} from "../utils/database";
import { RootStackParamList } from "../type/navigation.type";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;

const NavigationBar = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Navigation Bar</Text>
      <Button title="Go to Home" onPress={() => navigation.navigate("Home")} />
      <TouchableOpacity
        onPress={addProductToFirestore}
        style={styles.logoutBtn}
      >
        <Text style={{ color: "#fff" }}>Add</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  logoutBtn: {
    backgroundColor: "#007BFF",
    width: "50%",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: "center",
  },
});

export default NavigationBar;
