// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';

/* Fichas com `listado: false` só abrem pelo link direto: ficam fora do sitemap. */
const PASTA = new URL('./src/content/imoveis/', import.meta.url);
const foraDaLista = new Set(
  fs.readdirSync(PASTA)
    .filter((f) => f.endsWith('.md') && /^listado:\s*false\s*$/m.test(fs.readFileSync(new URL(f, PASTA), 'utf8')))
    .map((f) => `/imovel/${f.slice(0, -3)}/`),
);

// https://astro.build/config
export default defineConfig({
  // domínio canônico = apex (o www faz 301 → apex); canonical/OG/sitemap seguem daqui
  site: 'https://portfolionegocios.com.br',
  integrations: [
    sitemap({
      /* As landing pages de funil apontam canonical para a ficha do imóvel.
         Pedir a indexação delas no sitemap seria sinal contraditório: quem
         deve aparecer na busca é a ficha. */
      filter: (pagina) => !pagina.includes('/casa-terrea-morada-da-colina/') && !foraDaLista.has(new URL(pagina).pathname),
    }),
  ],
});