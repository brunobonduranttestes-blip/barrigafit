import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { GradientButton } from "@/components/ui/gradient-button";
import { useColors } from "@/hooks/use-colors";

const CROSS_SELL_PROGRAMS = [
  {
    id: "hormone-sync",
    title: "HORMONE-SYNC",
    subtitle: "Treine em harmonia com seu ciclo",
    description:
      "Programa revolucionário que adapta seus treinos ao ciclo menstrual, maximizando resultados e respeitando seu corpo em cada fase.",
    duration: 28,
    level: "Todos os níveis",
    color: "#7C3AED",
    colorSecondary: "#4F46E5",
    features: [
      "Treinos adaptados às 4 fases do ciclo",
      "Nutrição sincronizada com hormônios",
      "Meditações guiadas por fase",
      "Rastreamento do ciclo integrado",
    ],
    badge: "NOVO",
    isAvailable: false,
  },
  {
    id: "core-pro",
    title: "CORE PRO",
    subtitle: "Abdômen definido em 30 dias",
    description:
      "Programa intensivo focado no fortalecimento do core profundo, combinando pilates, funcional e técnicas de respiração avançadas.",
    duration: 30,
    level: "Intermediário",
    color: "#0EA5E9",
    colorSecondary: "#0284C7",
    features: [
      "Técnicas de pilates clínico",
      "Exercícios de core profundo",
      "Respiração diafragmática",
      "Progressão semanal inteligente",
    ],
    badge: "EM BREVE",
    isAvailable: false,
  },
  {
    id: "glute-lab",
    title: "GLUTE LAB",
    subtitle: "Glúteos e pernas transformados",
    description:
      "Programa especializado para glúteos e membros inferiores, com foco em hipertrofia funcional e definição muscular.",
    duration: 21,
    level: "Iniciante a Avançado",
    color: "#F59E0B",
    colorSecondary: "#D97706",
    features: [
      "Protocolo de ativação glútea",
      "Exercícios progressivos",
      "Treinos de 20-40 minutos",
      "Sem equipamentos necessários",
    ],
    badge: "EM BREVE",
    isAvailable: false,
  },
];

export default function DescobrirScreen() {
  const colors = useColors();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleInterest = (programId: string) => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedId(programId === selectedId ? null : programId);
  };

  return (
    <ScreenContainer containerClassName="bg-background" edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.closeBtn,
            { backgroundColor: colors.surfaceAlt, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <IconSymbol name="xmark" size={18} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Descobrir</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.hero}>
          <LinearGradient
            colors={["#E91E8C", "#C026D3"]}
            style={styles.heroIcon}
          >
            <IconSymbol name="sparkles" size={28} color="#fff" />
          </LinearGradient>
          <Text style={[styles.heroTitle, { color: colors.foreground }]}>
            Expanda sua Jornada
          </Text>
          <Text style={[styles.heroSubtitle, { color: colors.muted }]}>
            Descubra programas especializados que complementam sua transformação
          </Text>
        </View>

        {/* Programs */}
        {CROSS_SELL_PROGRAMS.map((program) => (
          <View key={program.id} style={styles.programCard}>
            <LinearGradient
              colors={[program.color, program.colorSecondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.programHero}
            >
              <View style={styles.programBadge}>
                <Text style={styles.programBadgeText}>{program.badge}</Text>
              </View>
              <Text style={styles.programTitle}>{program.title}</Text>
              <Text style={styles.programSubtitle}>{program.subtitle}</Text>
              <View style={styles.programMeta}>
                <View style={styles.programMetaItem}>
                  <IconSymbol name="calendar" size={13} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.programMetaText}>{program.duration} dias</Text>
                </View>
                <View style={styles.programMetaItem}>
                  <IconSymbol name="bolt.fill" size={13} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.programMetaText}>{program.level}</Text>
                </View>
              </View>
            </LinearGradient>

            <View style={[styles.programBody, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
              <Text style={[styles.programDescription, { color: colors.muted }]}>
                {program.description}
              </Text>

              <View style={styles.featureList}>
                {program.features.map((f, i) => (
                  <View key={i} style={styles.featureRow}>
                    <View style={[styles.featureDot, { backgroundColor: program.color }]} />
                    <Text style={[styles.featureText, { color: colors.foreground }]}>{f}</Text>
                  </View>
                ))}
              </View>

              <View style={[styles.waitlistCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <IconSymbol name="bell.fill" size={16} color={program.color} />
                <Text style={[styles.waitlistText, { color: colors.muted }]}>
                  Seja notificado quando este programa for lançado
                </Text>
              </View>

              <Pressable
                onPress={() => handleInterest(program.id)}
                style={({ pressed }) => [
                  styles.interestBtn,
                  {
                    backgroundColor:
                      selectedId === program.id ? program.color : "transparent",
                    borderColor: program.color,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <IconSymbol
                  name={selectedId === program.id ? "checkmark" : "bell.badge"}
                  size={16}
                  color={selectedId === program.id ? "#fff" : program.color}
                />
                <Text
                  style={[
                    styles.interestBtnText,
                    { color: selectedId === program.id ? "#fff" : program.color },
                  ]}
                >
                  {selectedId === program.id ? "Interesse registrado!" : "Quero ser notificado"}
                </Text>
              </Pressable>
            </View>
          </View>
        ))}

        {/* Back to current */}
        <View style={styles.backSection}>
          <Text style={[styles.backTitle, { color: colors.foreground }]}>
            Continue seu programa atual
          </Text>
          <Text style={[styles.backSubtitle, { color: colors.muted }]}>
            Foque no BARRIGAFIT e complete o desafio de 21 dias primeiro
          </Text>
          <GradientButton
            label="Voltar ao Programa"
            onPress={() => router.replace("/(tabs)")}
            fullWidth
            size="lg"
          />
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  scroll: { flex: 1 },
  scrollContent: {
    padding: 20,
    gap: 24,
  },
  hero: {
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: -0.5,
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 21,
  },
  programCard: {
    borderRadius: 20,
    overflow: "hidden",
  },
  programHero: {
    padding: 20,
    gap: 4,
  },
  programBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 8,
  },
  programBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
  },
  programTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  programSubtitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 12,
  },
  programMeta: {
    flexDirection: "row",
    gap: 16,
  },
  programMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  programMetaText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    fontWeight: "600",
  },
  programBody: {
    padding: 16,
    borderWidth: 1,
    borderTopWidth: 0,
    gap: 14,
  },
  programDescription: {
    fontSize: 13,
    lineHeight: 20,
  },
  featureList: {
    gap: 8,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    flexShrink: 0,
  },
  featureText: {
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 18,
  },
  waitlistCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  waitlistText: {
    fontSize: 12,
    flex: 1,
    lineHeight: 17,
  },
  interestBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  interestBtnText: {
    fontSize: 14,
    fontWeight: "700",
  },
  backSection: {
    gap: 10,
    paddingTop: 8,
  },
  backTitle: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  backSubtitle: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 19,
    marginBottom: 4,
  },
});
