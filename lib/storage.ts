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
  SESSION: "barrigafit:session",
  ACCOUNTS: "barrigafit:accounts",
  ACCESS_CODES: "barrigafit:access_codes",
  ADMIN_SETTINGS: "barrigafit:admin_settings",
  REMINDER: "barrigafit:workout_reminder",
  VIDEO_CATALOG: "barrigafit:video_catalog",
};

const ADMIN_EMAIL = "brunobondurant@gmail.com";
const DEFAULT_ADMIN_PASSWORD = "BF-9X7K-2R4M";

export interface UserProfile {
  name: string;
  email?: string;
  goal: string;
  level: string;
  availableTime: string;
  startDate: string;
}

export interface ProgressEntry { date: string; dayId: string; programId: string; duration: number; exercisesCompleted: number; }
export interface Measurement { date: string; weight?: number; waist?: number; hips?: number; abdomen?: number; }
export interface AccessCode { id: string; code: string; label: string; active: boolean; createdAt: string; usedBy?: string; }
export interface LocalAccount { id: string; name: string; email: string; role: "admin" | "user"; createdAt: string; active: boolean; accessCode?: string; }
export interface AppSession { accountId: string; name: string; email: string; role: "admin" | "user"; }
export interface ReminderSettings { enabled: boolean; hour: number; minute: number; notificationId?: string; }
export interface AdminSettings { adminPassword: string; changedOnce: boolean; }
export interface CatalogVideo { id: string; title: string; category: string; duration: string; url: string; active: boolean; }

async function read<T>(key: string, fallback: T): Promise<T> {
  const value = await AsyncStorage.getItem(key);
  return value ? JSON.parse(value) : fallback;
}
async function write<T>(key: string, value: T): Promise<void> { await AsyncStorage.setItem(key, JSON.stringify(value)); }

export async function isOnboardingDone() { return (await AsyncStorage.getItem(KEYS.ONBOARDING_DONE)) === "true"; }
export async function setOnboardingDone() { await AsyncStorage.setItem(KEYS.ONBOARDING_DONE, "true"); }
export async function isChatDone() { return (await AsyncStorage.getItem(KEYS.CHAT_DONE)) === "true"; }
export async function setChatDone() { await AsyncStorage.setItem(KEYS.CHAT_DONE, "true"); }

export async function getUserProfile(): Promise<UserProfile | null> { return read<UserProfile | null>(KEYS.USER_PROFILE, null); }
export async function saveUserProfile(profile: UserProfile) { await write(KEYS.USER_PROFILE, profile); }
export async function getActiveProgramId() { return AsyncStorage.getItem(KEYS.ACTIVE_PROGRAM); }
export async function setActiveProgramId(id: string) { await AsyncStorage.setItem(KEYS.ACTIVE_PROGRAM, id); }
export async function getCompletedDays(): Promise<string[]> { return read(KEYS.COMPLETED_DAYS, []); }
export async function markDayComplete(dayId: string) { const days = await getCompletedDays(); if (!days.includes(dayId)) { days.push(dayId); await write(KEYS.COMPLETED_DAYS, days); } }
export async function isDayComplete(dayId: string) { return (await getCompletedDays()).includes(dayId); }
export async function getProgressLog(): Promise<ProgressEntry[]> { return read(KEYS.PROGRESS_LOG, []); }
export async function addProgressEntry(entry: ProgressEntry) { const log = await getProgressLog(); log.push(entry); await write(KEYS.PROGRESS_LOG, log); }
export async function getMeasurements(): Promise<Measurement[]> { return read(KEYS.MEASUREMENTS, []); }
export async function addMeasurement(m: Measurement) { const list = await getMeasurements(); list.push(m); list.sort((a, b) => a.date.localeCompare(b.date)); await write(KEYS.MEASUREMENTS, list); }
export async function getFavoriteClasses(): Promise<string[]> { return read(KEYS.FAVORITE_CLASSES, []); }
export async function toggleFavoriteClass(classId: string) { const favs = await getFavoriteClasses(); const index = favs.indexOf(classId); if (index >= 0) { favs.splice(index, 1); await write(KEYS.FAVORITE_CLASSES, favs); return false; } favs.push(classId); await write(KEYS.FAVORITE_CLASSES, favs); return true; }

