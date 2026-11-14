# 11 — Corrigir, excluir e repetir a demonstração

Status: ready-for-agent
Responsável: Lucas, com execução por subagentes na próxima sessão após aprovação da arquitetura
Blocked by: 10 — Registrar descarte

## Comportamento esperado

Corrigir e excluir registros com segurança e preparar a repetição da demonstração, de acordo com a política de dados definida com Lucas.

Referências: [especificação](../spec.md), [contrato provisório](../api-contract.md), [planejamento do app](../app-planning.md) e [divisão aprovada](../lucas-delivery-proposal.md).

## Critérios de aceite

- [ ] Nova confirmação da mesma categoria substitui o valor anterior e atualiza totais, sem duplicar.
- [ ] Excluir pede confirmação; cancelar preserva dados; confirmar remove serviço e pesagens, preservando os demais serviços.
- [ ] Implementar a política de duração dos dados escolhida por Lucas; não presumir que persistência ao reiniciar já foi aprovada.
- [ ] Restaurar dados de exemplo é uma proposta a revisar junto dessa política, sem criar uma tela de configurações.
- [ ] Documentar e verificar correção, exclusão e repetição dos cenários.

## Dependências e limites

A divisão em quatro entregas foi aprovada por Lucas em 14/11/2026. A arquitetura e as poucas definições pendentes serão fechadas na próxima sessão antes de código. Os bloqueadores continuam valendo mesmo quando o status é `ready-for-agent`. Não concluir apenas pelo relato de um subagente: verificar o comportamento e as evidências.

Banco, API real e segurança do backend pertencem ao colega. A versão com dados simulados pode ser concluída sem eles, mas não pode ser apresentada como integração ou segurança real verificadas. Preservar os tickets amplos anteriores como referência de escopo; não marcá-los como implementados apenas por publicar estes arquivos.

## Comentários

### 14/11/2026

Ticket publicado após Lucas aprovar a granularidade das quatro entregas. Ainda sem implementação. Orquestração e modelos a configurar na outra sessão conforme o [roteiro de execução](../../../docs/execucao-lucas.md).

### 14/11/2026 — Execução autorizada

Arquitetura, política de dados e fronteiras de testes aprovadas por Lucas nesta sessão. Ver spec.md e execution-plan.md. Dependências entre tickets permanecem.
