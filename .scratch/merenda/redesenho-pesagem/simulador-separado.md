# App vazio e simulador separado — 17/11/2026

Lucas confirmou a proposta de app sem exemplos nem controles de teste e simulador separado para demonstrar todos os fluxos no vídeo. Esta rodada concretiza essa separação; não publica nem integra banco/backend acadêmicos.

- [x] Testar e implementar ponte local de leituras RFID/bruto, sem dependências novas: processo Node em 8095, painel próprio e consulta HTTP pelo app. Mesma avaliação de `iot/shared.ts` continua sendo usada no app. Esta ponte é ferramenta de demonstração, não a API exigida pelo enunciado.
- [x] App aprovado: zero exemplos iniciais, armazenamento dedicado para preservar dados do app anterior; remover painel de simulação, restauração de exemplos, rodapés de teste e Agentation. Preservar Home, Histórico, Allo e pesagem. Sem apagar dados já existentes.
- [x] Consumo de leituras apenas com tela de pesagem ativa e ciclo aguardando lixeira. Ao entrar/retomar um ciclo, estabelecer posição atual e ignorar eventos antigos; retentativas não repetem a última leitura. Indicar conexão discretamente; permitir retry/reconexão sem perder registros.
- [x] Validar unidade, ponte, UI integrada, retentativas/leituras antigas, persistência e regressões. Atualizar documentos e roteiro para gravação, preservando os limites mobile/segurança/API.

Decisões de implementação: persistir a versão aprovada em chave separada; não carregar dados fictícios para tornar gráficos artificiais. Data do app permanece hoje. No celular físico, o endereço da ponte deve ser configurado para o IP do computador; a verificação automática desta rodada é web, não runtime nativo.

O caminho legado permanece explicitamente disponível para preservar trabalho e evidência anteriores. A flag atual continua selecionando a interface aprovada; não promover uma migração geral silenciosamente.

## Decisão durante execução

O app aprovado passa a abrir por padrão para cumprir a separação pedida; manter a flag anterior como caminho obrigatório faria `npm run web` ainda abrir exemplos e controles de teste. Cliente anterior preservado com `EXPO_PUBLIC_LEGACY_APP=1`, inclusive seus testes e armazenamento. Nova chave `merenda.servicos.aprovado.v1`, sem migração destrutiva.

Na web, trocar para o simulador em outra aba não interrompe a escuta da tela de pesagem que continua montada. Em runtime nativo, background continua suspendendo a assinatura; o retorno estabelece nova posição e não reaproveita leitura antiga.

## Resultado verificado

36 testes de unidade, quatro de IoT e seis fluxos legados passaram; TypeScript passou. Integração app/painel passou em 20 cenários, inclusive troca de abas, descarte, correção e persistência. Bundle iOS exportado, sem runtime nativo. Logs em docs/evidencias/separate-simulator/. Guia e roteiro em docs/guia-simulador-gravacao.md. Serviços locais deixados disponíveis em 8094 e 8095; sem commit/push/PR.
