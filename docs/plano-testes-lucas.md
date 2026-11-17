# Plano de testes da parte de Lucas

Status atualizado pelas evidências de 09–12. A conferência final repetiu 15 testes do adaptador, dois da CLI e cinco fluxos web; veja [12](evidencias/12/README.md). “Executado” identifica a fronteira realmente verificada: adaptador, CLI ou interface web. Isso não implica execução nativa nem API/banco reais. Há pelo menos oito casos planejados e mais de cinco execuções com referência individual.

| ID | Cenário e entrada | Resultado esperado | Estado e evidência individual |
| --- | --- | --- | --- |
| CT01 | Login `demo` / `merenda-demo` | Abrir histórico com sessão fictícia | Executado — adaptador: `login fictício retorna usuário sem senha`, `adapter-final.txt`; web: `login inválido, consulta, retorno e saída`, `web-green.txt`; [09](evidencias/09/README.md) |
| CT02 | Senha incorreta | Mensagem genérica e permanecer no login | Executado — adaptador: `credenciais incorretas são rejeitadas com mensagem genérica`; web: `login inválido, consulta, retorno e saída`; [adapter-invalid-green.txt](evidencias/09/adapter-invalid-green.txt), [web-green.txt](evidencias/09/web-green.txt) |
| CT03 | Abrir exemplo completo e voltar | Categorias e total coerentes, retorno ao histórico | Executado — adaptador: `consulta retorna exemplos completos, pendentes e zero confirmado sem confundi-los`; web: `login inválido, consulta, retorno e saída`; [adapter-query-green.txt](evidencias/09/adapter-query-green.txt), [web-green.txt](evidencias/09/web-green.txt) |
| CT04 | RFID-SIM-001, bruto 4 kg, somente prévia | Líquido 3 kg, sem confirmação | Executado no adaptador — `prévia identifica e calcula sem criar serviço`; log [green-adaptador.txt](evidencias/10/green-adaptador.txt). Fluxo web correlato: `registro: prévia, erros, confirmação, continuidade, zero e consulta`, [e2e.txt](evidencias/10/e2e.txt) |
| CT05 | Confirmar sobra 3 kg e restos 2 kg | Serviço completo, total 5 kg | Executado — adaptador: `confirmar cria pendente, PUT completo conclui e correção substitui preservando sobra`; web: `registro: prévia, erros, confirmação, continuidade, zero e consulta`; [10](evidencias/10/README.md) |
| CT06 | RFID-SIM-999, bruto 4 kg | Rejeitar leitura sem gravação | Executado — adaptador: `salvar revalida e rejeita atomicamente RFID, peso, duplicação e data inválida`; CLI com saída 1 e `RFID_DESCONHECIDO`, [cli.txt](evidencias/10/cli.txt); web: fluxo nomeado de registro no `e2e.txt` de 10 |
| CT07 | RFID-SIM-001, bruto 0,5 kg | Rejeitar peso abaixo da tara sem gravar | Executado — mesmos teste nomeado do adaptador e fluxo web `registro: prévia, erros, confirmação, continuidade, zero e consulta`; CLI retorna `PESO_INVALIDO`, [cli.txt](evidencias/10/cli.txt) |
| CT08 | RFID-SIM-002, bruto 1,5 kg | Zero válido confirmado, distinto de pendência | Executado — adaptador: `zero confirmado completa serviço e PUT omisso deixa categoria pendente`; consulta `consulta retorna exemplos completos, pendentes e zero confirmado sem confundi-los`; web de registro em [e2e.txt](evidencias/10/e2e.txt) |
| CT09 | Reutilizar mesma data/tipo | Continuar o mesmo serviço, sem duplicar | Executado — adaptador: `confirmar cria pendente, PUT completo conclui e correção substitui preservando sobra` e `salvar revalida e rejeita atomicamente RFID, peso, duplicação e data inválida`; web: teste de registro em [e2e.txt](evidencias/10/e2e.txt) |
| CT10 | Corrigir restos para bruto 4 kg | Restos 2,5 kg; total 5,5 kg; preservar sobra | Executado — adaptador: `confirmar cria pendente, PUT completo conclui e correção substitui preservando sobra`, [green-adaptador.txt](evidencias/10/green-adaptador.txt); a web verifica uma correção distinta, para zero, no teste `corrigir por detalhes persiste; sair, excluir e restaurar respeitam confirmação`, [orquestrador-web.txt](evidencias/11/orquestrador-web.txt) |
| CT11 | Excluir: cancelar e depois confirmar | Cancelar preserva; confirmar remove apenas alvo | Executado na web: `corrigir por detalhes persiste; sair, excluir e restaurar respeitam confirmação`, registrado em [orquestrador-web.txt](evidencias/11/orquestrador-web.txt). Adaptador: `excluir remove somente alvo e pesagens e persiste inclusive lista vazia`, [orquestrador-tests.txt](evidencias/11/orquestrador-tests.txt) |
| CT12 | Salvar e recarregar | Serviços persistem; sessão retorna ao login | Executado — adaptador: `reabrir carrega serviços existentes antes de exemplos`; web: `desktop mantém conteúdo legível e recarregar encerra sessão`; [orquestrador-tests.txt](evidencias/11/orquestrador-tests.txt), [orquestrador-web.txt](evidencias/11/orquestrador-web.txt) |
| CT13 | Restaurar exemplos: cancelar e confirmar | Cancelar preserva; confirmar substitui pelos exemplos | Executado na web: `corrigir por detalhes persiste; sair, excluir e restaurar respeitam confirmação`, [orquestrador-web.txt](evidencias/11/orquestrador-web.txt); adaptador: `restaurar substitui alterações pelos exemplos e sobrevive a reabrir`, [orquestrador-tests.txt](evidencias/11/orquestrador-tests.txt) |
| CT14 | CLI RFID/balança | Mostrar dados brutos, associação, cálculo e erros | Executado — comandos individuais em [orquestrador-cli.txt](evidencias/10/orquestrador-cli.txt): sobra, restos, zero, desconhecido e abaixo. A suíte Node registrada no README de [10](evidencias/10/README.md) cobre a fronteira CLI |
| CT15 | Fluxos nas quatro telas em iOS nativo | Navegação e pesagem executam fora do navegador | Pendente — instalação do Expo Go falhou com `ENOSPC`; [mobile-impedimento.txt](evidencias/12/mobile-impedimento.txt). [ios-bundle.txt](evidencias/12/ios-bundle.txt) comprova apenas exportação, não execução |

