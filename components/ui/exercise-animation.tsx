/**
 * ExerciseAnimation
 *
 * Animated SVG illustrations for each exercise type in BARRIGAFIT.
 * Uses react-native-reanimated for smooth, looping animations.
 * Each animation is a stylized stick-figure demonstrating the movement.
 */

import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  interpolate,
  type SharedValue,
} from "react-native-reanimated";
import Svg, {
  Circle,
  Line,
  Path,
  Ellipse,
  Rect,
  G,
} from "react-native-svg";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ExerciseAnimationType =
  | "plank"
  | "glute_bridge"
  | "crunch"
  | "squat"
  | "cat_stretch"
  | "leg_raise"
  | "roll_up"
  | "scissors"
  | "rest"
  | "generic";

interface ExerciseAnimationProps {
  type: ExerciseAnimationType;
  color?: string;
  size?: number;
}

// ─── Exercise type mapping ────────────────────────────────────────────────────

export function getAnimationType(exerciseName: string): ExerciseAnimationType {
  const name = exerciseName.toLowerCase();
  if (name.includes("prancha") || name.includes("plank")) return "plank";
  if (name.includes("ponte") || name.includes("glút")) return "glute_bridge";
  if (name.includes("crunch") || name.includes("abdominal")) return "crunch";
  if (name.includes("agachamento") || name.includes("squat")) return "squat";
  if (name.includes("gato") || name.includes("cat")) return "cat_stretch";
  if (name.includes("elevação") || name.includes("pernas")) return "leg_raise";
  if (name.includes("roll") || name.includes("pilates")) return "roll_up";
  if (name.includes("tesoura") || name.includes("scissor")) return "scissors";
  if (name.includes("descanso") || name.includes("rest")) return "rest";
  return "generic";
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ExerciseAnimation({
  type,
  color = "#E91E8C",
  size = 280,
}: ExerciseAnimationProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 1200, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
  }, []);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    opacity: 1,
  }));

  return (
    <Animated.View style={[styles.container, { width: size, height: size }, animatedContainerStyle]}>
      <AnimationRenderer type={type} color={color} size={size} progress={progress} />
    </Animated.View>
  );
}

// ─── Animation Renderer ───────────────────────────────────────────────────────

function AnimationRenderer({
  type,
  color,
  size,
  progress,
}: {
  type: ExerciseAnimationType;
  color: string;
  size: number;
  progress: SharedValue<number>;
}) {
  switch (type) {
    case "plank":
      return <PlankAnimation color={color} size={size} progress={progress} />;
    case "glute_bridge":
      return <GluteBridgeAnimation color={color} size={size} progress={progress} />;
    case "crunch":
      return <CrunchAnimation color={color} size={size} progress={progress} />;
    case "squat":
      return <SquatAnimation color={color} size={size} progress={progress} />;
    case "cat_stretch":
      return <CatStretchAnimation color={color} size={size} progress={progress} />;
    case "leg_raise":
      return <LegRaiseAnimation color={color} size={size} progress={progress} />;
    case "roll_up":
      return <RollUpAnimation color={color} size={size} progress={progress} />;
    case "scissors":
      return <ScissorsAnimation color={color} size={size} progress={progress} />;
    case "rest":
      return <RestAnimation color={color} size={size} progress={progress} />;
    default:
      return <GenericAnimation color={color} size={size} progress={progress} />;
  }
}

// ─── Individual Animations ────────────────────────────────────────────────────

