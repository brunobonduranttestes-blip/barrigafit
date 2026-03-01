import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { GradientButton } from "@/components/ui/gradient-button";
import { ScreenContainer } from "@/components/screen-container";
import {
  getActiveProgramId,
  setActiveProgramId,
  getCompletedDays,
  isDayComplete,
} from "@/lib/storage";
import { PROGRAMS, type Program, type WorkoutDay } from "@/lib/mock-data";
import { useColors } from "@/hooks/use-colors";

export default function ProgramaDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const [program, setProgram] = useState<Program | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [completedDays, setCompletedDays] = useState<string[]>([]);
  const [expandedWeek, setExpandedWeek] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    const prog = PROGRAMS.find((p) => p.id === id);
    if (prog) {
      setProgram(prog);
      setExpandedWeek(prog.weeks[0]?.id || null);
    }
    const activeProgramId = await getActiveProgramId();
    setIsActive(activeProgramId === id);
    const days = await getCompletedDays();
    setCompletedDays(days);
  };

  const handleStartProgram = async () => {
    if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await setActiveProgramId(id);
    setIsActive(true);
    router.back();
  };

  if (!program) return null;

  const progress = completedDays.length;
  const progressPercent = Math.round((progress / program.duration) * 100);

  return (
    <ScreenContainer edges={["top", "left", "right"]} containerClassName="bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <LinearGradient
          colors={[program.color, program.colorSecondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.7 : 1 }]}
          >
            <IconSymbol name="chevron.left" size={22} color="#fff" />
          </Pressable>

          <View style={styles.heroContent}>
            <Text style={styles.heroLabel}>{program.duration} DIAS</Text>
            <Text style={styles.heroTitle}>{program.title}</Text>
            <Text style={styles.heroSubtitle}>{program.subtitle}</Text>

            <View style={styles.heroMeta}>
              <View style={styles.heroMetaItem}>
                <IconSymbol name="dumbbell.fill" size={14} color="rgba(255,255,255,0.8)" />
                <Text style={styles.heroMetaText}>{program.totalWorkouts} treinos</Text>
              </View>
              <View style={styles.heroMetaItem}>
                <IconSymbol name="clock.fill" size={14} color="rgba(255,255,255,0.8)" />
                <Text style={styles.heroMetaText}>{program.avgDuration} min/dia</Text>
              </View>
              <View style={styles.heroMetaItem}>
                <IconSymbol name="bolt.fill" size={14} color="rgba(255,255,255,0.8)" />
                <Text style={styles.heroMetaText}>{program.level}</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {/* Description */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Sobre o programa</Text>
            <Text style={[styles.description, { color: colors.muted }]}>{program.description}</Text>
          </View>

          {/* Focus Areas */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Foco</Text>
            <View style={styles.focusTags}>
              {program.focus.map((f) => (
                <View key={f} style={[styles.focusTag, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
                  <IconSymbol name="target" size={12} color={program.color} />
                  <Text style={[styles.focusTagText, { color: colors.foreground }]}>{f}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Progress (if active) */}
          {isActive && (
            <View style={[styles.progressCard, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
              <View style={styles.progressHeader}>
                <Text style={[styles.progressTitle, { color: colors.foreground }]}>Seu Progresso</Text>
                <Text style={[styles.progressPercent, { color: program.color }]}>{progressPercent}%</Text>
              </View>
              <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                <LinearGradient
                  colors={[program.color, program.colorSecondary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.progressFill, { width: `${progressPercent}%` as any }]}
                />
              </View>
              <Text style={[styles.progressSub, { color: colors.muted }]}>
                {progress} de {program.duration} dias concluídos
              </Text>
            </View>
          )}

          {/* Weeks */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Cronograma</Text>
            {program.weeks.map((week) => (
              <View key={week.id} style={[styles.weekContainer, { borderColor: colors.border }]}>
                <Pressable
                  onPress={() => setExpandedWeek(expandedWeek === week.id ? null : week.id)}
                  style={({ pressed }) => [
                    styles.weekHeader,
                    { backgroundColor: colors.surfaceAlt, opacity: pressed ? 0.8 : 1 },
                  ]}
                >
                  <View style={styles.weekHeaderLeft}>
                    <View style={[styles.weekBadge, { backgroundColor: program.color + "22" }]}>
                      <Text style={[styles.weekBadgeText, { color: program.color }]}>
                        S{week.weekNumber}
                      </Text>
                    </View>
                    <View>
                      <Text style={[styles.weekTitle, { color: colors.foreground }]}>
                        Semana {week.weekNumber}
                      </Text>
                      <Text style={[styles.weekSubtitle, { color: colors.muted }]}>{week.title}</Text>
                    </View>
                  </View>
                  <IconSymbol
                    name={expandedWeek === week.id ? "chevron.up" : "chevron.down"}
                    size={18}
                    color={colors.muted}
                  />
                </Pressable>

                {expandedWeek === week.id && (
                  <View style={[styles.daysContainer, { backgroundColor: colors.surface }]}>
                    {week.days.map((day) => {
                      const done = completedDays.includes(day.id);
                      return (
                        <DayRow
                          key={day.id}
                          day={day}
                          done={done}
                          programColor={program.color}
                          colors={colors}
                          onPress={() => {
                            if (!day.isRest) {
                              router.push({ pathname: "/aula/[id]", params: { id: day.id } });
                            }
                          }}
                        />
                      );
                    })}
                  </View>
                )}
              </View>
            ))}
          </View>

          {/* CTA */}
          <View style={styles.ctaContainer}>
            {isActive ? (
              <GradientButton
                label="Continuar Programa"
                onPress={() => router.back()}
                fullWidth
                size="lg"
              />
            ) : (
              <GradientButton
                label="Iniciar Programa"
                onPress={handleStartProgram}
                fullWidth
                size="lg"
              />
            )}
          </View>

          <View style={{ height: 32 }} />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function DayRow({
  day,
  done,
  programColor,
  colors,
  onPress,
}: {
  day: WorkoutDay;
  done: boolean;
  programColor: string;
  colors: any;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.dayRow,
        { borderBottomColor: colors.border, opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <View style={[styles.dayNumber, { backgroundColor: done ? programColor : colors.surfaceAlt }]}>
        {done ? (
          <IconSymbol name="checkmark" size={12} color="#fff" />
        ) : (
          <Text style={[styles.dayNumberText, { color: day.isRest ? colors.muted : colors.foreground }]}>
            {day.dayNumber}
          </Text>
        )}
      </View>

      <View style={styles.dayInfo}>
        <Text style={[styles.dayTitle, { color: day.isRest ? colors.muted : colors.foreground }]}>
          {day.title}
        </Text>
        {!day.isRest && (
          <Text style={[styles.dayMeta, { color: colors.muted }]}>
            {day.duration} min · {day.exercises.length} exercícios
          </Text>
        )}
        {day.isRest && (
          <Text style={[styles.dayMeta, { color: colors.muted }]}>Descanso</Text>
        )}
      </View>

      {!day.isRest && !done && (
        <IconSymbol name="chevron.right" size={16} color={colors.muted} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hero: {
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
  heroContent: {
    gap: 4,
  },
  heroLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  heroTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 16,
  },
  heroMeta: {
    flexDirection: "row",
    gap: 16,
  },
  heroMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  heroMetaText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
    fontWeight: "600",
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.3,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "400",
  },
  focusTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  focusTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  focusTagText: {
    fontSize: 13,
    fontWeight: "600",
  },
  progressCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    gap: 8,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressTitle: {
    fontSize: 15,
    fontWeight: "700",
  },
  progressPercent: {
    fontSize: 15,
    fontWeight: "800",
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressSub: {
    fontSize: 12,
    fontWeight: "500",
  },
  weekContainer: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    marginBottom: 12,
  },
  weekHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  weekHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  weekBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  weekBadgeText: {
    fontSize: 13,
    fontWeight: "800",
  },
  weekTitle: {
    fontSize: 15,
    fontWeight: "700",
  },
  weekSubtitle: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 1,
  },
  daysContainer: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.05)",
  },
  dayRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    paddingHorizontal: 16,
    gap: 12,
    borderBottomWidth: 0.5,
  },
  dayNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  dayNumberText: {
    fontSize: 13,
    fontWeight: "700",
  },
  dayInfo: {
    flex: 1,
    gap: 2,
  },
  dayTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  dayMeta: {
    fontSize: 12,
    fontWeight: "400",
  },
  ctaContainer: {
    marginBottom: 8,
  },
});
