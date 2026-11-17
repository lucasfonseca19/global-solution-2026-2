# 01 — Revisar o contrato e as escolhas do backend

Status: ready-for-human
Responsáveis: Lucas e colega
Blocked by: revisão e proposta do colega

## Comportamento esperado

Revisar o [contrato proposto](../api-contract.md) para conectar as partes, preservando o espaço de decisão do colega. A divisão entre Lucas (app e simulação) e colega (banco, API e segurança) foi aceita, segundo Lucas; isso não significa que o contrato foi revisado.

## Critérios de aceite

- [ ] Colega propõe linguagem de backend e banco dentro do conteúdo até a fase 4.
- [ ] Ambos alinham rotas, campos, autenticação e mensagens de erro das sete operações discutidas.
- [ ] Combinar PUT completo, criação de serviço sem pesagens e exibição de total parcial, ainda propostas no contrato.
- [ ] Combinar a forma mínima de conectar as leituras simuladas ao app/API.
- [ ] Exemplos de entrada/saída revisados e alterações registradas no contrato, sem duplicar regras em documentos divergentes.

## Dependências e limites

Este alinhamento é necessário para a integração. Não bloqueia o app com respostas simuladas, o simulador independente ou o planejamento dos testes. Nesses trabalhos, o contrato continua uma referência provisória; não declarar que foi aprovado pelo colega.

## Comentários

### 14/11/2026

Lucas informou que o colega aceitou a divisão, mas ainda não revisou os documentos nem propôs tecnologias. Não aguardar esta revisão para iniciar as entregas independentes de Lucas.

## Atualização de integração — 17/11/2026

Lucas aprovou importar e adequar a contribuição `51957f3`, preservando as ADRs atuais. Implementação técnica e verificações em [evidências de integração](../../../docs/evidencias/backend-integration/README.md) e [contrato vigente](../api-contract.md). Os critérios históricos de PUT completo por categoria/conclusão automática acima foram substituídos por contribuição individual, ciclo idempotente, correção por ID e conclusão explícita. API Java/Spring Boot e PostgreSQL foram mantidos. A equipe ainda deve revisar a alteração antes da entrega acadêmica; PDF/pitch e execução nativa permanecem separados. Não houve push.