export async function getSession(): Promise<AppSession | null> { return read<AppSession | null>(KEYS.SESSION, null); }
export async function logoutLocal() { await AsyncStorage.removeItem(KEYS.SESSION); }
export async function getAdminSettings(): Promise<AdminSettings> { return read(KEYS.ADMIN_SETTINGS, { adminPassword: DEFAULT_ADMIN_PASSWORD, changedOnce: false }); }
export async function changeAdminPassword(current: string, next: string) { const settings = await getAdminSettings(); if (settings.changedOnce || current !== settings.adminPassword || next.trim().length < 8) return false; await write(KEYS.ADMIN_SETTINGS, { adminPassword: next.trim(), changedOnce: true }); return true; }
export async function getAccessCodes(): Promise<AccessCode[]> { const codes = await read<AccessCode[]>(KEYS.ACCESS_CODES, []); if (codes.length) return codes; const initial = [{ id: "initial-code", code: "BARRIGA21", label: "Código inicial", active: true, createdAt: new Date().toISOString() }]; await write(KEYS.ACCESS_CODES, initial); return initial; }
export async function createAccessCode(label: string): Promise<AccessCode> { const code = `BF-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`; const item = { id: `code-${Date.now()}`, code, label: label.trim() || "Novo acesso", active: true, createdAt: new Date().toISOString() }; const all = await getAccessCodes(); all.unshift(item); await write(KEYS.ACCESS_CODES, all); return item; }
export async function toggleAccessCode(id: string) { const codes = await getAccessCodes(); const item = codes.find((entry) => entry.id === id); if (item) item.active = !item.active; await write(KEYS.ACCESS_CODES, codes); }
export async function getAccounts(): Promise<LocalAccount[]> { return read(KEYS.ACCOUNTS, []); }
export async function toggleAccount(id: string) { const accounts = await getAccounts(); const item = accounts.find((entry) => entry.id === id); if (item && item.role !== "admin") item.active = !item.active; await write(KEYS.ACCOUNTS, accounts); }
export async function signInWithCode(name: string, email: string, code: string): Promise<{ ok: boolean; message?: string; session?: AppSession }> {
  const normalizedEmail = email.trim().toLowerCase(); const normalizedCode = code.trim().toUpperCase();
  if (!name.trim() || !normalizedEmail.includes("@") || !normalizedCode) return { ok: false, message: "Preencha nome, e-mail e código de acesso." };
  if (normalizedEmail === ADMIN_EMAIL) { const admin = await getAdminSettings(); if (code.trim() !== admin.adminPassword) return { ok: false, message: "Senha de administrador inválida." }; const session = { accountId: "admin-bruno", name: name.trim(), email: normalizedEmail, role: "admin" as const }; await write(KEYS.SESSION, session); return { ok: true, session }; }
  const codes = await getAccessCodes(); const access = codes.find((item) => item.code === normalizedCode && item.active); if (!access) return { ok: false, message: "Código de acesso inválido ou desativado." };
  const accounts = await getAccounts(); let account = accounts.find((item) => item.email === normalizedEmail);
  if (account && !account.active) return { ok: false, message: "Este acesso foi desativado pelo administrador." };
  if (!account) { account = { id: `user-${Date.now()}`, name: name.trim(), email: normalizedEmail, role: "user", createdAt: new Date().toISOString(), active: true, accessCode: access.code }; accounts.unshift(account); await write(KEYS.ACCOUNTS, accounts); access.usedBy = normalizedEmail; await write(KEYS.ACCESS_CODES, codes); }
  const session = { accountId: account.id, name: account.name, email: account.email, role: account.role }; await write(KEYS.SESSION, session); return { ok: true, session };
}
export async function getReminderSettings(): Promise<ReminderSettings> { return read(KEYS.REMINDER, { enabled: false, hour: 19, minute: 0 }); }
export async function saveReminderSettings(settings: ReminderSettings) { await write(KEYS.REMINDER, settings); }
export async function getCatalogVideos(): Promise<CatalogVideo[]> { return read(KEYS.VIDEO_CATALOG, []); }
export async function addCatalogVideo(input: Omit<CatalogVideo, "id" | "active">) { const videos = await getCatalogVideos(); videos.unshift({ ...input, id: `video-${Date.now()}`, active: true }); await write(KEYS.VIDEO_CATALOG, videos); }
export async function toggleCatalogVideo(id: string) { const videos = await getCatalogVideos(); const item = videos.find((video) => video.id === id); if (item) item.active = !item.active; await write(KEYS.VIDEO_CATALOG, videos); }
export async function resetAllData() { await AsyncStorage.multiRemove(Object.values(KEYS)); }
