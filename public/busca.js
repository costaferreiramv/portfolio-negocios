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

  // Código de referência do imóvel (ex.: CA6574, AP8011): duas letras + 4 dígitos.
  // Quando citado, o cliente já sabe exatamente o que quer — nenhum outro critério
  // é lido, e o resultado é só aquele(s) imóvel(is), nunca uma lista ampla.
  function extraiCodigos(q) {
    const m = q.match(/\b[A-Za-z]{2}\d{4}\b/g);
    return m ? Array.from(new Set(m.map((c) => c.toUpperCase()))) : [];
  }

  function interpreta(q) {
    const codigos = extraiCodigos(q);
    if (codigos.length) return { codigos };

    const t = norm(q);
    const f = {};

    // tipo
    for (const [k, v] of Object.entries(TIPOS)) {
      if (new RegExp('\\b' + k + '\\b').test(t)) { f.tipo = v; break; }
    }

    // condomínio: "não necessariamente em condomínio" = sem preferência (não filtra);
    // "sem/fora de condomínio" = excluir; "em condomínio" = exigir
    if (/condomini/.test(t)) {
      if (/nao necessariamente/.test(t)) {
        // sem preferência — não define f.cond, não filtra
      } else if (/(sem|nao|fora)\s+(?:necessariamente\s+)?(?:em\s+|de\s+)?condomini/.test(t)) {
        f.cond = 'nao';
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

    // área: "120 m²", "120 metros", "120m2". O qualificador (min/máx) é lido só na
    // janela imediatamente antes do número — senão um "até" do preço contamina a área.
    const areaM = t.match(/(\d+(?:[.,]\d+)?)\s*(?:m2|m²|metros?)/);
    if (areaM) {
      const a = parseFloat(areaM[1].replace(',', '.'));
      const antes = t.slice(Math.max(0, areaM.index - 18), areaM.index);
      if (/(ate|no maximo|maximo|abaixo|menos de)\s*$/.test(antes)) f.areaMax = a;
      else f.areaMin = a; // "pelo menos", "a partir", "acima", "mínimo" ou sem qualificador → piso
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

    // localização: bairro/área citado filtra pelo bairro exato; apelido/marco de eixo
    // citado (ex.: "praia" para o eixo Entorno Praia Clube) filtra pelo eixo inteiro.
    // "zona sul" é a região toda — neutra, não restringe.
    // O contexto imediatamente antes do termo decide inclusão x exclusão: "perto/em/no"
    // exige a região, "longe/distante/evitar" descarta — não é a palavra que importa,
    // é o que o cliente disse sobre ela.
    const negado = (idx) =>
      /(longe|distante|evitar|nao\s+quero\s+perto|nada\s+perto)\s*(?:de|do|da)?\s*$/.test(
        t.slice(Math.max(0, idx - 24), idx)
      );

    const EIXOS = window.__EIXOS__ || [];
    f.locais = [];
    for (const b of window.__BAIRROS__ || []) {
      const nb = norm(b);
      if (nb === 'zona sul') continue;
      const m = new RegExp('\\b' + nb.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b').exec(t);
      if (!m) continue;
      const eixo = EIXOS.find((e) => e.areas.some((a) => norm(a) === nb));
      f.locais.push({ nome: nb, rotulo: b, eixo: eixo ? eixo.id : null, tipo: 'bairro', excluir: negado(m.index) });
    }
    // apelidos/marcos de eixo que não são um bairro específico cadastrado
    const APELIDOS_EIXO = {
      praia: 'praia-clube', 'praia clube': 'praia-clube',
      karaiba: 'karaiba', cajuba: 'karaiba',
      vinhedos: 'vinhedos',
      colina: 'colina',
      landscape: 'landscape',
    };
    for (const [apelido, eixoId] of Object.entries(APELIDOS_EIXO)) {
      const m = new RegExp('\\b' + apelido + '\\b').exec(t);
      if (!m || f.locais.some((l) => l.eixo === eixoId)) continue;
      const eixo = EIXOS.find((e) => e.id === eixoId);
      f.locais.push({ nome: null, rotulo: eixo ? eixo.nome : apelido, eixo: eixoId, tipo: 'eixo', excluir: negado(m.index) });
    }
    return f;
  }

  // Critérios "duros" (atributos objetivos do imóvel), do mais descartável ao mais essencial.
  // Cada um só é exigido se o usuário o mencionou. Usados no relaxamento progressivo.
  const DUROS = [
    { k: 'vaga', ok: (im, f) => im.vagas >= f.vaga, ativo: (f) => f.vaga },
    { k: 'area', ok: (im, f) => (!f.areaMin || im.area >= f.areaMin) && (!f.areaMax || im.area <= f.areaMax), ativo: (f) => f.areaMin || f.areaMax },
    { k: 'suite', ok: (im, f) => im.suites >= f.suite, ativo: (f) => f.suite },
    { k: 'preco', ok: (im, f) => (!f.precoMin || im.preco >= f.precoMin) && (!f.precoMax || im.preco <= f.precoMax), ativo: (f) => f.precoMin || f.precoMax },
    { k: 'dorm', ok: (im, f) => im.dormitorios >= f.dorm, ativo: (f) => f.dorm },
    { k: 'cond', ok: (im, f) => (f.cond === 'sim' ? im.condominio : f.cond === 'nao' ? !im.condominio : true), ativo: (f) => f.cond === 'sim' || f.cond === 'nao' },
    { k: 'tipo', ok: (im, f) => im.tipo === f.tipo, ativo: (f) => f.tipo },
  ];

  // Pontua a proximidade de um imóvel aos locais citados (mesmo bairro > mesmo eixo).
  function scoreLocal(im, f) {
    if (!f.locais || !f.locais.length) return 0;
    let s = 0;
    const bairro = norm(im.bairro);
    for (const loc of f.locais) {
      if (loc.excluir) continue; // exclusão não pontua proximidade, só descarta (em filtrar)
      // imóveis de eixo com bairro oculto nunca casam por bairro (não revelar localização)
      if (!im.ocultaBairro && bairro === loc.nome) s += 3; // bairro/área exata
      else if (loc.eixo && im.eixo === loc.eixo) s += 2;   // mesma região (eixo)
    }
    return s;
  }

  // Aplica os critérios duros ativos; se zerar, relaxa um a um (o mais descartável primeiro)
  // até encontrar imóveis. Retorna { achados, relaxados }.
  function filtrar(f) {
    // Código de referência: identifica o imóvel com precisão — ignora todo o resto.
    if (f.codigos && f.codigos.length) {
      const achados = IMOVEIS.filter((im) => im.codigo && f.codigos.includes(im.codigo.toUpperCase()));
      return { achados, relaxados: [] };
    }
    // TODOS os critérios digitados são INEGOCIÁVEIS — nada de relaxar.
    // Mostra só o que casa exatamente com o que o cliente pediu (tipo, preço,
    // quartos, suítes, vagas, área, condomínio). Se nada bate, retorna vazio.
    const criterios = DUROS.filter((d) => d.ativo(f));
    let achados = IMOVEIS.filter((im) => criterios.every((d) => d.ok(im, f)));
    // Bairro citado filtra só DAQUELE bairro exato (imóvel de bairro oculto nunca
    // casa por bairro). Apelido/marco de eixo citado filtra pelo eixo inteiro.
    // Locais em contexto negativo ("longe de", "distante de"...) excluem, não exigem.
    const bateLocal = (im, loc) =>
      loc.tipo === 'eixo' ? im.eixo === loc.eixo : !im.ocultaBairro && norm(im.bairro) === loc.nome;
    if (f.locais && f.locais.length) {
      const incluir = f.locais.filter((l) => !l.excluir);
      const excluir = f.locais.filter((l) => l.excluir);
      achados = achados.filter(
        (im) =>
          (incluir.length === 0 || incluir.some((loc) => bateLocal(im, loc))) &&
          !excluir.some((loc) => bateLocal(im, loc))
      );
    }
    return { achados, relaxados: [] };
  }

  const brl = (n) =>
    n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  const tipoLabel = {
    casa: 'Casa', apartamento: 'Apartamento', cobertura: 'Cobertura', lote: 'Lote',
    'sala-comercial': 'Sala comercial', 'casa-comercial': 'Casa comercial',
    area: 'Área', fazenda: 'Fazenda', rancho: 'Rancho', sitio: 'Sítio',
  };

  function resumo(f) {
    const p = [];
    if (f.codigos && f.codigos.length) {
      p.push(f.codigos.length === 1 ? 'código ' + f.codigos[0] : 'códigos ' + f.codigos.join(', '));
      return p;
    }
    if (f.tipo) p.push(tipoLabel[f.tipo]);
    if (f.cond === 'sim') p.push('em condomínio');
    else if (f.cond === 'nao') p.push('fora de condomínio');
    if (f.dorm) p.push(f.dorm + '+ quartos');
    if (f.suite) p.push(f.suite + '+ suítes');
    if (f.vaga) p.push(f.vaga + '+ vagas');
    if (f.areaMin) p.push(f.areaMin + '+ m²');
    if (f.areaMax) p.push('até ' + f.areaMax + ' m²');
    if (f.precoMin && f.precoMax) p.push(brl(f.precoMin) + ' – ' + brl(f.precoMax));
    else if (f.precoMax) p.push('até ' + brl(f.precoMax));
    else if (f.precoMin) p.push('a partir de ' + brl(f.precoMin));
    if (f.locais && f.locais.length) {
      const incluir = f.locais.filter((l) => !l.excluir);
      const excluir = f.locais.filter((l) => l.excluir);
      if (incluir.length) p.push('perto de ' + incluir.map((l) => l.rotulo).join(', '));
      if (excluir.length) p.push('longe de ' + excluir.map((l) => l.rotulo).join(', '));
    }
    return p;
  }

  function card(im) {
    return (
      '<a class="card" href="' + im.url + '">' +
      '<div class="foto"><img src="' + im.capa + '" alt="' + im.titulo + '" loading="lazy">' +
      '<span class="selo">' + (tipoLabel[im.tipo] || im.tipo) + '</span>' +
      (im.codigo ? '<span class="selo-ref">' + im.codigo + '</span>' : '') +
      '</div>' +
      '<div class="card-corpo"><div class="onde">' + (im.ocultaBairro ? 'Condomínio fechado' : im.bairro) + '</div>' +
      '<h3>' + im.titulo + '</h3>' +
      '<div class="cota-mini card-cota"><span class="haste"></span><span class="num">' + im.area + ' m²</span><span class="haste"></span></div>' +
      '<div class="preco"><span class="v num">' + brl(im.preco) + '</span><span class="ir">Ver detalhes →</span></div>' +
      '</div></a>'
    );
  }

  const ROTULO_DURO = {
    vaga: 'nº de vagas', area: 'área', suite: 'nº de suítes',
    preco: 'faixa de preço', dorm: 'nº de quartos', cond: 'condomínio', tipo: 'tipo',
  };

  function buscar(q) {
    const f = interpreta(q);
    const { achados, relaxados } = filtrar(f);
    // localização não elimina: ordena os que casam os critérios, mais próximos primeiro
    achados.sort((a, b) => scoreLocal(b, f) - scoreLocal(a, f) || a.preco - b.preco);

    const partes = resumo(f);
    let msg = partes.length ? 'Entendi: ' + partes.join(' · ') : 'Mostrando toda a seleção.';
    if (f.locais && f.locais.length && achados.some((im) => scoreLocal(im, f) > 0)) {
      msg += ' · priorizando os mais próximos';
    }
    if (relaxados.length) {
      const nomes = relaxados.map((k) => ROTULO_DURO[k]);
      msg += ' — sem correspondência exata; ampliei ' + nomes.join(' e ') + ' para mostrar o mais próximo';
    }
    interp.textContent = msg;
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
