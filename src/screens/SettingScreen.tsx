import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import colors_fonts from '../constants/colors_fonts';
import { Ionicons } from '@expo/vector-icons';
import SettingItem from '../components/settings/SettingItem';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../type/navigation.type';

const SettingsScreen: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('ENG');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

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

  const renderLogoutButton = () => (
    <TouchableOpacity style={styles.logoutContainer} onPress={handleLogout}>
      <View style={styles.settingItemContent}>
        <Text style={styles.logoutLabel}>Logout</Text>
        <Ionicons name="power" size={20} color={colors_fonts.secondary} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>
      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Account Settings Container */}
        <View style={styles.settingsContainer}>
          <Text style={styles.containerTitle}>Account Settings</Text>

          <SettingItem label="Profile" />
          <SettingItem label="Security" />
          <SettingItem label="Contact" onPress={() => navigation.navigate('Contact')} />
          <SettingItem label="Address" />
          <SettingItem label="Payment Methods" />
          <SettingItem label="Security & Privacy" />
        </View>

        {/* App Settings Container */}
        <View style={styles.settingsContainer}>
          <Text style={styles.containerTitle}>App Settings</Text>

          <SettingItem
            label="Language Preference"
            isDropdown={true}
            dropdownValue={selectedLanguage}
          />
          <SettingItem label="Notifications" />
          <SettingItem label="App Theme" />
          <SettingItem label="App Ratings and Reviews" />
          <SettingItem label="About Us" />
        </View>

        {/* Logout Button */}
        {renderLogoutButton()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors_fonts.background,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: colors_fonts.background,
    padding: 24,
  },
  header: {
    backgroundColor: colors_fonts.primary,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors_fonts.white,
    fontFamily: colors_fonts.primary_font,
  },
  settingsContainer: {
    backgroundColor: colors_fonts.primary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  containerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors_fonts.text,
    marginBottom: 16,
    fontFamily: colors_fonts.primary_font,
  },
  settingItem: {
    marginBottom: 8,
  },
  settingItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  settingLabel: {
    fontSize: 16,
    color: colors_fonts.text,
    fontFamily: colors_fonts.secondary_font,
  },
  separator: {
    height: 1,
    backgroundColor: colors_fonts.backgroundDark,
    marginLeft: 8,
    marginRight: 8,
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dropdownValue: {
    fontSize: 16,
    color: colors_fonts.text,
    fontFamily: colors_fonts.secondary_font,
  },
  logoutContainer: {
    backgroundColor: colors_fonts.primary,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoutLabel: {
    fontSize: 16,
    color: colors_fonts.secondary,
    fontFamily: colors_fonts.secondary_font,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
