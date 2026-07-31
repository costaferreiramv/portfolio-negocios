#!/usr/bin/env python3
"""Le biblioteca/posts/*.md e reescreve biblioteca/INDICE.md."""
import os, re, glob, sys, datetime, collections

POSTS = sys.argv[1]
OUT = sys.argv[2]

TEMAS_ORDEM = ["vendas", "trafego-pago", "criativos", "conteudo-organico", "copywriting",
               "posicionamento", "captacao", "mercado-imobiliario", "gestao",
               "ia-automacao", "mentalidade"]


def fm(path):
    t = open(path, encoding="utf-8").read()
    m = re.match(r"---\n(.*?)\n---", t, re.S)
    d = {}
    if m:
        for line in m.group(1).split("\n"):
            k, _, v = line.partition(":")
            d[k.strip()] = v.strip().strip('"')
    d["_file"] = os.path.basename(path)
    return d


posts = [fm(p) for p in sorted(glob.glob(os.path.join(POSTS, "*.md")))]
por_status = collections.Counter(p.get("status", "?") for p in posts)
por_tipo = collections.Counter(p.get("tipo", "?") for p in posts)
por_autor = collections.Counter(p.get("autor", "?") for p in posts)

analisados = [p for p in posts if p.get("status") == "completo"
              or (p.get("temas") and p["temas"] != "[]")]

por_tema = collections.defaultdict(list)
for p in posts:
    temas = [t.strip() for t in p.get("temas", "").strip("[]").split(",") if t.strip()]
    for t in temas:
        por_tema[t].append(p)

L = []
A = L.append
A("# Índice da Biblioteca")
A("")
A("Índice mestre dos posts salvos da coleção **Portfólio Negócios**.")
A("Gerado por `ferramentas/gerar_indice.py` — reexecutar a cada lote.")
A("")
A(f"**Posts na coleção:** {len(posts)}")
A(f"**Analisados (resumo, pontos-chave e aplicação escritos):** {len(analisados)}")
A("")
A("### Status")
A("")
A("| status | o que significa | posts |")
A("|---|---|---|")
A(f"| `completo` | íntegra capturada e analisada | {por_status.get('completo', 0)} |")
A(f"| `parcial` | íntegra parcial (ex.: vídeo sem fala, slide faltando) | {por_status.get('parcial', 0)} |")
A(f"| `pendente` | legenda capturada; falta transcrever slides ou analisar | {por_status.get('pendente', 0)} |")
A("")
A("### Tipo")
A("")
A("| tipo | posts |")
A("|---|---|")
for t, n in por_tipo.most_common():
    A(f"| {t} | {n} |")
A("")
A("---")
A("")
A("## Por tema")
A("")
A("Só os posts já analisados aparecem aqui — o tema é atribuído na leitura, não")
A("automaticamente.")
A("")
vistos = set()
for tema in TEMAS_ORDEM + sorted(set(por_tema) - set(TEMAS_ORDEM)):
    if tema in vistos:
        continue
    vistos.add(tema)
    itens = por_tema.get(tema, [])
    A(f"### {tema}")
    A("")
    if not itens:
        A("_vazio_")
    else:
        for p in sorted(itens, key=lambda x: x.get("autor", "")):
            A(f"- [{p.get('titulo','(sem título)')}](posts/{p['_file']}) — {p.get('autor','')}")
    A("")

A("---")
A("")
A("## Analisados, em ordem alfabética de arquivo")
A("")
for p in sorted(analisados, key=lambda x: x["_file"]):
    A(f"- [{p.get('titulo','(sem título)')}](posts/{p['_file']}) — {p.get('autor','')} · {p.get('tipo','')} · {p.get('data_post','')}")
A("")
A("---")
A("")
A("## Por autor")
A("")
A("Autores com 3 ou mais posts salvos. A lista completa está em `inventario.jsonl`.")
A("")
A("| autor | posts |")
A("|---|---|")
for a, n in por_autor.most_common():
    if n < 3:
        continue
    A(f"| {a} | {n} |")
A("")
A(f"_Autores distintos na coleção: {len(por_autor)}._")
A("")
A("---")
A("")
A("## Pendências")
A("")
A("Todo post da coleção já tem arquivo em `posts/` com legenda integral e, quando é")
A("vídeo, a transcrição. O que falta nos marcados como `pendente` é a leitura dos")
A("slides de carrossel e a análise (resumo, pontos-chave, aplicação).")
A("")
A("Para achar o que falta:")
A("")
A("```sh")
A('grep -rl "status: pendente" biblioteca/posts/ | wc -l')
A("```")
A("")

open(OUT, "w", encoding="utf-8").write("\n".join(L))
print(f"INDICE.md: {len(posts)} posts, {len(analisados)} analisados")
