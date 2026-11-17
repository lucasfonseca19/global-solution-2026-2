# Experimento RNR — Registro/pesagem

Prévia real React Native Reusables com NativeWind. Aguardando aprovação visual de Lucas; sem migração das quatro telas, commit, push ou PR.

## Execução

Checkout: `/Users/lucas/.t3/worktrees/global-solution-2026-2/t3-5b5fb2b8`.
App: `mobile/src/DesignPreview.tsx`. Servidor deixado ativo: PID 5284 (Metro), porta 8093, sessão de execução 91611. URL: http://localhost:8093.

```sh
cd /Users/lucas/.t3/worktrees/global-solution-2026-2/t3-5b5fb2b8/mobile
TMPDIR=/Volumes/ssd/Faculdade/merenda-rnr-tmp EXPO_PUBLIC_DESIGN_PREVIEW=1 npx expo start --web --port 8093
```

Sem a flag, abre o app existente com login, navegação e AsyncStorage. Prévia usa `createDemoData([])` sem storage, login fictício interno e data/refeição fixas para revisão visual. Recarregar descarta seus dados. Não integra API/backend.

## Dependências e origem

Button/Text autênticos do registro oficial RNR, imports locais como única adaptação; ver [proveniência](proveniencia.md) e licença em `mobile/src/rnr/LICENSE`. Text usa RNPrimitives Slot. Sem componentes de portal, não foi instalado PortalHost.

Adicionados NativeWind 4.2.7, Tailwind 3.4.19, class-variance-authority 0.7.1, clsx 2.1.1, tailwind-merge 2.6.1, @rn-primitives/slot 1.5.2. Expo selecionou Reanimated 4.7.1, Worklets 0.13.0 e babel-preset-expo para SDK 58. Sem alteração Expo 58/RN 0.88.1/React 19.3.0 e sem force/legacy-peer-deps. Versões exatas no lockfile.

Configuração NativeWind em Babel/Metro/Tailwind/CSS e declarações TypeScript. `watchFolders` da IoT preservado. O primeiro bundle identificou ausência de babel-preset-expo no nível do app; instalação com `expo install --dev` resolveu. Não houve impedimento sério de compatibilidade nos bundles; isso não comprova runtime nativo.

## Verificação observada

- `npm run typecheck`: passou ([log](typecheck.txt)).
- `npm test`: 15 testes existentes passaram ([log](unit.txt)).
- `npm run test:e2e`, flag desligada: 5 fluxos existentes passaram com Chrome instalado ([log](e2e.txt)).
- `EXPO_PUBLIC_DESIGN_PREVIEW=1 npx expo export --platform web --platform ios --output-dir /Volumes/ssd/Faculdade/merenda-rnr-tmp/export`: passou ([log](export.txt)). Bundle iOS, sem execução em simulador/dispositivo.
- Browser real na porta 8093: espera com confirmação bloqueada; cozinha 4−1=3 kg; confirmação mostra 3 kg; etiqueta desconhecida e abaixo da tara exibem erro e bloqueiam confirmação sem alterar o confirmado; pratos 3,5−1,5=2 kg e confirmação resultam em completo/5 kg; zero confirmado substitui pratos por 0 e total por 3 kg. Adaptador existente executa cálculo, validação e confirmação.
- Capturas reais: [390 px](mobile-390.png) (altura 1200 para registrar a tela) e [1280 px](desktop-1280.png) (altura 1000). Layout estreito também inspecionado a 390×844 com rolagem.

## Arquivos e limites

Alterados App.tsx (seleção pela flag), metro.config.js, package.json e lockfile. Novos DesignPreview.tsx, src/rnr/{button,text,utils,LICENSE}, babel.config.js, tailwind.config.js, global.css e declarações CSS/NativeWind, além destas evidências. Nenhuma alteração no domínio, adaptador, tela Registro original ou persistência.

Interface Craft aplicado à hierarquia: peso líquido dominante, ação única, superfície neutra, simulação recolhível, resumo distinto da leitura ativa. Skills React Native: texto em Text, Pressable via Button RNR, SafeArea/ScrollView, estado local e dependências no pacote mobile. Sem animação ou DialKit, desnecessários ao recorte.

Disco interno iniciou com 3,7 GiB livres, SSD com 889 GiB; temporários/exportação no SSD, sem limpeza de dados pessoais. npm reportou 3 vulnerabilidades moderadas; não foi executado audit fix nem alteração ampla de dependências. A instalação e os testes dão evidência de compatibilidade para este recorte, sem validar todos os componentes RNR ou uso nativo real.
