import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert, Image, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Platform  } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import CustomButton from '../components/button';
import style from '../constants/colors_fonts';
import ZimwaysLogo from '../../assets/zimways.png'; // Import the PNG

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }
     if (!email || !username || !password || !phone) {
      Alert.alert('Please fill all fields');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
  uid: user.uid,
  email: user.email,
  phone: phone,
  username: username, // Ensure username is correctly passed
  createdAt: new Date().toISOString(),
  profile: '', // Empty string or you can leave this as null if you want
  location: '', // Same with location, can be left as empty string or null
});


      Alert.alert('User successfully created');
    } catch (err) {
      setError(err.message);
      Alert.alert('Signup Error', err.message);
      console.error('Signup Error:', err);
    }
  };

 return (
  <KeyboardAvoidingView 
      style={styles.keyboardcontainer} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    <View style={styles.container}>
      <Image source={ZimwaysLogo} style={styles.logo} />
      <Text style={styles.title}>Sign Up</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <TextInput style={styles.input} placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />

      <CustomButton title="Signup" onPress={handleSignup} style={{ width: 200, height: 50 }} textStyle={{ fontSize: 18 }} />

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.signupLink}>Sign in</Text>
        </TouchableOpacity>
      </View>
    </View>
    </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardcontainer: {
    flex: 1,
    
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1, // Add a border
    borderColor: style.primary, // Use style.primary for the stroke color
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
   logo: {
    width: 250,
    height: 150,
    marginBottom: 20,
    resizeMode: 'contain',
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