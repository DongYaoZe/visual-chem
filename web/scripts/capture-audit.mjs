import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import { STORY_MANIFEST } from '../src/lib/config/story-manifest.js';

const origin = (process.env.VISUAL_CHEM_ORIGIN ?? 'http://127.0.0.1:5173').replace(/\/$/, '');
const output = new URL('../test-results/', import.meta.url);
const desktop = { width: 1440, height: 1000 };
const mobile = { width: 390, height: 844 };
const compactMobile = { width: 320, height: 568 };
const compactFlagships = ['ethanol-distillation', 'hydrogen-spectrum', 'co2-infrared'];

await mkdir(output, { recursive: true });

const browser = await chromium.launch({ headless: true });

async function assertNoHorizontalOverflow(page, name) {
	const horizontalOverflow = await page.evaluate(() => {
		const root = document.documentElement;
		return root.scrollWidth - root.clientWidth;
	});
	if (horizontalOverflow > 1) {
		throw new Error(`${name} overflows the viewport horizontally by ${horizontalOverflow}px.`);
	}
}

async function capture(name, path, viewport, selector, interact) {
	const context = await browser.newContext({ viewport });
	const page = await context.newPage();
	await page.goto(`${origin}${path}`, { waitUntil: 'networkidle' });
	if (selector) {
		await page.locator(selector).scrollIntoViewIfNeeded();
		await page.waitForTimeout(900);
	}
	if (interact) await interact(page);
	await assertNoHorizontalOverflow(page, name);
	await page.screenshot({ path: fileURLToPath(new URL(`${name}.png`, output)) });
	await context.close();
}

async function captureCompactScenes(slug) {
	const context = await browser.newContext({ viewport: compactMobile });
	const page = await context.newPage();
	const path = `/stories/${slug}`;
	await page.goto(`${origin}${path}`, { waitUntil: 'networkidle' });
	await assertNoHorizontalOverflow(page, `${slug}-compact-hero`);
	await page.screenshot({
		path: fileURLToPath(new URL(`${slug}-compact-hero.png`, output))
	});

	const sceneIds = await page
		.locator('[data-scene-id]')
		.evaluateAll((elements) =>
			elements.map((element) => element.getAttribute('data-scene-id')).filter(Boolean)
		);
	for (const sceneId of sceneIds) {
		const scene = page.locator(`[data-scene-id="${sceneId}"]`);
		await scene.scrollIntoViewIfNeeded();
		await page.waitForTimeout(320);
		const name = `${slug}-compact-${sceneId}`;
		await assertNoHorizontalOverflow(page, name);
		await page.screenshot({ path: fileURLToPath(new URL(`${name}.png`, output)) });
	}
	await context.close();
}

async function chooseLiteratureSamples(page) {
	const samples = page.locator('.sample-strip button');
	for (const index of [1, 4, 7, 10, 13]) {
		await samples.nth(index).click();
	}
	await page.waitForTimeout(500);
}

const keySceneInteractions = {
	'hydrogen-spectrum': async (page) => {
		await page
			.locator('[data-scene-id="three-families"]')
			.getByRole('button', { name: 'n=3', exact: true })
			.click();
		await page.waitForTimeout(400);
	}
};

await capture('home-desktop', '/', desktop);
await capture('home-mobile', '/', mobile);

// Every live story receives the same minimum visual contract: hero + one
// explanatory scene at desktop and phone widths. The canonical story list and
// key-scene ids come from story-manifest.js, so adding a live route without an
// audit target is no longer a silent omission.
for (const story of STORY_MANIFEST) {
	const path = `/stories/${story.slug}`;
	const selector = `[data-scene-id="${story.keyScene}"]`;
	const interact = keySceneInteractions[story.slug];

	await capture(`${story.slug}-hero-desktop`, path, desktop);
	await capture(`${story.slug}-stage-desktop`, path, desktop, selector, interact);
	await capture(`${story.slug}-hero-mobile`, path, mobile);
	await capture(`${story.slug}-stage-mobile`, path, mobile, selector, interact);
}

// The flagship trio additionally receives a 320×568 short-screen contract.
// Every narrative scene is captured, not just one key scene, so dense cards,
// fixed controls and phone-only text-first behavior are visible under a
// narrow/short viewport that the regular Pixel-class audit does not stress.
for (const slug of compactFlagships) {
	await captureCompactScenes(slug);
}

// The ethanol-water flagship has evidence-layer states worth preserving in
// addition to the generic contract above.
await capture(
	'ethanol-distillation-experiment-desktop',
	'/stories/ethanol-distillation',
	desktop,
	'[data-scene-id="build-the-map"]',
	chooseLiteratureSamples
);
await capture(
	'ethanol-distillation-experiment-mobile',
	'/stories/ethanol-distillation',
	mobile,
	'[data-scene-id="build-the-map"]',
	chooseLiteratureSamples
);
await capture(
	'ethanol-distillation-model-comparison-desktop',
	'/stories/ethanol-distillation',
	desktop,
	'[data-scene-id="nonideal-model"]',
	async (page) => {
		await page.getByRole('slider', { name: '教学模型的非理想强度' }).fill('1');
		await page.waitForTimeout(500);
	}
);

await browser.close();
