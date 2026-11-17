import { requireCurrentServiceDay } from "./serviceDay";
import { avaliar } from "../../../iot/shared";
import { individualRecords, withRecords } from './weighing';
import { exemplos } from "./fixtures";
import { DataError, type WeighingDataAccess, type Servico } from "./types";
const copy = <T>(value: T): T => JSON.parse(JSON.stringify(value));
/** Simulação local, sem rede, hash de senha ou garantia de segurança real. */
export type ServiceStorage = {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<unknown>;
};
export const SERVICE_STORAGE_KEY = "merenda.servicos.v1";
export function createDemoData(seed: Servico[] = exemplos, storage?: ServiceStorage): WeighingDataAccess {
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
  return {
    async confirmarPesagem(token, entrada) {
      authorize(token);
      return run(async () => {
        const {data,tipoRefeicao,cicloId,leitura,substituirId}=entrada;
        requireCurrentServiceDay(data);
        if (!cicloId?.trim()) throw new DataError('CICLO_INVALIDO','Inicie uma nova pesagem.');
        const existing=servicos.find(s=>s.data===data&&s.tipoRefeicao.toLocaleLowerCase('pt-BR')===tipoRefeicao.trim().toLocaleLowerCase('pt-BR'));
        if (existing) requireCurrentServiceDay(existing.data);
        if (existing?.ciclosConfirmados?.includes(cicloId)) return copy(existing);
        const id=existing?.id??Math.max(0,...servicos.map(s=>s.id))+1;
        const base: Servico = {id, data, tipoRefeicao: tipoRefeicao.trim(), status: 'PENDENTE', totalKg: 0, pesagens: {SOBRA_DESCARTADA:null, RESTO_PRATO:null}};
        const previous=existing?individualRecords(existing):[];
        const value=avaliar(leitura);
        if (substituirId) {
          const target=previous.find(r=>r.id===substituirId);
          if (!target) throw new DataError('PESAGEM_NAO_ENCONTRADA','Pesagem não encontrada.');
          if (target.codigoRfid!==value.codigoRfid) throw new DataError('LIXEIRA_DIFERENTE','Use a mesma lixeira para corrigir este registro.');
        } else if (existing?.status==='COMPLETO') {
          throw new DataError('SERVICO_CONCLUIDO','Este serviço está concluído. Escolha um registro para corrigir.');
        }
        const record={...value,id:substituirId??cicloId};
        const records=substituirId?previous.map(r=>r.id===substituirId?record:r):[...previous,record];
        const result=withRecords({...base,status:existing?.status??'PENDENTE',ciclosConfirmados:[...(existing?.ciclosConfirmados??[]),cicloId]},records);
        await persist(existing?servicos.map(s=>s.id===id?result:s):[...servicos,result]);
        return copy(result);
      });
    },
    async concluirServico(token,id) {
      authorize(token);
      return run(async()=>{
        const existing=servicos.find(s=>s.id===id);
        if(!existing) throw new DataError('SERVICO_NAO_ENCONTRADO','Serviço não encontrado.');
        requireCurrentServiceDay(existing.data);
        const records=individualRecords(existing);
        if(!['SOBRA_DESCARTADA','RESTO_PRATO'].every(c=>records.some(r=>r.categoria===c))) throw new DataError('CATEGORIA_PENDENTE','Registre as duas categorias, incluindo zero quando não houver descarte.');
        const result=withRecords({...existing,status:'COMPLETO'},records);
        await persist(servicos.map(s=>s.id===id?result:s));
        return copy(result);
      });
    },
    async excluir(token, id) {
      authorize(token);
      return run(async () => {
        if (!servicos.some(s => s.id === id)) throw new DataError("SERVICO_NAO_ENCONTRADO", "Serviço não encontrado.");
        requireCurrentServiceDay(servicos.find(s=>s.id===id)!.data);
        await persist(servicos.filter(s => s.id !== id));
      });
    },
    async avaliar(token, leitura) { authorize(token); return avaliar(leitura); },
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
