# API (back-end) e segurança

Java 21 + Spring Boot 3.5, Spring Data JPA, Spring Security (BCrypt + token JWT), Bean Validation e Swagger (springdoc). Banco PostgreSQL (ver [`../database`](../database/README.md)).

## Como executar

Pré-requisitos: **JDK 21** e **Maven 3.9+** (ou IntelliJ IDEA, que já traz o Maven).

1. Suba o banco com as tabelas e a carga inicial (instruções em [`database/README.md`](../database/README.md)). O mais rápido é `cd database && docker compose up -d`.
2. Rode a API:

   ```bash
   cd backend
   mvn spring-boot:run
   ```

   No IntelliJ: abra a pasta `backend` como projeto Maven e rode `MerendaApiApplication`.
3. Abra o Swagger em **http://localhost:8080/swagger-ui.html**.
4. Em `POST /auth/login`, entre com **`operador` / `merenda123`**, copie o `token`, clique em **Authorize** e cole.

Configuração por variáveis de ambiente (os valores padrão já funcionam com o `docker-compose` do banco):

| Variável | Padrão |
| --- | --- |
| `DB_URL` | `jdbc:postgresql://localhost:5432/merenda` |
| `DB_USER` / `DB_PASSWORD` | `merenda` / `merenda` |
| `JWT_SECRET` | segredo de demonstração (mínimo de 32 caracteres) |
| `CORS_ORIGENS` | `http://localhost:*,http://127.0.0.1:*` |

### Testes automatizados

```bash
mvn test
```

Usam banco H2 em memória, sem precisar do PostgreSQL. São 18 casos de API, descritos em [`docs/plano-de-testes.md`](docs/plano-de-testes.md). Os relatórios ficam em `target/surefire-reports/`.

### Postman

Importe [`docs/merenda-api.postman_collection.json`](docs/merenda-api.postman_collection.json). A requisição **1. Login** salva o token automaticamente; depois é possível rodar a coleção inteira no Collection Runner.

## Endpoints

| Método | Rota | O que faz | Sucesso | Erros |
| --- | --- | --- | --- | --- |
| POST | `/auth/login` | Login, devolve token | 200 | 400, 401, 429 |
| GET | `/servicos` | Histórico de serviços | 200 | 401 |
| GET | `/servicos/{id}` | Detalhe com peso por categoria e total | 200 | 401, 404 |
| POST | `/servicos` | Cria serviço com pesagens confirmadas | 201 + `Location` | 400, 401, 409 |
| PUT | `/servicos/{id}` | Atualiza/corrige (substitui o conjunto de pesagens) | 200 | 400, 401, 404, 409 |
| DELETE | `/servicos/{id}` | Exclui serviço e pesagens | 204 | 401, 404 |
| POST | `/leituras/avaliar` | Prévia da leitura RFID + balança, sem gravar | 200 | 400, 401 |

Formato dos dados e exemplos: [contrato da API](../.scratch/merenda/api-contract.md). Todos os erros seguem o formato `{ "codigo": "...", "mensagem": "..." }`, com `detalhes` quando há erro de validação.

**Acréscimo ao contrato, a confirmar com o front:** o serviço retornado traz o campo `alerta`. Ele vem `null` normalmente e vem preenchido quando o total do serviço passa de **5 kg** (configurável em `merenda.alerta.limite-total-kg`):

```json
"alerta": {
  "tipo": "DESCARTE_ACIMA_DO_LIMITE",
  "limiteKg": 5,
  "totalKg": 5.5,
  "mensagem": "Descarte de 5.5 kg passou do limite de 5 kg por serviço. ..."
}
```

## Camadas

```
controller/   recebe HTTP, valida o corpo (@Valid) e devolve o status certo
service/      regras: identificar lixeira pelo RFID, descontar tara, validar,
              impedir duplicidade, substituir pesagem, gerar alerta
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
| **Proteção contra XSS**: `tipoRefeicao` aceita só letras, números e espaços; respostas são JSON com `X-Content-Type-Options: nosniff` | `ServicoRequest`, cabeçalhos padrão do Spring Security |
| **Proteção contra força bruta**: 5 senhas erradas seguidas bloqueiam o login por 5 minutos (429) | `LoginAttemptService` |
| **Erros sem detalhes internos**: mensagem genérica no login e nenhuma stack trace ou SQL na resposta | `GlobalExceptionHandler`, `application.yml` |
| **CORS restrito** às origens configuradas | `SecurityConfig.corsConfigurationSource` |

## Integração com o app e o simulador

- O simulador gera `{ codigoRfid, pesoBrutoKg }`. O app manda essa leitura para `POST /leituras/avaliar`, mostra a prévia e, quando o funcionário confirma, chama `POST` ou `PUT /servicos`.
- Depois do login, o app envia `Authorization: Bearer <token>` em todas as chamadas.
- Endereço da API: `http://localhost:8080` no navegador (Expo web), `http://10.0.2.2:8080` no emulador Android e `http://<IP-do-PC>:8080` no celular físico (mesma rede Wi-Fi).
