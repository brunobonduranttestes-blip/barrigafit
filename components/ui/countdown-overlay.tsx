import { View, Text } from "react-native";
import { useState, useEffect } from "react";
import Animated, { FadeIn, FadeOut, SlideInDown, ZoomIn, ZoomOut } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

interface CountdownOverlayProps {
  visible: boolean;
  nextExercise: string;
  onComplete: () => void;
}

export function CountdownOverlay({ visible, nextExercise, onComplete }: CountdownOverlayProps) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (!visible) {
      setCount(3);
      return;
    }

    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          setTimeout(onComplete, 500);
          return 0;
        }
        if (Platform.OS !== "web") {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [visible, onComplete]);

  if (!visible) return null;

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <Animated.View
        entering={ZoomIn.springify()}
        exiting={ZoomOut}
        style={{
          width: 200,
          height: 200,
          borderRadius: 100,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <LinearGradient
          colors={["#C2185B", "#E91E8C"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 200,
            height: 200,
            borderRadius: 100,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {count > 0 ? (
            <Animated.View key={count} entering={ZoomIn.springify()} exiting={ZoomOut}>
              <Text style={{ fontSize: 80, fontWeight: "bold", color: "white" }}>{count}</Text>
            </Animated.View>
          ) : (
            <Animated.View entering={ZoomIn.springify()}>
              <Text style={{ fontSize: 60, fontWeight: "bold", color: "white" }}>GO!</Text>
            </Animated.View>
          )}
        </LinearGradient>
      </Animated.View>

      <Animated.View entering={SlideInDown.delay(500)} style={{ marginTop: 40 }}>
        <Text style={{ color: "white", fontSize: 18, fontWeight: "bold", textAlign: "center" }}>Próximo</Text>
        <Text style={{ color: "#E91E8C", fontSize: 16, fontWeight: "bold", textAlign: "center", marginTop: 8 }}>
          {nextExercise}
        </Text>
      </Animated.View>
    </View>
  );
}
