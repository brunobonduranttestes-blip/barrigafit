import { LinearGradient } from "expo-linear-gradient";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { IconSymbol } from "./icon-symbol";
import { ExerciseAnimation, getAnimationType } from "./exercise-animation";
import { useColors } from "@/hooks/use-colors";
import type { LibraryClass, Program } from "@/lib/mock-data";

// ─── Program Card ─────────────────────────────────────────────────────────────

interface ProgramCardProps {
  program: Program;
  onPress: () => void;
  isActive?: boolean;
  currentDay?: number;
}

export function ProgramCard({ program, onPress, isActive, currentDay }: ProgramCardProps) {
  const colors = useColors();
  const progress = isActive && currentDay ? (currentDay / program.duration) * 100 : 0;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.programCard,
        { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
      ]}
    >
      <LinearGradient
        colors={[program.color, program.colorSecondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.programCardHeader}
      >
        {program.isFeatured && (
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredText}>DESTAQUE</Text>
          </View>
        )}
        <Text style={styles.programDuration}>{program.duration} dias</Text>
        <Text style={styles.programTitle}>{program.title}</Text>
        <Text style={styles.programSubtitle}>{program.subtitle}</Text>
      </LinearGradient>

      <View style={[styles.programCardBody, { backgroundColor: colors.card }]}>
        <View style={styles.programMeta}>
          <View style={styles.metaItem}>
            <IconSymbol name="dumbbell.fill" size={14} color={colors.muted} />
            <Text style={[styles.metaText, { color: colors.muted }]}>{program.totalWorkouts} treinos</Text>
          </View>
          <View style={styles.metaItem}>
            <IconSymbol name="clock.fill" size={14} color={colors.muted} />
            <Text style={[styles.metaText, { color: colors.muted }]}>{program.avgDuration} min/dia</Text>
          </View>
          <View style={styles.metaItem}>
            <IconSymbol name="bolt.fill" size={14} color={colors.muted} />
            <Text style={[styles.metaText, { color: colors.muted }]}>{program.level}</Text>
          </View>
        </View>

        {isActive && (
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={[styles.progressLabel, { color: colors.muted }]}>Progresso</Text>
              <Text style={[styles.progressPercent, { color: colors.primary }]}>
                {Math.round(progress)}%
              </Text>
            </View>
            <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
              <LinearGradient
                colors={[program.color, program.colorSecondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressFill, { width: `${progress}%` as any }]}
              />
            </View>
          </View>
        )}
      </View>
    </Pressable>
  );
}

// ─── Library Class Card ───────────────────────────────────────────────────────

interface ClassCardProps {
  item: LibraryClass;
  onPress: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export function ClassCard({ item, onPress, isFavorite, onToggleFavorite }: ClassCardProps) {
  const colors = useColors();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.classCard,
        { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
      ]}
    >
      <View style={[styles.classThumbnail, { backgroundColor: item.thumbnailColor + "18" }]}>
        <ExerciseAnimation
          type={getAnimationType(item.exercises[0]?.name ?? "")}
          color={item.thumbnailColor}
          size={100}
        />
        <View style={styles.playButton}>
          <IconSymbol name="play.fill" size={16} color="#fff" />
        </View>
        <View style={styles.durationBadge}>
          <IconSymbol name="clock.fill" size={10} color="#fff" />
          <Text style={styles.durationText}>{item.duration} min</Text>
        </View>
      </View>

      <View style={[styles.classCardBody, { backgroundColor: colors.card }]}>
        <Text style={[styles.classTitle, { color: colors.foreground }]} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.classMeta}>
          <View style={[styles.levelBadge, { backgroundColor: colors.surfaceAlt }]}>
            <Text style={[styles.levelText, { color: colors.muted }]}>{item.level}</Text>
          </View>
          <View style={styles.focusTags}>
            {item.focus.slice(0, 2).map((f) => (
              <View key={f} style={[styles.focusTag, { backgroundColor: colors.surfaceAlt }]}>
                <Text style={[styles.focusTagText, { color: colors.muted }]}>{f}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {onToggleFavorite && (
        <Pressable
          onPress={onToggleFavorite}
          style={styles.favoriteBtn}
          hitSlop={8}
        >
          <IconSymbol
            name={isFavorite ? "heart.fill" : "heart"}
            size={18}
            color={isFavorite ? "#E91E8C" : colors.muted}
          />
        </Pressable>
      )}
    </Pressable>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // Program Card
  programCard: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    marginBottom: 16,
  },
  programCardHeader: {
    padding: 20,
    paddingTop: 24,
    paddingBottom: 20,
    minHeight: 130,
    justifyContent: "flex-end",
  },
  featuredBadge: {
    position: "absolute",
    top: 14,
    right: 14,
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  featuredText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
  },
  programDuration: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  programTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  programSubtitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
    fontWeight: "500",
    marginTop: 2,
  },
  programCardBody: {
    padding: 16,
  },
  programMeta: {
    flexDirection: "row",
    gap: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontWeight: "500",
  },
  progressSection: {
    marginTop: 14,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  progressPercent: {
    fontSize: 12,
    fontWeight: "700",
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },

  // Class Card
  classCard: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    width: 180,
    marginRight: 12,
  },
  classThumbnail: {
    height: 110,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  playButton: {
    position: "absolute",
    bottom: 8,
    left: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
  },
  durationBadge: {
    position: "absolute",
    bottom: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 10,
  },
  durationText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  classCardBody: {
    padding: 12,
  },
  classTitle: {
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
    marginBottom: 8,
  },
  classMeta: {
    gap: 6,
  },
  levelBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  levelText: {
    fontSize: 10,
    fontWeight: "600",
  },
  focusTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  focusTag: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  focusTagText: {
    fontSize: 10,
    fontWeight: "500",
  },
  favoriteBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
});
