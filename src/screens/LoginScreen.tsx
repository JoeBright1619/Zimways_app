import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import CustomButton from "../components/button";

import style from "../constants/colors_fonts";
import { useAuth } from "../hooks/useAuth";
import { RootStackParamList } from "../type/navigation.type";

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Login"
>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

interface LoginResult {
  success: boolean;
  requiresTFA?: boolean;
  userId?: string;
}

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { login } = useAuth();

  const handleLogin = async (): Promise<void> => {
    if (!email || !password) {
      Alert.alert("Missing Information", "Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = (await login(email, password)) as LoginResult;

      if (!result || !result.success) {
        throw new Error("Login failed - invalid response from server");
      }

      if (result.requiresTFA) {
        // Navigate to 2FA screen if required
        navigation.navigate("TwoFactorAuth", {
          userId: result.userId,
          email: email,
        });
        return;
      }
      // Clear form
      setEmail("");
      setPassword("");
      setError("");
    } catch (err: unknown) {
      // More specific error handling
      let errorMessage = "An error occurred during login";

      if (err instanceof Error) {
        if (err.message.includes("auth/user-not-found")) {
          errorMessage = "No account exists with this email";
        } else if (err.message.includes("auth/wrong-password")) {
          errorMessage = "Invalid password";
        } else if (err.message.includes("Backend authentication failed")) {
          errorMessage = "Account exists but backend verification failed";
        }
      }

      setError(errorMessage);
      Alert.alert("Login Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Add the PNG logo */}
      <Image source={require("../../assets/zimways.png")} style={styles.logo} />

      <Text style={styles.title}>Login</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Enter your Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
      />

      {loading ? (
        <ActivityIndicator
          size="large"
          color={style.primary}
          style={styles.loader}
        />
      ) : (
        <CustomButton
          title="Log in"
          onPress={handleLogin}
          style={{ width: 200, height: 50 }}
          textStyle={{ fontSize: 18 }}
          disabled={loading}
        />
      )}
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>New customer? </Text>
        <Text
          style={styles.signupLink}
          onPress={() => navigation.navigate("Signup")}
          disabled={loading}
        >
          Sign up here
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  logo: {
    width: 250,
    height: 150,
    marginBottom: 20,
    resizeMode: "contain",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: style.primary,
    padding: 8,
    marginBottom: 16,
    borderRadius: 4,
    width: 300,
  },
  error: {
    color: "red",
    marginBottom: 16,
    textAlign: "center",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  signupText: {
    fontSize: 16,
    color: "#000",
  },
  signupLink: {
    fontSize: 16,
    color: "red",
    fontWeight: "bold",
  },
  loader: {
    marginVertical: 20,
  },
});
