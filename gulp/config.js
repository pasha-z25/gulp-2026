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
        dest: paths.dist.images,

        responsive: {
            widths: [480, 768, 1024, 1440, 1920],
        },

        formats: {
            jpeg: {
                quality: {
                    development: 82,
                    production: 90,
                },
            },
            webp: {
                quality: {
                    development: 80,
                    production: 88,
                },
            },
            avif: {
                quality: {
                    development: 65,
                    production: 80,
                },
            },
        },
    },

    fonts: {
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
        images: `${paths.src.images}/**/*.{jpg,jpeg,png,svg}`,
        fonts: `${paths.src.fonts}/**/*.{ttf,otf,woff,woff2}`,
        assets: `${paths.src.assets}/**/*`,
    },
};

export default config;