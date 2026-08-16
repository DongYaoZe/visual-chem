import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { STORY_MANIFEST, storiesForSeason } from '$lib/config/story-manifest.js';

const basePath = process.env.BASE_PATH ?? '';
const appPath = (path: string) => `${basePath}${path}`;

/** Navigate and wait until the client bundle has actually hydrated, so that
 * clicks and input events land on live components instead of inert SSR markup. */
async function gotoHydrated(page: Page, path: string) {
	await page.goto(appPath(path));
	await page.waitForSelector('html[data-hydrated="true"]', { timeout: 15000 });
}

async function expectNoSeriousAccessibilityViolations(page: Page) {
	const results = await new AxeBuilder({ page })
		.withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
		.analyze();
	const violations = results.violations.filter(
		(violation) => violation.impact === 'serious' || violation.impact === 'critical'
	);
	expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
}

test('homepage presents the project and a working story entry', async ({ page }) => {
	const pageErrors: Error[] = [];
	page.on('pageerror', (error) => pageErrors.push(error));
	await gotoHydrated(page, '/');
	await expect(page).toHaveTitle(/VisualChem/);
	await expect(page.getByRole('heading', { name: /先看现象/ })).toBeVisible();
	await expect(page.getByTestId('tri-view')).toBeVisible();
	await page.getByRole('link', { name: /进入第一篇故事/ }).click();
	await expect(page).toHaveURL(/stories\/ethanol-distillation/);
	expect(pageErrors).toEqual([]);
});

test('both catalogues expose every live story from the manifest', async ({ page }) => {
	for (const locale of ['zh-CN', 'en'] as const) {
		await page.goto(appPath(locale === 'en' ? '/en/' : '/'));

		for (const season of [1, 2, 3, 4] as const) {
			const seasonClass =
				season === 1
					? '.season:not(.season-two):not(.season-three):not(.season-four)'
					: `.season-${['', '', 'two', 'three', 'four'][season]}`;
			const cards = page.locator(`${seasonClass} a.story`);
			const expected = storiesForSeason(season);
			await expect(cards).toHaveCount(expected.length);

			for (const [index, story] of expected.entries()) {
				const localePrefix = locale === 'en' ? '/en' : '';
				await expect(cards.nth(index)).toHaveAttribute(
					'href',
					`${basePath}${localePrefix}/stories/${story.slug}/`
				);
			}
		}
	}

	expect(STORY_MANIFEST).toHaveLength(12);
});

test('header primary action follows the reader context', async ({ page }) => {
	await gotoHydrated(page, '/');
	await expect(page.locator('header nav a').first()).toHaveText('开始第一篇故事');
	await expect(page.locator('header nav a').first()).toHaveAttribute(
		'href',
		`${basePath}/stories/ethanol-distillation/`
	);

	await gotoHydrated(page, '/stories/co2-infrared/');
	await expect(page.locator('header nav a').first()).toHaveText('故事目录');
	await expect(page.locator('header nav a').first()).toHaveAttribute('href', `${basePath}/`);

	await gotoHydrated(page, '/en/stories/co2-infrared/');
	await expect(page.locator('header nav a').first()).toHaveText('Story catalogue');
	await expect(page.locator('header nav a').first()).toHaveAttribute('href', `${basePath}/en/`);
});

test('flagship stories use text-first stages on phone widths', async ({ page }, testInfo) => {
	test.skip(
		testInfo.project.name !== 'mobile-chromium',
		'Phone layout is covered by the mobile project.'
	);

	for (const path of [
		'/stories/ethanol-distillation/',
		'/stories/hydrogen-spectrum/',
		'/stories/co2-infrared/'
	]) {
		await gotoHydrated(page, path);
		const state = page.locator('.short-state.compact-mobile').first();
		const graphic = page.locator('.graphic.compact-mobile').first();
		const open = state.getByRole('button', { name: '查看当前图' });

		await expect(state).toBeVisible();
		await expect(open).toBeVisible();
		await expect(graphic).toBeHidden();

		await open.click();
		await expect(graphic).toHaveAttribute('role', 'dialog');
		await expect(graphic).toBeVisible();

		await page.keyboard.press('Escape');
		await expect(graphic).toBeHidden();
		await expect(open).toBeFocused();
	}
});

