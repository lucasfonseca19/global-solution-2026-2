# Evidências — ticket 09

Execução em 14/11/2026, macOS ARM64, Node 22.17.1/npm 10.9.2. Trabalho limitado a login e consulta, sem implementar 10/11/12.

## Resultado observado

- `npm test -- --reporter=verbose`: cinco testes do adaptador passaram.
- `npm run typecheck`: passou.
- `npm run build:web`: exportação Expo web concluída em `mobile/dist/`.
- `npx expo install --check`: dependências compatíveis com SDK 58.
- `npm run test:e2e`: dois fluxos completos passaram usando Chrome instalado, viewport 390 × 844 e 1280 × 800. Perfil isolado; não depende de sessão pessoal do navegador.

Os arquivos `.txt` deste diretório são saídas reais dos comandos. A extensão permite versionar as evidências sem mudar a regra raiz que ignora `*.log`. Não houve edição do conteúdo dos logs.

## Cenários e evidências individuais

| Cenário | Entrada/ação | Resultado observado | Evidência |
| --- | --- | --- | --- |
| Login aceito | demo / merenda-demo | Sessão fictícia, usuário sem senha na resposta | adapter-final.txt, web-green.txt |
| Login rejeitado | demo / errada | NAO_AUTORIZADO, mensagem genérica | adapter-invalid-red.txt, adapter-invalid-green.txt, web-green.txt |
| Completo | consultar 101 | duas pesagens, total 5 kg | adapter-query-red.txt, adapter-query-green.txt, web-green.txt |
| Pendente | consultar 102 | RESTO_PRATO null, total parcial 3 kg, aguardando pesagem | adapter-final.txt, web-green.txt |
| Zero confirmado | consultar 103 | completo, líquido zero, sem categoria pendente | adapter-final.txt, web-green.txt, captura zero-confirmado.png |
| Acesso sem sessão | token vazio/inventado | NAO_AUTORIZADO | adapter-access-red.txt, adapter-access-green.txt |
| ID inexistente | 999 após login | SERVICO_NAO_ENCONTRADO | adapter-final.txt |
| Isolamento dos exemplos | alterar resposta, consultar novamente | zero original preservado | adapter-final.txt |
| Lista vazia | adaptador com seed vazio | array vazio | adapter-final.txt (interface de vazio implementada, sem fluxo web específico) |
| Navegação e sessão | detalhes → histórico → sair; recarregar desktop | retorno funcional; login reaparece | web-green.txt |

Ciclos TDD verticais executados: login (primeiro red: módulo ausente), senha incorreta, consultas e acesso/404; cada teste foi observado falhando antes da implementação correspondente e passando depois. Isolamento/lista vazia foram verificações adicionais já verdes. A tentativa web inicial em `web-red.txt` falhou por ausência do navegador de testes; é evidência de infraestrutura, não red funcional de UI.

## Artefatos

- `mobile/test-results/results.json`: resultados Playwright e duração individual (gerado, ignorado).
- Capturas copiadas para este diretório: `zero-confirmado.png` e `historico-desktop.png`.
- Exportação web fica em `mobile/dist/` (gerada, ignorada).

## Limites e ocorrências

A instalação do Chromium Playwright v1255 falhou com ENOSPC. Foi removido apenas o ZIP temporário dessa tentativa; nenhum perfil ou dado pessoal foi removido. Os fluxos passaram com `channel: chrome`, usando Google Chrome já instalado. Não confundir largura móvel do navegador com execução React Native nativa. iOS/Android/celular não foram executados; preservar a verificação nativa prevista na entrega final.

Login compara credenciais fictícias públicas, sem servidor, hash ou segurança real. API/database não foram tocados. `npm audit --omit=dev` apontou três alertas moderados transitivos relacionados a expo/@expo/fingerprint/minimatch; não foi aplicado upgrade forçado do SDK. Contrato permanece provisório para integração.

A arquitetura prevê quatro telas; 09 entrega três funcionais. Registro, escrita, avaliação de leitura, persistência e restauração permanecem nos próximos tickets. Sem botões antecipando essas ações.

## Revisão de interface (Interface Craft)

Contexto: consulta rotineira por funcionário da alimentação escolar. A estrutura prioriza serviço/data, estado e quantidade; o detalhamento separa as categorias e mantém retorno explícito. Uma coluna de até 640 px, espaçamento consistente, controles de 48 px, contraste escuro sobre fundo claro e estado escrito reduzem esforço de leitura. Sem imagens ou animação; as capturas registram os estados reais. Teclado/leitor de tela e áreas seguras nativas ainda exigem verificação em dispositivo.

## Conferência do orquestrador

Reexecução: cinco testes Vitest e typecheck passaram; dois fluxos web passaram após correção do rótulo acessível dos cartões, agora com total/parcial e kg. `review-label-red.txt` registra a falha reproduzida e `review-label-green.txt` a passagem após correção. A primeira reexecução teve ENOSPC; removido somente o simulador novo desta sessão, preservando dados pessoais.
