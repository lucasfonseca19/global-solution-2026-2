# MVP de medição do descarte da merenda

Status: needs-info

Atualizado em 14/11/2026. Rascunho para revisão de Lucas e do outro integrante. Não autoriza implementação. As decisões refletem a conversa com Lucas; não pressupõem concordância prévia do colega.

Fontes: [enunciado](../../ENUNCIADO.md), [contexto](../../CONTEXTO.md), [glossário](../../GLOSSARY.md) e [mapa de decisões](map.md).

## Objetivo e limites aprovados

Medir o descarte monitorado de uma escola, por serviço de alimentação identificado pela data e tipo de refeição. Separar sobra não servida destinada ao descarte de restos comestíveis dos pratos. Mostrar quilogramas de cada categoria e o total do serviço, para permitir acompanhar o descarte ao longo dos serviços.

Existe apenas um serviço para cada combinação de data e tipo de refeição. Quando já estiver cadastrado, continuar ou corrigir as pesagens nesse mesmo registro.

Permitir excluir um serviço após confirmação na tela, removendo também suas pesagens, sem recuperação.

Um único perfil de usuário registra as pesagens e consulta o histórico. Lixeiras com identificação RFID, categoria e tara pré-cadastradas nos dados iniciais.

Não medir produção, contar refeições servidas, calcular porcentagem desperdiçada ou gramas por refeição servida. Não incluir gerenciamento de lixeiras, múltiplas escolas, diferentes perfis ou alerta por limite de descarte.

Sem entrevistas: justificativa documental, com fontes verificadas antes do uso e sem alegar validação com a comunidade escolar. Medição e acompanhamento não comprovam, por si, redução de desperdício.

## Fluxo aprovado

1. Entrar no app pelo login.
2. Identificar o serviço pela data e pelo tipo de refeição.
3. Ao final do serviço, antes de esvaziar a lixeira, colocá-la na balança, com sua etiqueta próxima do leitor RFID instalado junto à plataforma. A simulação representa essa colocação.
4. Identificar automaticamente a lixeira pelo código recebido, encontrando sua categoria e a tara cadastrada, sem seleção manual da categoria pelo funcionário.
5. Receber a leitura simulada do peso total e descontar a tara para mostrar apenas o alimento.
6. Conferir e confirmar o peso daquela categoria no serviço.
7. Repetir para a outra categoria, usando a mesma balança.
8. Consultar os valores por categoria e o total no histórico e nos detalhes.

Vale apenas o último peso confirmado de cada categoria em cada serviço. Uma correção de 2 kg para 2,5 kg resulta em 2,5 kg registrados, sem somar as duas leituras. Pesagens de cargas sucessivas com esvaziamentos intermediários não estão contempladas no fluxo aprovado.

Categoria ainda não confirmada aparece como “aguardando pesagem”, sem assumir zero. Zero confirmado significa que a categoria foi conferida e não houve descarte. O serviço fica pendente até a confirmação das duas categorias.

## Telas aprovadas

| Tela | Comportamento |
| --- | --- |
| Login | Permitir acesso autenticado ao fluxo |
| Histórico | Listar serviços por data, com o total descartado, e permitir abrir os detalhes ou iniciar um registro |
| Registro | Informar data e tipo de refeição, identificar lixeira e confirmar pesagens simuladas |
| Detalhes | Mostrar pesos por categoria e total, com acesso à correção e exclusão do serviço mediante confirmação |

## IoT e integração

Uma balança de chão e um leitor RFID de curta distância simulados; RC522 é referência conceitual, sem compra de equipamentos. O RFID identifica a lixeira/categoria e permite aplicar a tara; o peso alimenta os valores exibidos. A demonstração deve evidenciar as ações disparadas pelos dados, além de apresentar as leituras.

