/* ============================================================
   Sub-regiões da Zona Sul — FONTE DE VERDADE da navegação.
   ------------------------------------------------------------
   Em vez de 31 bairros soltos no menu, os imóveis se agrupam
   em poucos EIXOS. Cada imóvel herda sua sub-região do bairro,
   automaticamente, por este mapa.

   >>> MARCUS: é aqui que você corrige a geografia. <<<
   Para mover um bairro de eixo, troque o id na coluna direita.
   Para criar/renomear um eixo, edite SUBREGIOES.
   Bairros marcados com  // ? CONFERIR  são palpite meu — a
   pesquisa não confirmou o eixo. Os demais vêm de fonte oficial
   (Prefeitura de Uberlândia + Wikipédia da Zona Sul).
   ============================================================ */

export interface SubRegiao {
  id: string;
  nome: string;
  descricao: string;
}

/** Os eixos, na ordem em que aparecem no site. */
export const SUBREGIOES: SubRegiao[] = [
  {
    id: 'gavea',
    nome: 'Eixo Gávea',
    descricao:
      'O vetor de expansão nobre da Zona Sul: condomínios verticais e horizontais em torno do Parque Gávea e do Uberlândia Shopping.',
  },
  {
    id: 'karaiba',
    nome: 'Eixo Karaíba',
    descricao:
      'Um dos endereços mais valorizados da cidade — bairro-jardim de condomínios fechados, clubes e comércio de vizinhança.',
  },
  {
    id: 'colina',
    nome: 'Morada da Colina e entorno',
    descricao:
      'Área tradicional de alto padrão às margens do Uberabinha, arborizada e a poucos minutos de tudo.',
  },
  {
    id: 'consolidados',
    nome: 'Bairros consolidados',
    descricao:
      'Bairros estabelecidos da Zona Sul, próximos à UFU e aos principais eixos de comércio e serviço.',
  },
];

/** bairro (exatamente como no frontmatter do imóvel) -> id da sub-região. */
export const BAIRRO_SUBREGIAO: Record<string, string> = {
  // ---- Eixo Gávea (fonte: Gávea integra Gávea Paradiso, Tamboré) ----
  'Gávea': 'gavea',
  'Gávea Jardins': 'gavea',
  'Villa Gávea': 'gavea',
  'Cond. Gávea Paradiso': 'gavea',
  'Cond. Tamboré': 'gavea',
  'Cond. Arts': 'gavea',              // ? CONFERIR
  'Cond. Splêndido': 'gavea',         // ? CONFERIR
  'Cond. Quality Residence': 'gavea', // ? CONFERIR
  'Cond. Varanda Sul': 'gavea',       // ? CONFERIR
  'Parque Una': 'gavea',              // ? CONFERIR (empreendimento novo, vetor sul)
  'Jardim Botânico': 'gavea',         // ? CONFERIR

  // ---- Eixo Karaíba (fonte: Karaíba integra City Uberlândia,
  //      Cyrela Buritis, Terras Altas, The Palms, Jardim das Acácias) ----
  'Jardim Karaíba': 'karaiba',
  'Jardim Sul': 'karaiba',
  'Jardim das Acácias': 'karaiba',
  'City Uberlândia': 'karaiba',
  'Cond. Cyrela Buritis': 'karaiba',
  'Cond. Terras Altas': 'karaiba',
  'Cond. The Palms': 'karaiba',
  'Cond. Jardim Versailles': 'karaiba', // ? CONFERIR

  // ---- Morada da Colina e entorno (fonte: Morada da Colina integra
  //      Altamira, Jardim da Colina; Patrimônio integra Copacabana) ----
  'Morada da Colina': 'colina',
  'Altamira': 'colina',
  'Jardim Colina': 'colina',
  'Patrimônio': 'colina',
  'Copacabana': 'colina',
  'Cidade Jardim': 'colina',          // ? CONFERIR (vizinho de Gávea/Tubalina)

  // ---- Bairros consolidados (próximos à UFU / comércio) ----
  'Santa Maria': 'consolidados',      // fonte: ~800 m da UFU
  'Saraiva': 'consolidados',          // ? CONFERIR
  'Vigilato Pereira': 'consolidados', // ? CONFERIR
  'Tubalina': 'consolidados',
  'Nova Uberlândia': 'consolidados',
  'Itapema Sul': 'consolidados',      // ? CONFERIR
};

/** Sub-região de um bairro; 'consolidados' como padrão seguro. */
export function subregiaoDe(bairro: string): string {
  return BAIRRO_SUBREGIAO[bairro] ?? 'consolidados';
}

/** Todos os bairros mapeados a um dado eixo (para páginas de território). */
export function bairrosDoEixo(id: string): string[] {
  return Object.entries(BAIRRO_SUBREGIAO)
    .filter(([, eixo]) => eixo === id)
    .map(([bairro]) => bairro)
    .sort((a, b) => a.localeCompare(b, 'pt-BR'));
}
