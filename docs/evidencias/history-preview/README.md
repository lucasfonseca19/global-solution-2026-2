# Histórico da prévia — 17/11/2026

Implementação do protótipo aprovado no app React Native/Expo da worktree `t3-5b5fb2b8`. A versão normal e o backend não foram integrados ou redesenhados. Sem push.

## Comportamento

- Filtros de refeição e 7/30 dias, incluindo o dia local atual. Cada janela anterior tem o mesmo número de dias e termina na véspera da janela selecionada.
- Gráfico de linha em kg, com pontos selecionáveis por toque/clique/teclado. As lacunas de calendário não são ligadas. Zero confirmado aparece no eixo zero; pendentes não viram zero.
- Média calculada por serviço concluído, nunca pelo número de dias. O chip compara as médias das duas janelas com a mesma refeição: queda verde, aumento vermelho, estabilidade neutra. Texto e seta acompanham a cor.
- Comparação só aparece com pelo menos dois serviços concluídos em cada janela. Se a média anterior era zero e a atual é positiva, a variação aparece em kg, evitando divisão por zero. Percentuais são variação da média em kg, não porcentagem da produção desperdiçada.
- `Ver cálculo` recolhido inicialmente; revela quantidades de serviços, janelas, regra de cálculo e limites. Variação usa médias antes do arredondamento; percentuais arredondados para zero recebem estado estável.
- Selecionar ponto revela divisão por categoria e acesso aos detalhes. A lista mostra até cinco registros inicialmente, expansível em blocos de cinco. Concluídos abrem detalhes; parciais retomam a pesagem existente.
- Casos sem registros ou sem concluídos apresentam estado vazio e média ausente, sem inventar valores.
- Botão genérico de novo registro e explicações repetidas retirados do Histórico. A ação de pesar continua na Home. Controles de demonstração ficam recolhidos; sair continua disponível no cabeçalho.
- Navegação Histórico → Hoje usa `popTo('Home')`, evitando empilhar novas cópias da Home e do Histórico ao alternar as abas.

O gráfico usa geometria simples de `View` e `Pressable` nativos, sem biblioteca ou dependência nova. Allo e estilos compartilhados foram preservados. Há no máximo 30 posições de calendário por gráfico. O SDK instalado é Expo 58 / React Native 0.88.

## Dados de demonstração

`historyExamples.ts` amplia somente o conjunto inicial da prévia em memória: exemplos determinísticos para três refeições, até 60 dias anteriores ao dia de abertura. Preserva os três exemplos básicos e a unicidade por data/refeição; não cria registros de hoje. Não são sensores ou resultados reais da escola. Registros feitos durante o uso continuam vindo do adaptador existente e atualizam o Histórico ao retornar à tela.

No painel Demonstração, `Restaurar exemplos básicos` substitui tudo pelos três exemplos originais após confirmação. Recarregar o navegador inicia novamente o conjunto ampliado. A versão original continua usando seus fixtures e armazenamento anteriores.

## Verificações reais

- `npm test`: 21 testes passaram em quatro arquivos, incluindo seis casos novos do modelo de histórico. Cobrem cálculo da média, comparação de amostras de tamanhos diferentes, limites das janelas, zero, ausência de dados, parciais, refeição e divisão por zero. O teste inicial foi executado antes da implementação e falhou por ausência do módulo; os seis casos passaram após a implementação.
- `npm run typecheck`: passou.
- `node history-qa.cjs`: passou no Chrome headless contra `localhost:8094`. Filtros; cálculo recolhido/expandido; chips de alta/queda; seleção de ponto por teclado; detalhes; expansão da lista; restauração; vazio; exclusão de parciais da média; retomada pela lista. Nenhum `pageerror`. Resultado estruturado em [qa.json](qa.json).
- `node home-qa.cjs`: regressão da Home passou com o novo conjunto de demonstração.
- `expo export --platform ios`: bundle exportado com sucesso, fonte TTF incluída. Isso comprova empacotamento, não execução nativa.
- `git diff --check`: passou.

A primeira tentativa de QA supôs que o filtro voltaria para Almoço após atualizar os dados; corrigido o seletor do roteiro para respeitar a refeição que permaneceu selecionada. A segunda detectou cópias do Histórico após alternar as abas, levando à correção de navegação descrita acima. O roteiro completo passou depois da correção.

Capturas reais e conferidas: [mobile-390.png](mobile-390.png), [mobile-320.png](mobile-320.png), [desktop-1280.png](desktop-1280.png), [increase-selected.png](increase-selected.png) e [empty.png](empty.png). As capturas mostram o conteúdo visível da janela; o Histórico possui rolagem interna.

## Como repetir

No diretório `/Users/lucas/.t3/worktrees/global-solution-2026-2/t3-5b5fb2b8/mobile`:

```sh
EXPO_PUBLIC_DESIGN_PREVIEW=1 npm run web -- --port 8094
```

Em outro terminal no mesmo diretório:

```sh
npm run typecheck
npm test
node history-qa.cjs
node home-qa.cjs
```

Para conferir manualmente: Entrar → Histórico. Alternar Almoço/Jantar para ver queda/aumento; testar 7/30 dias; abrir o cálculo; selecionar um ponto e abrir detalhes. Depois, Hoje → Lanche da tarde → simular e confirmar apenas sobras → voltar → Histórico → Lanche da tarde. A lista mostra o parcial, e a média continua excluindo esse registro. Tocar nele retoma a pesagem.

## Limites

Dados em memória e simulados, sem API real. Ainda não foi validado em dispositivo ou simulador nativo. As regras antigas de uma pesagem por categoria e conclusão automática continuam no adaptador: múltiplas pesagens e conclusão explícita são uma etapa separada. Dados de descarte em kg não demonstram eficiência nem redução causal de desperdício. Não houve merge para main ou push.

## Ajuste do eixo X — 17/11/2026

Na visão de 7 dias, todas as sete datas aparecem em DD/MM, inclusive dias sem registro. Na visão de 30 dias, três marcações usam o mesmo formato. Cada rótulo fica centralizado na posição real da respectiva data; o gráfico e as médias não mudaram. Checagem de TypeScript passou. Conferência web verificou contagem/formato das datas e ausência de sobreposição ou corte em 320, 390 e 1280 px, sem `pageerror`. Captura conferida em [eixo-x-7-dias.png](eixo-x-7-dias.png). O roteiro `history-qa.cjs` inclui as novas contagens para futuras execuções.

## Marcadores à frente do traço — 17/11/2026

Causa: o desenho intercalava segmento e marcador por registro, permitindo que o segmento seguinte cobrisse o marcador anterior. Agora todos os segmentos são desenhados antes de todos os marcadores. Preenchimento branco dos pontos e destaque do selecionado preservados, sem acrescentar biblioteca. TypeScript passou; conferência visual do gráfico em 30 dias e seleção de ponto no Chrome passou, sem `pageerror`. Recortes: [marcadores-30-dias.png](marcadores-30-dias.png) e [marcador-selecionado.png](marcador-selecionado.png).
