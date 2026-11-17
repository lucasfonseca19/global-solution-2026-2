# App vazio e simulador separado — 17/11/2026

Mudança confirmada por Lucas para demonstrar os fluxos no vídeo. Worktree existente, sem descarte de alterações anteriores, sem commit/push/PR. Backup pré-rodada dos arquivos tocados em `/tmp/merenda-before-separate-simulator`.

## Resultado

- Interface aprovada abre por padrão, sem histórico pré-carregado, cenários, restauração de exemplos, credenciais preenchidas ou toolbar. Fonte Allo e estrutura da Home/Histórico preservadas.
- Primeiro acesso vazio, armazenamento `merenda.servicos.aprovado.v1` próprio; confirmação persiste e reload encerra somente a sessão. Não importar nem apagar `merenda.servicos.v1`. Exemplos antigos permanecem nos arquivos de fixtures/testes e no cliente legado explicitamente selecionado.
- Painel local `iot/simulator.html`, servido por `iot/bridge.mjs` em 8095. Emite somente RFID e bruto dos cenários compartilhados. App calcula e valida; confirmação salva. Não se trata de API acadêmica, autenticação real ou banco relacional.
- Cliente faz consultas HTTP com posição por instância do simulador. Entrada/retomada estabelece o cursor atual; eventos antigos não são reaproveitados. Aceitação apenas na pesagem ativa em ciclo aguardando; envios durante conferência/confirmado/outro fluxo não se tornam a próxima pesagem.
- Web mantém a escuta durante troca de abas, necessária para operar o painel separado. No app nativo, background suspende a assinatura; o retorno sincroniza sem replay. Nenhuma execução nativa foi comprovada.
- Sem dependências novas. Serviço padrão restrito ao loopback e origens web locais; IP/rede para celular é configuração explícita.

## Evidência executada

| Verificação | Resultado |
| --- | --- |
| TypeScript | Passou: [log](typecheck.txt). |
| Unidade do app | 36 testes, oito arquivos: [log individual](unit.txt). Quatro novos casos cobrem chave dedicada/persistência, cursor/repetição, reinício/reconexão, dados malformados e desmontagem. Foram observados falhando antes dos módulos existirem. |
| IoT | Quatro testes (dois da ponte, dois da CLI): [log](iot.txt). Ponte cobre consumo/cursor sem replay, cenários inválidos, corpo inválido e origem externa. |
| UI integrada | `mobile/simulator-qa.cjs` passou: [log](web.txt), [cenários](qa.json). Navegador Chrome com contexto isolado; usa duas páginas reais, app e painel. |
| Legado | Seis fluxos anteriores passaram com `EXPO_PUBLIC_LEGACY_APP=1`: [log](legacy-web.txt). |
| iOS | Bundle exportado: [log](ios-export.txt). Compilação/exportação, sem runtime no celular/simulador. |

Revisão independente encontrou perda da leitura ao trocar de aba, pois React Native Web emitia background e interrompia a assinatura. O caso foi reproduzido falhando, corrigido para preservar a escuta web e incluído no roteiro (evento de visibilidade hidden/visible). Não houve outros achados concretos nessa revisão.

Capturas reais: [Home vazia](home-vazia.png), [Histórico vazio](historico-vazio.png), [pesagem sem controles de teste](pesagem-limpa.png), [peso recebido](peso-recebido.png), [Histórico construído](historico-construido.png), [painel separado](simulador.png). Nenhum `pageerror` nos fluxos verificados. Não há dados reais de escola.

## Reproduzir

Na raiz, terminal 1:

```sh
node --experimental-strip-types iot/bridge.mjs
```

No diretório `mobile`, terminal 2:

```sh
npm run web -- --port 8094
```

Na raiz, terminal 3:

```sh
node mobile/simulator-qa.cjs
npm --prefix mobile run typecheck
npm --prefix mobile test -- --reporter=verbose
node --experimental-strip-types --test iot/bridge.test.mjs iot/cli.test.mjs
npm --prefix mobile run test:e2e
```

O roteiro usa um contexto novo para provar instalação vazia e encerra seus próprios navegadores. Não limpa o armazenamento de uso pessoal. Os roteiros antigos de prévia com botões/fixtures são evidência histórica; para a interface atual, usar este roteiro.

[Guia de execução e gravação](../../guia-simulador-gravacao.md). Banco/API/segurança, evidência nativa e pacote final permanecem pendentes conforme [cobertura acadêmica](../../ux/cobertura-enunciado-pesagem.md).
