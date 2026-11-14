# 10 — Registrar descarte com RFID e balança simulados

Status: ready-for-agent
Responsável: Lucas, com execução por subagentes na próxima sessão após aprovação da arquitetura
Blocked by: 09 — Entrar e consultar serviços de exemplo

## Comportamento esperado

Criar ou continuar um serviço, simular RFID e peso, conferir a prévia e confirmar as duas categorias, vendo o resultado no histórico e nos detalhes. Incluir demonstração independente da IoT.

Referências: [especificação](../spec.md), [contrato provisório](../api-contract.md), [planejamento do app](../app-planning.md) e [divisão aprovada](../lucas-delivery-proposal.md).

## Critérios de aceite

- [ ] Completar a tela de registro sem criar telas extras de gerenciamento.
- [ ] Identificar automaticamente pelo RFID; o funcionário não escolhe a categoria manualmente. Controles de cenário são explicitamente de demonstração.
- [ ] Simulador independente produz código/peso; consumidor simulado faz associação, cálculo e validação, sem substituir a API real do colega ou fingir que ela já existe.
- [ ] Demonstração independente da IoT e uso dos mesmos cenários na tela, sem fila/broker/hardware ou infraestrutura adicional.
- [ ] Prévia não altera pesos confirmados; confirmação atualiza dados do serviço.
- [ ] Rejeitar etiqueta desconhecida e bruto menor que tara; aceitar zero válido; diferenciar pendência de ausência de descarte.
- [ ] Confirmar duas categorias, mostrar totais e impedir serviço duplicado por data/tipo.
- [ ] Documentar e verificar os cenários desta entrega, sem esperar 12 para testar.

## Dependências e limites

A divisão em quatro entregas foi aprovada por Lucas em 14/11/2026. A arquitetura e as poucas definições pendentes serão fechadas na próxima sessão antes de código. Os bloqueadores continuam valendo mesmo quando o status é `ready-for-agent`. Não concluir apenas pelo relato de um subagente: verificar o comportamento e as evidências.

Banco, API real e segurança do backend pertencem ao colega. A versão com dados simulados pode ser concluída sem eles, mas não pode ser apresentada como integração ou segurança real verificadas. Preservar os tickets amplos anteriores como referência de escopo; não marcá-los como implementados apenas por publicar estes arquivos.

## Comentários

### 14/11/2026

Ticket publicado após Lucas aprovar a granularidade das quatro entregas. Ainda sem implementação. Orquestração e modelos a configurar na outra sessão conforme o [roteiro de execução](../../../docs/execucao-lucas.md).
