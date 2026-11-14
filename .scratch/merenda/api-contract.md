# Contrato mínimo entre app, API e simulador

Status: needs-info

Rascunho de 12/11/2026, para revisão de Lucas e do colega responsável pelo backend. Não autoriza implementação. Os nomes de rotas, campos e códigos abaixo são propostas, não decisões já aprovadas pelo grupo.

Referência de comportamento: [especificação](spec.md). Este documento descreve a comunicação entre as partes, sem determinar linguagem, banco ou organização interna.

## Limites e ponto para decisão

Lucas aprovou como ponto de partida seis operações: login, listar, detalhar, criar, atualizar e excluir serviços. Lucas também aprovou acrescentar uma sétima operação de prévia: identificar a lixeira, calcular o peso do alimento e validar a leitura antes de gravar.

A prévia resolve o fluxo já discutido, no qual a API calcula e o funcionário confere antes da confirmação. Não existe exigência de exatamente seis endpoints: o mínimo acadêmico é seis. Não criar CRUD de lixeiras, usuários, sensores ou categorias.

## Convenções propostas

- JSON; nomes de campos em português sem acentos, usando camelCase.
- Identificadores dos registros são números; códigos RFID são strings, preservados integralmente.
- Data do serviço no formato `AAAA-MM-DD`, sem horário ou conversão de fuso.
- Pesos são números em quilogramas. A exibição de casas decimais é responsabilidade do app; nenhuma parte deve arredondar o peso antes do cálculo.
- Categorias fixas: `SOBRA_DESCARTADA` e `RESTO_PRATO`.
- `tipoRefeicao` é texto, como `Almoço`; não haverá cadastro separado de tipos de refeição.
- Serviço `PENDENTE` tem pelo menos uma categoria sem confirmação; `COMPLETO` tem ambas confirmadas, inclusive quando uma delas é zero.
- Regra aprovada por Lucas: cada combinação de data e tipo de refeição identifica um único serviço da escola. Se já existir, continuar ou corrigir o registro existente. A forma de garantir isso no banco fica para o colega propor.

## Dados de demonstração propostos

Uma única escola implícita; não enviar escola ou perfil em cada requisição. Uma conta demonstrativa pré-cadastrada, com senha em hash no backend. Login/senha de demonstração serão combinados com o colega; não incluir senha real de integrante nos exemplos ou arquivos.

| Lixeira | Identificador | Código RFID fictício | Categoria | Tara em kg |
| --- | --- | --- | --- | ---: |
| Cozinha | 1 | RFID-SIM-001 | SOBRA_DESCARTADA | 1 |
| Pratos | 2 | RFID-SIM-002 | RESTO_PRATO | 1.5 |

Esses códigos são identificadores didáticos para a simulação, sem afirmar que representam a codificação de um equipamento real. O simulador fornece código e peso; a API é responsável pela associação com os dados cadastrados. Na versão com respostas simuladas do front, o adaptador simula essa mesma associação.

## Formato de um serviço retornado pela API

Exemplo completo:

```json
{
  "id": 101,
  "data": "2026-11-12",
  "tipoRefeicao": "Almoço",
  "status": "COMPLETO",
  "pesagens": {
    "SOBRA_DESCARTADA": {
      "lixeiraId": 1,
      "codigoRfid": "RFID-SIM-001",
      "taraKg": 1,
      "pesoBrutoKg": 4,
      "pesoLiquidoKg": 3
    },
    "RESTO_PRATO": {
      "lixeiraId": 2,
      "codigoRfid": "RFID-SIM-002",
      "taraKg": 1.5,
      "pesoBrutoKg": 3.5,
      "pesoLiquidoKg": 2
    }
  },
  "totalKg": 5
}
```

Categoria sem confirmação deve vir como `null`, nunca como zero presumido. Em serviço pendente, `totalKg` soma somente as categorias confirmadas e deve ser rotulado no app como total parcial. Se não houver confirmação, o total parcial é zero, mas ambas as categorias continuam pendentes. Esses nomes e a apresentação do total parcial são propostas para revisão.

Não manter uma cópia independente dos totais no front como fonte de verdade quando houver API: após salvar ou corrigir, usar a resposta retornada. O contrato não determina como esses dados serão armazenados nas tabelas.

## Operações propostas

