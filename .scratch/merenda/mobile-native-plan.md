# Mobile e demonstração no mesmo app — 17/11/2026

Lucas aprovou a proposta de corrigir layout no iPhone, substituir a barra manual por abas apropriadas e acrescentar botão discreto de demonstração. Autorizou considerar outros componentes nativos úteis. Preservar Allo, branco/roxo, Home, Histórico e domínio; sem push. Base a4c6bb5.

## Decisões de implementação

- Mesmo conjunto de telas, modos API/demo explícitos com adaptadores e dados separados. Controle discreto no login/Home/Histórico, fora da pesagem. Entrar na demonstração abre sessão fictícia identificada; voltar à API exige login real. Troca confirma encerramento da sessão, preserva registros e remonta navegação. Não há fallback automático nem envio de dados locais.
- React Navigation 7 com abas nativas em iOS/Android usando react-native-screens 4.30.1 já incluído no Expo SDK58. Web usa navegador de abas da mesma biblioteca. Não migrar para Expo Router ou adicionar módulo nativo não incluído no Expo Go. A documentação recomenda development builds genericamente; não alegar compatibilidade do binário sem teste no iPhone.
- Root native-stack contém abas Hoje/Histórico, Pesagem e Detalhes. Barra apenas nas abas; retorno/exclusão continuam levando ao Histórico. Respeitar safe areas, teclado e tipografia.
- Confirmar exclusão e descarte via Alert nativo em iOS/Android; web conserva controles verificáveis. Não mudar todas as telas para estética padrão do sistema.
- Diagnóstico: Pressable com StyleSheet e callback de estilo passa por NativeWind/CSSInterop. Isolar controles de estilo explícito com cssInterop=false para evitar conversão, sem alterar os componentes RNR que efetivamente usam classes. Corrigir distribuição, não reduzir fontes indiscriminadamente.

## Execução e verificação

- [x] Implementar e testar mudança de modo: API nunca recebe dados/token de demo; retorno exige login; dados dos dois modos preservados.
- [x] Instalar somente pacote JS de tabs compatível; configurar abas native/web e atualizar fluxos de retorno.
- [x] Isolar estilos de Pressable explícitos e ajustar espaços/safe areas do mobile; confirmações nativas.
- [x] TypeScript, testes app/IoT, regressão demo/legado e fluxo web da alternância; exportação iOS com novas abas. Checagem visual web em 390/1280 numa rodada com correções agrupadas.
- [x] Revisão do conjunto, documentação/evidências e checkpoint local; manter servidor do iPhone ativo e pedir validação do layout real. Não declarar runtime nativo validado pelo bundle.

## Limites

O teste do iPhone iniciado anteriormente comprovou abertura/Home, não o fluxo inteiro. Banco merenda_iphone preservado, sem limpeza. API18080, Expo18094, ponte18095 acessíveis em 192.168.15.6. Sessão Expo autenticada. Nomes do simulador/portas não são API acadêmica.

## Resultado e limite

51 testes de unidade, oito cenários web de modos/navegação, 20 cenários demo, seis fluxos legados, quatro testes IoT e TypeScript passaram. Exportação iOS passou. Revisão identificou login obsoleto após alternância: reproduzido em teste web e corrigido com identidade de adaptador/geração. Capturas390/1280 inspecionadas. Servidores de QA encerrados; Expo do iPhone reiniciado com cache limpo mantendo URL/QR. Nova barra/alertas precisam da confirmação visual de Lucas no iPhone; bundle não é evidência desse resultado.
