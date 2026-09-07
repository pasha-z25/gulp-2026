import browserSync from 'browser-sync';

import config from '../config.js';

const server = browserSync.create();

export const serve = (done) => {
    server.init({
        server: {
            baseDir: config.paths.dist.root,
        },
        port: 3000,
        open: true,
        notify: false,
    });

    done();
};

export { server };