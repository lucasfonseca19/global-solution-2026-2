# Desenvolvimento do app mobile

## Decisões aprovadas em 14/11/2026

- React Native com Expo e suporte web para facilitar execução local e teste pelo avaliador.
- Manter capacidade mobile e verificar o fluxo também no celular; executar no navegador não comprova sozinho o requisito mobile.
- Sem publicação em loja, hospedagem, instalação PWA ou funcionamento offline como entregas adicionais.
- README deverá documentar pré-requisitos e passos reais para rodar. Não apresentar comandos como verificados antes de existir implementação.

## Skill solicitada por Lucas

Usar [vercel-react-native-skills](https://www.skills.sh/vercel-labs/agent-skills/vercel-react-native-skills) durante o desenvolvimento e a revisão do app. Ela complementa o planejamento; não substitui a definição do fluxo nem a divisão em tickets.

Fonte: [vercel-labs/agent-skills, skills/react-native-skills](https://github.com/vercel-labs/agent-skills/tree/1a2c79d4e6c4a2283dc2c614b6538cbe1ed5ca62/skills/react-native-skills). Versão declarada: 1.0.0. Instalado no ambiente de Lucas em `/Users/lucas/.codex/skills/vercel-react-native-skills`, a partir do commit acima.

Para outro integrante configurar seu próprio agente, consultar a página da skill. O comando de instalação indicado na fonte é:

```sh
npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-native-skills
```

A instalação local de Lucas não é automaticamente compartilhada com os agentes dos outros integrantes.

## Aplicação proporcional ao MVP

Ler o `SKILL.md` e as regras relacionadas à mudança antes de implementar. Usar as orientações pertinentes de componentes, estado, navegação, renderização e interface; verificar compatibilidade das escolhas com mobile e web.

As regras não autorizam ampliar o produto, instalar bibliotecas sem necessidade ou acrescentar animações, galeria de imagens, infraestrutura de monorepo ou otimizações para listas grandes que não existam neste MVP. Quando uma orientação não se aplicar ao nosso recorte, registrar a razão relevante na decisão ou revisão.

## Antes de código

Ainda faltam as decisões descritas em [app-planning.md](../../.scratch/merenda/app-planning.md): interação das telas, persistência dos dados simulados e como verificar o comportamento. Consolidar a especificação e revisar a divisão em entregas pequenas antes de implementar. A instalação da skill não altera o status pendente do escopo geral do app.
