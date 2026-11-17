# Continuidade: redesenho da pesagem

Para a próxima sessão de backend: [passagem atual para integração](../continuidade-integracao.md).

## Estado atual: app limpo e ponte de sensores

Lucas confirmou separar a operação do app da demonstração dos sensores. O app aprovado agora é padrão, sem exemplos iniciais ou interfaces de teste e com persistência dedicada; legado fica em `EXPO_PUBLIC_LEGACY_APP=1`. Simulador em `iot/bridge.mjs` + `iot/simulator.html` envia RFID/bruto para o consumidor do app. A escuta web permanece durante troca de abas; apenas a tela ativa de pesagem, em ciclo aguardando, aceita uma leitura nova. Cursor inicial/reconexão ignora leituras antigas. Não reiniciar a partir das instruções de prévia em memória abaixo.

Ler [guia atual](../guia-simulador-gravacao.md) e [evidências](../evidencias/separate-simulator/README.md). Home/Histórico/Allo e dados anteriores preservados. Sem push; backend acadêmico, banco, segurança e runtime nativo ainda pendentes.

## Atualização da worktree — 17/11/2026, após aprovação do protótipo 03

O redesenho foi autorizado e aplicado na prévia React Native desta worktree. As observações abaixo sobre o modelo antigo passam a ser histórico da sessão anterior. O novo fluxo tem pesagens individuais, ciclo explícito/idempotente, conclusão manual com ambas categorias (zero válido), correção individual mantendo concluído, régua sincronizada com peso e RFID/tipo discretos. A restrição temporal foi preservada. Sem push.

Ler primeiro [cobertura do enunciado](cobertura-enunciado-pesagem.md), [evidências atuais](../evidencias/weighing-redesign/README.md) e [plano da rodada](../../.scratch/merenda/redesenho-pesagem/plano.md). A interface ainda exige `EXPO_PUBLIC_DESIGN_PREVIEW=1` e usa dados em memória; app original/contrato legado permanecem separados. Backend/banco/segurança e execução nativa continuam sem comprovação nesta worktree.

## Registro anterior


Estado conferido em 17/11/2026. Este arquivo prepara uma nova sessão; não autoriza implementação adicional por si só.

## Onde trabalhar

- Checkout principal/documentação: `/Users/lucas/FIAP/global-solution-2026-2`.
- **Código da prévia aprovada:** `/Users/lucas/.t3/worktrees/global-solution-2026-2/t3-5b5fb2b8`.
- Branch da prévia: `t3/rnr-weighing-preview`; base `020be11`. Existem muitas alterações locais e arquivos ainda não rastreados. São trabalho do usuário: preservar tudo, conferir status e não resetar, limpar ou substituir o checkout.
- Não começar uma nova implementação a partir de main/origin ignorando essa worktree: Home, Histórico, Allo e outras mudanças ainda estão nos arquivos locais da prévia.
- Servidor verificado na porta 8094 nesta conferência. Para iniciar quando necessário, no diretório `mobile` da worktree:

```sh
EXPO_PUBLIC_DESIGN_PREVIEW=1 npm run web -- --port 8094
```

A flag seleciona `DesignPreview`; sem ela, o app abre a versão original, visualmente diferente. Não confundir bundle/export com execução nativa.

## Escopo da próxima conversa

Lucas quer tratar **somente da tela e do fluxo de pesagem**, preservando a Home e o Histórico aprovados. Primeiro entender a implementação e resolver com ele as poucas pendências reais, depois propor um desenho sucinto/protótipo. Aguardar aprovação do desenho antes de alterar o app. Não ampliar o MVP acadêmico.

**Nunca dar push sem aprovação de Lucas.** Não abrir PRs/Issues ou enviar mensagens a terceiros sem instrução. Não integrar backend por iniciativa própria nesta etapa. Lucas informou que agora é responsável também por mudanças no backend; a divisão antiga com o colega em AGENTS/contexto não deve ser interpretada como veto permanente do usuário.

## O que foi aprovado e já está aplicado

- Identidade branca/roxa, fonte Allo 1.0.1. Tipografia centralizada em `mobile/src/typography.tsx`, WOFF2 web e TTF nativo. Ler `docs/ux/tipografia-allo.md` na worktree.
- Home: dia/data em linha, refeições, estados distintos e ações Pesar/Continuar pesagem/Ver resultado; navegação Hoje/Histórico.
- Histórico: refeição e 7/30 dias, gráfico de evolução, média por serviço concluído, chip de alta/queda e cálculo recolhido. Sete datas DD/MM na visão de 7 dias; três em 30 dias. Pontos desenhados à frente dos segmentos. Não redesenhar essas telas sem necessidade e autorização.
- Novas pesagens, correções e exclusões **somente no dia local atual**. Data sem edição. Outros dias são somente consulta, inclusive incompletos. O adaptador valida data original e payload; a interface acompanha meia-noite e retorno ao app. Preservar essa proteção ao redesenhar.
- Balança + RFID simulados. RFID reconhece lixeira/categoria/tara, peso bruto menos tara calcula alimento; o operador confere e confirma. Prévia não salva automaticamente. Nada de campo para digitar livremente o peso.
- Dados simulados e identificados como tal. A prévia tem exemplos históricos determinísticos em memória; não são medições reais nem integração com a API.

