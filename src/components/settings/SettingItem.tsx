// components/SettingItem.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors_fonts from "../../constants/colors_fonts";

type Props = {
  label: string;
  isDropdown?: boolean;
  dropdownValue?: string;
  onPress?: () => void;
};

const SettingItem: React.FC<Props> = ({ label, isDropdown, dropdownValue, onPress }) => {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      // Default behavior: show under development alert
      Alert.alert(
        'Under Development',
        `The "${label}" screen is still under development!`,
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <TouchableOpacity style={styles.settingItem} onPress={handlePress}>
      <View style={styles.settingItemContent}>
        <Text style={styles.settingLabel}>{label}</Text>
        {isDropdown ? (
          <View style={styles.dropdownContainer}>
            <Text style={styles.dropdownValue}>{dropdownValue}</Text>
            <Ionicons name="chevron-down" size={15} color={colors_fonts.text} />
          </View>
        ) : (
          <Ionicons name="chevron-forward" size={20} color={colors_fonts.text} />
        )}
      </View>
      <View style={styles.separator} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  settingItem: { marginBottom: 8 },
  settingItemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  settingLabel: { fontSize: 16, color: colors_fonts.text, fontFamily: colors_fonts.secondary_font },
  separator: { height: 1, backgroundColor: colors_fonts.background, marginHorizontal: 8 },
  dropdownContainer: { flexDirection: "row", alignItems: "center", gap: 10 , backgroundColor: colors_fonts.white, paddingHorizontal: 7},
  dropdownValue: { fontSize: 12, color: colors_fonts.text, fontFamily: colors_fonts.secondary_font },
});

export default SettingItem;
