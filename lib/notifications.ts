import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

const NOTIFICATIONS_KEY = "barrigafit:notifications_enabled";
const NOTIFICATION_TIME_KEY = "barrigafit:notification_time";

const MOTIVATIONAL_MESSAGES = [
  "Dia X de 21: Sua barriga dos sonhos está mais perto! Vamos treinar?",
  "Bora treinar? 15 minutos hoje fazem diferença amanhã!",
  "Você não parou até aqui. Continue! Falta pouco!",
  "É hora de brilhar! Seu treino de hoje te espera.",
  "Cada exercício te aproxima de seus objetivos. Vamos lá!",
  "Desafio 21 Dias: você consegue! Treino de hoje aguarda.",
  "A consistência vence a resistência. Treino confirmado?",
  "Seu corpo vai agradecer. É hora de treinar!",
  "Vamos ativar! Seu treino de hoje está pronto.",
  "Barriga chapada vem com dedicação. Comece agora!",
];

export async function requestNotificationPermissions() {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === "granted";
  } catch (error) {
    console.error("Failed to request notification permissions:", error);
    return false;
  }
}

export async function isNotificationsEnabled(): Promise<boolean> {
  const val = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
  return val === "true";
}

export async function setNotificationsEnabled(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(NOTIFICATIONS_KEY, enabled ? "true" : "false");
  if (enabled) {
    await scheduleNotifications();
  } else {
    await cancelAllNotifications();
  }
}

export async function getNotificationTime(): Promise<string> {
  const val = await AsyncStorage.getItem(NOTIFICATION_TIME_KEY);
  return val || "08:00";
}

export async function setNotificationTime(time: string): Promise<void> {
  await AsyncStorage.setItem(NOTIFICATION_TIME_KEY, time);
  const enabled = await isNotificationsEnabled();
  if (enabled) {
    await cancelAllNotifications();
    await scheduleNotifications();
  }
}

export async function scheduleNotifications(): Promise<void> {
  try {
    const enabled = await isNotificationsEnabled();
    if (!enabled) return;

    const time = await getNotificationTime();
    const [hours, minutes] = time.split(":").map(Number);

    for (let i = 0; i < 7; i++) {
      const trigger = {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        hour: hours,
        minute: minutes,
        weekday: i + 1,
        repeats: true,
      } as any;

      const message = MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "BARRIGAFIT",
          body: message,
          sound: true,
          vibrate: [0, 250, 250, 250],
        },
        trigger,
      });
    }
  } catch (error) {
    console.error("Failed to schedule notifications:", error);
  }
}

export async function cancelAllNotifications(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error("Failed to cancel notifications:", error);
  }
}

export function setupNotificationListener() {
  const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
    console.log("Notification pressed:", response);
  });

  return () => subscription.remove();
}
