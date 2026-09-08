import gulp from 'gulp';

import config from '../config.js';

import { html } from '../tasks/html.js';
import { styles } from '../tasks/styles.js';
import { scripts } from '../tasks/scripts.js';
import { assets } from '../tasks/assets.js';
import { images } from '../tasks/images.js';
import { fonts } from '../tasks/fonts.js';

import { reload } from './serve.js';

export const watch = () => {
    gulp.watch(
        config.watch.html,
        gulp.series(html, reload),
    );

    gulp.watch(
        config.watch.styles,
        gulp.series(styles, reload),
    );

    gulp.watch(
        config.watch.scripts,
        gulp.series(scripts, reload),
    );

    gulp.watch(
        config.watch.assets,
        gulp.series(assets, reload),
    );

    gulp.watch(
        config.watch.images,
        gulp.series(images, reload),
    );

    gulp.watch(
        config.watch.fonts,
        gulp.series(fonts, reload),
    );
};
