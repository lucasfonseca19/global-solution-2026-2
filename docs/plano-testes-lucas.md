# Plano de testes da parte de Lucas

Versão simulada; execução e evidências serão acrescentadas conforme verificadas. Nenhum caso desta tabela está executado apenas por estar planejado.

| ID | Cenário/entrada | Resultado esperado | Estado inicial |
| --- | --- | --- | --- |
| CT01 | Login fictício correto | Abrir histórico; sinalização de simulação | Planejado |
| CT02 | Senha incorreta | Mensagem de erro; permanecer no login | Planejado |
| CT03 | Abrir exemplo completo e voltar | Categorias e total coerentes, retorno ao histórico | Planejado |
| CT04 | RFID-SIM-001 e bruto 4 kg, somente prévia | Líquido 3 kg; nenhum peso confirmado alterado | Planejado |
| CT05 | Confirmar sobra 3 kg e restos 2 kg | Serviço completo, total 5 kg | Planejado |
| CT06 | RFID-SIM-999, bruto 4 kg | Lixeira desconhecida; confirmação bloqueada | Planejado |
| CT07 | RFID-SIM-001, bruto 0,5 kg | Peso abaixo da tara; confirmação bloqueada | Planejado |
| CT08 | RFID-SIM-002, bruto 1,5 kg | Zero válido e confirmado; diferente de pendência | Planejado |
| CT09 | Reutilizar mesma data/tipo | Continuar serviço existente, sem duplicação | Planejado |
| CT10 | Corrigir restos para bruto 4 kg | Restos 2,5 kg; total 5,5 kg; sobra preservada | Planejado |
| CT11 | Excluir: primeiro cancelar, depois confirmar | Cancelar preserva; confirmar remove apenas alvo | Planejado |
| CT12 | Confirmar dados e reiniciar app | Dados confirmados preservados, nova sessão de login | Planejado |
| CT13 | Restaurar exemplos: cancelar/confirmar | Cancelar preserva; confirmar repõe exemplos | Planejado |
| CT14 | Executar CLI de RFID/balança | Leituras de ambos dispositivos e cálculo/validação observáveis | Planejado |
| CT15 | Fluxos nas quatro telas em iOS nativo | Navegação, feedback e pesagem funcionais fora do navegador | Planejado |

## Registro de evidência

Para cada execução: indicar ID, ambiente, data, comando ou passos, entrada, esperado, observado, resultado e caminho da evidência. Testes do adaptador demonstram regras; web demonstra fluxo; execução iOS demonstra ambiente nativo. Nenhuma dessas evidências implica API, banco ou segurança real do colega.