test('story keeps the prediction and synchronized apparatus interactive', async ({ page }) => {
	const pageErrors: Error[] = [];
	page.on('pageerror', (error) => pageErrors.push(error));
	await gotoHydrated(page, '/stories/ethanol-distillation/');
	await expect(page.getByRole('heading', { name: /永远到不了的/ })).toBeVisible();
	await expect(page.getByTestId('tri-view').first()).not.toContainText(/实验共沸|模型极限/);
	await page.getByRole('button', { name: '会停在某处' }).click();
	await page.getByRole('button', { name: '+ 再加一级' }).click();
	await expect(page.getByText(/第 1 级：x/)).toBeVisible();
	await expect(page.getByTestId('tri-view').first()).toContainText('同步状态');
	expect(pageErrors).toEqual([]);
});

test('three manual stages unlock a bounded auto demonstration', async ({ page }) => {
	await gotoHydrated(page, '/stories/ethanol-distillation/');
	const hook = page.locator('[data-scene-id="hook"]');
	await hook.scrollIntoViewIfNeeded();
	const add = hook.getByRole('button', { name: '+ 再加一级' });
	for (let index = 0; index < 3; index += 1) await add.click();

	const run = hook.getByRole('button', { name: '继续看它自己走' });
	await expect(run).toBeVisible();
	await run.click();
	await expect(hook.getByRole('button', { name: '暂停自动演示' })).toHaveAttribute(
		'aria-pressed',
		'true'
	);
	const output = hook.locator('.hook-stage-controls output');
	await expect(output).toContainText(/第 (?:[6-9]|1[0-4]) 级/, { timeout: 3500 });

	await hook.getByRole('button', { name: '重置' }).click();
	await expect(output).toContainText('第 0 级');
	await page.waitForTimeout(700);
	await expect(output).toContainText('第 0 级');
});

test('the x-to-y relay maps one equilibrium state across apparatus and T-x-y space', async ({
	page
}, testInfo) => {
	await gotoHydrated(page, '/stories/ethanol-distillation/');
	const mapping = page.getByTestId('equilibrium-mapping').first();
	await page.locator('[data-scene-id="tie-line"]').scrollIntoViewIfNeeded();
	if (testInfo.project.name === 'mobile-chromium') {
		await expect(mapping).not.toHaveClass(/visible/);
		return;
	}
	await expect(mapping).toHaveClass(/visible/);
	await expect(mapping).toHaveAttribute('data-liquid-x', '0.100');
	const idealVapor = Number(await mapping.getAttribute('data-vapor-y'));
	expect(idealVapor).toBeGreaterThan(0.1);
	await expect(mapping.locator('.mapping-flow')).toHaveCount(2);

	await page.mouse.wheel(0, 1);
	await page.locator('[data-scene-id="build-the-map"]').scrollIntoViewIfNeeded();
	await expect(mapping).not.toHaveClass(/visible/);

	await page.mouse.wheel(0, 1);
	await page.locator('[data-scene-id="nonideal-model"]').scrollIntoViewIfNeeded();
	await expect(mapping).toHaveClass(/visible/);
	await expect(mapping).toHaveAttribute('data-liquid-x', '0.350');
});

test('the azeotrope search turns y minus x into a visible fixed-point lock', async ({ page }) => {
	await gotoHydrated(page, '/stories/ethanol-distillation/');
	const scene = page.locator('[data-scene-id="fixed-point"]');
	await scene.scrollIntoViewIfNeeded();
	const slider = scene.getByRole('slider', { name: '寻找共沸点的乙醇摩尔分数' });
	const lock = page.getByTestId('fixed-point-lock').first();
	const triViewReadouts = page.getByTestId('tri-view').first().locator('header dd');
	await expect(lock).toHaveAttribute('data-locked', 'false');
	await expect(triViewReadouts.nth(0)).toHaveText('0.820');
	await expect(triViewReadouts.nth(1)).toHaveText('0.835');

	await slider.evaluate((element) => {
		const input = element as HTMLInputElement;
		input.value = '0.895';
		input.dispatchEvent(new Event('input', { bubbles: true }));
	});
	await expect(lock).toHaveAttribute('data-locked', 'true');
	await expect(triViewReadouts.nth(0)).toHaveText('0.895');
	await expect(triViewReadouts.nth(1)).toHaveText('0.895');
	await expect(lock.locator('.fixed-badge-text')).toHaveText('x = y');
	const gap = Number(await lock.getAttribute('data-gap'));
	expect(gap).toBeLessThan(0.003);

	await slider.evaluate((element) => {
		const input = element as HTMLInputElement;
		input.value = '0.820';
		input.dispatchEvent(new Event('input', { bubbles: true }));
	});
	await expect(lock).toHaveAttribute('data-locked', 'false');
});

