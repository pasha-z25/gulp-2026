import gulp from 'gulp';
import htmlmin from 'gulp-html-minifier-terser';

import config from '../config.js';
import { isProduction } from '../utils/environment.js';

export const html = () => {
    let stream = gulp.src(config.html.entries);

    if (isProduction) {
        stream = stream.pipe(
            htmlmin({
                collapseWhitespace: true,
                removeComments: true,
                removeRedundantAttributes: true,
                removeEmptyAttributes: true,
                useShortDoctype: true,
                processScripts: ['application/ld+json'],
            }),
        );
    }

    return stream.pipe(gulp.dest(config.paths.dist.html));
};