# Allo no Merenda

Aplicada na prévia isolada em 17/11/2026, a pedido de Lucas. A alteração de composição fica na Home; nas demais telas, muda a tipografia. Sem mudanças no domínio, backend ou regras de conclusão.

## Fonte e recursos conferidos

Allo 1.0.1, de Josh Puckett. Download oficial: https://allo.joshpuckett.me/downloads/Allo-1.0.1.zip. Documentação: https://github.com/joshpuckett/allo. Arquivos copiados sem modificar os desenhos ou metadados; licença SIL OFL 1.1 preservada em `mobile/assets/fonts/licenses/Allo-OFL.txt`.

O site apresenta tamanho óptico de 14 a 32; a documentação e a tabela `fvar` do TTF baixado confirmam faixa de **9 a 32**. Abaixo de 14, o desenho mantém as formas de texto e abre o espaçamento. A inspeção do binário também confirmou a família `Allo Variable`, 18 instâncias nomeadas e os eixos abaixo.

| Recurso | Capacidade | Uso no Merenda |
| --- | --- | --- |
| `wght` | Peso contínuo de 100 a 900 | Corpo 400, ações 500/600, dia 600; ajustes finos 550 nos nomes e 650 na marca |
| `ROND` | Arredondamento de 0 a 100; padrão 50 | Corpo 40, números 35, nomes 50, títulos grandes 55, marca 70 |
| `opsz` | Tamanho óptico de 9 a 32 | Acompanha o tamanho declarado do texto, limitado à faixa da fonte; visor de 54 px usa desenho Display 32 |
| `tnum` | Algarismos com a mesma largura | Visor animado, valores, régua e totais; mantém as colunas e o número estáveis |
| `ss02` | Distingue I, l, 1 e 0 | Identificadores RFID nos detalhes, onde confundir caracteres atrapalha a conferência |
| Símbolos | Círculos, confirmação, setas e outros símbolos de interface | `○`, `●` e `✓` nos estados da Home, sempre acompanhados por texto |
| Português | Letras acentuadas e cedilha | Textos normais em UTF-8; sem substituir acentos |

Também avaliados: `ss01` (a de um andar), `ss03` (4, 6 e 9 abertos), `cv01`–`cv05` (alternativas individuais), zero cortado, frações, sobrescritos/subscritos, numeradores/denominadores, pontuação ajustada a maiúsculas, ligaturas e setas contextuais. Não são necessários no fluxo atual. O a padrão preserva a familiaridade; os kg continuam decimais. As oblíquas são desenhos separados, não um eixo de inclinação: não adicionadas, pois não há texto que precise delas. Se forem necessárias, carregar o arquivo Oblique verdadeiro em vez de sintetizar itálico.

Os espaçamentos negativos antigos foram retirados da prévia para deixar o desenho óptico e o kerning trabalharem. Isso também evita desativar ligaturas no navegador. Não se anima a forma da fonte: o movimento da pesagem continua representando apenas a leitura simulada.

## Integração

- `mobile/src/typography.tsx`: família e regra óptica compartilhadas. `allo(tamanho, arredondamento, pesoOpcional)` concentra os ajustes. Sem peso opcional, respeita `fontWeight` do componente.
- `mobile/src/rnr/text.tsx`: aplica a regra aos textos da prévia, mantendo os estilos explícitos dos componentes.
- `AppText` e estilos de entrada: levam a fonte também à versão original, sem redesenhar suas telas.
- `fontSources.web.ts`: WOFF2 completo de 493.420 bytes. Mantém os três eixos; o arquivo Friendly menor fixaria o arredondamento e não atende aos ajustes escolhidos.
- `fontSources.ts`: TTF original de 1.262.728 bytes para Android/iOS. Sem pacote npm adicional; `expo-font` já existia.
- `mobile/app.json`: plugin `expo-font` para incorporar o TTF em futuros builds nativos. O carregamento em runtime cobre web e Expo Go. A interface aguarda o carregamento; uma falha oferece a fonte do sistema com aviso, sem bloquear o fluxo.
- O SDK instalado é Expo 58 / React Native 0.88, que oferece `fontVariationSettings`. A documentação oficial está em https://docs.expo.dev/develop/user-interface/fonts/. Uso nativo ainda precisa de conferência em dispositivo; exportar bundle não comprova renderização nativa.

No navegador, `ss02` usa `fontFeatureSettings`; no React Native, `fontVariant: ['stylistic-two', 'tabular-nums']`. Passar `stylistic-two` diretamente ao CSS invalida a propriedade; a tradução fica centralizada em `identifierType`.

## Home

Mantém data, refeições e navegação Hoje/Histórico. Os estados têm texto e formas distintas; somente a refeição em andamento recebe fundo roxo suave e ação “Continuar pesagem”. Os nomes passam a 20 px e as ações a 14 px. A linha inteira continua tocável e acessível como botão; nomes e ações podem quebrar em telas estreitas.

A Home ainda reflete os estados do adaptador existente. Ele conclui automaticamente ao confirmar as duas categorias. A decisão de múltiplas pesagens e conclusão explícita permanece registrada na ADR do checkout principal e não foi implementada nesta alteração visual.

Verificação e capturas: `docs/evidencias/home-preview/README.md` e `allo-qa.json`.