Simulação com cenários prontos, acionados por botões e explicitamente identificados como simulados: identificação de cada lixeira, recebimento de peso válido, etiqueta desconhecida e peso total menor que a tara. Usar valores controlados para permitir repetir a demonstração e os testes, sem depender de aleatoriedade. A simulação fornece as leituras; o sistema deve efetivamente identificar o recipiente, calcular o peso líquido e validar os dados, em vez de apenas mostrar resultados prontos.

Os controles de cenário pertencem à demonstração, não à operação normal do funcionário. O app aguarda a lixeira e reage ao código de etiqueta recebido; o operador não informa a categoria manualmente. O posicionamento adequado de etiqueta e leitor é pressuposto do cenário físico ilustrado, não uma capacidade de hardware verificada.

Base de separação discutida: simulador independente produz código RFID e peso; API recebe os dados, identifica a lixeira, aplica tara e valida; app apresenta o resultado para confirmação, após a qual ocorre a gravação. Um script simples é a opção sugerida, mas linguagem, transporte e contrato ficam para combinação entre os integrantes. Na demonstração separada, manter os mesmos significados de dados e regras.

Lucas relatou autorização geral do tutor às alternativas consultadas (duas balanças ou balança com RFID), sem detalhamento técnico adicional. A opção escolhida é balança com RFID.

Planejar integração entre app, API e simulação. Se não ficar pronta a tempo, demonstrar as partes separadamente com domínio e dados coerentes, como permitido pelo enunciado. O transporte dos eventos e o contrato técnico ainda serão combinados entre os integrantes.

## Base para alinhar os dados, ainda para revisão conjunta

Precisamos compartilhar o significado de serviço, lixeira, categoria, tara e peso final. Front e back devem concordar sobre identificação do serviço, unidade em kg, distinção entre valor não registrado e zero, cálculo dos totais e substituição de uma confirmação anterior.

Esta base não determina tabelas, nomes de campos, endpoints ou tecnologias de persistência. O colega poderá propor o modelo e o contrato da API, respeitando as regras de domínio e os mínimos acadêmicos.

Proposta de comunicação e exemplos em [api-contract.md](api-contract.md), ainda para revisão. Lucas aprovou seis operações como ponto de partida: login e listar/detalhar/criar/atualizar/excluir serviços. Lucas também aprovou uma operação adicional de prévia para identificar a lixeira, calcular e validar no backend antes da confirmação, sem gravar. O contrato também marca regras adicionais sugeridas, sem tratá-las como decisões do grupo.

Validações aprovadas para a simulação e seus testes:

- Não confirmar pesagem com etiqueta desconhecida: informar que a lixeira não foi reconhecida.
- Não confirmar peso total menor que a tara: informar a inconsistência para repetir a leitura.

Propostas ainda para revisão:

- Exibir falha de gravação e permitir tentar novamente, sem apresentar a operação como salva.

## Critérios de aceite derivados das decisões

- A mesma balança atende às duas categorias, identificadas pelo RFID.
- Com tara de 1 kg e peso total de 4 kg, mostrar 3 kg de alimento.
- Ao confirmar 3 kg de sobra e 2 kg de restos no mesmo serviço, mostrar total de 5 kg.
- Ao substituir os restos por 2,5 kg, mostrar 2,5 kg nessa categoria e total de 5,5 kg.
- Preservar os registros dos outros serviços ao corrigir um deles.
- Impedir serviços duplicados para a mesma data e tipo de refeição, permitindo continuar ou corrigir o serviço existente.
- Excluir um serviço e suas pesagens somente após confirmação na tela, preservando os demais serviços.
- Permitir navegar entre as quatro telas, consultar registros e acessar sua correção.
- Mostrar as ações dos dois dispositivos simulados sem exigir hardware físico.
- Rejeitar etiqueta desconhecida e peso total menor que a tara, explicar o motivo e não gravar a leitura inválida.
- Exibir “aguardando pesagem” para categoria não confirmada; aceitar zero confirmado e manter o serviço pendente enquanto faltar uma categoria.

