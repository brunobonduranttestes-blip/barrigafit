import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, SafeAreaView, ScrollView } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import LinearGradient from "expo-linear-gradient";
import { useAuth } from "@/lib/auth-context";
import { useColors } from "@/hooks/use-colors";

export default function LoginScreen() {
  const colors = useColors();
  const { login, isLoading } = useAuth();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!nome.trim() || !email.trim() || !codigo.trim()) {
      setError("Por favor, preencha todos os campos");
      return;
    }

    try {
      setError("");
      await login(email.toLowerCase(), nome, codigo);
      router.replace("/onboarding");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao fazer login");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingHorizontal: 16 }}>
        <View style={{ marginBottom: 40 }}>
          <Text style={{ fontSize: 32, fontWeight: "bold", color: colors.text, marginBottom: 8 }}>BARRIGAFIT</Text>
          <Text style={{ fontSize: 14, color: colors.muted }}>Desafio 21 Dias para uma Barriga Chapada</Text>
        </View>

        <View style={{ gap: 12 }}>
          <View>
            <Text style={{ color: colors.text, fontSize: 14, fontWeight: "600", marginBottom: 6 }}>Nome Completo</Text>
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
              placeholder="Seu nome"
              placeholderTextColor={colors.muted}
              value={nome}
              onChangeText={setNome}
              editable={!isLoading}
            />
          </View>

          <View>
            <Text style={{ color: colors.text, fontSize: 14, fontWeight: "600", marginBottom: 6 }}>E-mail</Text>
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
              placeholder="seu@email.com"
              placeholderTextColor={colors.muted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
            />
          </View>

          <View>
            <Text style={{ color: colors.text, fontSize: 14, fontWeight: "600", marginBottom: 6 }}>Código de Acesso</Text>
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
              placeholder="Seu código de 8 caracteres"
              placeholderTextColor={colors.muted}
              value={codigo}
              onChangeText={setCodigo}
              secureTextEntry
              editable={!isLoading}
            />
          </View>
        </View>

        {error ? (
          <Text style={{ color: "#EF4444", marginTop: 12, fontSize: 14, fontWeight: "500" }}>{error}</Text>
        ) : null}

        <TouchableOpacity
          onPress={handleLogin}
          disabled={isLoading}
          style={{ marginTop: 24 }}
        >
          <LinearGradient
            colors={["#C2185B", "#E91E8C"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 12,
              paddingVertical: 14,
              alignItems: "center",
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>Entrar</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <Text style={{ color: colors.muted, fontSize: 12, marginTop: 20, textAlign: "center" }}>
          Você recebeu um código de acesso por e-mail. Se não tem, entre em contato com o suporte.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
