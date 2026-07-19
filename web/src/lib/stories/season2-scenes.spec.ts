import { describe, expect, it } from 'vitest';
import { equilibriumExtent } from '$lib/chem';
import { enEntropyContent, zhCNEntropyContent } from '$lib/content/stories/entropy';
import { enGibbsContent, zhCNGibbsContent } from '$lib/content/stories/gibbs-valley';
import { enNernstContent, zhCNNernstContent } from '$lib/content/stories/nernst';
import {
	ENTROPY_SCENES,
	GIBBS_SCENES,
	NERNST_SCENES,
	entropySceneDefinition,
	gibbsSceneDefinition,
	nernstSceneDefinition
} from './season2-scenes';

// 叙事文本（各语言）与舞台指示共享同一份有序场景 id。
// 任何一方增删、重排场景而其他方未跟上，这里必须先红。
describe('entropy scene parity', () => {
	const stageIds = ENTROPY_SCENES.map((scene) => scene.id);

	it('keeps ids unique and both locales aligned', () => {
		expect(new Set(stageIds).size).toBe(stageIds.length);
		expect(zhCNEntropyContent.scenes.map((scene) => scene.id)).toEqual(stageIds);
		expect(enEntropyContent.scenes.map((scene) => scene.id)).toEqual(stageIds);
	});

	it('labels every scene with a kicker in both locales', () => {
		for (const id of stageIds) {
			expect(zhCNEntropyContent.kickers[id]).toBeTruthy();
			expect(enEntropyContent.kickers[id]).toBeTruthy();
		}
	});

	it('keeps every scene physically valid and resolves lookups', () => {
		for (const scene of ENTROPY_SCENES) {
			expect(scene.total).toBeGreaterThan(0);
			if (scene.leftCount !== null) {
				expect(scene.leftCount).toBeGreaterThanOrEqual(0);
				expect(scene.leftCount).toBeLessThanOrEqual(scene.total);
			}
			expect(entropySceneDefinition(scene.id)).toBe(scene);
		}
		expect(() => entropySceneDefinition('missing' as never)).toThrow(/Unknown entropy/);
	});

	it('opens sealed and full, releases from all-left', () => {
		const hook = entropySceneDefinition('hook');
		expect(hook.valveOpen).toBe(false);
		expect(hook.leftCount).toBe(hook.total);
		const release = entropySceneDefinition('irreversible');
		expect(release.leftCount).toBe(release.total);
		expect(release.markAllLeft).toBe(true);
	});

	it('counts N=4 by hand in the counting scene', () => {
		expect(entropySceneDefinition('count-the-ways').total).toBe(4);
	});
});

describe('gibbs scene parity', () => {
	const stageIds = GIBBS_SCENES.map((scene) => scene.id);

	it('keeps ids unique and both locales aligned', () => {
		expect(new Set(stageIds).size).toBe(stageIds.length);
		expect(zhCNGibbsContent.scenes.map((scene) => scene.id)).toEqual(stageIds);
		expect(enGibbsContent.scenes.map((scene) => scene.id)).toEqual(stageIds);
	});

	it('keeps every scene inside the model window and resolves lookups', () => {
		for (const scene of GIBBS_SCENES) {
			expect(scene.temperatureC).toBeGreaterThanOrEqual(0);
			expect(scene.temperatureC).toBeLessThanOrEqual(80);
			expect(scene.pressureBar).toBeGreaterThan(0);
			if (scene.extent !== null) {
				expect(scene.extent).toBeGreaterThan(0);
				expect(scene.extent).toBeLessThan(1);
			}
			expect(gibbsSceneDefinition(scene.id)).toBe(scene);
		}
		expect(() => gibbsSceneDefinition('missing' as never)).toThrow(/Unknown gibbs/);
	});

	it('stages Le Chatelier honestly: squeeze moves the floor left, heat moves it right', () => {
		const base = equilibriumExtent(298.15, 1);
		const squeeze = gibbsSceneDefinition('squeeze');
		expect(equilibriumExtent(squeeze.temperatureC + 273.15, squeeze.pressureBar)).toBeLessThan(
			base
		);
		const heat = gibbsSceneDefinition('heat');
		expect(equilibriumExtent(heat.temperatureC + 273.15, heat.pressureBar)).toBeGreaterThan(base);
	});

	it('the positive-ΔG° scene sits near the bottomless left edge', () => {
		const scene = gibbsSceneDefinition('positive-deltaG0');
		expect(scene.extent).not.toBeNull();
		expect(scene.extent!).toBeLessThan(0.05);
		expect(scene.showSlope).toBe(true);
	});
});

describe('nernst scene parity', () => {
	const stageIds = NERNST_SCENES.map((scene) => scene.id);

	it('keeps ids unique and both locales aligned', () => {
		expect(new Set(stageIds).size).toBe(stageIds.length);
		expect(zhCNNernstContent.scenes.map((scene) => scene.id)).toEqual(stageIds);
		expect(enNernstContent.scenes.map((scene) => scene.id)).toEqual(stageIds);
	});

	it('keeps concentrations positive and resolves lookups', () => {
		for (const scene of NERNST_SCENES) {
			expect(scene.zincMolar).toBeGreaterThan(0);
			expect(scene.copperMolar).toBeGreaterThan(0);
			expect(nernstSceneDefinition(scene.id)).toBe(scene);
		}
		expect(() => nernstSceneDefinition('missing' as never)).toThrow(/Unknown nernst/);
	});

	it('the dead-battery scene is nearly drained', () => {
		const scene = nernstSceneDefinition('dead-battery');
		expect(scene.copperMolar).toBeLessThan(0.01);
		expect(scene.zincMolar + scene.copperMolar).toBeCloseTo(2, 6);
	});
});
