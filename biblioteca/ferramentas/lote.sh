#!/bin/bash
# Processa um lote de posts: baixa midia, transcreve video, monta contact sheets.
# uso: lote.sh <inicio> <qtd>
set -uo pipefail
BASE="/private/tmp/claude-501/-Users-icenter-Desktop-Arquivos-para-Claude/01e0d781-77c7-48a9-b49e-3c3019592669/scratchpad"
INI="$1"; QTD="$2"
LOTE="$BASE/lotes/$(printf '%04d' "$INI")"
mkdir -p "$LOTE/raw" "$LOTE/sheets"
UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36'

python3 - "$BASE/dumps/urls.json" "$BASE/inventario.jsonl" "$INI" "$QTD" > "$LOTE/plano.tsv" <<'PY'
import json,sys
urls={u["code"]:u for u in json.load(open(sys.argv[1],encoding="utf-8")) if u.get("code")}
inv=[json.loads(l) for l in open(sys.argv[2],encoding="utf-8")]
ini=int(sys.argv[3]); qtd=int(sys.argv[4])
for r in inv[ini:ini+qtd]:
    u=urls.get(r["code"])
    if not u: continue
    if u.get("video"): print(f"{r['code']}\tV\t{u['video']}")
    for i,x in enumerate(u.get("images") or [],1):
        if x.startswith("VIDEO::"): print(f"{r['code']}\tS{i:02d}V\t{x[7:]}")
        else: print(f"{r['code']}\tS{i:02d}\t{x}")
PY

n=0
while IFS=$'\t' read -r code slot url; do
  [ -z "${code:-}" ] && continue
  case "$slot" in
    V)    out="$LOTE/raw/${code}.mp4" ;;
    S*V)  out="$LOTE/raw/${code}_${slot%V}.mp4" ;;
    *)    out="$LOTE/raw/${code}_${slot}.jpg" ;;
  esac
  [ -s "$out" ] && continue
  curl -sS -L --max-time 90 -A "$UA" -o "$out" "$url" || echo "FALHOU $code $slot"
  n=$((n+1))
done < "$LOTE/plano.tsv"

echo "baixados: $n"
du -sh "$LOTE/raw"
