---
titulo: "24 coisas pra instalar no Claude: skills, plug-ins e MCP servers"
autor: "@rtercas"
url: https://www.instagram.com/p/DaT_EjoDsex/
tipo: carrossel
temas: [ia-automacao, gestao]
tags: [claude, skills, plugins, mcp, ferramentas, produtividade]
slides: 9
data_post: 2026-07-03
processado_em: 2026-07-30
status: completo
---

## Resumo

Carrossel-catálogo com 24 extensões para o Claude, separadas em três camadas: skills
(atalhos que rodam um workflow inteiro com um comando), plug-ins (um bundle de
ferramentas relacionadas num install) e MCP servers (conectores que ligam o Claude aos
apps reais — Notion, Slack, Zapier). Traz também as três primeiras recomendações para
quem está começando e onde instalar cada tipo.

É referência prática de ferramentas, não de método. Boa parte do que ele lista já está
instalada no ambiente do Marcus.

## Pontos-chave

- Três camadas que quase ninguém configura: **skills** (atalhos), **plug-ins** (times de
  ferramentas), **MCP servers** (conectores para apps reais).
- Sugestão de início: `marketingskills` (plug-in), `frontend-design` (skill), `notion` (MCP).
- Instalação: skills em Configurações > Capacidades > Skills, ou pasta no Claude Code;
  plug-ins via `/plugin marketplace add <repo>`; MCP em Configurações > Conectores ou no
  `.mcp.json`.
- O autor é da área jurídica — há um bloco bônus de uso jurídico.

## Conteúdo integral

### Slides

**Slide 1** — **24 coisas pra instalar no claude**
*pros power-users* — 8 skills · 8 plug-ins · 8 MCP servers
*salva agora, instala depois*

**Slide 2** — **o básico**
- **Plug-in** = um time inteiro num install. Um comando adiciona um bundle de ferramentas relacionadas (um time de dev ou marketing).
- **Skill** = um atalho. Um comando curto roda um workflow inteiro que você digitaria toda vez.
- **MCP server** = um conector. Pluga o Claude nos seus apps reais (Notion, Slack) pra ele ler e fazer coisas por você, ao vivo.

**Slide 3** — **Comece aqui**
1. **marketingskills** (plug-in) — *Seu kit de growth inteiro num install*
2. **frontend-design** (skill) — *Deixa bonito, na hora, tudo que o Claude cria*
3. **notion** (MCP) — *Pro Claude rodar seu workspace, não só conversar*

**Slide 4** — **skills**
1. **frontend-design:** mata o visual genérico de IA, o conserta-gosto
2. **humanizer:** tira os 'tells' robóticos da escrita de IA
3. **ai-second-brain:** vira seu histórico de IA num wiki pessoal
4. **notebooklm-skill:** o Claude busca nas suas notas e pesquisas
5. **claude-seo:** conteúdo achado e citado por IA, não só Google
6. **hyperframes:** escreve HTML, renderiza vídeo, feito pra agentes
7. **doc skills:** pacote oficial: Word, PDF, Excel e PowerPoint
8. **caveman:** respostas curtas pra economizar token

**Slide 5** — **plug-ins**
1. **marketingskills:** 44 skills de marketing e growth num repo só
2. **social-media-skills:** posts, threads, carrosséis e captions
3. **gstack:** 20+ ferramentas, um time de dev num comando
4. **superpowers:** método de dev completo com skills componíveis
5. **codex:** roda o Codex da OpenAI dentro do Claude Code
6. **financial-services:** investment banking e equity research
7. **claude-for-legal:** workflows jurídicos pra toda área
8. **claude-skills:** pacote enorme da comunidade, um install

**Slide 6** — **MCP servers**
1. **notion:** lê e escreve seus bancos e docs
2. **slack:** lê o histórico do canal, posta updates
3. **granola:** joga suas notas de reunião no Claude
4. **zapier:** um fio pra milhares de apps e ações
5. **perplexity:** busca web ao vivo dentro do Claude
6. **context7:** docs atualizados pro código nunca ficar velho
7. **higgsfield:** 30+ modelos de imagem e vídeo num conector
8. **agent-browser:** o Claude clica num site real por você

**Slide 7** — **bônus jurídico**
1. **claude-for-legal:** revisão de contratos, NDA e compliance
2. **pdf + docx:** lê autos em PDF e entrega minutas em Word
3. **skill-creator:** seus prompts estruturados viram skills
4. **notebooklm-skill:** pesquisa na sua base de modelos e teses

*a IA trabalha, você julga*

**Slide 8** — **como instalar**
- **Skills:** No app do Claude: Configurações > Capacidades > Skills — ou cole a pasta da skill no Claude Code.
- **Plug-ins:** No Claude Code, um comando resolve: `/plugin marketplace add <repo>`
- **MCP servers:** Em Configurações > Conectores no app — ou no arquivo .mcp.json do Claude Code.

**Slide 9** — *salva agora, instala depois* — @rtercas — IA aplicada ao Direito e à produtividade — *compartilha com quem vive no Claude*

### Legenda

24 coisas pra instalar no Claude (e virar power-user de verdade)

Todo mundo usa o Claude pra conversar. Poucos usam ele pra trabalhar.

A diferença está em três camadas que quase ninguém configura:

🔸Skills — atalhos. Um comando curto roda um workflow inteiro que você digitaria toda vez.
🔸Plug-ins — um time inteiro num install. Um comando adiciona um bundle de ferramentas relacionadas.
🔸 MCP servers — conectores. Plugam o Claude nos seus apps reais (Notion, Slack) pra ele ler e agir por você, ao vivo.

Salva agora, instala depois.

E me conta nos comentários: qual dessas 24 você já usa e qual vai testar primeiro?

#Claude #Anthropic #InteligenciaArtificial #IA #Produtividade MCP ClaudeAI IAaplicada IAnoDireito Automacao PromptEngineering Tecnologia DireitoeTecnologia

## Aplicação

Checagem contra o ambiente que o Marcus já roda:

**Já instalado:** `marketingskills` (as 48 skills de marketing do coreyhaines31),
`humanizer`, `caveman`, `agent-browser`, skills de design frontend, e MCP de Canva,
Figma, Supermetrics, Meta Ads, Kairogen.

**Candidatos com aplicação real aqui:**
- **`ai-second-brain`** — vira o histórico de IA num wiki. Conversa direto com o Portfolio
  Vault do Obsidian e com esta biblioteca.
- **`notebooklm-skill`** — busca nas próprias notas. Seria a camada de consulta desta
  biblioteca de posts salvos.
- **`social-media-skills`** — carrosséis e captions; hoje isso é feito com skills soltas.
- **`skill-creator`** — já disponível; os prompts recorrentes (anúncio Meta, ficha de
  imóvel) merecem virar skill formal.
- **`notion` MCP** — só faz sentido se houver Notion na operação; hoje o vault é Obsidian.

**Sem aplicação:** o bloco jurídico, `financial-services`, `codex`, `context7`.

## Conexões

- [manualdedonos-6-sacadas-claude-code.md](manualdedonos-6-sacadas-claude-code.md) — mesma família de conteúdo: o que instalar (aqui) x como operar (lá).
- [thaleslaray-cortar-custos-claude-modelo-hibrido.md](thaleslaray-cortar-custos-claude-modelo-hibrido.md) — completa a trinca: ferramentas, método e custo.