| Operação | Rota proposta | Entrada | Sucesso |
| --- | --- | --- | --- |
| Login | `POST /auth/login` | `login`, `senha` | 200, usuário e token |
| Listar serviços | `GET /servicos` | Sem filtros obrigatórios | 200, array de serviços no formato acima; `[]` quando vazio |
| Detalhar serviço | `GET /servicos/{id}` | ID da rota | 200, um serviço |
| Criar serviço | `POST /servicos` | Data, tipo e pesagens confirmadas | 201, serviço criado |
| Atualizar serviço | `PUT /servicos/{id}` | Data, tipo e conjunto completo das pesagens confirmadas | 200, serviço atualizado |
| Excluir serviço | `DELETE /servicos/{id}` | ID da rota | 204, sem corpo |
| Avaliar leitura | `POST /leituras/avaliar` | Código RFID e peso bruto | 200, identificação e peso calculado, sem gravar |

Todas as operações, exceto login, exigem autenticação. Proposta para o app: enviar `Authorization: Bearer <token>`. A implementação da autenticação fica para o colega; este contrato não exige JWT, renovação de token ou outro mecanismo adicional.

### Login

Entrada: objeto com `login` e `senha`. Exemplo de resposta bem-sucedida, com token fictício apenas ilustrativo:

```json
{
  "token": "TOKEN_FICTICIO_DE_EXEMPLO",
  "usuario": {
    "id": 1,
    "nome": "Operador de demonstração"
  }
}
```

Credenciais incorretas retornam 401 e mensagem genérica. Não retornar senha ou hash. Sem cadastro de contas ou recuperação de senha no MVP.

### Criar e atualizar um serviço

Entrada de criação com a primeira categoria confirmada:

```json
{
  "data": "2026-11-12",
  "tipoRefeicao": "Almoço",
  "pesagens": [
    {
      "codigoRfid": "RFID-SIM-001",
      "pesoBrutoKg": 4
    }
  ]
}
```

A resposta contém `status: PENDENTE`, a pesagem da sobra preenchida, `RESTO_PRATO: null` e `totalKg: 3`. Criar um serviço sem pesagens, com `pesagens: []`, é uma possibilidade proposta para iniciar o registro, não uma decisão já aprovada.

Para confirmar a segunda categoria, o app envia no PUT as duas leituras confirmadas. Para corrigir uma categoria, altera o valor correspondente e preserva a outra no mesmo corpo. PUT substitui o conjunto completo: categorias ausentes ficam pendentes. Essa semântica precisa ser revisada e deve estar clara no adaptador do front.

A API consulta as lixeiras e recalcula os pesos no POST/PUT. Não confiar em categoria, tara, peso líquido ou total enviados pelo cliente. Confirmar zero descarte significa enviar peso bruto igual à tara, e não omitir a categoria.

Não aceitar mais de uma leitura da mesma categoria no mesmo corpo. Se uma entrada for inválida, rejeitar a operação inteira, sem gravar parcialmente. São propostas de consistência para revisão.

Exclusão aprovada por Lucas: pedir confirmação na tela e remover o serviço e suas pesagens, sem lixeira de recuperação. Não incluir exclusão lógica, restauração ou auditoria no MVP. A relação entre as tabelas e a estratégia de exclusão ficam a cargo do colega.

### Prévia de uma leitura, operação aprovada por Lucas

O simulador produz uma leitura sem informar a categoria ou o peso calculado:

```json
{
  "codigoRfid": "RFID-SIM-001",
  "pesoBrutoKg": 4
}
```

O app encaminha a leitura para avaliação e recebe:

```json
{
  "lixeiraId": 1,
  "codigoRfid": "RFID-SIM-001",
  "categoria": "SOBRA_DESCARTADA",
  "taraKg": 1,
  "pesoBrutoKg": 4,
  "pesoLiquidoKg": 3
}
```

A prévia não altera o serviço. O app só envia POST ou PUT do serviço quando o funcionário confirmar. Não criar banco de eventos, fila, WebSocket, polling ou serviço adicional de conexão nesta proposta. O acionamento da leitura poderá fornecer o mesmo objeto ao adaptador do app; o detalhe do transporte permanece para revisão conjunta.

## Erros mínimos propostos

Resposta comum:

