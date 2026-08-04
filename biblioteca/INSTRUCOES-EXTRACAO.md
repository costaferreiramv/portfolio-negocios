# Instruções de extração — para a sessão local

> **Este arquivo é para a sessão do Claude Code que roda na máquina do Marcus**,
> onde existe MCP de navegador conectado ao Chrome com sessão ativa no Instagram.
>
> A sessão remota (Claude Code na web) montou a estrutura desta biblioteca mas
> **não tem acesso ao navegador logado** — o contêiner remoto não alcança o perfil
> do Chrome local. A extração precisa acontecer na sessão local.

## Objetivo

Ler todos os posts salvos na coleção **Portfólio Negócios** dos Salvos do Instagram
e transformar cada um num arquivo em `biblioteca/posts/`, seguindo `_TEMPLATE.md`.

## Passo a passo

### 1. Abrir a coleção

Navegar até os Salvos e abrir a aba **Portfólio Negócios**:

```
https://www.instagram.com/<perfil>/saved/
```

A coleção aparece como um card. Abrindo, lista-se a grade de posts salvos.

### 2. Levantar o inventário antes de processar

Rolar a coleção até o fim **antes** de começar a extrair, e registrar a lista
completa de URLs em `biblioteca/INDICE.md`, na seção "Pendências".

Isso importa: a grade do Instagram carrega por scroll infinito. Sem varrer até o
fim primeiro, é fácil processar só os primeiros e achar que acabou. Registrar o
total permite saber quanto falta.

### 3. Extrair post a post

Para cada post, capturar **o conteúdo integral** — não só o suficiente para o resumo:

| Tipo | O que capturar |
|---|---|
| Carrossel | Texto de **todos** os slides, na ordem. Navegar por cada um. |
| Imagem única | Texto na imagem + descrição do visual |
| Reels / vídeo | Fala completa + texto na tela. Ativar legendas se disponível. |
| Qualquer um | Legenda completa, autor (@), URL, data |

Sobre vídeo: se a transcrição não vier pela interface, baixar o arquivo e
transcrever localmente. O que não for possível capturar deve ser marcado
`[inaudível]` ou `[não capturado]` — **nunca preencher com suposição**. Uma
biblioteca de consulta com conteúdo inventado é pior que uma biblioteca incompleta.

### 4. Gravar o arquivo

Um arquivo por post em `biblioteca/posts/`, nomeado `<autor>-<assunto-curto>.md`,
seguindo `_TEMPLATE.md`. Preencher o frontmatter inteiro e as cinco seções.

O campo `status`:
- `completo` — íntegra capturada
- `parcial` — faltou parte (dizer o que faltou no corpo)
- `pendente` — só o link, sem conteúdo ainda

### 5. Atualizar o índice

Ao fim de cada lote, atualizar `INDICE.md`: contagem, listagem por tema, por autor,
e remover das pendências o que foi processado.

## Temas

Taxonomia em `README.md`. Um post pode ter mais de um. Se algo não couber em
nenhum tema existente, criar tema novo e registrar na tabela do `README.md` —
não forçar num tema que não descreve o conteúdo.

## Ritmo

Processar em lotes e commitar a cada lote, em vez de acumular tudo para um commit
único. Se a sessão cair no meio, o que já foi extraído está salvo e o `INDICE.md`
mostra exatamente de onde retomar.
