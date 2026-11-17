# Plano e execução dos testes da API

Revisado em 17/11/2026 para contribuições individuais, conclusão explícita e dia da escola. O comportamento antigo de PUT substituidor/alerta foi removido. Executar `mvn test` em `backend/`.

A suíte sobe controllers, services, repositórios e segurança com H2; testes comuns desfazem a transação. A concorrência usa transações reais separadas em quatro threads e exclui o serviço criado. O relógio controlado fixa 18/11 às 01h UTC, ainda 17/11 em São Paulo, e avança para 03h UTC para verificar a virada. Estes testes não comprovam runtime PostgreSQL.

| Caso/método | Verificação |
| --- | --- |
| CT-01 loginValido | Token, usuário sem senha/hash |
| CT-02 loginSenhaErrada | 401 genérico |
| CT-03 semToken | Sem token/falso: 401 |
| CT-04 senhaEmHash | BCrypt diferente do texto puro |
| CT-05 bloqueiaXss | Refeição com script: 400 |
| CT-06 sqlInjectionNoLogin | Entrada de SQL não autentica |
| CT-07 avaliarLeituraValida | RFID, categoria, tara e líquido |
| CT-08 rfidDesconhecido | RFID desconhecido: 400 |
| CT-09 pesoAbaixoDaTara | Bruto menor que tara: 400 |
| CT-10 zeroConfirmado | Bruto igual à tara: líquido zero |
| contribuicoesReplayCorrecaoConclusao | 3+1+2=6; replay=6; correção=5,5; conclusão explícita/repetida; correção mantém status; nova contribuição bloqueada; exclusão 204/404 |
| conflitoReplayEDaLixeiraNaoAlteram | Payload divergente e outra lixeira: 409 sem alterar total |
| zeroEConclusaoExigemDuasCategorias | Ausência bloqueia, zero nas duas permite concluir |
| diaDoServidorLimitaEscritaEHistoricoContinuaConsultavel | Serviço antigo consultável; criação, correção adulterada, exclusão e conclusão bloqueadas |
| validacaoEMetodosAntigos | Máximo/precisão/negativo; antigos POST/PUT retornam 405 |
| viradaDoDiaBloqueiaConfirmacaoECorrecaoEExclusao | Virada UTC/São Paulo invalida ciclo/replay, exclusão e conclusão |
| tokenExpiradoNaoAutoriza | JWT assinado e expirado: 401 |
| confirmacoesConcorrentesCriamUmServicoESomamSemDuplicar | 4 threads, 3 ciclos distintos, refeição com case/acento/espaços distintos: 1 serviço, 3 registros, total 3 |

| replayAposExcluirNaoRessuscitaServico | Exclusão conserva ciclo/hash; replay retorna 409 SERVICO_EXCLUIDO; payload divergente continua conflitante |
| preservaAcentosDeRefeicaoEIdentificaVariacoes | Preserva Café da manhã e encontra o mesmo serviço para CAFE DA MANHA |

Evidências individuais: [`evidencias/README.md`](evidencias/README.md).

Evidência da execução: [`evidencias/testes-api.txt`](evidencias/testes-api.txt), XML e TXT por classe no mesmo diretório. O log [`evidencias/tdd-red.txt`](evidencias/tdd-red.txt) preserva a primeira execução com os testes novos antes das mudanças (6 falhas porque `/pesagens` ainda não existia). O relatório final registra a quantidade efetivamente executada e o resultado; conferir seu resumo ao repetir.

Testes PostgreSQL e migração são mantidos separadamente em [`../../database`](../../database/README.md). Não interpretar resultados históricos da unicidade por categoria como regra atual.
