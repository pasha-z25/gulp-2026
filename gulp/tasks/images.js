import fs from 'node:fs/promises';
import path from 'node:path';

import sharp from 'sharp';
import { optimize } from 'svgo';

import { isProduction } from '../utils/environment.js';


import config from '../config.js';

const RASTER_EXTENSIONS = new Set([
    '.jpg',
    '.jpeg',
    '.png',
]);

const getMaxWidth = () => (
    Math.max(...config.images.responsive.widths)
);

const MAX_WIDTH = getMaxWidth();

const environment = isProduction
    ? 'production'
    : 'development';

const getQuality = (format) => (
    config.images.formats[format].quality[
    environment
    ]
);

const getSourceRoot = () => (
    path.resolve(config.paths.src.images)
);

const getDestinationRoot = () => (
    path.resolve(config.images.dest)
);

const getOutputPath = (filePath, suffix, extension) => {
    const relativePath = path.relative(
        getSourceRoot(),
        filePath,
    );

    const parsedPath = path.parse(relativePath);

    return path.join(
        getDestinationRoot(),
        parsedPath.dir,
        `${parsedPath.name}${suffix}${extension}`,
    );
};

const ensureDirectory = async (filePath) => {
    await fs.mkdir(
        path.dirname(filePath),
        {
            recursive: true,
        },
    );
};

const getWidths = (originalWidth) => {
    const configuredWidths = config.images.responsive.widths
        .filter((width) => width < originalWidth)
        .filter((width) => width <= MAX_WIDTH);

    const targetWidth = Math.min(
        originalWidth,
        MAX_WIDTH,
    );

    if (!configuredWidths.includes(targetWidth)) {
        configuredWidths.push(targetWidth);
    }

    return configuredWidths.sort((a, b) => a - b);
};

const processRaster = async (filePath) => {
    const image = sharp(filePath);

    const metadata = await image.metadata();

    if (!metadata.width) {
        throw new Error(
            `Unable to determine image width: ${filePath}`,
        );
    }

    const widths = getWidths(metadata.width);
    const hasAlpha = metadata.hasAlpha === true;

    for (const width of widths) {
        const suffix = `-${width}`;

        const pipeline = image
            .clone()
            .resize({
                width,
                withoutEnlargement: true,
            });

        const outputPromises = [
            pipeline
                .clone()
                .webp({
                    quality: getQuality('webp'),
                })
                .toFile(
                    getOutputPath(
                        filePath,
                        suffix,
                        '.webp',
                    ),
                ),

            pipeline
                .clone()
                .avif({
                    quality: getQuality('avif'),
                })
                .toFile(
                    getOutputPath(
                        filePath,
                        suffix,
                        '.avif',
                    ),
                ),
        ];

        if (hasAlpha) {
            outputPromises.push(
                pipeline
                    .clone()
                    .png({
                        compressionLevel: 9,
                        adaptiveFiltering: true,
                    })
                    .toFile(
                        getOutputPath(
                            filePath,
                            suffix,
                            '.png',
                        ),
                    ),
            );
        } else {
            outputPromises.push(
                pipeline
                    .clone()
                    .jpeg({
                        quality: getQuality('jpeg'),
                        progressive: true,
                        mozjpeg: true,
                    })
                    .toFile(
                        getOutputPath(
                            filePath,
                            suffix,
                            '.jpg',
                        ),
                    ),
            );
        }

        const outputPaths = outputPromises.map(
            (_, index) => {
                if (hasAlpha) {
                    return [
                        getOutputPath(filePath, suffix, '.webp'),
                        getOutputPath(filePath, suffix, '.avif'),
                        getOutputPath(filePath, suffix, '.png'),
                    ][index];
                }

                return [
                    getOutputPath(filePath, suffix, '.webp'),
                    getOutputPath(filePath, suffix, '.avif'),
                    getOutputPath(filePath, suffix, '.jpg'),
                ][index];
            },
        );

        await Promise.all(
            outputPaths.map(ensureDirectory),
        );

        await Promise.all(outputPromises);
    }
};

const processSvg = async (filePath) => {
    const source = await fs.readFile(
        filePath,
        'utf8',
    );

    const result = optimize(source, {
        path: filePath,
    });

    if (result.error) {
        throw new Error(
            `SVGO failed for ${filePath}: ${result.error}`,
        );
    }

    const outputPath = getOutputPath(
        filePath,
        '',
        '.svg',
    );

    await ensureDirectory(outputPath);

    await fs.writeFile(
        outputPath,
        result.data,
        'utf8',
    );
};

const getFiles = async (directory) => {
    const entries = await fs.readdir(
        directory,
        {
            withFileTypes: true,
        },
    );

    const files = [];

    for (const entry of entries) {
        const filePath = path.join(
            directory,
            entry.name,
        );

        if (entry.isDirectory()) {
            files.push(
                ...await getFiles(filePath),
            );
        } else {
            files.push(filePath);
        }
    }

    return files;
};

export const images = async () => {
    const files = await getFiles(
        getSourceRoot(),
    );

    await Promise.all(
        files.map(async (filePath) => {
            const extension = path
                .extname(filePath)
                .toLowerCase();

            if (RASTER_EXTENSIONS.has(extension)) {
                await processRaster(filePath);
                return;
            }

            if (extension === '.svg') {
                await processSvg(filePath);
            }
        }),
    );
};