## Redesenho aprovado em 17/11: critérios que substituem o fluxo anterior

Os registros históricos de CT05/CT08/CT10 acima documentam o app original, não a semântica nova. Na interface aprovada, usar os critérios abaixo e as [evidências do redesenho](evidencias/weighing-redesign/README.md).

| ID | Cenário/entrada | Resultado esperado | Execução e evidência |
| --- | --- | --- | --- |
| CT05-R | Sobras de 3 kg e 1 kg, restos de 2 kg; três ciclos distintos | Três registros, total 6 kg, ainda pendente; concluir explicitamente | Unidade: `soma pesagens, repete ciclo uma vez e conclui explicitamente`, `weighing-redesign/unit.txt` |
| CT08-R | Sobras confirmadas e restos com bruto igual à tara | Zero é registro válido; concluir exige as duas categorias | Unidade: `exige ambas as categorias; zero é confirmação válida`; web: zero nas duas categorias, `weighing-redesign/qa.json` |
| CT10-R | Corrigir um dos dois registros de sobras após concluir | Substituir só aquele registro; preservar os demais e o estado concluído | Unidade: `corrige um registro sem apagar outros nem reabrir; replay antigo não duplica`; web: `correcao-individual.png` |
| CT16 | Confirmar duas vezes o mesmo ciclo | Uma contribuição apenas, inclusive após recarregar o adaptador persistente | Unidade: casos de repetição e de recarga, `weighing-redesign/unit.txt` |
| CT17 | Cancelar durante identificação e tentar novamente | Cancelar libera o ciclo; próxima leitura funciona | Web: `cancelar identificação e tentar novamente`, `weighing-redesign/qa.json` |
| CT18 | Sair com leitura pronta e escolher continuar/descartar | Proteger a leitura; preservar os pesos confirmados | Web: `descarte e saída protegida`, `weighing-redesign/qa.json` |
| CT19 | Leitura pronta aberta antes da meia-noite | Bloquear gravação do dia anterior e permitir saída para consulta | Unidade e web: `virada do dia`, `weighing-redesign/qa.json` |
| CT20 | Preferência de movimento reduzido | Mostrar resultado estabilizado sem espera da animação | Web: `movimento reduzido`, `weighing-redesign/qa.json` |

CT15 (runtime nativo) continua pendente; exportação iOS não substitui essa execução.

## Interpretação das evidências

Em 09–11, testes do adaptador cobrem regras de dados/persistência sem interface; a CLI demonstra a simulação independente; Playwright percorre a aplicação web real com Chrome já instalado. As evidências individuais estão em [09](evidencias/09/README.md), [10](evidencias/10/README.md) e [11](evidencias/11/README.md). Os arquivos nomeados acima são logs reais. Não se contam planos, testes vermelhos ou bundle como execução funcional positiva. A recarga testada no navegador prova persistência web, não nativa.

CT15 e inspeção real em celular continuam como verificação manual necessária. O relatório de implementação e o [guia passo a passo](guia-testes-lucas.md) detalham a limitação e como retomá-la. Nenhuma evidência deste plano implica API, banco ou segurança real.

## App vazio e simulador separado — rodada posterior em 17/11

O app aprovado já não tem os botões internos usados no roteiro de pesagem anterior. Executar `node mobile/simulator-qa.cjs` na raiz, com app em 8094 e ponte em 8095 ativos. Casos atuais: primeiro acesso vazio; login válido/inválido; ausência de controles de teste; leitura pelo painel externo; cursor sem replay; RFID/tara inválidos; identificação e estabilização; cancelamento; descarte e saída; múltiplas pesagens; conclusão explícita; correção; persistência; zero; Histórico; exclusão; troca de abas. Entradas e resultados estão no [guia](guia-simulador-gravacao.md), e cada cenário executado aparece em [qa.json](evidencias/separate-simulator/qa.json).

Unidade cobre também preservação da chave legada, reabertura dos novos registros, reconexão/reinício do servidor e respostas malformadas. A ponte tem testes HTTP próprios; isso não conta como execução da API acadêmica em Java/ASP.NET. A execução nativa continua pendente.
