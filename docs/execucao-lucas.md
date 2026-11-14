# Roteiro para arquitetar e executar a parte de Lucas

Status: ready-for-human

14/11/2026. Handoff para uma nova sessão no mesmo projeto. A divisão em quatro entregas foi aprovada por Lucas. Este documento autoriza planejar a execução orquestrada; a implementação começa na nova sessão após Lucas aprovar a arquitetura mínima. Nenhum código foi implementado na sessão de definição.

## Objetivo

Entregar toda a parte de Lucas, próxima do mínimo acadêmico: app React Native com Expo e suporte web local, simulação de RFID/balança, verificações e evidências, documentação de execução e um guia claro do que e como testar.

Banco, API real e sua segurança pertencem ao colega, que aceitou a divisão, mas ainda não revisou o contrato nem escolheu tecnologias. Não bloquear o app demonstrativo por isso, não implementar o backend por ele e não tratar contrato proposto como acordo já aprovado pelo colega.

## Leitura inicial obrigatória

Ler primeiro as orientações do projeto e as decisões existentes, sem reconstruir toda a discussão:

- [AGENTS.md](../AGENTS.md), [CONTEXTO.md](../CONTEXTO.md), [ENUNCIADO.md](../ENUNCIADO.md) e [GLOSSARY.md](../GLOSSARY.md).
- [Especificação](../.scratch/merenda/spec.md) e [contrato provisório](../.scratch/merenda/api-contract.md).
- [Planejamento do app](../.scratch/merenda/app-planning.md), [proposta de interface](pesagem-proposta.md) e [orientações mobile](agents/mobile.md).
- Os quatro tickets abaixo, completos, incluindo comentários e bloqueadores. Os oito tickets antigos são um mapa amplo das frentes, não uma ordem para implementar o projeto inteiro.

## Tickets aprovados

| Ordem | Ticket | Dependências |
| --- | --- | --- |
| 1 | [09 — Entrar e consultar](../.scratch/merenda/issues/09-entrar-consultar.md) | Arquitetura mínima, definições pendentes e verificação alinhadas com Lucas |
| 2 | [10 — Registrar e simular](../.scratch/merenda/issues/10-registrar-simular.md) | 09 |
| 3 | [11 — Corrigir e repetir](../.scratch/merenda/issues/11-corrigir-repetir.md) | 10 e política de dados escolhida |
| 4 | [12 — Verificar e documentar](../.scratch/merenda/issues/12-verificar-documentar.md) | 09, 10 e 11 |

Cada entrega inclui seus próprios testes e documentação. O ticket 12 consolida e confere; não adiar todas as verificações para o final.

## Etapa 1: arquitetura mínima, antes de código

Inspecionar o estado real do repositório e preservar qualquer trabalho novo do colega. Não pressupor que a pasta ainda contém somente documentos.

Fechar as poucas decisões ainda abertas com recomendações simples, em uma rodada curta sempre que possível:

1. Direção da tela de pesagem e posição dos controles de demonstração. Uma leitura ativa, categoria reconhecida automaticamente e resumo das duas categorias são propostas de interface, ainda para revisão.
2. Persistência dos dados simulados ao fechar/reiniciar e restauração dos exemplos. Não presumir que já foram aprovadas.
3. Como verificar comportamento no app e no adaptador de dados; testar efeitos observáveis, evitando testes que apenas espelhem detalhes de componentes.

Usar `grill-with-docs` nas dúvidas reais e `to-spec` para consolidar o que foi decidido, incluindo as verificações combinadas. A granularidade de 09 a 12 já foi aprovada; não reiniciar uma grande entrevista, aumentar o escopo ou publicar outra divisão sem necessidade.

Apresentar uma arquitetura curta com navegação, dados, simulação, validação, política de persistência, ferramentas mínimas de teste e distribuição dos subagentes/modelos. Não precisamos de uma arquitetura de produção. Pedir revisão de Lucas antes de instalar dependências de aplicação, criar código ou executar os tickets.

