# Navegação e demonstração no mesmo app

17/11/2026. Alteração aprovada por Lucas após captura da Home no iPhone/Expo Go. Base a4c6bb5. Home, Histórico, Allo, pesagem, backend/banco e painel separado preservados; sem push.

## Alterações

- Abas Hoje/Histórico pertencem a um navegador, no root native-stack. Registro e Detalhes ficam fora das abas; retorno/exclusão levam ao Histórico. iOS/Android usam createNativeBottomTabNavigator; web usa createBottomTabNavigator da mesma biblioteca.
- react-native-screens 4.30.1 já incluído no Expo SDK58 fornece o módulo nativo; foi acrescentado somente @react-navigation/bottom-tabs7.22 (JavaScript e dependências compatíveis de navegação). Sem migração Expo Router ou módulo nativo externo. A documentação do navegador recomenda development builds genericamente; exportação não garante que a barra renderiza no Expo Go instalado. Teste físico pendente.
- Pressables de Home/Histórico com estilos explícitos usam cssInterop=false. A camada NativeWind transformava também esses componentes; isolar evita converter estilos em callbacks como se fossem classes. Refeição/ação permanecem na mesma linha. Home usa espaçamento superior menor; tipografia Allo e cores preservadas.
- Botão Demonstração no login/Home/Histórico confirma a mudança e abre sessão local identificada. Voltar à API confirma encerramento e exige login real. Os dois modos usam as mesmas telas. Não transfere registros nem token; não toca AsyncStorage legado e não oferece troca na pesagem. Seleção vale até recarregar; EXPO_PUBLIC_DATA_MODE continua configurando o modo inicial.
- Exclusão e saída com leitura pendente usam Alert nativo no celular. Web mantém confirmação acessível própria e cenários automatizados.
- Respostas de login pertencem ao adaptador que iniciou a requisição. Resultado atrasado após mudança de modo não pode restaurar sessão; a geração também protege mudanças de modo concorrentes.

## Verificações

| Verificação | Resultado / evidência |
| --- | --- |
| TypeScript | [Sem erros](typecheck.txt) |
| Unidade | [51 testes passaram](unit.txt), incluindo dados/sessões separados e preservação |
| Alternância/UI web | [Casos individuais](web.json), [saída](web.txt) |
| Regressão cliente legado | [Seis fluxos passaram](legacy.txt) |
| Fluxo demo completo | [Resultado](demo/qa.json), [saída](demo.txt) |
| Ponte/CLI | [Quatro testes passaram](iot.txt) |
| Exportação iOS | [Bundle passou](ios-export.txt) |
| Checagem mecânica de UI | Detector Impeccable sem achados; código e capturas inspecionados |

Capturas web: [demo390](home-demo-390.png), [API390](home-api-390.png), [API1280](home-api-1280.png). Foram inspecionadas em uma rodada 390/1280. Não são evidências de barra nativa.

Uma revisão independente encontrou a corrida de login. O teste web a reproduziu antes da correção: [vermelho](login-race-red.txt); depois passou. Cenário: login API pendente → demo → API → chega resposta antiga; deve continuar no login. A suíte também confirmou cancelamento, sessão local, navegação de abas, alinhamento lateral em390, preservação da contribuição ao alternar, ausência de transferência ao PostgreSQL e nenhum erro JavaScript de página.

Os testes web usaram porta18096/API18080 e ponte isolada18097; a regressão demo usou web18098. Contextos de navegador novos; nenhum banco limpo e nenhum registro do iPhone excluído. Serviços18094/18080/18095 do teste físico permanecem ativos; servidores de QA encerrados ao finalizar.

## Validar no iPhone

Reabrir o projeto no Expo Go pelo mesmo QR `exp://192.168.15.6:18094`. Metro foi reiniciado para carregar dependências novas. Entrar com operador/merenda123; verificar abas distribuídas e ícones nativos, ações Pesar ao lado das refeições e margens da área segura. Trocar para Demonstração, confirmar, consultar Histórico local e voltar à API. Conferir exclusão/descarte com diálogos do sistema durante o roteiro de pesagem. Se aparecer erro de módulo nativo, registrar a mensagem: não declarar compatibilidade somente por typecheck/export.

Referências: [React Navigation native tabs](https://reactnavigation.org/docs/native-bottom-tab-navigator/), [regra de navegadores nativos](../../agents/mobile.md), [plano](../../../.scratch/merenda/mobile-native-plan.md). O restante do teste físico e o pacote acadêmico continuam pendentes.
