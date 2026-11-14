# Global Solution 2026/2

MVP acadêmico para medir o descarte da merenda escolar. Escopo funcional definido com Lucas; contrato, tecnologias e divisão de trabalho em revisão conjunta. Ainda não há código de aplicação.

Repositório privado do grupo: [lucasfonseca19/global-solution-2026-2](https://github.com/lucasfonseca19/global-solution-2026-2).

## Para o grupo

Comece pelo [guia da equipe](docs/guia-equipe.md): resumo do MVP, escolhas abertas e como trabalhar em paralelo.

| Parte | Local | Situação |
| --- | --- | --- |
| App mobile | [mobile/](mobile/README.md) | React Native com Expo e suporte web; implementação ainda não iniciada |
| Backend | [backend/](backend/README.md) | Tecnologia e detalhes internos para proposta do colega |
| Banco | [database/](database/README.md) | Modelo e tecnologia para revisão |
| Simulação IoT | [iot/](iot/README.md) | Balança e RFID simulados, sem hardware |

## Base para revisão

- [Especificação do MVP](.scratch/merenda/spec.md): comportamento e critérios de aceite.
- [Contrato proposto](.scratch/merenda/api-contract.md): operações, exemplos e pontos para combinar entre front e back.
- [Tickets locais](.scratch/merenda/issues/README.md): responsáveis, critérios de aceite e dependências; app com dados simulados pode avançar sem esperar o backend.
- [Plano inicial](.scratch/merenda/tickets-proposal.md): referência da divisão discutida.
- [Glossário](GLOSSARY.md): termos usados por todas as partes.
- [Enunciado](ENUNCIADO.md): requisitos da faculdade e critérios de avaliação.
- [Orientações de desenvolvimento mobile](docs/agents/mobile.md): execução local e skill de React Native solicitada por Lucas.

As regras aprovadas por Lucas estão distinguidas das propostas técnicas. O colega pode revisar a solução; mudanças no contrato precisam ser combinadas para preservar a consistência do app e da API.

## Começar ou retomar

1. Leia [CONTEXTO.md](CONTEXTO.md): objetivo, decisões e pendências.
2. Consulte [ENUNCIADO.md](ENUNCIADO.md): requisitos da faculdade.
3. Use o [glossário](GLOSSARY.md) e o [mapa de acompanhamento](.scratch/merenda/map.md).

## Organização

- `docs/agents/`: configuração dos fluxos de documentação e acompanhamento local.
- `GLOSSARY.md`: termos do domínio já esclarecidos.
- `docs/adr/`: decisões que justifiquem um registro próprio, quando surgirem.
- `.scratch/merenda/map.md`: estado da discussão e decisões pendentes.
- `.scratch/merenda/spec.md`: rascunho da especificação para revisão conjunta.
- `.scratch/merenda/api-contract.md`: proposta de comunicação e exemplos compartilhados.
- `.scratch/merenda/tickets-proposal.md`: proposta de divisão antes da criação dos tickets.
- `.scratch/merenda/issues/`: oito tickets publicados em Markdown local, com índice e dependências.

## Fluxo previsto

Esclarecer o escopo com `grill-with-docs` e registrar termos com `domain-modeling`. Consolidar a conversa com `to-spec`. Revisar a especificação e usar `to-tickets` para propor unidades de trabalho e dependências. Implementar os tickets aprovados e atualizar seu andamento.

Os documentos são criados conforme houver conteúdo para registrar; não é necessário criar todos de uma vez. Ainda não existe código de aplicação nem uma especificação técnica aprovada.

## Entrega

Planejar integração entre as partes, preservando demonstração independente caso o prazo não permita integrá-las. O acompanhamento continua em Markdown local, que pode ser versionado neste repositório, sem depender de GitHub Issues.

Prazo: **19/11/2026, às 23h55**. Entrega em ZIP com código, README de execução, PDF, TXT e link público do pitch de até três minutos. Os comandos de execução e a declaração de uso de IA serão acrescentados conforme a implementação acontecer; esta estrutura ainda não é a entrega final.
