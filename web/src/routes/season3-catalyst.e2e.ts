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

async function expectBalancedPeroxideIcons(surface: Locator) {
	await expect(surface.locator('[data-species="h2o2"]')).toHaveCount(2);
	await expect(surface.locator('[data-species="h2o"]')).toHaveCount(2);
	await expect(surface.locator('[data-species="o2"]')).toHaveCount(1);
	await expect(surface.locator('.oxygen')).toHaveCount(2);
	await expect(surface.locator('.stoichiometry-label')).toHaveText('2 H₂O₂ → 2 H₂O + O₂');
}

test('catalyst story exposes complete Chinese and English editions without Han leakage', async ({
	page
}) => {
	const pageErrors: Error[] = [];
	page.on('pageerror', (error) => pageErrors.push(error));

	await gotoHydrated(page, '/stories/catalyst/');
	await expect(page.getByRole('heading', { level: 1, name: /捷径不改\s*终点/ })).toBeVisible();
	await expect(page.getByTestId('catalyst-tri-view').first()).toBeVisible();

	await gotoHydrated(page, '/en/stories/catalyst/');
	await expect(page.locator('html')).toHaveAttribute('lang', 'en');
	await expect(
		page.getByRole('heading', { level: 1, name: /The shortcut that\s*moves no valley/i })
	).toBeVisible();
	await expect(page.locator('main')).not.toContainText(/[\u3400-\u9fff]/);
	expect(pageErrors).toEqual([]);
});

test('three catalyst paths synchronize the selected barrier and Arrhenius boost', async ({
	page
}) => {
	await gotoHydrated(page, '/stories/catalyst/');
	const scene = page.locator('[data-scene-id="lower-pass"]');
	await scene.scrollIntoViewIfNeeded();
	const stage = page.getByTestId('catalyst-tri-view').first();
	const bench = stage.getByTestId('catalyst-bench');
	const surface = stage.getByTestId('catalyst-surface');
	const readout = scene.locator('.evidence');

	await scene.getByRole('button', { name: '无催化 · 73', exact: true }).click();
	await expect(readout).toContainText('Ea = 73 kJ/mol');
	await expect(readout).toContainText('1.0×');
	await expect(stage).toContainText('73 kJ mol⁻¹');
	await expect(bench).toContainText('相对速率 1×');
	await expect(surface).toHaveAttribute('data-catalyst-kind', 'none');
	await expect(surface).toContainText('无催化介体');
	await expectBalancedPeroxideIcons(surface);

	await scene.getByRole('button', { name: '碘化物 · 56', exact: true }).click();
	await expect(readout).toContainText('Ea = 56 kJ/mol');
	await expect(readout).toContainText('951×');
	await expect(stage).toContainText('56 kJ mol⁻¹');
	await expect(bench).toContainText('相对速率 951×');
	await expect(surface).toHaveAttribute('data-catalyst-kind', 'iodide');
	await expect(surface).toContainText('I⁻ ⇌ IO⁻');
	await expectBalancedPeroxideIcons(surface);

	await scene.getByRole('button', { name: '过氧化氢酶 · 14', exact: true }).click();
	await expect(readout).toContainText('Ea = 14 kJ/mol');
	await expect(readout).toContainText('2.2e+10×');
	await expect(stage).toContainText('14 kJ mol⁻¹');
	await expect(bench).toContainText('相对速率 2.2e+10×');
	await expect(surface).toHaveAttribute('data-catalyst-kind', 'catalase');
	await expect(surface).toContainText('过氧化氢酶 · 血红素');
	await expectBalancedPeroxideIcons(surface);
	await expect(stage.locator('.enthalpy-label')).toHaveText('ΔH = -98 kJ mol⁻¹');
});

test('the reverse and forward paths display the same acceleration factor', async ({ page }) => {
	await gotoHydrated(page, '/stories/catalyst/');
	const scene = page.locator('[data-scene-id="both-ways"]');
	await scene.scrollIntoViewIfNeeded();
	await scene.getByRole('button', { name: '碘化物 · 56', exact: true }).click();

	const readout = scene.locator('.evidence');
	await expect(readout).toContainText(/正向 \S+× · 逆向 \S+× · K 不变/);
	const text = (await readout.textContent()) ?? '';
	const factors = text.match(/正向\s+(\S+)×\s+·\s+逆向\s+(\S+)×/);
	expect(factors, text).not.toBeNull();
	expect(factors?.[1]).toBe(factors?.[2]);
});

test('the catalyst sandbox shows both rates rising while the relative advantage falls', async ({
	page
}) => {
	await gotoHydrated(page, '/stories/catalyst/');
	const scene = page.locator('[data-scene-id="sandbox"]');
	await scene.scrollIntoViewIfNeeded();
	const stage = page.getByTestId('catalyst-tri-view').first();
	const readout = scene.locator('.evidence');
	const temperatureSlider = scene.getByRole('slider', { name: '温度 T' });

	await expect(scene.getByRole('slider')).toHaveCount(1);
	await expect(scene.getByRole('slider', { name: '活化能 Eₐ' })).toHaveCount(0);
	await setRange(temperatureSlider, 25);
	await expect(scene.locator('.fixed-parameter')).toContainText('56 kJ/mol');
	await expect(readout).toContainText('无催化 k/A = 1.63e-13');
	await expect(readout).toContainText('碘化物 k/A = 1.55e-10');
	await expect(readout).toContainText('相对 951×');
	await expect(stage.getByTestId('catalyst-surface')).toHaveAttribute(
		'data-catalyst-kind',
		'iodide'
	);

	await setRange(temperatureSlider, 100);
	await expect(readout).toContainText('无催化 k/A = 6.05e-11');
	await expect(readout).toContainText('碘化物 k/A = 1.45e-8');
	await expect(readout).toContainText('相对 240×');
	await expect(temperatureSlider).toHaveValue('100');
});

test('Chinese and English catalyst pages have no serious or critical axe violations', async ({
	page
}) => {
	await gotoHydrated(page, '/stories/catalyst/');
	await expectNoSeriousAccessibilityViolations(page);
	await gotoHydrated(page, '/en/stories/catalyst/');
	await expectNoSeriousAccessibilityViolations(page);
});
