#!/usr/bin/env python3
"""Aplica analises em lote nos posts, substituindo os placeholders NOTA.

Le um JSON (lista de objetos) do stdin ou de arquivo, com o formato:
{
  "file": "autor-slug.md",           # nome do arquivo em posts/
  "temas": ["vendas"],               # lista, vira o frontmatter temas: [...]
  "tags": ["a","b"],                 # idem tags
  "resumo": "...",                   # paragrafo(s), vira ## Resumo
  "pontos_chave": ["...","..."],     # vira lista com -
  "aplicacao": "...",                # vira ## Aplicação (pode ser markdown com **)
  "conexoes": ["[texto](arquivo.md) — nota", ...],  # vira ## Conexões
  "status": "completo"               # ou "parcial" se midia incompleta
}

uso: aplicar_analise.py <postsdir> <json_file>
"""
import sys, os, re, json

POSTSDIR, JSONFILE = sys.argv[1], sys.argv[2]
items = json.load(open(JSONFILE, encoding="utf-8"))

NOTA = "_Ainda não analisado. O conteúdo integral abaixo já está capturado._"

ok = err = 0
for it in items:
    path = os.path.join(POSTSDIR, it["file"])
    if not os.path.exists(path):
        print("FALTA ARQUIVO:", it["file"])
        err += 1
        continue
    txt = open(path, encoding="utf-8").read()

    if NOTA not in txt:
        print("SEM PLACEHOLDER (já analisado?):", it["file"])
        err += 1
        continue

    # frontmatter: temas / tags / status
    if "temas" in it:
        temas_str = "[" + ", ".join(it["temas"]) + "]"
        txt = re.sub(r"^temas: \[\]$", f"temas: {temas_str}", txt, flags=re.M)
    if "tags" in it:
        tags_str = "[" + ", ".join(it["tags"]) + "]"
        txt = re.sub(r"^tags: \[\]$", f"tags: {tags_str}", txt, flags=re.M)
    if "status" in it:
        txt = re.sub(r"^status: (pendente|parcial)$", f"status: {it['status']}", txt, flags=re.M)

    # secao Resumo
    txt = txt.replace(
        f"## Resumo\n\n{NOTA}\n\n## Pontos-chave\n\n{NOTA}",
        f"## Resumo\n\n{it['resumo'].strip()}\n\n## Pontos-chave\n\n" +
        "\n".join(f"- {p}" for p in it["pontos_chave"])
    )

    # secao Aplicacao + Conexoes (ambas tinham NOTA)
    conexoes_txt = "\n".join(f"- {c}" for c in it.get("conexoes", [])) or "_Sem conexões identificadas ainda._"
    txt = txt.replace(
        f"## Aplicação\n\n{NOTA}\n\n## Conexões\n\n{NOTA}\n",
        f"## Aplicação\n\n{it['aplicacao'].strip()}\n\n## Conexões\n\n{conexoes_txt}\n"
    )

    if NOTA in txt:
        print("SOBROU PLACEHOLDER (padrão não bateu):", it["file"])
        err += 1
        continue

    open(path, "w", encoding="utf-8").write(txt)
    ok += 1

print(f"aplicados: {ok} | erros: {err}")
