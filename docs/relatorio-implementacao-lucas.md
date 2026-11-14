# Relatório de implementação — contribuição de Lucas

## Resumo

Foi implementado um app demonstrativo para acompanhar o descarte de uma escola por serviço/data e tipo de refeição. O funcionário identifica a lixeira automaticamente pelo RFID simulado, confere o cálculo do peso líquido e confirma a pesagem. O escopo cobre sobra não servida destinada ao descarte e restos comestíveis dos pratos. Não mede produção, refeições servidas, percentuais ou redução de desperdício.

Os tickets 09, 10 e 11 foram concluídos e verificados; referência de integração no histórico local: commit `7b67860`. Esta consolidação documenta a parte já executada. O requisito de execução mobile nativa ainda está pendente: o app não iniciou em iOS/Android. Logo, esta documentação não declara o ticket 12 concluído.

## O que foi feito e decisões

- Quatro telas: Login demonstrativo, Histórico, Registro e Detalhes.
- Adaptador local com exemplos de serviço completo (5 kg), pendente (3 kg parcial) e zero confirmado. Prévia calcula e valida sem gravar; confirmação cria/atualiza. A correção substitui a pesagem da categoria, preservando a outra.
- RFID-SIM-001 identifica sobra e tara de 1 kg; RFID-SIM-002 identifica restos e tara de 1,5 kg. A simulação fornece peso bruto; o app/consumidor identifica a categoria, calcula líquido e bloqueia etiqueta desconhecida ou peso abaixo da tara.
- Serviços persistem localmente com AsyncStorage 2.2.0 (compatível com Expo SDK 58; localStorage na web). Recarregar encerra a sessão, mas preserva serviços. Exclusão requer confirmação e remove também pesagens. Restaurar exemplos substitui o estado local após confirmação.
- A CLI IoT e a UI são demonstrações independentes, com cenários e cálculo compartilhados. Não existe conexão de eventos entre elas.
- Tecnologias registradas no lockfile: Expo 58.0.25, React 19.3.0, React Native 0.88.1, TypeScript 6.0.3, React Navigation native stack 7.21.0, Vitest 5.1.0 e Playwright 1.65.1. Node/npm das evidências: 22.17.1/10.9.2.

## Estrutura e evidência

- `mobile/src/`: telas, componentes visuais e tipos/adaptador de dados, fixtures e testes.
- `iot/shared.ts`: tipos, cenários e regra de cálculo usados pela demonstração; `iot/cli.mjs` expõe a CLI sem persistência.
- `docs/evidencias/09/`, `10/` e `11/`: logs reais, capturas e descrição dos ambientes; [plano de testes](plano-testes-lucas.md) mapeia IDs para testes/logs nomeados.

A [conferência final](evidencias/12/README.md) registrou 15 testes Vitest do adaptador, dois testes Node da CLI e cinco fluxos Playwright na aplicação web com Chrome instalado, além de typecheck, compatibilidade Expo e exportação web. Após reinstalação por `npm ci`, testes, typecheck e fluxos web passaram novamente. Foram registrados três alertas moderados transitivos associados a Expo, `@expo/fingerprint` e `minimatch`; não foi usado `--force` para atualizar dependências fora do SDK.

## Limites e integração futura

Login/credenciais e dados são fictícios. Não há autenticação segura, backend, API real, banco ou hardware. O contrato em `.scratch/merenda/api-contract.md` é provisório e ainda depende de revisão do colega. Não atribuímos ao colega implementação, tecnologia ou aprovação que não estejam confirmadas.

Para conectar depois: revisar em conjunto o significado e os formatos de serviço, RFID, tara, leituras, estado pendente/zero, total e substituição; acordar rotas/payloads e erros; então trocar a implementação local na fronteira do adaptador por chamadas à API. Preservar prévia sem gravação, confirmação explícita, idempotência funcional da correção, exclusão após confirmação e os cenários de teste. O app atual não demonstra essa integração.

## Execução e verificação

Na pasta `mobile`, instalar com `npm ci` e iniciar com `npm run web`. Comandos de verificação registrados: `npm test`, `npm run typecheck`, `npm run test:e2e` e `npm run build:web`. Comandos e limites estão em [mobile/README.md](../mobile/README.md); o passo a passo está no [guia de testes](guia-testes-lucas.md). O uso de um TMPDIR no SSD foi contorno local de espaço, não requisito para avaliadores.

A tentativa nativa falhou ao extrair Expo Go por `ENOSPC`; outras tentativas de mover o simulador ao SSD não estabeleceram ambiente executável. O arquivo `docs/evidencias/12/ios-bundle.txt` comprova apenas que o bundle iOS foi exportado. É necessário liberar espaço no disco interno e verificar em simulador ou celular; até lá, critério mobile permanece pendente. Ver [registro detalhado](evidencias/12/mobile-impedimento.txt).

## Uso de IA e revisão humana

Ferramentas de IA auxiliaram implementação, revisão e documentação; os seguintes papéis/modelos foram registrados para o trabalho:

| Papel | Modelo/esforço informado | Atuação |
| --- | --- | --- |
| Implementação | gpt-6.1-sol / medium | Código e testes das entregas 09–11 |
| Revisão | gpt-6.1-sol / high | Revisão técnica e de escopo |
| Documentação | gpt-6-luna / high | Consolidação de READMEs, plano, guia e relatório |
| Orquestração | gpt-6.1-sol / medium | Coordenação, integração e conferência das evidências |

Lucas precisa revisar e compreender o código, os limites, os comandos e as decisões antes de incorporar este texto ao PDF acadêmico. Esta tabela descreve papéis e modelos informados para o trabalho; os logs não atestam autoria individual de cada linha de código.

## Situação da entrega acadêmica

Este relatório pode compor a seção da contribuição de Lucas no PDF. Ainda são materiais do grupo: PDF final, TXT exigido, link público do pitch de até três minutos, backend/API e banco reais e eventual integração. Não são inventados aqui nomes de responsáveis, links ou resultados dessas entregas. O [roteiro de Lucas](roteiro-demonstracao-lucas.md) dura cerca de 45–60 segundos e deve integrar a fala do grupo.
