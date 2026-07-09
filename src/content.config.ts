import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const imoveis = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/imoveis' }),
  schema: z.object({
    titulo: z.string(),
    tipo: z.enum(['apartamento', 'casa', 'cobertura', 'lote']),
    bairro: z.string(),
    condominio: z.string().optional(),
    preco: z.number(),
    areaUtil: z.number(),
    dormitorios: z.number(),
    suites: z.number(),
    vagas: z.number(),
    aceitaFinanciamento: z.boolean().default(false),
    aceitaPermuta: z.boolean().default(false),
    publicadoEm: z.coerce.date(),
    // nome da pasta em src/assets/imoveis com as fotos
    fotos: z.string(),
    // número da foto usada como capa (sufixo do arquivo)
    capa: z.number().default(1),
  }),
});

export const collections = { imoveis };
