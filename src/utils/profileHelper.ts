// helpers/profileImageHelper.js
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { Alert } from 'react-native';

export const pickAndSaveProfileImage = async (): Promise<string | null> => {
  return new Promise(async (resolve) => {
    Alert.alert(
      'Update Profile Image',
      'Choose a source',
      [
        {
          text: 'Camera',
          onPress: async () => {
            const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
            if (cameraStatus.status !== 'granted') {
              alert('Camera access is required!');
              return resolve(null);
            }

            const result = await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              aspect: [1, 1],
              quality: 1,
            });

            if (!result.canceled) {
              const imageUri = result.assets[0].uri;
              await saveImage(imageUri);
              resolve(imageUri);
            } else {
              resolve(null);
            }
          },
        },
        {
          text: 'Gallery',
          onPress: async () => {
            const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (galleryStatus.status !== 'granted') {
              alert('Gallery access is required!');
              return resolve(null);
            }

            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 1,
            });

            if (!result.canceled) {
              const imageUri = result.assets[0].uri;
              await saveImage(imageUri);
              resolve(imageUri);
            } else {
              resolve(null);
            }
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => resolve(null),
        },
      ],
      { cancelable: true }
    );
  });
};

const saveImage = async (imageUri: string) => {
  // Save to local device storage (AsyncStorage)
  await AsyncStorage.setItem('profileImageUri', imageUri);

  // Update user in Firestore
  const user = auth.currentUser;
  if (user) {
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, { profileImage: imageUri });
  }
};
