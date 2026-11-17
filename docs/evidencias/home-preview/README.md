# Home da prévia — 17/11/2026

Escopo: Home React Native com dia/data local em linha, refeições de demonstração (almoço, lanche da tarde e jantar), situação e acesso à pesagem/resultado. Navegação inferior Hoje/Histórico ligada à stack existente; sem nova dependência. O Histórico existente não foi redesenhado. Agentation preservado.

Arquivos: mobile/src/preview/PreviewHome.tsx, ligação em DesignPreview.tsx e parâmetro inicial de contexto em PreviewRegistro.tsx. Abrir uma refeição pela Home não cria registro: a primeira confirmação continua sendo o ponto de gravação do adaptador existente.

Verificações reais: npm run typecheck passou; npm test passou (15 testes, três arquivos). node home-qa.cjs passou em localhost:8094: refeições inicialmente não iniciadas, seleção de lanche sem repetir formulário, primeira confirmação refletida como Em andamento, retomada, estado Concluída refletido do adaptador, navegação Hoje/Histórico e abertura de detalhes. Nenhum pageerror. A primeira tentativa de QA encontrou seletor de texto ambíguo devido à tela anterior retida pela navegação; corrigido o seletor do teste, sem alteração de produto para contornar o teste.

Capturas reais: mobile.png (390 × 844), desktop.png (1280 × 900). Conferência visual realizada; captura desktop foi repetida após assentamento da navegação, pois a captura inicial ocorreu antes da atualização do layout.

Limitações: dados em memória, API simulada, opções de refeição fixas sem configuração. Situação deriva do adaptador legado: ele ainda completa com duas categorias. Várias pesagens por categoria e conclusão manual não foram implementadas nesta entrega limitada à Home. Não comprova execução nativa. Não houve integração do backend, merge para main ou push.

Executar: no diretório mobile desta worktree, EXPO_PUBLIC_DESIGN_PREVIEW=1 npm run web -- --port 8094. Prévia atual http://localhost:8094. Para repetir a conferência: node home-qa.cjs, com esse servidor ativo.

## Refinamento da Home e fonte Allo — 17/11/2026

Estados diferenciados por `○`, `●` e `✓`, com rótulos de texto. Refeição em andamento recebe fundo roxo suave e “Continuar pesagem”. Nomes de refeições em 20 px, ações em 14 px. A linha inteira permanece tocável. Não há botão genérico adicional ou novos gráficos na Home.

Allo 1.0.1 incorporada localmente, com licença OFL; três eixos utilizados conforme `docs/ux/tipografia-allo.md`. WOFF2 no web e TTF no mobile. A mudança tipográfica alcança textos, campos e visor; demais telas não receberam redesenho de fluxo.

O roteiro `mobile/home-qa.cjs` foi atualizado e executado com sucesso no Chrome headless contra o servidor de desenvolvimento. Além do fluxo anterior, verificou:

- Família Allo efetivamente carregada (`FontFace.status = loaded`) e faixa de pesos `100 900` declarada.
- Nome da refeição com eixos `ROND 50`, `opsz 20`, `wght 550` no estilo computado.
- Visor com `ROND 35`, `opsz 32` e `tabular-nums`. Medidas reais de `11111111` e `88888888`: ambas **261,046875 px** no mesmo estilo.
- Identificadores nos detalhes com `ss02` e números tabulares efetivos no CSS.
- Home em 320 px com nome e ação contidos na largura da tela, além de conferência visual em 390 e 1280 px.
- Ausência de `pageerror` durante esse fluxo.

Resultados estruturados: [allo-qa.json](allo-qa.json). Capturas atualizadas: [mobile.png](mobile.png), [desktop.png](desktop.png), [mobile-em-andamento.png](mobile-em-andamento.png), [mobile-concluida.png](mobile-concluida.png), [mobile-320.png](mobile-320.png) e [pesagem-allo.png](pesagem-allo.png).

O TTF original foi inspecionado: família `Allo Variable`; eixos `opsz 9–32`, `wght 100–900`, `ROND 0–100`. `expo config --type public` reconheceu a configuração do plugin. Não houve instalação de pacote novo nem alteração das regras de dados.

Não foi executada validação nativa da fonte, do layout ou do plugin em build instalado; a falha de carregamento da fonte também não foi provocada no QA. A conclusão manual permanece pendente.

Validação automática desta rodada: `npm run typecheck` e `npm test` (15 testes) passaram. Exportação iOS concluída, incluindo `AlloVariable.ttf` no conjunto de assets; isso verifica empacotamento, não execução nativa. Saída em `/tmp/merenda-allo-ios-export-final`.
