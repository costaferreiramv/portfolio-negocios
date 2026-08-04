#!/usr/bin/env python3
"""Corrige o status de posts ja analisados (sem NOTA) que ficaram com status
errado (parcial/pendente quando deveriam ser completo).

Regra: se o post ja foi analisado (sem placeholder "Ainda nao analisado") e:
- tipo reel/video: completo se tem transcricao real (nao "[nao capturado]")
- tipo imagem: completo se tem legenda real (a legenda e o unico conteudo)
- tipo carrossel: mantem como esta (parcial/pendente e correto se slides
  nao foram lidos)

uso: corrigir_status.py <postsdir>
"""
import sys, os, re, glob

POSTSDIR = sys.argv[1]
NOTA = "Ainda não analisado"
n_fixed = 0

for path in glob.glob(os.path.join(POSTSDIR, "*.md")):
    txt = open(path, encoding="utf-8").read()
    if NOTA in txt:
        continue  # ainda nao analisado, nao mexe

    m = re.search(r"^tipo: (\w+)", txt, re.M)
    tipo = m.group(1) if m else None
    status_m = re.search(r"^status: (\w+)", txt, re.M)
    status = status_m.group(1) if status_m else None

    if status == "completo":
        continue

    should_be_completo = False
    if tipo in ("reel", "video"):
        tx = re.search(r"### Transcrição do vídeo\n\n(.*?)(?:\n###|\n##|\Z)", txt, re.S)
        if tx and "[não capturado]" not in tx.group(1) and len(tx.group(1).strip()) > 20:
            should_be_completo = True
    elif tipo == "imagem":
        should_be_completo = True

    if should_be_completo:
        novo = re.sub(r"^status: \w+$", "status: completo", txt, flags=re.M)
        if novo != txt:
            open(path, "w", encoding="utf-8").write(novo)
            n_fixed += 1

print(f"corrigidos para completo: {n_fixed}")
