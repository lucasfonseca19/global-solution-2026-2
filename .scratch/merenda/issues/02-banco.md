# 02 — Entregar o banco mínimo

Status: ready-for-human
Responsável: colega
Blocked by: escolha de banco e modelo pelo colega

## Comportamento esperado

Sustentar o domínio da [especificação](../spec.md) com modelo relacional mínimo, carga inicial e consultas demonstráveis. Usuário, serviço, lixeira e pesagem são candidatos, não um esquema imposto ao colega.

## Critérios de aceite

- [ ] Pelo menos quatro entidades normalizadas, com diagrama contendo PK, FK e cardinalidades.
- [ ] SQL com tabelas, constraints e INSERTs de carga inicial, executado sem erro.
- [ ] Garantir serviço único por data/tipo e integridade das pesagens, sem duplicar o peso confirmado de uma categoria no serviço.
- [ ] Exclusão do serviço remove suas pesagens, preservando os demais serviços.
- [ ] Lixeiras e dados fictícios de demonstração coerentes com o contrato acordado; senha armazenada em hash.
- [ ] Pelo menos cinco SELECTs que representem uso real, com JOIN e agregação.
- [ ] Documentar execução no README da pasta `database/` e incluir o ER no material do PDF final.

## Dependências e limites

A proposta inicial do modelo pode avançar antes da conclusão de 01; a compatibilidade com o contrato deve ser revisada antes da integração. Não criar cadastros adicionais sem necessidade acadêmica ou funcional.

## Comentários

### 14/11/2026

Ticket publicado em Markdown local. Tecnologia e estrutura interna ficam para proposta do colega.

## Atualização de integração — 17/11/2026

Lucas aprovou importar e adequar a contribuição `51957f3`, preservando as ADRs atuais. Implementação técnica e verificações em [evidências de integração](../../../docs/evidencias/backend-integration/README.md) e [contrato vigente](../api-contract.md). Os critérios históricos de PUT completo por categoria/conclusão automática acima foram substituídos por contribuição individual, ciclo idempotente, correção por ID e conclusão explícita. API Java/Spring Boot e PostgreSQL foram mantidos. A equipe ainda deve revisar a alteração antes da entrega acadêmica; PDF/pitch e execução nativa permanecem separados. Não houve push.
