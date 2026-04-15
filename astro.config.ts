import mdx from '@astrojs/mdx';
// 1. IMPORTAMOS VERCEL EN LUGAR DE NODE
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import expressiveCode from 'astro-expressive-code';
import { loadEnv } from 'vite';
import spectre, { type GiscusMapping } from './package/src';
import { spectreDark } from './src/ec-theme';

const {
    GISCUS_REPO,
    GISCUS_REPO_ID,
    GISCUS_CATEGORY,
    GISCUS_CATEGORY_ID,
    GISCUS_MAPPING,
    GISCUS_STRICT,
    GISCUS_REACTIONS_ENABLED,
    GISCUS_EMIT_METADATA,
    GISCUS_LANG,
} = loadEnv(process.env.NODE_ENV!, process.cwd(), '');

// https://astro.build/config
const config = defineConfig({
    site: 'https://spectre.lou.gg',
    output: 'static',
    integrations: [
        expressiveCode({
            themes: [spectreDark],
        }),
        mdx(),
        sitemap(),
        spectre({
            name: 'Emilio',
            openGraph: {
                home: {
                    title: 'Emilio Barrera',
                    description: 'Portafolio de Ingeniería Mecánico',
                },
                blog: {
                    title: 'Blog',
                    description: 'News and guides for Spectre.',
                },
                projects: {
                    title: 'Projects',
                },
            },
            giscus: false,
        }),
    ],
    // 2. CONFIGURAMOS EL ADAPTADOR PARA VERCEL
    adapter: vercel(),
});

export default config;