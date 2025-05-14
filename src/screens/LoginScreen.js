import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Image } from 'react-native';
import CustomButton from '../components/button';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import style from '../constants/colors_fonts';
import ZimwaysLogo from '../../assets/zimways.png' // Import the PNG

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('Login Successful!');
    } catch (err) {
      Alert.alert('Login Error', err.message);
      setError(err.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Add the PNG logo */}
      <Image source={ZimwaysLogo} style={styles.logo} />

      <Text style={styles.title}>Login</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Enter your Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <CustomButton
        title="Log in"
        onPress={handleLogin}
        style={{ width: 200, height: 50 }}
        textStyle={{ fontSize: 18 }}
      />
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>New customer? </Text>
        <Text
          style={styles.signupLink}
          onPress={() => navigation.navigate('Signup')}
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  logo: {
    width: 250,
    height: 150,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
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
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  signupText: {
    fontSize: 16,
    color: '#000',
  },
  signupLink: {
    fontSize: 16,
    color: 'red',
    fontWeight: 'bold',
  },
});