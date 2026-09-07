import { isDevelopment, isProduction } from './utils/environment.js';

const paths = {
    src: {
        root: './src',
        html: './src/html',
        styles: './src/scss',
        scripts: './src/js',
        images: './src/images',
        fonts: './src/fonts',
        assets: './src/assets',
    },

    dist: {
        root: './dist',
        html: './dist',
        styles: './dist/css',
        scripts: './dist/js',
        images: './dist/images',
        fonts: './dist/fonts',
        assets: './dist/assets',
    },
};

const config = {
    paths,

    server: {
        port: 3000,
        open: true,
    },

    html: {
        entries: [`${paths.src.html}/**/*.html`],
    },

    styles: {
        entries: [`${paths.src.styles}/main.scss`],
    },

    scripts: {
        entries: [`${paths.src.scripts}/main.js`],

        esbuild: {
            bundle: true,
            format: 'esm',
            target: 'es2020',
            sourcemap: isDevelopment,
            minify: isProduction,
        },
    },

    images: {
        optimize: true,

        formats: {
            webp: {
                enabled: true,
                quality: 80,
            },

            avif: {
                enabled: true,
                quality: 65,
            },
        },
    },

    fonts: {
        convert: true,

        formats: {
            woff: true,
            woff2: true,
        },

        generateCss: true,

        css: {
            output: `${paths.dist.styles}/fonts.css`,
        },
    },

    assets: {
        entry: `${paths.src.assets}/**/*`,
    },

    watch: {
        html: `${paths.src.html}/**/*.html`,
        styles: `${paths.src.styles}/**/*.{scss,sass,css}`,
        scripts: `${paths.src.scripts}/**/*.js`,
        assets: `${paths.src.assets}/**/*`,
    },

    development: {
        sourcemaps: true,
        minify: false,
    },

    production: {
        sourcemaps: false,
        minify: true,
    },
};

export default config;