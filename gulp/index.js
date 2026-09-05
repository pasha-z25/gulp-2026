import gulp from 'gulp';

import { clean } from './tasks/clean.js';
import { html } from './tasks/html.js';
import { styles } from './tasks/styles.js';
// import { scripts } from './tasks/scripts.js';
// import { images } from './tasks/images.js';
// import { fonts } from './tasks/fonts.js';
import { assets } from './tasks/assets.js';
// import { serve, watch } from './server.js';

const buildTasks = gulp.parallel(
    html,
    styles,
    // scripts,
    // images,
    // fonts,
    assets,
);

const build = gulp.series(
    clean,
    buildTasks,
);

const dev = gulp.series(
    build,
    //     gulp.parallel(
    //         serve,
    //         watch,
    //     ),
);

export {
    clean,
    build,
    dev,
};