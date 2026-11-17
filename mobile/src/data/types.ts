import type { Leitura } from "../../../iot/shared";
export type { Leitura };
export type Previa = Pesagem & { categoria: Categoria };
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
/** Operações do fluxo aprovado de pesagem. */
export type AppDataAccess = WeighingDataAccess;
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
  avaliar(token: string, leitura: Leitura): Promise<Previa>;
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
