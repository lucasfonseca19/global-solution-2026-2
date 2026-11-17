import type { Leitura } from "../../../iot/shared";
export type { Leitura };
export type Previa = Pesagem & { categoria: Categoria };
export type EntradaServico = { data: string; tipoRefeicao: string; pesagens: Leitura[] };
/** Formatos provisórios: revisar com o colega antes de integrar a API. */
export type Categoria = "SOBRA_DESCARTADA" | "RESTO_PRATO";
export type Pesagem = {
  lixeiraId: number;
  codigoRfid: string;
  taraKg: number;
  pesoBrutoKg: number;
  pesoLiquidoKg: number;
};
export type RegistroPesagem = Previa & { id: string };
export type ConfirmacaoPesagem = { data: string; tipoRefeicao: string; cicloId: string; leitura: Leitura; substituirId?: string };
export interface WeighingDataAccess extends DataAccess {
  confirmarPesagem(token: string, entrada: ConfirmacaoPesagem): Promise<Servico>;
  concluirServico(token: string, id: number): Promise<Servico>;
}
/** Operações do fluxo aprovado; CRUD/restauração antigos pertencem só ao cliente legado. */
export type AppDataAccess = Pick<WeighingDataAccess,
  'login' | 'listar' | 'detalhar' | 'excluir' | 'avaliar' | 'confirmarPesagem' | 'concluirServico'>;
export type Servico = {
  id: number;
  data: string;
  tipoRefeicao: string;
  status: "PENDENTE" | "COMPLETO";
  pesagens: Record<Categoria, Pesagem | null>;
  totalKg: number;
  /** Contribuições individuais; ausente nos exemplos e clientes legados. */
  registros?: RegistroPesagem[];
  ciclosConfirmados?: string[];
};
export type Sessao = { token: string; usuario: { id: number; nome: string } };
/** Fronteira assíncrona do adaptador demonstrativo; contrato provisório. */
export interface DataAccess {
  excluir(token: string, id: number): Promise<void>;
  restaurarExemplos(token: string): Promise<void>;
  avaliar(token: string, leitura: Leitura): Promise<Previa>;
  criar(token: string, entrada: EntradaServico): Promise<Servico>;
  atualizar(token: string, id: number, entrada: EntradaServico): Promise<Servico>;
  login(credentials: { login: string; senha: string }): Promise<Sessao>;
  listar(token: string): Promise<Servico[]>;
  detalhar(token: string, id: number): Promise<Servico>;
}
export class DataError extends Error {
  constructor(
    public codigo: string,
    mensagem: string,
  ) {
    super(mensagem);
  }
}
