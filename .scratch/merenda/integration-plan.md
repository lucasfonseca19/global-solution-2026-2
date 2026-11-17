# Integração autorizada — 17/11/2026

Lucas aprovou executar a análise/plano apresentado nesta conversa, incluindo ajustes no backend/banco e integração. Sem push, PR, mensagens ou carga do histórico local. Worktree existente, checkpoint dbaa3c6; contribuição original 51957f39da4bdf987a88e313a6a6f504481222b4, importada somente em backend/ e database/.

## Arquitetura e contrato de execução

Preservar Java 21/Spring Boot/PostgreSQL e React Native/Expo; simulador Node separado. Fuso operacional America/Sao_Paulo. App integrado por padrão, demonstração local explícita por EXPO_PUBLIC_DATA_MODE=demo; URL independente EXPO_PUBLIC_API_URL (padrão http://localhost:8080). Sem fallback, importação de AsyncStorage ou persistência de token. Home, Histórico, Allo e pesagem preservados.

- POST /auth/login, GET /servicos, GET /servicos/{id}, DELETE /servicos/{id}, POST /leituras/avaliar preservados.
- POST /pesagens confirma contribuição: {data,tipoRefeicao,cicloId,leitura:{codigoRfid,pesoBrutoKg},substituirId?}. Retorna serviço completo atualizado (200). IDs de registro em string. Repetição idêntica do ciclo não aplica outra escrita; reutilização com payload diferente é conflito. Correção identifica registro, mantém a mesma lixeira e só substitui sua contribuição.
- PUT /servicos/{id}/conclusao conclui explicitamente (200), exige ambas as categorias e dia atual. Repetição de conclusão é segura. Correção mantém conclusão; novas contribuições a concluído são rejeitadas.
- Resposta: {id,data,tipoRefeicao,status,pesagens,totalKg,registros:[{id,categoria,lixeiraId,codigoRfid,taraKg,pesoBrutoKg,pesoLiquidoKg}]}. pesagens é projeção por categoria; registros preserva contribuições. PENDENTE/COMPLETO mantidos.
- Dia validado no servidor em toda escrita, incluindo data original da correção/exclusão/conclusão e pedido de confirmação. Sem confiar em tara/categoria/líquido enviados pelo cliente. Precisão até três casas, máximo bruto 500 kg. Prévia nunca grava.
- Um serviço por data/refeição normalizada, proteção transacional e unicidade no banco. Ciclos persistidos separadamente permitem idempotência também de correções.
- Cadastro inicial obrigatório: operador/merenda123 (BCrypt), duas categorias e duas lixeiras. Histórico fictício em script opcional, sem carga automática. Alerta por limite não faz parte do fluxo aprovado.

## Entregas e verificações

- [x] API: testes de comportamento antes das mudanças; contribuição individual, idempotência e concorrência, correção, conclusão, dia/fuso, JWT e validações. Atualizar Swagger/Postman e plano. Executor backend/ somente.
- [x] Banco: remover unicidade por categoria, incluir conclusão e ciclos; normalizar refeição, atualizar DER e sete consultas; criar migration não destrutiva da entrega antiga, carga padrão vazia de serviços, fixture opcional. Executar PostgreSQL isolado sem tocar bancos existentes. Executor database/ somente, coordenado com API.
- [x] App: separar interface usada pelo fluxo aprovado dos métodos legados; adaptador fetch com erros/timeouts, sessão em memória e seleção explícita; testes de contrato, falha sem fallback e retry preservando ciclo. Executor principal mobile/.
- [x] Integração: PostgreSQL + Java + app + simulador separados; comprovar 3+1+2=6, replay=6, correção=5,5, conclusão explícita, zero, leitura inválida, falha/retry, recarga e exclusão. Typecheck, testes app/IoT, regressão demo/legado e exportação mobile; runtime nativo se disponível.
- [x] Revisão independente do conjunto, corrigir achados e atualizar README, continuidade, contrato e evidências individuais. Não declarar teste executado sem saída real. Não gerar pitch/PDF/ZIP nesta integração.

## Foco de revisão

1. Duas confirmações concorrentes e resposta perdida não duplicam nem perdem contribuições.
2. Payload diferente no mesmo ciclo e correção de outra lixeira não alteram o banco.
3. Virada de dia e adulteração da data não permitem mudar serviço antigo.
4. Falha HTTP, token inválido/expirado e resposta inválida não viram sucesso nem demo silenciosa.
5. Dados iniciais não inventam tendência; médias agregam por serviço concluído, não por pesagem.

## Registro

Plano decorre da aprovação explícita do usuário; dispensa nova microaprovação. Não criar outra worktree. Diretórios não rastreados preexistentes preservados. Ferramentas disponíveis: Java 21, Maven; docker não está no PATH, investigar alternativas instaladas sem alterar configurações pessoais.

## Revisão e resultado

Revisão independente apontou divergência de calendário/fuso e colisão de ciclos gerados por timestamp/contador. Corrigidos: Intl em America/Sao_Paulo e checagem na virada; 128 bits aleatórios via expo-crypto (dependência proporcional para web/nativo, sem alterar UI). Suíte com dispositivo UTC confirma datas. Manter ciclo/hash após exclusão impede ressuscitar serviço por retry; FK nullable SET NULL e conflito explícito. JWT_SECRET obrigatório. Compose e API alinhados na porta PostgreSQL 55439.

A execução nativa foi investigada: xcrun simctl list runtimes/devices não possui runtime/dispositivo disponível. Exportação iOS passou, mas não comprova runtime nativo. Essa pendência é registrada, não marcada concluída. Docker indisponível; SQL/Java foram efetivamente executados com PostgreSQL temporário real. Resultados e comandos finais em docs/evidencias/backend-integration/README.md.
