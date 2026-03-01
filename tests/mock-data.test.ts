import { describe, it, expect } from "vitest";
import {
  PROGRAMS,
  LIBRARY_CLASSES,
  EXERCISES,
  ONBOARDING_SLIDES,
  CHAT_QUESTIONS,
} from "@/lib/mock-data";

describe("PROGRAMS", () => {
  it("should have at least one program", () => {
    expect(PROGRAMS.length).toBeGreaterThan(0);
  });

  it("each program should have required fields", () => {
    for (const program of PROGRAMS) {
      expect(program.id).toBeTruthy();
      expect(program.title).toBeTruthy();
      expect(program.duration).toBeGreaterThan(0);
      expect(program.weeks).toBeDefined();
      expect(Array.isArray(program.weeks)).toBe(true);
      expect(program.color).toBeTruthy();
      expect(program.colorSecondary).toBeTruthy();
    }
  });

  it("each program week should have days", () => {
    for (const program of PROGRAMS) {
      for (const week of program.weeks) {
        expect(week.days.length).toBeGreaterThan(0);
        for (const day of week.days) {
          expect(day.id).toBeTruthy();
          expect(day.dayNumber).toBeGreaterThan(0);
        }
      }
    }
  });
});

describe("LIBRARY_CLASSES", () => {
  it("should have at least one class", () => {
    expect(LIBRARY_CLASSES.length).toBeGreaterThan(0);
  });

  it("each class should have required fields", () => {
    for (const cls of LIBRARY_CLASSES) {
      expect(cls.id).toBeTruthy();
      expect(cls.title).toBeTruthy();
      expect(cls.duration).toBeGreaterThan(0);
      expect(cls.level).toBeTruthy();
      expect(Array.isArray(cls.focus)).toBe(true);
      expect(Array.isArray(cls.exercises)).toBe(true);
    }
  });
});

describe("EXERCISES", () => {
  it("should have exercises defined", () => {
    expect(EXERCISES.length).toBeGreaterThan(0);
  });

  it("each exercise should have required fields", () => {
    for (const ex of EXERCISES) {
      expect(ex.id).toBeTruthy();
      expect(ex.name).toBeTruthy();
      expect(ex.duration).toBeGreaterThan(0);
      expect(ex.description).toBeTruthy();
    }
  });
});

describe("ONBOARDING_SLIDES", () => {
  it("should have onboarding slides", () => {
    expect(ONBOARDING_SLIDES.length).toBeGreaterThan(0);
  });

  it("each slide should have required fields", () => {
    for (const slide of ONBOARDING_SLIDES) {
      expect(slide.id).toBeTruthy();
      expect(slide.title).toBeTruthy();
      expect(slide.subtitle).toBeTruthy();
    }
  });
});

describe("CHAT_QUESTIONS", () => {
  it("should have chat questions", () => {
    expect(CHAT_QUESTIONS.length).toBeGreaterThan(0);
  });

  it("each question should have options", () => {
    for (const q of CHAT_QUESTIONS) {
      expect(q.id).toBeTruthy();
      expect(q.question).toBeTruthy();
      expect(Array.isArray(q.options)).toBe(true);
      expect(q.options.length).toBeGreaterThan(0);
    }
  });
});
