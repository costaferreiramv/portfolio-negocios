# Como usar a biblioteca

Dois usos: **consultar** (achar o que já foi salvo) e **alimentar tarefa** (usar o que está
aqui como contexto para criar anúncio, roteiro, copy, argumento de captação).

---

## 1. Consultar

Tudo é texto puro em `posts/*.md`. Não precisa de ferramenta.

```sh
cd ~/Desktop/Arquivos\ para\ Claude/portfolio-negocios
```

```sh
grep -ril "follow-up" biblioteca/posts/ | head -20
```

```sh
grep -l "temas:.*trafego-pago" biblioteca/posts/*.md
```

```sh
grep -rl "status: pendente" biblioteca/posts/ | wc -l
```

`INDICE.md` lista, por tema, só os posts já analisados — é o ponto de partida para leitura
humana. Os `pendente` têm a legenda e a transcrição integrais, então o `grep` acha o
conteúdo deles mesmo antes da análise.

---

## 2. Alimentar uma tarefa em outra sessão

A biblioteca não entra sozinha no contexto. Ela precisa ser **puxada por tema** no começo
da tarefa. O padrão que funciona:

> "Antes de escrever, lê os posts de `biblioteca/posts/` marcados com os temas
> `trafego-pago` e `criativos` e usa o que está na seção **Aplicação** deles."

Ou, mais econômico, apontando os arquivos:

> "Lê `biblioteca/posts/declie-broker-trafego-pago-alto-padrao.md` e
> `biblioteca/posts/camila-marroni-economia-do-pensamento.md` antes de escrever a copy."

### Qual tema puxar para qual tarefa

| Tarefa | Temas a carregar |
|---|---|
| Kit de anúncio Meta (`anuncios-meta-andromeda`) | `trafego-pago`, `criativos`, `copywriting` |
| Roteiro de Reels / conteúdo da quinzena | `conteudo-organico`, `criativos`, `posicionamento` |
| Gancho / headline (`gancho-psicologico`) | `criativos`, `copywriting` |
| Definir ICP de imóvel (`definir-icp-imovel`) | `trafego-pago`, `posicionamento`, `mercado-imobiliario` |
| Script de atendimento, follow-up, WhatsApp | `vendas` |
| Argumento de captação com proprietário | `captacao`, `mercado-imobiliario`, `vendas` |
| Automação, skill nova, prompt | `ia-automacao`, `gestao` |

### O que já está pronto para usar hoje

Os achados dos posts analisados que mudam decisão, e onde estão:

- **Jornada de anúncio no alto padrão** — `ANÚNCIO → CONTEÚDO → AUTORIDADE → RELACIONAMENTO
  → OPORTUNIDADE`; anúncio que parece conteúdo; vender estilo de vida, não ficha técnica.
  → `declie-broker-trafego-pago-alto-padrao.md`
- **Molde de conteúdo de autoridade** — "o que você sente é isso, a causa é aquela, a
  solução é esta, porque é diferente de xyz".
  → `camila-marroni-economia-do-pensamento.md`
- **Régua de follow-up** — lead quente esfria em 48 h; a venda some por ausência, não por
  preço. → `chaiene-luz-lead-que-morre-esperando-retorno.md`
- **Checklist de pré-publicação de vídeo** — 3 s sem som, contar mudanças nos 10 s,
  "alguém enviaria isso?". → `brokersbr-teste-30-segundos-video.md`
- **Distribuição de pauta** — 4 vender / 1 inspirar / 2 viralizar; infotenimento para
  alcance. → `andersonbarbosast-ricardo-martins-marca-pessoal.md`
- **Roteiro de qualificação no primeiro contato** — perguntar antes de mandar imóvel.
  → `marcele-corretora-qualificacao-antes-de-mandar-imovel.md`
- **Dor x visão** — comprador de alto padrão se comunica por visão; proprietário, por
  problema. → `brunamalucelli-luxo-nao-vende-pela-dor.md`
- **Retenção por dualidade** — dois lados da mesma história.
  → `fernandoalvaric-dualidade-retencao-carrossel.md`

### Regras da casa que sobrepõem qualquer post daqui

O material salvo vem de outros mercados e às vezes contraria o que vale aqui. Em conflito,
o que manda é:

