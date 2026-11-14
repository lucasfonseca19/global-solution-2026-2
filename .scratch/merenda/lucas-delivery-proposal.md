# Proposta: quatro entregas para a parte de Lucas

Status: needs-triage

14/11/2026. Proposta para revisão de Lucas, ainda sem novos tickets individuais publicados. Não autoriza implementação nesta conversa. Complementa a [especificação](spec.md) e o [planejamento do app](app-planning.md).

## Resultado desejado

Entregar a parte de Lucas: app React Native com Expo e suporte web, simulação de RFID/balança, verificações e evidências das suas partes, documentação do que foi feito e instruções claras de execução e teste. O resultado deve ser demonstrável sem esperar o backend do colega, usando o contrato provisório por uma camada de acesso aos dados.

Banco, API real e sua segurança permanecem com o colega. Integrar se estiverem disponíveis e compatíveis; caso contrário, documentar a alternativa simulada sem alegar integração ou autenticação real. O objetivo não é entregar sozinho todas as partes do grupo.

## Divisão proposta para revisão

Os números são candidatos aos próximos tickets, preservando os oito existentes como mapa das frentes. Não renumerar, fechar como implementado ou apagar o histórico anterior.

| Candidato | Comportamento completo entregue | Bloqueado por |
| --- | --- | --- |
| 09 — Entrar e consultar serviços de exemplo | Projeto executável localmente; login demonstrativo; histórico e detalhes navegáveis usando dados de exemplo pelo adaptador; estados vazio e erro de login verificáveis | Definição mínima do app e acordo sobre como verificar o comportamento, antes de implementar |
| 10 — Registrar descarte com RFID e balança simulados | Criar/continuar um serviço, receber código/peso de cenários controlados, reconhecer lixeira, calcular tara, conferir prévia e confirmar as duas categorias; histórico/detalhes refletem o resultado | 09 |
| 11 — Corrigir e excluir registros e repetir a demonstração | Corrigir sem duplicar pesos, excluir com confirmação/cancelamento, preservar o estado conforme a política escolhida e restaurar exemplos para repetir a apresentação | 10 e definição da duração dos dados simulados |
| 12 — Verificar a entrega e documentar execução e testes | Conferência geral mobile/web, plano acadêmico, execuções evidenciadas, relatório da parte de Lucas e roteiro reproduzível de demonstração/teste | 09, 10 e 11 |

São entregas por comportamento, não tickets isolados de componentes, estado ou instalação. Configuração mínima pertence a 09; evolução dos dados simulados, interface, regras e verificação pertence a cada comportamento que a exige. Cada entrega deve poder ser demonstrada sem depender de uma etapa posterior.

## Critérios a levar aos tickets após aprovação

### 09 — Entrar e consultar

- App com quatro telas previstas, implementando nesta entrega login, histórico e detalhes de exemplos; a tela de registro será implementada em 10, sem controles visíveis que prometam funcionalidade inexistente nesta etapa.
- Comandos reais documentados e repetíveis; execução local web e caminho de demonstração mobile verificados na entrega final.
- Login demonstrativo com sucesso/erro, explicitamente distinguido de segurança/autenticação do backend.
- Histórico e detalhes usam camada de acesso a dados baseada no contrato provisório; UI não depende de servidor real.
- Hierarquia visual simples e legível; direção proposta em [pesagem-proposta.md](../../docs/pesagem-proposta.md) ainda precisa de revisão para o registro em 10.
- Verificações de comportamento e instruções de teste desta entrega registradas já em 09.

### 10 — Registrar e simular

- Completar a tela de registro sem criar telas extras de gerenciamento.
- Identificar automaticamente pelo RFID; o funcionário não escolhe a categoria manualmente. Controles de cenário são explicitamente de demonstração.
- Simulador independente produz código/peso; consumidor simulado faz associação, cálculo e validação, sem substituir a API real do colega ou fingir que ela já existe.
- Demonstração independente da IoT e uso dos mesmos cenários na tela, sem fila/broker/hardware ou infraestrutura adicional.
- Prévia não altera pesos confirmados; confirmação atualiza dados do serviço.
- Rejeitar etiqueta desconhecida e bruto menor que tara; aceitar zero válido; diferenciar pendência de ausência de descarte.
- Confirmar duas categorias, mostrar totais e impedir serviço duplicado por data/tipo.
- Documentar e verificar os cenários desta entrega, sem esperar 12 para testar.

### 11 — Corrigir, excluir e repetir

