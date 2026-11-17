# Contrato de integração — Merenda

Atualizado em 17/11/2026. Implementação autorizada por Lucas após inspeção da contribuição `51957f3` do colega. As ADRs 0001/0002 e a especificação vigente definem o comportamento; este contrato substitui o rascunho de PUT por categoria/conclusão automática. Alterações ainda devem ser revisadas pela equipe antes da entrega acadêmica.

## Transporte e autenticação

JSON, camelCase sem acentos em chaves, pesos numéricos em kg (até três casas decimais; bruto entre 0 e 500). Datas `AAAA-MM-DD`. API Java/Spring Boot; PostgreSQL. Uma escola implícita e um perfil operacional. Sem CRUD de cadastros.

`POST /auth/login` recebe `{ "login": "operador", "senha": "merenda123" }`; retorna `{token,usuario:{id,nome}}`. Credenciais públicas exclusivamente de avaliação, hash BCrypt na carga inicial. Demais operações exigem `Authorization: Bearer <token>`. Token permanece na memória do app; recarregar exige login. Expiração/401 não acionam dados locais.

| Método | Rota | Entrada/resultado |
| --- | --- | --- |
| POST | `/auth/login` | Credenciais; sessão (200) |
| GET | `/servicos` | Lista de serviços (200) |
| GET | `/servicos/{id}` | Serviço detalhado (200) |
| POST | `/leituras/avaliar` | `{codigoRfid,pesoBrutoKg}`; prévia calculada sem gravar (200) |
| POST | `/pesagens` | Confirmação/correção individual; serviço atualizado (200) |
| PUT | `/servicos/{id}/conclusao` | Sem corpo; conclui explicitamente e retorna serviço (200) |
| DELETE | `/servicos/{id}` | Remove serviço e contribuições (204) |

## Confirmação individual

```json
{
  "data": "2026-11-17",
  "tipoRefeicao": "Almoço",
  "cicloId": "identificador-unico-do-ciclo",
  "leitura": {"codigoRfid": "RFID-SIM-001", "pesoBrutoKg": 4},
  "substituirId": "42"
}
```

`substituirId` é opcional e identifica exclusivamente a contribuição a corrigir. Sem ele, registra nova contribuição. O servidor cria ou encontra atomicamente o único serviço de data/refeição normalizada. RFID identifica uma lixeira, nunca a identidade de uma contribuição.

A API reidentifica lixeira, categoria e tara e recalcula líquido na confirmação. Não aceita líquido/tara/categoria do cliente como autoridade. Correção exige a mesma lixeira e mantém os demais registros e eventual conclusão. Novo registro em serviço concluído é rejeitado.

Ciclo persistido: repetir o mesmo pedido não soma outra vez. Reutilizar ciclo com dados diferentes é conflito. Uma falha de rede mantém o ciclo e a prévia no app para tentar novamente; sucesso só ocorre após resposta válida. Ciclos de correção também são idempotentes. A resposta de repetição representa o estado atual do serviço.

## Respostas

Prévia: `{lixeiraId,codigoRfid,categoria,taraKg,pesoBrutoKg,pesoLiquidoKg}`.

Serviço: `{id,data,tipoRefeicao,status,totalKg,pesagens,registros}`.

- `id` de serviço e lixeira: número. ID de registro em `registros`: string opaca.
- `registros`: lista das contribuições, cada uma com `id`, `categoria` e todos os campos da prévia.
- `pesagens`: projeção por `SOBRA_DESCARTADA`/`RESTO_PRATO`, agregando pesos e taras; categoria sem registros é `null`. Usar `registros` para identidade/correção, não o RFID nem campos agregados.
- `status`: `PENDENTE` até conclusão explícita, mesmo após ambas as categorias; `COMPLETO` após concluir. Concluir exige registros de ambas, incluindo zero confirmado. Não presume zero quando falta informação.
- `totalKg`: soma das contribuições confirmadas. Médias/comparações do app e consultas de acompanhamento consideram serviços concluídos.

## Calendário, sensores e erros

Escritas são restritas ao dia corrente da escola, fuso `America/Sao_Paulo`, validado no servidor. A UI calcula o calendário no mesmo fuso e atualiza na virada independentemente do fuso do dispositivo. A API rejeita divergência, alteração de data original e escrita em serviço antigo, incluindo pendente e operação aberta antes da meia-noite.

A ponte de sensores usa sua própria URL/porta e transmite somente RFID/bruto. App consulta a prévia HTTP e só grava quando o funcionário confirma. Cursor/ciclo/escuta da ponte permanecem separados da idempotência da gravação. Uma prévia deve ser confirmada ou descartada antes da conclusão no app.

Erros: `{codigo,mensagem,detalhes?}`. HTTP 400 para leitura/entrada inválida, 401 para autenticação, 404 para recurso inexistente, 409 para conflitos/regras incompatíveis e 429 para bloqueio de login. Validar os códigos exatos no Swagger e na coleção atualizada. Falhas não alteram o confirmado nem produzem sucesso visual.

RFIDs fictícios: `RFID-SIM-001` → sobra descartada/tara 1 kg; `RFID-SIM-002` → resto comestível/tara 1,5 kg. Etiqueta desconhecida e bruto abaixo da tara bloqueiam a gravação.

## Execução

Modo padrão `api`; `EXPO_PUBLIC_API_URL` configura API independentemente de `EXPO_PUBLIC_SIMULATOR_URL`. `EXPO_PUBLIC_DATA_MODE=demo` mantém demonstração local explícita e armazenamento próprio; não há fallback automático nem envio de AsyncStorage ao banco. Cadastro inicial obrigatório não inclui serviços históricos. Fixture fictícia é opcional e somente para demonstração identificada.

Referências: [plano de execução](integration-plan.md), [ADR 0001](../../docs/adr/0001-pesagens-individuais-conclusao-explicita.md), [ADR 0002](../../docs/adr/0002-pesagens-somente-no-dia-atual.md).