test('the reader can rebuild the phase envelope from literature measurements', async ({ page }) => {
	await gotoHydrated(page, '/stories/ethanol-distillation/');
	const samples = page.locator('.sample-strip button');
	await samples.first().scrollIntoViewIfNeeded();
	await expect(samples).toHaveCount(16);
	await expect(page.locator('.graphic .bubble-line')).toHaveCount(0);

	for (const index of [1, 4, 7, 10, 13]) {
		await samples.nth(index).click();
	}

	await expect(page.locator('.experiment-actions output')).toContainText('已选 5 / 16 组');
	await expect(page.locator('.coverage-row small.covered')).toHaveCount(3);
	await expect(page.locator('.sample-picker')).toContainText('低、中、高组成都有证据');
	// Clicking nudges the viewport, and the sticky graphic follows whichever
	// scene the IntersectionObserver currently reports. Scroll back to the
	// experiment scene so the assertions read the layer the reader would see.
	await page.locator('[data-scene-id="build-the-map"]').scrollIntoViewIfNeeded();
	await expect(page.locator('.graphic .recorded-point')).toHaveCount(10);
	await expect(page.locator('.graphic .bubble-recorded')).not.toHaveAttribute('d', '');
	await expect(page.locator('.graphic .literature-point')).toHaveCount(32);
	await expect(page.locator('.graphic .bubble-line')).toHaveCount(0);

	// This is a new reader navigation, not a script-only viewport jump: the
	// wheel intent releases the interaction pin before the next scene enters.
	await page.mouse.wheel(0, 1);
	await page.locator('[data-scene-id="nonideal-model"]').scrollIntoViewIfNeeded();
	await expect(page.locator('.graphic .bubble-line')).toHaveCount(1);
});

test('the boiling map story computes its stage from the reader state', async ({ page }) => {
	const pageErrors: Error[] = [];
	page.on('pageerror', (error) => pageErrors.push(error));
	await gotoHydrated(page, '/stories/boiling-map/');
	await expect(page.getByRole('heading', { name: /沸腾的/ })).toBeVisible();

	// The hook: prediction reveals the evidence and the stage shows Lhasa.
	await page.getByRole('button', { name: '更凉' }).click();
	await expect(page.getByText(/64 kPa/)).toBeVisible();
	await expect(page.getByTestId('water-tri-view').first()).toContainText('同一状态');

	// Altitude travel: dragging to Everest slides the boiling point to ~71 °C.
	await page.locator('[data-scene-id="altitude-travel"]').scrollIntoViewIfNeeded();
	const altitude = page.locator('[data-scene-id="altitude-travel"] input[type="range"]');
	await altitude.evaluate((element) => {
		const input = element as HTMLInputElement;
		input.value = '8849';
		input.dispatchEvent(new Event('input', { bubbles: true }));
	});
	await expect(page.locator('[data-scene-id="altitude-travel"]')).toContainText('珠峰');
	await expect(page.locator('[data-scene-id="altitude-travel"] small')).toContainText(/7[01]\./);
	expect(pageErrors).toEqual([]);
});

test('the boiling map story has no serious automated accessibility violations', async ({
	page
}) => {
	await page.goto(appPath('/stories/boiling-map/'));
	await expectNoSeriousAccessibilityViolations(page);
});

test('the salt split story computes its stage from the reader state', async ({ page }) => {
	const pageErrors: Error[] = [];
	page.on('pageerror', (error) => pageErrors.push(error));
	await gotoHydrated(page, '/stories/salt-split/');
	await expect(page.getByRole('heading', { name: /一锅盐水的/ })).toBeVisible();

	// The hook: prediction reveals the evidence and cools the staged pot.
	await page.getByRole('button', { name: '只有硝酸钾' }).click();
	await expect(page.getByText(/几乎全部是纯硝酸钾/)).toBeVisible();
	await expect(page.getByTestId('salt-tri-view').first()).toContainText('同一锅汤');

	// Cooling: dragging to 25 °C reads the golden 54.4 g of pure KNO3.
	await page.locator('[data-scene-id="cooling"]').scrollIntoViewIfNeeded();
	const cooling = page.locator('[data-scene-id="cooling"] input[type="range"]');
	await cooling.evaluate((element) => {
		const input = element as HTMLInputElement;
		input.value = '25';
		input.dispatchEvent(new Event('input', { bubbles: true }));
	});
	await expect(page.locator('[data-scene-id="cooling"] small')).toContainText(/54\.\d/);
	expect(pageErrors).toEqual([]);
});

