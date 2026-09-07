import gulp from 'gulp';

import config from '../config.js';
import { html } from '../tasks/html.js';
import { styles } from '../tasks/styles.js';
import { scripts } from '../tasks/scripts.js';
import { assets } from '../tasks/assets.js';

import { server } from './serve.js';

export const watch = () => {
    gulp.watch(
        config.watch.html,
        html,
    ).on('all', () => {
        server.reload();
    });

    gulp.watch(
        config.watch.styles,
        styles,
    ).on('all', (event) => {
        if (event === 'change') {
            server.reload();
        }
    });

    gulp.watch(
        config.watch.scripts,
        scripts,
    ).on('all', () => {
        server.reload();
    });

    gulp.watch(
        config.watch.assets,
        assets,
    ).on('all', () => {
        server.reload();
    });
};