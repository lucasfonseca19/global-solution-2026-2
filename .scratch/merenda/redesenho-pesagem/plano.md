# Execução do redesenho da pesagem — 17/11/2026

Autorização: Lucas aprovou o protótipo 03 e pediu aplicar e conferir o enunciado. Sem push, integração real ou alterações visuais na Home/Histórico. Worktree existente, sem descartar trabalho local.

Usando writing-plans e executing-plans para execução direta. Referência visual: protótipo temporário v3; regras: ADR 0001 no checkout principal e ADR 0002 local.

- [x] Dados: registros individuais com ID, ciclo explícito, repetição idempotente, totais por categoria, conclusão explícita com ambas as categorias (zero válido), correção preserva conclusão, validação temporal e escrita atômica.
- [x] UI: identificar → pesar (régua + número) → estabilizar → confirmar manualmente; RFID/tipo discretos; detalhes recolhidos; nova pesagem, descartar, corrigir registro; erros sem sucesso falso; bloquear leitura pendente na conclusão e descarte antes de sair.
- [x] Verificar unidade, TypeScript, fluxo web e regressões Home/Histórico; compilar iOS se viável sem confundir com runtime.
- [x] Registrar evidências e cobertura dos requisitos acadêmicos. Não implementar backend/banco nem preparar entrega final nesta etapa.

Arquitetura: estender o adaptador simulado com operações próprias para confirmação individual e conclusão. Manter o contrato legado para a versão original, que continua separada pela flag de prévia. `Servico.pesagens` permanece uma projeção de totais por categoria para compatibilidade da Home/Histórico; `registros` identifica cada contribuição. Registros antigos são convertidos ao acessar o novo fluxo. Não alterar os dados originais no disco por migração destrutiva.

Riscos a verificar: repetição após falha; duplo clique; corrigir após concluir; categoria errada na correção; meia-noite; saída com prévia; zero sem assumir ausência; agregado sem identificação enganosa nos detalhes.

## Resultado

32 testes de unidade, dois da CLI e seis fluxos legados passaram; TypeScript passou. Novo roteiro web verificou 16 cenários, incluindo cancelamento/retentativa, meia-noite, movimento reduzido e telas 320/1280 px, sem erro de página. Bundle iOS exportado; runtime nativo permanece pendente. Revisão independente identificou dois problemas de estado/navegação, corrigidos com verificação de regressão.

Decisão de compatibilidade: app original e suas operações legadas continuam disponíveis; interface aprovada é selecionada pela flag de prévia. Não promover silenciosamente o protótipo nem trocar persistência local do app original por memória. Orientação de execução e limite documentados nos READMEs.

Cobertura: docs/ux/cobertura-enunciado-pesagem.md. Evidências: docs/evidencias/weighing-redesign/. Sem push, commit, PR ou alteração em backend/database.
