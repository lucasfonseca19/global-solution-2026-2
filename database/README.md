# Banco de dados

PostgreSQL 16 (funciona a partir do 14). Cinco entidades normalizadas: `usuario`, `categoria_descarte`, `lixeira`, `servico_alimentacao` e `pesagem`.

| Arquivo | O que é |
| --- | --- |
| `01_schema.sql` | `CREATE TABLE` com PK, FK, `UNIQUE`, `CHECK` e índices. Pode rodar várias vezes (recria as tabelas). |
| `02_carga_inicial.sql` | Dados fictícios de demonstração: usuário, categorias, 2 lixeiras RFID, 6 serviços e 11 pesagens. |
| `03_consultas.sql` | 7 consultas de uso real com `JOIN` e agregação. |
| `der.png` / `der.mmd` | Diagrama ER (imagem e fonte Mermaid). |
| `docker-compose.yml` | Sobe o PostgreSQL já com tabelas e carga. |
| `evidencias/` | Saída real da execução dos scripts e dos testes de integridade. |

## Como executar

**Opção A: Docker**

```bash
cd database
docker compose up -d          # cria o banco "merenda" já com 01 e 02
docker exec -i merenda-postgres psql -U merenda -d merenda < 03_consultas.sql
```

Para recriar do zero: `docker compose down -v` e `docker compose up -d`.

**Opção B: PostgreSQL instalado**

```bash
psql -U postgres -c "CREATE USER merenda WITH PASSWORD 'merenda';"
psql -U postgres -c "CREATE DATABASE merenda OWNER merenda;"
psql -h localhost -U merenda -d merenda -v ON_ERROR_STOP=1 -f 01_schema.sql
psql -h localhost -U merenda -d merenda -v ON_ERROR_STOP=1 -f 02_carga_inicial.sql
psql -h localhost -U merenda -d merenda -f 03_consultas.sql
```

Senha do usuário `merenda`: `merenda`. Também dá para rodar os três arquivos em ordem pelo pgAdmin ou DBeaver.

## Modelo

![Diagrama ER](der.png)

| Relacionamento | Cardinalidade | Regra |
| --- | --- | --- |
| usuario → servico_alimentacao | 1 : N | Quem registrou o serviço |
| categoria_descarte → lixeira | 1 : N | Cada lixeira tem uma categoria fixa |
| servico_alimentacao → pesagem | 1 : 0..2 | Uma pesagem por categoria (`UNIQUE (servico_id, categoria_id)`); `ON DELETE CASCADE` |
| lixeira → pesagem | 1 : N | Qual lixeira foi pesada; a FK composta `(lixeira_id, categoria_id)` garante que a categoria da pesagem é a da lixeira |

Regras de negócio garantidas pelo próprio banco:

- Um serviço por data e tipo de refeição: `uk_servico_data_tipo`.
- Um peso por categoria em cada serviço; corrigir é `UPDATE`, nunca soma: `uk_pesagem_servico_categoria`.
- Peso bruto não pode ser menor que a tara, e o líquido é sempre bruto − tara: `ck_pesagem_bruto` e `ck_pesagem_liquido`.
- Senha só como hash BCrypt: `ck_usuario_hash`.
- Excluir o serviço remove suas pesagens: `fk_pesagem_servico ... ON DELETE CASCADE`.

A pesagem guarda a tara usada no momento da leitura. Assim, se a lixeira for trocada ou recalibrada, o histórico não muda. É uma cópia intencional (dado histórico), não redundância.

## Consultas (`03_consultas.sql`)

1. Histórico: cada serviço com peso por categoria, total e status (`LEFT JOIN`, `SUM ... FILTER`, `GROUP BY`).
2. Total e média por categoria no período.
3. Descarte por tipo de refeição (almoço x lanche).
4. Serviços acima do limite de alerta, 5 kg (`HAVING`).
5. Serviços pendentes e qual categoria aguarda pesagem (`CROSS JOIN` + anti-join).
6. Uso de cada lixeira RFID: quantidade de pesagens e peso bruto médio.
7. Pesagens registradas por usuário.

Resultados reais em `evidencias/execucao-scripts.txt`. Os testes de integridade (`evidencias/testes-constraints.sql`) mostram o banco rejeitando duplicidade, peso abaixo da tara, categoria trocada e senha sem hash; a saída está em `evidencias/testes-constraints.txt`.
