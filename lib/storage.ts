import AsyncStorage from "@react-native-async-storage/async-storage";

const KEYS = {
  ONBOARDING_DONE: "barrigafit:onboarding_done",
  CHAT_DONE: "barrigafit:chat_done",
  USER_PROFILE: "barrigafit:user_profile",
  ACTIVE_PROGRAM: "barrigafit:active_program",
  COMPLETED_DAYS: "barrigafit:completed_days",
  PROGRESS_LOG: "barrigafit:progress_log",
  MEASUREMENTS: "barrigafit:measurements",
  FAVORITE_CLASSES: "barrigafit:favorite_classes",
};

export interface UserProfile {
  name: string;
  goal: string;
  level: string;
  availableTime: string;
  startDate: string;
}

export interface ProgressEntry {
  date: string;
  dayId: string;
  programId: string;
  duration: number; // minutes
  exercisesCompleted: number;
}

export interface Measurement {
  date: string;
  weight?: number;
  waist?: number;
  hips?: number;
  abdomen?: number;
}

// ─── Onboarding ───────────────────────────────────────────────────────────────

export async function isOnboardingDone(): Promise<boolean> {
  const val = await AsyncStorage.getItem(KEYS.ONBOARDING_DONE);
  return val === "true";
}

export async function setOnboardingDone(): Promise<void> {
  await AsyncStorage.setItem(KEYS.ONBOARDING_DONE, "true");
}

export async function isChatDone(): Promise<boolean> {
  const val = await AsyncStorage.getItem(KEYS.CHAT_DONE);
  return val === "true";
}

export async function setChatDone(): Promise<void> {
  await AsyncStorage.setItem(KEYS.CHAT_DONE, "true");
}

// ─── User Profile ─────────────────────────────────────────────────────────────

export async function getUserProfile(): Promise<UserProfile | null> {
  const val = await AsyncStorage.getItem(KEYS.USER_PROFILE);
  return val ? JSON.parse(val) : null;
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  await AsyncStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
}

// ─── Active Program ───────────────────────────────────────────────────────────

export async function getActiveProgramId(): Promise<string | null> {
  return AsyncStorage.getItem(KEYS.ACTIVE_PROGRAM);
}

export async function setActiveProgramId(id: string): Promise<void> {
  await AsyncStorage.setItem(KEYS.ACTIVE_PROGRAM, id);
}

// ─── Completed Days ───────────────────────────────────────────────────────────

export async function getCompletedDays(): Promise<string[]> {
  const val = await AsyncStorage.getItem(KEYS.COMPLETED_DAYS);
  return val ? JSON.parse(val) : [];
}

export async function markDayComplete(dayId: string): Promise<void> {
  const days = await getCompletedDays();
  if (!days.includes(dayId)) {
    days.push(dayId);
    await AsyncStorage.setItem(KEYS.COMPLETED_DAYS, JSON.stringify(days));
  }
}

export async function isDayComplete(dayId: string): Promise<boolean> {
  const days = await getCompletedDays();
  return days.includes(dayId);
}

// ─── Progress Log ─────────────────────────────────────────────────────────────

export async function getProgressLog(): Promise<ProgressEntry[]> {
  const val = await AsyncStorage.getItem(KEYS.PROGRESS_LOG);
  return val ? JSON.parse(val) : [];
}

export async function addProgressEntry(entry: ProgressEntry): Promise<void> {
  const log = await getProgressLog();
  log.push(entry);
  await AsyncStorage.setItem(KEYS.PROGRESS_LOG, JSON.stringify(log));
}

// ─── Measurements ─────────────────────────────────────────────────────────────

export async function getMeasurements(): Promise<Measurement[]> {
  const val = await AsyncStorage.getItem(KEYS.MEASUREMENTS);
  return val ? JSON.parse(val) : [];
}

export async function addMeasurement(m: Measurement): Promise<void> {
  const list = await getMeasurements();
  list.push(m);
  await AsyncStorage.setItem(KEYS.MEASUREMENTS, JSON.stringify(list));
}

// ─── Favorites ────────────────────────────────────────────────────────────────

export async function getFavoriteClasses(): Promise<string[]> {
  const val = await AsyncStorage.getItem(KEYS.FAVORITE_CLASSES);
  return val ? JSON.parse(val) : [];
}

export async function toggleFavoriteClass(classId: string): Promise<boolean> {
  const favs = await getFavoriteClasses();
  const idx = favs.indexOf(classId);
  if (idx >= 0) {
    favs.splice(idx, 1);
    await AsyncStorage.setItem(KEYS.FAVORITE_CLASSES, JSON.stringify(favs));
    return false;
  } else {
    favs.push(classId);
    await AsyncStorage.setItem(KEYS.FAVORITE_CLASSES, JSON.stringify(favs));
    return true;
  }
}

// ─── Reset (for testing) ──────────────────────────────────────────────────────

export async function resetAllData(): Promise<void> {
  await AsyncStorage.multiRemove(Object.values(KEYS));
}
