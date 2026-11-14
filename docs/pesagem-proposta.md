# Proposta de interface: registrar descarte

Status: needs-triage

Proposta de 14/11/2026, ainda não aprovada por Lucas. Crítica da descrição existente, usando Design Critique da Interface Craft. Não há screenshot ou interface renderizada: as observações abaixo são sobre estrutura e interação; as escolhas visuais são recomendações, não constatações sobre uma tela pronta.

## Contexto

Pessoa responsável na escola registra o descarte ao final do serviço. Deve reconhecer o serviço, colocar a lixeira na balança, conferir a identificação e o peso, e confirmar. Para a entrega acadêmica, o avaliador também precisa entender e repetir a simulação facilmente.

Não houve entrevistas: pressa, pouca atenção disponível e uso com uma mão são hipóteses de projeto para uma rotina operacional, não resultados de pesquisa com usuários.

## Primeira impressão da proposta anterior

A descrição mistura data/tipo de refeição, dois blocos de pesagem e controles de demonstração na mesma tela. Se todos tiverem o mesmo destaque, o usuário terá de interpretar o formulário antes de perceber o próximo passo. A ideia está funcionalmente delimitada, mas ainda não define uma hierarquia clara para o momento de pesar.

## Design visual proposto

- **Hierarquia pelo peso:** o valor líquido recebido é a informação dominante, com unidade próxima e categoria claramente identificada. Tara e peso total aparecem em texto secundário, juntos, sem competir com o resultado.
- **Uma cor de ação:** fundo claro levemente acinzentado, superfície branca, texto escuro e verde escuro nos botões principais e confirmações. Pendente é um estado normal, apresentado em tom neutro; vermelho fica para erro. Não depender apenas da cor para comunicar estado.
- **Acabamento contido:** tipografia do sistema, alinhamentos constantes, margens generosas, bordas discretas e poucos níveis de tamanho. Evitar gradientes, sombras grandes, ilustrações decorativas e fontes adicionais.
- **Toque confortável:** propor botões com pelo menos 48 unidades lógicas de altura e rótulos claros. Validar legibilidade e contraste na implementação, em mobile e web.

Essas escolhas dão destaque à tarefa e reduzem o custo de implementação. Não implicam um design system completo ou bibliotecas novas.

## Design da interface

### Hierarquia proposta

1. **Contexto compacto:** voltar, título “Registrar descarte” e “Almoço · 14 nov”. Data/tipo são definidos ao iniciar o registro; depois ficam resumidos, com ação discreta de editar. Não criar uma quinta tela.
2. **Instrução da vez:** inicialmente “Coloque uma lixeira na balança”. A orientação muda conforme chega a leitura, sem pedir ao funcionário que selecione a categoria.
3. **Uma área de leitura ativa:** mostrar lixeira reconhecida, categoria e peso líquido. Não apresentar dois grandes cartões como duas ações concorrentes; o RFID determina qual categoria está sendo pesada.
4. **Resumo das duas categorias:** duas linhas compactas com “Aguardando pesagem” ou valor confirmado. Permanecem visíveis para mostrar o que já foi concluído, sem impor ordem entre as lixeiras.
5. **Uma ação principal:** botão “Confirmar pesagem” quando houver leitura válida. Sem leitura, explicar a espera; com erro, explicar a correção necessária e impedir confirmação.
6. **Controles da demonstração:** acesso secundário “Simulação dos equipamentos”, recolhido inicialmente. Identificar os dados como simulados, mesmo quando o painel estiver fechado. Cenários pertencem à apresentação, não à seleção manual da categoria pelo funcionário.

Ao abrir um serviço novo, o pequeno formulário de data/tipo dá lugar à área de pesagem na mesma tela. Organização exata desse formulário ainda precisa ser revisada com Lucas.

### Exemplo de conteúdo após uma leitura válida

```text
Registrar descarte
Almoço · 14 nov                         Simulado

Lixeira reconhecida
Sobras da cozinha

                 3,00 kg
            de alimento descartado

Peso total 4,00 kg · Lixeira vazia 1,00 kg

Conferência do serviço
Sobras da cozinha                 Aguardando confirmação
Restos dos pratos                 Aguardando pesagem

            Confirmar pesagem

Simulação dos equipamentos                  Abrir
```

“Aguardando confirmação” distingue a leitura recebida de um registro já salvo. O resumo nunca deve trocar um peso confirmado por uma prévia antes da ação do usuário.

## Consistência e comportamento

| Situação | Apresentação e ação |
| --- | --- |
| Sem leitura | Instrução para colocar a lixeira; sem número que pareça uma medição; confirmação indisponível |
| Leitura válida | Categoria reconhecida e peso líquido em destaque; confirmação disponível |
| Zero válido | Mostrar 0,00 kg como leitura real; permitir confirmar porque bruto igual à tara não é erro |
| RFID desconhecido ou bruto menor que tara | Mensagem próxima à leitura; explicar o problema; impedir confirmação |
| Confirmou a primeira categoria | Atualizar a linha correspondente, reconhecer o sucesso e voltar a orientar a próxima pesagem; permanecer na tela |
| Chegou leitura da categoria já confirmada | Preservar o peso salvo no resumo; mostrar prévia e ação “Atualizar pesagem”, deixando claro que substituirá o valor anterior |
| Duas categorias confirmadas, sem nova leitura em edição | Mostrar serviço completo e ação “Ver resumo”, abrindo Detalhes |

Confirmações e erros devem manter o mesmo padrão entre as categorias. Não exigir um botão “Salvar tudo” depois de já confirmar cada peso. Exclusão continua em Detalhes, com confirmação; não ocupa espaço no fluxo de pesagem.

Não simular espera artificial ou animações elaboradas. Feedback textual e uma mudança visual discreta de estado são suficientes; o uso de Interface Craft não implica instalar DialKit ou bibliotecas de animação.

## Contexto do usuário e demonstração

O cuidado principal é tornar a próxima ação óbvia e manter visível o que já foi salvo. Mensagens usam linguagem da tarefa: “Lixeira não reconhecida” em vez de termos como erro de payload. “Tara” pode aparecer como “Lixeira vazia” na interface, preservando o termo técnico no glossário e na documentação.

O avaliador deve encontrar os controles de simulação sem investigar o código. Um acesso rotulado e visível, ainda que secundário, permite demonstrar as duas lixeiras e os erros sem transformar o produto em um painel técnico.

## Prioridades

1. Uma leitura ativa e uma ação principal por vez.
2. Distinguir prévia, confirmação e categoria ainda não pesada.
3. Separar os controles de demonstração da tarefa do funcionário.
4. Mostrar categoria e peso de forma clara, com cálculo legível em segundo plano.
5. Acabamento por alinhamento, contraste e tipografia, mantendo quatro telas e o mesmo escopo.

## Decisões ainda abertas

Lucas ainda precisa revisar esta direção. Os dois padrões sugeridos na rodada anterior (painel recolhível e persistir dados ao fechar o app) não foram aprovados: o painel é retomado aqui como proposta, enquanto persistência/restauração de exemplos continua uma decisão separada. Não transformar esta crítica em especificação aprovada ou tickets prontos.
