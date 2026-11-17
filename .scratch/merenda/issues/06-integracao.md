# 06 — Conectar e demonstrar as partes

Status: ready-for-human
Responsáveis: Lucas e colega
Blocked by: 01, 03, 04 e 05

## Comportamento esperado

Conectar simulador, API e app, preservando a alternativa de demonstrar as partes separadamente caso não haja tempo. Não bloquear as entregas independentes por causa desta etapa.

## Critérios de aceite

- [ ] Com contrato revisado, trocar o adaptador de respostas simuladas do app pelo acesso à API.
- [ ] Mostrar login, recebimento de RFID/peso, prévia sem gravação, confirmação, histórico, correção e exclusão.
- [ ] Conferir tara, totais, estado pendente e rejeição de leituras inválidas com os mesmos cenários usados individualmente.
- [ ] Atualizar os comandos e a configuração necessários para reproduzir a integração, sem publicar segredos.
- [ ] Se não for possível integrar, registrar explicitamente a alternativa separada no README e no roteiro; verificar as três partes e os mesmos dados/regras sem alegar integração inexistente.

## Dependências e limites

A alternativa separada pode ser escolhida sem concluir a integração técnica; registrar a decisão e as evidências. O ticket só pode ser concluído quando uma das formas de demonstração estiver verificada e documentada.

## Comentários

### 14/11/2026

Integração continua como plano principal. Não é requisito para iniciar 04, 05 ou preparar o plano de testes.

## Atualização de integração — 17/11/2026

Lucas aprovou importar e adequar a contribuição `51957f3`, preservando as ADRs atuais. Implementação técnica e verificações em [evidências de integração](../../../docs/evidencias/backend-integration/README.md) e [contrato vigente](../api-contract.md). Os critérios históricos de PUT completo por categoria/conclusão automática acima foram substituídos por contribuição individual, ciclo idempotente, correção por ID e conclusão explícita. API Java/Spring Boot e PostgreSQL foram mantidos. A equipe ainda deve revisar a alteração antes da entrega acadêmica; PDF/pitch e execução nativa permanecem separados. Não houve push.
