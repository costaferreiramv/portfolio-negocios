// Cloudflare Pages Function: agrega os eventos de funil.js num relatório por
// etapa — "quantas sessões chegaram até aqui". Protegido por chave simples
// (env FUNIL_TOKEN) pra não ficar público pra quem achar a URL: só números
// agregados, sem nome/telefone, mas ainda é dado do negócio.
//
// Uso: GET /api/funil-relatorio?imovel=CA5635&chave=SEGREDO

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
  const prefixo = `ev:${imovel}:`;

  const porEtapa = {};
  let cursor;
  let paginas = 0;
  do {
    const pagina = await env.FUNIL_EVENTOS.list({ prefix: prefixo, cursor, limit: 1000 });
    for (const item of pagina.keys) {
      const partes = item.name.split(':');
      const etapa = partes[partes.length - 1];
      porEtapa[etapa] = (porEtapa[etapa] ?? 0) + 1;
    }
    cursor = pagina.list_complete ? undefined : pagina.cursor;
    paginas += 1;
  } while (cursor && paginas < 50); // trava de segurança, não pra rodar pra sempre

  const etapasOrdenadas = Object.keys(porEtapa).sort();
  const funil = etapasOrdenadas.map((etapa, i) => {
    const chegaram = porEtapa[etapa];
    const anterior = i > 0 ? porEtapa[etapasOrdenadas[i - 1]] : chegaram;
    const abandonaramAqui = i > 0 ? anterior - chegaram : 0;
    return { etapa, chegaram, abandonaram_antes_desta: Math.max(0, abandonaramAqui) };
  });

  return Response.json({ ok: true, imovel, funil, bruto: porEtapa });
}
