# Continuidade — integração real do Merenda

Atualizado em 17/11/2026 após autorização de Lucas para executar a integração. Este documento substitui a passagem anterior de somente análise. Não fazer push/PR nem enviar mensagens a pessoas sem autorização explícita.

## Worktree e proveniência

Trabalhar em `/Users/lucas/.t3/worktrees/global-solution-2026-2/t3-5b5fb2b8`, branch `t3/rnr-weighing-preview`. Base aprovada `dbaa3c6`; backend/banco do colega localizados em `origin/back-banco-api`, SHA `51957f39da4bdf987a88e313a6a6f504481222b4`, confirmado no remoto. Importados somente backend/ e database/; documentação/UI posterior preservada. Conferir git log/status antes de retomar. Não recomeçar de main nem substituir a worktree.

Diretórios não rastreados preexistentes `.agents/`, `.taste-skill/` e evidências agentation-preview/motion-preview/taste-preview foram preservados e não fazem parte da integração.

## Leitura e regras

Ler ENUNCIADO.md, CONTEXTO.md, GLOSSARY.md, .scratch/merenda/spec.md, [ADR0001](adr/0001-pesagens-individuais-conclusao-explicita.md), [ADR0002](adr/0002-pesagens-somente-no-dia-atual.md), [contrato atual](../.scratch/merenda/api-contract.md) e [plano/decisões](../.scratch/merenda/integration-plan.md). Trechos históricos de substituição por categoria e conclusão automática não prevalecem.

- Preservar Home, Histórico, Allo, pesagem e simulador separado.
- Contribuições individuais com ID; várias da mesma categoria somam. RFID identifica lixeira. Correção por ID usa a mesma lixeira e preserva demais contribuições/conclusão.
- Ciclos aleatórios entre aparelhos; replay idêntico não grava; payload diferente conflita. Ciclo/hash sobrevivem à exclusão e impedem recriar serviço por retry antigo.
- Conclusão explícita exige ambas as categorias; zero confirmado é válido. Prévia precisa ser confirmada/descartada antes de concluir no app.
- Data fixa, somente hoje, usando America/Sao_Paulo no app e no servidor. Revalidar nas escritas e na virada; histórico de outro dia, inclusive pendente, é consulta.
- API identifica lixeira/tara, calcula líquido e valida novamente na confirmação. Falhas não alteram confirmado nem geram sucesso visual.
- Sensores só em ciclo aguardando na pesagem ativa; reconexão não reaproveita eventos antigos. Transmitir não equivale a gravar.
- Médias/comparações somente concluídos, sem produção pesada ou porcentagem da produção. Sem histórico fictício automático.

## Estado implementado

API Java21/Spring Boot e PostgreSQL, sete operações com GET/POST/PUT/DELETE, camadas, Swagger/Postman. Login BCrypt, JWT, validação, ORM parametrizado, erros genéricos e bloqueio de tentativas. JWT_SECRET obrigatório. Seis entidades, DER e sete consultas. Schema para banco vazio; migração não destrutiva revisável para entrega antiga; fixture histórica opcional. Não foi aplicada migração em banco pessoal.

App usa `createAppData`/adaptador HTTP por padrão, sem fallback. Interface AppDataAccess separada das operações legadas. API recebe confirmação individual e conclusão; registros/ID preservados nas respostas. Token em memória, sem persistência; recarga pede login e consulta banco. AsyncStorage preexistente não é importado nem apagado.

`EXPO_PUBLIC_DATA_MODE=demo` ativa explicitamente adaptador local vazio, login demo/merenda-demo e chave `merenda.servicos.aprovado.v1`. `EXPO_PUBLIC_LEGACY_APP=1` mantém cliente anterior e chave antiga. Não confundir essas demonstrações com API acadêmica.

## Executar

Seguir [README raiz](../README.md), [database](../database/README.md), [backend](../backend/README.md) e [guia do simulador](guia-simulador-gravacao.md). Banco padrão do Compose/API: localhost:55439, merenda/merenda. API localhost:8080. Configurar JWT_SECRET, iniciar banco e API antes de entrar com **operador / merenda123**. Painel Node localhost:8095 e app web localhost:8094. API e ponte têm URLs independentes: EXPO_PUBLIC_API_URL e EXPO_PUBLIC_SIMULATOR_URL. Para celular, usar IP do computador e acesso LAN explícito da ponte; para web via IP, configurar origens das duas partes. Usar vercel-react-native-skills para alterações mobile.

## Verificações e limites

[Evidências atuais](evidencias/backend-integration/README.md): 20 testes API/H2 com JDK21, 50 testes app, oito casos calendário sob UTC, quatro IoT, seis fluxos web legados, 20 cenários demo, 12 cenários UI integrada real e 13 verificações HTTP/PostgreSQL. SQL real: onze verificações de integridade, sete consultas e migração com preservação/rollback. Revisão independente realizada; achados de fuso e identidade de ciclo corrigidos. Bundle iOS passou.

Runtime nativo continua sem comprovação: simctl não possui runtimes/dispositivos disponíveis. Docker indisponível nesta máquina; Compose não executado. PostgreSQL real rodou isolado em diretório temporário, sem instalação global; processos temporários encerrados após testes, sem parar app/simulador preexistentes. Dados temporários preservados.

## Próximos passos da equipe

Revisar as alterações locais com o colega, verificar runtime mobile em ambiente disponível e consolidar PDF/TXT/ZIP/pitch. Integração é diferencial; não declarar conformidade acadêmica completa apenas pelos testes. PDF inclui DER, plano/evidências individuais e integrantes; TXT e README exigem link público do pitch de até três minutos, conforme enunciado. Confirmar tecnologias dentro da fase4. Não iniciar publicação/envio sem autorização.
