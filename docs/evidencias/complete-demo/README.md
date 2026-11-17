# Demonstração com dados e pesagem local

Correção de 17/11/2026, solicitada por Lucas: o botão Demonstração estava abrindo um adaptador vazio que ainda dependia da ponte. Agora abre as mesmas telas com exemplos fictícios e simulação de pesagem no próprio app. O modo API não foi alterado e continua usando somente seu banco e a ponte separada.

- Seis almoços históricos concluídos, almoço de hoje parcial (3kg) e jantar de hoje concluído (3kg). No Histórico, o filtro padrão Almoço exibe sete registros e pontos/média apenas dos concluídos.
- Dados fictícios identificados, criados somente no primeiro acesso na chave nova `merenda.servicos.demonstracao.v1`. Após alterações, o estado é persistido. Não sobrescreve/importa `merenda.servicos.aprovado.v1`, `merenda.servicos.v1` ou PostgreSQL.
- No modo demo, escuta de sensores externos desativada. Cozinha3kg e Pratos2kg acionam o mesmo fluxo de leitura, identificação, tara, animação e confirmação. Outros cenários inclui correção2,5kg, zero, RFID desconhecido e bruto abaixo da tara. Prévia não grava; ciclo/confirmar/concluir mantidos.
- No modo API, controles internos ausentes e ponte externa preservada. Troca de modo continua encerrando sessão e não é oferecida na pesagem.

## Evidências

[52 testes de unidade](unit.txt) e [TypeScript](typecheck.txt) passaram. [Exportação iOS](ios-export.txt) passou; não comprova a interação no iPhone.

[Sete cenários web](web.json), [saída](web.txt), executados com URLs de API/ponte propositalmente indisponíveis (`127.0.0.1:1` e `:2`). Não houve nenhuma chamada a essas URLs. Demonstrados: Home/Histórico preenchidos, gráfico, erros de RFID/tara sem gravação, criação3+2=5kg, conclusão explícita, correção para4,5kg e persistência após recarregar/reentrar. Não foi limpo nenhum armazenamento pessoal.

Capturas: [Home](home.png), [Histórico](historico.png), [controles locais](pesagem-local.png). O painel de cenários aparece no fluxo de pesagem e rola junto da tela; controles ficam desabilitados até confirmar/descartar ou iniciar novo ciclo.

[Regressão de modos](modes/web.json), [saída](modes.txt): nova rodada contra API real apenas para login/consulta, sem transferir ou excluir registros do banco do iPhone. Inclui resposta de login atrasada. O roteiro vazio anterior com ponte (`simulator-qa.cjs`) é histórico; para a demonstração atual, executar `complete-demo-qa.cjs` com o app nas configurações offline acima e porta18096. `native-navigation-qa.cjs` foi atualizado para o novo conjunto de exemplos/controles.

Servidor de QA encerrado após testes. Expo do iPhone permanece na porta18094, API18080 e ponte18095. Recarregar o app por completo para descartar o adaptador vazio preservado pelo Fast Refresh e tocar Demonstração. Não é necessário reinstalar o Expo Go ou limpar dados. Sem push.