- Nunca mencionar financiamento em anúncio.
- Nunca expor nome de edifício ou condomínio.
- Sem palavras em inglês nos criativos, nem decorativas.
- Bairro de Uberlândia é masculino: "no Morada da Colina".
- Capa de imóvel é interior ou lazer, nunca a fachada de rua.

As seções **Aplicação** dos posts já sinalizam essas colisões quando existem.

---

## 3. Continuar a extração

Estado atual em `INDICE.md`. O que falta nos `pendente` é ler os slides do carrossel e
escrever a análise — a legenda e a transcrição já estão no arquivo.

### Onde está a mídia

Fora do repositório, em:

```
~/Desktop/Arquivos para Claude/Biblioteca Instagram/
├── sheets/          contact sheets 3x3 dos slides e dos frames de vídeo
├── txt/             transcrições brutas
├── inventario.jsonl inventário normalizado (1 linha por post)
└── urls.json        URLs de mídia do inventário (expiram — ver abaixo)
```

Não vai para o repo de propósito: são ~80 MB de imagem e o repo é público.

### Receita de retomada

1. **Ver de onde retomar**

   ```sh
   grep -rl "status: pendente" biblioteca/posts/ | wc -l
   ```

2. **Se ainda faltar mídia** (contact sheet inexistente para o post), rebaixar um lote novo.
   As URLs de `urls.json` **expiram** — se der 403 no download, refazer o inventário antes:
   abrir o Instagram logado no Chrome e repetir o passo 1 de `INSTRUCOES-EXTRACAO.md`.

   ```sh
   biblioteca/ferramentas/lote.sh <indice_inicial> 32
   ```

   ```sh
   python3 biblioteca/ferramentas/processar_lote.py lotes/<indice>
   ```

3. **Costurar as transcrições novas nos arquivos**

   ```sh
   python3 biblioteca/ferramentas/atualizar_transcricoes.py biblioteca/posts "$HOME/Desktop/Arquivos para Claude/Biblioteca Instagram"
   ```

4. **Analisar** — ler o contact sheet do post em `sheets/<code>-slides*.jpg`, escrever
   Resumo, Pontos-chave, Slides, Aplicação e Conexões, e trocar `status: pendente` por
   `completo` (ou `parcial`, se faltou parte).

5. **Regerar o índice e commitar o lote**

   ```sh
   python3 biblioteca/ferramentas/gerar_indice.py biblioteca/posts biblioteca/INDICE.md
   ```

### Ordem recomendada

Não seguir a ordem do arquivo do começo ao fim. Render mais assim:

1. **Por autor de maior densidade.** @marcele_corretora (26), @lucasmarrques (24),
   @kakarivas (23), @brunoferoliveira (21), @brokersbr (19). Posts do mesmo autor repetem
   tese — analisar em bloco é mais rápido e as conexões saem prontas.
2. **Por tema da próxima tarefa.** Se a próxima entrega é kit de anúncio, analisar antes os
   pendentes de tráfego e criativo. A biblioteca serve à tarefa, não o contrário.
3. **O resto**, em lote, na ordem do inventário.

### Ritmo realista

~35 posts analisados por sessão longa. Restam ~1.045. Commitar a cada lote — se a sessão
cair, o `INDICE.md` mostra exatamente onde parou.

### Cuidados aprendidos

- O feed de Salvos do Instagram devolve **duplicatas** e responde `HTTP 572` depois de
  algumas dezenas de páginas. Deduplicar por `code` e guardar o cursor.
- O `javascript_tool` não devolve string com query string; o Instagram tem CSP que bloqueia
  `fetch` para `localhost`; o Chrome bloqueia download automático repetido. A ponte
  (`ferramentas/recebedor.py` + popup com clique real) é o caminho que funciona.
- `git status` e `git checkout` travam neste repositório (iCloud Desktop com arquivos não
  materializados). Usar comandos com pathspec (`git add biblioteca`) e plumbing
  (`git write-tree` / `git commit-tree` / `git update-ref`) para commitar.
- Apagar a mídia bruta (`.mp4`) logo após transcrever. Um lote de 32 posts baixa ~250 MB.
