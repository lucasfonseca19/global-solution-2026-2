# 09 — Entrar e consultar serviços de exemplo

Status: needs-info
Responsável: Lucas, com execução por subagentes na próxima sessão após aprovação da arquitetura
Blocked by: arquitetura mínima aprovada, definições remanescentes do app e acordo sobre como verificar o comportamento

## Comportamento esperado

Entrar no app demonstrativo e consultar histórico e detalhes de serviços de exemplo em uma aplicação executável localmente, sem exigir API pronta.

Referências: [especificação](../spec.md), [contrato provisório](../api-contract.md), [planejamento do app](../app-planning.md) e [divisão aprovada](../lucas-delivery-proposal.md).

## Critérios de aceite

- [ ] App com quatro telas previstas, implementando nesta entrega login, histórico e detalhes de exemplos; a tela de registro será implementada em 10, sem controles visíveis que prometam funcionalidade inexistente nesta etapa.
- [ ] Comandos reais documentados e repetíveis; execução local web e caminho de demonstração mobile verificados na entrega final.
- [ ] Login demonstrativo com sucesso/erro, explicitamente distinguido de segurança/autenticação do backend.
- [ ] Histórico e detalhes usam camada de acesso a dados baseada no contrato provisório; UI não depende de servidor real.
- [ ] Hierarquia visual simples e legível; direção proposta em [pesagem-proposta.md](../../../docs/pesagem-proposta.md) ainda precisa de revisão para o registro em 10.
- [ ] Verificações de comportamento e instruções de teste desta entrega registradas já em 09.

## Dependências e limites

A divisão em quatro entregas foi aprovada por Lucas em 14/11/2026. A arquitetura e as poucas definições pendentes serão fechadas na próxima sessão antes de código. Os bloqueadores continuam valendo mesmo quando o status é `ready-for-agent`. Não concluir apenas pelo relato de um subagente: verificar o comportamento e as evidências.

Banco, API real e segurança do backend pertencem ao colega. A versão com dados simulados pode ser concluída sem eles, mas não pode ser apresentada como integração ou segurança real verificadas. Preservar os tickets amplos anteriores como referência de escopo; não marcá-los como implementados apenas por publicar estes arquivos.

## Comentários

### 14/11/2026

Ticket publicado após Lucas aprovar a granularidade das quatro entregas. Ainda sem implementação. Orquestração e modelos a configurar na outra sessão conforme o [roteiro de execução](../../../docs/execucao-lucas.md).
