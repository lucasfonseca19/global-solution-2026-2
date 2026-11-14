import { test, expect } from "@playwright/test";
test("login inválido, consulta, retorno e saída", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Login simulado")).toBeVisible();
  await page.getByLabel("Login", { exact: true }).fill("demo");
  await page.getByLabel("Senha", { exact: true }).fill("errada");
  await page.getByRole("button", { name: "Entrar na demonstração" }).click();
  await expect(page.getByText("Login ou senha inválidos.")).toBeVisible();
  await page.getByLabel("Senha", { exact: true }).fill("merenda-demo");
  await page.getByRole("button", { name: "Entrar na demonstração" }).click();
  await expect(page.getByRole("button", { name: /12\/11\/2026.*Total: 5,00 kg/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /13\/11\/2026.*Total parcial: 3,00 kg/ })).toBeVisible();
  await page.getByRole("button", { name: /12\/11\/2026/ }).click();
  await expect(page.getByText("Total do descarte monitorado")).toBeVisible();
  await expect(page.getByText("5,00 kg", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Voltar ao histórico" }).click();
  await page.getByRole("button", { name: /13\/11\/2026/ }).click();
  await expect(page.getByText("Aguardando pesagem")).toBeVisible();
  await expect(
    page.getByText("Total parcial do descarte monitorado"),
  ).toBeVisible();
  await page.getByRole("button", { name: "Voltar ao histórico" }).click();
  await page.getByRole("button", { name: /14\/11\/2026/ }).click();
  await expect(page.getByText("0,00 kg", { exact: true })).toHaveCount(3);
  await expect(page.getByText("Aguardando pesagem")).toHaveCount(0);
  await page.screenshot({
    path: "test-results/zero-confirmado.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Voltar ao histórico" }).click();
  await page.getByRole("button", { name: "Sair da demonstração" }).click();
  await expect(
    page.getByRole("button", { name: "Entrar na demonstração" }),
  ).toBeVisible();
});
test("desktop mantém conteúdo legível e recarregar encerra sessão", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  await page.getByLabel("Login", { exact: true }).fill("demo");
  await page.getByLabel("Senha", { exact: true }).fill("merenda-demo");
  await page.getByLabel("Senha", { exact: true }).press("Enter");
  await expect(
    page.getByRole("button", { name: /12\/11\/2026/ }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Registrar descarte" })).toBeVisible();
  await page.screenshot({
    path: "test-results/historico-desktop.png",
    fullPage: true,
  });
  await page.reload();
  await expect(page.getByText("Login simulado")).toBeVisible();
});
