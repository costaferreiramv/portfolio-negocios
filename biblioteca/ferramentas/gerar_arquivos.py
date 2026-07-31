#!/usr/bin/env python3
"""Gera os arquivos de biblioteca/posts/ a partir do inventario.

Preenche o que foi capturado de fato: frontmatter, legenda integral, transcricao
de video (quando existe) e descricao de acessibilidade. As secoes de analise
(Resumo, Pontos-chave, Aplicacao) ficam explicitamente marcadas como ainda nao
escritas — nunca preenchidas com suposicao.

Pula qualquer post cujo `code` ja aparece num arquivo existente em destdir.

uso: gerar_arquivos.py <inventario.jsonl> <destdir> <lotesdir> [inicio] [fim]
"""
import json, sys, os, re, glob, unicodedata, datetime

INV, DEST, LOTES = sys.argv[1], sys.argv[2], sys.argv[3]
INI = int(sys.argv[4]) if len(sys.argv) > 4 else 0
FIM = int(sys.argv[5]) if len(sys.argv) > 5 else 10**9

NOTA = "_Ainda não analisado. O conteúdo integral abaixo já está capturado._"


def slug(s, maxlen=44):
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()
    s = re.sub(r"[^a-zA-Z0-9]+", "-", s).strip("-").lower()
    return s[:maxlen].strip("-")


def resumo_curto(txt, n=52):
    txt = re.sub(r"https?://\S+", " ", txt or "")
    txt = re.sub(r"[#@]\S+", " ", txt)
    txt = re.sub(r"[^\wÀ-ÿ .,!?-]+", " ", txt)
    txt = re.sub(r"\s+", " ", txt).strip()
    return txt[:n]


# codes ja cobertos por arquivos escritos a mao
existentes = set()
for p in glob.glob(os.path.join(DEST, "*.md")):
    txt = open(p, encoding="utf-8").read(4000)
    for m in re.finditer(r"instagram\.com/(?:p|reel)/([A-Za-z0-9_-]+)/", txt):
        existentes.add(m.group(1))

# transcricoes disponiveis em qualquer lote
trans = {}
for t in glob.glob(os.path.join(LOTES, "*", "txt", "*.txt")):
    code = os.path.splitext(os.path.basename(t))[0]
    if "_S" in code:
        continue
    trans[code] = open(t, encoding="utf-8").read().strip()

# contact sheets disponiveis (referencia para leitura posterior)
sheets = {}
for s in glob.glob(os.path.join(LOTES, "*", "sheets", "*.jpg")):
    base = os.path.basename(s)
    code = re.sub(r"-(slides|video)(-\d+)?\.jpg$", "", base)
    sheets.setdefault(code, []).append(os.path.relpath(s, LOTES))

recs = [json.loads(l) for l in open(INV, encoding="utf-8")][INI:FIM]
os.makedirs(DEST, exist_ok=True)
hoje = datetime.date.today().isoformat()
feitos = pulados = 0

for r in recs:
    if r["code"] in existentes:
        pulados += 1
        continue
    autor = r["autor"] or "desconhecido"
    base = f"{slug(autor, 26)}-{slug(resumo_curto(r['legenda']) or r['code'], 40)}"
    path = os.path.join(DEST, base + ".md")
    n = 2
    while os.path.exists(path):
        path = os.path.join(DEST, f"{base}-{n}.md")
        n += 1

    tx = trans.get(r["code"])
    tem_sheet = r["code"] in sheets

    dur = ""
    if r.get("duracao_s"):
        m, s = divmod(int(r["duracao_s"]), 60)
        dur = f'"{m}min{s:02d}"' if m else f'"{s}s"'

    if r["tipo"] in ("reel", "video"):
        status = "parcial" if tx else "pendente"
    elif r["tipo"] == "carrossel":
        status = "pendente"
    else:
        status = "parcial" if r["legenda"] else "pendente"

    fm = ["---",
          f'titulo: "{(resumo_curto(r["legenda"], 70) or r["code"]).replace(chr(34), chr(39))}"',
          f'autor: "@{autor}"',
          f'url: {r["url"]}',
          f'tipo: {r["tipo"]}',
          "temas: []",
          "tags: []"]
    if dur:
        fm.append(f"duracao: {dur}")
    if r.get("n_slides"):
        fm.append(f'slides: {r["n_slides"]}')
    fm += [f'data_post: {r["data"]}',
           f"processado_em: {hoje}",
           f"status: {status}",
           "---", ""]

    c = ["## Resumo", "", NOTA, "", "## Pontos-chave", "", NOTA, "",
         "## Conteúdo integral", ""]

    if tx:
        c += ["### Transcrição do vídeo", "", tx, ""]
    elif r["tipo"] in ("reel", "video"):
        c += ["### Transcrição do vídeo", "", "[não capturado]", ""]

    if r["tipo"] == "carrossel":
        n_sl = r.get("n_slides") or "?"
        marca = "[não transcrito — contact sheet dos slides já gerado]" if tem_sheet \
            else f"[não capturado — {n_sl} slides]"
        c += ["### Slides", "", marca, ""]

    c += ["### Legenda", "", (r["legenda"] or "_sem legenda_"), ""]

    if r.get("acessibilidade"):
        c += ["### Descrição de acessibilidade (gerada pelo Instagram)", "",
              r["acessibilidade"], ""]

    c += ["## Aplicação", "", NOTA, "", "## Conexões", "", NOTA, ""]

    open(path, "w", encoding="utf-8").write("\n".join(fm) + "\n".join(c))
    feitos += 1

print(f"gerados: {feitos} | pulados (já escritos à mão): {pulados}")
