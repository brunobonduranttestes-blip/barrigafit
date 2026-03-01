import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { isOnboardingDone, isChatDone } from "@/lib/storage";
import { useColors } from "@/hooks/use-colors";

export default function EntryScreen() {
  const colors = useColors();

  useEffect(() => {
    async function checkFlow() {
      const onboarded = await isOnboardingDone();
      const chatted = await isChatDone();

      if (!onboarded) {
        router.replace("/onboarding");
      } else if (!chatted) {
        router.replace("/chat-ia");
      } else {
        router.replace("/(tabs)");
      }
    }
    checkFlow();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator color={colors.primary} size="large" />
    </View>
  );
}
