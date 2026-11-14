# Tickets locais

Criados em 14/11/2026 após Lucas informar que o colega aceitou a divisão. Acompanhamento em Markdown; GitHub Issues permanece desativado.

| Ticket | Responsável | Situação inicial |
| --- | --- | --- |
| [01 — Revisar contrato/backend](01-alinhar-contrato.md) | Ambos | Aguarda contribuição do colega; necessário para integrar |
| [02 — Banco](02-banco.md) | Colega | Aguarda proposta de tecnologia/modelo |
| [03 — API e segurança](03-api-seguranca.md) | Colega | Aguarda escolhas e alinhamento; ver dependências |
| [04 — Escopo geral do app](04-app-mobile.md) | Lucas | Precisa definir detalhes do app e aprovar entregas menores; não depende de API pronta |
| [05 — Simulador independente](05-simulacao-iot.md) | Lucas | Pode avançar em paralelo |
| [06 — Integração](06-integracao.md) | Ambos | Depende de contrato e partes implementadas |
| [07 — Testes e evidências](07-testes-evidencias.md) | Ambos | Planejar agora; executar conforme as partes ficarem prontas |
| [08 — Entrega](08-entrega.md) | Grupo | Preparar estrutura; pacote final depende de resultados e identificação do grupo |

Os arquivos individuais são a fonte do status e dos bloqueadores. `ready-for-human` indica que o escopo pode ser trabalhado pela equipe; não significa trabalho iniciado, concluído ou código autorizado nesta conversa. Não iniciar implementação pelo assistente sem instrução de Lucas.

## Ordem sugerida para Lucas

1. Resolver as [pendências do app](../app-planning.md), alinhar como verificar o comportamento e revisar a divisão em entregas menores.
2. Após revisão, trabalhar nas entregas menores do app, mantendo o acesso aos dados separado das telas e seguindo o contrato provisório.
3. Produzir o simulador independente (05) com os mesmos cenários.
4. Ajustar o adaptador após revisão de 01 e realizar 06 quando as partes estiverem prontas.

Não é necessário aguardar backend ou banco para desenvolver e demonstrar o app com respostas simuladas. Nenhum desses tickets começou a ser implementado nesta conversa.

Revisão em 14/11: os oito arquivos são frentes amplas de trabalho, não a divisão final em pequenas entregas prevista por `to-tickets`. O app não está pronto para implementação só porque React Native foi confirmado. Ver [revisão do planejamento](../app-planning.md).
