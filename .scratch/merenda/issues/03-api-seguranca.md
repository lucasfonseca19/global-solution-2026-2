# 03 — Entregar API e segurança

Status: needs-info
Responsável: colega
Blocked by: escolha do backend, acordo do ticket 01 e banco do ticket 02 para verificação final

## Comportamento esperado

Entregar as sete operações discutidas, segundo a [especificação](../spec.md) e o contrato que os integrantes revisarem. Implementação e bibliotecas a propor pelo colega.

## Critérios de aceite

- [ ] Login e listar/detalhar/criar/atualizar/excluir serviços, mais prévia de leitura sem gravação; cobrir GET, POST, PUT e DELETE.
- [ ] Prévia identifica lixeira pelo RFID, aplica tara e calcula peso líquido; gravar somente após confirmação.
- [ ] Rejeitar etiqueta desconhecida e peso menor que a tara; impedir duplicação de serviço.
- [ ] Correção substitui o peso anterior, sem somar leituras repetidas; distinguir categoria pendente de zero confirmado.
- [ ] Controller, Service e Repository separados, validação de entrada e status HTTP adequados.
- [ ] Login com senha em hash e pelo menos três práticas verificáveis. Proposta mínima a revisar: validação de entrada, proteção contra SQLi por consultas parametrizadas/ORM e autenticação nas operações protegidas.
- [ ] Swagger ou Postman documenta todas as operações.
- [ ] Registrar execução e verificações no README de `backend/`, fornecendo evidências para 07.

## Dependências e limites

O colega pode propor a arquitetura antes do fechamento de 01/02. Não fixar JWT, infraestrutura de eventos ou endpoints extras de cadastro. Alterações que afetem o app devem ser combinadas com Lucas.

## Comentários

### 14/11/2026

Divisão aceita pelo colega segundo relato de Lucas; escolhas técnicas e revisão do contrato ainda pendentes.