## Cobertura acadêmica a detalhar

| Parte | Mínimos do enunciado |
| --- | --- |
| Banco | Pelo menos 4 entidades normalizadas, ER, SQL com constraints e carga inicial, 5 consultas com JOIN e agregação |
| API | Pelo menos 6 endpoints, GET/POST/PUT/DELETE, Controller/Service/Repository, validação, status e Swagger ou Postman |
| Testes | Pelo menos 8 casos incluindo erros, 5 executados com evidência de cada execução |
| Mobile | Pelo menos 4 telas funcionais, navegação, legibilidade e feedback |
| Segurança | Senha em hash e pelo menos 3 práticas, com demonstração verificável |
| IoT | Dois dispositivos simulados na opção escolhida, ações dos dados e explicação do uso |
| Entrega | ZIP com código e README, PDF, TXT com integrantes e link público do pitch; vídeo de até 3 minutos e link também no README |

Também identificar os ODS e a contribuição às metas. Tecnologias devem estar no conteúdo até a fase 4. A tabela não substitui o enunciado.

## Escolhas e pendências

- React Native confirmado por Lucas em 14/11 como conteúdo abordado até a fase 4.
- Backend: colega propõe C# com ASP.NET ou Java dentro do conteúdo estudado. Banco e demais detalhes técnicos em aberto.
- Rever falha de gravação e formato mínimo dos dados compartilhados. Etiqueta desconhecida, peso menor que a tara e distinção entre categoria pendente e zero confirmado já foram esclarecidos.
- Combinar o transporte dos dados simulados entre as partes, preservando demonstração independente. Cenários prontos acionados por botões já foram aprovados; o detalhe técnico fica para revisão conjunta.
- Divisão aceita pelo colega segundo Lucas em 14/11: Lucas no app/simulação e colega no banco/API/segurança. Responsáveis finais por documentação, pitch e submissão ainda a combinar.
- Tickets locais publicados após a aceitação da divisão relatada por Lucas: [índice](issues/README.md). O app com dados simulados e o simulador independente podem avançar usando o contrato provisório; a revisão conjunta do contrato continua necessária para integrar.

## Comentários

### 12/11/2026

Consolidação inicial do fluxo discutido. Sem código, tickets publicados ou escolha unilateral da arquitetura de backend. As propostas e pendências acima permanecem abertas.

Lucas aprovou bloquear confirmação com etiqueta desconhecida ou peso total menor que a tara, com explicação na tela. Esses casos devem integrar o plano de testes; não acrescentar simulação de falhas físicas ou calibração ao escopo.

Aprovados cenários controlados acionados por botões para identificação das lixeiras, leitura válida e os dois erros definidos. O fluxo principal está consolidado para revisão, sem fechar contratos, tecnologias de backend ou divisão de tickets unilateralmente.

Esclarecido que a identificação ocorre automaticamente ao colocar a lixeira junto ao leitor da balança. Os controles servem à simulação dessa ação e não representam seleção manual de categoria. Discutida separação entre simulador de leituras, API de identificação/cálculo/validação e app de apresentação/confirmação, com detalhes de conexão abertos ao colega.

### 14/11/2026

Divisão aceita pelo colega segundo Lucas, sem revisão técnica do contrato ainda. React Native confirmado pelo aluno como conteúdo estudado. Criados tickets locais, separando os bloqueios de integração do trabalho independente de Lucas. Nenhum código de aplicação foi implementado.

Revisão de granularidade solicitada por Lucas em 14/11: a versão simulada independe da API, mas ainda não está pronta para codificação. Resolver as [pendências do app](app-planning.md), alinhar testes de comportamento e revisar entregas menores antes de implementação. O ticket 04 volta a `needs-info`; os oito tickets existentes são mapa de frentes, não a decomposição final exigida por `to-tickets`.
