import React from 'react';  
import { View, Text,TouchableOpacity,Alert } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';

const SettingsScreen = () => {
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
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings Screen</Text>
      <TouchableOpacity style={{
    marginTop: 20,
    marginHorizontal: 16,
    backgroundColor: '#FF6347',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center'}} onPress={handleLogout}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Logout</Text>
          </TouchableOpacity>
    </View>
    
  );
}
export default SettingsScreen;
