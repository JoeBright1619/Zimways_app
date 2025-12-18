import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors_fonts from '../constants/colors_fonts';
import { useNavigation } from '@react-navigation/native';

const ContactScreen = () => {
  const navigation = useNavigation();

  const handleCall = () => {
    Linking.openURL('tel:+1234567890');
  };

  const handleEmail = () => {
    Linking.openURL('mailto:support@zimways.com');
  };

  const handleLocation = () => {
    Linking.openURL('https://maps.google.com/?q=Zimways+Headquarters');
  };

  const handleSendMessage = () => {
    Alert.alert('Message Sent', 'We have received your message and will get back to you shortly.');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors_fonts.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact Us</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.introSection}>
          <Text style={styles.title}>Get in Touch</Text>
          <Text style={styles.subtitle}>
            We'd love to hear from you. Our friendly team is always here to chat.
          </Text>
        </View>

        <View style={styles.contactMethods}>
          <TouchableOpacity style={styles.card} onPress={handleEmail}>
            <View style={styles.iconContainer}>
              <Ionicons name="mail-outline" size={24} color={colors_fonts.secondary} />
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>Chat to us</Text>
              <Text style={styles.cardSubtitle}>Our friendly team is here to help.</Text>
              <Text style={styles.cardLink}>support@zimways.com</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={handleLocation}>
            <View style={styles.iconContainer}>
              <Ionicons name="location-outline" size={24} color={colors_fonts.secondary} />
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>Visit us</Text>
              <Text style={styles.cardSubtitle}>Come say hello at our office HQ.</Text>
              <Text style={styles.cardLink}>100 Smith Street, Collingwood VIC 3066</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={handleCall}>
            <View style={styles.iconContainer}>
              <Ionicons name="call-outline" size={24} color={colors_fonts.secondary} />
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>Call us</Text>
              <Text style={styles.cardSubtitle}>Mon-Fri from 8am to 5pm.</Text>
              <Text style={styles.cardLink}>+1 (555) 000-0000</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.formTitle}>Send us a message</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput style={styles.input} placeholder="Your name" placeholderTextColor="#999" />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="you@company.com"
              keyboardType="email-address"
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Message</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Leave us a message..."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholderTextColor="#999"
            />
          </View>
          <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
            <Text style={styles.sendButtonText}>Send Message</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    backgroundColor: colors_fonts.primary,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors_fonts.white,
    fontFamily: colors_fonts.primary_font,
  },
  content: {
    padding: 24,
  },
  introSection: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  contactMethods: {
    marginBottom: 32,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
    alignItems: 'flex-start',
  },
  iconContainer: {
    marginRight: 16,
    marginTop: 4,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  cardLink: {
    fontSize: 14,
    color: colors_fonts.secondary,
    fontWeight: '600',
  },
  formSection: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: '#eee',
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#1a1a1a',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#344054',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    color: '#1a1a1a',
    backgroundColor: '#fff',
  },
  textArea: {
    minHeight: 120,
  },
  sendButton: {
    backgroundColor: colors_fonts.secondary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ContactScreen;
