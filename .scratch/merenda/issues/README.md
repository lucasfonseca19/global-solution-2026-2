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

## Entregas aprovadas da parte de Lucas

| Ticket | Situação inicial | Bloqueado por |
| --- | --- | --- |
| [09 — Entrar e consultar](09-entrar-consultar.md) | `needs-info`: fechar arquitetura e definições mínimas | Arquitetura aprovada e verificação alinhada |
| [10 — Registrar e simular](10-registrar-simular.md) | `ready-for-agent`, aguardando dependência | 09 |
| [11 — Corrigir e repetir](11-corrigir-repetir.md) | `needs-info`: política de dados pendente | 10 e decisão de persistência/restauração |
| [12 — Verificar e documentar](12-verificar-documentar.md) | `ready-for-agent`, aguardando dependências | 09, 10 e 11 |

09 a 12 são a divisão em quatro entregas aprovada por Lucas. Os tickets 01 a 08 continuam como mapa das responsabilidades do grupo; não executá-los novamente como uma segunda implementação do mesmo app.

## Ordem de trabalho da nova sessão

1. Ler o [roteiro de arquitetura e orquestração](../../../docs/execucao-lucas.md).
2. Resolver as poucas definições pendentes e apresentar arquitetura mínima para aprovação de Lucas antes de código.
3. Executar 09 → 10 → 11 → 12 com subagentes, revisão independente e evidências reais, conforme a autorização na nova sessão.
4. Integrar API real apenas se estiver disponível e acordada; sua ausência não bloqueia a entrega simulada de Lucas.

Nenhum desses tickets começou a ser implementado nesta conversa. Criar tickets não equivale a concluir os critérios; os arquivos individuais são a fonte de status e bloqueadores.
