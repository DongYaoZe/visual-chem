import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Locator, type Page } from '@playwright/test';

const basePath = process.env.BASE_PATH ?? '';
const appPath = (path: string) => basePath + path;

async function gotoHydrated(page: Page, path: string) {
	await page.goto(appPath(path));
	await page.waitForSelector('html[data-hydrated="true"]', { timeout: 15000 });
}

async function setRange(slider: Locator, value: number) {
	await slider.evaluate((element, nextValue) => {
		const input = element as HTMLInputElement;
		input.value = String(nextValue);
		input.dispatchEvent(new Event('input', { bubbles: true }));
	}, value);
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

test('hydrogen-spectrum story exposes complete Chinese and English editions', async ({ page }) => {
	const pageErrors: Error[] = [];
	page.on('pageerror', (error) => pageErrors.push(error));

	await gotoHydrated(page, '/stories/hydrogen-spectrum/');
	await expect(
		page.getByRole('heading', { level: 1, name: /原子为什么\s*只唱几颗音/ })
	).toBeVisible();
	await expect(page.getByTestId('hydrogen-spectrum-tri-view').first()).toBeVisible();
	await expect(page.locator('.katex-error')).toHaveCount(0);
	const ids = await page
		.locator('[id]')
		.evaluateAll((elements) => elements.map((element) => element.id));
	expect(new Set(ids).size).toBe(ids.length);

	await gotoHydrated(page, '/en/stories/hydrogen-spectrum/');
	await expect(page.locator('html')).toHaveAttribute('lang', 'en');
	await expect(
		page.getByRole('heading', { level: 1, name: /Why atoms sing\s*only a few notes/i })
	).toBeVisible();
	await expect(page.locator('main')).not.toContainText(/[\u3400-\u9fff]/);
	await expect(page.locator('.katex-error')).toHaveCount(0);
	expect(pageErrors).toEqual([]);
});

test('the opening prediction reveals quantization as missing colours', async ({ page }) => {
	await gotoHydrated(page, '/stories/hydrogen-spectrum/');
	const scene = page.locator('[data-scene-id="hook"]');
	await scene.scrollIntoViewIfNeeded();
	await scene.getByRole('button', { name: '几根亮线', exact: true }).click();
	await expect(scene.locator('.evidence')).toContainText('能量量子化');
	await expect(scene.getByRole('button', { name: '几根亮线', exact: true })).toHaveAttribute(
		'aria-pressed',
		'true'
	);
});

test('Balmer control moves the tube, energy arrow and spectrum from one frame', async ({
	page
}) => {
	await gotoHydrated(page, '/stories/hydrogen-spectrum/');
	const scene = page.locator('[data-scene-id="measure-the-lines"]');
	await scene.scrollIntoViewIfNeeded();
	const slider = scene.getByRole('slider', { name: '上能级 nᵤ' });
	const stage = page.getByTestId('hydrogen-spectrum-tri-view').first();
	const tube = stage.getByTestId('hydrogen-discharge-tube');
	const levels = stage.getByTestId('hydrogen-energy-levels');
	const spectrum = stage.getByTestId('hydrogen-line-spectrum');

	await setRange(slider, 3);
	await expect(scene.locator('small')).toContainText('λ=656.5 nm');
	await expect(tube).toHaveAttribute('data-wavelength-nm', '656.47');
	await expect(levels).toHaveAttribute('data-upper-n', '3');
	await expect(levels).toHaveAttribute('data-lower-n', '2');
	await expect(spectrum).toHaveAttribute('data-series', 'Balmer');
	await expect(stage).toContainText('656.5 nm');

	await setRange(slider, 6);
	await expect(scene.locator('small')).toContainText('λ=410.3 nm');
	await expect(tube).toHaveAttribute('data-wavelength-nm', '410.29');
	await expect(levels).toHaveAttribute('data-upper-n', '6');
	await expect(spectrum).toHaveAttribute('data-series', 'Balmer');
	await expect(stage).toContainText('410.3 nm');
});

test('switching the common lower level moves the whole family across spectral regions', async ({
	page
}) => {
	await gotoHydrated(page, '/stories/hydrogen-spectrum/');
	const scene = page.locator('[data-scene-id="three-families"]');
	await scene.scrollIntoViewIfNeeded();
	const stage = page.getByTestId('hydrogen-spectrum-tri-view').first();
	const tube = stage.getByTestId('hydrogen-discharge-tube');
	const levels = stage.getByTestId('hydrogen-energy-levels');
	const spectrum = stage.getByTestId('hydrogen-line-spectrum');

	await scene.getByRole('button', { name: 'n=1', exact: true }).click();
	await expect(tube).toHaveAttribute('data-region', 'ultraviolet');
	await expect(levels).toHaveAttribute('data-upper-n', '2');
	await expect(levels).toHaveAttribute('data-lower-n', '1');
	await expect(spectrum).toHaveAttribute('data-series', 'Lyman');
	await expect(tube.locator('.beam-glow')).toHaveCount(0);
	await expect(tube.locator('.beam:not(.invisible)')).toHaveCount(0);
	expect(await tube.locator('.beam.invisible').count()).toBeGreaterThan(0);

	await scene.getByRole('button', { name: 'n=2', exact: true }).click();
	await expect(tube).toHaveAttribute('data-region', 'visible');
	await expect(levels).toHaveAttribute('data-upper-n', '3');
	await expect(spectrum).toHaveAttribute('data-series', 'Balmer');

	await scene.getByRole('button', { name: 'n=3', exact: true }).click();
	await expect(tube).toHaveAttribute('data-region', 'infrared');
	await expect(levels).toHaveAttribute('data-upper-n', '4');
	await expect(levels).toHaveAttribute('data-lower-n', '3');
	await expect(spectrum).toHaveAttribute('data-series', 'Paschen');
	await expect(scene.locator('.evidence')).toContainText('红外区');
	await expect(tube.locator('.beam-glow')).toHaveCount(0);
	await expect(tube.locator('.beam:not(.invisible)')).toHaveCount(0);
	expect(await tube.locator('.beam.invisible').count()).toBeGreaterThan(0);
});

test('sandbox preserves a downward transition while recomputing UV, visible and IR', async ({
	page
}) => {
	await gotoHydrated(page, '/stories/hydrogen-spectrum/');
	const sandbox = page.locator('section.sandbox');
	await sandbox.scrollIntoViewIfNeeded();
	const lower = sandbox.getByRole('slider', { name: '落点 nₗ' });
	const upper = sandbox.getByRole('slider', { name: '起点 nᵤ' });
	const stage = sandbox.getByTestId('hydrogen-spectrum-tri-view');

	await setRange(lower, 1);
	await setRange(upper, 2);
	await expect(sandbox.locator('.sandbox-controls small')).toContainText('121.6 nm');
	await expect(stage.getByTestId('hydrogen-discharge-tube')).toHaveAttribute(
		'data-region',
		'ultraviolet'
	);

	await setRange(lower, 2);
	await setRange(upper, 3);
	await expect(sandbox.locator('.sandbox-controls small')).toContainText('656.5 nm');
	await expect(stage.getByTestId('hydrogen-discharge-tube')).toHaveAttribute(
		'data-region',
		'visible'
	);

	await setRange(lower, 3);
	await expect(upper).toHaveAttribute('min', '4');
	await expect(upper).toHaveValue('4');
	await expect(sandbox.locator('.sandbox-controls small')).toContainText('1875.6 nm');
	await expect(stage.getByTestId('hydrogen-discharge-tube')).toHaveAttribute(
		'data-region',
		'infrared'
	);
});

test('Chinese and English hydrogen-spectrum pages have no serious axe violations', async ({
	page
}) => {
	await gotoHydrated(page, '/stories/hydrogen-spectrum/');
	await expectNoSeriousAccessibilityViolations(page);
	await gotoHydrated(page, '/en/stories/hydrogen-spectrum/');
	await expectNoSeriousAccessibilityViolations(page);
});
