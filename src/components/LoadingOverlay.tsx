import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  ActivityIndicator,
} from "react-native";
import colors_fonts from "../constants/colors_fonts";

type LoadingOverlayProps = {
  visible: boolean;
  message?: string;
};

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  message = "Payment processing...",
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!visible) return;
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.15,
          duration: 500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => {
      animation.stop();
      scaleAnim.setValue(1);
    };
  }, [visible, scaleAnim]);

  if (!visible) return null;

  return (
    <View style={styles.overlay} pointerEvents="auto">
      <Animated.View
        style={[styles.card, { transform: [{ scale: scaleAnim }] }]}
      >
        <ActivityIndicator size="large" color={colors_fonts.primary} />
        <Text style={styles.text}>{message}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  card: {
    backgroundColor: colors_fonts.tile_background,
    paddingVertical: 24,
    paddingHorizontal: 28,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  text: {
    marginTop: 12,
    color: colors_fonts.text,
    fontFamily: colors_fonts.primary_font,
    fontSize: 16,
  },
});

export default LoadingOverlay;
