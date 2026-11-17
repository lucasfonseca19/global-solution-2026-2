# Redesenho da pesagem — 17/11/2026

Implementação autorizada por Lucas após aprovação do protótipo 03. Worktree `t3-5b5fb2b8`, sem commit/push/PR. Alterações locais anteriores preservadas; backup dos quatro arquivos de código existentes tocados inicialmente em `/tmp/merenda-before-weighing-20261117`. Home, Histórico, Allo e navegação principal mantidos.

## Fluxo implementado

- Uma leitura passa por identificação, pesagem animada e estabilização. Régua e número usam o mesmo valor; o indicador roxo fica fixo. RFID e tipo aparecem discretamente após identificar. Sem desenho de balança/lixeira.
- Bruto/tara e lista individual são recolhidos. Confirmação é manual; “Nova pesagem” inicia outro ciclo; descartar preserva o confirmado.
- Cada registro tem ID. O adaptador serializa operações, valida as leituras novamente e lembra os ciclos confirmados para não duplicar uma contribuição. Várias pesagens da mesma categoria somam.
- Conclusão explícita exige as duas categorias; zero confirmado é válido, ausência não é zero. Prévia pendente bloqueia a conclusão na UI.
- Correção seleciona um registro e a mesma lixeira; substitui só essa contribuição, recalcula totais e preserva o estado concluído. Serviços concluídos não recebem novos registros sem seleção de correção.
- Somente o dia atual permite gravar/corrigir/excluir. Outros dias são consulta, incluindo a virada do dia com leitura aberta. A saída com leitura pendente oferece descarte. Sem backend real, a referência temporal continua sendo o dispositivo.

## Verificação desta rodada

| Verificação | Resultado e evidência |
| --- | --- |
| Unidade | 32 testes em seis arquivos passaram: [log individual](unit.txt). Cinco novos testes cobrem soma/ciclos/conclusão/correção/validação/atomicidade e recarga. Foram observados falhando antes da implementação por ausência das novas operações. |
| TypeScript | Passou: [log](typecheck.txt). |
| CLI independente | Dois testes passaram: [log](cli.txt). |
| UI da prévia | Roteiro `mobile/weighing-qa.cjs`, Chrome na porta 8094: [resultado por cenário](qa.json), [log](web.txt). Inclui erros RFID/tara, identificação/estabilização, confirmação, repetição, vários registros, conclusão explícita, correção concluída, zero, cancelamento/retentativa, saída protegida, exclusão, Home/Histórico, consulta histórica e meia-noite. |
| Regressão do app original | `npm run test:e2e`: seis fluxos passaram nesta rodada; [resumo individual](legacy-e2e.json), extraído do relatório JSON em `mobile/test-results/results.json` (ignorado pelo Git). Essa execução usa servidor próprio em 8091, sem a flag. |
| iOS | Bundle da interface aprovada exportado; [log](ios-export.txt). Não houve execução em simulador/dispositivo. |

Uma revisão independente encontrou cancelamento da identificação sem liberar a operação e saída parcialmente bloqueada após meia-noite. Ambos foram corrigidos e os cenários foram incluídos na verificação web. O teste de cancelamento foi observado falhando antes da correção.

Capturas reais: [aguardando](aguardando.png), [peso estável](peso-estavel.png), [concluído](concluido.png), [correção individual](correcao-individual.png), [Home preservada](home-preservada.png), [Histórico preservado](historico-preservado.png), [320 px](mobile-320.png), [1280 px](desktop-1280.png). Sem erro de página no roteiro. Layout, fontes e acessibilidade nativos ainda precisam de conferência em runtime.

## Reproduzir

No diretório `mobile`:

```sh
EXPO_PUBLIC_DESIGN_PREVIEW=1 npm run web -- --port 8094
```

Em outro terminal, também em `mobile`:

```sh
npm run typecheck
npm test -- --reporter=verbose
node weighing-qa.cjs
npm run test:e2e
```

Na raiz: `node --test iot/cli.test.mjs`.

Login `demo`, senha `merenda-demo`. O roteiro web usa relógio controlado em 17/11 e verifica a mudança para 18/11. A prévia usa exemplos em memória; reload descarta suas alterações. O adaptador também suporta armazenamento injetado e sua atomicidade/recarga são testadas em unidade, mas isso não torna a prévia persistente. Não trocar essas evidências.

## Limites e compatibilidade

`Servico.registros` guarda contribuições individuais; `Servico.pesagens` mantém a projeção de totais por categoria para as telas existentes. Exemplos antigos são lidos como uma contribuição por categoria; as novas operações preservam o status dos exemplos. Detalhes mostra os registros individuais, evitando atribuir a tara agregada a uma única pesagem.

O contrato original `criar/atualizar` e o app original permanecem com a semântica anterior, separados da nova tela selecionada pela flag. As operações `confirmarPesagem/concluirServico` são locais: não são endpoints HTTP nem contrato de backend acordado. A implementação real deve alinhar identidade, idempotência, concorrência e data/fuso no servidor.

Conferência acadêmica completa: [cobertura e pendências](../../ux/cobertura-enunciado-pesagem.md). Não houve integração, implementação de banco/API/segurança, publicação ou preparação do ZIP nesta etapa.
