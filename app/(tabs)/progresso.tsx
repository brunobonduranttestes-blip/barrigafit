import { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import {
  getCompletedDays,
  getProgressLog,
  getActiveProgramId,
  type ProgressEntry,
} from "@/lib/storage";
import { PROGRAMS } from "@/lib/mock-data";
import { useColors } from "@/hooks/use-colors";

const WEEK_DAYS = ["D", "S", "T", "Q", "Q", "S", "S"];

export default function ProgressoScreen() {
  const colors = useColors();
  const [completedDays, setCompletedDays] = useState<string[]>([]);
  const [history, setHistory] = useState<ProgressEntry[]>([]);
  const [activeProgram, setActiveProgram] = useState<typeof PROGRAMS[0] | null>(null);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [weekActivity, setWeekActivity] = useState<boolean[]>(Array(7).fill(false));

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    const days = await getCompletedDays();
    const hist = await getProgressLog();
    const programId = await getActiveProgramId();

    setCompletedDays(days);
    setHistory(hist.slice().reverse());

    const prog = PROGRAMS.find((p) => p.id === programId);
    setActiveProgram(prog || null);

    const total = hist.reduce((sum: number, e: ProgressEntry) => sum + (e.duration || 0), 0);
    setTotalMinutes(total);

    // Build week activity (last 7 days)
    const today = new Date();
    const activity = Array(7).fill(false);
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      const dateStr = d.toISOString().split("T")[0];
      activity[i] = hist.some((e: ProgressEntry) => e.date.startsWith(dateStr));
    }
    setWeekActivity(activity);
  };

  const progress = activeProgram
    ? Math.round((completedDays.length / activeProgram.duration) * 100)
    : 0;

  const streak = (() => {
    let count = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      if (history.some((e) => e.date.startsWith(dateStr))) {
        count++;
      } else {
        break;
      }
    }
    return count;
  })();

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  };

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.foreground }]}>Progresso</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            Acompanhe sua evolução
          </Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard
            icon="flame.fill"
            value={`${streak}`}
            label="Sequência"
            sub="dias seguidos"
            iconColor="#F59E0B"
            colors={colors}
          />
          <StatCard
            icon="checkmark.circle.fill"
            value={`${completedDays.length}`}
            label="Treinos"
            sub="concluídos"
            iconColor="#34D399"
            colors={colors}
          />
          <StatCard
            icon="clock.fill"
            value={`${totalMinutes}`}
            label="Minutos"
            sub="de exercício"
            iconColor={colors.primary}
            colors={colors}
          />
          <StatCard
            icon="target"
            value={`${progress}%`}
            label="Programa"
            sub="concluído"
            iconColor="#7C3AED"
            colors={colors}
          />
        </View>

        {/* Weekly Activity */}
        <View style={[styles.card, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>Atividade Semanal</Text>
          <View style={styles.weekRow}>
            {WEEK_DAYS.map((day, i) => (
              <View key={i} style={styles.weekDayCol}>
                <View
                  style={[
                    styles.weekDayDot,
                    weekActivity[i]
                      ? { backgroundColor: colors.primary }
                      : { backgroundColor: colors.border },
                  ]}
                >
                  {weekActivity[i] && (
                    <IconSymbol name="checkmark" size={10} color="#fff" />
                  )}
                </View>
                <Text style={[styles.weekDayLabel, { color: colors.muted }]}>{day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Program Progress */}
        {activeProgram && (
          <View style={[styles.card, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: colors.foreground }]}>
                {activeProgram.title}
              </Text>
              <Text style={[styles.cardPercent, { color: activeProgram.color }]}>
                {progress}%
              </Text>
            </View>

            <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
              <LinearGradient
                colors={[activeProgram.color, activeProgram.colorSecondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressFill, { width: `${progress}%` as any }]}
              />
            </View>

            <Text style={[styles.progressSub, { color: colors.muted }]}>
              {completedDays.length} de {activeProgram.duration} dias concluídos
            </Text>

            {/* Day grid */}
            <View style={styles.dayGrid}>
              {Array.from({ length: activeProgram.duration }).map((_, i) => {
                let dayId = "";
                let dayCount = 0;
                outer: for (const week of activeProgram.weeks) {
                  for (const day of week.days) {
                    dayCount++;
                    if (dayCount === i + 1) {
                      dayId = day.id;
                      break outer;
                    }
                  }
                }
                const done = completedDays.includes(dayId);
                const isCurrent = i === completedDays.length;
                return (
                  <View
                    key={i}
                    style={[
                      styles.dayDot,
                      done
                        ? { backgroundColor: activeProgram.color }
                        : isCurrent
                        ? { backgroundColor: activeProgram.color + "44", borderColor: activeProgram.color, borderWidth: 1.5 }
                        : { backgroundColor: colors.border },
                    ]}
                  />
                );
              })}
            </View>
          </View>
        )}

        {/* History */}
        <View style={styles.historySection}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Histórico
          </Text>

          {history.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
              <IconSymbol name="clock.fill" size={32} color={colors.muted} />
              <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
                Nenhum treino ainda
              </Text>
              <Text style={[styles.emptySubtitle, { color: colors.muted }]}>
                Complete seu primeiro treino para ver o histórico aqui
              </Text>
            </View>
          ) : (
            history.map((entry, i) => (
              <HistoryItem key={i} entry={entry} formatDate={formatDate} colors={colors} />
            ))
          )}
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
  sub,
  iconColor,
  colors,
}: {
  icon: any;
  value: string;
  label: string;
  sub: string;
  iconColor: string;
  colors: any;
}) {
  return (
    <View style={[styles.statCard, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
      <IconSymbol name={icon} size={22} color={iconColor} />
      <Text style={[styles.statValue, { color: colors.foreground }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.foreground }]}>{label}</Text>
      <Text style={[styles.statSub, { color: colors.muted }]}>{sub}</Text>
    </View>
  );
}

function HistoryItem({
  entry,
  formatDate,
  colors,
}: {
  entry: ProgressEntry;
  formatDate: (d: string) => string;
  colors: any;
}) {
  const prog = PROGRAMS.find((p) => p.id === entry.programId);
  return (
    <View style={[styles.historyItem, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
      <View
        style={[
          styles.historyIcon,
          { backgroundColor: prog ? prog.color + "22" : colors.border },
        ]}
      >
        <IconSymbol name="checkmark.circle.fill" size={20} color={prog?.color || colors.primary} />
      </View>
      <View style={styles.historyInfo}>
        <Text style={[styles.historyTitle, { color: colors.foreground }]}>
          Treino concluído
        </Text>
        <Text style={[styles.historyMeta, { color: colors.muted }]}>
          {prog?.title || "Biblioteca"} · {entry.duration} min
        </Text>
      </View>
      <Text style={[styles.historyDate, { color: colors.muted }]}>
        {formatDate(entry.date)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: { paddingTop: 20 },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "400",
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    width: "47%",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 3,
  },
  statValue: {
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: -0.5,
    marginTop: 6,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: "700",
  },
  statSub: {
    fontSize: 11,
    fontWeight: "400",
  },
  card: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
    gap: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
  },
  cardPercent: {
    fontSize: 15,
    fontWeight: "800",
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  weekDayCol: {
    alignItems: "center",
    gap: 6,
  },
  weekDayDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  weekDayLabel: {
    fontSize: 11,
    fontWeight: "600",
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
  dayGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 4,
  },
  dayDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  historySection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.3,
    marginBottom: 14,
  },
  emptyState: {
    borderRadius: 16,
    padding: 28,
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 19,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    gap: 12,
    marginBottom: 10,
  },
  historyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  historyInfo: {
    flex: 1,
    gap: 2,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  historyMeta: {
    fontSize: 12,
    fontWeight: "400",
  },
  historyDate: {
    fontSize: 12,
    fontWeight: "500",
  },
});