## Regra aprovada que ainda falta implementar

Ler a ADR **do checkout principal**: `/Users/lucas/FIAP/global-solution-2026-2/docs/adr/0001-pesagens-individuais-conclusao-explicita.md`.

A refeição/serviço deve aceitar várias pesagens individuais, inclusive da mesma categoria, somando-as. O operador deve concluir explicitamente o serviço; duas categorias preenchidas não identificam a última lixeira. Corrigir um registro substitui somente aquela contribuição.

**O código atual ainda usa o modelo antigo:** uma pesagem por categoria, substituição dessa categoria e conclusão automática ao confirmar ambas. `ServiceSummary`, `Servico.pesagens`, o adaptador e os testes refletem esse modelo. Não dizer que o redesenho funcional já está pronto. Separar uma exploração visual das mudanças de dados necessárias.

Pendências específicas: identidade de cada pesagem e duplicação de leituras, critério de conclusão quando falta categoria/zero/uma prévia não confirmada, e correção depois de concluir no mesmo dia. Não reabrir o bloqueio de outros dias. Configuração das refeições fica para o futuro. Múltiplas lixeiras não implicam múltiplas balanças simultâneas.

## Arquivos para ler

1. `AGENTS.md`, `CONTEXTO.md`, `ENUNCIADO.md`, `GLOSSARY.md` e `.scratch/merenda/spec.md` no checkout principal, observando as revisões de domínio mais recentes.
2. ADR 0001 acima e ADR 0002 (`docs/adr/0002-pesagens-somente-no-dia-atual.md`, presente nos dois checkouts).
3. Na worktree: `mobile/src/DesignPreview.tsx`, `preview/PreviewRegistro.tsx`, `WeightMotion.tsx`, `preview/PreviewUi.tsx`, `data/types.ts`, `data/demo.ts`, `data/serviceDay.ts`, `useServiceDay.ts` e `iot/shared.ts` na raiz. Os caminhos abreviados depois do primeiro pertencem a `mobile/src`, exceto a IoT.
4. Evidências na worktree: `docs/evidencias/current-day/README.md`, `history-preview/README.md` e `home-preview/README.md` (os dois últimos também dentro de `docs/evidencias`).

## Skills e execução

- Obrigatória para desenvolvimento RN/Expo: `vercel-react-native-skills`; ler também `docs/agents/mobile.md`.
- Interface Craft e Impeccable para simplificação, hierarquia e acabamento. Preservar Allo e a linguagem já aprovada. Se não estiverem no catálogo da próxima sessão, localizar os SKILL.md antes de afirmar indisponibilidade.
- Fluxo Matt Pocock disponível em `/Users/lucas/FIAP/.agents/skills/{grill-with-docs,to-spec,to-tickets}/SKILL.md`: esclarecer somente pendências, definir como verificar e trabalhar em entregas pequenas.
- Subagentes foram autorizados, mas não exigem uma equipe para cada ajuste. Se necessários, evitar edições concorrentes nos mesmos arquivos. Preferências do usuário: sol/high para arquitetura/revisão, sol/medium para implementação, luna/high para documentação; confirmar disponibilidade e informar substituições.

## Evidência e limites

Última rodada registrada: TypeScript passou; 27 testes de unidade e seis testes Playwright da versão original passaram. QA da prévia cobriu Home, Histórico e a restrição temporal, inclusive uma prévia pronta bloqueada após meia-noite e uma nova pesagem na nova data. Esses são resultados anteriores, não testes executados pela nova sessão.

Comandos no diretório `mobile` da worktree: `npm run typecheck`, `npm test`, `npm run test:e2e` (inicia servidor próprio em 8091), `node home-qa.cjs`, `node history-qa.cjs`, `node current-day-qa.cjs` (estes usam 8094 ativo).

Backend real não integrado nem alterado nesta rodada; deverá aplicar a restrição temporal no servidor com data/fuso confiáveis. Bundle iOS exportado, execução nativa ainda não validada. Não apresentar a prévia como entrega acadêmica inteira concluída.
