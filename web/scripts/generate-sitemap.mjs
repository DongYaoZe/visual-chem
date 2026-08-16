import { writeFile } from 'node:fs/promises';
import { STORY_MANIFEST, LATEST_STORY_DATE } from '../src/lib/config/story-manifest.js';

const siteRoot = 'https://dongyaoze.github.io/visual-chem';

function urlEntry(path, lastmod, { changefreq = 'monthly', priority = '0.9' } = {}) {
	return [
		'  <url>',
		`    <loc>${siteRoot}${path}</loc>`,
		`    <lastmod>${lastmod}</lastmod>`,
		`    <changefreq>${changefreq}</changefreq>`,
		`    <priority>${priority}</priority>`,
		'  </url>'
	].join('\n');
}

const entries = [
	urlEntry('/', LATEST_STORY_DATE, { changefreq: 'weekly', priority: '1.0' }),
	...STORY_MANIFEST.map((story) => urlEntry(`/stories/${story.slug}/`, story.published)),
	urlEntry('/en/', LATEST_STORY_DATE, { changefreq: 'weekly', priority: '0.9' }),
	...STORY_MANIFEST.map((story) => urlEntry(`/en/stories/${story.slug}/`, story.published))
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`;

await writeFile(new URL('../static/sitemap.xml', import.meta.url), xml, 'utf8');
console.log(`Generated sitemap for ${STORY_MANIFEST.length} bilingual stories.`);
