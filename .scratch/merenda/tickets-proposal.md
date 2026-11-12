# Proposta de divisão do trabalho

Status: needs-triage

Rascunho para revisão de Lucas, antes de publicar arquivos em `issues/`. Não é plano de implementação aprovado. Responsáveis são sugestões a combinar com o colega; não iniciar código nesta etapa.

Referências: [especificação](spec.md), [contrato proposto](api-contract.md) e [enunciado](../../ENUNCIADO.md).

## Princípio de escopo

Cada entrega abaixo atende a uma exigência acadêmica ou ao funcionamento do fluxo aprovado. Sem novas funcionalidades, infraestrutura de eventos, hardware, cadastro de escolas ou gerenciamento de lixeiras. O desenho interno do backend continua aberto ao colega.

## Divisão proposta

| Futuro ticket | Entrega demonstrável | Responsabilidade sugerida | Dependências |
| --- | --- | --- | --- |
| 01 — Revisar a base compartilhada | Contrato e exemplos revisados pelos dois; tecnologias confrontadas com o conteúdo até a fase 4 | Ambos | Nenhuma |
| 02 — Entregar o banco mínimo | ER com pelo menos 4 entidades normalizadas, SQL com constraints e carga inicial, pelo menos 5 consultas de uso com JOIN e agregação | Colega | 01 |
| 03 — Entregar API e segurança | Sete operações discutidas, autenticação, regras de pesagem, camadas, validação, status HTTP e Swagger/Postman | Colega | 01 e 02 |
| 04 — Entregar as quatro telas | Fluxo completo em React Native com respostas simuladas aderentes ao contrato | Lucas | 01 e confirmação de React Native no conteúdo permitido |
| 05 — Entregar a simulação de IoT | Leituras RFID e peso controladas, cenários válidos/inválidos e demonstração das ações dos dados | Lucas, a combinar | 01 |
| 06 — Conectar e demonstrar as partes | Fluxo integrado; se faltar tempo, alternativa separada explicitamente documentada e coerente | Ambos | 03, 04 e 05 |
| 07 — Entregar testes e evidências | Pelo menos 8 casos e 5 execuções evidenciadas, com erros e cálculo/correção dos pesos | Ambos, cada um nas próprias partes | Planejar após 01; executar conforme 03/04/05 ficarem prontos; incluir 06 se integrado |
| 08 — Preparar a entrega acadêmica | README, PDF, TXT, pitch e ZIP conferidos contra o enunciado | Grupo, a combinar | Entregáveis 02 a 07 disponíveis |

## Critérios para detalhar os futuros tickets

### 01 — Base compartilhada

- Contrato revisado, incluindo exemplos de sucesso/erro, token, campos e rotas; decisões adicionais ainda sugeridas devem ser aceitas ou ajustadas conjuntamente.
- Confirmar comportamento de PUT completo e exibição de total parcial, sem aumentar o escopo.
- Colega propõe backend e banco; React Native é confrontado com o conteúdo da disciplina.
- Usar os mesmos códigos, categorias e unidades na carga inicial, simulador e respostas simuladas do app.
- Registrar o acordo e a divisão de responsabilidades em arquivos locais. Nenhuma tecnologia pendente deve ser presumida como permitida.

### 02 — Banco

- Modelo inicial candidato: usuário, serviço, lixeira e pesagem; o colega pode ajustá-lo respeitando pelo menos quatro entidades e o domínio.
- Garantir um serviço por data/tipo e um peso por categoria/serviço, com integridade referencial e exclusão coerente das pesagens.
- Carga fictícia identificada como demonstração; dados compatíveis com os exemplos do contrato.
- Verificar execução do SQL e das cinco consultas, registrando a forma de reproduzir.

### 03 — API e segurança

