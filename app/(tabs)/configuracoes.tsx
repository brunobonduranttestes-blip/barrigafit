import { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Alert,
  Switch,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import {
  getUserProfile,
  getActiveProgramId,
  getCompletedDays,
  resetAllData,
  type UserProfile,
} from "@/lib/storage";
import { PROGRAMS } from "@/lib/mock-data";
import { useColors } from "@/hooks/use-colors";

const GOAL_LABELS: Record<string, string> = {
  weight_loss: "Perda de Peso",
  toning: "Tonificação",
  posture: "Postura",
  energy: "Mais Energia",
};

const LEVEL_LABELS: Record<string, string> = {
  beginner: "Iniciante",
  intermediate: "Intermediário",
  advanced: "Avançado",
};

export default function ConfiguracoesScreen() {
  const colors = useColors();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeProgram, setActiveProgram] = useState<typeof PROGRAMS[0] | null>(null);
  const [completedDays, setCompletedDays] = useState<string[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    const prof = await getUserProfile();
    const programId = await getActiveProgramId();
    const days = await getCompletedDays();
    setProfile(prof);
    setCompletedDays(days);
    const prog = PROGRAMS.find((p) => p.id === programId);
    setActiveProgram(prog || null);
  };

  const handleReset = () => {
    Alert.alert(
      "Resetar Dados",
      "Tem certeza que deseja apagar todo o seu progresso? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Resetar",
          style: "destructive",
          onPress: async () => {
            await resetAllData();
            if (Platform.OS !== "web") {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
            router.replace("/");
          },
        },
      ]
    );
  };

  const handleRestartOnboarding = async () => {
    await resetAllData();
    router.replace("/onboarding");
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
          <Text style={[styles.title, { color: colors.foreground }]}>Perfil</Text>
        </View>

        {/* Profile Card */}
        <LinearGradient
          colors={["#E91E8C", "#C026D3"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.profileCard}
        >
          <View style={styles.profileAvatar}>
            <IconSymbol name="person.fill" size={32} color="#E91E8C" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {profile?.name || "Usuário BARRIGAFIT"}
            </Text>
            <Text style={styles.profileGoal}>
              {profile?.goal ? GOAL_LABELS[profile.goal] || profile.goal : "Meta não definida"}
            </Text>
          </View>
          <View style={styles.profileStats}>
            <View style={styles.profileStat}>
              <Text style={styles.profileStatValue}>{completedDays.length}</Text>
              <Text style={styles.profileStatLabel}>Treinos</Text>
            </View>
            <View style={styles.profileStatDivider} />
            <View style={styles.profileStat}>
              <Text style={styles.profileStatValue}>{progress}%</Text>
              <Text style={styles.profileStatLabel}>Progresso</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Current Program */}
        {activeProgram && (
          <View style={[styles.section, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
            <Text style={[styles.sectionLabel, { color: colors.muted }]}>PROGRAMA ATIVO</Text>
            <Pressable
              onPress={() => router.push({ pathname: "/programa/[id]", params: { id: activeProgram.id } })}
              style={({ pressed }) => [styles.programRow, { opacity: pressed ? 0.7 : 1 }]}
            >
              <View style={[styles.programDot, { backgroundColor: activeProgram.color }]} />
              <View style={styles.programInfo}>
                <Text style={[styles.programTitle, { color: colors.foreground }]}>
                  {activeProgram.title}
                </Text>
                <Text style={[styles.programMeta, { color: colors.muted }]}>
                  {completedDays.length} / {activeProgram.duration} dias
                </Text>
              </View>
              <IconSymbol name="chevron.right" size={16} color={colors.muted} />
            </Pressable>
          </View>
        )}

        {/* Profile Details */}
        {profile && (
          <View style={[styles.section, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
            <Text style={[styles.sectionLabel, { color: colors.muted }]}>SEUS DADOS</Text>
            <SettingRow
              icon="target"
              label="Objetivo"
              value={GOAL_LABELS[profile.goal] || profile.goal}
              colors={colors}
            />
            <SettingRow
              icon="bolt.fill"
              label="Nível"
              value={LEVEL_LABELS[profile.level] || profile.level}
              colors={colors}
            />
            <SettingRow
              icon="clock.fill"
              label="Tempo disponível"
              value={profile.availableTime}
              colors={colors}
              isLast
            />
          </View>
        )}

        {/* Preferences */}
        <View style={[styles.section, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
          <Text style={[styles.sectionLabel, { color: colors.muted }]}>PREFERÊNCIAS</Text>
          <View style={styles.switchRow}>
            <View style={styles.switchLeft}>
              <View style={[styles.switchIcon, { backgroundColor: colors.border }]}>
                <IconSymbol name="bell.fill" size={16} color={colors.primary} />
              </View>
              <Text style={[styles.switchLabel, { color: colors.foreground }]}>
                Lembretes de treino
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={(v) => {
                if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setNotificationsEnabled(v);
              }}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Programs */}
        <View style={[styles.section, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
          <Text style={[styles.sectionLabel, { color: colors.muted }]}>PROGRAMAS</Text>
          <Pressable
            onPress={() => router.push("/(tabs)/programas")}
            style={({ pressed }) => [styles.actionRow, { opacity: pressed ? 0.7 : 1 }]}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.border }]}>
              <IconSymbol name="rectangle.stack.fill" size={16} color={colors.primary} />
            </View>
            <Text style={[styles.actionLabel, { color: colors.foreground }]}>
              Ver todos os programas
            </Text>
            <IconSymbol name="chevron.right" size={16} color={colors.muted} />
          </Pressable>
          <Pressable
            onPress={() => router.push("/descobrir")}
            style={({ pressed }) => [styles.actionRow, { borderTopWidth: 0.5, borderTopColor: colors.border, opacity: pressed ? 0.7 : 1 }]}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.border }]}>
              <IconSymbol name="sparkles" size={16} color="#7C3AED" />
            </View>
            <Text style={[styles.actionLabel, { color: colors.foreground }]}>
              Descobrir novos programas
            </Text>
            <IconSymbol name="chevron.right" size={16} color={colors.muted} />
          </Pressable>
        </View>

        {/* Support */}
        <View style={[styles.section, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
          <Text style={[styles.sectionLabel, { color: colors.muted }]}>SUPORTE</Text>
          <Pressable
            onPress={handleRestartOnboarding}
            style={({ pressed }) => [styles.actionRow, { opacity: pressed ? 0.7 : 1 }]}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.border }]}>
              <IconSymbol name="arrow.clockwise" size={16} color={colors.primary} />
            </View>
            <Text style={[styles.actionLabel, { color: colors.foreground }]}>
              Refazer questionário inicial
            </Text>
            <IconSymbol name="chevron.right" size={16} color={colors.muted} />
          </Pressable>
        </View>

        {/* Danger Zone */}
        <View style={[styles.section, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
          <Text style={[styles.sectionLabel, { color: colors.muted }]}>ZONA DE PERIGO</Text>
          <Pressable
            onPress={handleReset}
            style={({ pressed }) => [styles.actionRow, { opacity: pressed ? 0.7 : 1 }]}
          >
            <View style={[styles.actionIcon, { backgroundColor: "#EF444422" }]}>
              <IconSymbol name="trash.fill" size={16} color={colors.error} />
            </View>
            <Text style={[styles.actionLabel, { color: colors.error }]}>
              Resetar todo o progresso
            </Text>
            <IconSymbol name="chevron.right" size={16} color={colors.error} />
          </Pressable>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.muted }]}>
            BARRIGAFIT · Desafio de 21 Dias
          </Text>
          <Text style={[styles.footerVersion, { color: colors.muted }]}>Versão 1.0.0</Text>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

