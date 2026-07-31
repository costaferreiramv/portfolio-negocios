---
titulo: "Model Sheet: o mapa do corpo que impede a IA de trocar as proporções do personagem"
autor: "@bruno.ia1"
url: https://www.instagram.com/p/DbDQq9pjWaN/
tipo: carrossel
temas: [ia-automacao, criativos]
tags: [model-sheet, consistencia, avatar, prompt, nano-banana, gpt-image, proporcoes]
slides: 8
data_post: 2026-07-21
processado_em: 2026-07-30
status: parcial
---

## Resumo

Complemento do Character Sheet (que trava o rosto): o **Model Sheet** trava o corpo. O
problema descrito: você acerta o rosto e o outfit, e na imagem seguinte a personagem
aparece com outro corpo, outra altura e proporções diferentes — porque a IA ainda não
entendeu quem é aquela personagem por inteiro.

O Model Sheet é um mapa visual do corpo, mostrando frente, perfis e costas, e preserva
altura, cintura, quadril, pernas, postura e proporções. A legenda traz o prompt pronto
para colar junto com a foto de referência.

> **Status parcial:** o texto dos 8 slides não foi lido e o prompt da legenda está truncado
> pelo próprio Instagram. Contact sheet em
> `Biblioteca Instagram/sheets/DbDQq9pjWaN-slides.jpg`.

## Pontos-chave

- Sintoma: rosto e roupa certos, mas corpo, altura e proporções mudam entre gerações.
- Causa: a IA não tem referência da personagem **por inteiro**, só do rosto.
- **Model Sheet** = mapa visual do corpo: frente, perfis e costas.
- O que ele preserva: altura, cintura, quadril, pernas, postura e proporções.
- Princípio: consistência começa quando o personagem deixa de ser "uma imagem bonita" e
  passa a ter identidade visual completa.
- Resultado prático: trocar roupa, cenário e pose sem perder a personagem.
- Ferramentas citadas para colar o prompt: Nano Banana 2 e GPT Image, junto com a foto de
  referência.

## Conteúdo integral

### Slides

[não transcrito — contact sheet dos slides já gerado]

### Legenda

Você cria uma personagem incrível, acerta o rosto, escolhe o outfit… e na imagem seguinte ela já aparece com outro corpo, outra altura e proporções completamente diferentes.
Isso acontece porque a IA ainda não entendeu quem é aquela personagem por inteiro.
O Model Sheet funciona como um mapa visual do corpo. Ele mostra frente, perfis e costas, ajudando a preservar altura, cintura, quadril, pernas, postura e proporções em novas imagens.
A consistência começa quando o personagem deixa de ser apenas uma imagem bonita e passa a ter uma identidade visual completa.
É assim que você consegue trocar roupas, cenários e poses sem perder a personagem que criou.

PROMPT PARA COPIAR (cole no Nano Banana 2 ou GPT Image junto com a foto de referência do seu personagem):
"Using the attached reference photo, create an ultra realistic full body model sheet of the same woman. Preserve her exact facial stru[…]

> _A legenda está truncada pelo Instagram a partir daqui — o prompt completo não ficou
> disponível no texto do post._

## Aplicação

**Fecha o par com o Character Sheet.** Rosto travado (Character Sheet) + corpo travado
(Model Sheet) + descritor textual = identidade completa do avatar do Marcus.

**O que falta hoje na spec do avatar:** o descritor já garante rosto e traços fixos
(inclusive sempre barbeado). Não há referência de corpo — e é por isso que enquadramento de
corpo inteiro ou meio corpo tende a variar entre gerações.

**Próximo passo, junto com o Character Sheet:**
1. Gerar um Model Sheet do avatar (frente, perfil esquerdo, perfil direito, costas) a partir
   da foto-base aprovada.
2. Salvar junto do spec portável, fora do repo.
3. Usar Character Sheet + Model Sheet como referências fixas em toda geração no Kairogen.

**Atenção ao prompt:** o texto do post é em inglês. Isso não conflita com a regra da casa —
a proibição de palavras em inglês vale para o **criativo publicado**, não para o prompt de
produção. Mas vale conferir se o que aparece na imagem final (placa, letreiro, roupa com
texto) saiu limpo.

**Limite:** o post trata de personagem fictícia; aqui o avatar representa uma pessoa real.
Model Sheet ajuda na consistência, mas não corrige semelhança — a validação continua sendo
comparar com o Marcus de verdade.

## Conexões

- [leoromano-character-sheet-consistencia-ia.md](leoromano-character-sheet-consistencia-ia.md) — a metade que falta: consistência de rosto.
- [thaleslaray-cortar-custos-claude-modelo-hibrido.md](thaleslaray-cortar-custos-claude-modelo-hibrido.md) — geração em escala tem custo; vale planejar antes de gerar em lote.
