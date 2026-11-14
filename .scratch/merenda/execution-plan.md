# Plano de execução da parte de Lucas

Aprovado em 14/11/2026; especificação: spec.md, seção de arquitetura aprovada.

## Estrutura e responsabilidades
- mobile/: app Expo, telas, componentes, adaptador e testes de fluxo web.
- iot/: CLI independente e cenários compartilhados sem dependência de React Native.
- docs/: relatório, guia de testes, plano/evidências e roteiro.
- backend/ e database/: preservar, responsabilidade do colega.

## Sequência
- [x] 09: login/histórico/detalhes; interface de dados e exemplos; testes de sucesso/erro/consulta; executar web.
- [ ] 10: registro, prévia/confirmação e cenários IoT compartilhados; testes de cálculo, total, zero, erros e unicidade.
- [ ] 11: correção/exclusão/persistência/restauração; verificar preservação dos demais serviços e cancelamentos.
- [ ] 12: fluxos web e nativos reais, evidências individuais, READMEs, relatório, guia e pitch.

Cada implementador recebe contexto novo, ticket, spec e limites de edição. Revisão objetiva de requisitos e qualidade por entrega; orquestrador verifica e faz commits. Sem agentes editando simultaneamente os mesmos arquivos. Testes red/green nas fronteiras aprovadas; sem testes espelhando componentes.

## Riscos a verificar
- Prévia nunca pode substituir valor confirmado.
- Duplicidade por data/tipo deve continuar o serviço.
- PUT de correção deve preservar a outra categoria.
- Carregar persistência antes dos exemplos e aguardar escrita antes de sucesso.
- Mobile exige execução nativa; navegador não comprova o requisito.

## Registro
14/11: aprovação recebida, Git limpo, Node 22.17.1/npm 10.9.2; Xcode e runtimes iOS disponíveis, sem dispositivo de simulador criado.

09 verificado: cinco testes de dados, dois fluxos web e typecheck; revisão acessível corrigida. Próximo: 10.
