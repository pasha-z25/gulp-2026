import path from 'node:path';
import fs from 'node:fs/promises';

import * as fontkit from 'fontkit';
import ttf2woff from 'ttf2woff';
import ttf2woff2 from 'ttf2woff2';

import config from '../config.js';

import { parseFontMetadata } from '../utils/fonts.js';

const FONT_SOURCE_EXTENSIONS = /\.(ttf|otf)$/i;

const createFontFace = ({
    family,
    weight,
    style,
    filename,
}) => {
    return `@font-face {
    font-family: '${family}';
    font-style: ${style};
    font-weight: ${weight};
    font-display: swap;
    src:
        url('../fonts/${filename}.woff2') format('woff2'),
        url('../fonts/${filename}.woff') format('woff');
}

`;
};

const convertFont = async (file) => {
    const input = await fs.readFile(file);
    const font = fontkit.openSync(file);

    const metadata = parseFontMetadata(
        path.basename(file),
        font,
    );

    const { name } = path.parse(file);
    const outputDir = config.paths.dist.fonts;

    await fs.mkdir(outputDir, {
        recursive: true,
    });

    const woff = ttf2woff(input);
    const woff2 = ttf2woff2(input);

    await fs.writeFile(
        path.join(outputDir, `${name}.woff`),
        woff,
    );

    await fs.writeFile(
        path.join(outputDir, `${name}.woff2`),
        woff2,
    );

    return {
        ...metadata,
        filename: name,
    };
};

export const fonts = async () => {
    const sourceDir = config.paths.src.fonts;

    const files = await fs.readdir(sourceDir);

    const fontFiles = files
        .filter((file) =>
            FONT_SOURCE_EXTENSIONS.test(file),
        )
        .map((file) =>
            path.join(sourceDir, file),
        );

    if (!fontFiles.length) {
        return;
    }

    const fonts = await Promise.all(
        fontFiles.map(convertFont),
    );

    if (!config.fonts.generateCss) {
        return;
    }

    const css = fonts
        .map(createFontFace)
        .join('');

    const cssPath = config.fonts.css.output;

    await fs.mkdir(
        path.dirname(cssPath),
        {
            recursive: true,
        },
    );

    await fs.writeFile(
        cssPath,
        css,
        'utf8',
    );
};
