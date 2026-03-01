import { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Animated,
  Pressable,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { GradientButton } from "@/components/ui/gradient-button";
import { setOnboardingDone } from "@/lib/storage";
import { ONBOARDING_SLIDES } from "@/lib/mock-data";
import { useColors } from "@/hooks/use-colors";

const { width, height } = Dimensions.get("window");

export default function OnboardingScreen() {
  const colors = useColors();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleNext = () => {
    if (currentIndex < ONBOARDING_SLIDES.length - 1) {
      if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    } else {
      handleStart();
    }
  };

  const handleStart = async () => {
    await setOnboardingDone();
    router.replace("/chat-ia");
  };

  const isLast = currentIndex === ONBOARDING_SLIDES.length - 1;

  return (
    <View style={[styles.container, { backgroundColor: "#0A0A0A" }]}>
      {/* Logo Header */}
      <View style={styles.logoHeader}>
        <Text style={styles.logoText}>
          <Text style={styles.logoBarriga}>BARRIGA</Text>
          <Text style={styles.logoFit}>FIT</Text>
        </Text>
        <View style={styles.logoBadge}>
          <Text style={styles.logoBadgeText}>DESAFIO DE 21 DIAS</Text>
        </View>
      </View>

      {/* Slides */}
      <Animated.FlatList
        ref={flatListRef}
        data={ONBOARDING_SLIDES}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            {/* Icon Circle */}
            <LinearGradient
              colors={[item.color, item.color + "88"]}
              style={styles.iconCircle}
            >
              <IconSymbol name={item.icon} size={56} color="#fff" />
            </LinearGradient>

            <Text style={styles.slideTitle}>{item.title}</Text>
            <Text style={[styles.slideSubtitle, { color: colors.muted }]}>
              {item.subtitle}
            </Text>
          </View>
        )}
      />

      {/* Dots */}
      <View style={styles.dotsContainer}>
        {ONBOARDING_SLIDES.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 24, 8],
            extrapolate: "clamp",
          });
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          });
          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  opacity,
                  backgroundColor: "#E91E8C",
                },
              ]}
            />
          );
        })}
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <GradientButton
          label={isLast ? "Começar Agora" : "Continuar"}
          onPress={handleNext}
          fullWidth
          size="lg"
        />
        {!isLast && (
          <Pressable onPress={handleStart} style={styles.skipBtn}>
            <Text style={[styles.skipText, { color: colors.muted }]}>Pular</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
  },
  logoHeader: {
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  logoText: {
    fontSize: 32,
    letterSpacing: -1,
  },
  logoBarriga: {
    color: "#FFFFFF",
    fontWeight: "900",
  },
  logoFit: {
    color: "#E91E8C",
    fontWeight: "900",
  },
  logoBadge: {
    marginTop: 6,
    backgroundColor: "#E91E8C",
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 20,
  },
  logoBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
  },
  slide: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingBottom: 20,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 36,
  },
  slideTitle: {
    color: "#F9FAFB",
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 34,
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  slideSubtitle: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 24,
    fontWeight: "400",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginBottom: 32,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  actions: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === "ios" ? 48 : 32,
    gap: 12,
  },
  skipBtn: {
    alignItems: "center",
    paddingVertical: 8,
  },
  skipText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
