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

O teste automatizado da CLI, já registrado nas evidências do ticket 10, pode ser executado na raiz com `node --test iot/cli.test.mjs`. Logs reais de cenários e códigos de saída: [docs/evidencias/10/cli.txt](../docs/evidencias/10/cli.txt), conferidos na [documentação do ticket 10](../docs/evidencias/10/README.md).

`shared.ts` contém cenários e cálculo utilizados pelo app e pela CLI. A CLI não grava dados e não se conecta ao app: são demonstrações independentes com regras coerentes. O contrato técnico e a integração dependem de revisão conjunta com o colega. Não há sensor físico ou backend implementado.
