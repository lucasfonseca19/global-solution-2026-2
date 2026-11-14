# 05 — Entregar o simulador independente

Status: ready-for-human
Responsável: Lucas
Blocked by: nenhum para a demonstração independente

## Comportamento esperado

Simular a colocação da lixeira na balança, produzindo código RFID e peso bruto em cenários controlados. Seguir a [especificação](../spec.md) e usar os exemplos do [contrato provisório](../api-contract.md), sem depender de hardware ou API pronta.

## Critérios de aceite

- [ ] Produzir leituras identificadas como simuladas para RFID e peso; usar script/JSON ou outra forma admitida pelo enunciado.
- [ ] Cenários para as duas lixeiras, peso válido, zero descarte, etiqueta desconhecida e peso abaixo da tara.
- [ ] Fornecer código e peso bruto, sem substituir o cálculo real por peso líquido pré-calculado.
- [ ] Na demonstração independente, um consumidor demonstrativo identifica a lixeira, aplica a tara, valida e exibe o resultado ou erro. Explicar que esse consumidor substitui temporariamente a API.
- [ ] Reutilizar os cenários como dados de entrada da futura integração; manter transporte em aberto para alinhamento de 01.
- [ ] Documentar acionamento dos cenários e a ação disparada pelos dados no README de `iot/`, fornecendo evidências para 07.

## Dependências e limites

Sem fila, broker, WebSocket ou compra de hardware. O simulador emite leituras; a regra de cálculo pertence ao consumidor demonstrativo nesta versão e ao backend na integração. A solução independente não deve ser apresentada como conexão já realizada com o app/API.

## Comentários

### 14/11/2026

Pode avançar em paralelo ao app e ao trabalho do colega. A conexão final pertence a 06.
