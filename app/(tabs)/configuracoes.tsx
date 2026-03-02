import { useCallback, useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Alert,
  Switch,
  Platform,
  SafeAreaView,
  TextInput,
  Modal,
  ActivityIndicator,
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
  saveUserProfile,
  type UserProfile,
} from "@/lib/storage";
import { PROGRAMS } from "@/lib/mock-data";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/lib/auth-context";
import { isNotificationsEnabled, setNotificationsEnabled, getNotificationTime, setNotificationTime } from "@/lib/notifications";
import { Settings, Bell, User, LogOut, Zap, Clock, Shield } from "lucide-react-native";

export default function ConfiguracoesScreen() {
  const colors = useColors();
  const { user, logout, updateProfile } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeProgram, setActiveProgram] = useState<typeof PROGRAMS[0] | null>(null);
  const [completedDays, setCompletedDays] = useState<string[]>([]);
  const [notificationsEnabled, setNotificationsEnabledLocal] = useState(false);
  const [notificationTime, setNotificationTimeLocal] = useState("08:00");
  const [editingProfile, setEditingProfile] = useState(false);
  const [editName, setEditName] = useState("");
  const [editGoal, setEditGoal] = useState("");
  const [editLevel, setEditLevel] = useState("");
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      const prof = await getUserProfile();
      const programId = await getActiveProgramId();
      const days = await getCompletedDays();
      const notifEnabled = await isNotificationsEnabled();
      const notifTime = await getNotificationTime();

      setProfile(prof);
      setCompletedDays(days);
      setNotificationsEnabledLocal(notifEnabled);
      setNotificationTimeLocal(notifTime);

      const prog = PROGRAMS.find((p) => p.id === programId);
      setActiveProgram(prog || null);
    } catch (error) {
      console.error("Failed to load config data:", error);
    }
  };

  const handleLogout = () => {
    Alert.alert("Sair", "Deseja sair da sua conta?", [
      { text: "Cancelar" },
      {
        text: "Sair",
        onPress: async () => {
          await logout();
          router.replace("/login");
        },
        style: "destructive",
      },
    ]);
  };

  const handleNotificationToggle = async (value: boolean) => {
    try {
      setNotificationsEnabledLocal(value);
      await setNotificationsEnabled(value);
      if (value) {
        Alert.alert("Sucesso", "Notificações ativadas!");
      }
    } catch (error) {
      Alert.alert("Erro", "Falha ao configurar notificações");
    }
  };

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      Alert.alert("Erro", "Nome não pode estar vazio");
      return;
    }

    try {
      setLoading(true);
      const updated: UserProfile = {
        name: editName,
        goal: editGoal,
        level: editLevel,
        availableTime: profile?.availableTime || "",
        startDate: profile?.startDate || new Date().toISOString(),
      };

      await saveUserProfile(updated);
      await updateProfile({
        nome: editName,
        objetivo: editGoal,
        nivel: editLevel,
      });

      setProfile(updated);
      setEditingProfile(false);
      Alert.alert("Sucesso", "Perfil atualizado!");
    } catch (error) {
      Alert.alert("Erro", "Falha ao salvar perfil");
    } finally {
      setLoading(false);
    }
  };

  const startEditProfile = () => {
    setEditName(profile?.name || user?.nome || "");
    setEditGoal(profile?.goal || user?.objetivo || "emagrecer");
    setEditLevel(profile?.level || user?.nivel || "iniciante");
    setEditingProfile(true);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ paddingVertical: 16 }}>
        {/* Header */}
        <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: colors.surface,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <User size={32} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: "bold", color: colors.text }}>
                {user?.nome || "Usuária BARRIGAFIT"}
              </Text>
              <Text style={{ fontSize: 12, color: colors.muted, marginTop: 4 }}>
                {user?.is_admin ? "ADMIN" : "Membro"}
              </Text>
            </View>
          </View>
        </View>

        {/* Editar Perfil */}
        <SettingSection title="Perfil" colors={colors}>
          <Pressable
            onPress={startEditProfile}
            style={{
              backgroundColor: colors.surface,
              borderRadius: 12,
              padding: 12,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <Text style={{ color: colors.text, fontWeight: "600", fontSize: 14 }}>Editar Perfil</Text>
              <Text style={{ color: colors.muted, fontSize: 12, marginTop: 4 }}>
                Nome, objetivo e nível
              </Text>
            </View>
            <IconSymbol name="chevron.right" size={24} color={colors.primary} />
          </Pressable>
        </SettingSection>

        {/* Admin Panel */}
        {user?.is_admin && (
          <SettingSection title="Administração" colors={colors}>
            <Pressable
              onPress={() => router.navigate("/admin")}
              style={{
                backgroundColor: colors.surface,
                borderRadius: 12,
                padding: 12,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <Shield size={20} color="#E91E8C" />
                <View>
                  <Text style={{ color: colors.text, fontWeight: "600", fontSize: 14 }}>Painel Admin</Text>
                  <Text style={{ color: colors.muted, fontSize: 12, marginTop: 2 }}>Gerenciar usuárias e conteúdo</Text>
                </View>
              </View>
              <IconSymbol name="chevron.right" size={24} color={colors.primary} />
            </Pressable>
          </SettingSection>
        )}

        {/* Notificações */}
        <SettingSection title="Notificações" colors={colors}>
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 12,
              padding: 12,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <Bell size={20} color={colors.primary} />
              <Text style={{ color: colors.text, fontWeight: "600", fontSize: 14 }}>Lembretes Diários</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleNotificationToggle}
              trackColor={{ false: colors.border, true: "#E91E8C" }}
            />
          </View>

          {notificationsEnabled && (
            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: 12,
                padding: 12,
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
              }}
            >
              <Clock size={20} color={colors.primary} />
              <Text style={{ color: colors.text, fontWeight: "600", fontSize: 14 }}>Horário:</Text>
              <Text style={{ color: colors.primary, fontWeight: "bold", fontSize: 14, marginLeft: "auto" }}>
                {notificationTime}
              </Text>
            </View>
          )}
        </SettingSection>

        {/* Meu Progresso */}
        <SettingSection title="Progresso" colors={colors}>
          <Pressable
            onPress={() => router.navigate("/medidas")}
            style={{
              backgroundColor: colors.surface,
              borderRadius: 12,
              padding: 12,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <Zap size={20} color="#22C55E" />
              <View>
                <Text style={{ color: colors.text, fontWeight: "600", fontSize: 14 }}>Minhas Medidas</Text>
                <Text style={{ color: colors.muted, fontSize: 12, marginTop: 2 }}>
                  Peso, cintura, quadril, abdômen
                </Text>
              </View>
            </View>
            <IconSymbol name="chevron.right" size={24} color={colors.primary} />
          </Pressable>
        </SettingSection>

        {/* Informações */}
        <SettingSection title="Informações" colors={colors}>
          <View style={{ gap: 8 }}>
            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: 12,
                padding: 12,
              }}
            >
              <Text style={{ color: colors.muted, fontSize: 12 }}>Versão do App</Text>
              <Text style={{ color: colors.text, fontWeight: "600", fontSize: 14, marginTop: 4 }}>1.0.0</Text>
            </View>
            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: 12,
                padding: 12,
              }}
            >
              <Text style={{ color: colors.muted, fontSize: 12 }}>E-mail Registrado</Text>
              <Text style={{ color: colors.text, fontWeight: "600", fontSize: 14, marginTop: 4 }}>
                {user?.email}
              </Text>
            </View>
          </View>
        </SettingSection>

        {/* Sair */}
        <View style={{ paddingHorizontal: 16, marginTop: 24, marginBottom: 40 }}>
          <Pressable onPress={handleLogout}>
            <LinearGradient
              colors={["#EF4444", "#DC2626"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: 12,
                paddingVertical: 12,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <LogOut size={20} color="white" />
              <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>Sair</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={editingProfile} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.8)", justifyContent: "flex-end" }}>
          <View
            style={{
              backgroundColor: colors.background,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              paddingHorizontal: 16,
              paddingVertical: 20,
              paddingBottom: 40,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold", color: colors.text, marginBottom: 16 }}>
              Editar Perfil
            </Text>

            <View style={{ gap: 12, marginBottom: 16 }}>
              <View>
                <Text style={{ color: colors.text, fontWeight: "600", marginBottom: 6, fontSize: 14 }}>Nome</Text>
                <TextInput
                  style={{
                    backgroundColor: colors.surface,
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    paddingVertical: 12,
                    color: colors.text,
                    borderWidth: 1,
                    borderColor: colors.border,
                  }}
                  placeholder="Seu nome"
                  placeholderTextColor={colors.muted}
                  value={editName}
                  onChangeText={setEditName}
                />
              </View>

              <View>
                <Text style={{ color: colors.text, fontWeight: "600", marginBottom: 6, fontSize: 14 }}>Objetivo</Text>
                <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
                  {["emagrecer", "tonificar", "postura", "condicionamento"].map((g) => (
                    <Pressable
                      key={g}
                      onPress={() => setEditGoal(g)}
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 8,
                        backgroundColor: editGoal === g ? "#E91E8C" : colors.surface,
                        borderWidth: 1,
                        borderColor: editGoal === g ? "#E91E8C" : colors.border,
                      }}
                    >
                      <Text
                        style={{
                          color: editGoal === g ? "white" : colors.text,
                          fontWeight: "600",
                          fontSize: 12,
                        }}
                      >
                        {g === "emagrecer"
                          ? "Emagrecer"
                          : g === "tonificar"
                            ? "Tonificar"
                            : g === "postura"
                              ? "Postura"
                              : "Condicionamento"}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View>
                <Text style={{ color: colors.text, fontWeight: "600", marginBottom: 6, fontSize: 14 }}>Nível</Text>
                <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
                  {["iniciante", "intermediário", "avançado"].map((l) => (
                    <Pressable
                      key={l}
                      onPress={() => setEditLevel(l)}
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 8,
                        backgroundColor: editLevel === l ? "#E91E8C" : colors.surface,
                        borderWidth: 1,
                        borderColor: editLevel === l ? "#E91E8C" : colors.border,
                      }}
                    >
                      <Text
                        style={{
                          color: editLevel === l ? "white" : colors.text,
                          fontWeight: "600",
                          fontSize: 12,
                        }}
                      >
                        {l === "iniciante"
                          ? "Iniciante"
                          : l === "intermediário"
                            ? "Intermediário"
                            : "Avançado"}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>

            <Pressable onPress={handleSaveProfile} disabled={loading} style={{ marginBottom: 8 }}>
              <LinearGradient
                colors={["#C2185B", "#E91E8C"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ borderRadius: 12, paddingVertical: 14, alignItems: "center" }}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>Salvar</Text>
                )}
              </LinearGradient>
            </Pressable>

            <Pressable onPress={() => setEditingProfile(false)}>
              <Text style={{ color: colors.muted, textAlign: "center", fontSize: 14 }}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function SettingSection({ title, colors, children }: { title: string; colors: any; children: React.ReactNode }) {
  return (
    <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
      <Text style={{ fontSize: 14, fontWeight: "bold", color: colors.muted, marginBottom: 12 }}>
        {title}
      </Text>
      <View style={{ gap: 8 }}>{children}</View>
    </View>
  );
}