function SettingRow({
  icon,
  label,
  value,
  colors,
  isLast,
}: {
  icon: any;
  label: string;
  value: string;
  colors: any;
  isLast?: boolean;
}) {
  return (
    <View
      style={[
        styles.settingRow,
        !isLast && { borderBottomWidth: 0.5, borderBottomColor: colors.border },
      ]}
    >
      <View style={[styles.actionIcon, { backgroundColor: colors.border }]}>
        <IconSymbol name={icon} size={16} color={colors.primary} />
      </View>
      <Text style={[styles.settingLabel, { color: colors.muted }]}>{label}</Text>
      <Text style={[styles.settingValue, { color: colors.foreground }]}>{value}</Text>
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
  profileCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    gap: 16,
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  profileInfo: {
    gap: 4,
  },
  profileName: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  profileGoal: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
    fontWeight: "500",
  },
  profileStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.2)",
  },
  profileStat: {
    alignItems: "center",
    gap: 2,
  },
  profileStatValue: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
  },
  profileStatLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 11,
    fontWeight: "500",
  },
  profileStatDivider: {
    width: 1,
    height: 32,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  section: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
    gap: 12,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
  },
  programRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  programDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  programInfo: {
    flex: 1,
    gap: 2,
  },
  programTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  programMeta: {
    fontSize: 12,
    fontWeight: "400",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    gap: 12,
  },
  settingLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
  },
  settingValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  switchLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  switchIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    gap: 12,
  },
  actionIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  actionLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
  },
  footer: {
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 4,
    marginTop: 8,
  },
  footerText: {
    fontSize: 12,
    fontWeight: "600",
  },
  footerVersion: {
    fontSize: 11,
    fontWeight: "400",
  },
});
