import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const origin = process.env.VISUAL_CHEM_ORIGIN ?? 'http://127.0.0.1:5173';
const output = new URL('../test-results/', import.meta.url);

await mkdir(output, { recursive: true });

const browser = await chromium.launch({ headless: true });

async function capture(name, path, viewport, selector, interact) {
	const context = await browser.newContext({ viewport });
	const page = await context.newPage();
	await page.goto(`${origin}${path}`, { waitUntil: 'networkidle' });
	if (selector) {
		await page.locator(selector).scrollIntoViewIfNeeded();
		await page.waitForTimeout(900);
	}
	if (interact) await interact(page);
	await page.screenshot({ path: fileURLToPath(new URL(`${name}.png`, output)) });
	await context.close();
}

async function chooseLiteratureSamples(page) {
	const slider = page.getByRole('slider', { name: '选择 Lai 2014 文献实验样品' });
	for (const value of ['1', '4', '7', '10', '13']) {
		await slider.evaluate((element, nextValue) => {
			element.value = nextValue;
			element.dispatchEvent(new Event('input', { bubbles: true }));
		}, value);
		await page.getByRole('button', { name: '加入这组文献实验数据' }).click();
	}
	await page.waitForTimeout(500);
}

await capture('home-desktop', '/', { width: 1440, height: 1000 });
await capture('story-desktop', '/stories/ethanol-distillation', { width: 1440, height: 1000 });
await capture(
	'story-scrolly-desktop',
	'/stories/ethanol-distillation',
	{ width: 1440, height: 1000 },
	'[data-scene-index="4"]'
);
await capture(
	'story-experiment-desktop',
	'/stories/ethanol-distillation',
	{ width: 1440, height: 1000 },
	'[data-scene-index="4"]',
	chooseLiteratureSamples
);
await capture(
	'story-model-comparison-desktop',
	'/stories/ethanol-distillation',
	{ width: 1440, height: 1000 },
	'[data-scene-index="6"]',
	async (page) => {
		await page.getByRole('slider', { name: '教学模型的非理想强度' }).fill('1');
		await page.waitForTimeout(500);
	}
);
await capture('home-mobile', '/', { width: 390, height: 844 });
await capture('story-mobile', '/stories/ethanol-distillation', { width: 390, height: 844 });
await capture(
	'story-scrolly-mobile',
	'/stories/ethanol-distillation',
	{ width: 390, height: 844 },
	'[data-scene-index="4"]'
);
await capture(
	'story-experiment-mobile',
	'/stories/ethanol-distillation',
	{ width: 390, height: 844 },
	'[data-scene-index="4"]',
	chooseLiteratureSamples
);

// Season-three visual regression set: every story gets a hero and its most
// explanatory linked-view scene at desktop and phone widths.
for (const story of [
	{ slug: 'kinetics', scene: 'fingerprints' },
	{ slug: 'arrhenius', scene: 'the-tail' },
	{ slug: 'catalyst', scene: 'lower-pass' }
]) {
	const path = `/stories/${story.slug}`;
	await capture(`${story.slug}-hero-desktop`, path, { width: 1440, height: 1000 });
	await capture(
		`${story.slug}-stage-desktop`,
		path,
		{ width: 1440, height: 1000 },
		`[data-scene-id="${story.scene}"]`
	);
	await capture(`${story.slug}-hero-mobile`, path, { width: 390, height: 844 });
	await capture(
		`${story.slug}-stage-mobile`,
		path,
		{ width: 390, height: 844 },
		`[data-scene-id="${story.scene}"]`
	);
}

await browser.close();
