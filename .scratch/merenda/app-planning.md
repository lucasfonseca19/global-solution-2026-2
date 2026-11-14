# Revisão do planejamento do app

Status: needs-info

## Constatação em 14/11/2026

Lucas questionou a granularidade do ticket 04 e o uso do fluxo das skills de Matt Pocock. A revisão das versões locais e do repositório de origem confirmou que `to-tickets` pede entregas pequenas, completas e demonstráveis, com dependências reais, propostas ao aluno antes da publicação.

Os oito tickets publicados descrevem frentes amplas (banco, API, app, simulador etc.). São úteis como mapa de responsabilidades, mas não constituem uma divisão suficiente para execução por esse fluxo. A aceitação da divisão pelo colega não equivale à aprovação da granularidade dos tickets ou do contrato técnico.

Também faltou alinhar com Lucas onde verificar o comportamento do app, como previsto em `to-spec`. A especificação existente é uma base de domínio em discussão, não uma especificação completa do app aprovada para implementar.

## O que já está decidido

- Escopo acadêmico mínimo, uma escola, um perfil e quatro telas.
- React Native confirmado por Lucas como conteúdo estudado.
- Identificação automática por RFID, tara, prévia antes de gravar e confirmação por categoria.
- Categoria pendente diferente de zero, correção sem duplicação e exclusão com confirmação.
- Simulação controlada e contrato provisório para permitir desenvolver sem API pronta.

Não reabrir essas decisões sem motivo. Não vincular o fechamento do app às escolhas internas do backend.

## Pendências a resolver em pequenas rodadas

1. Onde o app será executado e apresentado: dispositivo/emulador e ferramentas mínimas de execução. React Native já está escolhido; Expo ou configuração alternativa ainda não.
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
