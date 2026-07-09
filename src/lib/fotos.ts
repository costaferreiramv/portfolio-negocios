import type { ImageMetadata } from 'astro';

const todas = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/imoveis/**/*.{jpg,jpeg,png,webp}',
  { eager: true }
);

/** Fotos de um imóvel, em ordem natural (…-2 antes de …-10).
 *  Se `capa` for informada, essa foto vem primeiro. */
export function fotosDe(pasta: string, capa?: number): ImageMetadata[] {
  const entradas = Object.entries(todas)
    .filter(([caminho]) => caminho.includes(`/imoveis/${pasta}/`))
    .sort(([a], [b]) =>
      a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
    );
  if (capa !== undefined) {
    const re = new RegExp(`-${capa}\\.(jpg|jpeg|png|webp)$`);
    entradas.sort(([a], [b]) => Number(re.test(b)) - Number(re.test(a)));
  }
  return entradas.map(([, mod]) => mod.default);
}

/** Capa do imóvel: foto cujo nome termina no número indicado. */
export function capaDe(pasta: string, numero: number): ImageMetadata {
  const alvo = Object.entries(todas).find(
    ([caminho]) =>
      caminho.includes(`/imoveis/${pasta}/`) &&
      new RegExp(`-${numero}\\.(jpg|jpeg|png|webp)$`).test(caminho)
  );
  return (alvo ? alvo[1] : Object.values(todas)[0]).default;
}

export function precoBR(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(valor);
}
