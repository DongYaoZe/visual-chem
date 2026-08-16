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

test('kinetics story exposes complete Chinese and English editions without Han leakage', async ({
	page
}) => {
	const pageErrors: Error[] = [];
	page.on('pageerror', (error) => pageErrors.push(error));

	await gotoHydrated(page, '/stories/kinetics/');
	await expect(page.getByRole('heading', { level: 1, name: /浓度的\s*倒计时/ })).toBeVisible();
	await expect(page.getByTestId('kinetics-tri-view').first()).toBeVisible();

	await gotoHydrated(page, '/en/stories/kinetics/');
	await expect(page.locator('html')).toHaveAttribute('lang', 'en');
	await expect(
		page.getByRole('heading', { level: 1, name: /The concentration\s*countdown/i })
	).toBeVisible();
	await expect(page.locator('main')).not.toContainText(/[\u3400-\u9fff]/);
	expect(pageErrors).toEqual([]);
});

test('the concentration clock advances, pauses, and resets without leaking its timer', async ({
	page
}) => {
	await gotoHydrated(page, '/stories/kinetics/');
	const scene = page.locator('[data-scene-id="watch-it-fall"]');
	await scene.scrollIntoViewIfNeeded();
	const output = scene.locator('output');

	await expect(output).toHaveText('t = 0 s');
	await scene.getByRole('button', { name: /开始计时/ }).click();
	await expect.poll(async () => output.textContent(), { timeout: 3000 }).not.toBe('t = 0 s');

	await scene.getByRole('button', { name: /暂停/ }).click();
	const paused = await output.textContent();
	await page.waitForTimeout(180);
	await expect(output).toHaveText(paused ?? '');

	await scene.getByRole('button', { name: /重新倒满/ }).click();
	await expect(output).toHaveText('t = 0 s');
});

test('zero, first, and second order expose shrinking, equal, and doubling half-life fingerprints', async ({
	page
}) => {
	await gotoHydrated(page, '/stories/kinetics/');
	const scene = page.locator('[data-scene-id="fingerprints"]');
	await scene.scrollIntoViewIfNeeded();
	const readout = scene.locator('.evidence');

	await scene.getByRole('button', { name: '零级', exact: true }).click();
	await expect(readout).toContainText('41.7 s → 20.8 s → 10.4 s');
	await expect(scene.getByRole('button', { name: '零级', exact: true })).toHaveAttribute(
		'aria-pressed',
		'true'
	);

	await scene.getByRole('button', { name: '一级', exact: true }).click();
	await expect(readout).toContainText('57.8 s → 57.8 s → 57.8 s');

	await scene.getByRole('button', { name: '二级', exact: true }).click();
	await expect(readout).toContainText('83.3 s → 167 s → 333 s');
	await expect(scene.getByRole('button', { name: '二级', exact: true })).toHaveAttribute(
		'aria-pressed',
		'true'
	);
});

test('carbon-14 and sandbox controls recompute ages, half-lives, and the live stage', async ({
	page
}) => {
	await gotoHydrated(page, '/stories/kinetics/');

	const carbonScene = page.locator('[data-scene-id="carbon-clock"]');
	await carbonScene.scrollIntoViewIfNeeded();
	const carbonSlider = carbonScene.getByRole('slider', { name: '样品剩余碳-14' });
	await setRange(carbonSlider, 0.25);
	await expect(carbonScene.locator('small')).toContainText('剩余 25% → 距今约 11460 年');

	const sandboxScene = page.locator('[data-scene-id="sandbox"]');
	await sandboxScene.scrollIntoViewIfNeeded();
	await sandboxScene.getByRole('button', { name: '零级', exact: true }).click();
	await setRange(sandboxScene.getByRole('slider', { name: '速率常数 k' }), 0.02);
	await setRange(sandboxScene.getByRole('slider', { name: '起始浓度 c₀' }), 1.5);

	await expect(sandboxScene.locator('small')).toContainText('t½ = 37.5 s');
	const stage = page.getByTestId('kinetics-tri-view').first();
	await expect(stage.locator('.mobile-status')).toContainText('m 0');
	await expect(stage).toContainText('0.000');
});

test('macro bubbles encode normalized rate while sandbox units and orders stay physical', async ({
	page
}) => {
	await gotoHydrated(page, '/stories/kinetics/');
	const sandbox = page.locator('main > section.sandbox');
	const beaker = sandbox.getByTestId('reaction-beaker');
	const kControl = sandbox.locator('label').filter({ hasText: '速率常数 k' });
	const c0Slider = sandbox.getByRole('slider', { name: '起始浓度 c₀' });
	const kSlider = sandbox.getByRole('slider', { name: '速率常数 k' });

	await sandbox.getByRole('button', { name: '零级', exact: true }).click();
	await setRange(c0Slider, 1.5);
	await setRange(kSlider, 0.005);
	await expect(kControl).toContainText('mol L⁻¹ s⁻¹');
	await expect(beaker).toHaveAttribute('data-concentration-fraction', '0.7333');
	await expect(beaker).toHaveAttribute('data-rate-fraction', '1.0000');
	await expect(beaker).toHaveAttribute('data-bubble-count', '7');
	await expect(beaker).toHaveAttribute('data-speed-factor', '1.4000');

	// More zero-order conversion lowers c but must not slow bubbling before exhaustion.
	await setRange(kSlider, 0.01);
	await expect(beaker).toHaveAttribute('data-concentration-fraction', '0.4667');
	await expect(beaker).toHaveAttribute('data-rate-fraction', '1.0000');
	await expect(beaker).toHaveAttribute('data-bubble-count', '7');
	await expect(beaker).toHaveAttribute('data-speed-factor', '1.4000');

	// At c0 = 2 and equal numeric k, second order starts faster and has fallen farther by 80 s.
	await setRange(c0Slider, 2);
	await sandbox.getByRole('button', { name: '一级', exact: true }).click();
	await expect(kControl).toContainText('s⁻¹');
	await expect(beaker).toHaveAttribute('data-concentration-fraction', '0.4493');
	await expect(beaker).toHaveAttribute('data-rate-fraction', '0.4493');

	await sandbox.getByRole('button', { name: '二级', exact: true }).click();
	await expect(kControl).toContainText('L mol⁻¹ s⁻¹');
	await expect(beaker).toHaveAttribute('data-concentration-fraction', '0.3846');
	await expect(beaker).toHaveAttribute('data-rate-fraction', '0.1479');
});

test('Chinese and English kinetics pages have no serious or critical axe violations', async ({
	page
}) => {
	test.setTimeout(45_000);
	await gotoHydrated(page, '/stories/kinetics/');
	await expectNoSeriousAccessibilityViolations(page);
	await gotoHydrated(page, '/en/stories/kinetics/');
	await expectNoSeriousAccessibilityViolations(page);
});
