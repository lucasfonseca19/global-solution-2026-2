# Merenda: redesenho e cobertura do enunciado

## Atualização: app vazio e simulador separado

A interface aprovada agora é a abertura padrão (`npm run web`), inicia sem exemplos e persiste somente seus registros em chave dedicada. Foram removidos os controles de cenário/restauração e a toolbar do app; o painel local de RFID/balança fica separado em 8095 e envia leituras efetivamente consumidas pelo app. A lacuna de exigir flag e perder dados da prévia na recarga foi resolvida.

As leituras continuam fictícias e o login continua demonstrativo, sem hash real. A ponte Node não cumpre a parte acadêmica de API em Java/ASP.NET nem implementa banco/segurança. Runtime nativo e materiais finais permanecem pendentes. Ver [execução e roteiro](../guia-simulador-gravacao.md) e [evidências atuais](../evidencias/separate-simulator/README.md).

A tabela abaixo registra a conferência anterior ao simulador separado; aplicar esta atualização aos itens de abertura, persistência e IoT. Os demais requisitos continuam válidos.

Conferido em 17/11/2026 na worktree `t3-5b5fb2b8`. Escopo: código e documentos presentes nesta worktree; não é auditoria de contribuições do colega em outra branch/máquina nem garantia de nota. Referência: [enunciado](../../ENUNCIADO.md), especialmente seções 7–13.

O redesenho preserva o propósito e as funções do app, mas a entrega inteira ainda não está atendida. Interface aprovada executada com `EXPO_PUBLIC_DESIGN_PREVIEW=1`; sem a flag, o app original mantém seu fluxo anterior. A prévia usa dados fictícios em memória e não integra backend. Não confundir evidência web/exportação iOS com execução em celular.

| Requisito | Evidência e situação neste checkout | O que falta para a entrega |
| --- | --- | --- |
| Frontend: quatro ou mais telas, navegação e feedback (3 pontos) | Cinco telas: Login, Hoje/Home, Histórico, Pesagem/Registro, Detalhes. Fluxos web verificaram leitura, confirmação, continuidade, conclusão, correção, consulta e exclusão. Home/Histórico e Allo preservados. | Conferir execução nativa em celular/simulador, inclusive fonte, régua, áreas seguras e retorno do app. Exportação iOS não encerra esse item. Escolher/documentar claramente o comando da versão entregue. |
| IoT: dois ou mais sensores, uso dos dados e explicação (2 pontos) | RFID identifica lixeira/categoria/tara; balança fornece bruto; líquido calculado e confirmado alimenta total, detalhes e Histórico. Cenários e cálculo compartilhados em `iot/shared.ts`, CLI em `iot/`. Dois testes da CLI passaram. | Levar a explicação e a demonstração ao PDF/pitch. Não apresentar transição animada como leitura contínua de hardware real; é uma simulação. Integração CLI → app não existe e não é obrigatória. |
| Testes: oito ou mais casos, cinco ou mais executados e evidências individuais (2 pontos) | Plano existente com 15 casos; 32 testes de unidade, dois da CLI, seis fluxos web da versão original e roteiro web novo executados nesta rodada. Evidências do redesenho em pasta própria. | Atualizar CT05/CT08/CT10 para o novo comportamento e incorporar plano/logs/capturas ao PDF final. Logs de versões anteriores não comprovam o fluxo novo. |
| Banco: quatro ou mais entidades, DER normalizado, SQL/carga e cinco SELECTs com JOIN/agregação (2 pontos) | `database/` contém somente README de reserva; não há SQL/DER implementado localizado nesta worktree. | Implementar e executar a parte de banco, preservando serviço único por data/refeição e relação de um serviço para várias pesagens. Identidade de lixeira não substitui identidade de pesagem. |
| API: seis endpoints, GET/POST/PUT/DELETE, três camadas, validações/status e Swagger/Postman (4 pontos) | `backend/` contém somente README de reserva. Métodos TypeScript do adaptador local não são endpoints HTTP. | Backend em Java ou C# com ASP.NET, conforme conteúdo permitido, e documentação executável. Revisar contrato para confirmação individual, idempotência e conclusão explícita; não reutilizar o PUT antigo sem revisão. |
| Segurança: senha com hash e três ou mais práticas (2 pontos) | Login simulado compara credenciais no cliente; não atende ao requisito de hash. Validações locais são demonstração e não comprovam autorização/proteções de servidor. | Demonstrar senha com hash, controle de acesso e práticas verificáveis na implementação real. Mesmo com dados mockados, a rubrica mantém hash obrigatório. Validar data/fuso no servidor ao integrar. |
| PDF, TXT, código/README e ZIP | Código, orientações e evidências existem; PDF/TXT/ZIP acadêmicos finais não foram encontrados. | PDF com integrantes, DER, plano/evidências e demais entregáveis não executáveis; TXT com grupo, RM, nomes e link do vídeo; ZIP com código, README, PDF e TXT. Não publicar material pessoal/local por acidente. |
| Vídeo pitch (5 pontos) | Há roteiro parcial, sem link público final no README/TXT. | Vídeo de até três minutos com protótipo funcionando, problema/cidadão, demonstração das partes, impacto e diferencial; sem apresentação em slides/leitura de texto. Validar acesso público. |
| Cidadão, ODS, tecnologias e revisão humana | Contexto descreve escola e descarte; uso de IA declarado no README. Há material documental de referência, sem validação com usuários reais. | Consolidar no PDF/pitch cidadão beneficiado, problema e ODS com contribuição às metas, sustentando afirmações com fontes. Equipe revisa/compreende a solução. Confirmar tecnologias de todas as partes no conteúdo até fase 4. |
| Grupo e prazo | Enunciado: grupo não individual de até cinco integrantes, uma entrega, até 19/11/2026 às 23h55. | Conferir nomes/RMs, integrantes e envio do pacote na plataforma. |

