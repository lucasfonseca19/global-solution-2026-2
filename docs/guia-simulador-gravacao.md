# App limpo e simulador: execução e gravação

17/11/2026 — atualização da integração: a execução padrão usa API Java e PostgreSQL. Inicie primeiro banco/API conforme o [README](../README.md); login `operador` / `merenda123`. Para o roteiro demonstrativo local antigo, iniciar o app com `EXPO_PUBLIC_DATA_MODE=demo` e usar `demo` / `merenda-demo`. Os passos de pesagem e o painel separado permanecem iguais. No modo integrado, os registros ficam no banco; não há fallback local.

Registro do modo local anterior: interface aprovada com Allo, Home e Histórico preservados. Primeiro acesso sem dados; confirmações persistidas localmente. As leituras RFID/balança e o login são demonstrativos. Esta ponte não é o backend acadêmico e não oferece autenticação real ou banco de dados relacional.

## Abrir as duas partes

Requer Node compatível com o projeto (22.17.1 ou superior com remoção de tipos), dependências do app instaladas com `npm ci` em `mobile` e duas janelas/abas. Na raiz, terminal 1:

```sh
node --experimental-strip-types iot/bridge.mjs
```

Simulador: `http://127.0.0.1:8095`.

No terminal 2, a partir da raiz:

```sh
cd mobile
npm ci
npm run web -- --port 8094
```

App: `http://localhost:8094`. Não precisa da flag de prévia. Login `demo`, senha `merenda-demo`. O login não aparece preenchido e os controles de simulação/restauração/toolbar não fazem parte do app.

1. No app, entrar e escolher uma refeição.
2. Aguardar “Balança conectada”. A primeira consulta apenas sincroniza a posição dos sensores: não reaproveita leituras emitidas anteriormente.
3. No simulador separado, escolher o cenário e tocar em “Colocar na balança”. Pode alternar entre abas ou deixá-las lado a lado.
4. No app, acompanhar identificação, peso/régua e estabilização; só então confirmar ou descartar.
5. Para outra lixeira, tocar em “Nova pesagem”, aguardar conexão e emitir outra leitura no simulador. Envios feitos enquanto o app está na Home, em outro fluxo ou com leitura já pronta não ficam agendados para o próximo ciclo.

“Leitura enviada” no simulador significa apenas que a ponte a recebeu; não comprova confirmação ou gravação no app. É o botão de confirmação do app que salva.

## Roteiro para passar pelos fluxos

| Passo | Ação | O que demonstrar |
| --- | --- | --- |
| 1 | Login e consulta inicial | Home com refeições não iniciadas; Histórico com zero registros, sem pontos fictícios. |
| 2 | Abrir almoço; enviar “Cozinha · 3 kg” | RFID-SIM-001 identificado, peso bruto 4 kg, tara 1 kg, líquido 3 kg; número e régua estabilizam juntos. Mostrar bruto/tara nos detalhes recolhidos. |
| 3 | Confirmar e iniciar nova pesagem | Total parcial de 3 kg; ainda não conclui sem a outra categoria. Repetir cozinha em novo ciclo soma outra contribuição. |
| 4 | Enviar etiqueta desconhecida e peso abaixo da tara | Erros claros, nenhuma contribuição nova. Emitir leitura válida para continuar. |
| 5 | Enviar pratos e descartar a prévia | Total salvo não muda. Sair com leitura pendente pede descarte; pesagens confirmadas permanecem. |
| 6 | Enviar pratos novamente, confirmar e concluir | As duas categorias permitem concluir, mas não concluem automaticamente. Home passa a “Ver resultado”. |
| 7 | Corrigir registro individual | Escolher o registro de cozinha; no simulador enviar “Cozinha · 2,50 kg”. Só essa contribuição muda; o serviço continua concluído. Lixeira diferente é rejeitada. |
| 8 | Consultar Histórico | Aparece o serviço concluído e seu ponto real da demonstração; testar 7/30 dias, refeição e detalhes. Não inventar comparação quando não há base anterior. |
| 9 | Outra refeição com zero nas duas categorias | Enviar cozinha sem descarte e pratos sem descarte, confirmar ambos e concluir. Zero confirmado é diferente de categoria aguardando. |
| 10 | Recarregar e entrar novamente | Sessão encerra; os registros confirmados permanecem. Prévia não confirmada não é salva. |
| 11 | Excluir um serviço de hoje | Mostrar confirmação, cancelar e depois excluir; o registro desaparece do Histórico/Home. |

Esse é um roteiro completo de exploração, não uma obrigação de exibir cada clique no pitch. O vídeo acadêmico tem limite de três minutos e também precisa cobrir problema/cidadão, outras partes do projeto, impacto e diferencial. Gravar material dos fluxos permite escolher os trechos mais claros; não apresentar a ponte como API em Java/ASP.NET.

O Histórico não terá uma tendência de vários dias imediatamente: o app vazio registra somente o dia atual e não permite forjar datas. Média/variação aparecem conforme houver base válida. Isso preserva a regra aprovada; o gráfico não exige dados pré-carregados pelo enunciado.

## Persistência e novo início

Os serviços novos usam `merenda.servicos.aprovado.v1` no armazenamento local (web/AsyncStorage). A chave anterior `merenda.servicos.v1` não é importada ou apagada. Recarregar não limpa o app; para gravar uma tomada começando vazia sem apagar dados, usar um perfil/sessão de navegador isolado. Não há botão de teste oculto para restaurar exemplos.

## Celular físico e limites

A ponte usa HTTP simples, `fetch` e cursor, compatíveis com a arquitetura React Native; a validação desta rodada é web e exportação de bundle, não runtime nativo. `localhost` no telefone é o próprio telefone. Para testar em rede local, escolher o IP do computador e liberar a escuta explicitamente:

```sh
SIMULATOR_HOST=0.0.0.0 node --experimental-strip-types iot/bridge.mjs
```

No terminal do app, configurar antes de iniciar o Expo (substituir pelo IP real):

```sh
EXPO_PUBLIC_SIMULATOR_URL=http://192.168.1.10:8095 npm start
```

No navegador via IP de rede, definir também a origem exata permitida em `SIMULATOR_ALLOWED_ORIGIN`, por exemplo `http://192.168.1.10:8094`. Por padrão, somente origens web locais são permitidas; não foi criado um serviço público.

Banco/API/segurança reais, evidência nativa, PDF/TXT/ZIP e pitch público continuam etapas da entrega geral. Ver [cobertura do enunciado](ux/cobertura-enunciado-pesagem.md).
