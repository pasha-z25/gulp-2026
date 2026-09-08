import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

import config from '../config.js';

const clients = new Set();

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.avif': 'image/avif',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.otf': 'font/otf',
};

let server;

const injectReloadScript = (html) => `
    ${html}

    <script>
        const events = new EventSource('/__reload');

        events.onmessage = () => {
            window.location.reload();
        };
    </script>
`;

const getFilePath = (url) => {
    const pathname = decodeURIComponent(
        url.split('?')[0],
    );

    const relativePath = pathname === '/'
        ? 'index.html'
        : pathname.slice(1);

    return path.join(
        path.resolve(config.paths.dist.root),
        relativePath,
    );
};

const serveFile = (request, response) => {
    const filePath = getFilePath(request.url);

    fs.stat(filePath, (error, stats) => {
        if (error || !stats.isFile()) {
            response.writeHead(404);
            response.end('Not Found');

            return;
        }

        const extension = path.extname(filePath);
        const contentType = mimeTypes[extension]
            || 'application/octet-stream';

        if (extension === '.html') {
            fs.readFile(filePath, 'utf8', (error, html) => {
                if (error) {
                    response.writeHead(500);
                    response.end('Internal Server Error');

                    return;
                }

                response.writeHead(200, {
                    'Content-Type': 'text/html; charset=utf-8',
                });

                response.end(
                    injectReloadScript(html),
                );
            });

            return;
        }

        response.writeHead(200, {
            'Content-Type': contentType,
        });

        fs.createReadStream(filePath).pipe(response);
    });
};

export const reload = () => {
    for (const client of clients) {
        client.write('data: reload\n\n');
    }
};

export const serve = (done) => {
    server = http.createServer((request, response) => {
        if (request.url === '/__reload') {
            response.writeHead(200, {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                Connection: 'keep-alive',
            });

            response.write('\n');

            clients.add(response);

            request.on('close', () => {
                clients.delete(response);
            });

            return;
        }

        serveFile(request, response);
    });

    server.listen(3000, () => {
        console.log('Dev server: http://localhost:3000');

        done();
    });
};
