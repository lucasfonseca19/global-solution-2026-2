# Orientações do projeto

- Escrever textos para pessoas em português brasileiro com acentuação normal em UTF-8. Usar identificadores e nomes de arquivos compatíveis com as convenções técnicas.
- Preservar o MVP acadêmico mínimo. Ler `CONTEXTO.md`, `ENUNCIADO.md`, `GLOSSARY.md` e a especificação em `.scratch/merenda/spec.md` antes de alterar o escopo.
- Distinguir regras aprovadas de propostas para revisão com o colega. O backend e o banco permanecem abertos à contribuição dele.
- Seguir o planejamento com `grill-with-docs`, `to-spec` e `to-tickets`: esclarecer as pendências, alinhar como verificar o comportamento e revisar entregas pequenas e demonstráveis antes de publicá-las. Um ticket para todo o app representa escopo geral, não uma única execução pronta.
- Para React Native/Expo, usar a skill `vercel-react-native-skills` solicitada por Lucas e ler [docs/agents/mobile.md](docs/agents/mobile.md). Aplicar as regras pertinentes sem acrescentar funcionalidades ou dependências desnecessárias.
- Acompanhamento em Markdown conforme [issue-tracker.md](docs/agents/issue-tracker.md), [triage-labels.md](docs/agents/triage-labels.md) e [domain.md](docs/agents/domain.md). O repositório privado foi autorizado para versionar esses arquivos; não abrir GitHub Issues ou enviar mensagens a pessoas sem instrução.
- A arquitetura da parte de Lucas foi aprovada em 14/11/2026; a execução dos tickets 09 a 12 está autorizada, conforme `.scratch/merenda/spec.md` e `.scratch/merenda/execution-plan.md`. O contrato continua provisório para integração; não ampliar o escopo nem implementar banco/backend do colega.

- Em 17/11/2026, após análise da entrega real `51957f3`, Lucas autorizou importar, ajustar banco/backend e integrar o app conforme `.scratch/merenda/integration-plan.md`. A restrição anterior de não implementar a parte do colega foi substituída por essa autorização específica. Preservar as ADRs e a interface aprovada. Sem push/PR/mensagens externas.
