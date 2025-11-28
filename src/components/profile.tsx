// components/ProfileReveal.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Pressable,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import colors_fonts from "../constants/colors_fonts";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Feather } from "@expo/vector-icons";
import { pickAndSaveProfileImage } from "../utils/profileHelper";
import imageMap from "../constants/imageMap";

const { width, height } = Dimensions.get("window");

type ProfileRevealProps = {
  profileImage?: string;
  onProfileImageChange?: (newImageUri: string) => void;
};

const ProfileReveal: React.FC<ProfileRevealProps> = ({
  profileImage = "https://i.pravatar.cc/100", // fallback demo avatar
  onProfileImageChange,
}) => {
  const [expanded, setExpanded] = useState(false);

  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const overlayOpacity = useSharedValue(0);

  const handleProfileImageChange = async () => {
    const newUri = await pickAndSaveProfileImage();
    if (newUri) {
      // Call the parent callback to update the profile image
      onProfileImageChange?.(newUri);
    }
  };

  const toggleProfile = () => {
    if (!expanded) {
      // animate to center and enlarge
      translateX.value = withTiming(-(width / 2 - 60));
      translateY.value = withTiming(height / 2 - 100);
      scale.value = withTiming(5);
      overlayOpacity.value = withTiming(1);
    } else {
      // animate back to corner
      translateX.value = withTiming(0);
      translateY.value = withTiming(0);
      scale.value = withTiming(1);
      overlayOpacity.value = withTiming(0);
    }
    setExpanded(!expanded);
  };

  const profileStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <View style={styles.container}>
      {/* Blurred overlay */}
      {expanded && (
        <Pressable
          style={[StyleSheet.absoluteFill, { width, height }]}
          onPress={toggleProfile}
        >
          <BlurView intensity={50} style={StyleSheet.absoluteFill} />
        </Pressable>
      )}

      {/* Profile circle */}
      <Animated.View
        style={[
          styles.profileCircle,
          profileStyle,
          { position: "absolute", top: 45, right: 30 },
        ]}
      >
        <TouchableOpacity
          onPress={!expanded ? toggleProfile : handleProfileImageChange}
          activeOpacity={0.9}
        >
          <View style={styles.profileContainer}>
            <Image source={{ uri: profileImage }} style={styles.profileImg} />
            {!expanded && (
              <View style={styles.flagCircle}>
                <Image
                  source={imageMap["zim_flag.png"]}
                  style={styles.flagImage}
                />
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>

      {/* Chevron - positioned outside the animated profile circle */}
      {!expanded && (
        <TouchableOpacity
          style={styles.chevronContainer}
          onPress={toggleProfile}
          activeOpacity={0.9}
        >
          <Feather name="chevron-down" size={15} color={colors_fonts.text} />
        </TouchableOpacity>
      )}
      {expanded && (
        <TouchableOpacity
          style={[
            styles.navButton,
            {
              zIndex: 1001,
              position: "absolute",
              top: height / 2 + 70,
              right: 75,
            },
          ]}
          onPress={handleProfileImageChange}
        >
          <MaterialCommunityIcons
            name="account-edit-outline"
            size={24}
            color="black"
          />
        </TouchableOpacity>
      )}

      {/* Extra buttons (show when expanded) */}
      {expanded && (
        <View style={styles.buttonsContainer}>
          <View style={styles.btnContainer}>
            <TouchableOpacity style={styles.navButton}>
              <Ionicons name="location-sharp" size={24} color="black" />
            </TouchableOpacity>
            <Text>Location</Text>
          </View>
          <View style={styles.btnContainer}>
            <TouchableOpacity style={styles.navButton}>
              <MaterialCommunityIcons name="phone" size={24} color="black" />
            </TouchableOpacity>
            <Text>Contact</Text>
          </View>
          <View style={styles.btnContainer}>
            <TouchableOpacity style={styles.navButton}>
              <MaterialCommunityIcons name="security" size={24} color="black" />
            </TouchableOpacity>
            <Text>Security</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 1000,
    alignItems: "flex-end",
  },
  profileCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: "hidden",
    zIndex: 10,
  },
  profileContainer: {
    position: "relative",
    width: "100%",
    height: "100%",
  },
  profileImg: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
  },
  flagCircle: {
    position: "absolute",
    bottom: -2,
    right: 18,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 11,
  },
  flagImage: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  chevronContainer: {
    position: "absolute",
    top: 45 + 55, // profile top + profile height + margin
    right: 30 + 18, // profile right + half profile width - half chevron width
    zIndex: 12,
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonsContainer: {
    position: "absolute",
    top: height / 2 + 250,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 25,
  },
  btnContainer: {
    flexDirection: "column",
  },
  navButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors_fonts.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});

export default ProfileReveal;
