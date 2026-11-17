# Passagem para integrar o backend ao Merenda

Estado conferido em 17/11/2026. Este é o ponto de entrada atual; os documentos de prévia antigos descrevem etapas históricas e não substituem este arquivo.

## Diretório e checkpoint

Trabalhar na worktree existente:

`/Users/lucas/.t3/worktrees/global-solution-2026-2/t3-5b5fb2b8`

Branch: `t3/rnr-weighing-preview`. O checkpoint local preparado nesta passagem reúne o app aprovado e seu simulador. Conferir `git log -1`, `git status --short` e alterações adicionais antes de agir. Não recomeçar de `main` nem substituir esta worktree. Arquivos de experimentos, skills locais e bundles exportados podem continuar não rastreados; preservar esses arquivos, sem adicioná-los indiscriminadamente. Não dar push, abrir PR/Issue ou enviar mensagem a pessoas sem autorização explícita de Lucas.

Lucas informou que o outro integrante já produziu backend e quer analisá-lo e integrá-lo na próxima sessão. A origem dessa entrega (branch, repositório, ZIP ou diretório) ainda não foi identificada nesta sessão. `backend/` e `database/` desta worktree contêm documentação de reserva, não a entrega do colega. Não concluir que o trabalho dele inexiste. Não importar/mesclar código às cegas; localizar e ler primeiro.

## O que o app atual faz

- Interface aprovada abre por padrão com `npm run web`. `DesignPreview` é o nome interno da raiz atual, não um modo que precisa de flag.
- Login, Hoje/Home, Histórico, Pesagem e Detalhes. Branco/roxo e Allo, Home e Histórico aprovados: preservar composição, navegação e comportamento.
- Primeiro acesso vazio. Dados confirmados ficam em AsyncStorage na chave `merenda.servicos.aprovado.v1`; não existem exemplos iniciais, toolbar, restauração ou botões de teste nas telas atuais.
- Cliente antigo apenas com `EXPO_PUBLIC_LEGACY_APP=1`, e armazenamento anterior em `merenda.servicos.v1`. Não importar/apagar automaticamente registros dessa chave. Não confundir testes antigos com a interface atual.
- Login atual `demo` / `merenda-demo` é fictício, comparado localmente. Não é autenticação real nem comprovação de senha com hash. Na integração, usar as credenciais públicas de avaliação que o backend realmente fornecer e documentá-las, sem expor senhas pessoais.
- Painel separado de RFID/balança: `iot/bridge.mjs` + `iot/simulator.html`. Porta 8095, sem dependência extra. Transmite código RFID e peso bruto dos cenários de `iot/shared.ts`.
- O app identifica, aplica tara, valida e mostra a leitura sem salvar; confirmação manual salva. Régua e peso animados juntos, identificação discreta e detalhes recolhidos. A ponte local não é a API acadêmica, nem autenticação/banco reais.

## Regras aprovadas a preservar na integração

1. Um serviço por dia/refeição; a data não é editável. Novas pesagens, correções e exclusões só no dia atual. Outros dias são consulta, inclusive pendentes; revalidar também na virada do dia.
2. Várias pesagens individuais por serviço e categoria somam contribuições, com identidade própria para cada pesagem. RFID identifica uma lixeira; não identifica uma pesagem única.
3. Novo ciclo explícito; repetir o mesmo ciclo não soma novamente. Correção seleciona um registro e substitui só essa contribuição, preservando as demais; mesma lixeira na correção.
4. Conclusão é explícita e exige registros das duas categorias. Zero confirmado é válido; ausência de informação não é zero. Uma prévia precisa ser confirmada ou descartada antes de concluir.
5. Corrigir um serviço concluído no mesmo dia mantém a conclusão e recalcula o total. A interface atual não adiciona novas contribuições a concluído: permite selecionar uma correção. Não criar reabertura/auditoria/versionamento sem decisão de Lucas.
6. RFID desconhecido e bruto abaixo da tara bloqueiam confirmação. Falhas não podem produzir sucesso visual ou alterar o confirmado. Tara/categoria/peso líquido precisam ser calculados/validados na fronteira confiável da integração.
7. A escuta de sensores só aceita leitura nova na pesagem ativa e em ciclo aguardando. Entrada/retomada/reconexão não reaproveitam eventos antigos. Na web, trocar para a aba do simulador mantém a escuta. A transmissão do sensor não equivale a gravar a pesagem.
8. Histórico utiliza os registros efetivamente confirmados; gráficos/médias/comparação consideram serviços concluídos. Não carregar dados fictícios para inventar uma tendência. Não há produção pesada, contagem de refeições ou porcentagem da produção.

ADRs 0001/0002 e revisões mais recentes da especificação prevalecem sobre trechos históricos do contrato antigo.

## Onde integrar e o que comparar

Arquivos principais:

