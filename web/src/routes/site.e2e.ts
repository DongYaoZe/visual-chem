import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

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
	await expect(page.getByRole('heading', { name: /不是把相图/ })).toBeVisible();
	await expect(page.getByTestId('tri-view')).toBeVisible();
	await page.getByRole('link', { name: /进入第一篇故事/ }).click();
	await expect(page).toHaveURL(/stories\/ethanol-distillation/);
	expect(pageErrors).toEqual([]);
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

test('the reader can rebuild the phase envelope from literature measurements', async ({ page }) => {
	await gotoHydrated(page, '/stories/ethanol-distillation/');
	const recordButton = page.getByRole('button', { name: '加入这组文献实验数据' });
	await recordButton.scrollIntoViewIfNeeded();
	const composition = page.locator('label.experiment input[type="range"]');
	await expect(page.locator('.graphic .bubble-line')).toHaveCount(0);

	for (const value of ['1', '4', '7', '10', '13']) {
		await composition.evaluate((element, nextValue) => {
			const input = element as HTMLInputElement;
			input.value = nextValue;
			input.dispatchEvent(new Event('input', { bubbles: true }));
		}, value);
		await recordButton.click();
	}

	await expect(page.locator('.experiment-actions output')).toContainText('已选 5 / 16 组');
	// Clicking nudges the viewport, and the sticky graphic follows whichever
	// scene the IntersectionObserver currently reports. Scroll back to the
	// experiment scene so the assertions read the layer the reader would see.
	await page.locator('[data-scene-id="build-the-map"]').scrollIntoViewIfNeeded();
	await expect(page.locator('.graphic .recorded-point')).toHaveCount(10);
	await expect(page.locator('.graphic .bubble-recorded')).not.toHaveAttribute('d', '');
	await expect(page.locator('.graphic .literature-point')).toHaveCount(32);
	await expect(page.locator('.graphic .bubble-line')).toHaveCount(0);

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
		'/en/',
		'/en/stories/ethanol-distillation/',
		'/en/stories/boiling-map/',
		'/en/stories/salt-split/',
		'/en/stories/cooling-curve/'
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
