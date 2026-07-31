# Biblioteca — Portfólio Negócios

Base de conhecimento construída a partir dos posts salvos na coleção **Portfólio Negócios**
do Instagram. Cada post vira um arquivo em `posts/`, com resumo para consulta rápida e
o conteúdo integral para leitura completa.

Serve a dois propósitos:

1. **Consulta** — encontrar rápido o que já foi salvo, por tema ou por busca de texto.
2. **Inteligência** — material de referência para as próximas tarefas (criativos,
   campanhas, copy, captação). O que estiver aqui é contexto disponível para reuso.

> Esta pasta fica na raiz do repositório, **fora** de `src/`. O Astro só publica
> `src/pages/` e `public/`, então nada daqui vai para o ar em portfolionegocios.com.br.

**Para usar isto numa tarefa (anúncio, roteiro, copy, captação) ou para retomar a
extração, ver [COMO-USAR.md](COMO-USAR.md).**

---

## Como o conteúdo entra

O Instagram não expõe os Salvos numa API pública e bloqueia leitura sem login. Mas na
sessão local, com o Chrome logado, a API interna do próprio site responde — e é por ela
que a coleção foi lida, sem print manual e sem download do pacote "Baixar suas
informações".

O caminho está descrito em `INSTRUCOES-EXTRACAO.md` e implementado em `ferramentas/`.
Resumo:

### 1. Inventário da coleção

Pelo Chrome logado, `GET /api/v1/collections/list/` devolve as coleções e o id da
**Portfólio Negócios**. `GET /api/v1/feed/collection/<id>/posts/` pagina a coleção
inteira (cursor em `next_max_id`).

Dois cuidados aprendidos na prática:
- **O feed devolve duplicatas.** Deduplicar por `code` — o número bruto de itens é quase
  o dobro do número de posts reais.
- **O Instagram limita a taxa.** Aparece `HTTP 572` depois de algumas dezenas de páginas.
  O laço precisa guardar o cursor e ter backoff, senão perde tudo e recomeça do zero.

### 2. Ponte para o disco

O `javascript_tool` não devolve strings com query string, o Instagram tem CSP que bloqueia
`fetch` para `localhost`, e o Chrome bloqueia downloads automáticos repetidos. A saída que
funciona: `ferramentas/recebedor.py` sobe um servidor local que serve uma página-ponte;
a aba do Instagram abre essa ponte num popup (com clique real, para valer como gesto do
usuário) e manda os dados por `postMessage`. A ponte faz `POST` e grava no disco.

### 3. Mídia e transcrição

| Tipo | Como é capturado |
|---|---|
| Legenda | Vem no próprio inventário, íntegra |
| Carrossel | Baixa os slides e monta contact sheet 3x3 (`processar_lote.py`), lido em bloco |
| Reels / vídeo | Baixa o `.mp4`, transcreve com `mlx-whisper` local (large-v3-turbo-q4) |
| Vídeo sem fala | Frames a cada 3s viram contact sheet, para ler o texto na tela |

A mídia é apagada logo após o processamento — só ficam o texto e as transcrições.

### 4. Processamento

Cada post recebe um arquivo em `posts/`, nomeado `<autor>-<assunto-curto>.md`,
seguindo `_TEMPLATE.md`. Depois `INDICE.md` é atualizado.

---

## Estrutura de cada arquivo

```
posts/perfil-assunto.md
```

Frontmatter com metadados (autor, URL, tipo, temas, status) e o corpo em quatro blocos:

- **Resumo** — o que é, em poucas linhas. É o que se lê na varredura rápida.
- **Pontos-chave** — o miolo em tópicos, para bater o olho.
- **Conteúdo integral** — tudo que foi dito ou escrito. É a íntegra, sem corte.
- **Aplicação** — como isso se conecta ao trabalho: imóveis de alto padrão em
  Uberlândia, Meta Ads, criativos, captação.

O campo `status` marca o estado: `completo` (íntegra capturada), `parcial`
(faltou parte — ex.: vídeo sem transcrição) ou `pendente` (só o link, sem conteúdo).

---

## Temas

Taxonomia inicial, ajustável conforme o material real chegar:

| Tema | Cobre |
|---|---|
| `trafego-pago` | Meta Ads, estrutura de campanha, orçamento, públicos, métricas |
| `copywriting` | Headlines, textos de anúncio, ofertas, CTAs |
| `criativos` | Formatos, edição, design, o que performa visualmente |
| `captacao` | Prospecção e captação de imóveis, relação com proprietários |
| `vendas` | Atendimento, negociação, objeções, fechamento |
| `conteudo-organico` | Instagram orgânico, Reels, alcance, frequência |
| `posicionamento` | Marca pessoal, autoridade, diferenciação |
| `mercado-imobiliario` | Dados de mercado, tendências, precificação |
| `gestao` | Processos, produtividade, ferramentas, rotina |
| `ia-automacao` | IA aplicada, automações, prompts |
| `mentalidade` | Disciplina, hábitos, recomeço, desenvolvimento pessoal |

Um post pode ter mais de um tema. Temas novos entram nesta tabela quando aparecerem.

---

## Busca

```sh
# por tema
grep -rl "trafego-pago" biblioteca/posts/

# por termo em qualquer lugar
grep -ri "criativo" biblioteca/posts/

# o que ainda está incompleto
grep -rl "status: parcial\|status: pendente" biblioteca/posts/
```
