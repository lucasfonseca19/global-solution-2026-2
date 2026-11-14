# Contexto para continuidade

Atualizado em 14/11/2026. Este arquivo registra a conversa de definição; não substitui a especificação nem o enunciado.

## Objetivo e restrições do aluno

- Entregar o mínimo necessário para atender ao enunciado, com implementação relativamente simples.
- Prazo: 19/11/2026, até 23h55. Grupo não individual, de até cinco integrantes.
- Não haverá tempo para entrevistas com a comunidade escolar. A justificativa será documental, sem alegar validação com pessoas reais.
- Sensores precisam ter função útil no produto. O aluno rejeitou repetir a ideia de monitoramento de chuva usada em trabalhos anteriores.
- Acompanhamento de trabalho e documentação em arquivos locais. Não publicar issues nem mensagens externas.
- Em 12/11, Lucas autorizou criar e publicar a documentação em repositório privado no GitHub. Repositório criado: https://github.com/lucasfonseca19/global-solution-2026-2, com Issues desativadas. O acompanhamento continua em Markdown versionado, sem GitHub Issues ou envio de mensagens pelo assistente. O colega ainda não foi convidado.
- A implementação será feita por Lucas e outro integrante. Lucas prefere frontend; o outro integrante tem mais experiência com backend e banco, segundo Lucas. Em 14/11, Lucas informou que o colega aceitou a divisão: Lucas no app/simulação; colega em banco/API/segurança. O colega ainda não revisou o contrato ou propôs tecnologias.
- Preparar uma base de domínio e requisitos para manter a consistência, preservando espaço para o outro integrante revisar e propor mudanças. Não tratar escolhas de backend como unilateralmente aprovadas; tecnologias e detalhes técnicos permanecem abertos à contribuição dele, respeitando o enunciado.
- Lucas aprovou deixar a tecnologia do backend para o colega propor e continuar a definição do comportamento esperado. A proposta de MVP será apresentada para revisão conjunta; não pressupõe concordância prévia do colega.

## Direção aceita

O MVP atenderá uma única escola, com um único perfil de usuário que registra pesagens e consulta o histórico.

React Native escolhido para o app mobile e confirmado por Lucas, em 14/11, como conteúdo abordado até a fase 4. Confirmação baseada no relato do aluno; o enunciado não lista frameworks mobile.

Planejar app, API e simulação de IoT integrados. Se a integração não ficar pronta a tempo, demonstrar as partes separadamente, mantendo o mesmo domínio e dados coerentes. Essa alternativa é permitida pelo enunciado; cada parte precisa continuar demonstrável por conta própria.

Não haverá alerta por limite de descarte. O uso dos dados simulados será demonstrado pela identificação da lixeira e de sua categoria via RFID, aplicação automática da tara e atualização dos pesos e totais exibidos. A decisão considera a redação do objetivo de IoT (alertas ou painel) e o alerta como exemplo no critério de uso dos dados, não como obrigação específica.

Validar as leituras simuladas: bloquear confirmação com etiqueta desconhecida ou peso total menor que a tara e explicar o problema na tela. Incluir esses cenários no plano de testes. Não ampliar o escopo para simular falhas físicas ou calibração.

Categoria sem confirmação deve aparecer como “aguardando pesagem”, nunca como zero presumido. Aceitar zero confirmado quando não houver descarte; manter o serviço pendente até confirmar as duas categorias.

Simulação com cenários prontos acionados por botões: identificar cada lixeira, receber peso válido e demonstrar etiqueta desconhecida ou peso menor que a tara. Valores controlados e leituras identificadas como simuladas, sem depender de aleatoriedade; cálculo e validação executados pelo sistema.

Esclarecimento do fluxo: ao colocar a lixeira na balança, a etiqueta fica próxima do leitor instalado junto à plataforma; a identificação de categoria e tara é automática. Botões de cenário são controles de demonstração, não escolhas manuais de categoria pelo funcionário. Base de separação discutida: simulador independente fornece código RFID e peso; API identifica, calcula e valida; app mostra e permite confirmar, disparando a gravação. O colega poderá propor o transporte e os detalhes técnicos.

