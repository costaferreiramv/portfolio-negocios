# Como usar a Biblioteca dos Salvos

1267 posts salvos do Instagram, extraídos em `posts/*.md` (um arquivo por
post: frontmatter com metadados + legenda integral + transcrição de vídeo quando
existe + seção "Aplicação no negócio"). 22 já têm a aplicação escrita;
o resto tem `analisado: false` e a seção diz "_Não analisado ainda._" — é matéria-prima
bruta, ainda sem curadoria.

Fonte bruta (não versionada, fora do repo público):
`~/Desktop/Arquivos para Claude/Biblioteca Instagram/` — `inventario.jsonl` (metadados +
legenda de cada post) e `txt/{code}.txt` (transcrição, quando o post é vídeo).

Script de geração: `scripts/gerar_biblioteca.md` descreve a receita (ou ver a versão
Python que gerou esta pasta, mantida em sessão — mecânica, sem invenção: legenda e
transcrição são cópia literal, tema é heurística por palavra-chave).

## Buscar por tema antes de criar peça

```sh
grep -l "temas:.*trafego-pago" portfolio-negocios/biblioteca/posts/*.md
grep -l "temas:.*gancho" portfolio-negocios/biblioteca/posts/*.md
grep -l "temas:.*criativos" portfolio-negocios/biblioteca/posts/*.md
```

Lista completa de temas e quantos posts cada um tem: `INDICE.md`.

## Buscar só nos já analisados (aplicação no negócio pronta)

```sh
grep -l "analisado: true" portfolio-negocios/biblioteca/posts/*.md
```

## Retomar a extração (analisar mais posts)

1. Escolher um lote de posts com `analisado: false` num tema relevante pro que está
   sendo criado agora (`grep -l "temas:.*<tema>" posts/*.md | xargs grep -L "analisado: true"`).
2. Ler legenda + transcrição de cada um.
3. Escrever a seção "Aplicação no negócio" no próprio arquivo: o que o post ensina, e
   a tradução disso pra regra do Portfólio Negócios (com o post de origem, pra poder
   conferir) — mesmo padrão dos 22 já feitos.
4. Trocar `analisado: false` para `analisado: true` no frontmatter.
5. Se a lição for recorrente e valer a pena virar regra permanente, ela sobe pra
   `references/biblioteca-salvos.md` da skill correspondente (`gancho-psicologico` pra
   abertura, `anuncios-meta-andromeda` pro kit inteiro) — citando o post de origem.

## O que a coleção mostra que NÃO se copia (padrão recorrente nos salvos)

- Engagement bait ("comente PALAVRA que eu te mando no direct") — é o formato
  dominante porque é isca de infoproduto. Penalizado em anúncio pago.
- Prova social sem fonte ("R$ 400 milhões em VGV", "1 milhão de visualizações").
- Urgência inventada ("operação fecha mês").
- Financiamento como argumento normal de venda — proibição absoluta no Portfólio
  Negócios, sem exceção.
- Promessa de leads baratos / valorização futura sem fato verificável.

Ver `SKILL.md` de `anuncios-meta-andromeda` para o compliance completo.
