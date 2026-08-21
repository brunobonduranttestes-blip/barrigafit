import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { saveReminderSettings, type ReminderSettings } from "@/lib/storage";

Notifications.setNotificationHandler({
  handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: false, shouldSetBadge: false }),
});

export async function scheduleWorkoutReminder(hour: number, minute: number): Promise<ReminderSettings> {
  if (Platform.OS === "web") return { enabled: false, hour, minute };
  if (Platform.OS === "android") await Notifications.setNotificationChannelAsync("treino", { name: "Lembretes de treino", importance: Notifications.AndroidImportance.DEFAULT, lightColor: "#E91E8C" });
  const current = await Notifications.getPermissionsAsync();
  const permission = current.status === "granted" ? current : await Notifications.requestPermissionsAsync();
  if (permission.status !== "granted") throw new Error("Permissão de notificações não concedida.");
  await Notifications.cancelAllScheduledNotificationsAsync();
  const notificationId = await Notifications.scheduleNotificationAsync({ content: { title: "Seu treino te espera", body: "Reserve alguns minutos para o seu desafio de hoje.", data: { url: "/(tabs)" }, ...(Platform.OS === "android" ? { sound: false } : {}) }, trigger: { hour, minute, repeats: true, channelId: Platform.OS === "android" ? "treino" : undefined } as any });
  const settings = { enabled: true, hour, minute, notificationId }; await saveReminderSettings(settings); return settings;
}

export async function disableWorkoutReminder(hour = 19, minute = 0) {
  if (Platform.OS !== "web") await Notifications.cancelAllScheduledNotificationsAsync();
  await saveReminderSettings({ enabled: false, hour, minute });
}
