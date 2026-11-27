// Envia o lead do site para o CRM (servidor para servidor). Nunca derruba o formulário:
// se o CRM falhar, o e-mail continua sendo enviado.
const CRM_URL = 'https://crm.portfolionegocios.com.br/api/entrada';

export async function enviarAoCrm(env, dados) {
  if (!env.CRM_ENTRADA_TOKEN) {
    console.error('CRM_ENTRADA_TOKEN não configurado no ambiente');
    return false;
  }
  try {
    const r = await fetch(CRM_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.CRM_ENTRADA_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) console.error('CRM recusou o lead:', r.status, await r.text());
    return r.ok;
  } catch (erro) {
    console.error('Erro ao enviar lead ao CRM:', erro);
    return false;
  }
}