- `mobile/App.tsx`: raiz/fontes e escolha explícita do cliente legado.
- `mobile/src/DesignPreview.tsx`: raiz aprovada, inicializa o adaptador; login, Histórico e Detalhes.
- `mobile/src/data/types.ts`: interfaces locais `DataAccess` e `WeighingDataAccess`, sessão e formatos. Não são contrato HTTP fechado.
- `mobile/src/data/approvedData.ts`: início vazio e chave de persistência própria.
- `mobile/src/data/demo.ts`: adaptador local que hoje substitui a API. `confirmarPesagem` e `concluirServico` são métodos locais, não endpoints implementados.
- `mobile/src/data/weighing.ts`: contribuições individuais; `Servico.pesagens` é uma projeção agregada por categoria para compatibilidade. `registros` contém os IDs/contribuições reais do fluxo novo.
- `mobile/src/preview/PreviewRegistro.tsx`: estado da pesagem, confirmação/correção/conclusão e proteção de saída.
- `mobile/src/iot/scaleSource.ts` e `useScaleSimulator.ts`: leitura de eventos da ponte com cursor e ciclo; `EXPO_PUBLIC_SIMULATOR_URL` configura o endereço do simulador. Ainda não existe uma configuração de URL de API real.
- `iot/shared.ts`, `bridge.mjs`, `simulator.html`: cenários, cálculo demonstrativo e painel externo.

Comparar a entrega do colega com o app: execução/migrations/carga inicial, login/hash/token, entidades, rotas e verbos HTTP, payloads, IDs, categorias, unidades/tara, estados, agregações, erros, idempotência, conclusão e proteção temporal com data/fuso confiáveis do servidor. Verificar também CORS e endereço de API para web/celular.

O contrato em `.scratch/merenda/api-contract.md` é provisório e ainda tem exemplos antigos de PUT por categoria e conclusão automática. Não adaptar o app cegamente a esses exemplos nem assumir que o backend adotou as revisões. Produzir uma tabela de compatibilidade com evidências antes de decidir alterações mínimas.

A interface local ainda herda operações legadas (`criar`, `atualizar`, `restaurarExemplos`): isso não obriga a criar endpoints correspondentes no backend. Se necessário, separar o contrato usado pelo app atual dos métodos exclusivos do cliente antigo. Não colocar um CRUD desnecessário para satisfazer uma abstração local.

Não usar fallback silencioso para os dados simulados quando a API falhar, nem enviar o histórico local para o backend sem mapear os formatos e obter autorização para a carga. Definir como alternar explicitamente demonstração local e integração, caso seja necessário manter ambos.

## Enunciado: conferir as partes completas

Ler `ENUNCIADO.md`; não limitar a integração ao login:

- Banco: quatro ou mais entidades, DER normalizado com PK/FK/cardinalidades, SQL/constraints/carga inicial executável e cinco ou mais SELECTs com JOIN/agregação.
- API Java ou C# com ASP.NET, dentro do conteúdo estudado: seis ou mais endpoints, GET/POST/PUT/DELETE, Controller/Service/Repository, validações/status e Swagger/Postman.
- Segurança: senha com hash e três ou mais práticas verificáveis. Dados mockados não eliminam a exigência de hash.
- App: quatro ou mais telas funcionais, navegação e usabilidade; dados mockados permitidos. Integração é diferencial, não motivo para ampliar o MVP.
- Testes: oito ou mais casos planejados, cinco ou mais executados, evidências individuais; atualizar com o comportamento integrado.
- Dois sensores simulados com uso dos dados e explicação; não apresentar a ponte Node como backend acadêmico.
- PDF com integrantes e entregáveis não executáveis; TXT com grupo, RM/nomes e link público; código/README no ZIP; vídeo funcionando de até três minutos; cidadão beneficiado e contribuição aos ODS/metas.
- Grupo não individual, até cinco integrantes, entrega única até 19/11/2026 às 23h55.

## Verificação já realizada e limites

Nesta passagem, repetidos: TypeScript, 36 testes de unidade do app e quatro testes de IoT (ponte + CLI), todos passaram. Evidências da última rodada completa: `docs/evidencias/separate-simulator/` — UI integrada com 20 cenários, seis fluxos do cliente legado e exportação iOS. A execução nativa continua sem comprovação. Não anunciar integração real ou conformidade completa com base no adaptador, em typecheck ou no bundle.

Execução:

```sh
# Terminal 1, raiz
node --experimental-strip-types iot/bridge.mjs

# Terminal 2, mobile
npm run web -- --port 8094
```

Testes na raiz:

```sh
npm --prefix mobile run typecheck
npm --prefix mobile test
node --experimental-strip-types --test iot/bridge.test.mjs iot/cli.test.mjs
node mobile/simulator-qa.cjs
npm --prefix mobile run test:e2e
```

O roteiro integrado exige app 8094 + simulador 8095 ativos e usa contexto de navegador isolado. Login `demo` / `merenda-demo`. Os roteiros antigos com botões internos e fixtures são históricos, não o fluxo atual.

Ler também `docs/guia-simulador-gravacao.md`, `docs/ux/cobertura-enunciado-pesagem.md`, `docs/agents/mobile.md` e o plano de testes. Usar `vercel-react-native-skills`; aplicar Interface Craft e Impeccable se houver alterações de interface, preservando o desenho aprovado.

## Primeiro passo da próxima sessão

Somente inspeção e planejamento: confirmar esta worktree/checkpoint, localizar a entrega real do colega e executar a análise de compatibilidade com o enunciado. Se não for possível localizar o backend, pedir sua origem a Lucas. Ao final, apresentar o estado encontrado, incompatibilidades, decisões pendentes e plano mínimo por entregas verificáveis. Aguardar aprovação de Lucas para importar/alterar/integrar código. Não reabrir decisões de UI/domínio já aprovadas por mera conveniência do backend.
