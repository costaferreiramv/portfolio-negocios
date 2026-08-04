#!/usr/bin/env python3
"""Processa o raw/ de um lote:
   - transcreve cada .mp4 com mlx-whisper -> <code>.txt
   - monta contact sheet dos frames de cada video  -> sheets/<code>-video.jpg
   - monta contact sheet dos slides de carrossel   -> sheets/<code>-slides[-N].jpg
   - apaga os .mp4 depois de processar (disco apertado)
uso: processar_lote.py <pastaLote>
"""
import sys, os, glob, subprocess, re, shutil, collections

LOTE = sys.argv[1]
RAW = os.path.join(LOTE, "raw")
SH = os.path.join(LOTE, "sheets")
TX = os.path.join(LOTE, "txt")
os.makedirs(SH, exist_ok=True)
os.makedirs(TX, exist_ok=True)
MODEL = "mlx-community/whisper-large-v3-turbo-q4"

import mlx_whisper


def run(args):
    return subprocess.run(args, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=False)


def sheet(imgs, out, cols=3, tile=620):
    """Monta um contact sheet a partir de uma lista de imagens."""
    if not imgs:
        return False
    linhas = (len(imgs) + cols - 1) // cols
    ins = []
    for p in imgs:
        ins += ["-i", p]
    n = len(imgs)
    fc = "".join(f"[{i}:v]scale={tile}:{tile}:force_original_aspect_ratio=decrease,"
                 f"pad={tile}:{tile}:(ow-iw)/2:(oh-ih)/2:color=0x111111,"
                 f"drawtext=text='{i+1}':x=12:y=12:fontsize=42:fontcolor=yellow:box=1:boxcolor=black@0.6:boxborderw=6[v{i}];"
                 for i in range(n))
    fc += "".join(f"[v{i}]" for i in range(n))
    fc += f"xstack=inputs={n}:layout=" + "|".join(
        f"{(i % cols)}_{(i // cols)}".replace("0_", "0_").replace("_", "_") for i in range(n))
    # xstack layout precisa de expressoes em pixels
    layout = "|".join(f"{(i % cols)*tile}_{(i // cols)*tile}" for i in range(n))
    fc = "".join(f"[{i}:v]scale={tile}:{tile}:force_original_aspect_ratio=decrease,"
                 f"pad={tile}:{tile}:(ow-iw)/2:(oh-ih)/2:color=0x111111[v{i}];"
                 for i in range(n))
    fc += "".join(f"[v{i}]" for i in range(n)) + f"xstack=inputs={n}:layout={layout}:fill=0x111111[out]"
    r = run(["ffmpeg", "-nostdin", "-y", *ins, "-filter_complex", fc, "-map", "[out]",
             "-q:v", "4", out])
    return os.path.exists(out) and os.path.getsize(out) > 1000


# ---------- videos ----------
vids = sorted(glob.glob(os.path.join(RAW, "*.mp4")))
for v in vids:
    code = os.path.basename(v)[:-4]
    out_txt = os.path.join(TX, code + ".txt")
    if not os.path.exists(out_txt):
        wav = os.path.join(RAW, code + ".wav")
        run(["ffmpeg", "-nostdin", "-y", "-i", v, "-ac", "1", "-ar", "16000", "-vn", wav])
        txt = ""
        if os.path.exists(wav) and os.path.getsize(wav) > 4000:
            try:
                r = mlx_whisper.transcribe(wav, path_or_hf_repo=MODEL, language="pt",
                                           condition_on_previous_text=False)
                txt = (r.get("text") or "").strip()
            except Exception as e:
                txt = f"[falha na transcricao: {e}]"
        else:
            txt = "[sem faixa de audio]"
        open(out_txt, "w", encoding="utf-8").write(txt or "[inaudivel]")
        if os.path.exists(wav):
            os.remove(wav)
        print(f"TX {code}: {len(txt)} chars")

    # frames -> contact sheet
    outsheet = os.path.join(SH, code + "-video.jpg")
    if not os.path.exists(outsheet):
        fdir = os.path.join(RAW, "_f_" + code)
        os.makedirs(fdir, exist_ok=True)
        run(["ffmpeg", "-nostdin", "-y", "-i", v, "-vf", "fps=1/3,scale=620:-1",
             "-frames:v", "9", os.path.join(fdir, "f%02d.jpg")])
        frames = sorted(glob.glob(os.path.join(fdir, "*.jpg")))
        if frames:
            sheet(frames, outsheet)
        shutil.rmtree(fdir, ignore_errors=True)
    os.remove(v)

# ---------- carrosseis / imagens ----------
grupos = collections.defaultdict(list)
for p in sorted(glob.glob(os.path.join(RAW, "*_S*.jpg"))):
    code = re.sub(r"_S\d+\.jpg$", "", os.path.basename(p))
    grupos[code].append(p)

for code, imgs in grupos.items():
    imgs.sort()
    for bloco in range(0, len(imgs), 9):
        parte = imgs[bloco:bloco + 9]
        suf = "" if len(imgs) <= 9 else f"-{bloco//9 + 1}"
        out = os.path.join(SH, f"{code}-slides{suf}.jpg")
        if not os.path.exists(out):
            sheet(parte, out)
    for p in imgs:
        os.remove(p)

print("sheets:", len(os.listdir(SH)))
print("txt:", len(os.listdir(TX)))
