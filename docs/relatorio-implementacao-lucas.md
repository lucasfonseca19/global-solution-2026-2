# Relatório de implementação — contribuição de Lucas

## Resumo

A parte de Lucas entrega o **app mobile** (React Native/Expo) e a **simulação de IoT** do projeto Merenda, e foi **integrada ao backend e banco** do colega. O produto completo registra o descarte de alimentos na merenda escolar: o funcionário aproxima a lixeira (identificada por RFID simulado), pesa, confere o peso líquido (descontada a tara) e confirma; cada pesagem vira uma contribuição individual, e a conclusão do serviço é explícita.

O escopo mede duas categorias — alimento preparado e não servido, e restos comestíveis devolvidos nos pratos — e consolida um histórico por refeição. Não mede produção, refeições servidas, percentuais nem redução de desperdício.

## O que foi feito

- **App (5 telas):** Login, Hoje, Histórico, Pesagem e Detalhes, com abas nativas no celular e suporte web local. O app usa a API por padrão (sem fallback) e oferece um modo **Demonstração** autossuficiente para exibir o fluxo sem subir o backend.
- **Pesagem por contribuição:** cada confirmação soma um registro individual; várias pesagens da mesma categoria somam. A correção substitui só o registro selecionado, preservando os demais e o estado concluído. A conclusão é explícita e exige as duas categorias (zero confirmado é válido).
- **Somente o dia atual:** criação, correção e exclusão valem apenas para o dia corrente (fuso da escola `America/Sao_Paulo`, no app e no servidor). Histórico de outros dias é consulta.
- **Simulação de IoT:** leitor RFID e balança simulados. O RFID (`RFID-SIM-001` sobra / `RFID-SIM-002` restos) identifica lixeira, categoria e tara; a balança fornece o peso bruto. A ponte (`iot/bridge.mjs`) emite os cenários; a CLI (`iot/cli.mjs`) demonstra a leitura isoladamente.
- **Integração:** o app consome a API Java/Spring Boot por HTTP e grava no PostgreSQL. Sessão/token ficam em memória; recarregar pede login e consulta o banco.

## Arquitetura

| Parte | Responsável | Tecnologia | Onde |
| --- | --- | --- | --- |
| App mobile | Lucas | React Native / Expo (SDK 58) | `mobile/` |
| Simulação IoT | Lucas | Node.js (bridge + CLI) | `iot/` |
| API + banco + segurança | Colega (integrada) | Java 21 / Spring Boot + PostgreSQL | `backend/`, `database/` |

A interface de dados do app (`mobile/src/data/`) separa o adaptador HTTP (API) do adaptador local (demonstração), compartilhando as mesmas regras de cálculo e validação com a IoT (`iot/shared.ts`).

## Testes e evidências

| Camada | Testes | Comando |
| --- | --- | --- |
| API | 20 (JUnit, H2) | `cd backend && mvn test` |
| App | 45 (Vitest) | `cd mobile && npm test` |
| IoT | 4 (Node) | `node --test iot/bridge.test.mjs iot/cli.test.mjs` |
| Banco (SQL real) | 11 constraints + 7 consultas | `psql` |

Plano de testes em [`plano-testes-lucas.md`](plano-testes-lucas.md); evidências executadas em [`docs/evidencias/`](evidencias/) (integração, demonstração e navegação nativa) e na [`API`](../backend/docs/evidencias/README.md).

## Segurança (parte do colega)

Login com senha em **hash BCrypt** e token **JWT**; validação de entrada; proteção contra **SQL injection** (consultas parametrizadas) e **XSS**; **controle de acesso** (só `/auth/login` é público); **bloqueio de tentativas** de login; CORS restrito. Detalhes em [`backend/README.md`](../backend/README.md).

## Execução e verificação

Passo a passo completo no [README](../README.md) e no [guia de testes](guia-testes-lucas.md). Resumo:

```sh
cd database && docker compose up -d                       # banco
cd backend && export JWT_SECRET="..." && mvn spring-boot:run   # API
node --experimental-strip-types iot/bridge.mjs            # simulador
cd mobile && npm ci && npm run web -- --port 8094         # app
```

Login de avaliação: `operador` / `merenda123`. Para ver o app sem subir o backend, use o botão **Demonstração** (ou `EXPO_PUBLIC_DATA_MODE=demo`, login `demo` / `merenda-demo`).

## Uso de IA e revisão humana

IA generativa (Codex e OpenCode, com revisão de subagentes) auxiliou planejamento, implementação, testes e documentação. Todo o material foi revisado e validado pelos integrantes antes da entrega. Lucas deve revisar e compreender o código, os limites e os comandos antes de incorporar este texto ao PDF acadêmico.

## Situação da entrega acadêmica

Este relatório compõe a seção da contribuição de Lucas no PDF. Ainda são materiais do grupo: PDF final, `.txt` com integrantes/RM/link e o vídeo pitch (até 3 minutos). O [roteiro de Lucas](roteiro-demonstracao-lucas.md) cobre cerca de 45–60 segundos e deve integrar a fala do grupo.
