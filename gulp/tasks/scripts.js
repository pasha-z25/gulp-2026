import { build } from 'esbuild';

import config from '../config.js';

export const scripts = async () => {
    await build({
        entryPoints: config.scripts.entries,
        outdir: config.paths.dist.scripts,
        ...config.scripts.esbuild,
    });
};