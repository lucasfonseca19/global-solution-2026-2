import type { ReactNode } from "react";
import { Pressable, ScrollView, View, StyleSheet } from "react-native";
import { AppText as Text, allo } from './typography';
const kg = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
export const peso = (n: number) => `${kg.format(n)} kg`;
export const data = (iso: string) => iso.split("-").reverse().join("/");
export const message = (error: unknown) =>
  error instanceof Error
    ? error.message
    : "Não foi possível carregar. Tente novamente.";
export function Button({
  title,
  onPress,
  disabled = false,
  secondary = false,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  secondary?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        secondary ? styles.secondary : undefined,
        { opacity: disabled || pressed ? 0.6 : 1 },
      ]}
    >
      <Text style={secondary ? styles.link : styles.buttonText}>{title}</Text>
    </Pressable>
  );
}
export function Page({ children }: { children: ReactNode }) {
  return (
    <ScrollView
      style={styles.page}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.scroll}
    >
      <View style={styles.content}>
        <Text style={styles.caption}>MERENDA · DEMONSTRAÇÃO</Text>
        {children}
      </View>
    </ScrollView>
  );
}
export function ErrorText({ text }: { text: string }) {
  return (
    <Text
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      style={styles.error}
    >
      {text}
    </Text>
  );
}
export const styles = StyleSheet.create({
  flex: { flex: 1 },
  page: { flex: 1, backgroundColor: "#f6f7f2" },
  scroll: { flexGrow: 1, padding: 24, paddingBottom: 40 },
  content: { width: "100%", maxWidth: 640, alignSelf: "center", gap: 16 },
  title: { fontSize: 26, fontWeight: "700", color: "#183d30" },
  text: { fontSize: 16, lineHeight: 24, color: "#3b4841" },
  strong: { fontSize: 16, fontWeight: "600", color: "#183d30" },
  caption: {
    fontSize: 13,
    lineHeight: 20,
    color: "#4a5a50",
    letterSpacing: 0.5,
  },
  notice: {
    padding: 20,
    gap: 10,
    backgroundColor: "#e4eee4",
    borderRadius: 12,
    borderCurve: "continuous",
  },
  card: {
    padding: 20,
    gap: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d2dacf",
    borderRadius: 12,
    borderCurve: "continuous",
  },
  input: {
    ...allo(16),
    minHeight: 48,
    padding: 12,
    fontSize: 16,
    color: "#183d30",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#758679",
    borderRadius: 8,
    borderCurve: "continuous",
  },
  button: {
    minHeight: 48,
    padding: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#245b46",
    borderRadius: 8,
    borderCurve: "continuous",
  },
  secondary: { backgroundColor: "transparent", borderWidth: 1, borderColor: "#758679" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  error: { color: "#9e2525", fontSize: 16, lineHeight: 24 },
  link: { color: "#245b46", fontSize: 16, fontWeight: "600" },
  amount: { fontSize: 22, fontWeight: "700", color: "#183d30" },
});
