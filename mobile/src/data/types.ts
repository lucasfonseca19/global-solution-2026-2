/** Formatos provisórios: revisar com o colega antes de integrar a API. */
export type Categoria = "SOBRA_DESCARTADA" | "RESTO_PRATO";
export type Pesagem = {
  lixeiraId: number;
  codigoRfid: string;
  taraKg: number;
  pesoBrutoKg: number;
  pesoLiquidoKg: number;
};
export type Servico = {
  id: number;
  data: string;
  tipoRefeicao: string;
  status: "PENDENTE" | "COMPLETO";
  pesagens: Record<Categoria, Pesagem | null>;
  totalKg: number;
};
export type Sessao = { token: string; usuario: { id: number; nome: string } };
/** Fronteira de leitura do ticket 09. Escrita e prévia serão acrescentadas em 10. */
export interface DataAccess {
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
