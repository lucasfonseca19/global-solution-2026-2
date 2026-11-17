# Merenda — monitoramento do descarte na alimentação escolar

MVP full stack da **Global Solution 2026/2 (CitizenTech — FIAP)**: uma solução para **medir e acompanhar o desperdício de alimentos na merenda escolar**, separando duas categorias — alimento preparado e não servido, e restos comestíveis devolvidos nos pratos. Cada lixeira é identificada por **RFID** e pesada em **balança** (ambos simulados); o sistema desconta a tara automaticamente, calcula o líquido, soma por categoria e consolida um histórico por refeição.

Sem esses dados, a escola não consegue dimensionar nem reduzir as perdas. Com o registro por refeição, o responsável passa a enxergar quanto é descartado ao longo dos dias e tomar decisões apoiadas em números.

## As seis partes do projeto

| Parte (pontuação) | Tecnologia | Onde está | Como executar/verificar |
| --- | --- | --- | --- |
| 1. Banco de dados (2) | PostgreSQL 16 | [`database/`](database/) | `docker compose up` + [`03_consultas.sql`](database/03_consultas.sql); DER em [`der.png`](database/der.png) |
| 2. API REST (4) | Java 21 · Spring Boot 3 | [`backend/`](backend/) | `mvn spring-boot:run`; Swagger em `http://localhost:8080/swagger-ui.html` |
| 3. App mobile (3) | React Native · Expo | [`mobile/`](mobile/) | `npm ci` + `npm run web` (5 telas); ou Expo Go no celular |
| 4. Simulação de IoT (2) | Node.js (RFID + balança) | [`iot/`](iot/) | `node iot/bridge.mjs`; painel em `http://127.0.0.1:8095` |
| 5. Segurança (2) | Spring Security + BCrypt/JWT | [`backend/.../security/`](backend/src/main/java/br/com/fiap/merenda/security/) | login `operador`/`merenda123` (senha em hash BCrypt) |
| 6. Testes (2) | JUnit (H2) + Vitest | `backend/src/test/`, `mobile/src/**/*.test.ts` | `mvn test` e `npm test`; plano e evidências em [`docs/`](docs/) |

## ODS

A solução dialoga com os Objetivos de Desenvolvimento Sustentável da ONU:

- **ODS 12 — Consumo e produção responsáveis**: reduzir o desperdício de alimentos é uma de suas metas centrais.
- **ODS 2 — Fome zero e agricultura sustentável**: melhor gestão dos alimentos destinados à alimentação escolar.
- **ODS 4 — Educação de qualidade**: ambiente escolar que passa a gerir a alimentação com dados.

*(Mapeamento proposto; a equipe deve confirmar a redação final.)*

## Pré-requisitos

- **Node.js** compatível com Expo (ambiente registrado: 22.17.1+).
- **JDK 21** e **Maven 3.9+** (API).
- **PostgreSQL 14+** — ou **Docker Compose** para subir o banco automaticamente.

## Executando e verificando cada parte

### 1. Banco de dados

```sh
cd database
docker compose up -d          # sobe PostgreSQL na porta 55439
```

Os scripts [`01_schema.sql`](database/01_schema.sql) (tabelas, PK/FK, constraints) e [`02_carga_inicial.sql`](database/02_carga_inicial.sql) (operador, categorias e lixeiras) rodam no primeiro início do volume vazio. As **sete consultas** de uso real (JOIN e agregação) estão em [`03_consultas.sql`](database/03_consultas.sql); o **DER** está em [`der.png`](database/der.png) (editável em `der.mmd`). Detalhes em [`database/README.md`](database/README.md).

### 2. API REST

```sh
cd backend
export JWT_SECRET="segredo-exclusivo-da-demonstracao-local-com-32-caracteres"
mvn spring-boot:run
```

- Swagger: `http://localhost:8080/swagger-ui.html` · Collection Postman: [`backend/docs/merenda-api.postman_collection.json`](backend/docs/merenda-api.postman_collection.json).
- **7 endpoints** cobrindo GET, POST, PUT e DELETE, com camadas Controller/Service/Repository separadas. Contrato em [`.scratch/merenda/api-contract.md`](.scratch/merenda/api-contract.md).

