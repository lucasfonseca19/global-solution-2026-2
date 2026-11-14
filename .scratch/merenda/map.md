# Mapa: medição do descarte da merenda

Status: needs-info

## Notas

- O objetivo é um MVP acadêmico mínimo. Fonte dos requisitos: [enunciado](../../ENUNCIADO.md).
- Contexto para uma nova sessão: [CONTEXTO.md](../../CONTEXTO.md).
- Configuração de acompanhamento: [tracker local](../../docs/agents/issue-tracker.md).

## Decisões até aqui

- Foco em medição do descarte na alimentação escolar.
- React Native escolhido e confirmado por Lucas em 14/11 como conteúdo abordado até a fase 4.
- Atender uma única escola, com um único perfil de usuário que registra pesagens e consulta o histórico.
- Planejar integração entre app, API e simulação de IoT; se não ficar pronta a tempo, demonstrar as partes separadamente, mantendo coerência de domínio e dados.
- Não incluir alerta por limite de descarte. Os dados simulados identificam a lixeira e sua categoria, aplicam a tara e atualizam pesos e totais exibidos.
- Lixeiras pré-cadastradas com identificação RFID, categoria e tara; sem tela para gerenciá-las. Manter quatro telas: login, histórico, registro e detalhes, conforme fluxo discutido.
- Organizar os registros por serviço de alimentação, identificado por data e tipo de refeição, reunindo as duas categorias de descarte.
- Manter apenas o último peso confirmado por categoria em cada serviço; novas confirmações substituem o valor anterior, sem somar as leituras.
- Medir sobras efetivamente descartadas e restos comestíveis dos pratos separadamente.
- Não pesar toda a produção nem calcular porcentagem da produção desperdiçada.
- Mostrar quilogramas por categoria e o total de cada serviço. Não cadastrar a contagem de refeições servidas nem calcular gramas por refeição servida no MVP.
- Usar acompanhamento e documentos locais.
- Trabalhar com pesquisa documental; não haverá entrevistas.
- Simplificar o manuseio: pesar a própria lixeira em uma balança de chão, conforme direção proposta pelo aluno, evitando transferir o descarte para outro recipiente só para pesar.
- Usar uma balança de chão e um leitor RFID simulados. O RFID identifica a lixeira e sua categoria; a mesma balança pesa os dois tipos de descarte. Essa escolha substitui as duas balanças, cuja duplicação apenas para distinguir categorias foi rejeitada pelo aluno. Sensor de nível não faz parte do escopo escolhido.

## Dúvidas em aberto

Consultar as pendências em `CONTEXTO.md`. O contrato técnico ainda está em revisão conjunta; há oito tickets locais no [índice](issues/README.md), sem implementação iniciada.

Rascunho de consolidação: [spec.md](spec.md). Distingue decisões, propostas e pendências; ainda não está pronto para implementação.

- A regra de registro foi esclarecida: manter apenas o último peso confirmado por categoria e serviço, substituindo o anterior sem somar as leituras. As demais pendências estão no contexto.

## Próximos marcos

- [x] Esclarecer o fluxo principal de uso e seus conceitos.
- [ ] Escolher tecnologias dentro do conteúdo da disciplina.
- [ ] Consolidar e revisar a especificação com critérios de aceite.
- [ ] Mapear os critérios de avaliação à especificação.
- [x] Publicar tickets locais após aceitação da divisão, preservando pendências técnicas nos tickets afetados.
- [ ] Implementar, verificar e preparar evidências e pacote final.

## Comentários

### 10/11/2026

Estrutura local inicial criada a partir da conversa. Glossário contém somente conceitos esclarecidos; funcionalidades e tecnologias propostas permanecem pendentes.

Na continuidade, o aluno reafirmou que só a sobra destinada ao descarte entra na medição e propôs colocar a própria lixeira sobre uma balança de chão para simplificar. A sugestão anterior de uma pesagem final por categoria ainda não foi confirmada.

O aluno trouxe a resposta do tutor à consulta sobre duas balanças ou balança com RFID: “Pode usar o que for mais tranquilo para o grupo, sem problemas!”. Com base nessa orientação geral, escolheu duas balanças simuladas. A resposta foi relatada nesta conversa, sem detalhamento técnico adicional do tutor.

Na sequência, revisou a escolha para uma balança com leitor RFID, por não considerar justificáveis dois equipamentos idênticos apenas para identificar contextos diferentes. A escolha anterior de duas balanças está substituída.

Aceitou RFID de curta distância, com RC522 como referência conceitual e leituras simuladas, sem compra de equipamentos. Fluxo aceito: aproximar a etiqueta da lixeira do leitor, colocar na balança, conferir e confirmar o peso.

### 11/11/2026

Aprovado cadastrar o peso vazio de cada lixeira (tara) e descontá-lo automaticamente ao identificar o recipiente, mostrando apenas o peso do alimento. Termo acrescentado ao glossário.

Aprovado o fluxo de pesar cada lixeira ao final do serviço, antes de esvaziá-la, registrando o descarte daquela refeição.

Aprovada a organização por data e tipo de refeição (exemplo: almoço de 11/11). O termo “serviço de alimentação” foi acrescentado ao glossário para distinguir essa ocasião de uma refeição servida a uma pessoa.

Aprovado manter apenas o último peso confirmado por categoria em cada serviço. Exemplo: corrigir restos dos pratos de 2 kg para 2,5 kg resulta em 2,5 kg registrados, sem somar os dois valores.

Aprovado deixar a contagem de refeições servidas fora do MVP. Mostrar os quilos descartados por categoria e o total do serviço, sem indicador de gramas por refeição servida.

Aprovado limitar o MVP a uma escola e um perfil de usuário, responsável pelos registros e pela consulta ao histórico. O enunciado não exige múltiplas escolas ou perfis.