// PLANK - body horizontal, slight hip dip animation
function PlankAnimation({
  color,
  size,
  progress,
}: {
  color: string;
  size: number;
  progress: SharedValue<number>;
}) {
  const hipStyle = useAnimatedStyle(() => {
    const hipY = interpolate(progress.value, [0, 1], [0, 4]);
    return { transform: [{ translateY: hipY }] };
  });

  const s = size / 280;

  return (
    <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
      <Svg width={size} height={size} viewBox="0 0 280 280">
        {/* Floor */}
        <Line x1="30" y1="200" x2="250" y2="200" stroke={color + "33"} strokeWidth="2" />

        {/* Forearms on floor */}
        <Line x1="60" y1="200" x2="80" y2="170" stroke={color} strokeWidth="5" strokeLinecap="round" />
        <Line x1="100" y1="200" x2="80" y2="170" stroke={color} strokeWidth="5" strokeLinecap="round" />

        {/* Toes on floor */}
        <Circle cx="210" cy="200" r="5" fill={color} />

        {/* Body line */}
        <Line x1="80" y1="170" x2="210" y2="170" stroke={color} strokeWidth="6" strokeLinecap="round" />

        {/* Head */}
        <Circle cx="65" cy="155" r="18" fill="none" stroke={color} strokeWidth="4" />

        {/* Legs */}
        <Line x1="210" y1="170" x2="210" y2="200" stroke={color} strokeWidth="5" strokeLinecap="round" />
      </Svg>

      {/* Animated hip */}
      <Animated.View style={[StyleSheet.absoluteFill, hipStyle]}>
        <Svg width={size} height={size} viewBox="0 0 280 280">
          {/* Hip highlight dot */}
          <Circle cx="145" cy="170" r="6" fill={color + "88"} />
        </Svg>
      </Animated.View>
    </View>
  );
}

// GLUTE BRIDGE - lying down, hips raise up and down
function GluteBridgeAnimation({
  color,
  size,
  progress,
}: {
  color: string;
  size: number;
  progress: SharedValue<number>;
}) {
  const hipStyle = useAnimatedStyle(() => {
    const hipY = interpolate(progress.value, [0, 1], [0, -30]);
    return { transform: [{ translateY: hipY }] };
  });

  return (
    <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
      {/* Static base */}
      <Svg width={size} height={size} viewBox="0 0 280 280">
        {/* Floor */}
        <Line x1="20" y1="215" x2="260" y2="215" stroke={color + "33"} strokeWidth="2" />
        {/* Head */}
        <Circle cx="55" cy="190" r="18" fill="none" stroke={color} strokeWidth="4" />
        {/* Upper body on floor */}
        <Line x1="55" y1="208" x2="130" y2="208" stroke={color} strokeWidth="6" strokeLinecap="round" />
        {/* Feet on floor */}
        <Line x1="185" y1="215" x2="185" y2="185" stroke={color} strokeWidth="5" strokeLinecap="round" />
        <Line x1="215" y1="215" x2="215" y2="185" stroke={color} strokeWidth="5" strokeLinecap="round" />
        <Circle cx="185" cy="215" r="5" fill={color} />
        <Circle cx="215" cy="215" r="5" fill={color} />
      </Svg>

      {/* Animated hip + thighs */}
      <Animated.View style={[StyleSheet.absoluteFill, hipStyle]}>
        <Svg width={size} height={size} viewBox="0 0 280 280">
          {/* Hip */}
          <Ellipse cx="155" cy="208" rx="28" ry="14" fill={color} opacity={0.9} />
          {/* Thighs */}
          <Line x1="130" y1="208" x2="185" y2="185" stroke={color} strokeWidth="6" strokeLinecap="round" />
          <Line x1="155" y1="208" x2="215" y2="185" stroke={color} strokeWidth="6" strokeLinecap="round" />
        </Svg>
      </Animated.View>
    </View>
  );
}

