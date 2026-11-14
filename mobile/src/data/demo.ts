import { exemplos } from "./fixtures";
import { DataError, type DataAccess, type Servico } from "./types";
const copy = <T>(value: T): T => JSON.parse(JSON.stringify(value));
/** Simulação local, sem rede, hash de senha ou garantia de segurança real. */
export function createDemoData(seed: Servico[] = exemplos): DataAccess {
  const servicos = copy(seed);
  let activeToken: string | undefined;
  function authorize(token: string) {
    if (!activeToken || token !== activeToken)
      throw new DataError(
        "NAO_AUTORIZADO",
        "Entre na demonstração para consultar.",
      );
  }
  return {
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
      return copy(servicos).sort(
        (a, b) => b.data.localeCompare(a.data) || b.id - a.id,
      );
    },
    async detalhar(token, id) {
      authorize(token);
      const servico = servicos.find((s) => s.id === id);
      if (!servico)
        throw new DataError(
          "SERVICO_NAO_ENCONTRADO",
          "Serviço não encontrado.",
        );
      return copy(servico);
    },
  };
}
