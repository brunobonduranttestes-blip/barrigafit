import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  FlatList,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { GradientButton } from "@/components/ui/gradient-button";
import { ClassCard } from "@/components/ui/workout-card";
import { ScreenContainer } from "@/components/screen-container";
import {
  getActiveProgramId,
  getCompletedDays,
  getUserProfile,
} from "@/lib/storage";
import { PROGRAMS, LIBRARY_CLASSES, type Program, type WorkoutDay } from "@/lib/mock-data";
import { useColors } from "@/hooks/use-colors";

export default function DashboardScreen() {
  const colors = useColors();
  const [activeProgram, setActiveProgram] = useState<Program | null>(null);
  const [todayWorkout, setTodayWorkout] = useState<WorkoutDay | null>(null);
  const [completedDays, setCompletedDays] = useState<string[]>([]);
  const [currentDay, setCurrentDay] = useState(1);
  const [streak, setStreak] = useState(0);
  const [greeting, setGreeting] = useState("Bom dia");

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Bom dia");
    else if (hour < 18) setGreeting("Boa tarde");
    else setGreeting("Boa noite");

    const programId = await getActiveProgramId();
    const completed = await getCompletedDays();
    setCompletedDays(completed);

    if (programId) {
      const program = PROGRAMS.find((p) => p.id === programId);
      if (program) {
        setActiveProgram(program);
        const dayNum = completed.length + 1;
        setCurrentDay(Math.min(dayNum, program.duration));
        setStreak(completed.length);

        // Find today's workout
        let dayCount = 0;
        outer: for (const week of program.weeks) {
          for (const day of week.days) {
            dayCount++;
            if (dayCount === dayNum) {
              setTodayWorkout(day);
              break outer;
            }
          }
        }
      }
    }
  };

  const progress = activeProgram
    ? Math.round((completedDays.length / activeProgram.duration) * 100)
    : 0;

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.muted }]}>{greeting}</Text>
            <Text style={[styles.headerTitle, { color: colors.foreground }]}>
              BARRIGA<Text style={{ color: colors.primary }}>FIT</Text>
            </Text>
          </View>
          <Pressable
            onPress={() => router.push("/descobrir")}
            style={({ pressed }) => [
              styles.notifBtn,
              { backgroundColor: colors.surfaceAlt, opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <IconSymbol name="sparkles" size={20} color={colors.primary} />
          </Pressable>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <StatCard
            icon="flame.fill"
            value={`${streak}`}
            label="Dias seguidos"
            iconColor="#F59E0B"
            colors={colors}
          />
          <StatCard
            icon="checkmark.circle.fill"
            value={`${completedDays.length}`}
            label="Treinos feitos"
            iconColor="#34D399"
            colors={colors}
          />
          <StatCard
            icon="target"
            value={`${progress}%`}
            label="Concluído"
            iconColor={colors.primary}
            colors={colors}
          />
        </View>

        {/* Today's Workout */}
        {activeProgram && todayWorkout && !todayWorkout.isRest && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Treino de Hoje
            </Text>
            <Pressable
              onPress={() => router.push({ pathname: "/aula/[id]", params: { id: todayWorkout.id } })}
              style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
            >
              <LinearGradient
                colors={[activeProgram.color, activeProgram.colorSecondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.todayCard}
              >
                <View style={styles.todayCardTop}>
                  <View>
                    <Text style={styles.todayDayLabel}>
                      DIA {currentDay} DE {activeProgram.duration}
                    </Text>
                    <Text style={styles.todayTitle}>{todayWorkout.title}</Text>
                    <Text style={styles.todayProgram}>{activeProgram.title}</Text>
                  </View>
                  <View style={styles.playCircle}>
                    <IconSymbol name="play.fill" size={24} color="#fff" />
                  </View>
                </View>

                <View style={styles.todayMeta}>
                  <View style={styles.todayMetaItem}>
                    <IconSymbol name="clock.fill" size={14} color="rgba(255,255,255,0.8)" />
                    <Text style={styles.todayMetaText}>{todayWorkout.duration} min</Text>
                  </View>
                  <View style={styles.todayMetaItem}>
                    <IconSymbol name="dumbbell.fill" size={14} color="rgba(255,255,255,0.8)" />
                    <Text style={styles.todayMetaText}>{todayWorkout.exercises.length} exercícios</Text>
                  </View>
                </View>

                {/* Progress bar */}
                <View style={styles.todayProgressBar}>
                  <View
                    style={[
                      styles.todayProgressFill,
                      { width: `${progress}%` as any },
                    ]}
                  />
                </View>
                <Text style={styles.todayProgressText}>{progress}% do programa concluído</Text>
              </LinearGradient>
            </Pressable>
          </View>
        )}

        {/* Rest Day */}
        {activeProgram && todayWorkout?.isRest && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Hoje</Text>
            <View style={[styles.restCard, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
              <IconSymbol name="heart.fill" size={28} color="#34D399" />
              <Text style={[styles.restTitle, { color: colors.foreground }]}>Dia de Descanso</Text>
              <Text style={[styles.restSubtitle, { color: colors.muted }]}>
                Seu corpo precisa recuperar. Aproveite para alongar!
              </Text>
            </View>
          </View>
        )}

        {/* No Program */}
        {!activeProgram && (
          <View style={styles.section}>
            <View style={[styles.noProgramCard, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
              <IconSymbol name="dumbbell.fill" size={32} color={colors.primary} />
              <Text style={[styles.noProgramTitle, { color: colors.foreground }]}>
                Comece seu programa
              </Text>
              <Text style={[styles.noProgramSubtitle, { color: colors.muted }]}>
                Escolha um programa e inicie sua transformação
              </Text>
              <GradientButton
                label="Ver Programas"
                onPress={() => router.push("/(tabs)/programas")}
                size="md"
              />
            </View>
          </View>
        )}

        {/* Cross-sell Banner */}
        <View style={styles.section}>
          <Pressable
            onPress={() => router.push("/descobrir")}
            style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
          >
            <LinearGradient
              colors={["#7C3AED", "#4F46E5"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.banner}
            >
              <View style={styles.bannerContent}>
                <View style={styles.bannerBadge}>
                  <Text style={styles.bannerBadgeText}>NOVO</Text>
                </View>
                <Text style={styles.bannerTitle}>HORMONE-SYNC</Text>
                <Text style={styles.bannerSubtitle}>
                  Treine em harmonia com seu ciclo menstrual
                </Text>
              </View>
              <View style={styles.bannerArrow}>
                <IconSymbol name="arrow.right" size={20} color="#fff" />
              </View>
            </LinearGradient>
          </Pressable>
        </View>

        {/* Featured Classes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Aulas em Destaque
            </Text>
            <Pressable onPress={() => router.push("/(tabs)/biblioteca")}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>Ver todas</Text>
            </Pressable>
          </View>
          <FlatList
            data={LIBRARY_CLASSES.slice(0, 5)}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
            renderItem={({ item }) => (
              <ClassCard
                item={item}
                onPress={() => router.push({ pathname: "/aula/[id]", params: { id: item.id } })}
              />
            )}
          />
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

function StatCard({
  icon,
  value,
  label,
  iconColor,
  colors,
}: {
  icon: any;
  value: string;
  label: string;
  iconColor: string;
  colors: any;
}) {
  return (
    <View style={[styles.statCard, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
      <IconSymbol name={icon} size={20} color={iconColor} />
      <Text style={[styles.statValue, { color: colors.foreground }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.muted }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  greeting: {
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  notifBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
  },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 14,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.3,
    marginBottom: 14,
  },
  seeAll: {
    fontSize: 13,
    fontWeight: "600",
  },
  // Today Card
  todayCard: {
    borderRadius: 20,
    padding: 20,
  },
  todayCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  todayDayLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 4,
  },
  todayTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  todayProgram: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
    fontWeight: "500",
    marginTop: 2,
  },
  playCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  todayMeta: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  todayMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  todayMetaText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
    fontWeight: "600",
  },
  todayProgressBar: {
    height: 4,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 6,
  },
  todayProgressFill: {
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 2,
  },
  todayProgressText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 11,
    fontWeight: "500",
  },
  // Rest Card
  restCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
  },
  restTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 4,
  },
  restSubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  // No Program Card
  noProgramCard: {
    borderRadius: 20,
    padding: 28,
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
  },
  noProgramTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 4,
  },
  noProgramSubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 4,
  },
  // Banner
  banner: {
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  bannerContent: {
    flex: 1,
    gap: 4,
  },
  bannerBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 4,
  },
  bannerBadgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1,
  },
  bannerTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  bannerSubtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 17,
  },
  bannerArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  horizontalList: {
    paddingRight: 20,
  },
});
