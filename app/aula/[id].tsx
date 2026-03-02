import { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Platform,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import { useKeepAwake } from "expo-keep-awake";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { GradientButton } from "@/components/ui/gradient-button";
import { ScreenContainer } from "@/components/screen-container";
import { markDayComplete, addProgressEntry, isDayComplete } from "@/lib/storage";
import { PROGRAMS, LIBRARY_CLASSES, type Exercise, type WorkoutDay } from "@/lib/mock-data";
import { useColors } from "@/hooks/use-colors";
import { ExerciseAnimation, getAnimationType } from "@/components/ui/exercise-animation";
import { CountdownOverlay } from "@/components/ui/countdown-overlay";
import { Play, Pause } from "lucide-react-native";

export default function AulaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  useKeepAwake();

  const [workout, setWorkout] = useState<WorkoutDay | null>(null);
  const [programId, setProgramId] = useState<string | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [alreadyDone, setAlreadyDone] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [exerciseTimer, setExerciseTimer] = useState(0);
  const [showCountdown, setShowCountdown] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const exerciseTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    loadWorkout();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (exerciseTimerRef.current) clearInterval(exerciseTimerRef.current);
    };
  }, [id]);

  const loadWorkout = async () => {
    // Check if it's a library class
    const libClass = LIBRARY_CLASSES.find((c) => c.id === id);
    if (libClass) {
      const fakeDay: WorkoutDay = {
        id: libClass.id,
        dayNumber: 0,
        title: libClass.title,
        duration: libClass.duration,
        exercises: libClass.exercises,
      };
      setWorkout(fakeDay);
      return;
    }

    // Check in programs
    for (const prog of PROGRAMS) {
      for (const week of prog.weeks) {
        for (const day of week.days) {
          if (day.id === id) {
            setWorkout(day);
            setProgramId(prog.id);
            const done = await isDayComplete(day.id);
            setAlreadyDone(done);
            return;
          }
        }
      }
    }
  };

  const startWorkout = () => {
    setIsStarted(true);
    setIsPaused(false);
    setExerciseTimer(workout?.exercises[0]?.duration || 30);

    timerRef.current = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);

    startExerciseTimer(workout?.exercises[0]?.duration || 30);
  };

  const togglePause = () => {
    if (isPaused) {
      setIsPaused(false);
      timerRef.current = setInterval(() => {
        setElapsedSeconds((s) => s + 1);
      }, 1000);
      startExerciseTimer(exerciseTimer);
    } else {
      setIsPaused(true);
      if (timerRef.current) clearInterval(timerRef.current);
      if (exerciseTimerRef.current) clearInterval(exerciseTimerRef.current);
    }
  };

  const startExerciseTimer = (duration: number) => {
    if (exerciseTimerRef.current) clearInterval(exerciseTimerRef.current);
    setExerciseTimer(duration);
    exerciseTimerRef.current = setInterval(() => {
      setExerciseTimer((t) => {
        if (t <= 1) {
          clearInterval(exerciseTimerRef.current!);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const handleNextExercise = () => {
    if (!workout) return;
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const nextIndex = currentExerciseIndex + 1;
    if (nextIndex >= workout.exercises.length) {
      handleComplete();
    } else {
      setShowCountdown(true);
      setTimeout(() => {
        setCurrentExerciseIndex(nextIndex);
        startExerciseTimer(workout.exercises[nextIndex].duration);
        setShowCountdown(false);
      }, 4000);
    }
  };

  const handleComplete = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (exerciseTimerRef.current) clearInterval(exerciseTimerRef.current);

    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    if (workout && !alreadyDone) {
      await markDayComplete(workout.id);
      await addProgressEntry({
        date: new Date().toISOString(),
        dayId: workout.id,
        programId: programId || "library",
        duration: Math.round(elapsedSeconds / 60),
        exercisesCompleted: workout.exercises.length,
      });
    }

    setIsCompleted(true);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (!workout) return null;

  const currentExercise: Exercise | undefined = workout.exercises[currentExerciseIndex];
  const totalExercises = workout.exercises.length;
  const progressPercent = isStarted
    ? Math.round((currentExerciseIndex / totalExercises) * 100)
    : 0;

  // ─── COMPLETED STATE ──────────────────────────────────────────────────────

  if (isCompleted) {
    return (
      <ScreenContainer containerClassName="bg-background" edges={["top", "left", "right", "bottom"]}>
        <View style={styles.completedContainer}>
          <LinearGradient
            colors={["#E91E8C", "#C026D3"]}
            style={styles.completedIcon}
          >
            <IconSymbol name="trophy.fill" size={48} color="#fff" />
          </LinearGradient>

          <Text style={[styles.completedTitle, { color: colors.foreground }]}>
            Treino Concluído!
          </Text>
          <Text style={[styles.completedSubtitle, { color: colors.muted }]}>
            Parabéns! Você completou {totalExercises} exercícios em{" "}
            {formatTime(elapsedSeconds)}.
          </Text>

          <View style={styles.completedStats}>
            <CompletedStat icon="clock.fill" value={formatTime(elapsedSeconds)} label="Tempo total" colors={colors} />
            <CompletedStat icon="dumbbell.fill" value={`${totalExercises}`} label="Exercícios" colors={colors} />
            <CompletedStat icon="flame.fill" value="Ativo" label="Status" colors={colors} />
          </View>

          <View style={styles.completedActions}>
            <GradientButton
              label="Voltar ao Início"
              onPress={() => router.replace("/(tabs)")}
              fullWidth
              size="lg"
            />
            <Pressable onPress={() => router.push("/descobrir")} style={styles.discoverBtn}>
              <Text style={[styles.discoverText, { color: colors.muted }]}>
                Conhecer outros programas
              </Text>
            </Pressable>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  // ─── PRE-START STATE ──────────────────────────────────────────────────────

  if (!isStarted) {
    return (
      <ScreenContainer containerClassName="bg-background" edges={["top", "left", "right"]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <LinearGradient
            colors={["#E91E8C", "#C026D3"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.preStartHero}
          >
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.7 : 1 }]}
            >
              <IconSymbol name="xmark" size={20} color="#fff" />
            </Pressable>

            <View style={styles.preStartContent}>
              <Text style={styles.preStartLabel}>TREINO</Text>
              <Text style={styles.preStartTitle}>{workout.title}</Text>
              <View style={styles.preStartMeta}>
                <View style={styles.preStartMetaItem}>
                  <IconSymbol name="clock.fill" size={14} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.preStartMetaText}>{workout.duration} min</Text>
                </View>
                <View style={styles.preStartMetaItem}>
                  <IconSymbol name="dumbbell.fill" size={14} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.preStartMetaText}>{totalExercises} exercícios</Text>
                </View>
              </View>
            </View>
          </LinearGradient>

          <View style={styles.preStartBody}>
            <Text style={[styles.exerciseListTitle, { color: colors.foreground }]}>
              Exercícios desta aula
            </Text>

            {workout.exercises.map((ex, index) => (
              <View
                key={ex.id}
                style={[styles.exerciseListItem, { borderBottomColor: colors.border }]}
              >
                <View style={[styles.exerciseListNumber, { backgroundColor: colors.surfaceAlt }]}>
                  <Text style={[styles.exerciseListNumberText, { color: colors.primary }]}>
                    {index + 1}
                  </Text>
                </View>
                <View style={styles.exerciseListInfo}>
                  <Text style={[styles.exerciseListName, { color: colors.foreground }]}>
                    {ex.name}
                  </Text>
                  <Text style={[styles.exerciseListMeta, { color: colors.muted }]}>
                    {ex.reps ? `${ex.reps} reps` : `${ex.duration}s`}
                    {ex.sets ? ` · ${ex.sets} séries` : ""}
                  </Text>
                </View>
                <View style={[styles.focusDot, { backgroundColor: ex.thumbnailColor }]} />
              </View>
            ))}

            <View style={styles.startBtnContainer}>
              {alreadyDone && (
                <View style={[styles.doneBanner, { backgroundColor: colors.surfaceAlt }]}>
                  <IconSymbol name="checkmark.circle.fill" size={16} color="#34D399" />
                  <Text style={[styles.doneText, { color: colors.muted }]}>
                    Você já completou este treino
                  </Text>
                </View>
              )}
              <GradientButton
                label={alreadyDone ? "Repetir Treino" : "Iniciar Treino"}
                onPress={startWorkout}
                fullWidth
                size="lg"
              />
            </View>

            <View style={{ height: 32 }} />
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  // ─── ACTIVE WORKOUT STATE ─────────────────────────────────────────────────

  return (
    <ScreenContainer containerClassName="bg-background" edges={["top", "left", "right"]}>
      {/* Progress Bar */}
      <View style={[styles.progressBarContainer, { backgroundColor: colors.border }]}>
        <LinearGradient
          colors={["#E91E8C", "#C026D3"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.progressBarFill, { width: `${progressPercent}%` as any }]}
        />
      </View>

      {/* Header */}
      <View style={styles.activeHeader}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.activeCloseBtn,
            { backgroundColor: colors.surfaceAlt, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <IconSymbol name="xmark" size={18} color={colors.muted} />
        </Pressable>
        <Text style={[styles.activeHeaderTitle, { color: colors.foreground }]}>
          {currentExerciseIndex + 1} / {totalExercises}
        </Text>
        <View style={[styles.timerBadge, { backgroundColor: colors.surfaceAlt }]}>
          <IconSymbol name="clock.fill" size={12} color={colors.muted} />
          <Text style={[styles.timerText, { color: colors.foreground }]}>
            {formatTime(elapsedSeconds)}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.activeScroll}
        contentContainerStyle={styles.activeScrollContent}
        showsVerticalScrollIndicator={false}
      >
        {currentExercise && (
          <>
            {/* Exercise Visual - Animated */}
            <View style={[styles.exerciseVisual, { backgroundColor: currentExercise.thumbnailColor + "18" }]}>
              <ExerciseAnimation
                type={getAnimationType(currentExercise.name)}
                color={currentExercise.thumbnailColor}
                size={220}
              />

              {/* Timer Circle */}
              <View style={styles.exerciseTimerContainer}>
                <View style={[styles.exerciseTimerCircle, { borderColor: currentExercise.thumbnailColor + "66" }]}>
                  <Text style={[styles.exerciseTimerValue, { color: currentExercise.thumbnailColor }]}>{exerciseTimer}</Text>
                  <Text style={styles.exerciseTimerLabel}>seg</Text>
                </View>
              </View>
            </View>

            {/* Exercise Info */}
            <View style={styles.exerciseInfo}>
              <Text style={[styles.exerciseName, { color: colors.foreground }]}>
                {currentExercise.name}
              </Text>

              <View style={styles.exerciseMeta}>
                {currentExercise.reps && (
                  <View style={[styles.exerciseMetaBadge, { backgroundColor: colors.surfaceAlt }]}>
                    <IconSymbol name="arrow.clockwise" size={12} color={colors.primary} />
                    <Text style={[styles.exerciseMetaText, { color: colors.foreground }]}>
                      {currentExercise.reps} reps
                    </Text>
                  </View>
                )}
                {currentExercise.sets && (
                  <View style={[styles.exerciseMetaBadge, { backgroundColor: colors.surfaceAlt }]}>
                    <IconSymbol name="list.bullet" size={12} color={colors.primary} />
                    <Text style={[styles.exerciseMetaText, { color: colors.foreground }]}>
                      {currentExercise.sets} séries
                    </Text>
                  </View>
                )}
                <View style={[styles.exerciseMetaBadge, { backgroundColor: colors.surfaceAlt }]}>
                  <IconSymbol name="bolt.fill" size={12} color={colors.primary} />
                  <Text style={[styles.exerciseMetaText, { color: colors.foreground }]}>
                    {currentExercise.level}
                  </Text>
                </View>
              </View>

              <Text style={[styles.exerciseDescription, { color: colors.muted }]}>
                {currentExercise.description}
              </Text>

              {/* Breathing Guide */}
              <View style={[styles.breathingCard, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
                <IconSymbol name="heart.fill" size={16} color="#34D399" />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.breathingTitle, { color: colors.foreground }]}>
                    Respiração
                  </Text>
                  <Text style={[styles.breathingText, { color: colors.muted }]}>
                    {currentExercise.breathingGuide}
                  </Text>
                </View>
              </View>

              {/* Tips */}
              {currentExercise.tips.length > 0 && (
                <View style={styles.tipsContainer}>
                  <Text style={[styles.tipsTitle, { color: colors.foreground }]}>Dicas</Text>
                  {currentExercise.tips.map((tip, i) => (
                    <View key={i} style={styles.tipRow}>
                      <IconSymbol name="checkmark.circle.fill" size={14} color={colors.primary} />
                      <Text style={[styles.tipText, { color: colors.muted }]}>{tip}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Common Mistakes */}
              {currentExercise.commonMistakes.length > 0 && (
                <View style={styles.tipsContainer}>
                  <Text style={[styles.tipsTitle, { color: colors.foreground }]}>Evite</Text>
                  {currentExercise.commonMistakes.map((m, i) => (
                    <View key={i} style={styles.tipRow}>
                      <IconSymbol name="xmark.circle.fill" size={14} color={colors.error} />
                      <Text style={[styles.tipText, { color: colors.muted }]}>{m}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Action */}
      <View style={[styles.bottomAction, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <GradientButton
          label={
            currentExerciseIndex === totalExercises - 1
              ? "Concluir Treino"
              : "Próximo Exercício"
          }
          onPress={handleNextExercise}
          fullWidth
          size="lg"
        />
      </View>
    </ScreenContainer>
  );
}

function CompletedStat({ icon, value, label, colors }: any) {
  return (
    <View style={[styles.completedStat, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
      <IconSymbol name={icon} size={20} color={colors.primary} />
      <Text style={[styles.completedStatValue, { color: colors.foreground }]}>{value}</Text>
      <Text style={[styles.completedStatLabel, { color: colors.muted }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // Completed
  completedContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 16,
  },
  completedIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  completedTitle: {
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.5,
    textAlign: "center",
  },
  completedSubtitle: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
  completedStats: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
    marginTop: 8,
  },
  completedStat: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
  },
  completedStatValue: {
    fontSize: 16,
    fontWeight: "800",
  },
  completedStatLabel: {
    fontSize: 10,
    fontWeight: "500",
    textAlign: "center",
  },
  completedActions: {
    width: "100%",
    gap: 12,
    marginTop: 8,
  },
  discoverBtn: {
    alignItems: "center",
    paddingVertical: 8,
  },
  discoverText: {
    fontSize: 14,
    fontWeight: "500",
  },
  // Pre-start
  preStartHero: {
    paddingTop: Platform.OS === "ios" ? 56 : 40,
    paddingBottom: 28,
    paddingHorizontal: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  preStartContent: {
    gap: 4,
  },
  preStartLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  preStartTitle: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  preStartMeta: {
    flexDirection: "row",
    gap: 16,
  },
  preStartMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  preStartMetaText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
    fontWeight: "600",
  },
  preStartBody: {
    padding: 20,
  },
  exerciseListTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  exerciseListItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    gap: 12,
  },
  exerciseListNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  exerciseListNumberText: {
    fontSize: 13,
    fontWeight: "800",
  },
  exerciseListInfo: {
    flex: 1,
  },
  exerciseListName: {
    fontSize: 14,
    fontWeight: "600",
  },
  exerciseListMeta: {
    fontSize: 12,
    marginTop: 2,
  },
  focusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  startBtnContainer: {
    marginTop: 24,
    gap: 12,
  },
  doneBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 12,
  },
  doneText: {
    fontSize: 13,
    fontWeight: "500",
  },
  // Active workout
  progressBarContainer: {
    height: 3,
    width: "100%",
  },
  progressBarFill: {
    height: "100%",
  },
  activeHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  activeCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  activeHeaderTitle: {
    fontSize: 15,
    fontWeight: "700",
  },
  timerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  timerText: {
    fontSize: 13,
    fontWeight: "700",
  },
  activeScroll: {
    flex: 1,
  },
  activeScrollContent: {
    paddingBottom: 20,
  },
  exerciseVisual: {
    height: 260,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    borderRadius: 20,
    marginHorizontal: 16,
    marginTop: 8,
    overflow: "hidden",
  },
  exerciseTimerContainer: {
    position: "absolute",
    bottom: 14,
    right: 14,
  },
  exerciseTimerCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },
  exerciseTimerValue: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "900",
    lineHeight: 24,
  },
  exerciseTimerLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 9,
    fontWeight: "600",
  },
  exerciseInfo: {
    padding: 20,
    gap: 16,
  },
  exerciseName: {
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  exerciseMeta: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  exerciseMetaBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  exerciseMetaText: {
    fontSize: 12,
    fontWeight: "600",
  },
  exerciseDescription: {
    fontSize: 14,
    lineHeight: 22,
  },
  breathingCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  breathingTitle: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 3,
  },
  breathingText: {
    fontSize: 13,
    lineHeight: 19,
  },
  tipsContainer: {
    gap: 8,
  },
  tipsTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  tipRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  tipText: {
    fontSize: 13,
    lineHeight: 19,
    flex: 1,
  },
  bottomAction: {
    padding: 16,
    paddingBottom: Platform.OS === "ios" ? 32 : 16,
    borderTopWidth: 0.5,
  },
});
