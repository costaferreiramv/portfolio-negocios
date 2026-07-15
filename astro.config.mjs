// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // domínio canônico = apex (o www faz 301 → apex); canonical/OG/sitemap seguem daqui
  site: 'https://portfolionegocios.com.br',
  integrations: [sitemap()],
});