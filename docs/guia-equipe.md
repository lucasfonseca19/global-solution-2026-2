# Guia rápido para o grupo

## O que vamos entregar

MVP de uma escola para medir dois tipos de descarte: sobra não servida destinada ao descarte e restos comestíveis dos pratos. Um serviço é identificado por data e tipo de refeição; não pode haver dois serviços para a mesma combinação.

Ao final do serviço, uma lixeira identificada por RFID é colocada na balança. O sistema identifica sua categoria, desconta a tara cadastrada e mostra o peso líquido para confirmação. Balança e RFID são simulados com cenários controlados. A prévia calcula e valida sem salvar; confirmar grava. Correções substituem o peso anterior. Excluir um serviço exige confirmação e remove suas pesagens.

Quatro telas: login, histórico, registro e detalhes. Lixeiras pré-cadastradas, um perfil de usuário, pesos em kg, categorias sem confirmação marcadas como pendentes. Sem medir produção, contar refeições, gerenciar escolas ou emitir alertas por limite.

## O que precisamos combinar agora

1. **Tecnologias:** colega propõe backend e banco, respeitando o conteúdo até a fase 4; confirmar React Native no conteúdo permitido.
2. **Contrato:** revisar [operações e exemplos](../.scratch/merenda/api-contract.md), aceitando ou ajustando os nomes, formatos e comportamentos ainda propostos. Sete operações discutidas: login; listar, detalhar, criar, atualizar e excluir serviços; avaliar leitura sem gravar.
3. **Divisão:** revisar a [proposta de entregas](../.scratch/merenda/tickets-proposal.md). Lucas prefere o front; as responsabilidades finais precisam ser combinadas.

Não precisamos fechar toda a estrutura interna do backend para começar o app. Após o acordo do contrato, o front pode usar respostas simuladas com os mesmos dados enquanto banco e API são implementados.

## Espaço de contribuição

A especificação registra o que Lucas discutiu, não aprovação prévia do colega. Linguagem, banco, estrutura de tabelas e detalhes internos são propostas a construir em conjunto. Se uma sugestão mudar os dados ou o comportamento esperado pelo app, atualizar o contrato e registrar o acordo antes de as partes divergirem.

Manter o mínimo acadêmico: pelo menos quatro entidades, cinco consultas, seis endpoints (a proposta atual tem sete), quatro telas, senha em hash, três práticas de segurança, dois dispositivos simulados e oito casos de teste com cinco execuções evidenciadas. Conferir todos os detalhes no [enunciado](../ENUNCIADO.md).

## Como trabalhar

- Planejar integração; se não ficar pronta a tempo, demonstrar as partes separadamente com dados coerentes e declarar essa condição.
- Usar os mesmos exemplos na carga inicial, simulador e respostas simuladas do front.
- Documentar execução e guardar evidências conforme cada parte fica pronta.
- Acompanhamento em arquivos Markdown versionados; não é necessário usar GitHub Issues.
- Ler a [especificação](../.scratch/merenda/spec.md) antes de implementar. Ela e o contrato ainda estão em revisão; não iniciar código apenas a partir deste guia.

Esta base é um convite à revisão conjunta, não uma arquitetura fechada para o colega executar.