test('the salt split story has no serious automated accessibility violations', async ({ page }) => {
	await page.goto(appPath('/stories/salt-split/'));
	await expectNoSeriousAccessibilityViolations(page);
});

test('the cooling curve story computes its stage from the reader state', async ({ page }) => {
	const pageErrors: Error[] = [];
	page.on('pageerror', (error) => pageErrors.push(error));
	await gotoHydrated(page, '/stories/cooling-curve/');
	await expect(page.getByRole('heading', { level: 1, name: /冷却曲线/ })).toBeVisible();

	// The hook: prediction reveals the explanation.
	await page.getByRole('button', { name: '一个转折 + 一个台阶' }).click();
	await expect(page.getByText(/非共晶配比先析出一种晶体/)).toBeVisible();
	await expect(page.getByTestId('cooling-tri-view').first()).toContainText('同一熔体');

	// Read-the-map: plotting the evidence marks the break on the diagram.
	await page.locator('[data-scene-id="read-the-map"]').scrollIntoViewIfNeeded();
	await page.getByRole('button', { name: '把证据搬上地图' }).click();
	await expect(page.getByTestId('cooling-tri-view').first()).toContainText('全液相');
	expect(pageErrors).toEqual([]);
});

test('the cooling curve story has no serious automated accessibility violations', async ({
	page
}) => {
	await page.goto(appPath('/stories/cooling-curve/'));
	await expectNoSeriousAccessibilityViolations(page);
});

test('the entropy story computes its census from the reader state', async ({ page }) => {
	const pageErrors: Error[] = [];
	page.on('pageerror', (error) => pageErrors.push(error));
	await gotoHydrated(page, '/stories/entropy/');
	await expect(page.getByRole('heading', { level: 1, name: /熵不是/ })).toBeVisible();
	await page.getByRole('button', { name: '纯粹的概率' }).click();
	await expect(page.getByText(/把这句话数出来/)).toBeVisible();
	await expect(page.getByTestId('entropy-tri-view').first()).toContainText('同一组粒子');
	expect(pageErrors).toEqual([]);
});

test('the entropy story has no serious automated accessibility violations', async ({ page }) => {
	await page.goto(appPath('/stories/entropy/'));
	await expectNoSeriousAccessibilityViolations(page);
});

test('the gibbs valley story has no serious automated accessibility violations', async ({
	page
}) => {
	await page.goto(appPath('/stories/gibbs-valley/'));
	await expectNoSeriousAccessibilityViolations(page);
});

test('the nernst story has no serious automated accessibility violations', async ({ page }) => {
	await page.goto(appPath('/stories/nernst/'));
	await expectNoSeriousAccessibilityViolations(page);
});

test('homepage has no serious automated accessibility violations', async ({ page }) => {
	await page.goto(appPath('/'));
	await expectNoSeriousAccessibilityViolations(page);
});

test('story has no serious automated accessibility violations', async ({ page }) => {
	await page.goto(appPath('/stories/ethanol-distillation/'));
	await expectNoSeriousAccessibilityViolations(page);
});

