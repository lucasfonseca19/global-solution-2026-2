# Merenda — app de pesagem

App React Native com Expo, cinco telas na interface aprovada e suporte web local. Login, consulta, registro, simulação, correção, exclusão e restauração de dados de exemplo funcionam com dados fictícios locais. Não há API, banco, autenticação ou segurança reais. O contrato em `.scratch/merenda/api-contract.md` é provisório para integração.

## App atual: vazio e com sensores separados

A interface aprovada abre por padrão, sem exemplos históricos, botões de simulação, restauração de fixtures ou toolbar de teste. Instalação nova começa vazia; as pesagens confirmadas são persistidas em uma chave própria, sem importar ou apagar os dados da versão anterior.

Em um terminal, na raiz do repositório:

```sh
node --experimental-strip-types iot/bridge.mjs
```

Abra o simulador em `http://127.0.0.1:8095`. Em outro terminal:

```sh
npm ci
npm run web -- --port 8094
```

Abra o app em `http://localhost:8094`. Login de demonstração: `demo` / `merenda-demo`. Entre na refeição e aguarde “Balança conectada”; no painel separado, escolha a leitura e toque em “Colocar na balança”. O app identifica, calcula, anima e permite confirmar manualmente. A ponte é um simulador local, não substitui a API/banco/segurança exigidos pelo enunciado.

A sessão termina ao recarregar, mas as pesagens confirmadas permanecem. O Histórico começa sem pontos fictícios e cresce com os registros. Use o [guia de execução e gravação](../docs/guia-simulador-gravacao.md) e veja as [evidências atuais](../docs/evidencias/separate-simulator/README.md). Não há necessidade da flag de prévia; `EXPO_PUBLIC_LEGACY_APP=1` abre explicitamente o cliente anterior.

## Versões registradas

Ambiente das evidências: Node 22.17.1 e npm 10.9.2. `npm ci` instala as versões exatas registradas em `package-lock.json` (lockfile v3). Versões principais travadas no manifesto/lockfile:

| Pacote | Versão |
| --- | --- |
| Expo | 58.0.25 |
| React | 19.3.0 |
| React Native | 0.88.1 |
| React Navigation native stack | 7.21.0 |
| AsyncStorage | 2.2.0 |
| TypeScript | 6.0.3 |
| Vitest | 5.1.0 |
| Playwright | 1.65.1 |

AsyncStorage 2.2.0 foi ajustado com `expo install` para compatibilidade com SDK 58.

## Registro anterior: cliente legado

A partir da raiz do repositório:

```sh
cd mobile
npm ci
EXPO_PUBLIC_LEGACY_APP=1 npm run web
```

Abra o endereço informado pelo Expo. Credenciais públicas de demonstração: usuário `demo`, senha `merenda-demo`. Não use dados pessoais. A senha é comparação fictícia no app; não é uma conta ou controle de segurança. Google Chrome já instalado foi usado nos fluxos Playwright; não é preciso baixar navegador para iniciar ou usar o app manualmente.

## Telas e persistência

- **Login:** entra com as credenciais de demonstração. A sessão não sobrevive ao reload.
- **Histórico:** mostra serviços e totais; permite iniciar registro e restaurar exemplos após confirmação.
- **Registro:** procura por data e tipo, simula leitura, mostra prévia sem gravar e confirma o peso líquido. RFID define automaticamente categoria e tara.
- **Detalhes:** mostra categorias, pendências e total; permite corrigir pesagens e excluir o serviço após confirmação.

Serviços são persistidos na chave `merenda.servicos.v1` (localStorage na web e AsyncStorage no nativo). A prévia e a sessão ficam em memória. Recarregar retorna ao login, sem apagar os serviços. Sair também preserva serviços. Restaurar exemplos substitui os registros locais pelos três exemplos iniciais; excluir remove o serviço e suas pesagens, sem recuperação. A lista vazia também é persistida.

## Comandos de verificação registrados

Após `npm ci`, os comandos que produziram as evidências foram:

```sh
npm test
npm run typecheck
npm run test:e2e
npm run build:web
```

Playwright usa `channel: chrome`, com perfil isolado, e inicia o Expo na porta 8091. Os fluxos percorrem a aplicação web. Vitest testa o adaptador, incluindo armazenamento injetado. Execute esses comandos para reproduzir as verificações; resultados históricos e cenários estão nos READMEs de [ticket 09](../docs/evidencias/09/README.md), [ticket 10](../docs/evidencias/10/README.md) e [ticket 11](../docs/evidencias/11/README.md). A conferência final após `npm ci` passou com 15 testes do adaptador e cinco fluxos web; veja [evidências finais](../docs/evidencias/12/README.md). O build web não prova execução nativa.

Para tentar execução nativa em ambiente disponível: `npm start` e abra no cliente Expo compatível com SDK 58; ou use `npm run ios` / `npm run android` com as ferramentas e dispositivos configurados. A execução nativa desta entrega permanece pendente por `ENOSPC` ao instalar Expo Go; veja [mobile-impedimento.txt](../docs/evidencias/12/mobile-impedimento.txt). O bundle iOS registrado foi compilado/exportado, mas o app não iniciou no simulador. TMPDIR no SSD foi apenas contorno local de espaço e não é necessário nos passos padrão.

## Dados de auditoria e limites

As verificações registraram três alertas moderados transitivos em dependências ligadas a Expo, `@expo/fingerprint` e `minimatch`. Não foi forçada atualização incompatível do SDK. Login, dados, RFID e balança são demonstrativos; sem backend, API, banco ou segurança real. A integração exige revisão do contrato com o colega.

Estrutura: `src/data/` contém tipos, adaptador, fixtures e testes; `src/` contém telas e UI; `../iot/shared.ts` fornece cenários e cálculo compartilhados. Veja o [guia passo a passo](../docs/guia-testes-lucas.md) e o [plano de testes](../docs/plano-testes-lucas.md) para separar evidência automatizada e checagens manuais pendentes.
