# IoT simulada — RFID e balança

CLI independente, sem React Native, servidor, banco ou hardware. Requer Node 22.17.1 ou compatível com `--experimental-strip-types`. Executar na raiz:

```sh
node --experimental-strip-types iot/cli.mjs listar
node --experimental-strip-types iot/cli.mjs emitir sobra
node --experimental-strip-types iot/cli.mjs avaliar sobra
node --experimental-strip-types iot/cli.mjs avaliar restos
node --experimental-strip-types iot/cli.mjs avaliar zero
node --experimental-strip-types iot/cli.mjs avaliar desconhecido
node --experimental-strip-types iot/cli.mjs avaliar abaixo
```

`emitir` produz somente código RFID e peso bruto. `avaliar` demonstra o consumidor local: identifica categoria/tara, calcula o líquido e valida. Saída 0 para sucesso, 1 para leitura inválida e 2 para comando inválido. Os dois últimos comandos devem falhar, com códigos RFID_DESCONHECIDO e PESO_INVALIDO. Sobra resulta em 3 kg; restos em 2 kg; zero em 0 kg.

`shared.ts` contém os mesmos cenários e cálculo usados pelo adaptador do app, sem importar RN ou dependências. Nada é gravado pela CLI. Não há transporte conectado entre CLI e app: são demonstrações independentes com dados coerentes, conforme o contrato provisório, ainda sujeito à revisão do colega.

Teste automatizado da fronteira CLI, na raiz: `node --test iot/cli.test.mjs`.
