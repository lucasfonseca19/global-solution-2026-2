# Plano de testes: banco e API

Os casos **CT-xx** são testes automatizados de API (`src/test/java/.../MerendaApiTest.java`). Eles sobem a aplicação inteira, com controllers, services, repositórios e segurança, sobre um banco H2 em memória, e rodam com `mvn test`. Os casos **BD-xx** testam as regras do PostgreSQL direto no banco (`database/evidencias/testes-constraints.sql`).

A coluna **Status** só deve ser marcada depois da execução real, com a evidência correspondente. Não preencher antes de rodar.

| ID | Cenário | Entrada | Saída esperada | Status |
| --- | --- | --- | --- | --- |
| CT-01 | Login válido | `operador` / `merenda123` | 200, token e nome do usuário; sem senha/hash na resposta | A executar |
| CT-02 | Senha errada | `operador` / `errada` | 401 `NAO_AUTORIZADO`, mensagem genérica | A executar |
| CT-03 | Acesso sem token ou com token falso | `GET /servicos` | 401 `NAO_AUTORIZADO` | A executar |
| CT-04 | Senha guardada em hash | Usuário `operador` no banco | `senha_hash` começa com `$2a$` e é diferente da senha | A executar |
| CT-05 | Tentativa de XSS | `tipoRefeicao: "<script>alert(1)</script>"` | 400 `DADOS_INVALIDOS`, campo `tipoRefeicao` | A executar |
| CT-06 | Tentativa de SQL injection no login | `login: "operador' OR '1'='1"` | 401; não autentica | A executar |
| CT-07 | Leitura válida (sobra) | `RFID-SIM-001`, bruto 4 kg | 200, `SOBRA_DESCARTADA`, tara 1, líquido 3 | A executar |
| CT-08 | Etiqueta desconhecida | `RFID-SIM-999`, bruto 4 kg | 400 `RFID_DESCONHECIDO` | A executar |
| CT-09 | Peso abaixo da tara | `RFID-SIM-001`, bruto 0,5 kg | 400 `PESO_INVALIDO` | A executar |
| CT-10 | Zero confirmado | `RFID-SIM-002`, bruto 1,5 kg | 200, líquido 0 (não é erro) | A executar |
| CT-11 | Listar histórico | `GET /servicos` | 200, almoço de 12/11 `COMPLETO`, total 5 kg | A executar |
| CT-12 | Criar serviço só com a sobra | 13/11 Almoço, sobra bruto 4 kg | 201 + `Location`; `PENDENTE`, `RESTO_PRATO: null`, total parcial 3 | A executar |
| CT-13 | Serviço duplicado | 12/11 "almoço" (já existe "Almoço") | 409 `SERVICO_JA_EXISTE` | A executar |
| CT-14 | Correção + alerta | Restos de 3,5 kg para 4 kg brutos | 200, restos 2,5 kg, total 5,5 kg (sem somar); alerta `DESCARTE_ACIMA_DO_LIMITE` | A executar |
| CT-15 | PUT sem uma categoria | Só a sobra no corpo | 200, `PENDENTE`, restos voltam a `null`, total 3 | A executar |
| CT-16 | Categoria repetida no envio | Duas leituras `RFID-SIM-001` | 400 `DADOS_INVALIDOS`; nada é gravado | A executar |
| CT-17 | Excluir serviço | `DELETE /servicos/1` | 204; depois `GET` dá 404 `SERVICO_NAO_ENCONTRADO` | A executar |
| CT-18 | Data em formato errado | `data: "13/11/2026"` | 400 `DADOS_INVALIDOS` | A executar |
| BD-01 | Serviço duplicado no banco | INSERT 12/11 Almoço | Erro `uk_servico_data_tipo` | Aprovado (13/11/2026) |
| BD-02 | Duas pesagens da mesma categoria | INSERT 2ª sobra no serviço 5 | Erro `uk_pesagem_servico_categoria` | Aprovado (13/11/2026) |
| BD-03 | Bruto menor que a tara | Bruto 1, tara 1,5 | Erro `ck_pesagem_bruto` | Aprovado (13/11/2026) |
| BD-04 | Categoria diferente da lixeira | Lixeira da cozinha como resto | Erro `fk_pesagem_lixeira_categoria` | Aprovado (13/11/2026) |
| BD-05 | Senha em texto puro | `senha_hash = 'senha123'` | Erro `ck_usuario_hash` | Aprovado (13/11/2026) |
| BD-06 | Exclusão em cascata | DELETE do serviço 3 | Pesagens do serviço: 2 → 0 | Aprovado (13/11/2026) |

## Como executar e guardar as evidências

**Testes automatizados da API** (não precisa de PostgreSQL):

```bash
cd backend
mvn test
```

Evidências para o PDF:

1. Print do terminal com o resumo `Tests run: 18, Failures: 0, Errors: 0`.
2. Relatórios gerados em `backend/target/surefire-reports/` (um `.txt` e um `.xml` por classe de teste).
3. Opcional: relatório HTML com `mvn surefire-report:report`, gerado em `target/reports/surefire.html`. No IntelliJ, é só rodar `MerendaApiTest` e exportar o resultado pelo botão "Export Test Results".

**Testes manuais pelo Postman**: importe `backend/docs/merenda-api.postman_collection.json`, rode **1. Login** e depois a coleção inteira pelo Collection Runner. Cada requisição já tem asserções. Tire print do resumo do Runner.

**Testes do banco**: a saída real está em `database/evidencias/testes-constraints.txt`. Para repetir:

```bash
psql -h localhost -U merenda -d merenda -f database/evidencias/testes-constraints.sql
```
