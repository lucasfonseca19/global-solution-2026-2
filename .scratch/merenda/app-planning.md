# Revisão do planejamento do app

Status: needs-info

## Constatação em 14/11/2026

Lucas questionou a granularidade do ticket 04 e o uso do fluxo das skills de Matt Pocock. A revisão das versões locais e do repositório de origem confirmou que `to-tickets` pede entregas pequenas, completas e demonstráveis, com dependências reais, propostas ao aluno antes da publicação.

Os oito tickets publicados descrevem frentes amplas (banco, API, app, simulador etc.). São úteis como mapa de responsabilidades, mas não constituem uma divisão suficiente para execução por esse fluxo. A aceitação da divisão pelo colega não equivale à aprovação da granularidade dos tickets ou do contrato técnico.

Também faltou alinhar com Lucas onde verificar o comportamento do app, como previsto em `to-spec`. A especificação existente é uma base de domínio em discussão, não uma especificação completa do app aprovada para implementar.

## O que já está decidido

- Escopo acadêmico mínimo, uma escola, um perfil e quatro telas.
- React Native confirmado por Lucas como conteúdo estudado.
- Expo com suporte web aprovado por Lucas para facilitar execução local e teste; manter capacidade mobile, sem publicação/hospedagem.
- Usar `vercel-react-native-skills` no desenvolvimento, conforme [orientações mobile](../../docs/agents/mobile.md). Skill instalada no ambiente de Lucas; nenhum código criado.
- Identificação automática por RFID, tara, prévia antes de gravar e confirmação por categoria.
- Categoria pendente diferente de zero, correção sem duplicação e exclusão com confirmação.
- Simulação controlada e contrato provisório para permitir desenvolver sem API pronta.

Não reabrir essas decisões sem motivo. Não vincular o fechamento do app às escolhas internas do backend.

## Pendências a resolver em pequenas rodadas

Critério explicitado por Lucas: escolher a forma mais simples de simular, gravar a demonstração e permitir que o avaliador teste seguindo o README. Não acrescentar publicação em loja, hospedagem, instalação PWA ou funcionamento offline sem necessidade. Em 14/11, Lucas perguntou sobre substituir React Native por PWA; ainda não escolheu a substituição. O enunciado não exige publicação do app nem hospedagem, mas exige front-end mobile e não esclarece se PWA/web responsivo atende. React Native permanece a escolha anterior em revisão, não uma decisão nova nesta consulta.

1. Base de execução definida: React Native com Expo e suporte web local. Documentar os passos reais ao implementar e verificar também a execução mobile; não acrescentar uma decisão de hospedagem ou publicação.
2. Fluxo visível e apresentação das quatro telas: informações principais, navegação, entrada da simulação, estados de espera e retorno após confirmar/corrigir.
3. Duração dos dados simulados: o que deve permanecer ao trocar de tela, fechar ou reiniciar o app; forma de repetir os cenários da apresentação.
4. Verificação dos comportamentos: propor testes pelo fluxo e pela interface de acesso aos dados, sem exigir testes de detalhes internos de cada componente. Alinhar com Lucas a forma de verificar.

Os detalhes de rotas e campos ainda podem ser ajustados com o colega, isolados na camada de dados. A posição dos controles de demonstração ainda precisa ser escolhida; não assumir que o funcionário seleciona a categoria manualmente.

## Sequência de correção

1. Retomar `grill-with-docs` nas pendências acima, em rodadas curtas.
2. Consolidar a especificação do app com `to-spec`, usando as respostas e alinhando a verificação do comportamento.
3. Com `to-tickets`, propor entregas menores que cada uma demonstrem um comportamento completo com dados simulados, em vez de tickets só de componentes ou de configuração.
4. Revisar granularidade e bloqueadores com Lucas e somente então publicar os tickets menores. Preservar o ticket 04 como referência do escopo geral, sem fechá-lo como implementado.
5. Implementar somente após instrução do aluno. Nenhum código foi escrito.

Hipótese de divisão para discussão posterior: entrar e consultar histórico; criar/continuar serviço e confirmar primeira leitura; confirmar a segunda categoria e ver o total; corrigir; excluir. Ainda não são tickets aprovados; nomes e dependências dependem das respostas pendentes.

## Fontes consultadas

- [to-tickets](https://github.com/mattpocock/skills/blob/main/skills/engineering/to-tickets/SKILL.md)
- [to-spec](https://github.com/mattpocock/skills/blob/main/skills/engineering/to-spec/SKILL.md)
- [grill-with-docs](https://github.com/mattpocock/skills/blob/main/skills/engineering/grill-with-docs/SKILL.md)

Versões locais consultadas em `/Users/lucas/FIAP/.agents/skills/`. Não foram modificadas ou reinstaladas.

Comparação de execução consultada em 14/11: [Expo para web](https://docs.expo.dev/workflow/web/), [execução local com Expo](https://docs.expo.dev/get-started/start-developing/) e [requisitos de instalação PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable). React Native com Expo e suporte web é alternativa proposta para manter capacidade mobile e facilitar teste local em navegador; não foi escolhida por Lucas. A presença de suporte web não substitui a verificação mobile. PWA só pode ser tratada como atendimento confirmado ao requisito após esclarecimento do tutor; a orientação anterior dele foi sobre sensores, não sobre formato do app.

Na sequência, Lucas aprovou React Native com Expo e suporte web e solicitou a skill da Vercel. A nota acima registra o momento anterior à decisão; a base de execução deixa de ser uma escolha pendente. Persistem as pendências de interação das telas, dados simulados e forma de verificação, antes da decomposição em tickets menores.
