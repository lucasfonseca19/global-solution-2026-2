# 04 — Entregar as quatro telas com dados simulados

Status: ready-for-human
Responsável: Lucas
Blocked by: nenhum para a versão com respostas simuladas

## Comportamento esperado

Construir o app React Native do [MVP](../spec.md), inicialmente independente do backend. Usar os exemplos do [contrato provisório](../api-contract.md) por uma camada de acesso aos dados, para adaptar a conexão posteriormente sem reescrever as telas.

## Critérios de aceite

- [ ] Quatro telas funcionais: login, histórico, registro e detalhes; navegação sem pontos sem saída.
- [ ] Login demonstrativo permite navegar; deixar explícito no README que autenticação simulada não comprova senha em hash nem segurança da API.
- [ ] Histórico mostra serviços por data e tipo de refeição; detalhes mostram categorias e totais.
- [ ] Registrar/continuar um serviço, confirmar um peso e corrigir o anterior sem somar leituras duplicadas.
- [ ] Exibir categoria aguardando pesagem e aceitar zero confirmado; serviço pendente enquanto faltar categoria.
- [ ] Identificação automática por RFID no comportamento simulado, com tara e peso líquido; funcionário não escolhe a categoria manualmente.
- [ ] Mostrar os erros de etiqueta desconhecida e peso abaixo da tara; não gravar leitura inválida.
- [ ] Pedir confirmação antes de excluir serviço e pesagens; cancelar preserva os dados.
- [ ] Interface legível, responsiva e com feedback nas ações; nenhuma tela de gerenciamento de lixeiras.
- [ ] A camada de respostas simuladas preserva as operações e exemplos documentados. Estados de edição ficam separados dos pesos confirmados.
- [ ] Documentar como executar e reproduzir o fluxo; registrar verificações para 07.

## Dependências e limites

React Native confirmado por Lucas como conteúdo abordado até a fase 4. Revisão do colega não bloqueia os dados simulados. Rotas e detalhes do contrato permanecem provisórios: concentrar mudanças na camada de dados e registrar ajustes após 01. A chegada de leituras pode ser simulada nesta versão sem aguardar o ticket 05; a conexão entre as partes pertence a 06.

`ready-for-human` indica escopo disponível para Lucas; não é registro de início ou autorização para o assistente implementar código nesta conversa. Ainda não há implementação.

## Comentários

### 14/11/2026

Lucas confirmou que React Native foi abordado até a fase 4. App com respostas simuladas liberado no planejamento, sem depender da escolha de backend/banco. React Native não implica escolha já aprovada de Expo, bibliotecas de UI ou ferramentas de execução.
