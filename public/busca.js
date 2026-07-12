/* Busca em linguagem natural na Home.
   Lê window.__IMOVEIS__ (embutido pelo Astro), interpreta o texto do usuário
   e filtra. Heurística — não é IA — mas cobre os padrões usuais de busca. */
(function () {
  const IMOVEIS = window.__IMOVEIS__ || [];
  const form = document.getElementById('form-busca');
  const input = document.getElementById('q');
  const secao = document.getElementById('resultados');
  const grade = document.getElementById('res-grade');
  const vazio = document.getElementById('res-vazio');
  const interp = document.getElementById('res-interp');
  const resTitulo = document.getElementById('res-titulo');
  const limpar = document.getElementById('limpar');
  if (!form || !IMOVEIS.length) return;

  const norm = (s) =>
    (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

  const TIPOS = {
    casa: 'casa', casas: 'casa', sobrado: 'casa',
    apartamento: 'apartamento', apartamentos: 'apartamento', ape: 'apartamento', apto: 'apartamento',
    cobertura: 'cobertura', coberturas: 'cobertura',
    lote: 'lote', lotes: 'lote', terreno: 'lote',
  };

  // "870 mil", "1,2 milhões", "1.2 mi", "1200000", "R$ 900 mil".
  // Ordem importa: "mil" antes de "mi" (senão "mi" casa dentro de "mil").
  function valores(txt) {
    const out = [];
    const re = /(\d+(?:[.,]\d+)?)\s*(milhoes|milhao|milh|mil|mi|k)?\b/gi;
    let m;
    while ((m = re.exec(txt)) !== null) {
      let n = parseFloat(m[1].replace(/\.(?=\d{3}\b)/g, '').replace(',', '.'));
      const u = norm(m[2] || '');
      if (u === 'mil' || u === 'k') n *= 1e3;
      else if (u.startsWith('milh') || u === 'mi') n *= 1e6;
      if (u) out.push(n);
      else if (n >= 10000) out.push(n); // número cru grande = preço
    }
    return out;
  }

  function interpreta(q) {
    const t = norm(q);
    const f = {};

    // tipo
    for (const [k, v] of Object.entries(TIPOS)) {
      if (new RegExp('\\b' + k + '\\b').test(t)) { f.tipo = v; break; }
    }

    // condomínio: "sem condomínio" / "não ... condomínio" = excluir; "em condomínio" = exigir
    if (/condomini/.test(t)) {
      if (/(sem|nao|fora)\s+(?:necessariamente\s+)?(?:em\s+|de\s+)?condomini/.test(t) || /nao necessariamente/.test(t)) {
        f.cond = 'qualquer';
      } else if (/(em|de|no)\s+condomini/.test(t)) {
        f.cond = 'sim';
      }
    }

    // quartos / dormitórios
    let m = t.match(/(\d+)\s*(?:quartos?|dormitorios?|dorms?)/);
    if (m) f.dorm = parseInt(m[1], 10);
    // suítes
    m = t.match(/(\d+)\s*suites?/);
    if (m) f.suite = parseInt(m[1], 10);
    // vagas
    m = t.match(/(\d+)\s*vagas?/);
    if (m) f.vaga = parseInt(m[1], 10);

    // área: "120 m²", "120 metros", "120m2"
    const areaM = t.match(/(\d+(?:[.,]\d+)?)\s*(?:m2|m²|metros?)/);
    if (areaM) {
      const a = parseFloat(areaM[1].replace(',', '.'));
      if (/ate|maximo|no maximo|abaixo/.test(t)) f.areaMax = a;
      else f.areaMin = a; // "pelo menos", "mínimo", "acima", ou sem qualificador
    }

    // preço: faixa "entre X e Y", "de X a Y", ou "até Y", "a partir de X"
    // isola o trecho de preço para não confundir com área
    const tPreco = t.replace(/(\d+(?:[.,]\d+)?)\s*(?:m2|m²|metros?)/g, ' ');
    const vs = valores(tPreco).filter((v) => v >= 10000);
    if (/entre|de\s+.*\s+a\s+|faixa/.test(tPreco) && vs.length >= 2) {
      f.precoMin = Math.min(vs[0], vs[1]);
      f.precoMax = Math.max(vs[0], vs[1]);
    } else if (/ate|maximo|no maximo|abaixo/.test(tPreco) && vs.length) {
      f.precoMax = Math.max(...vs);
    } else if (/(a partir|acima|mais de|minimo)/.test(tPreco) && vs.length) {
      f.precoMin = Math.min(...vs);
    } else if (vs.length >= 2) {
      f.precoMin = Math.min(...vs); f.precoMax = Math.max(...vs);
    } else if (vs.length === 1) {
      f.precoMax = vs[0]; // um valor só = teto
    }

    // texto livre para bairro/eixo (casa com o campo bairro/eixo do imóvel)
    f.termos = t;
    return f;
  }

  function combina(im, f) {
    if (f.tipo && im.tipo !== f.tipo) return false;
    if (f.cond === 'sim' && !im.condominio) return false;
    if (f.cond === 'nao' && im.condominio) return false;
    if (f.dorm && im.dormitorios < f.dorm) return false;
    if (f.suite && im.suites < f.suite) return false;
    if (f.vaga && im.vagas < f.vaga) return false;
    if (f.areaMin && im.area < f.areaMin) return false;
    if (f.areaMax && im.area > f.areaMax) return false;
    if (f.precoMin && im.preco < f.precoMin) return false;
    if (f.precoMax && im.preco > f.precoMax) return false;
    // bairro/eixo mencionado no texto?
    const alvo = norm(im.bairro + ' ' + im.eixo + ' ' + im.titulo);
    // só aplica se o usuário citou um bairro conhecido (evita filtrar por palavras genéricas)
    for (const b of window.__BAIRROS__ || []) {
      if (f.termos.includes(norm(b))) {
        if (!alvo.includes(norm(b))) return false;
      }
    }
    return true;
  }

  const brl = (n) =>
    n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  const tipoLabel = { casa: 'Casa', apartamento: 'Apartamento', cobertura: 'Cobertura', lote: 'Lote' };

  function resumo(f) {
    const p = [];
    if (f.tipo) p.push(tipoLabel[f.tipo]);
    if (f.cond === 'sim') p.push('em condomínio');
    if (f.dorm) p.push(f.dorm + '+ quartos');
    if (f.suite) p.push(f.suite + '+ suítes');
    if (f.vaga) p.push(f.vaga + '+ vagas');
    if (f.areaMin) p.push(f.areaMin + '+ m²');
    if (f.areaMax) p.push('até ' + f.areaMax + ' m²');
    if (f.precoMin && f.precoMax) p.push(brl(f.precoMin) + ' – ' + brl(f.precoMax));
    else if (f.precoMax) p.push('até ' + brl(f.precoMax));
    else if (f.precoMin) p.push('a partir de ' + brl(f.precoMin));
    return p;
  }

  function card(im) {
    return (
      '<a class="card" href="' + im.url + '">' +
      '<div class="foto"><img src="' + im.capa + '" alt="' + im.titulo + '" loading="lazy">' +
      '<span class="selo">' + (tipoLabel[im.tipo] || im.tipo) + '</span></div>' +
      '<div class="card-corpo"><div class="onde">' + im.bairro + '</div>' +
      '<h3>' + im.titulo + '</h3>' +
      '<div class="cota-mini card-cota"><span class="haste"></span><span class="num">' + im.area + ' m²</span><span class="haste"></span></div>' +
      '<div class="preco"><span class="v num">' + brl(im.preco) + '</span><span class="ir">Ver detalhes →</span></div>' +
      '</div></a>'
    );
  }

  function buscar(q) {
    const f = interpreta(q);
    const achados = IMOVEIS.filter((im) => combina(im, f));
    const partes = resumo(f);
    interp.textContent = partes.length ? 'Entendi: ' + partes.join(' · ') : 'Mostrando toda a seleção.';
    resTitulo.textContent =
      achados.length + (achados.length === 1 ? ' imóvel encontrado' : ' imóveis encontrados');
    grade.innerHTML = achados.map(card).join('');
    vazio.hidden = achados.length > 0;
    grade.hidden = achados.length === 0;
    secao.hidden = false;
    secao.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (q) buscar(q);
  });
  limpar?.addEventListener('click', () => {
    input.value = '';
    secao.hidden = true;
    input.focus();
  });
})();
