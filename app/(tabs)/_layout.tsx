import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Platform, View, Text, StyleSheet } from "react-native";
import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

function TabIcon({ name, label, focused, color }: {
  name: any;
  label: string;
  focused: boolean;
  color: string;
}) {
  return (
    <View style={[styles.tabItem, focused && styles.tabItemActive]}>
      <IconSymbol name={name} size={21} color={color} />
      <Text style={[styles.tabLabel, { color }]}>{label}</Text>
    </View>
  );
}

export default function TabLayout() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 10 : Math.max(insets.bottom, 8);
  const tabBarHeight = 62 + bottomPadding;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarShowLabel: false,
        tabBarStyle: {
          paddingTop: 6,
          paddingBottom: bottomPadding,
          height: tabBarHeight,
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 0.5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="house.fill" label="Início" focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="programas"
        options={{
          title: "Programas",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="rectangle.stack.fill" label="Programas" focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="biblioteca"
        options={{
          title: "Biblioteca",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="books.vertical.fill" label="Biblioteca" focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="progresso"
        options={{
          title: "Progresso",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="chart.bar.fill" label="Progresso" focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="configuracoes"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="person.fill" label="Perfil" focused={focused} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    minWidth: 54,
    paddingVertical: 2,
  },
  tabItemActive: { transform: [{ translateY: -1 }] },
  tabLabel: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0,
  },
});
