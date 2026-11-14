import { expect, test } from "vitest";
import { createDemoData } from "./demo";

test("login fictício retorna usuário sem senha", async () => {
  const api = createDemoData();
  expect(await api.login({ login: "demo", senha: "merenda-demo" })).toEqual({
    token: "TOKEN_DEMONSTRATIVO",
    usuario: { id: 1, nome: "Operador de demonstração" },
  });
});

test("credenciais incorretas são rejeitadas com mensagem genérica", async () => {
  await expect(
    createDemoData().login({ login: "demo", senha: "errada" }),
  ).rejects.toMatchObject({
    codigo: "NAO_AUTORIZADO",
    message: "Login ou senha inválidos.",
  });
});

test("consulta retorna exemplos completos, pendentes e zero confirmado sem confundi-los", async () => {
  const api = createDemoData();
  const { token } = await api.login({ login: "demo", senha: "merenda-demo" });
  expect((await api.listar(token)).map((s) => s.id)).toEqual([103, 102, 101]);
  expect(await api.detalhar(token, 101)).toMatchObject({
    status: "COMPLETO",
    totalKg: 5,
  });
  expect(await api.detalhar(token, 102)).toMatchObject({
    status: "PENDENTE",
    totalKg: 3,
    pesagens: { RESTO_PRATO: null },
  });
  expect(await api.detalhar(token, 103)).toMatchObject({
    status: "COMPLETO",
    totalKg: 0,
    pesagens: { RESTO_PRATO: { pesoLiquidoKg: 0 } },
  });
});

test("consulta exige sessão e serviço inexistente tem erro explícito", async () => {
  const api = createDemoData();
  await expect(api.listar("")).rejects.toMatchObject({
    codigo: "NAO_AUTORIZADO",
  });
  await expect(api.detalhar("inventado", 101)).rejects.toMatchObject({
    codigo: "NAO_AUTORIZADO",
  });
  const { token } = await api.login({ login: "demo", senha: "merenda-demo" });
  await expect(api.detalhar(token, 999)).rejects.toMatchObject({
    codigo: "SERVICO_NAO_ENCONTRADO",
  });
});

test("respostas não permitem alterar os exemplos e lista vazia é válida", async () => {
  const api = createDemoData();
  const { token } = await api.login({ login: "demo", senha: "merenda-demo" });
  const rows = await api.listar(token);
  rows[0].pesagens.RESTO_PRATO!.pesoLiquidoKg = 99;
  expect(
    (await api.detalhar(token, 103)).pesagens.RESTO_PRATO!.pesoLiquidoKg,
  ).toBe(0);
  const empty = createDemoData([]);
  const session = await empty.login({ login: "demo", senha: "merenda-demo" });
  expect(await empty.listar(session.token)).toEqual([]);
});
