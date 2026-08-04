---
titulo: "Modelo caro planeja, modelo barato executa: como cortar 54% do custo de IA"
autor: "@thaleslaray"
url: https://www.instagram.com/p/Dav3X6bEi8Z/
tipo: carrossel
temas: [ia-automacao, gestao]
tags: [claude, custo, orquestracao, subagente, claude-code, benchmark]
slides: 8
data_post: 2026-07-13
processado_em: 2026-07-30
status: completo
---

## Resumo

Carrossel sobre arranjo híbrido de modelos: deixar o modelo mais caro (Fable 5) só
planejando e delegar a execução a modelos mais baratos (Sonnet 5). O número central: no
teste citado, o híbrido marcou 86,8% contra 90,8% do modelo topo, custando US$ 18,53
contra US$ 40,56 por problema — cerca de 96% da performance por 46% do preço. Só Sonnet
sairia a US$ 16,01 mas cairia para 77,8%.

Apresenta dois padrões de orquestração (líder que distribui; executor que consulta o
modelo caro quando trava) e mostra como fixar papéis auxiliares por modelo no Claude
Code. O fecho é venda de uma imersão de 2 dias.

## Pontos-chave

- Rodar o modelo mais potente em toda tarefa é caro e desnecessário.
- **Padrão 1 — orquestrador:** o modelo caro planeja e distribui (fan out) para vários
  workers baratos, que rodam em loop próprio.
- **Padrão 2 — executor + conselheiro:** o modelo barato faz cada rodada e só chama o
  caro quando precisa de orientação (tipicamente uma vez por tarefa).
- Números do benchmark BrowseComp citado: Fable 5 lead + Sonnet 5 workers = 86,8% a
  US$ 18,53; todo Sonnet 5 = 77,8% a US$ 16,01; todo Fable 5 = 90,8% a US$ 40,56.
- No padrão 2, cada auxiliar mantém o próprio cache — chamadas repetidas não pagam preço
  cheio pelo mesmo contexto duas vezes. Resultado citado: 92% da nota por 63% do preço.
- No Claude Code: criar pequenos papéis auxiliares e fixar cada um num modelo mais barato,
  via arquivo com `name`, `description`, `model: sonnet`, `effort: low`.
- Um arquivo curto de instruções diz ao modelo principal o que repassar aos auxiliares.
- Tarefas simples também podem rodar em nível de esforço mais leve, cortando mais custo.

## Conteúdo integral

### Slides

**Slide 1** — A Anthropic acabou de revelar **como cortar os custos do Claude** em 54% mantendo 96% da performance do Fable 5.
Deixe o Fable 5 planejar enquanto modelos mais baratos executam. 👉

**Slide 2** — Ontem a Anthropic anunciou que vai estender o acesso ao Fable 5 em todos os planos pagos até 19 de julho, com os limites semanais do Claude Code 50% maiores. Então este é o melhor momento pra aproveitar essas estruturas.
*(print do post @claudeai: "Estamos estendendo o acesso ao Claude Fable 5 em todos os planos pagos, além de manter os limites de taxa semanais do Claude Code 50% mais altos, até 19 de julho.")*

**Slide 3** — Rodar o modelo mais potente em toda tarefa é caro. Por isso a Anthropic mostrou um arranjo em que o Fable 5 só planeja o trabalho, enquanto modelos mais baratos fazem a construção de fato.
Como os modelos baratos fazem a maior parte do trabalho, a maior parte do custo é cobrada na tarifa mais baixa deles.
*(diagrama: Orchestrator (Fable 5, Plan) — fan out → Worker 1 / Worker 2 / Worker 3 (Sonnet 5), cada um com worker loop)*

**Slide 4** — No próprio teste da Anthropic, o arranjo marcou 86,8% contra os 90,8% do modelo topo. Uma queda pequena pra uma economia grande.
Usar só Sonnet sai mais barato ($16,01) mas chega só a 77,8%. O híbrido mantém precisão quase no topo a $18,53 contra $40,56 – ou seja, 96% da performance por 46% do preço.
*(gráfico BrowseComp: Fable 5 lead + Sonnet 5 workers 86,8% · $18,53/problem · All Sonnet 5 77,8% · $16,01/problem · All Fable 5 90,8% · $40,56/problem)*