// CRUNCH - upper body curls up
function CrunchAnimation({
  color,
  size,
  progress,
}: {
  color: string;
  size: number;
  progress: SharedValue<number>;
}) {
  const torsoStyle = useAnimatedStyle(() => {
    const angle = interpolate(progress.value, [0, 1], [0, -25]);
    return { transform: [{ rotate: `${angle}deg` }] };
  });

  return (
    <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
      <Svg width={size} height={size} viewBox="0 0 280 280">
        {/* Floor */}
        <Line x1="20" y1="220" x2="260" y2="220" stroke={color + "33"} strokeWidth="2" />
        {/* Lower body - static */}
        <Line x1="140" y1="220" x2="175" y2="185" stroke={color} strokeWidth="6" strokeLinecap="round" />
        <Line x1="140" y1="220" x2="105" y2="185" stroke={color} strokeWidth="6" strokeLinecap="round" />
        <Line x1="175" y1="185" x2="200" y2="220" stroke={color} strokeWidth="5" strokeLinecap="round" />
        <Line x1="105" y1="185" x2="80" y2="220" stroke={color} strokeWidth="5" strokeLinecap="round" />
      </Svg>

      {/* Animated upper body */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          torsoStyle,
          { transformOrigin: "140px 220px" } as any,
        ]}
      >
        <Svg width={size} height={size} viewBox="0 0 280 280">
          {/* Torso */}
          <Line x1="140" y1="220" x2="140" y2="170" stroke={color} strokeWidth="7" strokeLinecap="round" />
          {/* Arms behind head */}
          <Line x1="140" y1="175" x2="115" y2="160" stroke={color} strokeWidth="4" strokeLinecap="round" />
          <Line x1="140" y1="175" x2="165" y2="160" stroke={color} strokeWidth="4" strokeLinecap="round" />
          {/* Head */}
          <Circle cx="140" cy="152" r="18" fill="none" stroke={color} strokeWidth="4" />
        </Svg>
      </Animated.View>
    </View>
  );
}

// SQUAT - figure goes up and down
function SquatAnimation({
  color,
  size,
  progress,
}: {
  color: string;
  size: number;
  progress: SharedValue<number>;
}) {
  const bodyStyle = useAnimatedStyle(() => {
    const translateY = interpolate(progress.value, [0, 1], [0, 28]);
    return { transform: [{ translateY }] };
  });

  return (
    <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
      {/* Static feet */}
      <Svg width={size} height={size} viewBox="0 0 280 280">
        <Line x1="20" y1="230" x2="260" y2="230" stroke={color + "33"} strokeWidth="2" />
        <Circle cx="105" cy="230" r="7" fill={color} />
        <Circle cx="175" cy="230" r="7" fill={color} />
      </Svg>

      {/* Animated body */}
      <Animated.View style={[StyleSheet.absoluteFill, bodyStyle]}>
        <Svg width={size} height={size} viewBox="0 0 280 280">
          {/* Head */}
          <Circle cx="140" cy="90" r="22" fill="none" stroke={color} strokeWidth="4" />
          {/* Torso */}
          <Line x1="140" y1="112" x2="140" y2="170" stroke={color} strokeWidth="7" strokeLinecap="round" />
          {/* Arms out */}
          <Line x1="140" y1="130" x2="95" y2="150" stroke={color} strokeWidth="4" strokeLinecap="round" />
          <Line x1="140" y1="130" x2="185" y2="150" stroke={color} strokeWidth="4" strokeLinecap="round" />
          {/* Thighs */}
          <Line x1="140" y1="170" x2="105" y2="210" stroke={color} strokeWidth="6" strokeLinecap="round" />
          <Line x1="140" y1="170" x2="175" y2="210" stroke={color} strokeWidth="6" strokeLinecap="round" />
          {/* Shins */}
          <Line x1="105" y1="210" x2="105" y2="230" stroke={color} strokeWidth="5" strokeLinecap="round" />
          <Line x1="175" y1="210" x2="175" y2="230" stroke={color} strokeWidth="5" strokeLinecap="round" />
        </Svg>
      </Animated.View>
    </View>
  );
}

