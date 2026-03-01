import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock AsyncStorage
vi.mock("@react-native-async-storage/async-storage", () => ({
  default: {
    getItem: vi.fn().mockResolvedValue(null),
    setItem: vi.fn().mockResolvedValue(undefined),
    removeItem: vi.fn().mockResolvedValue(undefined),
    multiRemove: vi.fn().mockResolvedValue(undefined),
  },
}));

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  isOnboardingDone,
  setOnboardingDone,
  isChatDone,
  setChatDone,
  getUserProfile,
  saveUserProfile,
  getActiveProgramId,
  setActiveProgramId,
  getCompletedDays,
  markDayComplete,
  isDayComplete,
  getProgressLog,
  addProgressEntry,
  getFavoriteClasses,
  toggleFavoriteClass,
  resetAllData,
  type UserProfile,
  type ProgressEntry,
} from "@/lib/storage";

const mockGet = AsyncStorage.getItem as ReturnType<typeof vi.fn>;
const mockSet = AsyncStorage.setItem as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
  mockGet.mockResolvedValue(null);
  mockSet.mockResolvedValue(undefined);
});

describe("Onboarding", () => {
  it("returns false when onboarding not done", async () => {
    mockGet.mockResolvedValue(null);
    const result = await isOnboardingDone();
    expect(result).toBe(false);
  });

  it("returns true when onboarding is done", async () => {
    mockGet.mockResolvedValue("true");
    const result = await isOnboardingDone();
    expect(result).toBe(true);
  });

  it("sets onboarding done", async () => {
    await setOnboardingDone();
    expect(mockSet).toHaveBeenCalledWith("barrigafit:onboarding_done", "true");
  });
});

describe("Chat", () => {
  it("returns false when chat not done", async () => {
    mockGet.mockResolvedValue(null);
    const result = await isChatDone();
    expect(result).toBe(false);
  });

  it("sets chat done", async () => {
    await setChatDone();
    expect(mockSet).toHaveBeenCalledWith("barrigafit:chat_done", "true");
  });
});

describe("User Profile", () => {
  it("returns null when no profile saved", async () => {
    const result = await getUserProfile();
    expect(result).toBeNull();
  });

  it("saves and retrieves user profile", async () => {
    const profile: UserProfile = {
      name: "Ana",
      goal: "weight_loss",
      level: "beginner",
      availableTime: "30 minutos",
      startDate: "2026-03-01",
    };
    mockGet.mockResolvedValue(JSON.stringify(profile));
    const result = await getUserProfile();
    expect(result).toEqual(profile);
  });
});

describe("Active Program", () => {
  it("returns null when no program set", async () => {
    const result = await getActiveProgramId();
    expect(result).toBeNull();
  });

  it("sets active program", async () => {
    await setActiveProgramId("prog-01");
    expect(mockSet).toHaveBeenCalledWith("barrigafit:active_program", "prog-01");
  });
});

describe("Completed Days", () => {
  it("returns empty array when no days completed", async () => {
    const result = await getCompletedDays();
    expect(result).toEqual([]);
  });

  it("marks a day as complete", async () => {
    mockGet.mockResolvedValue(JSON.stringify([]));
    await markDayComplete("day-01");
    expect(mockSet).toHaveBeenCalledWith(
      "barrigafit:completed_days",
      JSON.stringify(["day-01"])
    );
  });

  it("does not duplicate completed days", async () => {
    mockGet.mockResolvedValue(JSON.stringify(["day-01"]));
    await markDayComplete("day-01");
    expect(mockSet).not.toHaveBeenCalled();
  });

  it("checks if a day is complete", async () => {
    mockGet.mockResolvedValue(JSON.stringify(["day-01", "day-02"]));
    const done = await isDayComplete("day-01");
    const notDone = await isDayComplete("day-03");
    expect(done).toBe(true);
    expect(notDone).toBe(false);
  });
});

describe("Progress Log", () => {
  it("returns empty array when no entries", async () => {
    const result = await getProgressLog();
    expect(result).toEqual([]);
  });

  it("adds a progress entry", async () => {
    mockGet.mockResolvedValue(JSON.stringify([]));
    const entry: ProgressEntry = {
      date: "2026-03-01T10:00:00.000Z",
      dayId: "day-01",
      programId: "prog-01",
      duration: 25,
      exercisesCompleted: 5,
    };
    await addProgressEntry(entry);
    expect(mockSet).toHaveBeenCalledWith(
      "barrigafit:progress_log",
      JSON.stringify([entry])
    );
  });
});

describe("Favorites", () => {
  it("returns empty array when no favorites", async () => {
    const result = await getFavoriteClasses();
    expect(result).toEqual([]);
  });

  it("adds a class to favorites", async () => {
    mockGet.mockResolvedValue(JSON.stringify([]));
    const isFav = await toggleFavoriteClass("class-01");
    expect(isFav).toBe(true);
    expect(mockSet).toHaveBeenCalledWith(
      "barrigafit:favorite_classes",
      JSON.stringify(["class-01"])
    );
  });

  it("removes a class from favorites", async () => {
    mockGet.mockResolvedValue(JSON.stringify(["class-01"]));
    const isFav = await toggleFavoriteClass("class-01");
    expect(isFav).toBe(false);
    expect(mockSet).toHaveBeenCalledWith(
      "barrigafit:favorite_classes",
      JSON.stringify([])
    );
  });
});