Após essa aprovação, registrar decisões e remover somente os bloqueadores resolvidos dos tickets. A restrição anterior de não codificar pertencia à fase de definição; a nova sessão estará autorizada a implementar os quatro tickets após a aprovação de arquitetura, sem pedir nova autorização para cada passo rotineiro.

## Skills e limites de escopo

- Usar `vercel-react-native-skills` ao desenvolver e revisar React Native/Expo. Instalada em `/Users/lucas/.codex/skills/vercel-react-native-skills`; se não estiver carregada, ler o `SKILL.md` e as regras pertinentes.
- Usar Interface Craft para hierarquia, clareza e acabamento visual. A skill foi indicada por Lucas em `/Users/lucas/.agents/skills/interface-craft/SKILL.md`. Não instalar DialKit ou bibliotecas de animação apenas por causa dela.
- Aplicar o fluxo de Matt Pocock configurado no FIAP. As skills locais ficam em `/Users/lucas/FIAP/.agents/skills/`. Respeitar também os estados e o tracker Markdown do projeto.
- Aplicar as instruções pertinentes de teste/revisão das skills de implementação disponíveis, sem multiplicar tarefas, documentos ou cerimônias sem necessidade.
- Não adicionar hospedagem, publicação em loja, PWA, offline, múltiplas escolas, papéis, cadastro de lixeiras ou infraestrutura de eventos.
- Não introduzir bibliotecas para necessidades inexistentes; escolher o menor conjunto compatível com mobile e web e verificar a documentação atual antes de usar APIs.

## Etapa 2: orquestração e escolha de modelos

Lucas solicita explicitamente implementação por subagentes e autoriza escolher o modelo/esforço de cada um. Manter um orquestrador responsável pela coerência, dependências, revisão dos resultados e entrega completa.

Preferências propostas, condicionadas ao suporte real da sessão:

| Papel | Modelo e esforço preferidos | Responsabilidade |
| --- | --- | --- |
| Arquitetura e revisão independente | `gpt-6.1-sol`, `high` | Decisões, análise de riscos e aderência ao escopo/contrato |
| Implementação de cada entrega | `gpt-6.1-sol`, `medium` | Código, testes de comportamento e correções; elevar esforço se surgir dificuldade concreta |
| Documentação e conferências mecânicas | `gpt-6-luna`, `high` | Redigir a partir de resultados reais, conferir links e consolidar instruções; validação técnica final permanece com orquestrador/revisor |

Essas preferências são uma recomendação para este projeto, não promessa de disponibilidade ou de custo. Consultar modelos e esforços realmente expostos pelas ferramentas da nova sessão. Se algum não existir ou a seleção não for suportada, informar a limitação e usar o disponível mais adequado; não alegar uma troca de modelo que não foi realizada.

Ao selecionar um modelo diferente para um subagente, usar contexto novo e fornecer um briefing explícito e focado, respeitando as ferramentas disponíveis. Não depender de herança integral de uma conversa enorme. Não criar arquivos globais de configuração ou mudar modelos de toda a conta para cumprir esse pedido.

Subagentes custam trabalho adicional; manter uma equipe pequena. Um implementador por entrega e um revisor independente são suficientes. Documentação/conferências podem ser delegadas quando houver resultados estáveis. Não criar um agente por arquivo, componente ou critério.

## Disciplina de execução

