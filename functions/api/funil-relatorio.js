// Cloudflare Pages Function: agrega os eventos de funil.js num relatório por
// etapa — "quantas sessões chegaram até aqui" — e lista os leads recebidos
// com data/hora. Protegido por chave simples (env FUNIL_TOKEN) pra não ficar
// público pra quem achar a URL: só números agregados e horário de entrada,
// sem nome/telefone (isso está no e-mail que o lead.js já manda).
//
// Uso: GET /api/funil-relatorio?imovel=CA5635&chave=SEGREDO
// JSON puro (uso programático): acrescenta &formato=json

const ETAPAS_LABEL = {
  '00': 'Abriu a página',
  '01': 'Pergunta 1 — Quem vai morar na casa',
  '02': 'Pergunta 2 — O que mais pesa na escolha',
  '03': 'Pergunta 3 — Prazo pra resolver',
  '04': 'Pergunta 4 — Tem imóvel pra dar',
  '05': 'Pergunta 5 — Como pretende pagar',
  '06': 'Pergunta 6 — Quer conhecer pessoalmente',
  '07': 'Chegou no formulário final',
  '08': 'Virou lead (enviou nome e WhatsApp)',
};
const ETAPA_LEAD = '08';

function escaparHtml(texto) {
  return String(texto).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function formataDataHora(ts) {
  if (!Number.isFinite(ts)) return '—';
  const partes = new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).formatToParts(new Date(ts));
  const p = Object.fromEntries(partes.map((x) => [x.type, x.value]));
  return `${p.day}/${p.month}/${p.year} às ${p.hour}:${p.minute}`;
}

async function coletaEventos(env, imovel) {
  const prefixo = `ev:${imovel}:`;
  const eventos = [];
  let cursor;
  let paginas = 0;
  do {
    const pagina = await env.FUNIL_EVENTOS.list({ prefix: prefixo, cursor, limit: 1000 });
    for (const item of pagina.keys) {
      const partes = item.name.split(':');
      const etapa = partes[partes.length - 1];
      const sessionId = partes.slice(2, -1).join(':');
      const meta = item.metadata || {};
      eventos.push({ etapa, sessionId, etapaId: meta.etapaId ?? null, ts: meta.ts ?? null });
    }
    cursor = pagina.list_complete ? undefined : pagina.cursor;
    paginas += 1;
  } while (cursor && paginas < 50); // trava de segurança, não pra rodar pra sempre
  return eventos;
}

function montaFunil(eventos) {
  const porEtapa = {};
  for (const ev of eventos) porEtapa[ev.etapa] = (porEtapa[ev.etapa] ?? 0) + 1;

  const etapasOrdenadas = Object.keys(porEtapa).sort();
  const topo = etapasOrdenadas.length ? porEtapa[etapasOrdenadas[0]] : 0;

  return etapasOrdenadas.map((etapa, i) => {
    const chegaram = porEtapa[etapa];
    const anterior = i > 0 ? porEtapa[etapasOrdenadas[i - 1]] : chegaram;
    const abandonaram = i > 0 ? Math.max(0, anterior - chegaram) : 0;
    return {
      etapa,
      rotulo: ETAPAS_LABEL[etapa] ?? `Etapa ${etapa}`,
      chegaram,
      abandonaram_antes_desta: abandonaram,
      pct_do_topo: topo ? Math.round((chegaram / topo) * 100) : 0,
    };
  });
}

function montaLeads(eventos) {
  return eventos
    .filter((ev) => ev.etapa === ETAPA_LEAD)
    .sort((a, b) => (b.ts ?? 0) - (a.ts ?? 0))
    .map((ev) => ({ sessionId: ev.sessionId, ts: ev.ts, quando: formataDataHora(ev.ts) }));
}

