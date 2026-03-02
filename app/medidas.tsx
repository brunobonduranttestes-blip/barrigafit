import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "@/lib/auth-context";
import { useColors } from "@/hooks/use-colors";
import { ArrowLeft, Plus } from "lucide-react-native";
import { getMeasurements, addMeasurement, Measurement } from "@/lib/storage";

export default function MedidasScreen() {
  const colors = useColors();
  const { user } = useAuth();
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [peso, setPeso] = useState("");
  const [cintura, setCintura] = useState("");
  const [quadril, setQuadril] = useState("");
  const [abdomen, setAbdomen] = useState("");

  useEffect(() => {
    loadMeasurements();
  }, []);

  const loadMeasurements = async () => {
    try {
      const data = await getMeasurements();
      setMeasurements(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (error) {
      console.error("Failed to load measurements:", error);
    }
  };

  const today = new Date().toISOString().split("T")[0];
  const recordedToday = measurements.some((m) => m.date === today);

  const saveMeasurement = async () => {
    if (!peso.trim() || !cintura.trim() || !quadril.trim() || !abdomen.trim()) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    try {
      setLoading(true);
      const measurement: Measurement = {
        date: today,
        weight: parseFloat(peso),
        waist: parseInt(cintura),
        hips: parseInt(quadril),
        abdomen: parseInt(abdomen),
      };

      await addMeasurement(measurement);

      // Also save to Supabase if user is authenticated
      if (user?.id) {
        try {
          const response = await fetch(
            `${process.env.EXPO_PUBLIC_SUPABASE_URL}/rest/v1/medidas`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                apikey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "",
              },
              body: JSON.stringify({
                usuario_id: user.id,
                data_registro: today,
                peso: parseFloat(peso),
                cintura: parseInt(cintura),
                quadril: parseInt(quadril),
                abdomen: parseInt(abdomen),
              }),
            }
          );
        } catch (error) {
          console.error("Failed to sync measurements:", error);
        }
      }

      Alert.alert("Sucesso", "Medidas registradas!");
      setPeso("");
      setCintura("");
      setQuadril("");
      setAbdomen("");
      setShowForm(false);
      loadMeasurements();
    } catch (error) {
      Alert.alert("Erro", "Falha ao salvar medidas");
    } finally {
      setLoading(false);
    }
  };

  const getProgress = (measurements: Measurement[], key: "weight" | "waist" | "hips" | "abdomen") => {
    if (measurements.length < 2) return null;
    const current = measurements[0]?.[key] || 0;
    const initial = measurements[measurements.length - 1]?.[key] || 0;
    const diff = current - initial;
    return { current, initial, diff };
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: "bold", color: colors.text, marginLeft: 12 }}>Minhas Medidas</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingVertical: 16, paddingHorizontal: 16 }}>
        {!showForm ? (
          <>
            {!recordedToday && (
              <TouchableOpacity onPress={() => setShowForm(true)} style={{ marginBottom: 20 }}>
                <LinearGradient
                  colors={["#C2185B", "#E91E8C"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ borderRadius: 12, paddingVertical: 12, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8 }}
                >
                  <Plus size={20} color="white" />
                  <Text style={{ color: "white", fontWeight: "bold", fontSize: 14 }}>Registrar Hoje</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}

            {measurements.length > 0 && (
              <>
                <Text style={{ fontSize: 16, fontWeight: "bold", color: colors.text, marginBottom: 12 }}>Evolução</Text>

                {getProgress(measurements, "weight") && (
                  <View style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 12, marginBottom: 12 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                      <View>
                        <Text style={{ color: colors.muted, fontSize: 12 }}>Peso</Text>
                        <Text style={{ color: colors.text, fontSize: 20, fontWeight: "bold", marginTop: 4 }}>
                          {getProgress(measurements, "weight")?.current.toFixed(1)} kg
                        </Text>
                      </View>
                      <Text style={{ fontSize: 14, fontWeight: "600", color: getProgress(measurements, "weight")?.diff! < 0 ? "#22C55E" : "#EF4444" }}>
                        {getProgress(measurements, "weight")?.diff! < 0 ? "-" : "+"}{Math.abs(getProgress(measurements, "weight")?.diff!).toFixed(1)} kg
                      </Text>
                    </View>
                  </View>
                )}

                {getProgress(measurements, "waist") && (
                  <View style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 12, marginBottom: 12 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                      <View>
                        <Text style={{ color: colors.muted, fontSize: 12 }}>Cintura</Text>
                        <Text style={{ color: colors.text, fontSize: 20, fontWeight: "bold", marginTop: 4 }}>
                          {getProgress(measurements, "waist")?.current} cm
                        </Text>
                      </View>
                      <Text style={{ fontSize: 14, fontWeight: "600", color: getProgress(measurements, "waist")?.diff! < 0 ? "#22C55E" : "#EF4444" }}>
                        {getProgress(measurements, "waist")?.diff! < 0 ? "-" : "+"}{Math.abs(getProgress(measurements, "waist")?.diff!)} cm
                      </Text>
                    </View>
                  </View>
                )}

                {getProgress(measurements, "hips") && (
                  <View style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 12, marginBottom: 12 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                      <View>
                        <Text style={{ color: colors.muted, fontSize: 12 }}>Quadril</Text>
                        <Text style={{ color: colors.text, fontSize: 20, fontWeight: "bold", marginTop: 4 }}>
                          {getProgress(measurements, "hips")?.current} cm
                        </Text>
                      </View>
                      <Text style={{ fontSize: 14, fontWeight: "600", color: getProgress(measurements, "hips")?.diff! < 0 ? "#22C55E" : "#EF4444" }}>
                        {getProgress(measurements, "hips")?.diff! < 0 ? "-" : "+"}{Math.abs(getProgress(measurements, "hips")?.diff!)} cm
                      </Text>
                    </View>
                  </View>
                )}

                {getProgress(measurements, "abdomen") && (
                  <View style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 12, marginBottom: 12 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                      <View>
                        <Text style={{ color: colors.muted, fontSize: 12 }}>Abdômen</Text>
                        <Text style={{ color: colors.text, fontSize: 20, fontWeight: "bold", marginTop: 4 }}>
                          {getProgress(measurements, "abdomen")?.current} cm
                        </Text>
                      </View>
                      <Text style={{ fontSize: 14, fontWeight: "600", color: getProgress(measurements, "abdomen")?.diff! < 0 ? "#22C55E" : "#EF4444" }}>
                        {getProgress(measurements, "abdomen")?.diff! < 0 ? "-" : "+"}{Math.abs(getProgress(measurements, "abdomen")?.diff!)} cm
                      </Text>
                    </View>
                  </View>
                )}

                <Text style={{ fontSize: 16, fontWeight: "bold", color: colors.text, marginTop: 20, marginBottom: 12 }}>Histórico</Text>

                {measurements.map((m, idx) => (
                  <View key={idx} style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 12, marginBottom: 8 }}>
                    <Text style={{ color: colors.text, fontWeight: "600", fontSize: 14 }}>
                      {new Date(m.date).toLocaleDateString("pt-BR")}
                    </Text>
                    <View style={{ marginTop: 8, gap: 4 }}>
                      {m.weight && <Text style={{ color: colors.muted, fontSize: 12 }}>Peso: {m.weight} kg</Text>}
                      {m.waist && <Text style={{ color: colors.muted, fontSize: 12 }}>Cintura: {m.waist} cm</Text>}
                      {m.hips && <Text style={{ color: colors.muted, fontSize: 12 }}>Quadril: {m.hips} cm</Text>}
                      {m.abdomen && <Text style={{ color: colors.muted, fontSize: 12 }}>Abdômen: {m.abdomen} cm</Text>}
                    </View>
                  </View>
                ))}
              </>
            )}

            {measurements.length === 0 && !showForm && (
              <Text style={{ color: colors.muted, textAlign: "center", marginTop: 20, fontSize: 14 }}>
                Nenhuma medida registrada. Comece agora!
              </Text>
            )}
          </>
        ) : (
          <View style={{ gap: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: colors.text, marginBottom: 12 }}>Registrar Medidas de Hoje</Text>

            <View>
              <Text style={{ color: colors.text, fontSize: 14, fontWeight: "600", marginBottom: 6 }}>Peso (kg)</Text>
              <TextInput
                style={{
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 12,
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  color: colors.text,
                  fontSize: 16,
                }}
                placeholder="Ex: 65.5"
                placeholderTextColor={colors.muted}
                value={peso}
                onChangeText={setPeso}
                keyboardType="decimal-pad"
              />
            </View>

            <View>
              <Text style={{ color: colors.text, fontSize: 14, fontWeight: "600", marginBottom: 6 }}>Cintura (cm)</Text>
              <TextInput
                style={{
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 12,
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  color: colors.text,
                  fontSize: 16,
                }}
                placeholder="Ex: 80"
                placeholderTextColor={colors.muted}
                value={cintura}
                onChangeText={setCintura}
                keyboardType="number-pad"
              />
            </View>

            <View>
              <Text style={{ color: colors.text, fontSize: 14, fontWeight: "600", marginBottom: 6 }}>Quadril (cm)</Text>
              <TextInput
                style={{
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 12,
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  color: colors.text,
                  fontSize: 16,
                }}
                placeholder="Ex: 95"
                placeholderTextColor={colors.muted}
                value={quadril}
                onChangeText={setQuadril}
                keyboardType="number-pad"
              />
            </View>

            <View>
              <Text style={{ color: colors.text, fontSize: 14, fontWeight: "600", marginBottom: 6 }}>Abdômen (cm)</Text>
              <TextInput
                style={{
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 12,
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  color: colors.text,
                  fontSize: 16,
                }}
                placeholder="Ex: 85"
                placeholderTextColor={colors.muted}
                value={abdomen}
                onChangeText={setAbdomen}
                keyboardType="number-pad"
              />
            </View>

            <TouchableOpacity onPress={saveMeasurement} disabled={loading} style={{ marginTop: 12 }}>
              <LinearGradient
                colors={["#C2185B", "#E91E8C"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ borderRadius: 12, paddingVertical: 14, alignItems: "center" }}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>Salvar Medidas</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowForm(false)}>
              <Text style={{ color: colors.muted, textAlign: "center", fontSize: 14 }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
