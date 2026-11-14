# 07 — Preparar os testes e registrar evidências

Status: ready-for-human
Responsáveis: ambos, cada um nas próprias partes
Blocked by: nenhum para planejar; implementações correspondentes para executar

## Comportamento esperado

Preparar o plano acadêmico cedo e executar os casos conforme cada parte ficar disponível. Testes manuais são permitidos. Não exigir automação ou integração para comprovar os requisitos individuais.

## Critérios de aceite

- [ ] Plano com pelo menos oito casos, contendo cenário, entrada, saída esperada e status, incluindo erros.
- [ ] Cobrir login, identificação RFID/peso, tara, zero/pendência, correção sem duplicação, serviço duplicado e exclusão conforme o plano final.
- [ ] Pelo menos cinco testes realmente executados; evidência individual de cada execução em print, log ou relatório.
- [ ] Identificar qual parte foi testada e se usava respostas simuladas ou backend real; não confundir mock com verificação de segurança.
- [ ] Revisar o plano se o contrato mudar e incluir teste do fluxo integrado caso 06 o entregue.
- [ ] Organizar plano e evidências para o PDF final e referenciar a forma de reproduzir.

## Dependências e limites

Planejar pode começar agora. Só marcar execução após observar o resultado; não inventar evidências. O status deste ticket não significa que testes passaram. Cada caso depende da funcionalidade correspondente de 02, 03, 04, 05 ou 06.

## Comentários

### 14/11/2026

Preparação independente do backend; execução será feita progressivamente. Ainda não há testes executados.
