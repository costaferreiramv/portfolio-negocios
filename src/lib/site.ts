import type { ImageMetadata } from 'astro';

/** Dados de contato — fonte única, usados no rodapé e na página de contato. */
export const CONTATO = {
  whatsappNum: '5534996396869',
  whatsappLabel: '(34) 99639-6869',
  telefone: '(34) 99925-6661',
  telefoneHref: 'tel:+5534999256661',
  email: 'contato@portfolionegocios.com.br',
  instagram: 'https://instagram.com/marcus.imoveis',
  tiktok: 'https://www.tiktok.com/@marcus.imoveis',
  creci: 'CRECI 42.766',
  cnpj: 'CNPJ 08.869.898/0001-40',
  razao: 'Portfólio Negócios Imobiliários LTDA ME',
  cidade: 'Uberlândia — MG',
};

/** Monta um link de WhatsApp com mensagem pré-preenchida. */
export function waLink(mensagem: string): string {
  return `https://wa.me/${CONTATO.whatsappNum}?text=${encodeURIComponent(mensagem)}`;
}

/** Imagens da Zona Sul (aéreas do site atual), por nome de arquivo. */
const imagensZonaSul = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/zonasul/*.{png,jpg,jpeg,webp}',
  { eager: true }
);

export function imagemZonaSul(arquivo: string): ImageMetadata {
  const achado = Object.entries(imagensZonaSul).find(([caminho]) =>
    caminho.endsWith('/' + arquivo)
  );
  return (achado ? achado[1] : Object.values(imagensZonaSul)[0]).default;
}