Escolhida a opção mínima de lixeiras pré-cadastradas nos dados iniciais, mantendo quatro telas. A alternativa de uma quinta tela para gerenciar lixeiras não foi escolhida.

### 12/11/2026

Após releitura da parte de IoT, o aluno decidiu deixar o MVP sem alerta por limite de descarte. O enunciado apresenta alertas ou painel no objetivo e cita o alerta como exemplo no critério pontuado. Demonstrar as ações dos dados: identificação da lixeira/categoria por RFID, desconto da tara e atualização dos pesos e totais exibidos.

Lucas informou que implementará com outro integrante e prefere o frontend; o colega tem mais experiência com backend e banco. Quer uma base consistente para o trabalho, com liberdade para o colega revisar e contribuir, sem receber todas as decisões técnicas fechadas. A divisão detalhada sugerida na conversa ainda não foi confirmada entre os integrantes.

Aprovado deixar a tecnologia do backend para o colega propor, respeitando o enunciado. Continuar definindo o comportamento esperado e preparar a proposta de MVP para revisão conjunta.

Aprovada a integração como plano principal, com demonstração separada das partes como alternativa se não houver tempo. Manter cada parte demonstrável e os dados coerentes, para preservar essa alternativa.

Escolhido React Native para o app, ainda sem comprovação de aderência ao conteúdo da disciplina. Criado rascunho da especificação para consolidar o fluxo e discutir as pendências em pequenas rodadas.

Aprovadas duas validações para leituras simuladas: etiqueta desconhecida e peso total menor que a tara bloqueiam a confirmação, com explicação na tela. Incluir no plano de testes, sem simular falhas físicas ou calibração. Especificação atualizada.

Esclarecida e aceita a distinção entre categoria aguardando pesagem e zero confirmado. Categoria não confirmada aparece como “aguardando pesagem”; zero indica ausência de descarte conferida. Serviço pendente até confirmar as duas categorias. Glossário, contexto e especificação atualizados.

Aprovada simulação com cenários controlados acionados por botões: identificação de cada lixeira, peso válido e os dois erros definidos. Fluxo principal consolidado no rascunho para revisão; não há aprovação final da especificação nem tickets publicados.

Esclarecida identificação automática ao colocar a lixeira na balança, com etiqueta próxima do leitor. Controles de cenário não são seleção manual de categoria no app. Discutida separação de simulador independente (leituras), API (identificação/cálculo/validação/gravação após confirmação) e app (apresentação/confirmação); detalhes técnicos para combinação entre os integrantes. Especificação atualizada.

Lucas aprovou preparar o contrato mínimo antes dos tickets, com login e listar/detalhar/criar/atualizar/excluir serviços como ponto de partida. Criada [proposta de contrato](api-contract.md) com exemplos e cenários para uso compartilhado. Uma sétima operação de prévia foi proposta para identificar/calcular antes da confirmação no backend; ainda requer aprovação. As demais escolhas adicionais do contrato também estão identificadas como propostas.

Aprovada por Lucas a sétima operação de prévia: identificar a lixeira, calcular o peso líquido e validar sem gravar. A confirmação posterior dispara a gravação. Rotas e formatos continuam como propostas para revisão.

Aprovado um único serviço por data e tipo de refeição. Serviço existente deve ser aberto para continuar ou corrigir as pesagens, em vez de criar duplicata. Glossário, contexto, especificação e contrato atualizados.

Aprovado excluir serviço e suas pesagens após confirmação na tela, sem recuperação. Criada [proposta de divisão em tickets](tickets-proposal.md) para revisão; nenhum arquivo de ticket foi publicado em `issues/` e nenhum trabalho de implementação foi iniciado.

Lucas propôs estruturar um repositório no GitHub para colaboração. Verificado que a pasta ainda não é um repositório Git. Preparados README atualizado, guia da equipe, pastas documentadas `mobile/`, `backend/`, `database/`, `iot/` e `.gitignore`, sem código ou instalação. Links locais conferidos. Nenhum repositório remoto foi criado; faltam conta/visibilidade. Documentação pronta para compartilhar como proposta de revisão, não como arquitetura unilateralmente aprovada.

Lucas autorizou a opção privada. Criado o repositório https://github.com/lucasfonseca19/global-solution-2026-2 na conta autenticada, com Issues e wiki desativadas. Preparada publicação inicial da documentação e estrutura, sem código de aplicação. Nenhum convite ao colega foi enviado.

### 14/11/2026

Lucas relatou que o colega aceitou a divisão, mas ainda não revisou nem propôs o backend/banco. Confirmou também React Native no conteúdo até a fase 4. Criados oito tickets locais com índice. App com dados simulados, simulador independente e planejamento dos testes podem avançar sem aguardar revisão conjunta do contrato, que bloqueia a integração. Backend continua aberto à contribuição do colega; nenhum código foi implementado.

Lucas questionou a granularidade e o fluxo das skills. Após conferir `grill-with-docs`, `to-spec` e `to-tickets` locais e upstream, registrada a [revisão do app](app-planning.md). Os oito tickets são frentes amplas; não representam ainda uma decomposição por comportamentos completos e pequenos. Ticket 04 corrigido para `needs-info`; definir execução, apresentação/interação, persistência dos dados simulados e forma de verificação antes de propor tickets menores para revisão. Não iniciar código.

Após comparar PWA e execução local, Lucas aprovou React Native com Expo e suporte web e pediu `vercel-react-native-skills`. Skill instalada localmente e uso registrado em `docs/agents/mobile.md`/`AGENTS.md`. A execução deixa de ser decisão aberta; o ticket 04 continua `needs-info` pelas demais pendências do app. Sem implementação.
