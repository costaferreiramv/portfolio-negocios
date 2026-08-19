// Cloudflare Pages Function: registra que uma sessão alcançou uma etapa do
// funil de perguntas de uma landing page (ver lp-funil-qualificacao).
//
// Uma chave por (imóvel, sessão, etapa) — reenviar a mesma etapa da mesma
// sessão só sobrescreve a mesma chave (idempotente, não conta duas vezes).
// Contar quantas sessões distintas têm chave pra etapa N já dá o funil:
// "quantos chegaram até aqui". Ver funil-relatorio.js pra agregação.

export async function onRequestPost(context) {
  const { request, env } = context;

  let corpo;
  try {
    corpo = await request.json();
  } catch {
    return Response.json({ ok: false, erro: 'JSON inválido' }, { status: 400 });
  }

  const imovel = String(corpo?.imovel ?? '').trim();
  const sessionId = String(corpo?.sessionId ?? '').trim();
  const etapa = Number(corpo?.etapa);
  const etapaId = String(corpo?.etapaId ?? '').trim().slice(0, 60);

  if (!imovel || !sessionId || !Number.isInteger(etapa) || etapa < 0 || etapa > 20) {
    return Response.json({ ok: false, erro: 'dados inválidos' }, { status: 400 });
  }

  if (!env.FUNIL_EVENTOS) {
    console.error('Binding FUNIL_EVENTOS não configurado');
    return Response.json({ ok: false, erro: 'rastreio não configurado' }, { status: 500 });
  }

  const chave = `ev:${imovel}:${sessionId}:${String(etapa).padStart(2, '0')}`;

  try {
    const ts = Date.now();
    await env.FUNIL_EVENTOS.put(
      chave,
      JSON.stringify({ etapaId, ts }),
      {
        expirationTtl: 60 * 60 * 24 * 120, // 120 dias, suficiente pra ciclo de venda de imóvel
        // metadata vem junto no list(), sem precisar de get() por chave —
        // é o que permite o relatório montar a tabela de leads sem N+1 leitura.
        metadata: { etapaId, ts },
      }
    );
    return Response.json({ ok: true });
  } catch (erro) {
    console.error('Erro ao gravar evento de funil:', erro);
    return Response.json({ ok: false, erro: 'falha ao gravar' }, { status: 500 });
  }
}