## O que a simplificação preservou

- Identificação automática pelo RFID: não é o funcionário escolhendo manualmente a categoria. Os botões são controles de demonstração.
- Tara descontada automaticamente, bruto/tara acessíveis em “Detalhes do peso” e resultados individuais nos detalhes do serviço.
- Uma prévia não grava, não altera o total e não permite concluir. Somente confirmação manual registra a contribuição.
- Nova pesagem representa novo ciclo; repetir a confirmação do mesmo ciclo é idempotente. A mesma lixeira pode participar de outro ciclo explícito.
- Várias pesagens da mesma categoria somam; correção substitui somente uma contribuição. A presença de ambas categorias não encerra o serviço.
- Zero confirmado é diferente de categoria sem informação. Ambas devem ter registro para concluir.
- Erros de RFID/tara não gravam; falha de confirmação permite tentar novamente com o mesmo ciclo; saída com leitura pendente pede descarte.
- Outros dias continuam somente consulta, inclusive pendentes. A virada do dia impede salvar a prévia anterior e permite sair para consulta.
- Excluir serviço continua exigindo confirmação e remove suas contribuições. A prévia continua permitindo consultar os registros anteriores.

## O que não é obrigatório acrescentar ao MVP

Não existe obrigação específica de gráfico, alerta de limite, balança física, hospedagem, publicação em loja, cadastro de lixeiras, contagem de refeições ou porcentagem da produção. A rubrica exige uso dos dados dos sensores; o painel/Histórico e os totais cumprem esse papel demonstrativo. Integração entre as partes e entrevistas com usuários aparecem como diferenciais; não devem ser declaradas sem evidência.

## Próximos passos de maior impacto

1. Verificar a interface aprovada em runtime nativo e definir qual versão será usada pelo avaliador. Hoje a flag é necessária e os dados da prévia não sobrevivem à recarga.
2. Concluir/revisar banco, API e segurança com o mesmo domínio das pesagens individuais. É a maior lacuna técnica encontrada, sem implementação automática nesta tarefa.
3. Consolidar testes, requisitos, ODS e evidências no PDF, finalizar pitch público e TXT, então preparar e conferir o ZIP.

Ver [evidências desta rodada](../evidencias/weighing-redesign/README.md). Nenhum push, PR, instalação de dependência ou integração real foi realizado nesta etapa.