**Slide 5** — O segundo padrão funciona ao contrário: o modelo mais barato faz cada rodada e só chama o Fable 5 quando precisa de orientação (normalmente uma vez por tarefa).
Numa análise de código esse arranjo alcançou 92% da nota do Fable 5 por 63% do preço, e cada auxiliar mantém o próprio cache, então chamadas repetidas não pagam preço cheio pelo mesmo contexto duas vezes.
*(diagrama: Executor (Sonnet 5, runs every turn) — tool call → Advisor (Fable 5, on-demand) — sends advice)*

**Slide 6** — No Claude Code você cria pequenos papéis auxiliares e fixa cada um em um modelo mais barato, como Sonnet ou Haiku.
Você configura isso só uma vez, e passa a valer em todo projeto da sua máquina.
```
---
name: worker
description: routine edits + lookups
model: sonnet      # cheaper model
effort: low        # lighter thinking
---
You handle routine, fully specified
work and report back briefly.
```

**Slide 7** — Um arquivo breve de instruções diz ao seu modelo principal quais tarefas repassar pra esses auxiliares mais baratos.
Você também pode rodar as tarefas mais simples num nível de esforço mais leve, o que corta o custo um pouco mais.
*(diagrama: Routine reads and edits → Cheaper model · Planning and final review → Main model · "a short instructions file tells the main model what to hand off")*

**Slide 8** — Criar uma estratégia como essa só é possível quando você domina o jogo de verdade e aprende a criar times de IA com o Claude.
Não é ter o modelo mais caro rodando em tudo. É saber quem faz o quê.
E é isso que eu vou te ensinar numa imersão mão na massa de 2 dias.
Em 2 dias você constrói seu primeiro time de IA – do zero até a prática, rodando na sua operação.
Pra participar é só comentar **"TIME"** e retirar seu ingresso no direct 👇

### Legenda

🚨 Anthropic revelou como gastar menos no seu modelo mais caro: Fable 5.

(Leia até o final pra conferir todas as dicas)

Não é ter o modelo mais caro rodando em tudo. É saber quem faz o quê. E é isso que eu vou te ensinar numa imersão mão na massa de 2 dias

Em 2 dias você constrói seu primeiro time de IA – do zero até a prática, rodando na sua operação

Pra participar é só comentar TIME e retirar seu ingresso no direct👇

## Aplicação

Aplicável direto ao custo de operação do Claude Code na rotina do Portfólio Negócios:

- **Onde o modelo barato basta:** extração de fotos e dados do Kenlo, montagem de
  markdown de imóvel, renomear/mover arquivos, varredura quinzenal do Canal Pro, build e
  push. Tudo tarefa mecânica e bem especificada.
- **Onde o modelo caro compensa:** definição de ICP de imóvel, escrita de copy de
  anúncio, decisão de eixo e de capa, planejamento de quinzena de conteúdo.
- **Configuração concreta:** criar um subagente auxiliar com `model: sonnet` e
  `effort: low` para as tarefas mecânicas — o repo já usa agentes (`fotos-kenlo`), então
  é só fixar modelo no frontmatter deles.
- **Cuidado:** os números citados são de benchmark de código (BrowseComp / análise de
  código), não de tarefa de marketing. A economia é plausível, a taxa de acerto de 96%
  não é transferível às cegas.
- **Data:** o post é de 13/07/2026 e cita uma janela promocional até 19/07 — essa parte
  já venceu.

## Conexões

- [manualdedonos-6-sacadas-claude-code.md](manualdedonos-6-sacadas-claude-code.md) — a sacada 6 (rodar vários Claudes em paralelo) é o mesmo arranjo, sem a camada de custo.
- [rtercas-24-coisas-instalar-claude.md](rtercas-24-coisas-instalar-claude.md) — catálogo de ferramentas para montar esses times.
