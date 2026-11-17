# Guia de testes — verificação passo a passo

Este guia orienta a verificação manual do projeto completo (app + API + banco + simulador). Os comandos automatizados e a evidência executada estão no [plano de testes](plano-testes-lucas.md) e no [README](../README.md).

## Preparar o ambiente

Pré-requisitos: Node.js 22.17.1+, JDK 21, Maven 3.9+ e PostgreSQL (ou Docker Compose).

```sh
# 1. Banco (PostgreSQL na porta 55439)
cd database && docker compose up -d

# 2. API (porta 8080)
cd backend && export JWT_SECRET="segredo-exclusivo-da-demonstracao-local-com-32-caracteres" && mvn spring-boot:run

# 3. Simulador (painel na porta 8095)
node --experimental-strip-types iot/bridge.mjs

# 4. App (porta 8094)
cd mobile && npm ci && npm run web -- --port 8094
```

Abra `http://localhost:8094`. Login de avaliação: **`operador` / `merenda123`**.

## Percurso manual (fluxo completo)

1. **Login:** entre com `operador` / `merenda123`. Esperado: tela Hoje. Erro de senha deve mostrar mensagem genérica e permanecer no login.
2. **Iniciar refeição:** em Hoje, escolha **Almoço** (ou Jantar) e toque **Pesar**. Esperado: tela de pesagem.
3. **Leitura:** no painel `http://127.0.0.1:8095`, clique num cenário (ex.: "Cozinha 3 kg"). No app, a leitura é identificada (RFID → sobra, tara 1 kg) e mostra a prévia: líquido 3 kg, **sem gravar**.
4. **Confirmar:** confirme. Esperado: pesagem registrada (contribuição individual). Repita para **Pratos 2 kg**.
5. **Concluir:** com as duas categorias, conclua explicitamente. Esperado: serviço `Concluído` com total 5 kg.
6. **Erros:** no painel, teste etiqueta desconhecida e peso abaixo da tara. Esperado: erro explicado na tela, sem gravação.
7. **Corrigir:** em Detalhes, corrija um registro (mesma lixeira). Esperado: só aquele registro muda; os demais e a conclusão são preservados.
8. **Excluir:** exclua um serviço do dia e confirme. Esperado: serviço e pesagens removidos.
9. **Histórico:** verifique Hoje e Histórico com os totais e as médias apenas dos concluídos.
10. **Histórico antigo:** um serviço de outro dia deve abrir como **somente consulta**, sem ações de escrita.

## Demonstração sem backend

Para ver o app sem subir banco/API/ponte, toque em **Demonstração** no login/Home/Histórico: abre as mesmas telas com exemplos fictícios e controles internos de RFID/balança. **Voltar à API** encerra a sessão local e pede login real.

## Simulador independente (CLI)

```sh
node --experimental-strip-types iot/cli.mjs listar
node --experimental-strip-types iot/cli.mjs avaliar sobra
node --experimental-strip-types iot/cli.mjs avaliar restos
node --experimental-strip-types iot/cli.mjs avaliar zero
node --experimental-strip-types iot/cli.mjs avaliar desconhecido
node --experimental-strip-types iot/cli.mjs avaliar abaixo
```

Esperado: líquidos 3 kg, 2 kg e 0 kg; as duas últimas retornam `RFID_DESCONHECIDO` e `PESO_INVALIDO` (código de saída 1).

## Verificação automatizada

```sh
cd backend && mvn test                                   # 20 testes de API
cd mobile && npm test                                    # 45 testes de unidade
cd mobile && npm run typecheck                           # TypeScript
node --experimental-strip-types --test iot/bridge.test.mjs iot/cli.test.mjs   # IoT
```

Evidências: [`evidencias/backend-integration/`](evidencias/backend-integration/README.md) (API/banco), [`evidencias/complete-demo/`](evidencias/complete-demo/README.md) (demonstração) e [`evidencias/native-navigation/`](evidencias/native-navigation/README.md) (navegação nativa).