1. Trabalhar 09 → 10 → 11 → 12, respeitando os bloqueadores reais. Não executar os quatro em paralelo.
2. Para cada delegação, informar objetivo, critérios de aceite, referências, escopo de edição, dependências concluídas e resultado esperado.
3. Dar ao revisor contexto separado do implementador. O revisor confere diff, comportamento, limites da entrega e evidências; o orquestrador resolve os achados antes de avançar.
4. Paralelizar somente tarefas independentes. Evitar agentes editando os mesmos arquivos simultaneamente. O orquestrador faz a revisão/integração das alterações e os commits, evitando disputas de Git entre agentes.
5. Executar a aplicação e verificações apropriadas em cada etapa. Não aceitar “funciona” apenas porque o implementador disse; inspecionar resultados e corrigir falhas.
6. Atualizar status/comentários dos tickets e READMEs com o que realmente foi feito. `done` exige critérios atendidos e evidências; um plano ou código escrito não bastam.
7. Preservar trabalho existente e fazer commits coerentes por entrega verificada. O repositório privado foi autorizado para código/documentação do grupo; não abrir GitHub Issues ou enviar mensagens.
8. Após aprovação da arquitetura, seguir até concluir a parte de Lucas, sem parar após a primeira tela, scaffold ou descrição de próximos passos. Pedir informação somente quando houver decisão genuinamente necessária ou impedimento externo.

## Dados simulados e integração

Usar adaptador de dados baseado no contrato provisório. Identificar claramente que login e API são simulados nessa versão. Código/peso vêm da simulação; a associação da lixeira, a tara, o cálculo e a validação devem ser executados, não substituídos por resultados prontos.

Manter simulador independente demonstrável e usar os mesmos cenários na interface. Prévia não grava; confirmar grava. Correção substitui peso anterior. Não confundir pendência com zero.

Se a API real estiver disponível e seu contrato for acordado, avaliar a conexão prevista no ticket amplo 06. Caso contrário, concluir o app e a IoT simulados e explicar como conectar depois, sem construir um backend paralelo ou marcar integração real como concluída.

## Definição de entrega completa da parte de Lucas

- Quatro telas funcionais, navegáveis, com apresentação cuidada e foco no uso, sem ampliar o produto.
- Simulação de RFID e balança com dois tipos de descarte, cenários válidos/inválidos e ações visíveis dos dados.
- Execução local web reproduzível e verificação também em mobile. Não usar apenas emulação de viewport de navegador como prova de execução nativa.
- Pelo menos oito casos de teste planejados e cinco executados com evidência individual real, incluindo erros, conforme o enunciado. Não inventar prints, logs ou resultados.
- READMEs de mobile/IoT com pré-requisitos, versões usadas, instalação, comandos reais, credenciais fictícias, cenários e problemas conhecidos.
- Relatório da implementação da parte de Lucas, em português: o que foi feito, decisões, estrutura, limitações e adaptação futura para a API real. Aproveitável no PDF final do grupo, sem afirmar que o backend/colega já entregou sua parte.
- Guia de testes para Lucas: passo a passo, entradas, resultados esperados, evidências produzidas e o que ainda precisa verificar manualmente.
- Roteiro curto de demonstração da parte de Lucas para compor o pitch do grupo, cujo limite total é três minutos.
- Declaração de uso de IA e resumo das mudanças, verificações executadas e pendências reais.

Se não for possível verificar algum ambiente, especialmente mobile, registrar o impedimento e instruções precisas para Lucas, sem alegar teste realizado nem marcar o critério obrigatório como concluído. Resolver tudo que independe desse impedimento.

## Formato da primeira resposta da nova sessão

Após ler os arquivos, apresentar: resumo do escopo, lacunas realmente restantes, recomendações simples, arquitetura proposta, verificações e tabela de papéis/modelos disponíveis. Pedir aprovação desse plano mínimo. Ainda sem código nessa primeira etapa.

## Referência sobre subagentes

Consultada a [documentação oficial de subagentes](https://learn.chatgpt.com/docs/agent-configuration/subagents.md), em 14/11/2026, sobre escolha explícita de modelo/esforço, delegação e limites de paralelismo. Os parâmetros concretos das ferramentas da sessão prevalecem; não assumir a disponibilidade de um modelo somente por estar citado neste roteiro.
