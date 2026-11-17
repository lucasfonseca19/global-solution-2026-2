# API (back-end) e segurança

Java 21 + Spring Boot 3.5, Spring Data JPA, Spring Security (BCrypt + token JWT), Bean Validation e Swagger (springdoc). Banco PostgreSQL (ver [`../database`](../database/README.md)).

## Como executar

Pré-requisitos: **JDK 21** e **Maven 3.9+** (ou IntelliJ IDEA, que já traz o Maven).

1. Suba o banco com as tabelas e a carga inicial (instruções em [`database/README.md`](../database/README.md)). O mais rápido é `cd database && docker compose up -d`.
2. Rode a API:

   ```bash
   cd backend
   export JWT_SECRET="segredo-exclusivo-da-demonstracao-local-com-32-caracteres"
   mvn spring-boot:run
   ```

   No IntelliJ: abra a pasta `backend` como projeto Maven e rode `MerendaApiApplication`.
3. Abra o Swagger em **http://localhost:8080/swagger-ui.html**.
4. Em `POST /auth/login`, entre com **`operador` / `merenda123`**, copie o `token`, clique em **Authorize** e cole.

Configuração por variáveis de ambiente (porta padrão 55439, igual ao Compose; para PostgreSQL em outra porta, definir DB_URL):

| Variável | Padrão |
| --- | --- |
| `DB_URL` | `jdbc:postgresql://localhost:55439/merenda` |
| `DB_USER` / `DB_PASSWORD` | `merenda` / `merenda` |
| `JWT_SECRET` | obrigatório, mínimo de 32 caracteres; sem valor padrão |
| `CORS_ORIGENS` | `http://localhost:*,http://127.0.0.1:*` |

### Testes automatizados

```bash
mvn test
```

Usam banco H2 em memória, sem precisar do PostgreSQL. São 20 testes de API e concorrência, descritos em [`docs/plano-de-testes.md`](docs/plano-de-testes.md). Os relatórios temporários ficam em `target/surefire-reports/`; a saída e cópias individuais preservadas estão em [`docs/evidencias/`](docs/evidencias/).

### Postman

Importe [`docs/merenda-api.postman_collection.json`](docs/merenda-api.postman_collection.json). A requisição **1. Login** salva o token automaticamente; depois é possível rodar a coleção inteira no Collection Runner.

## Endpoints

| Método | Rota | O que faz | Sucesso | Erros |
| --- | --- | --- | --- | --- |
| POST | `/auth/login` | Login, devolve token | 200 | 400, 401, 429 |
| GET | `/servicos` | Histórico de serviços | 200 | 401 |
| GET | `/servicos/{id}` | Detalhe com peso por categoria e total | 200 | 401, 404 |
| POST | `/pesagens` | Confirma contribuição ou correção individual com ciclo idempotente | 200 | 400, 401, 409 |
| PUT | `/servicos/{id}/conclusao` | Conclui explicitamente, com ambas as categorias | 200 | 401, 404, 409 |
| DELETE | `/servicos/{id}` | Exclui serviço do dia e suas pesagens | 204 | 401, 404, 409 |
| POST | `/leituras/avaliar` | Prévia da leitura RFID + balança, sem gravar | 200 | 400, 401 |

Formato dos dados e exemplos: [contrato da API](../.scratch/merenda/api-contract.md). Todos os erros seguem o formato `{ "codigo": "...", "mensagem": "..." }`, com `detalhes` quando há erro de validação.

Cada chamada confirma uma contribuição, sem limite de uma por categoria. `registros` contém IDs string estáveis; `pesagens` projeta os pesos somados por categoria (categoria ausente é `null`). A projeção conserva o RFID/ID da última contribuição da categoria; a origem individual deve ser lida em `registros`. O status permanece `PENDENTE` até a conclusão explícita. Zero confirmado conta como presença de categoria.

```json
{"data":"2026-11-17","tipoRefeicao":"Almoço","cicloId":"ciclo-exemplo-1","leitura":{"codigoRfid":"RFID-SIM-001","pesoBrutoKg":4}}
```

