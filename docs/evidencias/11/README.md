# Ticket 11 — correção, exclusão e repetição

Executado em 14/11/2026 no checkout compartilhado, sem commit/push, backend ou banco. Fronteiras aprovadas: adaptador público com Vitest e interface web com Playwright/Chrome instalado. Interface Craft aplicado à hierarquia e feedback: substituição explícita, ações secundárias, confirmação textual e cancelamento, sem animação ou dependência visual nova. React Native: Pressable, Text, StyleSheet e stack existente.

## Resultados reais

- suite.txt: 15 testes aprovados em três arquivos.
- typecheck.txt: TypeScript sem erros.
- 09-fluxos-green.txt: quatro fluxos web aprovados, incluindo consulta e registro anteriores.
- build.txt: exportação web concluída em mobile/dist (ignorado).
- historico-restaurado.png: captura após restauração e recarga.

## Comportamentos verificados

| Fronteira | Verificação |
| --- | --- |
| Adaptador | Reabrir outra instância recupera serviços existentes antes dos exemplos. |
| Adaptador | Excluir remove somente alvo e pesagens; excluir o último preserva lista vazia ao reabrir. |
| Adaptador | Restaurar substitui alterações e persiste os exemplos. |
| Adaptador | Falha de escrita em criar/atualizar/excluir/restaurar rejeita sem publicar alteração; fila se recupera. |
| Adaptador | Escrita atrasada não resolve antes do disco; duas criações concorrentes não se perdem. |
| Adaptador | Falha de leitura rejeita carregamento e permite nova tentativa. |
| Adaptador (teste anterior mantido) | Correção para restos 2,5 kg preserva sobra 3 kg, total 5,5 kg e serviço único. |
| Web | Detalhes abre correção do mesmo serviço; atualizar restos para zero mantém sobra e total 3 kg; recarregar encerra sessão, mas conserva correção; sair conserva serviços. |
| Web | Cancelar exclusão preserva detalhes; confirmar remove alvo, mantendo outro serviço. |
| Web | Cancelar restauração preserva exclusão; confirmar recupera exemplos e recarregar conserva resultado. |
| Web (regressão) | Prévia, RFID desconhecido, peso abaixo da tara, continuidade, zero e consulta permanecem funcionais. |

## Ciclos e comandos

Logs 01/02: teste de reabertura vermelho antes da persistência e verde depois. 03/04: exclusão vermelha antes da operação e verde depois. 05/06: restauração vermelha antes da operação e verde depois. 07: verificações adicionais de falhas e fila sobre a persistência implementada. 08: fluxo vermelho por ausência do botão Corrigir pesagens. 09: fluxo completo verde após implementação. Na primeira execução completa, a contagem de textos também incluiu a tela anterior retida pela stack; o teste foi delimitado aos textos visíveis, mantendo a verificação de total e categoria.

Executar a partir da raiz:

```sh
mkdir -p /Volumes/ssd/Faculdade/merenda-ticket11-tmp
export TMPDIR=/Volumes/ssd/Faculdade/merenda-ticket11-tmp
npm test --prefix mobile
npm run typecheck --prefix mobile
npm run test:e2e --prefix mobile
npm run build:web --prefix mobile
```

Os testes web começam com armazenamento vazio em contexto isolado. Recargas dentro do mesmo teste preservam dados para verificar persistência; não há limpeza automática a cada navegação. Navegador já instalado, sem download. A nova dependência necessária é AsyncStorage; nenhuma biblioteca de estado ou infraestrutura adicional foi criada.

## Limites

iOS não executado por instrução do orquestrador: ENOSPC registrado previamente em [mobile-impedimento.txt](../12/mobile-impedimento.txt). A compatibilidade nativa do armazenamento vem do AsyncStorage, mas o fluxo nativo não está comprovado por estes testes web. Não foi executado o ticket 12. Persistência local demonstrativa, sem API real, segurança real ou coordenação de escrita entre múltiplas abas/instâncias simultâneas.

## Conferência do orquestrador

`orquestrador-tests.txt` registra 15 testes com nomes individuais; `orquestrador-web.txt` registra os quatro fluxos anteriores. AsyncStorage inicialmente instalado em versão 3.1.1 foi ajustado por `npx expo install @react-native-async-storage/async-storage` para 2.2.0, esperada pelo SDK58. `expo-check.txt`, `final-tests.txt`, `final-typecheck.txt`, `final-web.txt` e `final-build.txt` registram conferência após ajuste.

Revisão independente identificou que voltar a um formulário antigo poderia restaurar peso obsoleto da outra categoria. A navegação Registro → Detalhes usa replace para descartar o formulário. `review-navigation-red.txt` reproduz o retorno ao formulário anterior; `review-navigation-green.txt` registra cinco fluxos aprovados após correção, incluindo preservação do zero ao corrigir a cozinha. Quinze testes e typecheck passaram novamente após esse ajuste.
