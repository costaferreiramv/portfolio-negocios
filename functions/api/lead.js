// Cloudflare Pages Function: recebe o lead das landing pages de funil.
// Diferente de /api/contato, aqui o e-mail é opcional (o contato que importa é o
// WhatsApp) e o corpo carrega as respostas da qualificação.

const DESTINATARIO = 'contato@portfolionegocios.com.br';
const REMETENTE = 'Portfólio Negócios <site@mail.portfolionegocios.com.br>';

function escaparHtml(texto) {
  return String(texto).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Faixa de temperatura, para o assunto do e-mail dizer a urgência de cara. */
function temperatura(score) {
  if (score >= 70) return 'QUENTE';
  if (score >= 40) return 'MORNO';
  return 'FRIO';
}

export async function onRequestPost(context) {
  const { request, env } = context;

  let corpo;
  try {
    corpo = await request.json();
  } catch {
    return Response.json({ ok: false, erro: 'JSON inválido' }, { status: 400 });
  }

  const nome = (corpo?.nome ?? '').toString().trim();
  const telefone = (corpo?.telefone ?? '').toString().trim();
  const email = (corpo?.email ?? '').toString().trim();
  const imovel = (corpo?.imovel ?? 'não informado').toString().trim();
  const score = Number.isFinite(Number(corpo?.score)) ? Number(corpo.score) : 0;
  const respostas = Array.isArray(corpo?.respostas) ? corpo.respostas : [];

  if (!nome || telefone.replace(/\D/g, '').length < 10) {
    return Response.json(
      { ok: false, erro: 'nome e telefone são obrigatórios' },
      { status: 400 }
    );
  }

  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY não configurado no ambiente');
    return Response.json({ ok: false, erro: 'Envio de e-mail não configurado' }, { status: 500 });
  }

  const faixa = temperatura(score);
  const linhas = respostas
    .map((r) => `- ${(r?.resposta ?? '').toString()}`)
    .filter((l) => l.length > 2);

  const assunto = `Lead ${faixa} (${score}) — ${nome} — ${imovel}`;
  const texto = [
    `Nome: ${nome}`,
    `WhatsApp: ${telefone}`,
    `E-mail: ${email || '(não informado)'}`,
    `Imóvel: ${imovel}`,
    `Temperatura: ${faixa} — ${score}/100`,
    '',
    'Respostas:',
    ...linhas,
  ].join('\n');

  const html = `
    <p><strong>${escaparHtml(faixa)}</strong> — ${score}/100</p>
    <p><strong>Nome:</strong> ${escaparHtml(nome)}</p>
    <p><strong>WhatsApp:</strong> ${escaparHtml(telefone)}</p>
    <p><strong>E-mail:</strong> ${escaparHtml(email || '(não informado)')}</p>
    <p><strong>Imóvel:</strong> ${escaparHtml(imovel)}</p>
    <p><strong>Respostas:</strong></p>
    <ul>${linhas.map((l) => `<li>${escaparHtml(l.slice(2))}</li>`).join('')}</ul>
  `;

  try {
    const resposta = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: REMETENTE,
        to: [DESTINATARIO],
        ...(email ? { reply_to: email } : {}),
        subject: assunto,
        text: texto,
        html,
      }),
    });

    if (!resposta.ok) {
      console.error('Erro da Resend API:', resposta.status, await resposta.text());
      return Response.json({ ok: false, erro: 'Falha ao enviar e-mail' }, { status: 502 });
    }

    return Response.json({ ok: true });
  } catch (erro) {
    console.error('Erro ao chamar Resend API:', erro);
    return Response.json({ ok: false, erro: 'Falha ao enviar e-mail' }, { status: 502 });
  }
}