- Nova confirmação da mesma categoria substitui o valor anterior e atualiza totais, sem duplicar.
- Excluir pede confirmação; cancelar preserva dados; confirmar remove serviço e pesagens, preservando os demais serviços.
- Implementar a política de duração dos dados escolhida por Lucas; não presumir que persistência ao reiniciar já foi aprovada.
- Restaurar dados de exemplo é uma proposta a revisar junto dessa política, sem criar uma tela de configurações.
- Documentar e verificar correção, exclusão e repetição dos cenários.

### 12 — Fechar a parte de Lucas

- Verificar os quatro fluxos/telas, legibilidade, navegação, estados e feedback em web e mobile. Não declarar mobile testado somente por funcionar no navegador.
- Plano com pelo menos oito casos, incluindo erros; pelo menos cinco executados com evidência individual real.
- Se algum ambiente não puder ser testado, documentar o bloqueio e o que Lucas deve testar; não marcar como executado nem concluir um critério obrigatório sem evidência.
- READMEs de mobile e IoT com pré-requisitos, execução, credenciais fictícias de demonstração, cenários e testes; nenhum segredo real.
- Relatório em português explicando o que foi implementado, decisões, limitações, dados simulados, arquivos relevantes e verificações executadas. Material aproveitável no PDF final do grupo, sem fingir que já contém os entregáveis do colega.
- Guia de teste manual com passos, entradas, resultado esperado e indicação do que já foi verificado versus o que Lucas ainda deve verificar.
- Roteiro curto da parte de Lucas para o pitch, respeitando que os três minutos pertencem ao vídeo do grupo inteiro.
- Explicar onde conectar a API real depois da revisão do colega. A ausência dela não impede concluir a entrega simulada, que é permitida pelo enunciado.

## Definições remanescentes antes de implementar

Não criar uma arquitetura definitiva ainda. Na etapa de arquitetura da próxima sessão, fechar ou revisar com Lucas:

- Organização/interação da tela de pesagem e controles de demonstração, atualmente uma proposta de Interface Craft.
- Duração dos dados simulados ao fechar/reiniciar e restauração dos exemplos.
- Forma de verificar comportamento pelo fluxo do app e pela interface do adaptador, evitando testes de implementação interna.

Não reabrir a escolha já aprovada de React Native/Expo/web, as quatro telas, as categorias ou o escopo acadêmico sem motivo. Dependências e nomes internos serão propostos na arquitetura, não impostos antes dela.

## Requisitos para o futuro prompt de orquestração

Lucas pediu um prompt para usar em outra sessão, primeiro para arquitetar e depois coordenar a implementação por subagentes. Preparar o prompt após revisão desta divisão. Não iniciar subagentes de implementação nesta conversa.

O prompt deverá instruir a sessão a:

1. Ler as instruções do projeto, enunciado, glossário, especificação, contrato provisório, decisões do app e tickets aprovados, sem reconstruir tudo do zero.
2. Resolver as poucas definições remanescentes em rodadas objetivas e propor a arquitetura mínima antes de código. Preservar revisão da arquitetura por Lucas.
3. Usar o fluxo de planejamento de Matt Pocock, `vercel-react-native-skills` na implementação e Interface Craft para o acabamento necessário, sem adicionar bibliotecas/animações só pela skill.
4. Identificar os modelos realmente disponíveis nessa sessão e escolher por tarefa: arquitetura/revisão, implementação e documentação/verificação. Explicar a distribuição; não pressupor nomes, disponibilidade, preços ou que toda tarefa exige o modelo mais caro.
5. Manter um orquestrador com visão da especificação; delegar uma entrega delimitada por vez, com revisão independente e verificação real antes de avançar. Paralelizar somente trabalhos independentes, com áreas de edição claras para não disputar arquivos.
6. Respeitar a sequência real 09 → 10 → 11 → 12. O uso de vários subagentes não torna essas dependências paralelas.
7. Atualizar os tickets e evidências progressivamente, não marcar como concluído apenas por relato do implementador e não alegar testes mobile, API real ou segurança que não tenham sido verificados.
8. Concluir a parte de Lucas com os documentos e guia de testes descritos acima, deixando explícito o trabalho restante do colega e do grupo.

Esses são requisitos do prompt futuro, não seleção de modelos já realizada ou autorização para instalar ferramentas adicionais de produção.

## Comentários

### 14/11/2026

Criada proposta de quatro entregas após Lucas pedir poucos tickets e um prompt posterior para arquitetura e execução orquestrada em outra sessão. A granularidade, dependências e definições pendentes serão revisadas com Lucas antes de publicar os novos tickets. Nenhum código foi escrito.
