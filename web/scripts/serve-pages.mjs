/**
 * Serve the static `build/` output with GitHub Pages semantics, so that
 * Playwright exercises exactly what production users receive.
 *
 * GitHub Pages behaviour reproduced here:
 * - Files are served verbatim from the site root; nothing is rendered.
 * - `BASE_PATH` (project pages) prefixes every URL; requests outside it 404.
 * - A directory URL serves its `index.html`.
 * - A missing trailing slash on a directory redirects (301) to the slash form.
 * - Anything not found serves `404.html` with a real 404 status code.
 *
 * Usage: node scripts/serve-pages.mjs   (respects BASE_PATH and PORT)
 */
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../build/', import.meta.url));
const basePath = process.env.BASE_PATH ?? '';
if (basePath !== '' && !basePath.startsWith('/')) {
	throw new Error('BASE_PATH must be empty or start with /.');
}
const port = Number(process.env.PORT ?? 4173);

const mimeTypes = {
	'.html': 'text/html; charset=utf-8',
	'.js': 'text/javascript; charset=utf-8',
	'.mjs': 'text/javascript; charset=utf-8',
	'.css': 'text/css; charset=utf-8',
	'.json': 'application/json; charset=utf-8',
	'.svg': 'image/svg+xml',
	'.png': 'image/png',
	'.ico': 'image/x-icon',
	'.txt': 'text/plain; charset=utf-8',
	'.xml': 'application/xml; charset=utf-8',
	'.webmanifest': 'application/manifest+json',
	'.woff': 'font/woff',
	'.woff2': 'font/woff2',
	'.ttf': 'font/ttf'
};

function send(response, status, filePath) {
	response.writeHead(status, {
		'content-type': mimeTypes[extname(filePath)] ?? 'application/octet-stream'
	});
	createReadStream(filePath).pipe(response);
}

function sendNotFound(response) {
	const notFoundPage = join(root, '404.html');
	if (existsSync(notFoundPage)) {
		send(response, 404, notFoundPage);
	} else {
		response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
		response.end('Not Found');
	}
}

const server = createServer((request, response) => {
	const url = new URL(request.url ?? '/', `http://${request.headers.host}`);
	let pathname = decodeURIComponent(url.pathname);

	if (basePath !== '') {
		if (pathname === basePath) {
			response.writeHead(301, { location: `${basePath}/${url.search}` });
			response.end();
			return;
		}
		if (!pathname.startsWith(`${basePath}/`)) {
			sendNotFound(response);
			return;
		}
		pathname = pathname.slice(basePath.length);
	}

	const resolved = normalize(join(root, pathname));
	if (!resolved.startsWith(root.slice(0, -1))) {
		sendNotFound(response);
		return;
	}

	if (existsSync(resolved)) {
		const stats = statSync(resolved);
		if (stats.isFile()) {
			send(response, 200, resolved);
			return;
		}
		if (stats.isDirectory()) {
			if (!pathname.endsWith('/')) {
				response.writeHead(301, { location: `${basePath}${pathname}/${url.search}` });
				response.end();
				return;
			}
			const index = join(resolved, 'index.html');
			if (existsSync(index)) {
				send(response, 200, index);
				return;
			}
		}
	} else if (!pathname.endsWith('/') && existsSync(`${resolved}.html`)) {
		send(response, 200, `${resolved}.html`);
		return;
	}

	sendNotFound(response);
});

server.listen(port, '127.0.0.1', () => {
	console.log(
		`Serving ${root.replace(new RegExp(`\\${sep}$`), '')} at http://127.0.0.1:${port}${basePath}/`
	);
});
