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

test('Arrhenius story exposes complete Chinese and English editions without Han leakage', async ({
	page
}) => {
	const pageErrors: Error[] = [];
	page.on('pageerror', (error) => pageErrors.push(error));

	await gotoHydrated(page, '/stories/arrhenius/');
	await expect(page.getByRole('heading', { level: 1, name: /翻山的\s*分子/ })).toBeVisible();
	await expect(page.getByTestId('arrhenius-tri-view').first()).toBeVisible();

	await gotoHydrated(page, '/en/stories/arrhenius/');
	await expect(page.locator('html')).toHaveAttribute('lang', 'en');
	await expect(
		page.getByRole('heading', { level: 1, name: /Molecules over\s*the mountain/i })
	).toBeVisible();
	await expect(page.locator('main')).not.toContainText(/[\u3400-\u9fff]/);
	expect(pageErrors).toEqual([]);
});

test('the milk prediction reveals the computed refrigerator timescale', async ({ page }) => {
	await gotoHydrated(page, '/stories/arrhenius/');
	const scene = page.locator('[data-scene-id="hook"]');
	await scene.scrollIntoViewIfNeeded();

	await scene.getByRole('button', { name: '约慢 10 倍', exact: true }).click();
	const evidence = scene.locator('.evidence');
	await expect(evidence).toContainText('0.101');
	await expect(evidence).toContainText('9.9 倍');

	const thermalScene = page.getByTestId('thermal-scene').first();
	await expect(thermalScene).toHaveAttribute('data-cold-temperature', '4');
	await expect(thermalScene).toHaveAttribute('data-hot-temperature', '25');
	await expect(thermalScene).toContainText('较冷');
	await expect(thermalScene).toContainText('4 °C');
	await expect(thermalScene).toContainText('较热');
	await expect(thermalScene).toContainText('25 °C');
	await expect(thermalScene.locator('svg')).toHaveAttribute(
		'aria-label',
		/左侧较冷.*4.*右侧较热.*25/
	);
});

test('the high-energy-tail control changes both the barrier factor and temperature boost', async ({
	page
}) => {
	await gotoHydrated(page, '/stories/arrhenius/');
	const scene = page.locator('[data-scene-id="the-tail"]');
	await scene.scrollIntoViewIfNeeded();
	const slider = scene.getByRole('slider', { name: '温度 T' });
	const readout = scene.locator('small');
	const stage = page.getByTestId('arrhenius-tri-view').first();

	await setRange(slider, 25);
	await expect(readout).toContainText('1.74e-9');
	await expect(readout).toContainText('1.00×');
	await expect(stage).toContainText('25 °C');

	await setRange(slider, 60);
	await expect(readout).toContainText('1.45e-8');
	await expect(readout).toContainText('8.32×');
	await expect(stage).toContainText('60 °C');
	await expect(slider).toHaveValue('60');
});

test('the ten-degree rule changes with the barrier instead of acting as a law', async ({
	page
}) => {
	await gotoHydrated(page, '/stories/arrhenius/');
	const scene = page.locator('[data-scene-id="rule-of-thumb"]');
	await scene.scrollIntoViewIfNeeded();
	const slider = scene.getByRole('slider', { name: '活化能 Eₐ' });
	const readout = scene.locator('small');
	const stage = page.getByTestId('arrhenius-tri-view').first();

	await setRange(slider, 53);
	await expect(readout).toContainText('Eₐ = 53 kJ/mol');
	await expect(readout).toContainText('10.0 K');

	await setRange(slider, 20);
	await expect(readout).toContainText('Eₐ = 20 kJ/mol');
	await expect(readout).toContainText('28.0 K');

	await setRange(slider, 120);
	await expect(readout).toContainText('Eₐ = 120 kJ/mol');
	await expect(readout).toContainText('4.3 K');
	await expect(stage).toContainText('120 kJ mol⁻¹');
});

test('the two-point experiment recovers the 62.0 kJ/mol apparent barrier', async ({ page }) => {
	await gotoHydrated(page, '/stories/arrhenius/');
	const scene = page.locator('[data-scene-id="two-point"]');
	await scene.scrollIntoViewIfNeeded();

	await expect(scene.locator('.measurement-grid')).toContainText('293.15 K');
	await expect(scene.locator('.measurement-grid')).toContainText('313.15 K');
	await expect(scene.locator('.evidence')).toContainText('Eₐ = 62.0 kJ/mol');
	await expect(page.getByTestId('arrhenius-tri-view').first()).toContainText('62 kJ mol⁻¹');
});

test('the sandbox couples temperature and Ea to the Arrhenius and Dolbear readouts', async ({
	page
}) => {
	await gotoHydrated(page, '/stories/arrhenius/');
	const scene = page.locator('[data-scene-id="sandbox"]');
	await scene.scrollIntoViewIfNeeded();
	const temperature = scene.getByRole('slider', { name: '温度 T' });
	const ea = scene.getByRole('slider', { name: '活化能 Eₐ' });
	const readout = scene.locator('small');
	const stage = page.getByTestId('arrhenius-tri-view').first();
	const chamber = page.getByTestId('collision-chamber').first();

	// At fixed T, changing only Ea must change the actual tail, the
	// log-compressed indicator count, and the accessible summary together.
	await setRange(temperature, 25);
	await setRange(ea, 20);
	await expect(chamber).toHaveAttribute('data-crossing-count', '17');
	await expect(chamber.locator('.dot.fast')).toHaveCount(17);
	const lowBarrierTail = Number(await chamber.getAttribute('data-tail-share'));

	await setRange(ea, 120);
	await expect(chamber).toHaveAttribute('data-crossing-count', '2');
	await expect(chamber.locator('.dot.fast')).toHaveCount(2);
	const highBarrierTail = Number(await chamber.getAttribute('data-tail-share'));
	expect(lowBarrierTail).toBeGreaterThan(highBarrierTail);
	await expect(chamber.locator('svg')).toHaveAttribute(
		'aria-label',
		/活化能 120.*实际能垒因子.*高亮 2\/18/
	);

	await setRange(temperature, 20);
	await setRange(ea, 75);
	await expect(readout).toContainText('4.33e-14');
	await expect(readout).toContainText('6.8 K');
	await expect(readout).toContainText('蟋蟀约 112 次/分');
	await expect(stage).toContainText('20 °C');
	await expect(stage).toContainText('75 kJ mol⁻¹');

	await setRange(temperature, 25);
	await expect(readout).toContainText('蟋蟀约 148 次/分');
	await expect(temperature).toHaveValue('25');
	await expect(ea).toHaveValue('75');
});

test('Chinese and English Arrhenius pages have no serious or critical axe violations', async ({
	page
}) => {
	test.setTimeout(45_000);
	await gotoHydrated(page, '/stories/arrhenius/');
	await expectNoSeriousAccessibilityViolations(page);
	await gotoHydrated(page, '/en/stories/arrhenius/');
	await expectNoSeriousAccessibilityViolations(page);
});