function paginaHtml({ imovel, funil, leads, atualizadoEm }) {
  const topo = funil[0]?.chegaram ?? 0;
  const linhasFunil = funil.map((f) => `
    <div class="etapa">
      <div class="etapa-topo">
        <span class="etapa-rotulo">${escaparHtml(f.rotulo)}</span>
        <span class="etapa-numero">${f.chegaram}</span>
      </div>
      <div class="barra-fundo">
        <div class="barra-cheia" style="width:${f.pct_do_topo}%"></div>
      </div>
      ${f.abandonaram_antes_desta > 0
        ? `<p class="etapa-abandono">↳ ${f.abandonaram_antes_desta} não passaram daqui</p>`
        : ''}
    </div>
  `).join('');

  const linhasLeads = leads.length
    ? leads.map((l) => `
        <tr>
          <td class="td-data">${escaparHtml(l.quando)}</td>
          <td class="td-sessao"><code>${escaparHtml(l.sessionId)}</code></td>
        </tr>
      `).join('')
    : `<tr><td colspan="2" class="sem-dados">Nenhum lead registrado ainda nesta janela.</td></tr>`;

  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Funil — ${escaparHtml(imovel)}</title>
<style>
  :root {
    --bg: #f4f2ec; --papel: #ffffff; --papel-alto: #ece8dd;
    --tinta: #1e2a44; --tinta-media: #5a6478; --tinta-fraca: #8891a3;
    --traco: #ddd7c8; --ciano: #0f6e77; --ciano-bg: #e3f0ef;
    --alerta: #a06a12; --alerta-bg: #f5ecd9;
    --mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
    --display: -apple-system, "Segoe UI", "Helvetica Neue", Arial, sans-serif;
  }
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) {
      --bg: #10151f; --papel: #171e2c; --papel-alto: #1e2636;
      --tinta: #eef0f4; --tinta-media: #a7afc2; --tinta-fraca: #6b7386;
      --traco: #2a3242; --ciano: #4fc3cc; --ciano-bg: #143336;
      --alerta: #e0aa4e; --alerta-bg: #3a2d14;
    }
  }
  * { box-sizing: border-box; }
  body {
    margin: 0; background: var(--bg); color: var(--tinta);
    font-family: var(--display); -webkit-font-smoothing: antialiased;
  }
  .wrap { max-width: 720px; margin: 0 auto; padding: 40px 22px 64px; }
  header { margin-bottom: 32px; }
  .rotulo-topo {
    font-family: var(--mono); font-size: 12px; letter-spacing: .06em;
    text-transform: uppercase; color: var(--tinta-fraca); margin: 0 0 8px;
  }
  h1 { font-size: 1.7rem; margin: 0 0 6px; letter-spacing: -.01em; }
  .atualizado { font-size: .82rem; color: var(--tinta-fraca); margin: 0; }

  h2 {
    font-size: 1rem; text-transform: uppercase; letter-spacing: .04em;
    color: var(--tinta-media); margin: 40px 0 16px; font-family: var(--mono);
  }

  .etapa { margin-bottom: 18px; }
  .etapa-topo { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px; }
  .etapa-rotulo { font-size: .92rem; }
  .etapa-numero {
    font-family: var(--mono); font-weight: 600; font-size: 1.05rem;
    font-variant-numeric: tabular-nums;
  }
  .barra-fundo {
    height: 10px; border-radius: 6px; background: var(--papel-alto);
    overflow: hidden; border: 1px solid var(--traco);
  }
  .barra-cheia {
    height: 100%; background: var(--ciano); border-radius: 6px;
    transition: width .3s;
  }
  .etapa-abandono {
    margin: 6px 0 0; font-size: .78rem; color: var(--alerta);
  }

  table { width: 100%; border-collapse: collapse; background: var(--papel);
    border: 1px solid var(--traco); border-radius: 10px; overflow: hidden; }
  th, td { text-align: left; padding: 11px 14px; font-size: .88rem; }
  th {
    font-family: var(--mono); font-size: .7rem; letter-spacing: .05em;
    text-transform: uppercase; color: var(--tinta-fraca);
    background: var(--papel-alto); border-bottom: 1px solid var(--traco);
  }
  tr + tr td { border-top: 1px solid var(--traco); }
  .td-data { font-variant-numeric: tabular-nums; white-space: nowrap; }
  .td-sessao code { font-size: .76rem; color: var(--tinta-fraca); }
  .sem-dados { color: var(--tinta-fraca); text-align: center; padding: 24px; }

  .vazio {
    padding: 32px 20px; text-align: center; color: var(--tinta-fraca);
    border: 1px dashed var(--traco); border-radius: 10px; font-size: .9rem;
  }

  footer { margin-top: 44px; font-size: .74rem; color: var(--tinta-fraca); font-family: var(--mono); }
</style>
</head>
<body>
  <div class="wrap">
    <header>
      <p class="rotulo-topo">Funil de qualificação · ${escaparHtml(imovel)}</p>
      <h1>Onde os leads estão chegando e onde param</h1>
      <p class="atualizado">Atualizado em ${escaparHtml(atualizadoEm)}</p>
    </header>

    <h2>Funil por etapa</h2>
    ${funil.length ? linhasFunil : '<p class="vazio">Ainda sem eventos registrados. Assim que alguém abrir a página, aparece aqui.</p>'}

    <h2>Leads recebidos (${leads.length})</h2>
    <table>
      <thead><tr><th>Data e hora</th><th>Sessão</th></tr></thead>
      <tbody>${linhasLeads}</tbody>
    </table>

    <footer>${escaparHtml(imovel)} · dados dos últimos 120 dias · JSON puro: acrescente &amp;formato=json na URL</footer>
  </div>
</body>
</html>`;
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  const chave = url.searchParams.get('chave') ?? '';
  if (env.FUNIL_TOKEN && chave !== env.FUNIL_TOKEN) {
    return Response.json({ ok: false, erro: 'não autorizado' }, { status: 401 });
  }

  if (!env.FUNIL_EVENTOS) {
    return Response.json({ ok: false, erro: 'rastreio não configurado' }, { status: 500 });
  }

  const imovel = (url.searchParams.get('imovel') ?? 'CA5635').trim();
  const formato = url.searchParams.get('formato') ?? 'html';

  const eventos = await coletaEventos(env, imovel);
  const funil = montaFunil(eventos);
  const leads = montaLeads(eventos);

  if (formato === 'json') {
    const bruto = Object.fromEntries(funil.map((f) => [f.etapa, f.chegaram]));
    return Response.json({ ok: true, imovel, funil, leads, bruto });
  }

  const atualizadoEm = formataDataHora(Date.now());
  const html = paginaHtml({ imovel, funil, leads, atualizadoEm });
  return new Response(html, {
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' },
  });
}
