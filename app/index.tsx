import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { isOnboardingDone, isChatDone } from "@/lib/storage";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/lib/auth-context";

export default function EntryScreen() {
  const colors = useColors();
  const { isLoading, isSignedIn } = useAuth();

  useEffect(() => {
    async function checkFlow() {
      if (isLoading) return;

      if (!isSignedIn) {
        router.replace("/login");
        return;
      }

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
  }, [isLoading, isSignedIn]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator color={colors.primary} size="large" />
    </View>
  );
}