As lixeiras terão identificação RFID, categoria e tara pré-cadastradas nos dados iniciais, sem tela de gerenciamento. Manter quatro telas: login; histórico com serviços por data e total descartado; registro com data, tipo de refeição e pesagens simuladas; detalhes com pesos por categoria e opção de corrigir o registro.

Organizar os registros por serviço de alimentação, identificado pela data e pelo tipo de refeição (por exemplo, almoço de 11/11), reunindo as duas categorias de descarte.

Um único serviço por data e tipo de refeição. Se ele já existir, continuar ou corrigir suas pesagens, sem criar outro serviço para a mesma combinação.

Excluir um serviço remove também suas pesagens, após confirmação na tela e sem recuperação.

Medir o descarte na alimentação escolar, separando duas categorias:

1. Alimentos preparados e não servidos que serão efetivamente descartados.
2. Restos comestíveis devolvidos nos pratos, separados de materiais e partes não comestíveis.

O aluno aprovou medir somente o descarte, sem pesar toda a produção. Mostrar quilogramas descartados por categoria e o total de cada serviço de alimentação. A contagem de refeições servidas fica fora do MVP; não calcular gramas por refeição servida. Não apresentar porcentagem da produção sem medir a produção.

Usar uma balança de chão e um leitor RFID de curta distância simulados, com RC522 como referência conceitual, sem compra de equipamentos. Pesar a própria lixeira para simplificar o manuseio; o RFID identifica o recipiente e sua categoria de descarte, permitindo usar a mesma balança para as duas categorias. Fluxo aceito: aproximar a etiqueta da lixeira do leitor, colocar na balança, conferir e confirmar o peso. Cada lixeira terá seu peso vazio (tara) cadastrado; ao identificá-la, o sistema descontará automaticamente esse valor para mostrar apenas o peso do alimento. A pesagem será feita ao final do serviço, antes de esvaziar cada lixeira, registrando o descarte daquela refeição. Manter apenas o último peso confirmado de cada categoria em cada serviço. Uma nova confirmação substitui o valor anterior, sem somar as leituras da mesma categoria naquele serviço.

Em 10/11/2026, o aluno relatou a resposta do tutor à consulta sobre duas balanças ou balança com RFID: “Pode usar o que for mais tranquilo para o grupo, sem problemas!”. A resposta é uma autorização geral às alternativas consultadas, sem detalhamento técnico. Inicialmente escolheu duas balanças, mas revisou a escolha para balança com RFID por não considerar justificável duplicar o equipamento apenas para distinguir categorias. Duas balanças e sensor de nível não compõem a opção escolhida.

## Limites da evidência

Estudos brasileiros medem desperdício em escolas específicas; não foi estabelecida uma taxa nacional representativa na pesquisa discutida. A existência de desperdício é sustentada pelos estudos, mas a utilidade e a eficácia do produto proposto ainda são hipóteses.

Referências para conferir ao redigir a justificativa:

- Oliveira e colaboradores, 2026: https://pubmed.ncbi.nlm.nih.gov/42438361/ — 20 instituições; diferença entre percepção de gestores e resíduos observados. Não confundir porcentagem de resíduos evitáveis com porcentagem da produção desperdiçada.
- Issa e colaboradores, 2014: https://pubmed.ncbi.nlm.nih.gov/24781090/ — estudo em 42 escolas municipais de Belo Horizonte.
- Pesquisa exportada do Consensus, disponível na máquina em `/Users/lucas/Downloads/Quero_realizar_uma_reviso_exploratria_da_literat.pdf`. É uma síntese gerada por IA; verificar afirmações nos estudos antes de usá-las na entrega.

## Propostas ainda não fechadas

- Backend em C# com ASP.NET ou Java, a escolher conforme conteúdo estudado até a fase 4.
- Dados fictícios para a demonstração, explicitamente identificados como simulados.

Esses itens foram sugeridos, mas não devem ser tratados como arquitetura ou funcionalidades aprovadas.

## Pendências que mudam o projeto

