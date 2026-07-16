// Cloudflare Pages Function: envia o formulário de contato direto por e-mail (Resend API),
// sem depender do app de e-mail do visitante.

const DESTINATARIO = 'contato@portfolionegocios.com.br';
const REMETENTE = 'Portfólio Negócios <site@portfolionegocios.com.br>';

function escaparHtml(texto) {
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export async function onRequestPost(context) {
  const { request, env } = context;

  let corpo;
  try {
    corpo = await request.json();
  } catch {
    return Response.json({ ok: false, erro: 'JSON inválido' }, { status: 400 });
  }

  const nome = (corpo?.nome ?? '').trim();
  const email = (corpo?.email ?? '').trim();
  const telefone = (corpo?.telefone ?? '').trim();
  const mensagem = (corpo?.mensagem ?? '').trim();

  if (!nome || !email || !mensagem) {
    return Response.json(
      { ok: false, erro: 'nome, email e mensagem são obrigatórios' },
      { status: 400 }
    );
  }

  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY não configurado no ambiente');
    return Response.json({ ok: false, erro: 'Envio de e-mail não configurado' }, { status: 500 });
  }

  const assunto = `Contato pelo site — ${nome}`;
  const texto = `Nome: ${nome}\nE-mail: ${email}\nTelefone: ${telefone || '(não informado)'}\n\n${mensagem}`;
  const html = `
    <p><strong>Nome:</strong> ${escaparHtml(nome)}</p>
    <p><strong>E-mail:</strong> ${escaparHtml(email)}</p>
    <p><strong>Telefone:</strong> ${escaparHtml(telefone || '(não informado)')}</p>
    <p><strong>Mensagem:</strong><br>${escaparHtml(mensagem).replace(/\n/g, '<br>')}</p>
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
        reply_to: email,
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
