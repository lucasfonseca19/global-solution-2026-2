# Pesagens e alterações somente no dia atual

17/11/2026. Decisão funcional aprovada por Lucas: novas pesagens, correções e exclusões são permitidas somente no dia atual. Em resposta à pergunta específica sobre exclusão, Lucas confirmou que o histórico anterior fica apenas para consulta.

## Regra

- A data do serviço é determinada pelo dia atual, sem campo para escolher outra data.
- Serviços de qualquer outro dia, passado ou futuro, são somente consulta. Isso inclui serviços antigos pendentes: não oferecer retomada, correção ou exclusão.
- Conferir tanto a data original do serviço quanto a data enviada ao atualizar. Não permitir deslocar um registro antigo para hoje e depois alterá-lo.
- Revalidar o dia em cada criação, atualização e exclusão. Uma pesagem aberta antes da meia-noite não pode ser confirmada depois com a data anterior.
- Consultas, gráficos e médias preservam os registros anteriores. Os parciais continuam identificados e excluídos da comparação de concluídos.
- Refeições e serviços de hoje mantêm as ações já autorizadas. A nova regra temporal não implementa múltiplas pesagens nem conclusão explícita, que permanecem uma etapa separada.

## Aplicação e integração

Implementada na worktree da prévia, no app e no adaptador simulado compartilhado com a versão original. A simulação usa o calendário local do dispositivo e atualiza o estado visual à meia-noite e ao retornar ao app. As operações de escrita validam novamente o relógio, além do bloqueio visual.

O backend real ainda não foi integrado nem alterado nesta rodada. Ao integrar, ele deve aplicar a mesma regra usando uma data confiável e um fuso da escola definido no contrato; validar o relógio do cliente não comprova essa proteção no servidor.

Restaurar exemplos é um controle explícito de demonstração/teste, não uma operação de pesagem da escola. Ele continua substituindo o conjunto fictício após confirmação, sem representar permissão para alterar registros em produção.

Verificações, evidências e comandos: `docs/evidencias/current-day/README.md` na worktree de implementação.
