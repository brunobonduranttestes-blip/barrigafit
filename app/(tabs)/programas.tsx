import { useCallback, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { ProgramCard } from "@/components/ui/workout-card";
import { getActiveProgramId, getCompletedDays } from "@/lib/storage";
import { PROGRAMS } from "@/lib/mock-data";
import { useColors } from "@/hooks/use-colors";

export default function ProgramasScreen() {
  const colors = useColors();
  const [activeProgramId, setActiveProgramId] = useState<string | null>(null);
  const [completedDays, setCompletedDays] = useState<string[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    const id = await getActiveProgramId();
    const days = await getCompletedDays();
    setActiveProgramId(id);
    setCompletedDays(days);
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
          <Text style={[styles.title, { color: colors.foreground }]}>Programas</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            Escolha seu programa e comece a transformação
          </Text>
        </View>

        {/* Programs List */}
        {PROGRAMS.map((program) => {
          const isActive = program.id === activeProgramId;
          const currentDay = isActive ? completedDays.length + 1 : undefined;
          return (
            <ProgramCard
              key={program.id}
              program={program}
              isActive={isActive}
              currentDay={currentDay}
              onPress={() =>
                router.push({ pathname: "/programa/[id]", params: { id: program.id } })
              }
            />
          );
        })}

        <View style={{ height: 24 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400",
  },
});
