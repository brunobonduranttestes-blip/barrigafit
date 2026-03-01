import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { Pressable, Text, StyleSheet, Platform, ActivityIndicator } from "react-native";
import { useColors } from "@/hooks/use-colors";

interface GradientButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export function GradientButton({
  label,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
  size = "md",
  fullWidth = false,
}: GradientButtonProps) {
  const colors = useColors();

  const handlePress = () => {
    if (disabled || loading) return;
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  const heights = { sm: 40, md: 52, lg: 60 };
  const fontSizes = { sm: 13, md: 15, lg: 17 };
  const paddingH = { sm: 16, md: 24, lg: 32 };

  if (variant === "outline") {
    return (
      <Pressable
        onPress={handlePress}
        disabled={disabled || loading}
        style={({ pressed }) => [
          styles.base,
          {
            height: heights[size],
            paddingHorizontal: paddingH[size],
            borderWidth: 1.5,
            borderColor: colors.primary,
            borderRadius: 14,
            backgroundColor: "transparent",
            width: fullWidth ? "100%" : undefined,
            opacity: pressed ? 0.7 : disabled ? 0.4 : 1,
          },
        ]}
      >
        <Text style={[styles.label, { fontSize: fontSizes[size], color: colors.primary }]}>
          {label}
        </Text>
      </Pressable>
    );
  }

  if (variant === "ghost") {
    return (
      <Pressable
        onPress={handlePress}
        disabled={disabled || loading}
        style={({ pressed }) => [
          styles.base,
          {
            height: heights[size],
            paddingHorizontal: paddingH[size],
            borderRadius: 14,
            backgroundColor: "transparent",
            width: fullWidth ? "100%" : undefined,
            opacity: pressed ? 0.6 : disabled ? 0.4 : 1,
          },
        ]}
      >
        <Text style={[styles.label, { fontSize: fontSizes[size], color: colors.primary }]}>
          {label}
        </Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        {
          width: fullWidth ? "100%" : undefined,
          borderRadius: 14,
          overflow: "hidden",
          transform: [{ scale: pressed ? 0.97 : 1 }],
          opacity: disabled ? 0.4 : 1,
        },
      ]}
    >
      <LinearGradient
        colors={["#E91E8C", "#C026D3"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          styles.base,
          {
            height: heights[size],
            paddingHorizontal: paddingH[size],
            borderRadius: 14,
          },
        ]}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={[styles.label, { fontSize: fontSizes[size], color: "#fff" }]}>
            {label}
          </Text>
        )}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
