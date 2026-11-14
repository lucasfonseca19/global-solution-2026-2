import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, Page, ErrorText, styles, peso, data, message } from "./src/ui";
import { Registro } from "./src/Registro";
import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
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
  Registro: { servico?: Servico } | undefined;
};
const Stack = createNativeStackNavigator<Routes>();
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
  const [reset, setReset] = useState(false);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");
  async function restore() {
    if (busy) return;
    setBusy(true); setActionError("");
    try { await api.restaurarExemplos(session.token); setReset(false); retry(); }
    catch(e) { setActionError(message(e)); }
    finally { setBusy(false); }
  }
  const focused = useIsFocused();
  const { value, error, retry } = useData(
    () => api.listar(session.token),
    [api, session.token, focused],
  );
  return (
    <Page>
      <Text accessibilityRole="header" style={styles.title}>
        Histórico
      </Text>
      <Text style={styles.text}>
        Serviços de alimentação · dados simulados locais
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
      <Button title="Registrar descarte" onPress={() => navigation.navigate("Registro")} />
      {actionError ? <ErrorText text={actionError} /> : null}
      {reset ? <View style={styles.notice}>
        <Text style={styles.strong}>Substituir todos os serviços pelos exemplos?</Text>
        <Text style={styles.text}>As alterações serão removidas, sem recuperação.</Text>
        <Button title="Cancelar" disabled={busy} onPress={() => setReset(false)} />
        <Button title="Confirmar restauração" disabled={busy} onPress={restore} />
      </View> : <Button secondary title="Restaurar exemplos" onPress={() => setReset(true)} />}
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
  const [deleting, setDeleting] = useState(false);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");
  const focused = useIsFocused();
  async function remove() {
    if (busy) return;
    setBusy(true); setActionError("");
    try { await api.excluir(session.token, route.params.id); navigation.popTo("Historico"); }
    catch(e) { setActionError(message(e)); }
    finally { setBusy(false); }
  }
  const {
    value: s,
    error,
    retry,
  } = useData<Servico>(
    () => api.detalhar(session.token, route.params.id),
    [api, session.token, route.params.id, focused],
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
          <Button title="Corrigir pesagens" disabled={busy || deleting} onPress={() => navigation.navigate("Registro", {servico: s})} />
          {actionError ? <ErrorText text={actionError} /> : null}
          {deleting ? <View style={styles.notice}>
            <Text style={styles.strong}>Excluir este serviço e suas pesagens?</Text>
            <Text style={styles.text}>Esta ação não pode ser desfeita.</Text>
            <Button title="Cancelar" disabled={busy} onPress={() => setDeleting(false)} />
            <Button title="Confirmar exclusão" disabled={busy} onPress={remove} />
          </View> : <Button secondary title="Excluir serviço" onPress={() => setDeleting(true)} />}
        </>
      )}
      <Button title="Voltar ao histórico" disabled={busy} onPress={() => navigation.popTo("Historico")} />
    </Page>
  );
}
export default function App() {
  const [api] = useState<DataAccess>(() => createDemoData(undefined, AsyncStorage));
  const [session, setSession] = useState<Sessao>();
  function logout() {
    setSession(undefined);

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
              <Stack.Screen name="Registro" options={{ title: "Registrar descarte" }}>
                {(props) => <Registro key={props.route.params?.servico?.id ?? "novo"} initialService={props.route.params?.servico} api={api} session={session} onDetails={(id) => props.navigation.replace("Detalhes", {id})} />}
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
