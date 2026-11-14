# Guia de testes — parte de Lucas

## Preparar e abrir

Com Node.js instalado (versões das evidências: 22.17.1 e npm 10.9.2), na raiz execute:

```sh
cd mobile
npm ci
npm run web
```

Abra no Chrome ou navegador indicado pelo Expo. Para uso manual, não é necessário instalar Chrome se já houver navegador compatível. No passo 1, use usuário `demo` e senha `merenda-demo`. São credenciais fictícias públicas. Ao recarregar, o app volta ao Login; serviços permanecem salvos no armazenamento local daquele navegador.

## Percurso manual da interface

1. **Login:** tente primeiro uma senha errada. Esperado: mensagem genérica e permanência no login. Depois entre com as credenciais acima. Esperado: tela Histórico. Evidência automatizada relacionada: `login fictício retorna usuário sem senha`, `credenciais incorretas são rejeitadas com mensagem genérica` e o fluxo web `login inválido, consulta, retorno e saída` (ver [09](evidencias/09/README.md)).
2. **Histórico e Detalhes:** se já houver alterações de testes anteriores, use **Restaurar exemplos** e confirme para começar deste estado conhecido. Abra o exemplo completo de 12/11 e retorne. Esperado: duas categorias e total de 5 kg. Abra um pendente: uma categoria deve exibir “Aguardando pesagem”, sem confundir ausência com zero. Abra o exemplo de zero confirmado: deve exibir 0 kg como valor registrado. Evidência de adaptador: `consulta retorna exemplos completos, pendentes e zero confirmado sem confundi-los`; captura `zero-confirmado.png` em [09](evidencias/09/README.md).
3. **Iniciar serviço:** em Histórico escolha registrar. Em Registro informe data válida `2026-11-15`, tipo `Almoço`, e toque **Procurar serviço**. Esperado: aviso de novo serviço; ainda não foi gravado. Para uma data/tipo já existente, esperado: continuar o mesmo serviço.
4. **Prévia válida:** abra **Abrir simulação** e escolha a leitura de sobra. Esperado: RFID-SIM-001 identifica sobra, bruto 4 kg menos tara 1 kg resulta em líquido 3 kg. A prévia diz que ainda não foi gravada. Confirme. Esperado: serviço criado/atualizado com sobra 3 kg e categoria de pratos pendente.
5. **Segunda categoria:** simule restos válidos. RFID-SIM-002, bruto 3,5 kg menos tara 1,5 kg resulta em 2 kg. Confirme. Esperado: serviço completo, total 5 kg. Pesquisar novamente a mesma data/tipo não cria duplicata.
6. **Erros sem confirmação:** escolha RFID desconhecido; esperado: erro “Lixeira não reconhecida. Repita a leitura.”, sem prévia confirmável. Escolha peso abaixo da tara; esperado: erro “Peso bruto menor que a tara ou inválido. Repita a leitura.”, também sem confirmação. Para observar o controle, registre outro serviço e tente uma data impossível ou vazia: a pesquisa deve pedir data válida em AAAA-MM-DD e tipo.
7. **Zero válido:** para restos escolha leitura zero (bruto igual à tara). Confirme. Esperado: restos 0 kg confirmados; não “Aguardando pesagem”.
8. **Corrigir:** após confirmar zero no passo anterior, abra **Ver detalhes do serviço** e **Corrigir pesagens**. Abra a simulação e escolha **Simular: Lixeira dos pratos** (bruto 3,5 kg, líquido 2 kg). Toque **Atualizar pesagem**. Esperado: sobra 3 kg preservada, restos passam de zero para 2 kg e total passa para 5 kg, no mesmo serviço. O exemplo de correção para 2,5 kg existe nos testes do adaptador; esse peso não é um botão disponível na interface.
9. **Cancelar e confirmar exclusão:** abra **Ver detalhes do serviço** e escolha excluir e cancele. Esperado: permanecer com os dados. Repita e confirme: somente o serviço selecionado e suas pesagens somem.
10. **Recarregar e restaurar:** recarregue a página. Esperado: Login, mas histórico ainda contém serviços salvos. Entre novamente. Em Histórico escolha restaurar exemplos e cancele: registros continuam. Repita e confirme: os registros locais são substituídos pelos três exemplos iniciais. Recarregue: os exemplos continuam.
11. **Sair:** saia e entre novamente. Esperado: sessão encerra, serviços permanecem.

Esse percurso é orientação para repetição manual; não declare cada passo como executado em celular. Os fluxos web automatizados já registrados cobrem login/consulta, registro, correção, cancelamento/confirmar exclusão/restauração e recarga. Veja a matriz CT01–CT15 em [plano de testes](plano-testes-lucas.md) para os nomes dos testes e logs individuais.

## Simulador independente

Para observar os eventos fora do app, volte à raiz do repositório e execute, por exemplo:

```sh
node --experimental-strip-types iot/cli.mjs avaliar sobra
node --experimental-strip-types iot/cli.mjs avaliar restos
node --experimental-strip-types iot/cli.mjs avaliar zero
node --experimental-strip-types iot/cli.mjs avaliar desconhecido
node --experimental-strip-types iot/cli.mjs avaliar abaixo
```

Esperado: três leituras válidas com líquidos 3 kg, 2 kg e 0 kg; as duas últimas retornam erros `RFID_DESCONHECIDO` e `PESO_INVALIDO` (código de saída 1). A CLI não grava nem se conecta ao app. Saídas reais estão em [docs/evidencias/10/cli.txt](evidencias/10/cli.txt).

## O que já tem evidência e o que é manual

- **Executado e documentado:** testes nomeados do adaptador, dois testes de CLI, fluxos web em Playwright usando Chrome já instalado, typecheck e builds web, nos tickets 09–11 e na [conferência final 12](evidencias/12/README.md). A conferência final repetiu a instalação por `npm ci`, os 15 testes, typecheck e cinco fluxos web. Os READMEs em [09](evidencias/09/README.md), [10](evidencias/10/README.md) e [11](evidencias/11/README.md) descrevem comandos, limites e logs. A redação do guia usou os resultados reais; a conferência final foi executada pelo orquestrador.
- **Orientação manual para Lucas repetir:** o roteiro completo acima, inclusive inspeção visual das quatro telas e entradas demonstrativas. Registre data, ambiente, entrada, resultado observado e evidência somente depois de fazê-lo.
- **Pendente:** abrir e percorrer o app em execução React Native nativa (simulador ou celular). Expo Go não instalou por falta de espaço (`ENOSPC`); os detalhes estão em [mobile-impedimento.txt](evidencias/12/mobile-impedimento.txt). O bundle de [ios-bundle.txt](evidencias/12/ios-bundle.txt) é somente compilação/exportação. Libere espaço no disco interno por decisão do proprietário e então tente `cd mobile && npm ci && npm run ios`, ou `npm start` e cliente Expo compatível com SDK 58 em um celular na mesma rede. Capture as quatro telas e repita leitura válida, erro e confirmação. Até essa execução, não marque o requisito nativo como concluído.

O diretório temporário em SSD foi apenas contorno local para espaço nas tentativas. Os comandos padrão acima não dependem dele. Não há verificação de backend/API/banco ou segurança real neste app.
