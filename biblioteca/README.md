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

---

## Como o conteúdo entra

O Instagram não expõe os Salvos por API, e bloqueia leitura sem login (HTTP 403).
Nenhuma automação alcança a coleção — o material precisa ser entregue manualmente.

### 1. Índice da coleção (opcional, mas recomendado)

Instagram → Configurações → Central de Contas → Suas informações e permissões →
**Baixar suas informações**. O pacote inclui os posts salvos com **link e nome da
coleção**, o que dá a lista completa e ordenada da aba Portfólio Negócios.

Serve para garantir cobertura: sabemos quantos posts existem e quais ainda faltam
processar. Sem ele, trabalhamos no escuro quanto ao total.

### 2. Conteúdo de cada post

| Tipo | O que enviar | Resultado |
|---|---|---|
| Carrossel | Prints de todas as telas | Texto de cada slide, na ordem |
| Imagem única | Print | Texto e descrição do visual |
| Legenda longa | Copiar e colar | Íntegra preservada |
| Reels / vídeo | Arquivo `.mp4` baixado | Transcrição da fala + leitura do que aparece na tela |

Pode vir pelo chat ou por uma pasta no Google Drive (o conector está ativo) — o que
for mais prático para o volume.

### 3. Processamento

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
