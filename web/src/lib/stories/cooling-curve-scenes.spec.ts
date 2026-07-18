import { describe, expect, it } from 'vitest';
import { biCdEutectic, eutecticSplit, memoizedCoolingCurve, temperatureAtTime } from '$lib/chem';
import { enCoolingCurveContent, zhCNCoolingCurveContent } from '$lib/content/stories/cooling-curve';
import { COOLING_CURVE_SCENES, coolingSceneDefinition } from './cooling-curve-scenes';

// 叙事文本（各语言）与舞台指示共享同一份有序场景 id。
// 任何一方增删、重排场景而其他方未跟上，这里必须先红。
describe('cooling-curve scene parity', () => {
	const stageIds = COOLING_CURVE_SCENES.map((scene) => scene.id);

	it('keeps scene ids unique', () => {
		expect(new Set(stageIds).size).toBe(stageIds.length);
	});

	it('keeps zh-CN narrative in the same order as the stage directions', () => {
		expect(zhCNCoolingCurveContent.scenes.map((scene) => scene.id)).toEqual(stageIds);
	});

	it('keeps English narrative in the same order as the stage directions', () => {
		expect(enCoolingCurveContent.scenes.map((scene) => scene.id)).toEqual(stageIds);
	});

	it('resolves every content id to a stage direction', () => {
		for (const scene of zhCNCoolingCurveContent.scenes) {
			expect(coolingSceneDefinition(scene.id)).toBeDefined();
		}
		expect(() => coolingSceneDefinition('missing' as never)).toThrow(/Unknown cooling-curve/);
	});
});

describe('the melt states the scenes stage', () => {
	it('keeps every scene physically resolvable', () => {
		for (const scene of COOLING_CURVE_SCENES) {
			expect(scene.xCd).toBeGreaterThanOrEqual(0);
			expect(scene.xCd).toBeLessThanOrEqual(1);
			const temperatureC =
				scene.temperatureC ?? temperatureAtTime(memoizedCoolingCurve(scene.xCd), scene.timeS ?? 0);
			expect(() => eutecticSplit(scene.xCd, temperatureC + 273.15), scene.id).not.toThrow();
		}
	});

	it('opens with a fully molten hook', () => {
		const hook = coolingSceneDefinition('hook');
		expect(eutecticSplit(hook.xCd, (hook.temperatureC ?? 0) + 273.15).region).toBe('liquid');
	});

	it('parks the pure-metal clock on the melting-point arrest', () => {
		const scene = coolingSceneDefinition('pure-metal');
		expect(scene.xCd).toBe(0);
		const curve = memoizedCoolingCurve(0);
		const arrest = curve.arrest;
		expect(arrest).not.toBeNull();
		expect(scene.timeS).toBeGreaterThan(arrest!.startS);
		expect(scene.timeS).toBeLessThan(arrest!.startS + arrest!.durationS);
	});

	it('parks the eutectic-arrest clock on the invariant plateau', () => {
		const scene = coolingSceneDefinition('eutectic-arrest');
		const curve = memoizedCoolingCurve(scene.xCd);
		const arrest = curve.arrest;
		expect(arrest).not.toBeNull();
		expect(scene.timeS).toBeGreaterThan(arrest!.startS);
		expect(scene.timeS).toBeLessThan(arrest!.startS + arrest!.durationS);
		expect(temperatureAtTime(curve, scene.timeS ?? 0)).toBeCloseTo(biCdEutectic().temperatureC, 4);
	});

	it('anchors the real-anchors scene at the eutectic composition', () => {
		const scene = coolingSceneDefinition('real-anchors');
		expect(scene.xCd).toBeCloseTo(biCdEutectic().xB, 12);
	});
});
