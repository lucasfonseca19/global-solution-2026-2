# Estados dos tickets locais

Os papéis padrão das skills são preservados nos valores de `Status:`.

| Estado | Significado |
| --- | --- |
| `needs-triage` | Proposta que precisa ser avaliada |
| `needs-info` | Faltam informações ou decisões |
| `ready-for-agent` | Escopo revisado e pronto para execução pelo assistente |
| `ready-for-human` | Requer trabalho da equipe |
| `wontfix` | Não será realizado |

Para acompanhar a execução local, usam-se também `in-progress` e `done`. Dependências são registradas separadamente em `Blocked by:`; um ticket pronto só pode iniciar quando seus bloqueadores estiverem concluídos.

Não criar rótulos em plataformas externas. Rascunhos com decisões pendentes não devem ser marcados como prontos para implementação.
