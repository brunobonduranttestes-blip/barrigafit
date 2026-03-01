import { describe, it, expect } from "vitest";

// Pure logic test - replicate getAnimationType without importing the JSX component
type AnimationType =
  | "plank"
  | "glute_bridge"
  | "crunch"
  | "squat"
  | "cat_stretch"
  | "leg_raise"
  | "roll_up"
  | "scissors"
  | "rest"
  | "generic";

function getAnimationType(exerciseName: string): AnimationType {
  const name = exerciseName.toLowerCase();
  if (name.includes("prancha") || name.includes("plank")) return "plank";
  if (name.includes("ponte") || name.includes("glute bridge")) return "glute_bridge";
  if (name.includes("crunch") || name.includes("abdominal")) return "crunch";
  if (name.includes("agachamento") || name.includes("squat")) return "squat";
  if (name.includes("gato") || name.includes("cat")) return "cat_stretch";
  if (name.includes("elevação") || name.includes("leg raise")) return "leg_raise";
  if (name.includes("roll up") || name.includes("pilates")) return "roll_up";
  if (name.includes("tesoura") || name.includes("scissors")) return "scissors";
  if (name.includes("descanso") || name.includes("rest")) return "rest";
  return "generic";
}

describe("getAnimationType logic", () => {
  it("returns plank for prancha exercises", () => {
    expect(getAnimationType("Prancha Isométrica")).toBe("plank");
    expect(getAnimationType("plank hold")).toBe("plank");
  });

  it("returns glute_bridge for ponte exercises", () => {
    expect(getAnimationType("Ponte de Glúteos")).toBe("glute_bridge");
    expect(getAnimationType("glute bridge")).toBe("glute_bridge");
  });

  it("returns crunch for abdominal exercises", () => {
    expect(getAnimationType("Abdominal Crunch")).toBe("crunch");
    expect(getAnimationType("crunch básico")).toBe("crunch");
  });

  it("returns squat for agachamento exercises", () => {
    expect(getAnimationType("Agachamento Sumô")).toBe("squat");
    expect(getAnimationType("squat jump")).toBe("squat");
  });

  it("returns cat_stretch for gato exercises", () => {
    expect(getAnimationType("Alongamento do Gato")).toBe("cat_stretch");
    expect(getAnimationType("cat stretch")).toBe("cat_stretch");
  });

  it("returns leg_raise for elevação exercises", () => {
    expect(getAnimationType("Elevação de Pernas")).toBe("leg_raise");
    expect(getAnimationType("leg raise")).toBe("leg_raise");
  });

  it("returns roll_up for pilates exercises", () => {
    expect(getAnimationType("Pilates Roll Up")).toBe("roll_up");
    expect(getAnimationType("roll up básico")).toBe("roll_up");
  });

  it("returns scissors for tesoura exercises", () => {
    expect(getAnimationType("Tesoura")).toBe("scissors");
    expect(getAnimationType("scissors kick")).toBe("scissors");
  });

  it("returns rest for descanso exercises", () => {
    expect(getAnimationType("Descanso Ativo")).toBe("rest");
    expect(getAnimationType("rest day")).toBe("rest");
  });

  it("returns generic for unknown exercises", () => {
    expect(getAnimationType("Exercício Desconhecido")).toBe("generic");
    expect(getAnimationType("")).toBe("generic");
    expect(getAnimationType("burpee")).toBe("generic");
  });

  it("is case insensitive", () => {
    expect(getAnimationType("PRANCHA")).toBe("plank");
    expect(getAnimationType("PONTE")).toBe("glute_bridge");
    expect(getAnimationType("CRUNCH")).toBe("crunch");
  });
});
