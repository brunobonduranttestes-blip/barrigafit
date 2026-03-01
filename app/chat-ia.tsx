import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { GradientButton } from "@/components/ui/gradient-button";
import { setChatDone, saveUserProfile, setActiveProgramId } from "@/lib/storage";
import { CHAT_QUESTIONS, PROGRAMS } from "@/lib/mock-data";
import { useColors } from "@/hooks/use-colors";

interface Message {
  id: string;
  type: "bot" | "user";
  text: string;
  options?: { id: string; label: string; value: string }[];
  isTyping?: boolean;
}

const SUGGESTION_MAP: Record<string, string> = {
  weight_loss: "prog-01",
  toning: "prog-01",
  posture: "prog-03",
  energy: "prog-02",
};

export default function ChatIAScreen() {
  const colors = useColors();
  const scrollRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [suggestedProgram, setSuggestedProgram] = useState<typeof PROGRAMS[0] | null>(null);
  const typingAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initial bot greeting
    setTimeout(() => {
      addBotMessage(
        "Olá! Sou a assistente do BARRIGAFIT. Vou te ajudar a encontrar o programa ideal para você.",
        undefined,
        () => {
          setTimeout(() => {
            addQuestion(0);
          }, 800);
        }
      );
    }, 500);
  }, []);

  const addBotMessage = (text: string, options?: Message["options"], callback?: () => void) => {
    const typingId = `typing-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      { id: typingId, type: "bot", text: "", isTyping: true },
    ]);

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === typingId ? { ...m, text, options, isTyping: false } : m
        )
      );
      scrollRef.current?.scrollToEnd({ animated: true });
      callback?.();
    }, 1000);
  };

  const addQuestion = (index: number) => {
    if (index >= CHAT_QUESTIONS.length) return;
    const q = CHAT_QUESTIONS[index];
    addBotMessage(q.question, q.options);
  };

  const handleAnswer = (questionId: string, label: string, value: string) => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    // Add user message
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, type: "user", text: label },
    ]);

    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);

    const nextIndex = currentQuestion + 1;

    if (nextIndex < CHAT_QUESTIONS.length) {
      setCurrentQuestion(nextIndex);
      setTimeout(() => {
        addQuestion(nextIndex);
      }, 600);
    } else {
      // All questions answered — suggest program
      const goalValue = newAnswers["q1"] || "weight_loss";
      const programId = SUGGESTION_MAP[goalValue] || "prog-01";
      const program = PROGRAMS.find((p) => p.id === programId) || PROGRAMS[0];
      setSuggestedProgram(program);

      setTimeout(() => {
        addBotMessage(
          "Perfeito! Com base nas suas respostas, encontrei o programa ideal para você:",
          undefined,
          () => {
            setTimeout(() => {
              setIsFinished(true);
            }, 400);
          }
        );
      }, 600);
    }
  };

  const handleStartProgram = async () => {
    if (!suggestedProgram) return;
    await setActiveProgramId(suggestedProgram.id);
    await saveUserProfile({
      name: "",
      goal: answers["q1"] || "weight_loss",
      level: answers["q2"] || "beginner",
      availableTime: answers["q3"] || "30min",
      startDate: new Date().toISOString(),
    });
    await setChatDone();
    router.replace("/(tabs)");
  };

  const handleSkip = async () => {
    await setActiveProgramId("prog-01");
    await saveUserProfile({
      name: "",
      goal: "weight_loss",
      level: "beginner",
      availableTime: "30min",
      startDate: new Date().toISOString(),
    });
    await setChatDone();
    router.replace("/(tabs)");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#0A0A0A" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <LinearGradient
          colors={["#E91E8C", "#C026D3"]}
          style={styles.avatarGradient}
        >
          <IconSymbol name="wand.and.stars" size={20} color="#fff" />
        </LinearGradient>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>Assistente BarrigaFit</Text>
          <View style={styles.onlineIndicator}>
            <View style={styles.onlineDot} />
            <Text style={[styles.onlineText, { color: colors.muted }]}>Online agora</Text>
          </View>
        </View>
        <Pressable onPress={handleSkip} style={styles.skipBtn} hitSlop={8}>
          <Text style={[styles.skipText, { color: colors.muted }]}>Pular</Text>
        </Pressable>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        style={styles.messageList}
        contentContainerStyle={styles.messageListContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((msg) => (
          <View key={msg.id} style={[styles.messageRow, msg.type === "user" && styles.messageRowUser]}>
            {msg.type === "bot" && (
              <LinearGradient
                colors={["#E91E8C", "#C026D3"]}
                style={styles.botAvatar}
              >
                <IconSymbol name="sparkles" size={14} color="#fff" />
              </LinearGradient>
            )}

            <View style={styles.messageBubbleContainer}>
              {msg.isTyping ? (
                <View style={[styles.bubble, styles.botBubble, { backgroundColor: colors.surfaceAlt }]}>
                  <TypingDots />
                </View>
              ) : (
                <>
                  <View
                    style={[
                      styles.bubble,
                      msg.type === "bot"
                        ? [styles.botBubble, { backgroundColor: colors.surfaceAlt }]
                        : styles.userBubble,
                    ]}
                  >
                    <Text
                      style={[
                        styles.bubbleText,
                        msg.type === "bot"
                          ? { color: colors.foreground }
                          : { color: "#fff" },
                      ]}
                    >
                      {msg.text}
                    </Text>
                  </View>

                  {/* Options */}
                  {msg.options && msg.type === "bot" && currentQuestion < CHAT_QUESTIONS.length && (
                    <View style={styles.optionsContainer}>
                      {msg.options.map((opt) => (
                        <Pressable
                          key={opt.id}
                          onPress={() => handleAnswer(CHAT_QUESTIONS[currentQuestion].id, opt.label, opt.value)}
                          style={({ pressed }) => [
                            styles.optionBtn,
                            {
                              borderColor: colors.border,
                              backgroundColor: pressed ? colors.surfaceAlt : "transparent",
                            },
                          ]}
                        >
                          <Text style={[styles.optionText, { color: colors.foreground }]}>
                            {opt.label}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  )}
                </>
              )}
            </View>
          </View>
        ))}

        {/* Program Suggestion */}
        {isFinished && suggestedProgram && (
          <View style={styles.suggestionCard}>
            <LinearGradient
              colors={[suggestedProgram.color, suggestedProgram.colorSecondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.suggestionGradient}
            >
              <Text style={styles.suggestionLabel}>PROGRAMA RECOMENDADO</Text>
              <Text style={styles.suggestionTitle}>{suggestedProgram.title}</Text>
              <Text style={styles.suggestionSubtitle}>{suggestedProgram.subtitle}</Text>
              <View style={styles.suggestionMeta}>
                <View style={styles.suggestionMetaItem}>
                  <IconSymbol name="calendar" size={14} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.suggestionMetaText}>{suggestedProgram.duration} dias</Text>
                </View>
                <View style={styles.suggestionMetaItem}>
                  <IconSymbol name="clock.fill" size={14} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.suggestionMetaText}>{suggestedProgram.avgDuration} min/dia</Text>
                </View>
                <View style={styles.suggestionMetaItem}>
                  <IconSymbol name="bolt.fill" size={14} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.suggestionMetaText}>{suggestedProgram.level}</Text>
                </View>
              </View>
            </LinearGradient>

            <View style={[styles.suggestionActions, { backgroundColor: colors.surfaceAlt }]}>
              <GradientButton
                label="Iniciar este programa"
                onPress={handleStartProgram}
                fullWidth
                size="lg"
              />
              <Pressable onPress={handleSkip} style={styles.exploreBtn}>
                <Text style={[styles.exploreText, { color: colors.muted }]}>
                  Explorar outros programas
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function TypingDots() {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.delay(600),
        ])
      );

    const a1 = animate(dot1, 0);
    const a2 = animate(dot2, 200);
    const a3 = animate(dot3, 400);
    a1.start();
    a2.start();
    a3.start();
    return () => {
      a1.stop();
      a2.stop();
      a3.stop();
    };
  }, []);

  return (
    <View style={{ flexDirection: "row", gap: 4, paddingVertical: 4 }}>
      {[dot1, dot2, dot3].map((dot, i) => (
        <Animated.View
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: "#9CA3AF",
            opacity: dot,
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 56 : 40,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    gap: 12,
  },
  avatarGradient: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    color: "#F9FAFB",
    fontSize: 15,
    fontWeight: "700",
  },
  onlineIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 2,
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#34D399",
  },
  onlineText: {
    fontSize: 12,
    fontWeight: "500",
  },
  skipBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  skipText: {
    fontSize: 14,
    fontWeight: "500",
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    padding: 20,
    gap: 16,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
  },
  messageRowUser: {
    flexDirection: "row-reverse",
  },
  botAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  messageBubbleContainer: {
    flex: 1,
    maxWidth: "85%",
    gap: 8,
  },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  botBubble: {
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: "#E91E8C",
    borderBottomRightRadius: 4,
    alignSelf: "flex-end",
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "400",
  },
  optionsContainer: {
    gap: 8,
    marginTop: 4,
  },
  optionBtn: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  optionText: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
  },
  suggestionCard: {
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 8,
  },
  suggestionGradient: {
    padding: 20,
  },
  suggestionLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  suggestionTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  suggestionSubtitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
    fontWeight: "500",
    marginTop: 4,
    marginBottom: 16,
  },
  suggestionMeta: {
    flexDirection: "row",
    gap: 16,
  },
  suggestionMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  suggestionMetaText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    fontWeight: "600",
  },
  suggestionActions: {
    padding: 16,
    gap: 12,
  },
  exploreBtn: {
    alignItems: "center",
    paddingVertical: 8,
  },
  exploreText: {
    fontSize: 13,
    fontWeight: "500",
  },
});