// CAT STRETCH - spine arches up and down
function CatStretchAnimation({
  color,
  size,
  progress,
}: {
  color: string;
  size: number;
  progress: SharedValue<number>;
}) {
  const spineStyle = useAnimatedStyle(() => {
    const scaleY = interpolate(progress.value, [0, 1], [1, 0.7]);
    return { transform: [{ scaleY }] };
  });

  return (
    <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
      <Svg width={size} height={size} viewBox="0 0 280 280">
        {/* Floor */}
        <Line x1="20" y1="220" x2="260" y2="220" stroke={color + "33"} strokeWidth="2" />
        {/* Hands on floor */}
        <Circle cx="75" cy="220" r="7" fill={color} />
        <Circle cx="105" cy="220" r="7" fill={color} />
        {/* Knees on floor */}
        <Circle cx="175" cy="220" r="7" fill={color} />
        <Circle cx="205" cy="220" r="7" fill={color} />
        {/* Arms */}
        <Line x1="75" y1="220" x2="90" y2="175" stroke={color} strokeWidth="5" strokeLinecap="round" />
        <Line x1="105" y1="220" x2="90" y2="175" stroke={color} strokeWidth="5" strokeLinecap="round" />
        {/* Legs */}
        <Line x1="175" y1="220" x2="190" y2="175" stroke={color} strokeWidth="5" strokeLinecap="round" />
        <Line x1="205" y1="220" x2="190" y2="175" stroke={color} strokeWidth="5" strokeLinecap="round" />
      </Svg>

      {/* Animated spine + head */}
      <Animated.View style={[StyleSheet.absoluteFill, spineStyle]}>
        <Svg width={size} height={size} viewBox="0 0 280 280">
          {/* Spine arc */}
          <Path
            d="M 90 175 Q 140 130 190 175"
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* Head */}
          <Circle cx="75" cy="162" r="16" fill="none" stroke={color} strokeWidth="4" />
        </Svg>
      </Animated.View>
    </View>
  );
}

// LEG RAISE - legs go up
function LegRaiseAnimation({
  color,
  size,
  progress,
}: {
  color: string;
  size: number;
  progress: SharedValue<number>;
}) {
  const legsStyle = useAnimatedStyle(() => {
    const angle = interpolate(progress.value, [0, 1], [0, -50]);
    return { transform: [{ rotate: `${angle}deg` }] };
  });

  return (
    <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
      <Svg width={size} height={size} viewBox="0 0 280 280">
        {/* Floor */}
        <Line x1="20" y1="200" x2="260" y2="200" stroke={color + "33"} strokeWidth="2" />
        {/* Head */}
        <Circle cx="55" cy="175" r="18" fill="none" stroke={color} strokeWidth="4" />
        {/* Torso on floor */}
        <Line x1="55" y1="193" x2="160" y2="200" stroke={color} strokeWidth="7" strokeLinecap="round" />
        {/* Arms at sides */}
        <Line x1="90" y1="197" x2="70" y2="200" stroke={color} strokeWidth="4" strokeLinecap="round" />
        <Line x1="120" y1="199" x2="100" y2="200" stroke={color} strokeWidth="4" strokeLinecap="round" />
      </Svg>

      {/* Animated legs */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          legsStyle,
          { transformOrigin: "160px 200px" } as any,
        ]}
      >
        <Svg width={size} height={size} viewBox="0 0 280 280">
          <Line x1="160" y1="200" x2="200" y2="200" stroke={color} strokeWidth="6" strokeLinecap="round" />
          <Line x1="160" y1="200" x2="230" y2="200" stroke={color} strokeWidth="6" strokeLinecap="round" />
          <Circle cx="200" cy="200" r="5" fill={color} />
          <Circle cx="230" cy="200" r="5" fill={color} />
        </Svg>
      </Animated.View>
    </View>
  );
}

