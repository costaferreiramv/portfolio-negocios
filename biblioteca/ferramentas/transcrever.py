#!/usr/bin/env python3
"""Transcreve todos os .mp4 de uma pasta com mlx-whisper (local, Apple Silicon).
Gera <code>.txt ao lado. Pula o que ja tem .txt.
uso: transcrever.py <pasta>
"""
import sys, os, glob, subprocess, json

PASTA = sys.argv[1]
MODEL = "mlx-community/whisper-large-v3-turbo-q4"

import mlx_whisper

vids = sorted(glob.glob(os.path.join(PASTA, "*.mp4")))
for v in vids:
    base = os.path.splitext(v)[0]
    out = base + ".txt"
    if os.path.exists(out):
        continue
    wav = base + ".wav"
    subprocess.run(["ffmpeg", "-nostdin", "-y", "-i", v, "-ac", "1", "-ar", "16000", "-vn", wav],
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=False)
    if not os.path.exists(wav) or os.path.getsize(wav) < 2000:
        open(out, "w").write("[sem faixa de audio]")
        print(f"{os.path.basename(v)}: sem audio")
        continue
    try:
        r = mlx_whisper.transcribe(wav, path_or_hf_repo=MODEL, language="pt",
                                   condition_on_previous_text=False)
        txt = (r.get("text") or "").strip()
        open(out, "w", encoding="utf-8").write(txt if txt else "[inaudivel]")
        print(f"{os.path.basename(v)}: {len(txt)} chars")
    except Exception as e:
        open(out, "w", encoding="utf-8").write(f"[falha na transcricao: {e}]")
        print(f"{os.path.basename(v)}: ERRO {e}")
    finally:
        if os.path.exists(wav):
            os.remove(wav)
print("fim")
