#!/usr/bin/env python3
"""Dump posts pendentes/parciais em lote pra leitura rapida, priorizado.

uso: dump_pendentes.py <postsdir> [--autor X] [--tema-kw palavra] [--n 30] [--offset 0] [--tipo carrossel]
"""
import sys, os, re, glob, argparse, collections

ap = argparse.ArgumentParser()
ap.add_argument("postsdir")
ap.add_argument("--autor")
ap.add_argument("--tipo")
ap.add_argument("--n", type=int, default=25)
ap.add_argument("--offset", type=int, default=0)
ap.add_argument("--status", default="parcial,pendente")
ap.add_argument("--list-authors", action="store_true")
args = ap.parse_args()

statuses = set(args.status.split(","))

def parse(path):
    t = open(path, encoding="utf-8").read()
    m = re.match(r"---\n(.*?)\n---\n(.*)", t, re.S)
    fm, body = m.group(1), m.group(2)
    d = {}
    for line in fm.split("\n"):
        k, _, v = line.partition(":")
        d[k.strip()] = v.strip().strip('"')
    d["_file"] = os.path.basename(path)
    d["_body"] = body
    return d

files = sorted(glob.glob(os.path.join(args.postsdir, "*.md")))
recs = [parse(f) for f in files]
recs = [r for r in recs if r.get("status") in statuses]

if args.list_authors:
    c = collections.Counter(r.get("autor","") for r in recs)
    for a, n in c.most_common(60):
        print(n, a)
    sys.exit()

if args.autor:
    recs = [r for r in recs if r.get("autor") == args.autor]
if args.tipo:
    recs = [r for r in recs if r.get("tipo") == args.tipo]

recs.sort(key=lambda r: (r.get("autor",""), r.get("_file","")))
chunk = recs[args.offset:args.offset+args.n]

print(f"### total selecionado: {len(recs)} | mostrando {args.offset}..{args.offset+len(chunk)}")
for r in chunk:
    print("="*8, r["_file"], "|", r.get("tipo"), "|", r.get("autor"), "|", r.get("data_post"), "|", r.get("status"))
    body = r["_body"]
    # extrai so legenda + transcricao/slides, corta o resto (secoes vazias)
    leg = re.search(r"### Legenda\n\n(.*?)(?:\n##|\n### |\Z)", body, re.S)
    tx = re.search(r"### Transcrição do vídeo\n\n(.*?)(?:\n###|\n##|\Z)", body, re.S)
    sl = re.search(r"### Slides\n\n(.*?)(?:\n###|\n##|\Z)", body, re.S)
    if tx: print("TX:", tx.group(1).strip()[:1600])
    if sl: print("SLIDES:", sl.group(1).strip()[:300])
    if leg: print("LEG:", leg.group(1).strip()[:900])
    print()
