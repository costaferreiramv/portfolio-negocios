#!/usr/bin/env python3
"""Preenche as transcricoes que chegaram depois da geracao dos arquivos.

Procura em posts/*.md por '[não capturado]' na secao de transcricao; se ja existe
o .txt do lote correspondente, substitui e ajusta o status de pendente p/ parcial.
Tambem marca os carrosseis que ja tem contact sheet gerado.

uso: atualizar_transcricoes.py <postsdir> <lotesdir>
"""
import sys, os, re, glob

POSTS, LOTES = sys.argv[1], sys.argv[2]

# aceita tanto o layout de lotes (lotes/<n>/txt) quanto o da pasta persistente
# (Biblioteca Instagram/txt)
def achar(sub, ext):
    return (glob.glob(os.path.join(LOTES, "*", sub, "*." + ext))
            + glob.glob(os.path.join(LOTES, sub, "*." + ext)))


trans = {}
for t in achar("txt", "txt"):
    code = os.path.splitext(os.path.basename(t))[0]
    if "_S" in code:
        continue
    trans[code] = open(t, encoding="utf-8").read().strip()

sheets = set()
for s in achar("sheets", "jpg"):
    sheets.add(re.sub(r"-(slides|video)(-\d+)?\.jpg$", "", os.path.basename(s)))

n_tx = n_sh = 0
for p in glob.glob(os.path.join(POSTS, "*.md")):
    txt = open(p, encoding="utf-8").read()
    m = re.search(r"instagram\.com/(?:p|reel)/([A-Za-z0-9_-]+)/", txt)
    if not m:
        continue
    code = m.group(1)
    novo = txt

    tx = trans.get(code)
    if tx and "### Transcrição do vídeo\n\n[não capturado]" in novo:
        corpo = tx if tx.strip() else "[inaudível]"
        novo = novo.replace("### Transcrição do vídeo\n\n[não capturado]",
                            "### Transcrição do vídeo\n\n" + corpo)
        novo = re.sub(r"^status: pendente$", "status: parcial", novo, flags=re.M)
        n_tx += 1

    if code in sheets and "[não capturado —" in novo and "slides]" in novo:
        novo = re.sub(r"\[não capturado — .*? slides\]",
                      "[não transcrito — contact sheet dos slides já gerado]", novo)
        n_sh += 1

    if novo != txt:
        open(p, "w", encoding="utf-8").write(novo)

print(f"transcrições preenchidas: {n_tx} | carrosséis com sheet marcados: {n_sh}")
