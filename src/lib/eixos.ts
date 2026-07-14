/* ============================================================
   Eixos da Zona Sul — FONTE DE VERDADE da navegação.
   ------------------------------------------------------------
   Definição do Marcus (2026-07). Diferente de um mapa por
   bairro: dois eixos são definidos pelo TIPO do imóvel, não
   pela geografia —
     • "Condomínios Horizontais" reúne casas em condomínio de
       qualquer bairro;
     • "Complexo Landscape…" reúne os prédios daquele entorno,
       separados dos condomínios.
   Por isso cada IMÓVEL declara seu eixo no frontmatter
   (campo `eixo`), em vez de herdá-lo do bairro. A ordem deste
   array é a ordem em que os eixos aparecem no site.
   ============================================================ */

export interface Eixo {
  id: string;
  nome: string;
  /** Nome curto para menus e chips. */
  curto: string;
  descricao: string;
  /** Bairros/áreas que o eixo engloba (tags no cartão de território).
   *  Vazio nos eixos transversais, que não se definem por bairro. */
  areas: string[];
  /** Arquivo de imagem em src/assets/zonasul usado no cartão do eixo. */
  imagem: string;
  /** Quando true, o bairro dos imóveis deste eixo NÃO é exibido em lugar
   *  nenhum (card, ficha, título, meta) — vale para todo imóvel atual ou
   *  futuro do eixo. Regra do Marcus: em condomínios, o histórico do bairro
   *  não define o imóvel, e alguns bairros carregam estigma indevido. */
  ocultaBairro?: boolean;
}

export const EIXOS: Eixo[] = [
  {
    id: 'horizontais',
    nome: 'Condomínios Horizontais',
    curto: 'Condomínios Horizontais',
    descricao:
      'Todas as casas em condomínio fechado da Zona Sul, reunidas em um só lugar — independentemente do bairro em que estão.',
    areas: [],
    imagem: 'zona-sul-1.png',
    ocultaBairro: true,
  },
  {
    id: 'landscape',
    nome: 'Complexo Landscape, Parque Una e Villa Gávea',
    curto: 'Landscape · Parque Una · Villa Gávea',
    descricao:
      'Imóveis em prédios no entorno da avenida que reúne o Complexo Landscape, o Parque Una e a Villa Gávea.',
    areas: ['Jardim Sul', 'Parque Una', 'Villa Gávea', 'Laranjeiras'],
    imagem: 'parque-una-alt.jpeg',
  },
  {
    id: 'vinhedos',
    nome: 'Complexo Vinhedos',
    curto: 'Complexo Vinhedos',
    descricao:
      'Imóveis dentro do complexo e no entorno da Avenida dos Vinhedos.',
    areas: ['Pátio Vinhedos', 'Triad', 'Sense', 'Duo', 'Arven', 'Allma', 'Mellie', 'Torres do Sul', 'Ambar'],
    imagem: 'vinhedos.jpg',
  },
  {
    id: 'colina',
    nome: 'Eixo Colina',
    curto: 'Eixo Colina',
    descricao:
      'Área tradicional de alto padrão às margens do Uberabinha.',
    areas: ['Morada da Colina', 'Jardim Colina', 'Altamira II', 'Gávea'],
    imagem: 'zona-sul-4.jpg',
  },
  {
    id: 'praia-clube',
    nome: 'Entorno Praia Clube',
    curto: 'Entorno Praia Clube',
    descricao:
      'Bairros estabelecidos no entorno do Praia Clube, com comércio e serviços à mão.',
    areas: ['Cidade Jardim', 'Tubalina', 'Patrimônio', 'Copacabana', 'Nova Uberlândia', 'Maracanã'],
    imagem: 'praia-clube.webp',
  },
  {
    id: 'karaiba',
    nome: 'Eixo Grande Karaíba e Entorno Cajubá',
    curto: 'Grande Karaíba · Cajubá',
    descricao:
      'Um dos vetores mais valorizados da cidade, do Jardim Karaíba ao entorno do Cajubá.',
    areas: [
      'Jardim Karaíba', 'City Uberlândia', 'Itapema Sul', 'Jardim das Acácias',
      'Jardim Inconfidência', 'Vigilato Pereira', 'Saraiva', 'Santa Maria', 'Jardim Botânico',
    ],
    imagem: 'karaiba.jpeg',
  },
];

/** Ids válidos, para o schema de conteúdo. */
export const EIXO_IDS = ['horizontais', 'landscape', 'vinhedos', 'colina', 'praia-clube', 'karaiba'] as const;

export function eixoPorId(id: string): Eixo | undefined {
  return EIXOS.find((e) => e.id === id);
}

/** O bairro de imóveis deste eixo deve ficar oculto em todo o site? */
export function eixoOcultaBairro(id: string): boolean {
  return !!eixoPorId(id)?.ocultaBairro;
}
