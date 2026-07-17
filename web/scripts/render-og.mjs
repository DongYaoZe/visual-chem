// Renders static/og-*.svg share images to PNG at 1200x630.
import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const names = process.argv.slice(2);
if (names.length === 0) {
	console.error('usage: node scripts/render-og.mjs <name-without-extension> ...');
	process.exit(1);
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const name of names) {
	const svgPath = resolve(`static/${name}.svg`);
	await page.goto(pathToFileURL(svgPath).href);
	await page.screenshot({ path: resolve(`static/${name}.png`) });
	console.log(`rendered static/${name}.png`);
}
await browser.close();
