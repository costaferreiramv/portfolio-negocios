#!/usr/bin/env python3
"""Gera o esqueleto dos arquivos de biblioteca/posts/ a partir do inventario.

Preenche mecanicamente: frontmatter, legenda integral, transcricao (se houver).
Deixa Resumo / Pontos-chave / Aplicacao marcados como [A PREENCHER] para o
Claude escrever depois — nunca inventa conteudo.

uso: gerar_arquivos.py <inventario.jsonl> <destdir> [inicio] [fim] [midiadir]
"""
import json, sys, os, re, unicodedata, datetime

INV, DEST = sys.argv[1], sys.argv[2]
INI = int(sys.argv[3]) if len(sys.argv) > 3 else 0
FIM = int(sys.argv[4]) if len(sys.argv) > 4 else 10**9
MIDIA = sys.argv[5] if len(sys.argv) > 5 else None

def slug(s, maxlen=40):
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()
    s = re.sub(r"[^a-zA-Z0-9]+", "-", s).strip("-").lower()
    return s[:maxlen].strip("-")

def primeira_frase(txt, n=60):
    txt = re.sub(r"\s+", " ", txt).strip()
    txt = re.sub(r"[#@]\S+", "", txt).strip()
    return txt[:n]

recs = [json.loads(l) for l in open(INV, encoding="utf-8")]
recs = recs[INI:FIM]

os.makedirs(DEST, exist_ok=True)
hoje = datetime.date.today().isoformat()
feitos = []

for r in recs:
    autor = r["autor"] or "desconhecido"
    base = f"{slug(autor,24)}-{slug(primeira_frase(r['legenda']) or r['code'],36)}"
    path = os.path.join(DEST, base + ".md")
    n = 2
    while os.path.exists(path):
        path = os.path.join(DEST, f"{base}-{n}.md")
        n += 1

    transcricao = None
    if MIDIA:
        t = os.path.join(MIDIA, r["code"] + ".txt")
        if os.path.exists(t):
            transcricao = open(t, encoding="utf-8").read().strip()

    dur = ""
    if r.get("duracao_s"):
        m, s = divmod(int(r["duracao_s"]), 60)
        dur = f'"{m}min{s:02d}"' if m else f'"{s}s"'

    fm = [
        "---",
        f'titulo: "[A PREENCHER]"',
        f'autor: "@{autor}"',
        f'url: {r["url"]}',
        f'tipo: {r["tipo"]}',
        "temas: []",
        "tags: []",
    ]
    if dur:
        fm.append(f"duracao: {dur}")
    if r.get("n_slides"):
        fm.append(f'slides: {r["n_slides"]}')
    fm += [
        f'data_post: {r["data"]}',
        f"processado_em: {hoje}",
        "status: pendente",
        "---",
        "",
    ]

    corpo = ["## Resumo", "", "[A PREENCHER]", "", "## Pontos-chave", "", "- [A PREENCHER]", "",
             "## Conteúdo integral", ""]

    if transcricao:
        corpo += ["### Transcrição do vídeo", "", transcricao, ""]
    elif r["tipo"] in ("reel", "video"):
        corpo += ["### Transcrição do vídeo", "", "[não capturado]", ""]

    if r["tipo"] == "carrossel":
        corpo += ["### Slides", "", f'[não capturado — {r.get("n_slides") or "?"} slides]', ""]

    if r["legenda"]:
        corpo += ["### Legenda", "", r["legenda"], ""]
    else:
        corpo += ["### Legenda", "", "_sem legenda_", ""]

    if r.get("acessibilidade"):
        corpo += ["### Descrição de acessibilidade (gerada pelo Instagram)", "",
                  r["acessibilidade"], ""]

    corpo += ["## Aplicação", "", "[A PREENCHER]", "", "## Conexões", "", "[A PREENCHER]", ""]

    open(path, "w", encoding="utf-8").write("\n".join(fm) + "\n".join(corpo))
    feitos.append(os.path.basename(path))

print(f"gerados: {len(feitos)}")
for f in feitos[:10]:
    print("  " + f)
