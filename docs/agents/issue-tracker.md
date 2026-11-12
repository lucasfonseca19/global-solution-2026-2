# Acompanhamento: Markdown local

## Escopo

Esta configuração pertence à Global Solution. Sua raiz é `global-solution-2026-2/` dentro do workspace FIAP. Todos os caminhos abaixo são relativos à raiz desse projeto.

## Convenções

- Um assunto por diretório: `.scratch/<assunto>/`.
- O assunto inicial é `merenda`.
- Contexto e decisões pendentes em `.scratch/merenda/map.md`.
- Especificação em `.scratch/merenda/spec.md`, criada quando houver definição suficiente.
- Um arquivo por ticket em `.scratch/merenda/issues/NN-descricao.md`, numerado a partir de `01`.
- Cada ticket informa título, comportamento esperado, critérios de aceite, dependências e `Status:`.
- Comentários e andamento são acrescentados em `## Comentários`.
- Não criar issues, PRs ou integrações em serviços externos.

## Tradução das operações das skills

- Publicar no tracker: gravar arquivos locais nos caminhos acima.
- Consultar ticket: ler o arquivo indicado, inclusive comentários.
- Dividir em tickets: propor unidades demonstráveis e dependências; publicar após revisão da divisão pelo aluno.
- Escolher próximo ticket: selecionar um pronto cujas dependências estejam concluídas.
- Iniciar e concluir: registrar o andamento e a evidência; não marcar concluído sem verificar seus critérios de aceite.

Para `wayfinder`, quando explicitamente usado, registrar `Type:`, `Blocked by:` e os estados próprios de exploração `open`, `claimed` e `resolved`. Esses estados não substituem os estados de implementação descritos em `triage-labels.md`.