### 3. App mobile

```sh
cd mobile
npm ci
npm run web -- --port 8094     # ou: npm start (Expo Go, QR code no celular)
```

Abra `http://localhost:8094`. São **5 telas**: Login, Hoje, Histórico, Pesagem e Detalhes.

- **Sem configurar o backend:** toque no botão **Demonstração** — abre as mesmas telas com dados fictícios e sensores simulados dentro do próprio app.
- **Com o stack completo:** entre com `operador` / `merenda123` e use o painel do simulador (parte 4) para disparar leituras.

### 4. Simulação de IoT

```sh
node --experimental-strip-types iot/bridge.mjs    # painel em http://127.0.0.1:8095
```

Dois **sensores simulados**: o **leitor RFID** (identifica a lixeira e sua categoria) e a **balança** (peso bruto). O painel emite cenários prontos (cozinha 3 kg, pratos 2 kg, zero, etiqueta desconhecida, peso abaixo da tara). Os dados disparam a identificação, o cálculo do líquido e a atualização dos totais no app. Há também a CLI: `node --experimental-strip-types iot/cli.mjs listar`. Ver [`iot/README.md`](iot/README.md).

### 5. Segurança

Login com **senha em hash BCrypt** (nunca em texto puro) e token **JWT**. Práticas adicionais: **validação de entrada**, proteção contra **SQL injection** (consultas parametrizadas) e **XSS**, **controle de acesso** (só `/auth/login` é público) e **bloqueio de tentativas** de login. Detalhes e mapeamento em [`backend/README.md`](backend/README.md#segurança).

### 6. Testes e evidências

| Comando | O que cobre |
| --- | --- |
| `cd backend && mvn test` | 20 testes de API e concorrência (H2) |
| `cd mobile && npm test` | 45 testes unitários do adaptador/fluxo (Vitest) |
| `cd mobile && npm run typecheck` | TypeScript |
| `node --experimental-strip-types --test iot/bridge.test.mjs iot/cli.test.mjs` | simulador e CLI |

Plano de testes em [`docs/plano-testes-lucas.md`](docs/plano-testes-lucas.md); evidências (logs, capturas, relatórios) em [`docs/evidencias/`](docs/evidencias/).

## Credenciais

| Contexto | Usuário | Senha |
| --- | --- | --- |
| API / app (avaliação) | `operador` | `merenda123` |
| Demonstração local (sem backend) | `demo` | `merenda-demo` |
| PostgreSQL (Compose) | `merenda` | `merenda` |

## Entregáveis (ZIP de submissão)

O enunciado pede um único `.zip` com: **código** (este repositório, incluindo os scripts `.sql` e a documentação da API), **README de execução** (este arquivo), um **PDF** com integrantes e entregáveis de cada parte (diagrama ER, plano de testes, evidências) e um **`.txt`** com grupo/RM/nome dos integrantes e o **link público do vídeo pitch** (até 3 min).

> 🔗 **Link do vídeo pitch:** `[INSERIR LINK PÚBLICO AQUI]`

## Uso de IA

IA generativa (Codex e OpenCode, com revisão de subagentes) auxiliou no planejamento, na implementação, nos testes e na documentação. Todo o material foi revisado e validado pelos integrantes antes da entrega. Detalhes e limites em [`docs/relatorio-implementacao-lucas.md`](docs/relatorio-implementacao-lucas.md).

## Documentação de apoio

- [Enunciado](ENUNCIADO.md) · [especificação do MVP](.scratch/merenda/spec.md) · [contrato da API](.scratch/merenda/api-contract.md)
- [Guia de testes](docs/guia-testes-lucas.md) · [plano de testes](docs/plano-testes-lucas.md) · [guia de gravação](docs/guia-simulador-gravacao.md)
- [README do banco](database/README.md) · [README da API](backend/README.md) · [README do app](mobile/README.md) · [README da IoT](iot/README.md)