Na correção, acrescente `"substituirId":"<id do registro>"` e um novo ciclo. A lixeira deve ser a mesma. A correção preserva a conclusão; novas contribuições a um concluído retornam 409. Tara, categoria e líquido são obtidos no servidor. Pesos brutos aceitam até 500 kg e três casas decimais.

A data operacional usa um `Clock` injetável em `America/Sao_Paulo`; cada escrita valida a data, inclusive depois de aguardar o bloqueio. Um serviço de outro dia é somente consulta. O app deve usar o fuso da escola para exibir o calendário. A data enviada não permite mover um serviço antigo.

`ciclo_pesagem` guarda um SHA-256 do payload canônico, incluindo o ID da correção. Replay idêntico retorna o serviço atual sem nova escrita; payload diferente no mesmo ciclo retorna 409 `CICLO_CONFLITANTE`. O ciclo não é um identificador do sensor. Depois de excluir um serviço, os ciclos/hash ficam sem vínculo com serviço (FK `ON DELETE SET NULL`): replay retorna 409 `SERVICO_EXCLUIDO`, sem ressuscitar dados. Um ciclo realmente novo pode registrar um novo serviço.

Todas as mutações adquirem `PESSIMISTIC_WRITE` na categoria fixa `SOBRA_DESCARTADA`, dentro da mesma transação. Isso serializa inclusive a criação simultânea do primeiro serviço, o replay, correções, conclusão e exclusão entre instâncias da API. É uma solução simples para o volume acadêmico, com menor vazão de escrita; não depende de lock em memória. A unicidade no PostgreSQL reforça as invariantes. Testes H2 não substituem a evidência PostgreSQL em `database/evidencias/` e a integração da raiz.

## Camadas

```
controller/   recebe HTTP, valida o corpo (@Valid) e devolve o status certo
service/      regras: identificar lixeira pelo RFID, descontar tara, validar,
              somar contribuições, proteger ciclos, corrigir e concluir explicitamente
repository/   acesso ao banco com Spring Data JPA (consultas parametrizadas)
model/        entidades JPA = tabelas do banco
dto/          formatos de entrada e saída (contrato com o app)
security/     filtro de autenticação, BCrypt, JWT, limite de tentativas
exception/    converte erros no formato padrão da API
```

## Segurança

| Prática | Onde |
| --- | --- |
| **Senha em hash BCrypt**, nunca em texto puro (o banco também rejeita senha sem hash) | `SecurityConfig.passwordEncoder`, `AuthService`, `ck_usuario_hash` |
| **Controle de acesso**: só `/auth/login` e a documentação são públicos; o resto exige token JWT assinado (HS256) e com validade de 8 h | `SecurityConfig` |
| **Validação de entrada** em todos os corpos (tamanho, formato, faixa de peso, data) | anotações nos `dto/*Request`, `GlobalExceptionHandler` |
| **Proteção contra SQL injection**: só consultas parametrizadas do JPA, nenhuma SQL montada com texto do usuário | `repository/` |
| **Proteção contra XSS**: `tipoRefeicao` aceita só letras, números e espaços; respostas são JSON com `X-Content-Type-Options: nosniff` | `ConfirmacaoPesagem`, cabeçalhos padrão do Spring Security |
| **Proteção contra força bruta**: 5 senhas erradas seguidas bloqueiam o login por 5 minutos (429) | `LoginAttemptService` |
| **Erros sem detalhes internos**: mensagem genérica no login e nenhuma stack trace ou SQL na resposta | `GlobalExceptionHandler`, `application.yml` |
| **CORS restrito** às origens configuradas | `SecurityConfig.corsConfigurationSource` |

## Integração com o app e o simulador

- O simulador gera `{ codigoRfid, pesoBrutoKg }`. O app manda essa leitura para `POST /leituras/avaliar`, mostra a prévia e, quando o funcionário confirma, chama `POST /pesagens`; a conclusão usa `PUT /servicos/{id}/conclusao`.
- Depois do login, o app envia `Authorization: Bearer <token>` em todas as chamadas.
- Endereço da API: `http://localhost:8080` no navegador (Expo web), `http://10.0.2.2:8080` no emulador Android e `http://<IP-do-PC>:8080` no celular físico (mesma rede Wi-Fi).
