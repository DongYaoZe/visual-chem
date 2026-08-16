import { expect, test, type Page } from '@playwright/test';

const basePath = process.env.BASE_PATH ?? '';
const appPath = (path: string) => basePath + path;

async function gotoHydrated(page: Page, path: string) {
	await page.goto(appPath(path));
	await page.waitForSelector('html[data-hydrated="true"]', { timeout: 15000 });
}

test('CO2 infrared story exposes Chinese and English editions', async ({ page }, testInfo) => {
	await gotoHydrated(page, '/stories/co2-infrared/');
	await expect(
		page.getByRole('heading', { level: 1, name: /为什么有些振动\s*红外光看不见/ })
	).toBeVisible();
	const narrativeStage = page.getByTestId('co2-infrared-tri-view').first();
	if (testInfo.project.name === 'mobile-chromium') {
		await expect(narrativeStage).toBeHidden();
		await expect(page.locator('.short-state.compact-mobile').first()).toBeVisible();
	} else {
		await expect(narrativeStage).toBeVisible();
	}
	await expect(page.locator('.katex-error')).toHaveCount(0);
	const firstFormula = page.locator('.formula').first();
	await firstFormula.scrollIntoViewIfNeeded();
	await expect(firstFormula.locator('[role="math"]')).toBeVisible();
	await expect(firstFormula.locator('.katex-html')).toBeVisible();

	await gotoHydrated(page, '/en/stories/co2-infrared/');
	await expect(page.locator('html')).toHaveAttribute('lang', 'en');
	await expect(
		page.getByRole('heading', { level: 1, name: /Why infrared misses\s*some vibrations/i })
	).toBeVisible();
	await expect(page.locator('main')).not.toContainText(/[\u3400-\u9fff]/);
});

test('prediction and mode controls preserve one shared computed frame', async ({ page }) => {
	await gotoHydrated(page, '/stories/co2-infrared/');
	const scene = page.locator('[data-scene-id="silent-stretch"]');
	await scene.scrollIntoViewIfNeeded();
	const stage = page.getByTestId('co2-infrared-tri-view').first();
	const relay = stage.getByTestId('co2-causal-relay');
	await expect(stage.getByTestId('co2-ir-instrument')).toHaveAttribute(
		'data-mode',
		'symmetric-stretch'
	);
	await expect(stage.getByTestId('co2-ir-instrument')).toHaveAttribute('data-active', 'false');
	await expect(relay).toHaveAttribute('data-dipole-change', 'false');
	await expect(relay).toHaveAttribute('data-active', 'false');
	await expect(relay.locator('.relay-track.flowing')).toHaveCount(1);
	await expect(relay).toContainText('Δμ = 0');
	await expect(relay).toContainText('无基本吸收峰');

	const sandbox = page.locator('section.sandbox');
	await sandbox.scrollIntoViewIfNeeded();
	const mode = sandbox.getByRole('slider', { name: '选择二氧化碳振动模式' });
	await mode.evaluate((element) => {
		const input = element as HTMLInputElement;
		input.value = '2';
		input.dispatchEvent(new Event('input', { bubbles: true }));
	});
	await expect(sandbox.getByTestId('co2-ir-instrument')).toHaveAttribute(
		'data-mode',
		'asymmetric-stretch'
	);
	await expect(sandbox.getByTestId('co2-ir-instrument')).toHaveAttribute('data-active', 'true');
	await expect(sandbox.getByTestId('co2-normal-mode')).toHaveAttribute(
		'data-mode',
		'asymmetric-stretch'
	);
	await expect(sandbox.getByTestId('co2-ir-spectrum')).toHaveAttribute(
		'data-mode',
		'asymmetric-stretch'
	);
	const sandboxRelay = sandbox.getByTestId('co2-causal-relay');
	await expect(sandboxRelay).toHaveAttribute('data-dipole-change', 'true');
	await expect(sandboxRelay).toHaveAttribute('data-active', 'true');
	await expect(sandboxRelay.locator('.relay-track.flowing')).toHaveCount(3);
	await expect(sandboxRelay).toContainText('Δμ ≠ 0');
	await expect(sandboxRelay).toContainText('2349 cm⁻¹ 峰');
});
