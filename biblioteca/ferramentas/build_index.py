#!/usr/bin/env python3
"""Le o inventario bruto da colecao (JSON exportado do navegador) e gera:
  - inventario.jsonl  (um registro por post, normalizado)
  - estatisticas no stdout
"""
import json, sys, os, datetime, re

SRC = sys.argv[1]
OUT = sys.argv[2]

with open(SRC, encoding="utf-8") as f:
    data = json.load(f)

TYPE = {1: "imagem", 2: "video", 8: "carrossel"}

recs = []
seen = set()
for m in data:
    pk = str(m.get("pk") or m.get("id") or "")
    code = m.get("code") or ""
    if not code or code in seen:
        continue
    seen.add(code)
    mt = m.get("media_type")
    pt = m.get("product_type") or ""
    tipo = TYPE.get(mt, str(mt))
    if pt == "clips":
        tipo = "reel"
    user = (m.get("user") or {})
    cap = (m.get("caption") or {}) or {}
    taken = m.get("taken_at")
    rec = {
        "code": code,
        "pk": pk,
        "tipo": tipo,
        "product_type": pt,
        "autor": user.get("username") or "",
        "autor_nome": user.get("full_name") or "",
        "url": f"https://www.instagram.com/{'reel' if pt=='clips' else 'p'}/{code}/",
        "data": datetime.datetime.utcfromtimestamp(taken).strftime("%Y-%m-%d") if taken else "",
        "legenda": (cap.get("text") or "").strip(),
        "n_slides": len(m.get("carousel_media") or []) or None,
        "duracao_s": round(m.get("video_duration"), 1) if m.get("video_duration") else None,
        "acessibilidade": m.get("accessibility_caption") or "",
        "curtidas": m.get("like_count"),
        "comentarios": m.get("comment_count"),
        "views": m.get("play_count") or m.get("view_count"),
    }
    recs.append(rec)

with open(OUT, "w", encoding="utf-8") as f:
    for r in recs:
        f.write(json.dumps(r, ensure_ascii=False) + "\n")

# estatisticas
from collections import Counter
tipos = Counter(r["tipo"] for r in recs)
autores = Counter(r["autor"] for r in recs)
dur = sum(r["duracao_s"] or 0 for r in recs)
slides = sum(r["n_slides"] or 0 for r in recs)
com_legenda = sum(1 for r in recs if r["legenda"])
anos = Counter(r["data"][:4] for r in recs if r["data"])

print(f"TOTAL POSTS: {len(recs)}")
print("POR TIPO:", dict(tipos))
print(f"VIDEO TOTAL: {dur/3600:.1f} h ({dur/60:.0f} min)")
print(f"SLIDES DE CARROSSEL: {slides}")
print(f"COM LEGENDA: {com_legenda} ({100*com_legenda/max(len(recs),1):.0f}%)")
print("POR ANO:", dict(sorted(anos.items())))
print(f"AUTORES DISTINTOS: {len(autores)}")
print("TOP 25 AUTORES:")
for a, n in autores.most_common(25):
    print(f"  {n:4d}  @{a}")
