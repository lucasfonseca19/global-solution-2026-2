# Global Solution 2026/2 — descarte da merenda

Para a próxima sessão de backend: [passagem atual para integração](docs/continuidade-integracao.md).

MVP acadêmico para registrar o descarte de alimento não servido e restos comestíveis dos pratos. App React Native/Expo, API Java 21/Spring Boot, PostgreSQL e simulador separado de RFID/balança. Integração baseada na contribuição do colega `51957f3`, adaptada às ADRs de pesagens individuais e conclusão explícita. A interface aprovada (Home, Histórico, Allo e pesagem) foi preservada.

## Execução integrada

Requer Node compatível com Expo (ambiente: 22.17.1+), JDK 21, Maven 3.9+ e PostgreSQL 14+ (ou Docker Compose). Seguir [database/README.md](database/README.md) para criar um banco vazio com `01_schema.sql` e `02_carga_inicial.sql`. Essa carga inclui somente conta de avaliação, categorias e lixeiras; não cria histórico fictício. Para banco antigo, revisar a migração documentada antes de executar qualquer script.

Terminal da API:

```sh
cd backend
export JWT_SECRET="segredo-exclusivo-da-sua-demonstracao-local-com-32-caracteres"
mvn spring-boot:run
```

Credenciais locais padrão do banco: `merenda`/`merenda`; URL `jdbc:postgresql://localhost:55439/merenda`. Configurações em [backend/README.md](backend/README.md). Swagger: `http://localhost:8080/swagger-ui.html`.

Terminal do simulador, na raiz:

```sh
node --experimental-strip-types iot/bridge.mjs
```

Abra `http://127.0.0.1:8095`. Terminal do app:

```sh
cd mobile
npm ci
EXPO_PUBLIC_DATA_MODE=api EXPO_PUBLIC_API_URL=http://localhost:8080 npm run web -- --port 8094
```

Abra `http://localhost:8094`. Login de avaliação: **`operador` / `merenda123`**, verificado por BCrypt na API. Entre numa refeição, aguarde “Balança conectada” e envie um cenário no painel separado. O app consulta identificação/tara/líquido na API; somente a confirmação grava no PostgreSQL. Cada novo ciclo soma uma contribuição; correção substitui um registro; conclusão é explícita.

O botão discreto **Demonstração**, no login/Home/Histórico, abre as mesmas telas com sessão e dados locais separados. Não é necessário reiniciar o Expo para alternar. O modo fica identificado; **Voltar à API** encerra a sessão local e pede login real. A escolha vale para a sessão do app; recarregar retorna ao modo de inicialização. A troca não é oferecida durante a pesagem.

As abas Hoje/Histórico usam a barra do sistema em iOS/Android; na web, o navegador de abas da mesma biblioteca. Exclusão e descarte de leitura usam confirmações do sistema no celular. [Decisões e evidências](docs/evidencias/native-navigation/README.md).

API é o modo padrão, sem fallback para dados locais. Sessão/token ficam em memória; recarregar pede login e consulta novamente o banco. Histórico local preexistente não é enviado, apagado nem importado. A ponte Node continua sendo somente o simulador, separado da API acadêmica.

Para executar a demonstração local anterior explicitamente:

```sh
cd mobile
EXPO_PUBLIC_DATA_MODE=demo npm run web -- --port 8094
```

Nesse modo somente, login `demo` / `merenda-demo` e persistência AsyncStorage em chave própria. O [guia de gravação](docs/guia-simulador-gravacao.md) descreve os fluxos; o [contrato atual](.scratch/merenda/api-contract.md) documenta o HTTP.

Para celular, configurar `EXPO_PUBLIC_API_URL` e `EXPO_PUBLIC_SIMULATOR_URL` com o IP do computador; não usar localhost no telefone. A ponte exige `SIMULATOR_HOST=0.0.0.0` para acesso LAN explícito. No navegador via IP, configurar também as origens em `CORS_ORIGENS` (API) e `SIMULATOR_ALLOWED_ORIGIN` (ponte). O app usa o calendário da escola `America/Sao_Paulo`, independentemente do fuso do dispositivo; servidor revalida todas as escritas.

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
- Revisão das alterações de integração pela equipe e consolidação das evidências no PDF final.
- Verificação nativa pendente e revisão final do grupo.

O pacote final previsto no enunciado também requer código e README de execução; confira o [enunciado](ENUNCIADO.md) e a [especificação do MVP](.scratch/merenda/spec.md). A organização de responsabilidades está em [guia da equipe](docs/guia-equipe.md).

## Documentos e ferramentas

- [Guia de testes de Lucas](docs/guia-testes-lucas.md), [plano de testes](docs/plano-testes-lucas.md) e [relatório de implementação](docs/relatorio-implementacao-lucas.md).
- [Orientações mobile](docs/agents/mobile.md), [READMEs do app](mobile/README.md) e da [IoT simulada](iot/README.md).
- O disco temporário no SSD foi um contorno local durante as verificações por falta de espaço. Não é pré-requisito: os comandos acima são padrão.

## Uso de IA

Codex, executado no T3 Code, auxiliou o planejamento, a implementação, os testes e a documentação. Subagentes gpt-6.1-sol/medium implementaram as entregas; gpt-6.1-sol/high revisou; gpt-6-luna/high consolidou documentos. O orquestrador conferiu resultados e integrou correções. Lucas deve revisar e compreender o material antes da entrega acadêmica. Detalhes e limites estão no [relatório](docs/relatorio-implementacao-lucas.md).
