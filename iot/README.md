# IoT simulada — RFID e balança

CLI independente, sem React Native, servidor, banco ou hardware. Requer Node 22.17.1 ou compatível com `--experimental-strip-types`. Execute os comandos a partir da raiz:

```sh
node --experimental-strip-types iot/cli.mjs listar
node --experimental-strip-types iot/cli.mjs emitir sobra
node --experimental-strip-types iot/cli.mjs avaliar sobra
node --experimental-strip-types iot/cli.mjs avaliar restos
node --experimental-strip-types iot/cli.mjs avaliar zero
node --experimental-strip-types iot/cli.mjs avaliar desconhecido
node --experimental-strip-types iot/cli.mjs avaliar abaixo
```

`emitir` imprime somente código RFID e peso bruto. `avaliar` demonstra o consumidor local: associa lixeira, categoria e tara; calcula o peso líquido e valida. Códigos de saída: 0 para sucesso, 1 para leitura inválida e 2 para comando inválido. Sobra: `RFID-SIM-001`, bruto 4 kg, tara 1 kg, líquido 3 kg. Restos: `RFID-SIM-002`, bruto 3,5 kg, tara 1,5 kg, líquido 2 kg. Zero válido: bruto igual à tara e líquido 0 kg. Etiqueta desconhecida retorna `RFID_DESCONHECIDO`; peso abaixo da tara retorna `PESO_INVALIDO`.

O teste automatizado da CLI pode ser executado na raiz com `node --test iot/cli.test.mjs`.

`shared.ts` contém cenários e cálculo utilizados pelo app e pela CLI. A CLI não grava dados e não se conecta ao app: são demonstrações independentes com regras coerentes. O contrato técnico e a integração dependem de revisão conjunta com o colega. Não há sensor físico ou backend implementado.

## Simulador separado conectado ao app — 17/11/2026

Na raiz, `node --experimental-strip-types iot/bridge.mjs` abre o painel em `http://127.0.0.1:8095`. Ele envia cenário RFID/bruto; o app aprovado consome a leitura enquanto aguarda uma lixeira, aplica a tara e pede confirmação. O app já não possui botões de simulação nem exemplos pré-carregados.

A ponte local usa HTTP/cursor, sem dependências adicionais. GET `/events` estabelece uma posição inicial sem reproduzir eventos anteriores; consultas seguintes carregam somente eventos posteriores. Cada reinício tem identidade própria. A retenção em memória é limitada a 100 eventos; a ponte não salva pesagens. POST `/readings` aceita apenas cenários conhecidos de `shared.ts`, incluindo erros que o app deve rejeitar. O painel não comprova que o app gravou: a confirmação ocorre no app.

Testes: `node --experimental-strip-types --test iot/bridge.test.mjs iot/cli.test.mjs`. A CLI antiga permanece independente; painel/ponte formam o caminho integrado de demonstração. Isso não implementa a API acadêmica em Java/ASP.NET nem substitui banco/segurança. Execução em celular físico precisa de IP/rede e verificação própria; veja [guia e roteiro](../docs/guia-simulador-gravacao.md).
