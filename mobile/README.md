# Merenda — app demonstrativo (tickets 09 e 10)

Expo SDK 58, React Native, TypeScript e React Navigation com stack nativa. Login, histórico, registro e detalhes funcionam com dados fictícios locais. Sem backend, banco ou autenticação real.

## Executar

Pré-requisito: Node.js LTS compatível com Expo (ambiente verificado: Node 22.17.1 e npm 10.9.2).

```sh
cd mobile
npm ci
npm run web
```

Abrir o endereço indicado pelo Expo. Login fictício: `demo`; senha fictícia: `merenda-demo`. A senha aparece no código porque é uma comparação demonstrativa pública, não uma conta segura. Não usar dados pessoais. Nenhuma credencial ou sessão é persistida. Recarregar encerra a sessão. Sair recria o adaptador em memória.

Para celular/simulador: `npm start`, usando um cliente compatível com SDK 58; `npm run ios` abre o simulador e `npm run android` usa emulador/dispositivo Android configurado. A documentação Expo consultada em 14/11/2026 informa transição do Expo Go físico para SDK 58; conferir a compatibilidade do cliente antes de testar. Estes caminhos nativos ainda não foram executados nesta entrega; a comprovação nativa pertence à verificação final.

## Verificar

```sh
npm test
npm run typecheck
npm run build:web
npm run test:e2e
```

Os testes usam Google Chrome instalado (`channel: chrome`), com perfil isolado; instalar Chrome antes de executar. Playwright inicia e encerra seu próprio Expo na porta 8091. Fechar qualquer processo que já use essa porta. Testes Vitest observam o adaptador público, sem React Native ou servidor; testes Playwright percorrem a interface web real. Relatório JSON, traces em falhas e capturas ficam em `test-results/` (ignorado). Logs e relatório do ticket: [evidências 09](../docs/evidencias/09/README.md).

## Organização e continuidade

- `src/data/types.ts`: formatos do contrato provisório e interface assíncrona de leitura.
- `src/data/demo.ts`: login/listagem/detalhe em memória, respostas independentes dos exemplos e erros com código/mensagem.
- `src/data/fixtures.ts`: completo 5 kg, pendente 3 kg e zero confirmado.
- `App.tsx`: stack e telas; estado React, carregamento, erro, repetição e lista vazia. Datas são formatadas sem conversão de fuso; total parcial vem do adaptador.
- `src/data/adapter.test.ts` e `e2e/consulta.spec.ts`: verificações de comportamento.

Registro está em `src/Registro.tsx`; componentes visuais compartilhados estão em `src/ui.tsx`. A leitura e o cálculo puros são compartilhados com `../iot/shared.ts`; Metro observa essa pasta sem monorepo. Em 11, implementar persistência e restauração conforme a arquitetura. Não existem operações falsas ou botões de registro antecipados. O contrato ainda deve ser revisado com o colega antes da integração.

Aplicadas as regras pertinentes da skill React Native: stack nativa, Pressable, texto em Text, StyleSheet, scroll com ajuste nativo e estado mínimo. Lista de três exemplos não exige FlashList. Interface Craft orientou hierarquia, espaçamento, feedback e consistência; nenhuma animação ou dependência de ajuste visual foi adicionada. Revisão estrutural: tarefa rotineira de consulta, uma coluna limitada a 640 px, alvos de 48 px e status escrito além da cor; validação visual e nativa ainda devem compor a revisão final.

Documentação oficial consultada: [Expo](https://docs.expo.dev/get-started/create-a-project/), [stack nativa](https://reactnavigation.org/docs/native-stack-navigator/), [fluxo de autenticação](https://reactnavigation.org/docs/auth-flow/), [TextInput](https://reactnative.dev/docs/textinput), [Vitest](https://vitest.dev/guide/) e [Playwright webServer](https://playwright.dev/docs/test-webserver).

## Uso de IA

Codex auxiliou a implementação, testes e documentação. Lucas deve revisar e compreender o código antes da entrega acadêmica. Este ticket não comprova a rubrica de senha em hash ou segurança da API; essas responsabilidades permanecem no backend do colega.

## Registrar (ticket 10)

Entrar → Registrar descarte → informar data em AAAA-MM-DD e tipo → Procurar serviço → Abrir simulação. Simular a cozinha mostra 3 kg, sem gravar; Confirmar cria o serviço pendente. Simular os pratos e confirmar conclui 5 kg. Procurar novamente a mesma data/tipo continua o serviço. Zero confirma ausência de descarte; erros invalidam a leitura. Nova confirmação substitui a categoria e envia ambas no PUT.

Sem persistência: recarregar ou sair perde as alterações (ticket 11). CLI e instruções em [IoT](../iot/README.md). Evidências em [ticket 10](../docs/evidencias/10/README.md). Nenhuma execução iOS foi feita neste ticket.
