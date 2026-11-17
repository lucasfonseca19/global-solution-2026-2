# Pesagens somente no dia atual — 17/11/2026

Regra aprovada por Lucas e aplicada na worktree `t3-5b5fb2b8`. A confirmação específica sobre exclusão também foi incorporada: registros de outros dias ficam apenas para consulta.

## Alterações

- Data do registro definida pelo dia local atual e exibida como texto, sem campo editável, tanto na prévia quanto na versão original.
- Confirmação, correção e exclusão exigem a data atual no adaptador simulado. A atualização valida a data salva e a do payload, impedindo transformar um registro antigo em um de hoje. O erro é `DIA_ENCERRADO`; a operação não altera os dados.
- Histórico abre pendentes antigos nos detalhes. Somente pendentes de hoje permitem retomada. Linhas parciais antigas aparecem como `Incompleta`.
- Detalhes antigos não oferecem correção, continuidade nem exclusão. Acesso direto ao registro de outra data apresenta `Somente consulta`.
- A interface acompanha a meia-noite local e o retorno do app ao primeiro plano. Home e Histórico usam a mesma referência. Cada escrita também revalida o relógio, sem depender do estado visual.
- Pesagem aberta antes da meia-noite perde as ações de leitura e confirmação ao virar o dia. Ao voltar à Home, uma nova pesagem usa a nova data.
- Consultas e cálculos do Histórico preservados. Nenhuma dependência nova.

A regra usa o relógio local no simulador. O backend real não foi alterado: na integração, a mesma validação deve usar data e fuso confiáveis do servidor. A restauração explícita de exemplos permanece um controle separado de demonstração/teste, não uma operação da escola.

Decisão registrada em `docs/adr/0002-pesagens-somente-no-dia-atual.md`, com indicação de precedência na especificação e no contrato provisório. Documentação replicada no checkout principal para continuidade, sem integrar código ou fazer push.

## Evidências reais

- `npm test`: **27 testes passaram**, em cinco arquivos. Seis casos novos verificam dia local, operações permitidas hoje, criação no passado/futuro, correção e exclusão históricas, tentativa de mover histórico para hoje, mudança de data de um registro atual e bloqueio após meia-noite. Teste inicial executado antes da implementação falhou por ausência do módulo; a implementação passou depois.
- Testes existentes de escrita fixam o relógio em 15/11/2026. Os casos com dois serviços agora variam a refeição no mesmo dia, preservando a verificação de persistência e concorrência.
- `npm run test:e2e`: **6 testes passaram** na versão original, com servidor próprio em 8091 encerrado pelo Playwright. Cobrem consulta, login, correção/exclusão atuais, persistência, restauração, simulações e consulta histórica sem ações de escrita. Os roteiros usam relógio controlado; não tentam preencher uma data que deixou de ser editável.
- `node current-day-qa.cjs`: passou no Chrome contra a prévia 8094, com fuso America/Sao_Paulo. Verificou data fixa, histórico antigo sem ações de escrita, confirmação/retomada de hoje e prévia pronta bloqueada após meia-noite. Também verificou retorno à Home em 18/11 e nova pesagem na nova data. Nenhum `pageerror`. [Resultado](qa.json).
- `node home-qa.cjs` e `node history-qa.cjs`: regressões passaram após a introdução da regra temporal.
- `npm run typecheck`: passou.
- Exportação do bundle iOS concluída em `/tmp/merenda-current-day-ios-export`. Empacotamento não comprova execução nativa.

Capturas reais conferidas: [histórico somente consulta](historico-somente-consulta.png) e [virada do dia](virada-do-dia.png). O relatório dos seis testes da versão original fica em `mobile/test-results/results.json`, ignorado pelo Git.

## Como conferir

Servidor da prévia, no diretório `mobile` desta worktree:

```sh
EXPO_PUBLIC_DESIGN_PREVIEW=1 npm run web -- --port 8094
```

1. Entrar → Histórico → abrir o registro incompleto de 13/11. Conferir a mensagem de somente consulta e ausência de correção/exclusão.
2. Hoje → escolher uma refeição → Alterar serviço. A data de hoje aparece como texto, sem edição.
3. Continuar → Simular pesagem → colocar lixeira → Confirmar. A pesagem de hoje continua funcionando.
4. Voltar à Home → Histórico → refeição escolhida. O parcial de hoje permite continuar; parciais antigos abrem apenas detalhes.

Com servidor 8094 ativo, em outro terminal no mesmo diretório:

```sh
npm run typecheck
npm test
node current-day-qa.cjs
```

Para os seis fluxos da versão original, que iniciam seu próprio servidor em 8091:

```sh
npm run test:e2e
```

## Limites

App e adaptador simulados, sem alteração de backend real, merge ou push. Execução nativa ainda não validada. Conclusão explícita e múltiplas pesagens continuam pendentes da etapa própria; esta regra só restringe quando os registros existentes podem ser modificados.
