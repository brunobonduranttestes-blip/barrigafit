import { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { ClassCard } from "@/components/ui/workout-card";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { getFavoriteClasses, toggleFavoriteClass } from "@/lib/storage";
import { LIBRARY_CLASSES, type DifficultyLevel, type FocusArea } from "@/lib/mock-data";
import { useColors } from "@/hooks/use-colors";

const LEVEL_FILTERS: (DifficultyLevel | "Todos")[] = ["Todos", "Iniciante", "Intermediário", "Avançado"];
const FOCUS_FILTERS: (FocusArea | "Todos")[] = ["Todos", "Abdômen", "Glúteos", "Pernas", "Postura", "Corpo Todo"];
const DURATION_FILTERS = [
  { label: "Todos", min: 0, max: 999 },
  { label: "Até 15 min", min: 0, max: 15 },
  { label: "15-30 min", min: 15, max: 30 },
  { label: "30+ min", min: 30, max: 999 },
];

export default function BibliotecaScreen() {
  const colors = useColors();
  const [search, setSearch] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<DifficultyLevel | "Todos">("Todos");
  const [selectedFocus, setSelectedFocus] = useState<FocusArea | "Todos">("Todos");
  const [selectedDuration, setSelectedDuration] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const loadFavorites = async () => {
    const favs = await getFavoriteClasses();
    setFavorites(favs);
  };

  const handleToggleFavorite = async (classId: string) => {
    const isFav = await toggleFavoriteClass(classId);
    setFavorites((prev) =>
      isFav ? [...prev, classId] : prev.filter((id) => id !== classId)
    );
  };

  const durationFilter = DURATION_FILTERS[selectedDuration];
  const filtered = LIBRARY_CLASSES.filter((item) => {
    const matchesSearch =
      search === "" ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.focus.some((f) => f.toLowerCase().includes(search.toLowerCase()));
    const matchesLevel = selectedLevel === "Todos" || item.level === selectedLevel;
    const matchesFocus = selectedFocus === "Todos" || item.focus.includes(selectedFocus as FocusArea);
    const matchesDuration =
      item.duration >= durationFilter.min && item.duration <= durationFilter.max;
    return matchesSearch && matchesLevel && matchesFocus && matchesDuration;
  });

  const activeFiltersCount =
    (selectedLevel !== "Todos" ? 1 : 0) +
    (selectedFocus !== "Todos" ? 1 : 0) +
    (selectedDuration !== 0 ? 1 : 0);

  return (
    <ScreenContainer containerClassName="bg-background">
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.foreground }]}>Biblioteca</Text>

        {/* Search */}
        <View style={[styles.searchBar, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
          <IconSymbol name="magnifyingglass" size={18} color={colors.muted} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Buscar aulas..."
            placeholderTextColor={colors.muted}
            style={[styles.searchInput, { color: colors.foreground }]}
            returnKeyType="search"
          />
          {search !== "" && (
            <Pressable onPress={() => setSearch("")} hitSlop={8}>
              <IconSymbol name="xmark.circle.fill" size={18} color={colors.muted} />
            </Pressable>
          )}
        </View>

        {/* Filter Toggle */}
        <Pressable
          onPress={() => setShowFilters(!showFilters)}
          style={({ pressed }) => [
            styles.filterToggle,
            {
              backgroundColor: showFilters ? colors.primary : colors.surfaceAlt,
              borderColor: showFilters ? colors.primary : colors.border,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <IconSymbol
            name="slider.horizontal.3"
            size={16}
            color={showFilters ? "#fff" : colors.foreground}
          />
          <Text style={[styles.filterToggleText, { color: showFilters ? "#fff" : colors.foreground }]}>
            Filtros
          </Text>
          {activeFiltersCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
            </View>
          )}
        </Pressable>
      </View>

      {/* Filters Panel */}
      {showFilters && (
        <View style={[styles.filtersPanel, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
          <FilterRow
            label="Nível"
            options={LEVEL_FILTERS}
            selected={selectedLevel}
            onSelect={(v) => setSelectedLevel(v as any)}
            colors={colors}
          />
          <FilterRow
            label="Foco"
            options={FOCUS_FILTERS}
            selected={selectedFocus}
            onSelect={(v) => setSelectedFocus(v as any)}
            colors={colors}
          />
          <FilterRow
            label="Duração"
            options={DURATION_FILTERS.map((d) => d.label)}
            selected={DURATION_FILTERS[selectedDuration].label}
            onSelect={(v) => {
              const idx = DURATION_FILTERS.findIndex((d) => d.label === v);
              setSelectedDuration(idx);
            }}
            colors={colors}
          />
        </View>
      )}

      {/* Results Count */}
      <View style={styles.resultsRow}>
        <Text style={[styles.resultsCount, { color: colors.muted }]}>
          {filtered.length} {filtered.length === 1 ? "aula" : "aulas"} encontradas
        </Text>
        {activeFiltersCount > 0 && (
          <Pressable
            onPress={() => {
              setSelectedLevel("Todos");
              setSelectedFocus("Todos");
              setSelectedDuration(0);
            }}
          >
            <Text style={[styles.clearFilters, { color: colors.primary }]}>Limpar filtros</Text>
          </Pressable>
        )}
      </View>

      {/* Grid */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.gridRow}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.gridItem}>
            <ClassCard
              item={item}
              onPress={() => router.push({ pathname: "/aula/[id]", params: { id: item.id } })}
              isFavorite={favorites.includes(item.id)}
              onToggleFavorite={() => handleToggleFavorite(item.id)}
            />
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <IconSymbol name="magnifyingglass" size={40} color={colors.muted} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              Nenhuma aula encontrada
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.muted }]}>
              Tente ajustar os filtros ou a busca
            </Text>
          </View>
        }
      />
    </ScreenContainer>
  );
}

function FilterRow({
  label,
  options,
  selected,
  onSelect,
  colors,
}: {
  label: string;
  options: string[];
  selected: string;
  onSelect: (v: string) => void;
  colors: any;
}) {
  return (
    <View style={styles.filterRow}>
      <Text style={[styles.filterLabel, { color: colors.muted }]}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterOptions}>
        {options.map((opt) => (
          <Pressable
            key={opt}
            onPress={() => onSelect(opt)}
            style={({ pressed }) => [
              styles.filterOption,
              {
                backgroundColor: selected === opt ? colors.primary : "transparent",
                borderColor: selected === opt ? colors.primary : colors.border,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Text
              style={[
                styles.filterOptionText,
                { color: selected === opt ? "#fff" : colors.foreground },
              ]}
            >
              {opt}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 14,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: "400",
  },
  filterToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterToggleText: {
    fontSize: 13,
    fontWeight: "600",
  },
  filterBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#E91E8C",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 2,
  },
  filterBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  filtersPanel: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 14,
    marginBottom: 12,
  },
  filterRow: {
    gap: 8,
  },
  filterLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  filterOptions: {
    gap: 8,
    paddingRight: 4,
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterOptionText: {
    fontSize: 12,
    fontWeight: "600",
  },
  resultsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  resultsCount: {
    fontSize: 12,
    fontWeight: "500",
  },
  clearFilters: {
    fontSize: 12,
    fontWeight: "600",
  },
  grid: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  gridRow: {
    gap: 12,
    marginBottom: 12,
  },
  gridItem: {
    flex: 1,
  },
  emptyState: {
    alignItems: "center",
    paddingTop: 60,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: "center",
  },
});