- Login e listar/detalhar/criar/atualizar/excluir serviços, mais prévia sem gravação.
- Identificar categoria e tara pelo RFID; calcular e validar pesos no backend; gravar somente após confirmação.
- Rejeitar RFID desconhecido, peso menor que a tara e duplicação de serviço. Corrigir substitui o valor anterior.
- Senha em hash e pelo menos três práticas verificáveis. Proposta mínima: validação de entrada, consultas parametrizadas/ORM para proteção contra SQLi e autenticação nas operações protegidas. Detalhar com o colega conforme conteúdo estudado.
- Controller, Service e Repository; status e documentação de todas as operações; comandos de execução documentados.

### 04 — App

- Login, histórico, registro e detalhes, com navegação sem pontos sem saída e feedback nas ações.
- Usar um adaptador de dados para começar com respostas simuladas e depois conectar a API, sem reescrever as telas.
- RFID reconhece a categoria automaticamente; controles de demonstração não representam seleção manual da categoria pelo funcionário.
- Mostrar peso líquido, categorias pendentes, zero confirmado e correções sem soma duplicada.
- Confirmação antes de excluir; excluir remove o serviço da lista. Falha de gravação não pode ser apresentada como sucesso.
- Interface legível e responsiva; não incluir tela de cadastro de lixeiras.

### 05 — Simulador

- Produzir leituras identificadas como simuladas, com código RFID e peso bruto; não fornecer peso líquido como substituto do cálculo real.
- Cenários de duas lixeiras, zero descarte, etiqueta desconhecida e peso abaixo da tara.
- Demonstrar a identificação da lixeira, cálculo e validação disparados pelos dados, além de mostrar os valores de entrada.
- Forma de conexão com o app/API definida no acordo do ticket 01. Sem exigir fila, WebSocket ou outra infraestrutura adicional.

### 06 — Integração

- Demonstrar: autenticar, receber identificação/peso, conferir a prévia, confirmar, consultar e corrigir.
- Não perder a possibilidade de demonstrar as partes separadamente.
- Se a entrega seguir separada, declarar essa condição no README e no pitch, sem apresentar respostas simuladas como integração real.

### 07 — Testes

- Preparar o plano cedo; não esperar a integração para testar banco, API, app e IoT.
- Pelo menos oito casos com cenário, entrada, saída esperada e status. Cobrir sucesso, erro e as regras relevantes; incluir login, tara, correção, duplicidade e exclusão conforme o plano final.
- Executar pelo menos cinco e guardar evidência de cada execução. Não simular ou inventar resultados de testes.
- Organizar plano e evidências para o PDF final.

### 08 — Entrega

- README permite executar cada parte e declara uso de IA revisado e compreendido.
- PDF com integrantes e entregáveis de cada parte, incluindo ER, plano de testes e evidências.
- Justificativa documental com fontes verificadas, cidadão beneficiado, limites da proposta e contribuição aos ODS, sem alegar entrevistas ou redução comprovada do desperdício.
- TXT com nome do grupo, RM/nome de cada integrante e link público do pitch; link também no README.
- Pitch de até três minutos demonstra o protótipo; conferir acesso público do vídeo.
- ZIP com todo o código e documentos exigidos. Uma entrega do grupo até 19/11/2026, às 23h55.

## Como trabalhar em paralelo

Após o acordo de 01, Lucas pode avançar no app com respostas simuladas e na simulação enquanto o colega trabalha em banco e API. O plano de testes pode ser preparado no mesmo período. A integração espera as partes, mas não bloqueia a verificação individual.

O ticket 01 não exige fechar toda a implementação do colega: basta um contrato compartilhado, tecnologias permitidas e responsabilidades combinadas. Caso algum trecho ainda esteja pendente, os tickets afetados permanecem `needs-info`, sem impedir documentação ou revisão de partes independentes.

## Comentários

### 12/11/2026

Proposta inicial para revisão da divisão por Lucas. Não foram publicados tickets em `issues/`, definidos caminhos de código ou escolhidas tecnologias de backend pelo assistente. Detalhar cada ticket após revisão da divisão e sem transformar propostas do contrato em decisões aprovadas.
