import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { getUserProfile, saveUserProfile, signInWithCode } from "@/lib/storage";
import { useColors } from "@/hooks/use-colors";

export default function LoginScreen() {
  const colors = useColors();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const result = await signInWithCode(name, email, code);
    setLoading(false);
    if (!result.ok || !result.session) { Alert.alert("Não foi possível entrar", result.message); return; }
    const previous = await getUserProfile();
    await saveUserProfile({ name: result.session.name, email: result.session.email, goal: previous?.goal ?? "Definir abdômen", level: previous?.level ?? "Iniciante", availableTime: previous?.availableTime ?? "20 min", startDate: previous?.startDate ?? new Date().toISOString() });
    router.replace("/(tabs)");
  };

  return <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={[styles.screen, { backgroundColor: colors.background }]}>
    <View style={styles.header}><View style={styles.brand}><Text style={[styles.brandMain, { color: colors.foreground }]}>BARRIGA</Text><Text style={[styles.brandAccent, { color: colors.primary }]}>FIT</Text></View><Text style={[styles.kicker, { color: colors.muted }]}>DESAFIO DE 21 DIAS</Text></View>
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.iconWrap, { backgroundColor: colors.primary + "18" }]}><IconSymbol name="lock.fill" size={26} color={colors.primary} /></View>
      <Text style={[styles.title, { color: colors.foreground }]}>Acesse sua jornada</Text>
      <Text style={[styles.subtitle, { color: colors.muted }]}>Use o código de acesso fornecido pela administração.</Text>
      <Text style={[styles.label, { color: colors.muted }]}>NOME</Text><TextInput value={name} onChangeText={setName} placeholder="Como você quer ser chamada?" placeholderTextColor={colors.muted} style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.surfaceAlt }]} />
      <Text style={[styles.label, { color: colors.muted }]}>E-MAIL</Text><TextInput value={email} onChangeText={setEmail} placeholder="voce@email.com" placeholderTextColor={colors.muted} keyboardType="email-address" autoCapitalize="none" style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.surfaceAlt }]} />
      <Text style={[styles.label, { color: colors.muted }]}>CÓDIGO DE ACESSO</Text><TextInput value={code} onChangeText={setCode} placeholder="Ex.: BF-XXXX-XXXX" placeholderTextColor={colors.muted} autoCapitalize="characters" style={[styles.input, styles.codeInput, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.surfaceAlt }]} />
      <Pressable onPress={handleLogin} disabled={loading} style={({ pressed }) => [styles.loginButton, { opacity: pressed || loading ? .8 : 1 }]}><LinearGradient colors={["#E91E8C", "#C026D3"]} style={styles.loginGradient}><Text style={styles.loginText}>{loading ? "Validando..." : "Entrar no BARRIGAFIT"}</Text><IconSymbol name="arrow.right" size={18} color="#fff" /></LinearGradient></Pressable>
    </View>
    <Text style={[styles.footer, { color: colors.muted }]}>Não recebeu um código? Fale com a administração.</Text>
  </KeyboardAvoidingView>;
}

const styles = StyleSheet.create({ screen:{flex:1,justifyContent:"center",padding:24},header:{alignItems:"center",marginBottom:28},brand:{flexDirection:"row",alignItems:"baseline"},brandMain:{fontSize:30,fontWeight:"900",letterSpacing:-1},brandAccent:{fontSize:30,fontWeight:"900",letterSpacing:-1},kicker:{fontSize:10,fontWeight:"800",letterSpacing:3,marginTop:4},card:{borderWidth:1,borderRadius:24,padding:22},iconWrap:{width:54,height:54,borderRadius:27,alignItems:"center",justifyContent:"center",marginBottom:18},title:{fontSize:24,fontWeight:"800",letterSpacing:-.5},subtitle:{fontSize:14,lineHeight:20,marginTop:6,marginBottom:22},label:{fontSize:10,fontWeight:"800",letterSpacing:1.1,marginBottom:7,marginTop:12},input:{height:48,borderWidth:1,borderRadius:12,paddingHorizontal:14,fontSize:14},codeInput:{fontWeight:"800",letterSpacing:1.2},loginButton:{marginTop:22,borderRadius:14,overflow:"hidden"},loginGradient:{height:52,flexDirection:"row",alignItems:"center",justifyContent:"center",gap:8,borderRadius:14},loginText:{color:"#fff",fontSize:15,fontWeight:"800"},footer:{fontSize:12,textAlign:"center",marginTop:20} });
