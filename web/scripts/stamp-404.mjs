/**
 * Stamp the deploy-time base path into the static 404 page.
 *
 * `static/404.html` must work on GitHub Pages under `/visual-chem` and on a
 * bare local server alike, so it keeps a `%BASE%` placeholder instead of a
 * hardcoded prefix. adapter-static copies it verbatim; this script rewrites
 * the copy inside `build/` after every build, along with the precompressed
 * variants the adapter derived from the placeholder version.
 */
import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { brotliCompressSync, gzipSync, constants } from 'node:zlib';

const basePath = process.env.BASE_PATH ?? '';
if (basePath !== '' && !basePath.startsWith('/')) {
	throw new Error('BASE_PATH must be empty or start with /.');
}

const target = fileURLToPath(new URL('../build/404.html', import.meta.url));
const html = await readFile(target, 'utf8');
if (!html.includes('%BASE%')) {
	throw new Error('build/404.html no longer contains the %BASE% placeholder.');
}
const stamped = html.replaceAll('%BASE%', basePath);
await writeFile(target, stamped);

const buffer = Buffer.from(stamped);
if (existsSync(`${target}.gz`)) {
	await writeFile(`${target}.gz`, gzipSync(buffer, { level: constants.Z_BEST_COMPRESSION }));
}
if (existsSync(`${target}.br`)) {
	await writeFile(
		`${target}.br`,
		brotliCompressSync(buffer, {
			params: { [constants.BROTLI_PARAM_QUALITY]: constants.BROTLI_MAX_QUALITY }
		})
	);
}
console.log(`Stamped 404.html with base "${basePath || '/'}".`);