- Colega propor banco/backend dentro do conteúdo permitido e revisar o contrato para integração. React Native já foi confirmado por Lucas.

## Requisitos que devem orientar a futura especificação

Consulte o enunciado para os detalhes e a pontuação. Mínimos: quatro entidades, SQL com carga inicial e cinco consultas; seis endpoints com os quatro métodos e camadas; oito casos de teste e cinco executados com evidências; quatro telas mobile; senha em hash e três práticas de segurança; dois sensores simulados com uso dos dados; vídeo de até três minutos; ZIP com código, README, PDF e TXT. Link público do vídeo no README e TXT.

## Próximo passo

Continuar a definição com `grill-with-docs`, usando o mapa local. Fazer perguntas focadas nas pendências e registrar apenas as respostas realmente decididas. Não criar código nem marcar a especificação como pronta antes da revisão do aluno.

Rascunho em `.scratch/merenda/spec.md`, ainda com propostas e pendências para revisão. Não é autorização para implementar nem acordo técnico fechado com o outro integrante.

Lucas aprovou definir um contrato mínimo antes dos tickets, usando como ponto de partida login e listar/detalhar/criar/atualizar/excluir serviços. Proposta em `.scratch/merenda/api-contract.md`, incluindo exemplos de dados e cenários compartilhados para permitir desenvolver o front com respostas simuladas. Lucas aprovou a sétima operação de prévia para identificação, cálculo e validação no backend antes da confirmação, sem gravar. Rotas exatas, formatos e os demais detalhes adicionais do contrato ainda precisam de revisão.

## Andamento em 14/11/2026

Criados oito tickets individuais em `.scratch/merenda/issues/`, com índice, critérios de aceite, responsáveis e dependências. Lucas pode avançar no app com respostas simuladas e no simulador independente sem aguardar a revisão do colega. O contrato proposto será a referência provisória, com mudanças concentradas na camada de acesso aos dados; não foi tratado como aprovado pelo colega. Revisão conjunta bloqueia a integração, não as entregas independentes. O plano de testes também pode começar agora. Nenhum código foi implementado; permanece a instrução de não iniciar implementação pelo assistente nesta conversa.

## Correção do planejamento do app em 14/11/2026

Lucas questionou o ticket único para todo o app e o cumprimento das skills de Matt Pocock. A revisão confirmou que as frentes publicadas são amplas demais para execução por `to-tickets`, e faltam decisões do app e alinhamento de verificação de comportamento previsto em `to-spec`. Ticket 04 alterado para `needs-info`; manter como escopo geral. Antes de código, resolver as pendências em `.scratch/merenda/app-planning.md`, consolidar a especificação e propor entregas menores para revisão de Lucas antes da publicação. A confirmação de React Native e a aceitação da divisão pelo colega continuam válidas, mas não liberam sozinhas a implementação. Nenhum código foi escrito.

Lucas reforçou priorizar a solução mais simples para simular, gravar e permitir teste fácil pelo avaliador, sem publicação/hospedagem desnecessária. Perguntou sobre PWA no lugar de React Native; a troca ainda não foi decidida. Releitura do enunciado confirmou ausência de exigência de publicar/hospedar o app, mas o requisito de front-end mobile não esclarece aceitação de PWA. A autorização geral do tutor relatada anteriormente se refere aos sensores, não a essa escolha. Comparação e alternativas propostas registradas em `.scratch/merenda/app-planning.md`.

Na sequência, Lucas aprovou React Native com Expo e suporte web para execução local, mantendo capacidade mobile, sem hospedar ou publicar em loja. Solicitou usar `vercel-react-native-skills` no desenvolvimento. Skill instalada no ambiente local de Lucas a partir de `vercel-labs/agent-skills`, commit `1a2c79d4e6c4a2283dc2c614b6538cbe1ed5ca62`, em `/Users/lucas/.codex/skills/vercel-react-native-skills`. Orientações de aplicação proporcional em `docs/agents/mobile.md` e ponteiro em `AGENTS.md` do projeto. Nenhum código ou dependência de aplicação instalado; o app continua pendente de definição da interação, dados simulados, verificação e decomposição revisada.
