import path from 'node:path';

export const FONT_WEIGHTS = {
    thin: 100,
    hairline: 100,

    extralight: 200,
    'extra-light': 200,
    ultralight: 200,
    'ultra-light': 200,

    light: 300,

    regular: 400,
    normal: 400,
    book: 400,

    medium: 500,

    semibold: 600,
    'semi-bold': 600,
    demibold: 600,
    'demi-bold': 600,

    bold: 700,

    extrabold: 800,
    'extra-bold': 800,
    ultrabold: 800,
    'ultra-bold': 800,

    black: 900,
    heavy: 900,
};

export const FONT_STYLES = {
    italic: 'italic',
    oblique: 'oblique',
};

const WEIGHT_PATTERN = Object.keys(FONT_WEIGHTS)
    .sort((a, b) => b.length - a.length)
    .join('|');

const STYLE_PATTERN = Object.keys(FONT_STYLES)
    .join('|');

const FONT_PATTERN = new RegExp(
    `^(.*?)[-_ ](${WEIGHT_PATTERN})(${STYLE_PATTERN})?$`,
    'i',
);

export const parseFontMetadata = (filename, font) => {
    const name = path.parse(filename).name;
    const match = name.match(FONT_PATTERN);

    if (!match) {
        return {
            family: font.familyName,
            weight: font.weight || 400,
            style: 'normal',
        };
    }

    const [, family, weightName, styleName] = match;

    return {
        family,
        weight: FONT_WEIGHTS[weightName.toLowerCase()] ?? 400,
        style: styleName
            ? FONT_STYLES[styleName.toLowerCase()]
            : 'normal',
    };
};
