import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { EIXO_IDS } from './lib/eixos';

const imoveis = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/imoveis' }),
  schema: z.object({
    titulo: z.string(),
    // código de referência no sistema Polo/Kenlo (ex.: AP7245, CA6375, CO0254).
    // Exibido na página para o cliente informar ao corretor e localizar o imóvel
    // (endereço, dados do proprietário) no sistema. Obrigatório em imóveis novos.
    codigo: z.string().optional(),
    tipo: z.enum([
      'apartamento', 'casa', 'cobertura', 'lote',
      'sala-comercial', 'casa-comercial', 'area', 'fazenda', 'rancho', 'sitio',
    ]),
    bairro: z.string(),
    // eixo de navegação — ver src/lib/eixos.ts
    eixo: z.enum(EIXO_IDS),
    // está em condomínio? (só flag de busca — o NOME do edifício/condomínio nunca é exposto)
    condominio: z.boolean().optional(),
    // valor mensal do condomínio em R$, exibido na Ficha do Imóvel.
    // NÃO preencher quando ausente ou informado como 1,00 (placeholder do Kenlo).
    taxaCondominio: z.number().optional(),
    preco: z.number(),
    areaUtil: z.number(),
    // área do terreno — relevante para casas; omitir em apartamentos
    areaTerreno: z.number().optional(),
    dormitorios: z.number(),
    suites: z.number(),
    vagas: z.number(),
    // opcionais: quando não informados pelo proprietário, não afirmar nada
    aceitaFinanciamento: z.boolean().optional(),
    aceitaPermuta: z.boolean().optional(),
    publicadoEm: z.coerce.date(),
    // nome da pasta em src/assets/imoveis com as fotos
    fotos: z.string(),
    // número da foto usada como capa (sufixo do arquivo)
    capa: z.number().default(1),
  }),
});

export const collections = { imoveis };
