---
titulo: "Opus 5: cinco ajustes que fazem a cota durar o dia inteiro"
autor: "@99hud"
url: https://www.instagram.com/p/DbL90hoCdlr/
tipo: carrossel
temas: [ia-automacao, gestao]
tags: [claude, opus-5, custo, token, cache, subagente, effort, thinking]
slides: 8
data_post: 2026-07-24
processado_em: 2026-07-30
status: parcial
---

## Resumo

Carrossel sobre custo de operação do Claude Opus 5. A tese: o que estoura a cota não é o
modelo, é o fluxo de trabalho herdado do modelo antigo — esforço no talo, andaime de
verificação, subagente para tudo.

Preço citado: US$ 5 na entrada e US$ 25 na saída por milhão de tokens — metade do Fable 5 e
a mesma conta do 4.8, com 1M de contexto e 128K de saída. O post separa cinco ajustes que
cortam o consumo sem perder qualidade.

Só vale para quem roda agente, código e sessão longa — quem faz uma pergunta curta por vez
não sente diferença.

> **Status parcial:** o texto dos 8 slides não foi lido; a legenda traz os cinco ajustes
> nomeados. Contact sheet em `Biblioteca Instagram/sheets/DbL90hoCdlr-slides.jpg`.

## Pontos-chave

- Preço do Opus 5: US$ 5 entrada / US$ 25 saída por milhão de tokens. Metade do Fable 5,
  mesma conta do 4.8. Contexto de 1M, saída de 128K.
- O que queima cota é o workflow trazido do modelo antigo, não o modelo.
- Os três vícios citados: effort no talo, andaime de verificação, subagente para tudo.
- **Ajuste 1 — effort low/medium** rendem forte no Opus 5 e cortam o token caro.
- **Ajuste 2 — thinking** vem ligado por padrão e divide o `max_tokens` com a resposta.
- **Ajuste 3 — subagentes:** pôr teto e apagar a instrução de verificar; ele já se verifica.
- **Ajuste 4 — cache:** o mínimo caiu para 512 tokens; leitura de cache sai por 10% do
  preço de entrada.
- **Ajuste 5 — concisão:** effort não encurta texto; instrução encurta.
- Recorte de público: vale para quem roda agente, código e sessão longa.

## Conteúdo integral

### Slides

[não transcrito — contact sheet dos slides já gerado]

### Legenda

O Opus 5 saiu e já dá pra rodar o dia inteiro — o que estoura a cota não é o modelo.

Ele custa 5 dólares na entrada e 25 na saída por milhão: metade do Fable 5 e a mesma conta do 4.8, com 1M de contexto e 128K de saída. Quem queima token é o workflow que você trouxe do modelo antigo.

Sem effort no talo. Sem andaime de verificação. Sem subagente pra tudo.

Se teu fluxo é uma pergunta curta por vez, isso aqui muda pouco — vale pra quem roda agente, código e sessão longa.

Separei os 5 ajustes que deixam ele rodar o dia inteiro aqui:

1️⃣ effort low/medium — rendem forte no Opus 5 e cortam o token caro
2️⃣ thinking — vem ligado por padrão e divide o max_tokens com a resposta
3️⃣ subagentes — põe teto e apagar a instrução de verificar, ele já se verifica
4️⃣ cache — mínimo caiu pra 512 tokens; leitura sai por 10% do preço de entrada
5️⃣ concisão — effort não encurta texto, instrução encurta

## Aplicação

**Aplica-se direto a esta operação**, que é exatamente o caso descrito: sessões longas,
agentes rodando (`fotos-kenlo`, `atualizar-canalpro`, `verificar-imoveis-kenlo`) e tarefas
em lote como esta extração da biblioteca.

- **Effort baixo nas tarefas mecânicas.** Extração de fotos do Kenlo, montagem de markdown
  de imóvel, giro de anúncios no Canal Pro, download e transcrição de lote. Combina com o
  post do @thaleslaray: papel auxiliar fixado em modelo mais barato **e** effort baixo.
- **Teto em subagente.** Já há histórico de agente entrando em loop e delegando para outro
  agente sem produzir arquivo. Teto de subagente é remédio duplo: corta token e corta o
  loop.
- **Cache com mínimo de 512 tokens** favorece exatamente o padrão daqui — o `CLAUDE.md` do
  projeto, as regras da casa e o descritor do avatar são contexto estável e repetido.
- **Concisão por instrução.** O plugin caveman já está ativo e cumpre esse papel no
  diálogo. O post lembra que o texto longo não some por baixar o effort — tem que ser
  pedido.

**Ressalva importante:** os números de preço e limites são de 24/07/2026 e mudam. Antes de
tomar decisão com base neles, conferir na documentação oficial da Anthropic — não em
carrossel de Instagram.

## Conexões

- [thaleslaray-cortar-custos-claude-modelo-hibrido.md](thaleslaray-cortar-custos-claude-modelo-hibrido.md) — a outra metade: qual modelo faz o quê.
- [manualdedonos-6-sacadas-claude-code.md](manualdedonos-6-sacadas-claude-code.md) — a sacada 6 (rodar vários em paralelo) é justamente o que este post manda limitar.
- [nicksoncarvalho-6-skills-claude.md](nicksoncarvalho-6-skills-claude.md) — skills reduzem repetição, e repetição é token.
