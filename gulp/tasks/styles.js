import gulp from 'gulp';

import gulpSass from 'gulp-sass';
import * as dartSass from 'sass';

import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';

import config from '../config.js';

import { isProduction } from '../utils/environment.js';

const sass = gulpSass(dartSass);

export const styles = () => {
    return gulp
        .src(config.styles.entries)
        .pipe(
            sass({
                style: isProduction ? 'compressed' : 'expanded',
            }).on('error', sass.logError),
        )
        .pipe(
            postcss([
                autoprefixer(),
            ]),
        )
        .pipe(gulp.dest(config.paths.dist.styles));
};