// ROLL UP - body rolls up from floor
function RollUpAnimation({
  color,
  size,
  progress,
}: {
  color: string;
  size: number;
  progress: SharedValue<number>;
}) {
  const bodyStyle = useAnimatedStyle(() => {
    const angle = interpolate(progress.value, [0, 1], [0, -60]);
    return { transform: [{ rotate: `${angle}deg` }] };
  });

  return (
    <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
      <Svg width={size} height={size} viewBox="0 0 280 280">
        {/* Floor */}
        <Line x1="20" y1="220" x2="260" y2="220" stroke={color + "33"} strokeWidth="2" />
        {/* Feet anchored */}
        <Circle cx="170" cy="220" r="7" fill={color} />
        <Circle cx="200" cy="220" r="7" fill={color} />
        {/* Legs */}
        <Line x1="140" y1="220" x2="170" y2="220" stroke={color} strokeWidth="6" strokeLinecap="round" />
        <Line x1="140" y1="220" x2="200" y2="220" stroke={color} strokeWidth="6" strokeLinecap="round" />
      </Svg>

      {/* Animated upper body */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          bodyStyle,
          { transformOrigin: "140px 220px" } as any,
        ]}
      >
        <Svg width={size} height={size} viewBox="0 0 280 280">
          {/* Torso */}
          <Line x1="140" y1="220" x2="140" y2="155" stroke={color} strokeWidth="7" strokeLinecap="round" />
          {/* Arms reaching forward */}
          <Line x1="140" y1="170" x2="110" y2="155" stroke={color} strokeWidth="4" strokeLinecap="round" />
          <Line x1="140" y1="170" x2="170" y2="155" stroke={color} strokeWidth="4" strokeLinecap="round" />
          {/* Head */}
          <Circle cx="140" cy="137" r="18" fill="none" stroke={color} strokeWidth="4" />
        </Svg>
      </Animated.View>
    </View>
  );
}

// SCISSORS - legs alternate up and down
function ScissorsAnimation({
  color,
  size,
  progress,
}: {
  color: string;
  size: number;
  progress: SharedValue<number>;
}) {
  const leg1Style = useAnimatedStyle(() => {
    const angle = interpolate(progress.value, [0, 1], [-30, 30]);
    return { transform: [{ rotate: `${angle}deg` }] };
  });

  const leg2Style = useAnimatedStyle(() => {
    const angle = interpolate(progress.value, [0, 1], [30, -30]);
    return { transform: [{ rotate: `${angle}deg` }] };
  });

  return (
    <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
      <Svg width={size} height={size} viewBox="0 0 280 280">
        {/* Floor */}
        <Line x1="20" y1="210" x2="260" y2="210" stroke={color + "33"} strokeWidth="2" />
        {/* Head */}
        <Circle cx="55" cy="185" r="18" fill="none" stroke={color} strokeWidth="4" />
        {/* Torso on floor */}
        <Line x1="55" y1="203" x2="155" y2="210" stroke={color} strokeWidth="7" strokeLinecap="round" />
      </Svg>

      {/* Leg 1 */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          leg1Style,
          { transformOrigin: "155px 210px" } as any,
        ]}
      >
        <Svg width={size} height={size} viewBox="0 0 280 280">
          <Line x1="155" y1="210" x2="210" y2="210" stroke={color} strokeWidth="6" strokeLinecap="round" />
          <Circle cx="210" cy="210" r="5" fill={color} />
        </Svg>
      </Animated.View>

      {/* Leg 2 */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          leg2Style,
          { transformOrigin: "155px 210px" } as any,
        ]}
      >
        <Svg width={size} height={size} viewBox="0 0 280 280">
          <Line x1="155" y1="210" x2="220" y2="210" stroke={color + "BB"} strokeWidth="6" strokeLinecap="round" />
          <Circle cx="220" cy="210" r="5" fill={color + "BB"} />
        </Svg>
      </Animated.View>
    </View>
  );
}

