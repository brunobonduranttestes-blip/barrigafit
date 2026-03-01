// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<SymbolViewProps["name"], ComponentProps<typeof MaterialIcons>["name"]>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * SF Symbols to Material Icons mappings for BARRIGAFIT
 */
const MAPPING = {
  // Navigation
  "house.fill": "home",
  "list.bullet": "format-list-bulleted",
  "books.vertical.fill": "library-books",
  "chart.bar.fill": "bar-chart",
  "gearshape.fill": "settings",
  // Actions
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  "chevron.left": "chevron-left",
  "chevron.down": "expand-more",
  "chevron.up": "expand-less",
  "xmark": "close",
  "xmark.circle.fill": "cancel",
  "checkmark": "check",
  "checkmark.circle.fill": "check-circle",
  "checkmark.circle": "radio-button-unchecked",
  "plus": "add",
  "plus.circle.fill": "add-circle",
  "minus": "remove",
  // Media
  "play.fill": "play-arrow",
  "pause.fill": "pause",
  "stop.fill": "stop",
  "backward.fill": "skip-previous",
  "forward.fill": "skip-next",
  "speaker.wave.2.fill": "volume-up",
  "speaker.slash.fill": "volume-off",
  // Fitness
  "figure.walk": "directions-walk",
  "figure.run": "directions-run",
  "flame.fill": "local-fire-department",
  "heart.fill": "favorite",
  "heart": "favorite-border",
  "bolt.fill": "bolt",
  "timer": "timer",
  "stopwatch.fill": "timer",
  "trophy.fill": "emoji-events",
  "star.fill": "star",
  "star": "star-border",
  // User
  "person.fill": "person",
  "person.circle.fill": "account-circle",
  "bell.fill": "notifications",
  "bell": "notifications-none",
  // Misc
  "magnifyingglass": "search",
  "slider.horizontal.3": "tune",
  "arrow.clockwise": "refresh",
  "arrow.up.right": "open-in-new",
  "lock.fill": "lock",
  "cloud.fill": "cloud",
  "icloud.fill": "backup",
  "info.circle.fill": "info",
  "exclamationmark.triangle.fill": "warning",
  "calendar": "calendar-today",
  "clock.fill": "schedule",
  "dumbbell.fill": "fitness-center",
  "sparkles": "auto-awesome",
  "wand.and.stars": "auto-fix-high",
  "arrow.right": "arrow-forward",
  "arrow.left": "arrow-back",
  "rectangle.stack.fill": "layers",
  "tag.fill": "label",
  "target": "gps-fixed",
  "trash.fill": "delete",
  "bell.badge": "add-alert",
  "photo": "photo",
  "pencil": "edit",
  "square.and.arrow.up": "share",
  "person.badge.plus": "person-add",
  "questionmark.circle.fill": "help",
  "doc.text.fill": "description",
  "creditcard.fill": "credit-card",
  "shield.fill": "security",
  "hand.thumbsup.fill": "thumb-up",
  "figure.cooldown": "self-improvement",
  "figure.strengthtraining.traditional": "fitness-center",
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
