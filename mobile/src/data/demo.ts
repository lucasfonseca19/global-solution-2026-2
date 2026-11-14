import { avaliar } from "../../../iot/shared";
import type { EntradaServico } from "./types";
import { exemplos } from "./fixtures";
import { DataError, type DataAccess, type Servico } from "./types";
const copy = <T>(value: T): T => JSON.parse(JSON.stringify(value));
/** Simulação local, sem rede, hash de senha ou garantia de segurança real. */
export type ServiceStorage = {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<unknown>;
};
export const SERVICE_STORAGE_KEY = "merenda.servicos.v1";
export function createDemoData(seed: Servico[] = exemplos, storage?: ServiceStorage): DataAccess {
  let servicos = copy(seed);
  let loaded = !storage;
  let queue: Promise<unknown> = Promise.resolve();
  // Serializa leitura inicial e operações; só publica o estado após escrita bem-sucedida.
  function run<T>(operation: () => Promise<T> | T): Promise<T> {
    const result = queue.then(async () => {
      if (!loaded && storage) {
        const saved = await storage.getItem(SERVICE_STORAGE_KEY);
        if (saved !== null) servicos = JSON.parse(saved);
        else await storage.setItem(SERVICE_STORAGE_KEY, JSON.stringify(servicos));
        loaded = true;
      }
      return operation();
    });
    queue = result.catch(() => undefined);
    return result;
  }
  async function persist(next: Servico[]) {
    if (storage) await storage.setItem(SERVICE_STORAGE_KEY, JSON.stringify(next));
    servicos = next;
  }
  let activeToken: string | undefined;
  function authorize(token: string) {
    if (!activeToken || token !== activeToken)
      throw new DataError(
        "NAO_AUTORIZADO",
        "Entre na demonstração para consultar.",
      );
  }
  function prepare(entrada: EntradaServico, id: number): Servico {
    const { data, tipoRefeicao, pesagens } = entrada;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data) || !Number.isFinite(Date.parse(data)) || new Date(data).toISOString().slice(0,10) !== data || !tipoRefeicao.trim() || !pesagens.length)
      throw new DataError("DADOS_INVALIDOS", "Informe data válida, tipo de refeição e uma pesagem.");
    if (servicos.some(s => s.id !== id && s.data === data && s.tipoRefeicao.toLocaleLowerCase('pt-BR') === tipoRefeicao.trim().toLocaleLowerCase('pt-BR')))
      throw new DataError("SERVICO_JA_EXISTE", "Serviço já existe. Procure e continue o registro.");
    const result: Servico = {id, data, tipoRefeicao: tipoRefeicao.trim(), status: "PENDENTE", totalKg: 0, pesagens: {SOBRA_DESCARTADA:null, RESTO_PRATO:null}};
    for (const leitura of pesagens) {
      const {categoria, ...peso} = avaliar(leitura);
      if (result.pesagens[categoria]) throw new DataError("DADOS_INVALIDOS", "Categoria repetida.");
      result.pesagens[categoria] = peso;
      result.totalKg += peso.pesoLiquidoKg;
    }
    if (result.pesagens.SOBRA_DESCARTADA && result.pesagens.RESTO_PRATO) result.status = "COMPLETO";
    return result;
  }
  return {
    async restaurarExemplos(token) {
      authorize(token);
      return run(() => persist(copy(exemplos)));
    },
    async excluir(token, id) {
      authorize(token);
      return run(async () => {
        if (!servicos.some(s => s.id === id)) throw new DataError("SERVICO_NAO_ENCONTRADO", "Serviço não encontrado.");
        await persist(servicos.filter(s => s.id !== id));
      });
    },
    async avaliar(token, leitura) { authorize(token); return avaliar(leitura); },
    async criar(token, entrada) {
      authorize(token);
      return run(async () => {
      const result = prepare(entrada, Math.max(0, ...servicos.map(s => s.id)) + 1);
      await persist([...servicos, result]);
      return copy(result);
      });
    },
    async atualizar(token, id, entrada) {
      authorize(token);
      return run(async () => {
      const index = servicos.findIndex(s => s.id === id);
      if (index < 0) throw new DataError("SERVICO_NAO_ENCONTRADO", "Serviço não encontrado.");
      const result = prepare(entrada, id);
      await persist(servicos.map(s => s.id === id ? result : s));
      return copy(result);
      });
    },
    async login(credentials) {
      if (credentials.login !== "demo" || credentials.senha !== "merenda-demo")
        throw new DataError("NAO_AUTORIZADO", "Login ou senha inválidos.");
      activeToken = "TOKEN_DEMONSTRATIVO";
      return {
        token: activeToken,
        usuario: { id: 1, nome: "Operador de demonstração" },
      };
    },
    async listar(token) {
      authorize(token);
      return run(() => copy(servicos).sort(
        (a, b) => b.data.localeCompare(a.data) || b.id - a.id,
      ));
    },
    async detalhar(token, id) {
      authorize(token);
      return run(() => {
      const servico = servicos.find((s) => s.id === id);
      if (!servico)
        throw new DataError(
          "SERVICO_NAO_ENCONTRADO",
          "Serviço não encontrado.",
        );
      return copy(servico);
      });
    },
  };
}
