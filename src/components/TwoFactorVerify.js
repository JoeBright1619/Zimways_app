import { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import CustomButton from './button';

export default function TwoFactorVerify({ onVerify, loading, error }) {
  const [code, setCode] = useState('');
  const [secret, setSecret] = useState('');

  const handleVerify = () => {
    if (code && secret) {
      onVerify(code, secret);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Two-Factor Authentication</Text>
      
      {error ? <Text style={styles.error}>{error}</Text> : null}
      
      <Text style={styles.label}>
        Please enter the verification code from your authenticator app
      </Text>
      
      <TextInput
        style={styles.input}
        placeholder="Enter verification code"
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        maxLength={6}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Enter secret key"
        value={secret}
        onChangeText={setSecret}
        autoCapitalize="none"
      />
      
      <CustomButton
        title={loading ? 'Verifying...' : 'Verify'}
        onPress={handleVerify}
        disabled={loading || !code || !secret}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginBottom: 15,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  error: {
    color: 'red',
    marginBottom: 15,
    textAlign: 'center',
  },
}); 