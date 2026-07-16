// Cloudflare Pages Function: encaminha eventos do Pixel para a Conversions API (CAPI) da Meta.
// Dados de contato (e-mail/telefone) sempre trafegam com hash SHA-256; o token nunca chega ao front-end.

const PIXEL_ID = '3524802721153934';
const GRAPH_API_VERSION = 'v21.0';

async function sha256Hex(texto) {
  const bytes = new TextEncoder().encode(texto);
  const hash = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Normaliza para o formato exigido pela Meta: só dígitos, com código do país (assume BR).
function normalizarTelefone(telefone) {
  const digitos = telefone.replace(/\D/g, '').replace(/^0+/, '');
  if (!digitos) return '';
  return digitos.length <= 11 ? `55${digitos}` : digitos;
}

function normalizarEmail(email) {
  return email.trim().toLowerCase();
}

function lerCookie(cookieHeader, nome) {
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${nome}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

export async function onRequestPost(context) {
  const { request, env } = context;

  let corpo;
  try {
    corpo = await request.json();
  } catch {
    return Response.json({ ok: false, erro: 'JSON inválido' }, { status: 400 });
  }

  const { event_name, event_id, event_source_url, contato } = corpo ?? {};
  if (!event_name || !event_id || !event_source_url) {
    return Response.json(
      { ok: false, erro: 'event_name, event_id e event_source_url são obrigatórios' },
      { status: 400 }
    );
  }

  const token = env.META_CAPI_TOKEN;
  if (!token) {
    console.error('META_CAPI_TOKEN não configurado no ambiente');
    return Response.json({ ok: false, erro: 'CAPI não configurada' }, { status: 500 });
  }

  const cookieHeader = request.headers.get('Cookie') ?? '';
  const fbp = lerCookie(cookieHeader, '_fbp');
  const fbc = lerCookie(cookieHeader, '_fbc');
  const clientIp = request.headers.get('CF-Connecting-IP') ?? undefined;
  const userAgent = request.headers.get('User-Agent') ?? undefined;

  const userData = {
    ...(fbp ? { fbp } : {}),
    ...(fbc ? { fbc } : {}),
    ...(clientIp ? { client_ip_address: clientIp } : {}),
    ...(userAgent ? { client_user_agent: userAgent } : {}),
  };

  if (contato?.email) {
    userData.em = [await sha256Hex(normalizarEmail(contato.email))];
  }
  if (contato?.telefone) {
    const telNormalizado = normalizarTelefone(contato.telefone);
    if (telNormalizado) userData.ph = [await sha256Hex(telNormalizado)];
  }

  const payload = {
    data: [
      {
        event_name,
        event_time: Math.floor(Date.now() / 1000),
        event_id,
        event_source_url,
        action_source: 'website',
        user_data: userData,
      },
    ],
    access_token: token,
  };

  try {
    const resposta = await fetch(
      `https://graph.facebook.com/${GRAPH_API_VERSION}/${PIXEL_ID}/events`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    if (!resposta.ok) {
      console.error('Erro da Graph API:', resposta.status, await resposta.text());
      return Response.json({ ok: false, erro: 'Falha ao enviar evento' }, { status: 502 });
    }

    return Response.json({ ok: true });
  } catch (erro) {
    console.error('Erro ao chamar Graph API:', erro);
    return Response.json({ ok: false, erro: 'Falha ao enviar evento' }, { status: 502 });
  }
}
