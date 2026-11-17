# Evidências individuais — API

Execução real de `mvn -f backend/pom.xml test`, 17/11/2026. Java 21, Spring Boot, H2 em memória. Resultado: 20 testes, 0 falhas, 0 erros. Não comprova PostgreSQL nem execução nativa do app.

| Método | Resultado | Duração (s) |
| --- | --- | --- |
| `confirmacoesConcorrentesCriamUmServicoESomamSemDuplicar` | Passou | 0.616 |
| `diaDoServidorLimitaEscritaEHistoricoContinuaConsultavel` | Passou | 0.136 |
| `replayAposExcluirNaoRessuscitaServico` | Passou | 0.122 |
| `preservaAcentosDeRefeicaoEIdentificaVariacoes` | Passou | 0.1 |
| `zeroEConclusaoExigemDuasCategorias` | Passou | 0.111 |
| `senhaEmHash` | Passou | 0.083 |
| `validacaoEMetodosAntigos` | Passou | 0.094 |
| `viradaDoDiaBloqueiaConfirmacaoECorrecaoEExclusao` | Passou | 0.097 |
| `bloqueiaXss` | Passou | 0.086 |
| `tokenExpiradoNaoAutoriza` | Passou | 0.078 |
| `sqlInjectionNoLogin` | Passou | 0.148 |
| `conflitoReplayEDaLixeiraNaoAlteram` | Passou | 0.094 |
| `loginSenhaErrada` | Passou | 0.149 |
| `semToken` | Passou | 0.078 |
| `loginValido` | Passou | 0.147 |
| `zeroConfirmado` | Passou | 0.078 |
| `contribuicoesReplayCorrecaoConclusao` | Passou | 0.119 |
| `rfidDesconhecido` | Passou | 0.083 |
| `pesoAbaixoDaTara` | Passou | 0.077 |
| `avaliarLeituraValida` | Passou | 0.075 |

Saída integral: [testes-api.txt](testes-api.txt). Detalhes estruturados: [JUnit XML](TEST-br.com.fiap.merenda.MerendaApiTest.xml). O XML preserva cada caso individual e a saída do processo. As execuções vermelhas foram preservadas em `tdd-red.txt`, `acentos-red.txt` e `exclusao-red.txt`.
