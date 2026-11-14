# 12 — Verificar e documentar a parte de Lucas

Status: ready-for-agent
Responsável: Lucas, com execução por subagentes na próxima sessão após aprovação da arquitetura
Blocked by: 09, 10 e 11 concluídos e verificados

## Comportamento esperado

Consolidar a entrega de Lucas com verificação real, evidências acadêmicas e documentação que explique o que foi feito, como executar e o que e como testar.

Referências: [especificação](../spec.md), [contrato provisório](../api-contract.md), [planejamento do app](../app-planning.md) e [divisão aprovada](../lucas-delivery-proposal.md).

## Critérios de aceite

- [ ] Verificar os quatro fluxos/telas, legibilidade, navegação, estados e feedback em web e mobile. Não declarar mobile testado somente por funcionar no navegador.
- [ ] Plano com pelo menos oito casos, incluindo erros; pelo menos cinco executados com evidência individual real.
- [ ] Se algum ambiente não puder ser testado, documentar o bloqueio e o que Lucas deve testar; não marcar como executado nem concluir um critério obrigatório sem evidência.
- [ ] READMEs de mobile e IoT com pré-requisitos, execução, credenciais fictícias de demonstração, cenários e testes; nenhum segredo real.
- [ ] Relatório em português explicando o que foi implementado, decisões, limitações, dados simulados, arquivos relevantes e verificações executadas. Material aproveitável no PDF final do grupo, sem fingir que já contém os entregáveis do colega.
- [ ] Guia de teste manual com passos, entradas, resultado esperado e indicação do que já foi verificado versus o que Lucas ainda deve verificar.
- [ ] Roteiro curto da parte de Lucas para o pitch, respeitando que os três minutos pertencem ao vídeo do grupo inteiro.
- [ ] Explicar onde conectar a API real depois da revisão do colega. A ausência dela não impede concluir a entrega simulada, que é permitida pelo enunciado.

## Dependências e limites

A divisão em quatro entregas foi aprovada por Lucas em 14/11/2026. A arquitetura e as poucas definições pendentes serão fechadas na próxima sessão antes de código. Os bloqueadores continuam valendo mesmo quando o status é `ready-for-agent`. Não concluir apenas pelo relato de um subagente: verificar o comportamento e as evidências.

Banco, API real e segurança do backend pertencem ao colega. A versão com dados simulados pode ser concluída sem eles, mas não pode ser apresentada como integração ou segurança real verificadas. Preservar os tickets amplos anteriores como referência de escopo; não marcá-los como implementados apenas por publicar estes arquivos.

## Comentários

### 14/11/2026

Ticket publicado após Lucas aprovar a granularidade das quatro entregas. Ainda sem implementação. Orquestração e modelos a configurar na outra sessão conforme o [roteiro de execução](../../../docs/execucao-lucas.md).