```json
{
  "codigo": "RFID_DESCONHECIDO",
  "mensagem": "Lixeira não reconhecida."
}
```

| HTTP | Código | Situação |
| --- | --- | --- |
| 400 | DADOS_INVALIDOS | Campos obrigatórios ausentes, data inválida, tipos de dados incorretos ou categorias repetidas |
| 400 | RFID_DESCONHECIDO | Código sem lixeira cadastrada |
| 400 | PESO_INVALIDO | Peso bruto negativo ou menor que a tara |
| 401 | NAO_AUTORIZADO | Login inválido ou acesso sem autenticação válida |
| 404 | SERVICO_NAO_ENCONTRADO | Detalhar, atualizar ou excluir ID inexistente |
| 409 | SERVICO_JA_EXISTE | Tentativa de criar ou alterar um serviço para data e tipo de refeição já usados por outro registro |
| 500 | ERRO_INTERNO | Falha inesperada; mensagem genérica sem detalhes internos |

O app mostra a mensagem e mantém os dados em edição quando a gravação falhar. Não informar que salvou sem resposta bem-sucedida. Sem criar rotina de falhas físicas ou infraestrutura para testar todas as possibilidades de rede.

## Cenários propostos para compartilhar entre as partes

| Cenário | Entrada ou estado | Resultado |
| --- | --- | --- |
| Sobra válida | RFID-SIM-001, bruto 4 kg | Sobra, tara 1 kg, líquido 3 kg |
| Restos válidos | RFID-SIM-002, bruto 3.5 kg | Restos, tara 1.5 kg, líquido 2 kg |
| Zero confirmado | RFID-SIM-002, bruto 1.5 kg | Restos com líquido 0 kg, categoria confirmada |
| Etiqueta desconhecida | RFID-SIM-999, bruto 4 kg | Erro, sem gravação |
| Peso abaixo da tara | RFID-SIM-001, bruto 0.5 kg | Erro, sem gravação |
| Serviço completo | Sobra 3 kg e restos 2 kg confirmados | Total 5 kg |
| Correção | Restos passam para bruto 4 kg | Restos 2.5 kg e total 5.5 kg, sem duplicação |
| Serviço pendente | Apenas sobra 3 kg confirmada | Restos aguardando pesagem, total parcial 3 kg |

Esses exemplos apoiam os futuros mocks e testes; não substituem o plano acadêmico com cenário, entrada, saída esperada, status e evidências.

## Revisão antes de criar tickets prontos

1. Prévia adicional aprovada por Lucas; revisar com o colega as rotas e os formatos propostos.
2. Revisar os dados e regras propostos, especialmente total parcial e PUT completo. Unicidade de serviço e exclusão com suas pesagens após confirmação foram aprovadas por Lucas.
3. O colega revisar o contrato e propor linguagem, banco e estrutura interna.
4. React Native confirmado por Lucas em 14/11 como conteúdo até a fase 4; confirmar as tecnologias de backend/banco propostas pelo colega.
5. Tickets locais criados após aceitação da divisão. App com respostas simuladas e simulador independente podem avançar com este contrato provisório; revisão conjunta continua necessária para integrar. Não tratar rotas e formatos como aprovados pelo colega.

## Comentários

### 12/11/2026

Criada proposta de contrato e cenários compartilhados após Lucas concordar em definir essa base antes dos tickets. Sete rotas propostas: seis operações já aceitas como ponto de partida e uma prévia adicional ainda não aprovada. Sem código ou tickets de implementação.

Lucas aprovou a operação adicional de prévia, com identificação, cálculo e validação antes da confirmação, sem gravação. Permanecem propostas as rotas exatas, os formatos e as demais regras adicionais apontadas no documento.

Lucas aprovou um único serviço por data e tipo de refeição. Novas confirmações e correções devem usar o serviço existente, sem duplicá-lo. O status HTTP 409 é proposta técnica para representar o conflito.

Lucas aprovou excluir o serviço e suas pesagens após confirmação na tela, sem recuperação.

### 14/11/2026

Lucas informou aceitação da divisão pelo colega, que ainda não revisou este documento. Usar estes exemplos como base provisória para o front com respostas simuladas, isolando o acesso aos dados para futura adaptação. A aprovação do colega é necessária antes de assumir compatibilidade com a API real, não para preparar a demonstração independente.
