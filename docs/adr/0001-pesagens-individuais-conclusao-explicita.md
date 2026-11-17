# Pesagens individuais e conclusão explícita do serviço

17/11/2026. Decisão funcional aceita por Lucas nesta conversa; revisão do contrato e implementação com o colega pendentes. Não representa aprovação do backend nem alteração já implementada.

Um serviço de alimentação pode reunir várias pesagens de lixeiras, inclusive da mesma categoria. Cada pesagem confirmada contribui uma vez para a soma da categoria e para o total do serviço. O operador conclui explicitamente as pesagens do serviço; a presença de valores nas duas categorias não permite inferir que chegou a última lixeira. A data e o tipo de refeição continuam identificando um único serviço.

Esta decisão substitui a regra anterior de manter somente o último peso de cada categoria e de completar automaticamente após confirmar as duas categorias. Corrigir uma pesagem deve substituir aquele registro individual, sem somar sua versão anterior nem apagar as outras pesagens. Uma leitura recebida continua sendo uma prévia, sem gravação automática.

## Motivo e alternativa

O modelo anterior era menor, mas só representava uma pesagem final por categoria. Não distinguia duas lixeiras da mesma categoria nem permitia ao operador indicar quando terminou uma quantidade variável de pesagens. Adotar registros individuais e conclusão explícita aumenta o trabalho de contrato/dados, mas permite representar essa rotina sem adivinhar a última lixeira.

## Limites e alinhamento necessário

- Não confundir várias lixeiras/pesagens com várias balanças simultâneas. A balança e o RFID simulados continuam sendo a base.
- Não assumir que uma nova leitura do mesmo RFID é uma nova carga: ela pode ser repetição ou correção. Definir identidade de pesagem e proteção contra duplicações com o colega antes de implementar.
- Definir condições para concluir: categoria sem registro, confirmação explícita de ausência de descarte e prévia não confirmada. Zero continua diferente de ausência de informação.
- Definir se corrigir após concluir mantém o serviço concluído ou exige reabertura. Não existe decisão aprovada de bloqueio definitivo, auditoria ou versionamento.
- Rotas, campos, status técnicos e esquema do banco serão revisados conjuntamente. Não aproveitar automaticamente a semântica do PUT antigo.
- Cadastro/configuração dos tipos de refeição foi solicitado para o futuro; não está autorizado nesta entrega.

## Exemplos para alinhar comportamento

1. Duas pesagens distintas de sobra, 3 kg e 1 kg, somam 4 kg nessa categoria. Uma pesagem de restos de 2 kg leva o total a 6 kg, ainda em andamento até a conclusão explícita.
2. Corrigir o primeiro registro de 3 kg para 2,5 kg produz sobra de 3,5 kg e total de 5,5 kg. O registro de 1 kg permanece intacto.
3. Receber novamente a leitura de 3 kg não pode, por si só, somar outros 3 kg. O contrato deve distinguir repetição, nova pesagem e correção.
4. Falha ao confirmar ou concluir não pode produzir sucesso visual nem alterar o estado salvo. A API real e o adaptador precisam compartilhar essas regras.

Estes são critérios propostos para verificação futura, não testes executados. O app e a prévia existentes ainda representam o modelo anterior e não comprovam esta decisão.

## Fechamento aprovado e implementação na prévia — 17/11/2026

Lucas aprovou exigir registros nas duas categorias, incluindo zero confirmado; confirmar ou descartar a prévia antes de concluir; ciclos explícitos com repetição idempotente; correção individual após conclusão mantendo o serviço concluído. Novas pesagens não são acrescentadas a um serviço já concluído: nesse estado, escolhe-se um registro para corrigir.

Implementado no adaptador demonstrativo e no fluxo DesignPreview desta worktree, com IDs por registro e ciclos confirmados, soma por categoria e conclusão separada. A versão original permanece disponível pelo caminho legado e conserva seu contrato anterior. Não é implementação ou acordo de API/banco reais. Evidências: [redesenho](../evidencias/weighing-redesign/README.md).
