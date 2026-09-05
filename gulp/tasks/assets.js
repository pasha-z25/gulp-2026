import gulp from 'gulp';
import config from '../config.js';

export const assets = () => {
    return gulp
        .src(config.assets.entry)
        .pipe(gulp.dest(config.paths.dist.assets));
};