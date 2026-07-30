#!/bin/bash
# Baixa a midia de um lote a partir de um JSON de URLs exportado do navegador.
# uso: fetch_media.sh <urls.json> <destdir>
set -uo pipefail
SRC="$1"; DEST="$2"
mkdir -p "$DEST"
UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36'

python3 - "$SRC" <<'PY' > "$DEST/_dl.txt"
import json,sys
d=json.load(open(sys.argv[1],encoding="utf-8"))
for item in d:
    code=item["code"]
    if item.get("video"):
        print(f"{code}.mp4\t{item['video']}")
    for i,u in enumerate(item.get("images") or [], 1):
        print(f"{code}_s{i:02d}.jpg\t{u}")
PY

while IFS=$'\t' read -r name url; do
  [ -z "${name:-}" ] && continue
  [ -s "$DEST/$name" ] && continue
  curl -sS -L --max-time 120 -A "$UA" -o "$DEST/$name" "$url" || echo "FALHOU $name"
done < "$DEST/_dl.txt"

ls -la "$DEST" | tail -5
echo "arquivos: $(ls "$DEST" | grep -cE '\.(mp4|jpg)$')"
