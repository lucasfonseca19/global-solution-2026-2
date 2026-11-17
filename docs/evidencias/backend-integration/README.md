# Integração real — evidências de 17/11/2026

Contribuição original: `origin/back-banco-api`, commit `51957f39da4bdf987a88e313a6a6f504481222b4`. Base da interface: `dbaa3c6`. Importação seletiva de backend/database, autorizada por Lucas após análise. Sem push, PR ou comunicação externa. Home, Histórico, Allo, pesagem e simulador separado preservados.

## O que foi executado

| Fronteira | Resultado | Evidência |
| --- | --- | --- |
| API com JDK 21 e H2 | 20 testes, zero falhas/erros | [Java 21](java21-tests.txt), [casos individuais/JUnit](../../../backend/docs/evidencias/README.md) |
| PostgreSQL 16.4 real | Schema/carga mínima, 11 verificações de integridade, sete consultas e migração | [Banco](../../../database/README.md), [constraints](../../../database/evidencias/testes-constraints.txt), [migração](../../../database/evidencias/migracao.txt) |
| HTTP Java 21 → PostgreSQL | 13 verificações; concorrência, soma, replay, correção, conclusão, CORS e exclusão/replay | [Resultados individuais](api-postgres.json), [saída](api-postgres.txt) |
| Interface Expo web → Java 21 → PostgreSQL | 12 cenários; inclui perda da resposta após commit, retry sem duplicação, recarga e zero | [Resultados individuais](web.json), [saída](web.txt), [serviço](servico-concluido.png), [Histórico](historico-api.png) |
| App — unidade | 50 testes passaram | [Vitest](mobile-tests.txt) |
| Calendário com dispositivo UTC | Oito testes passaram | [UTC](timezone-utc.txt) |
| TypeScript | Sem erros | [Typecheck](typecheck.txt) |
| Ponte/CLI IoT | Quatro testes passaram | [IoT](iot-tests.txt) |
| Demo local explícita | 20 cenários preservados | [Resultados](demo/qa.json), [saída](demo-web.txt) |
| Cliente legado | Seis fluxos web passaram | [Playwright](legacy-web.txt) |
| Bundle iOS | Exportação passou com módulo de ciclos | [Exportação](ios-export.txt) |
| Runtime nativo | Não executado: nenhum runtime/dispositivo iOS disponível | [Disponibilidade](native-availability.txt) |

Os testes H2 não executam o SQL PostgreSQL; são evidências separadas. Docker Compose não foi executado, porque Docker não estava disponível. Exportação iOS não comprova execução nativa. PDF/TXT/ZIP/pitch e revisão acadêmica final não foram produzidos nesta integração.

## Comportamento demonstrado

No HTTP real, três contribuições concorrentes (3 kg + 1 kg + 2 kg), incluindo replay simultâneo, produzem três registros e total 6 kg. Correção individual de 3 para 2,5 kg resulta em 5,5 kg. Presença das duas categorias não conclui automaticamente. Conclusão explícita bloqueia novas contribuições; correção/replay mantém conclusão. Exclusão mantém a reserva do ciclo/hash para impedir recriação por retry antigo. Nova confirmação explícita usa novo ciclo.

No fluxo visual, a resposta foi abortada depois de a API confirmar a transação. O app mostrou falha, manteve a prévia/ciclo e só anunciou sucesso após a nova tentativa. PostgreSQL manteve uma contribuição. Leituras antigas, RFID desconhecido e bruto menor que tara não geraram gravação. Sessão encerrou na recarga; dados continuaram no banco. Zero em ambas as categorias permitiu concluir.

## Ambiente isolado e reprodução

PostgreSQL redistribuível Zonky 16.4 em `/private/tmp/merenda-pg-isolado`, sem instalação global. Usuário temporário `merenda`, trust somente na instância de teste local. Banco exclusivo `merenda_integration`, porta 55439, sem conexão a dados pessoais. [Carga inicial verificada](database-setup.txt): usuário 1, categorias 2, lixeiras 2, serviços/pesagens/ciclos inicialmente zero. Migração foi testada em outra cópia isolada do esquema original; nenhum banco existente foi migrado.

As portas do app/simulador já abertos foram preservadas. Usadas na integração: API 18080, app 18094 e ponte 18095. Demo em 18096 com ponte própria 18097, para evitar cruzamento de eventos entre roteiros. Processos temporários foram encerrados após as verificações; diretórios de dados/exportação temporários preservados.

Para reproduzir, criar banco exclusivo vazio seguindo database/README.md e executar API, ponte e app em terminais separados, na raiz (Java exige JDK 21 e Maven):

```sh
DB_URL=jdbc:postgresql://localhost:55439/merenda_integration DB_USER=merenda DB_PASSWORD=merenda SERVER_PORT=18080 JWT_SECRET=segredo-exclusivo-da-sua-demonstracao-com-32-caracteres mvn -f backend/pom.xml spring-boot:run
SIMULATOR_PORT=18095 node --experimental-strip-types iot/bridge.mjs
EXPO_PUBLIC_DATA_MODE=api EXPO_PUBLIC_API_URL=http://localhost:18080 EXPO_PUBLIC_SIMULATOR_URL=http://127.0.0.1:18095 npm --prefix mobile run web -- --port 18094
```

Com os processos ativos, executar em sequência:

```sh
node mobile/integration-qa.cjs
node mobile/integration-api-qa.cjs
```

O primeiro roteiro exige banco sem serviços e cria dados exclusivamente de teste; o segundo usa Jantar e exclui o serviço criado ao final. Não executar esses roteiros contra um banco pessoal/compartilhado. As URLs podem ser alteradas com QA_APP_URL, QA_API_URL e QA_SIMULATOR_URL.

## Revisão e decisões

Revisão independente encontrou dois problemas, corrigidos antes da última rodada: calendário dependente do aparelho e IDs de ciclo baseados apenas em horário/contador. App e API agora usam America/Sao_Paulo; atualização diária é independente do fuso do aparelho. Ciclos usam 128 bits aleatórios via expo-crypto e são preservados nos retries. A dependência foi instalada na versão compatível com SDK58, sem mudanças visuais. Referência: [documentação oficial Expo Crypto](https://docs.expo.dev/versions/latest/sdk/crypto/); leitura complementada pelo código da versão instalada (getRandomValues funciona também no fluxo web por IP, sem depender de randomUUID em contexto seguro).

A configuração JWT não tem segredo público padrão. As credenciais operador/merenda123 são públicas de avaliação e verificadas por BCrypt. A API valida RFID/tara/líquido novamente ao confirmar. Escritas são serializadas por lock de uma categoria pré-cadastrada, solução pequena para uma escola e baixo volume; não é uma proposta de escalabilidade para várias escolas. O banco protege unicidade normalizada e ciclos.
