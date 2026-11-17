# App Merenda — execução

App React Native/Expo (SDK 58) da interface aprovada: **Login, Hoje, Histórico, Pesagem e Detalhes**. Por padrão consome a API Java/Spring Boot; sem fallback para dados locais.

Banco/API e instruções completas no [README da raiz](../README.md). `npm ci` e `npm run web -- --port 8094` abrem o app no navegador; API padrão `http://localhost:8080`, configurável por `EXPO_PUBLIC_API_URL`. Login real de avaliação: **`operador` / `merenda123`**.

## Sensores

Leituras RFID/balança vêm do simulador em `EXPO_PUBLIC_SIMULATOR_URL` (padrão `http://127.0.0.1:8095`). API e ponte são processos separados. No celular físico, usar o IP do computador nas duas URLs e configurar acesso LAN/origens conforme o README da raiz. App e API usam o calendário da escola `America/Sao_Paulo`, independentemente do fuso do dispositivo.

## Demonstração local

O botão **Demonstração** (no login/Home/Histórico) alterna dentro do mesmo app, preservando os dois conjuntos de dados: abre sessão demonstrativa identificada, com exemplos fictícios e controles internos de RFID/balança; **Voltar à API** encerra a sessão local e pede login real. A escolha não é persistida após recarregar.

`EXPO_PUBLIC_DATA_MODE=demo` também ativa a demonstração por variável de ambiente (login `demo` / `merenda-demo`, AsyncStorage em chave própria). Não há fallback silencioso, migração de dados locais ou token persistido.

## Verificação

```sh
npm test            # 45 testes unitários (Vitest)
npm run typecheck   # TypeScript
npm run build:web   # exportação web
```

Evidências: [integração](../docs/evidencias/backend-integration/README.md), [demonstração](../docs/evidencias/complete-demo/README.md) e [navegação nativa](../docs/evidencias/native-navigation/README.md).

## Estrutura

`src/data/` (tipos, adaptador e testes), `src/preview/` (telas), `src/navigation/` (abas), `src/iot/` (balança simulada) e `../iot/shared.ts` (cenários e cálculo compartilhados).
