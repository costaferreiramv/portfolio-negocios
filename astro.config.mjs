// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // domínio canônico = apex (o www faz 301 → apex); canonical/OG/sitemap seguem daqui
  site: 'https://portfolionegocios.com.br',
  integrations: [
    sitemap({
      /* As landing pages de funil apontam canonical para a ficha do imóvel.
         Pedir a indexação delas no sitemap seria sinal contraditório: quem
         deve aparecer na busca é a ficha. */
      filter: (pagina) => !pagina.includes('/casa-terrea-morada-da-colina/'),
    }),
  ],
});