test('English routes reuse the complete interactive story without Chinese UI leakage', async ({
	page
}) => {
	await gotoHydrated(page, '/en/');
	await expect(page.locator('html')).toHaveAttribute('lang', 'en');
	await expect(page.getByRole('heading', { name: /Do not just draw/ })).toBeVisible();
	await page.getByRole('link', { name: /Enter the first story/ }).click();
	await expect(page).toHaveURL(/\/en\/stories\/ethanol-distillation\//);
	await expect(page.getByRole('heading', { name: /The unreachable/ })).toBeVisible();
	await page.getByRole('button', { name: 'It will stop somewhere' }).click();
	await page.getByRole('button', { name: '+ Add one stage' }).click();
	await expect(page.getByText(/Stage 1: x/)).toBeVisible();
	await expect(page.getByTestId('tri-view').first()).toContainText('Synchronized state');
	await expect(page.locator('main')).not.toContainText(/[\u3400-\u9fff]/);
});

test('English pages have no serious automated accessibility violations', async ({ page }) => {
	await page.goto(appPath('/en/'));
	await expectNoSeriousAccessibilityViolations(page);
	await page.goto(appPath('/en/stories/ethanol-distillation/'));
	await expectNoSeriousAccessibilityViolations(page);
});

test('canonical, alternate, social, and structured metadata identify each locale', async ({
	page
}) => {
	await page.goto(appPath('/'));
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		'href',
		'https://dongyaoze.github.io/visual-chem/'
	);
	await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
		'href',
		'https://dongyaoze.github.io/visual-chem/en/'
	);
	await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
		'content',
		'https://dongyaoze.github.io/visual-chem/og-home.png'
	);

	await page.goto(appPath('/en/stories/ethanol-distillation/'));
	await expect(page.locator('html')).toHaveAttribute('lang', 'en');
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		'href',
		'https://dongyaoze.github.io/visual-chem/en/stories/ethanol-distillation/'
	);
	await expect(page.locator('link[rel="alternate"][hreflang="zh-CN"]')).toHaveAttribute(
		'href',
		'https://dongyaoze.github.io/visual-chem/stories/ethanol-distillation/'
	);
	await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'article');
	const structuredData = await page.locator('script[type="application/ld+json"]').textContent();
	expect(JSON.parse(structuredData ?? '{}')).toMatchObject({
		'@type': 'Article',
		inLanguage: 'en'
	});
});

test('all public routes load their local production assets without HTTP errors', async ({
	page
}) => {
	const failures: string[] = [];
	page.on('response', (response) => {
		if (response.url().startsWith('http://127.0.0.1:4173') && response.status() >= 400) {
			failures.push(`${response.status()} ${response.url()}`);
		}
	});
	for (const path of [
		'/',
		'/stories/ethanol-distillation/',
		'/stories/boiling-map/',
		'/stories/salt-split/',
		'/stories/cooling-curve/',
		'/stories/entropy/',
		'/stories/gibbs-valley/',
		'/stories/nernst/',
		'/stories/kinetics/',
		'/stories/arrhenius/',
		'/stories/catalyst/',
		'/stories/hydrogen-spectrum/',
		'/stories/co2-infrared/',
		'/en/',
		'/en/stories/ethanol-distillation/',
		'/en/stories/boiling-map/',
		'/en/stories/salt-split/',
		'/en/stories/cooling-curve/',
		'/en/stories/entropy/',
		'/en/stories/gibbs-valley/',
		'/en/stories/nernst/',
		'/en/stories/kinetics/',
		'/en/stories/arrhenius/',
		'/en/stories/catalyst/',
		'/en/stories/hydrogen-spectrum/',
		'/en/stories/co2-infrared/'
	]) {
		await page.goto(appPath(path));
		await expect(page.locator('main')).toBeVisible();
	}
	expect(failures).toEqual([]);
});

test('the static not-found page is branded and useful without client JavaScript', async ({
	browser
}) => {
	const context = await browser.newContext({ javaScriptEnabled: false });
	const page = await context.newPage();
	const response = await page.goto(`http://127.0.0.1:4173${appPath('/missing-phase-state/')}`);
	expect(response?.status()).toBe(404);
	await expect(page.getByRole('heading', { name: /不在图上/ })).toBeVisible();
	await expect(page.getByRole('link', { name: /返回首页/ })).toHaveAttribute(
		'href',
		`${basePath}/`
	);
	await context.close();
});

test('the story remains readable and labels its limits without JavaScript', async ({ browser }) => {
	const context = await browser.newContext({ javaScriptEnabled: false });
	const page = await context.newPage();
	await page.goto(`http://127.0.0.1:4173${appPath('/stories/ethanol-distillation/')}`);
	await expect(page.getByRole('heading', { name: /永远到不了的/ })).toBeVisible();
	await expect(page.getByText(/正文与公式仍可阅读/)).toBeVisible();
	await expect(page.getByRole('heading', { name: /把实验表重新变回一张地图/ })).toBeVisible();
	await context.close();
});

test('the installed story can reload offline', async ({ page, context }, testInfo) => {
	test.skip(
		testInfo.project.name !== 'desktop-chromium',
		'One browser-level offline check is enough.'
	);
	await page.goto(appPath('/stories/ethanol-distillation/'));
	await page.evaluate(async () => {
		if (!('serviceWorker' in navigator)) throw new Error('Service workers are unavailable.');
		await navigator.serviceWorker.ready;
	});
	await context.setOffline(true);
	await page.reload({ waitUntil: 'domcontentloaded' });
	await expect(page.getByRole('heading', { name: /永远到不了的/ })).toBeVisible();
});
