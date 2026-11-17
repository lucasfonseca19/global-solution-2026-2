# Global Solution 2026/2 — descarte da merenda

Para a próxima sessão de backend: [passagem atual para integração](docs/continuidade-integracao.md).

MVP acadêmico para registrar o descarte de alimento não servido e restos comestíveis dos pratos. A parte de Lucas tem um app demonstrativo React Native/Expo (web local), persistência local e simulador separado de RFID e balança conectado ao app, além da CLI independente. A API, o banco e a segurança real não fazem parte desta implementação; o contrato entre as partes permanece provisório.

## App atual: vazio e com sensores separados

A interface aprovada abre por padrão, sem exemplos históricos, botões de simulação, restauração de fixtures ou toolbar de teste. Instalação nova começa vazia; as pesagens confirmadas são persistidas em uma chave própria, sem importar ou apagar os dados da versão anterior.

Em um terminal, na raiz do repositório:

```sh
node --experimental-strip-types iot/bridge.mjs
```

Abra o simulador em `http://127.0.0.1:8095`. Em outro terminal:

```sh
cd mobile
npm ci
npm run web -- --port 8094
```

Abra o app em `http://localhost:8094`. Login de demonstração: `demo` / `merenda-demo`. Entre na refeição e aguarde “Balança conectada”; no painel separado, escolha a leitura e toque em “Colocar na balança”. O app identifica, calcula, anima e permite confirmar manualmente. A ponte é um simulador local, não substitui a API/banco/segurança exigidos pelo enunciado.

A sessão termina ao recarregar, mas as pesagens confirmadas permanecem. O Histórico começa sem pontos fictícios e cresce com os registros. Use o [guia de execução e gravação](docs/guia-simulador-gravacao.md) e veja as [evidências atuais](docs/evidencias/separate-simulator/README.md). Não há necessidade da flag de prévia; `EXPO_PUBLIC_LEGACY_APP=1` abre explicitamente o cliente anterior.

## Registro anterior: cliente legado

Requer Node.js compatível com Expo (ambiente registrado: Node 22.17.1 e npm 10.9.2). Na raiz:

```sh
cd mobile
npm ci
EXPO_PUBLIC_LEGACY_APP=1 npm run web
```

Abra o endereço local indicado pelo Expo. Credenciais fictícias: usuário `demo`, senha `merenda-demo`. Os dados dos serviços ficam no armazenamento local do navegador. A sessão não é persistida: recarregar volta ao login, mantendo os serviços.

O app tem quatro telas funcionais: Login, Histórico, Registro e Detalhes. O simulador pode ser usado pela interface de Registro ou pela CLI independente em [iot/README.md](iot/README.md). Passos e resultados esperados estão em [docs/guia-testes-lucas.md](docs/guia-testes-lucas.md).

## Evidências anteriores

Os tickets 09, 10 e 11 foram concluídos e verificados; commit de referência: `7b67860`. Logs e capturas reais estão em [evidências 09](docs/evidencias/09/README.md), [evidências 10](docs/evidencias/10/README.md) e [evidências 11](docs/evidencias/11/README.md). Há testes unitários do adaptador e fluxos web executados com o Chrome já instalado; não é necessário baixar um navegador para a execução descrita.

A documentação e as verificações finais estão consolidadas nas [evidências 12](docs/evidencias/12/README.md): 15 testes do adaptador, dois da CLI e cinco fluxos web passaram, além de TypeScript, exportação web e compatibilidade Expo. A execução nativa não foi comprovada: a instalação do Expo Go falhou por falta de espaço (`ENOSPC`), conforme [registro do impedimento](docs/evidencias/12/mobile-impedimento.txt). O bundle iOS gerado só comprova compilação/exportação. Portanto, o critério mobile nativo continua pendente e o ticket 12 não deve ser marcado como concluído.

## Materiais do grupo ainda pendentes

- PDF acadêmico final, incluindo o [relatório de implementação de Lucas](docs/relatorio-implementacao-lucas.md) como contribuição parcial.
- TXT exigido para a entrega final.
- Link público do pitch do grupo (limite de três minutos; o [roteiro de Lucas](docs/roteiro-demonstracao-lucas.md) cobre aproximadamente 45–60 segundos).
- Backend/API e banco reais, implementação e revisão do colega, contrato conjunto e eventual integração. Não há resultado ou link de integração a declarar.
- Verificação nativa pendente e revisão final do grupo.

O pacote final previsto no enunciado também requer código e README de execução; confira o [enunciado](ENUNCIADO.md) e a [especificação do MVP](.scratch/merenda/spec.md). A organização de responsabilidades está em [guia da equipe](docs/guia-equipe.md).

## Documentos e ferramentas

- [Guia de testes de Lucas](docs/guia-testes-lucas.md), [plano de testes](docs/plano-testes-lucas.md) e [relatório de implementação](docs/relatorio-implementacao-lucas.md).
- [Orientações mobile](docs/agents/mobile.md), [READMEs do app](mobile/README.md) e da [IoT simulada](iot/README.md).
- O disco temporário no SSD foi um contorno local durante as verificações por falta de espaço. Não é pré-requisito: os comandos acima são padrão.

## Uso de IA

Codex, executado no T3 Code, auxiliou o planejamento, a implementação, os testes e a documentação. Subagentes gpt-6.1-sol/medium implementaram as entregas; gpt-6.1-sol/high revisou; gpt-6-luna/high consolidou documentos. O orquestrador conferiu resultados e integrou correções. Lucas deve revisar e compreender o material antes da entrega acadêmica. Detalhes e limites estão no [relatório](docs/relatorio-implementacao-lucas.md).