// REST - breathing circle expand/contract
function RestAnimation({
  color,
  size,
  progress,
}: {
  color: string;
  size: number;
  progress: SharedValue<number>;
}) {
  const circleStyle = useAnimatedStyle(() => {
    const scale = interpolate(progress.value, [0, 1], [0.85, 1.1]);
    return { transform: [{ scale }] };
  });

  const innerStyle = useAnimatedStyle(() => {
    const scale = interpolate(progress.value, [0, 1], [0.7, 1.0]);
    const opacity = interpolate(progress.value, [0, 1], [0.3, 0.7]);
    return { transform: [{ scale }], opacity };
  });

  return (
    <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
      <Animated.View style={[styles.restOuter, { borderColor: color + "44" }, innerStyle]}>
        <Animated.View style={[styles.restInner, { backgroundColor: color + "22" }, circleStyle]}>
          <Svg width={80} height={80} viewBox="0 0 80 80">
            {/* Simple person sitting */}
            <Circle cx="40" cy="20" r="12" fill="none" stroke={color} strokeWidth="3" />
            <Line x1="40" y1="32" x2="40" y2="55" stroke={color} strokeWidth="4" strokeLinecap="round" />
            <Line x1="40" y1="40" x2="25" y2="50" stroke={color} strokeWidth="3" strokeLinecap="round" />
            <Line x1="40" y1="40" x2="55" y2="50" stroke={color} strokeWidth="3" strokeLinecap="round" />
            <Line x1="40" y1="55" x2="30" y2="68" stroke={color} strokeWidth="3" strokeLinecap="round" />
            <Line x1="40" y1="55" x2="50" y2="68" stroke={color} strokeWidth="3" strokeLinecap="round" />
          </Svg>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

// GENERIC - jumping jacks style
function GenericAnimation({
  color,
  size,
  progress,
}: {
  color: string;
  size: number;
  progress: SharedValue<number>;
}) {
  const armsStyle = useAnimatedStyle(() => {
    const angle = interpolate(progress.value, [0, 1], [40, -10]);
    return { transform: [{ rotate: `${angle}deg` }] };
  });

  const legsStyle = useAnimatedStyle(() => {
    const scale = interpolate(progress.value, [0, 1], [1, 1.3]);
    return { transform: [{ scaleX: scale }] };
  });

  return (
    <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
      <Svg width={size} height={size} viewBox="0 0 280 280">
        {/* Floor */}
        <Line x1="20" y1="240" x2="260" y2="240" stroke={color + "33"} strokeWidth="2" />
        {/* Head */}
        <Circle cx="140" cy="80" r="22" fill="none" stroke={color} strokeWidth="4" />
        {/* Torso */}
        <Line x1="140" y1="102" x2="140" y2="175" stroke={color} strokeWidth="7" strokeLinecap="round" />
      </Svg>

      {/* Animated arms */}
      <Animated.View style={[StyleSheet.absoluteFill, armsStyle, { transformOrigin: "140px 130px" } as any]}>
        <Svg width={size} height={size} viewBox="0 0 280 280">
          <Line x1="140" y1="130" x2="95" y2="110" stroke={color} strokeWidth="5" strokeLinecap="round" />
          <Line x1="140" y1="130" x2="185" y2="110" stroke={color} strokeWidth="5" strokeLinecap="round" />
        </Svg>
      </Animated.View>

      {/* Animated legs */}
      <Animated.View style={[StyleSheet.absoluteFill, legsStyle, { transformOrigin: "140px 175px" } as any]}>
        <Svg width={size} height={size} viewBox="0 0 280 280">
          <Line x1="140" y1="175" x2="110" y2="240" stroke={color} strokeWidth="6" strokeLinecap="round" />
          <Line x1="140" y1="175" x2="170" y2="240" stroke={color} strokeWidth="6" strokeLinecap="round" />
          <Circle cx="110" cy="240" r="6" fill={color} />
          <Circle cx="170" cy="240" r="6" fill={color} />
        </Svg>
      </Animated.View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  restOuter: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  restInner: {
    width: 130,
    height: 130,
    borderRadius: 65,
    justifyContent: "center",
    alignItems: "center",
  },
});
