import { useEffect, useState, type ReactNode } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createDemoData } from "./src/data/demo";
import type { DataAccess, Servico, Sessao } from "./src/data/types";

type Routes = {
  Login: undefined;
  Historico: undefined;
  Detalhes: { id: number };
};
// Registro será a quarta tela, acrescentada no ticket 10 junto ao comportamento real.
const Stack = createNativeStackNavigator<Routes>();
const kg = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const peso = (n: number) => `${kg.format(n)} kg`;
const data = (iso: string) => iso.split("-").reverse().join("/");
const message = (error: unknown) =>
  error instanceof Error
    ? error.message
    : "Não foi possível carregar. Tente novamente.";
function Button({
  title,
  onPress,
  disabled = false,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { opacity: disabled || pressed ? 0.6 : 1 },
      ]}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
}
function Page({ children }: { children: ReactNode }) {
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
function ErrorText({ text }: { text: string }) {
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
function Login({
  api,
  onLogin,
}: {
  api: DataAccess;
  onLogin: (session: Sessao) => void;
}) {
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit() {
    if (busy) return;
    setError("");
    if (!login.trim() || !senha) {
      setError("Preencha login e senha.");
      return;
    }
    setBusy(true);
    try {
      const session = await api.login({ login: login.trim(), senha });
      setSenha("");
      onLogin(session);
    } catch (e) {
      setError(message(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Page>
        <Text accessibilityRole="header" style={styles.title}>
          Consultar o descarte
        </Text>
        <Text style={styles.text}>
          Acompanhe os serviços de alimentação e as pesagens confirmadas.
        </Text>
        <View style={styles.notice}>
          <Text style={styles.strong}>Login simulado</Text>
          <Text style={styles.text}>
            Dados fictícios, sem conexão com a API. Este acesso não demonstra
            autenticação segura.
          </Text>
          <Text selectable style={styles.text}>
            Login: demo · Senha: merenda-demo
          </Text>
        </View>
        <Text style={styles.strong}>Login</Text>
        <TextInput
          accessibilityLabel="Login"
          value={login}
          onChangeText={setLogin}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="off"
          style={styles.input}
          returnKeyType="next"
        />
        <Text style={styles.strong}>Senha</Text>
        <TextInput
          accessibilityLabel="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          autoCapitalize="none"
          autoComplete="off"
          style={styles.input}
          returnKeyType="go"
          onSubmitEditing={submit}
        />
        {error ? <ErrorText text={error} /> : null}
        <Button
          title={busy ? "Entrando…" : "Entrar na demonstração"}
          onPress={submit}
          disabled={busy}
        />
      </Page>
    </KeyboardAvoidingView>
  );
}
function useData<T>(load: () => Promise<T>, dependencies: unknown[]) {
  const [value, setValue] = useState<T>();
  const [error, setError] = useState("");
  const [attempt, retry] = useState(0);
  useEffect(() => {
    let alive = true;
    setValue(undefined);
    setError("");
    load()
      .then((v) => {
        if (alive) setValue(v);
      })
      .catch((e) => {
        if (alive) setError(message(e));
      });
    return () => {
      alive = false;
    };
  }, [...dependencies, attempt]);
  return { value, error, retry: () => retry((n) => n + 1) };
}
function History({
  api,
  session,
  navigation,
  logout,
}: {
  api: DataAccess;
  session: Sessao;
  navigation: NativeStackScreenProps<Routes, "Historico">["navigation"];
  logout: () => void;
}) {
  const { value, error, retry } = useData(
    () => api.listar(session.token),
    [api, session.token],
  );
  return (
    <Page>
      <Text accessibilityRole="header" style={styles.title}>
        Histórico
      </Text>
      <Text style={styles.text}>
        Serviços de alimentação · exemplos fictícios
      </Text>
      {error ? (
        <>
          <ErrorText text={error} />
          <Button title="Tentar novamente" onPress={retry} />
        </>
      ) : value === undefined ? (
        <ActivityIndicator
          accessibilityLabel="Carregando histórico"
          color="#245b46"
        />
      ) : value.length === 0 ? (
        <Text style={styles.text}>Nenhum serviço registrado.</Text>
      ) : (
        value.map((s) => (
          <Pressable
            key={s.id}
            accessibilityRole="button"
            accessibilityLabel={`${data(s.data)} · ${s.tipoRefeicao} · ${s.status === "COMPLETO" ? "Completo" : "Pendente"} · ${s.status === "PENDENTE" ? "Total parcial" : "Total"}: ${peso(s.totalKg)}`}
            onPress={() => navigation.navigate("Detalhes", { id: s.id })}
            style={styles.card}
          >
            <Text style={styles.strong}>
              {data(s.data)} · {s.tipoRefeicao}
            </Text>
            <Text style={styles.text}>
              {s.status === "COMPLETO" ? "Completo" : "Pendente"} ·{" "}
              {s.status === "PENDENTE" ? "Total parcial" : "Total"}:{" "}
              {peso(s.totalKg)}
            </Text>
            <Text style={styles.link}>Consultar detalhes →</Text>
          </Pressable>
        ))
      )}
      <Button title="Sair da demonstração" onPress={logout} />
    </Page>
  );
}
function Details({
  api,
  session,
  route,
  navigation,
}: { api: DataAccess; session: Sessao } & NativeStackScreenProps<
  Routes,
  "Detalhes"
>) {
  const {
    value: s,
    error,
    retry,
  } = useData<Servico>(
    () => api.detalhar(session.token, route.params.id),
    [api, session.token, route.params.id],
  );
  return (
    <Page>
      {error ? (
        <>
          <ErrorText text={error} />
          <Button title="Tentar novamente" onPress={retry} />
        </>
      ) : s === undefined ? (
        <ActivityIndicator
          accessibilityLabel="Carregando detalhes"
          color="#245b46"
        />
      ) : (
        <>
          <Text accessibilityRole="header" style={styles.title}>
            {data(s.data)} · {s.tipoRefeicao}
          </Text>
          <Text style={styles.text}>
            {s.status === "COMPLETO" ? "Completo" : "Pendente"}
          </Text>
          <View style={styles.notice}>
            <Text style={styles.strong}>
              {s.status === "PENDENTE"
                ? "Total parcial do descarte monitorado"
                : "Total do descarte monitorado"}
            </Text>
            <Text style={styles.title}>{peso(s.totalKg)}</Text>
            {s.status === "PENDENTE" ? (
              <Text style={styles.text}>
                Soma somente das categorias confirmadas.
              </Text>
            ) : null}
          </View>
          {(["SOBRA_DESCARTADA", "RESTO_PRATO"] as const).map((category) => {
            const p = s.pesagens[category];
            return (
              <View key={category} style={styles.card}>
                <Text style={styles.strong}>
                  {category === "SOBRA_DESCARTADA"
                    ? "Sobra descartada"
                    : "Resto comestível do prato"}
                </Text>
                {p === null ? (
                  <Text style={styles.text}>Aguardando pesagem</Text>
                ) : (
                  <>
                    <Text style={styles.amount}>{peso(p.pesoLiquidoKg)}</Text>
                    <Text style={styles.text}>Peso confirmado do alimento</Text>
                    <Text style={styles.text}>
                      Peso bruto: {peso(p.pesoBrutoKg)} · Tara: {peso(p.taraKg)}
                    </Text>
                    <Text selectable style={styles.caption}>
                      {p.codigoRfid}
                    </Text>
                  </>
                )}
              </View>
            );
          })}
        </>
      )}
      <Button title="Voltar ao histórico" onPress={() => navigation.goBack()} />
    </Page>
  );
}
export default function App() {
  const [api, setApi] = useState<DataAccess>(() => createDemoData());
  const [session, setSession] = useState<Sessao>();
  function logout() {
    setSession(undefined);
    setApi(createDemoData());
  }
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            animation: "none",
            headerStyle: { backgroundColor: "#f6f7f2" },
            headerTintColor: "#183d30",
            contentStyle: { backgroundColor: "#f6f7f2" },
          }}
        >
          {session ? (
            <>
              <Stack.Screen name="Historico" options={{ title: "Merenda" }}>
                {(props) => (
                  <History
                    {...props}
                    api={api}
                    session={session}
                    logout={logout}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen
                name="Detalhes"
                options={{
                  title: "Detalhes",
                  headerBackButtonDisplayMode: "minimal",
                }}
              >
                {(props) => <Details {...props} api={api} session={session} />}
              </Stack.Screen>
            </>
          ) : (
            <Stack.Screen name="Login" options={{ title: "Merenda" }}>
              {() => <Login api={api} onLogin={setSession} />}
            </Stack.Screen>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
const styles = StyleSheet.create({
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
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  error: { color: "#9e2525", fontSize: 16, lineHeight: 24 },
  link: { color: "#245b46", fontSize: 16, fontWeight: "600" },
  amount: { fontSize: 22, fontWeight: "700", color: "#183d30" },
});
