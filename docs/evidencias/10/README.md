# Ticket 10 — registro e IoT simulada

Execução local em 14/11/2026. Escopo limitado a registro, adaptador e CLI; sem backend/banco, persistência, restauração, exclusão ou execução iOS. Contrato provisório, sem alegação de integração real.

## Resultados

- `cd mobile && npm run typecheck`: passou.
- `cd mobile && npm test`: 9 testes passaram (5 de consulta e 4 de registro).
- `cd mobile && npm run test:e2e`: 3 fluxos passaram no Chrome instalado, incluindo registro e as duas consultas existentes.
- `cd mobile && npm run build:web`: exportação web concluída.
- CLI: listar/emitir/avaliar; sobra 3 kg, restos 2 kg, zero 0 kg. RFID desconhecido e bruto abaixo da tara retornaram os erros esperados, com saída 1.
- `git diff --check`: passou.

Logs reais compactos em arquivos `.txt` ao lado. `red-previa.txt` registra a falha anterior à implementação (`api.avaliar is not a function`); `green-previa.txt` registra o primeiro verde. Os demais testes de escrita foram acrescentados após essa primeira fatia: não representam ciclos red/green individuais. Não confundir isso com cobertura prévia de toda a implementação.

## Comportamentos observados

A fronteira pública do adaptador verifica prévia sem escrita, cálculo pela tara, confirmação pendente/completa, correção substitutiva, unicidade, zero e rejeição atômica de entradas inválidas. O PUT substitui o conjunto inteiro; a tela envia as duas categorias para preservar a outra.

O fluxo web cria serviço na primeira confirmação, procura e continua a mesma data/tipo, demonstra leitura inválida eliminando a prévia anterior, confirma total 5 kg e depois zero, invalida ao mudar serviço e consulta o resultado único no histórico. Painel começa recolhido, e categoria vem do RFID. Prévia mostra peso líquido em destaque e não altera o resumo confirmado. O botão de sucesso depende da resposta de gravação; falha remove a prévia e exibe erro. Não há teste de falha de armazenamento, pois armazenamento pertence a 11.

## Ambiente e limites

A primeira tentativa de execução encontrou ENOSPC no disco interno. O build revelou também necessidade de incluir `iot/` no watchFolders do Metro, corrigida em `mobile/metro.config.js`. Uma execução intermediária encontrou tela anterior retida ao voltar ao histórico; corrigido usando popTo, e os três fluxos passaram na repetição.

Para reduzir escrita no disco interno, as execuções finais usaram `TMPDIR=/Volumes/ssd/Faculdade/merenda-ticket10-tmp`, pasta temporária própria no SSD externo. Nenhum dado pessoal foi apagado; nenhum navegador foi baixado. A pasta temporária contém cache gerado nesta validação e pode ser removida pelo responsável quando não houver processo usando-a.

Captura `registro-completo.png` registra o estado de duas categorias confirmadas. O resultado web não comprova execução nativa: iOS permanece para 12. Interface Craft foi aplicada à hierarquia do líquido, uma ação de confirmação e separação do painel de demonstração; React Native usou Pressable, StyleSheet, textos acessíveis e rolagem com insets. Não foram adicionadas dependências ou animações.

## Conferência do orquestrador e revisão

Nove testes, typecheck e três fluxos web reexecutados com sucesso. `orquestrador-cli.txt` registra os cinco cenários com códigos de saída esperados. A revisão identificou aceitação de propriedade herdada como cenário CLI; `cli-review-red.txt` reproduz a falha e `cli-review-green.txt` registra dois testes aprovados após Object.hasOwn. Reproduzir com `node --test iot/cli.test.mjs` na raiz.
