import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, FlatList, TextInput, Alert, Modal, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "@/lib/auth-context";
import { useColors } from "@/hooks/use-colors";
import { ArrowLeft, Plus, Copy, Trash2 } from "lucide-react-native";

interface Usuario {
  id: string;
  nome: string;
  email: string;
  codigo_acesso: string;
  ativo: boolean;
  created_at: string;
}

interface Exercise {
  id: string;
  exercicio_nome: string;
  url_video: string | null;
  url_thumbnail: string | null;
  ativo: boolean;
}

export default function AdminScreen() {
  const colors = useColors();
  const { user, logout } = useAuth();
  const [tab, setTab] = useState<"users" | "videos" | "stats">("users");
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [videos, setVideos] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [stats, setStats] = useState({ active: 0, trainedToday: 0, topExercise: "" });

  useEffect(() => {
    if (!user?.is_admin) {
      Alert.alert("Acesso negado", "Apenas administradores podem acessar esta área.");
      router.back();
      return;
    }
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const token = await getAuthToken();

      // Load users
      const usersRes = await fetch(
        `${process.env.EXPO_PUBLIC_SUPABASE_URL}/rest/v1/usuarios?select=*`,
        {
          headers: {
            apikey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (usersRes.ok) {
        setUsuarios(await usersRes.json());
      }

      // Load videos
      const videosRes = await fetch(
        `${process.env.EXPO_PUBLIC_SUPABASE_URL}/rest/v1/videos_exercicios?select=*`,
        {
          headers: {
            apikey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "",
          },
        }
      );
      if (videosRes.ok) {
        setVideos(await videosRes.json());
      }

      // Calculate stats
      const activeCount = (await usersRes.json()).filter((u: Usuario) => u.ativo).length;
      setStats({ active: activeCount, trainedToday: 0, topExercise: "" });
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAuthToken = async () => {
    // In a real app, this would retrieve the stored token
    return "";
  };

  const generateAccessCode = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  const addNewUser = async () => {
    if (!newUserName.trim() || !newUserEmail.trim()) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    try {
      const codigo = generateAccessCode();
      const token = await getAuthToken();

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SUPABASE_URL}/rest/v1/usuarios`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nome: newUserName,
            email: newUserEmail.toLowerCase(),
            codigo_acesso: codigo,
            ativo: true,
          }),
        }
      );

      if (response.ok) {
        Alert.alert("Sucesso", `Usuária adicionada!\nCódigo: ${codigo}`);
        setNewUserName("");
        setNewUserEmail("");
        setModalVisible(false);
        loadData();
      }
    } catch (error) {
      Alert.alert("Erro", "Falha ao adicionar usuária");
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const token = await getAuthToken();
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SUPABASE_URL}/rest/v1/usuarios?id=eq.${id}`,
        {
          method: "DELETE",
          headers: {
            apikey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        loadData();
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const handleLogout = async () => {
    Alert.alert("Sair", "Deseja sair da sua conta?", [
      { text: "Cancelar", onPress: () => {} },
      {
        text: "Sair",
        onPress: async () => {
          await logout();
          router.replace("/login");
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", color: colors.text }}>Admin Panel</Text>
          <Text style={{ fontSize: 12, color: colors.muted }}>ADMIN</Text>
        </View>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={{ color: "#EF4444", fontSize: 12, fontWeight: "600" }}>Sair</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: "row", borderBottomWidth: 1, borderBottomColor: colors.border }}>
        {(["users", "videos", "stats"] as const).map((t) => (
          <TouchableOpacity key={t} onPress={() => setTab(t)} style={{ flex: 1, paddingVertical: 12 }}>
            <Text style={{
              textAlign: "center",
              fontSize: 14,
              fontWeight: "600",
              color: tab === t ? "#E91E8C" : colors.muted,
              borderBottomWidth: tab === t ? 2 : 0,
              borderBottomColor: "#E91E8C",
            }}>
              {t === "users" ? "Usuárias" : t === "videos" ? "Vídeos" : "Estatísticas"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingVertical: 12 }}>
        {loading && <ActivityIndicator color={colors.primary} style={{ marginTop: 20 }} />}

        {tab === "users" && (
          <View style={{ paddingHorizontal: 16 }}>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={{ marginBottom: 16 }}>
              <LinearGradient colors={["#C2185B", "#E91E8C"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: 12, paddingVertical: 12, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8 }}>
                <Plus size={20} color="white" />
                <Text style={{ color: "white", fontWeight: "bold", fontSize: 14 }}>Adicionar Usuária</Text>
              </LinearGradient>
            </TouchableOpacity>

            <FlatList
              data={usuarios}
              keyExtractor={(u) => u.id}
              scrollEnabled={false}
              renderItem={({ item: u }) => (
                <View style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 12, marginBottom: 8, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.text, fontWeight: "bold", fontSize: 14 }}>{u.nome}</Text>
                    <Text style={{ color: colors.muted, fontSize: 12 }}>{u.email}</Text>
                    <View style={{ flexDirection: "row", gap: 8, marginTop: 4 }}>
                      <Text style={{ color: "#22C55E", fontSize: 11, fontWeight: "600" }}>
                        {u.ativo ? "Ativo" : "Inativo"}
                      </Text>
                      <TouchableOpacity onPress={() => {
                        Alert.prompt("Código", `Código: ${u.codigo_acesso}`, [
                          {
                            text: "Copiar",
                            onPress: () => {
                              // Copy to clipboard logic here
                            },
                          },
                          { text: "Fechar" },
                        ]);
                      }}>
                        <Copy size={14} color={colors.primary} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => {
                    Alert.alert("Remover", `Remover ${u.nome}?`, [
                      { text: "Cancelar" },
                      {
                        text: "Remover",
                        onPress: () => deleteUser(u.id),
                      },
                    ]);
                  }}>
                    <Trash2 size={18} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              )}
              ListEmptyComponent={<Text style={{ color: colors.muted, textAlign: "center", marginTop: 20 }}>Nenhuma usuária cadastrada</Text>}
            />
          </View>
        )}

        {tab === "videos" && (
          <View style={{ paddingHorizontal: 16 }}>
            <Text style={{ color: colors.text, fontSize: 14, fontWeight: "600", marginBottom: 12 }}>Exercícios sem vídeo ({videos.filter(v => !v.url_video).length})</Text>
            <FlatList
              data={videos}
              keyExtractor={(v) => v.id}
              scrollEnabled={false}
              renderItem={({ item: v }) => (
                <View style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 12, marginBottom: 8 }}>
                  <Text style={{ color: colors.text, fontWeight: "bold", fontSize: 14 }}>{v.exercicio_nome}</Text>
                  <Text style={{ color: colors.muted, fontSize: 12, marginTop: 4 }}>
                    {v.url_video ? "✓ Com vídeo" : "✗ Sem vídeo"}
                  </Text>
                </View>
              )}
            />
          </View>
        )}

        {tab === "stats" && (
          <View style={{ paddingHorizontal: 16, gap: 12 }}>
            <View style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 16 }}>
              <Text style={{ color: colors.muted, fontSize: 12 }}>Usuárias Ativas</Text>
              <Text style={{ fontSize: 32, fontWeight: "bold", color: "#22C55E", marginTop: 4 }}>{stats.active}</Text>
            </View>
            <View style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 16 }}>
              <Text style={{ color: colors.muted, fontSize: 12 }}>Treinaram Hoje</Text>
              <Text style={{ fontSize: 32, fontWeight: "bold", color: "#3B82F6", marginTop: 4 }}>{stats.trainedToday}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.8)", justifyContent: "flex-end" }}>
          <View style={{ backgroundColor: colors.background, borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingHorizontal: 16, paddingVertical: 20, paddingBottom: 30 }}>
            <Text style={{ fontSize: 20, fontWeight: "bold", color: colors.text, marginBottom: 16 }}>Adicionar Usuária</Text>
            <TextInput
              style={{ backgroundColor: colors.surface, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 12, color: colors.text, marginBottom: 12, borderWidth: 1, borderColor: colors.border }}
              placeholder="Nome completo"
              placeholderTextColor={colors.muted}
              value={newUserName}
              onChangeText={setNewUserName}
            />
            <TextInput
              style={{ backgroundColor: colors.surface, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 12, color: colors.text, marginBottom: 16, borderWidth: 1, borderColor: colors.border }}
              placeholder="E-mail"
              placeholderTextColor={colors.muted}
              value={newUserEmail}
              onChangeText={setNewUserEmail}
              keyboardType="email-address"
            />
            <TouchableOpacity onPress={addNewUser} style={{ marginBottom: 8 }}>
              <LinearGradient colors={["#C2185B", "#E91E8C"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: 12, paddingVertical: 14, alignItems: "center" }}>
                <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>Adicionar</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={{ color: colors.muted, textAlign: "center", fontSize: 14 }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
