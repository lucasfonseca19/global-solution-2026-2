# Plano de testes

Projeto full stack: app **React Native/Expo**, API **Java 21 / Spring Boot**, **PostgreSQL** e simulador de **IoT** (RFID + balança). Este plano lista os casos de teste e a evidência executada de cada um, cobrindo fluxos normais e de erro.

## Inventário de execução

| Camada | Testes | Comando | Evidência |
| --- | --- | --- | --- |
| API (JUnit, banco H2) | 20 | `cd backend && mvn test` | [`backend/docs/evidencias/`](../backend/docs/evidencias/README.md) |
| App (Vitest) | 45 | `cd mobile && npm test` | arquivos `mobile/src/**/*.test.ts` |
| IoT (Node) | 4 | `node --experimental-strip-types --test iot/bridge.test.mjs iot/cli.test.mjs` | — |
| Banco (SQL real) | 11 constraints + 7 consultas | `psql` | [`database/evidencias/`](../database/evidencias/) |
| Integração ponta a ponta | HTTP + PostgreSQL | — | [`evidencias/backend-integration/`](evidencias/backend-integration/README.md) |

## Casos de teste

| ID | Cenário e entrada | Resultado esperado | Estado | Evidência |
| --- | --- | --- | --- | --- |
| CT01 | Login `operador` / `merenda123` | Token JWT e usuário retornados (200) | Executado | API (JUnit) · `backend-integration` |
| CT02 | Login com senha incorreta | 401 com mensagem genérica, sem detalhes | Executado | API (JUnit) |
| CT03 | 5 senhas erradas seguidas | Bloqueio temporário (429) | Executado | API (JUnit) |
| CT04 | `GET /servicos` sem token | 401 (controle de acesso) | Executado | API (JUnit) |
| CT05 | `POST /leituras/avaliar` com `RFID-SIM-001`, bruto 4 kg | Prévia: sobra, tara 1 kg, líquido 3 kg, sem gravar | Executado | API (JUnit) · app `weighing.test.ts` |
| CT06 | `POST /pesagens` (confirmar) | Grava contribuição individual; total atualiza | Executado | API (JUnit) · `weighing.test.ts` |
| CT07 | Repetir o mesmo `cicloId` | Replay idempotente: não duplica, devolve o serviço atual | Executado | `cycle.test.ts` · `weighing.test.ts` |
| CT08 | Corrigir com `substituirId` (mesma lixeira) | Substitui só aquele registro; preserva os demais | Executado | `weighing.test.ts` |
| CT09 | Corrigir com lixeira diferente | Rejeita (`LIXEIRA_DIFERENTE`), sem mutação | Executado | `weighing.test.ts` |
| CT10 | `PUT /servicos/{id}/conclusao` com uma só categoria | Rejeita (`CATEGORIA_PENDENTE`) | Executado | `weighing.test.ts` |
| CT11 | Conclusão com as duas categorias (zero incluso) | Serviço `COMPLETO` | Executado | `weighing.test.ts` |
| CT12 | `DELETE /servicos/{id}` | Remove serviço e pesagens (204) | Executado | API (JUnit) · `persistence.test.ts` |
| CT13 | RFID desconhecido / peso abaixo da tara | Rejeita (`RFID_DESCONHECIDO` / `PESO_INVALIDO`), sem gravar | Executado | API (JUnit) · `weighing.test.ts` · CLI |
| CT14 | Pesagem em data diferente de hoje | Bloqueia (`DIA_ENCERRADO`), histórico é só consulta | Executado | `serviceDay.test.ts` |
| CT15 | Virada do dia da escola (America/Sao_Paulo) | Revalida o relógio e bloqueia escritas do dia anterior | Executado | `serviceDay.test.ts` |
| CT16 | Persistência: gravar, recarregar | Serviços reaparecem; sessão volta ao login | Executado | `persistence.test.ts` |
| CT17 | Falha de escrita no armazenamento | Nenhum estado publicado; fila se recupera | Executado | `persistence.test.ts` |
| CT18 | Escritas simultâneas | Serializadas sem perder serviços | Executado | `persistence.test.ts` · API (concorrência) |
| CT19 | Demonstração local (botão **Demonstração**) | Exemplos fictícios e pesagem simulada, sem API/ponte | Executado | `showcase.test.ts` · `complete-demo` |
| CT20 | CLI: `avaliar sobra/restos/zero/desconhecido/abaixo` | Líquidos 3/2/0 kg; erros com código de saída 1 | Executado | `iot/cli.test.mjs` |
| CT21 | Ponte (bridge): painel emite leitura para o app | App identifica, calcula e permite confirmar | Executado | `iot/bridge.test.mjs` · `complete-demo` |
| CT22 | Abas e navegação nativa (iOS/Android) | Hoje/Histórico em abas do sistema; sem pontos sem saída | Executado (manual no iPhone) | `evidencias/native-navigation/` |

## Comandos de verificação

```sh
cd backend && mvn test                                   # 20 testes de API
cd mobile && npm test                                    # 45 testes de unidade
cd mobile && npm run typecheck                           # TypeScript
node --experimental-strip-types --test iot/bridge.test.mjs iot/cli.test.mjs   # IoT
```

As evidências executadas estão consolidadas em [`docs/evidencias/`](evidencias/) (integração, demonstração e navegação nativa), no plano da API ([`backend/docs/plano-de-testes.md`](../backend/docs/plano-de-testes.md)) e nos testes SQL reais ([`database/evidencias/`](../database/evidencias/)).
