import { describe, expect, it } from 'vitest';
import {
	H2O2_DELTA_H_KJ,
	accelerationFactor,
	barriers,
	c14AgeYears,
	concentrationAt,
	rateAt,
	rateRatio,
	successiveHalfLives
} from '$lib/chem';
import { enArrheniusContent, zhCNArrheniusContent } from '$lib/content/stories/arrhenius';
import { enCatalystContent, zhCNCatalystContent } from '$lib/content/stories/catalyst';
import { enKineticsContent, zhCNKineticsContent } from '$lib/content/stories/kinetics';
import {
	ARRHENIUS_SCENES,
	CATALYST_SCENES,
	KINETICS_SCENES,
	arrheniusSceneDefinition,
	catalystSceneDefinition,
	kineticsSceneDefinition
} from './season3-scenes';

function expectLocaleParity(
	stageIds: readonly string[],
	zhScenes: readonly { id: string }[],
	enScenes: readonly { id: string }[],
	zhKickers: Readonly<Record<string, string>>,
	enKickers: Readonly<Record<string, string>>
): void {
	expect(new Set(stageIds).size).toBe(stageIds.length);
	expect(zhScenes.map((scene) => scene.id)).toEqual(stageIds);
	expect(enScenes.map((scene) => scene.id)).toEqual(stageIds);
	for (const id of stageIds) {
		expect(zhKickers[id]).toBeTruthy();
		expect(enKickers[id]).toBeTruthy();
	}
}

describe('kinetics scene parity', () => {
	const stageIds = KINETICS_SCENES.map((scene) => scene.id);

	it('keeps stage directions and both locales aligned', () => {
		expectLocaleParity(
			stageIds,
			zhCNKineticsContent.scenes,
			enKineticsContent.scenes,
			zhCNKineticsContent.kickers,
			enKineticsContent.kickers
		);
	});

	it('keeps every clock state physical and resolvable', () => {
		for (const scene of KINETICS_SCENES) {
			expect(scene.c0).toBeGreaterThan(0);
			expect(scene.k).toBeGreaterThan(0);
			expect(scene.timeS).toBeGreaterThanOrEqual(0);
			expect(scene.timeS).toBeLessThanOrEqual(scene.totalTimeS);
			expect(kineticsSceneDefinition(scene.id)).toBe(scene);
		}
		expect(() => kineticsSceneDefinition('missing' as never)).toThrow(/Unknown kinetics/);
	});

	it('pins the three successive-half-life fingerprints and the carbon clock', () => {
		expect(successiveHalfLives(0, 1, 0.01)).toEqual([50, 25, 12.5]);
		expect(successiveHalfLives(1, 1, 0.01)[1]).toBeCloseTo(successiveHalfLives(1, 1, 0.01)[0], 12);
		expect(successiveHalfLives(2, 1, 0.01)).toEqual([100, 200, 400]);
		expect(c14AgeYears(0.53)).toBeGreaterThan(5000);
		expect(c14AgeYears(0.53)).toBeLessThan(5500);
	});

	it('aligns controlled scene defaults with the page state and rate encoding', () => {
		const watch = kineticsSceneDefinition('watch-it-fall');
		expect(watch.timeS).toBe(0);
		expect(watch.running).toBe(false);
		expect(kineticsSceneDefinition('hook').showHalfLives).toBe(false);
		expect(watch.showHalfLives).toBe(false);
		expect(kineticsSceneDefinition('half-life').showHalfLives).toBe(true);
		expect(kineticsSceneDefinition('fingerprints')).toMatchObject({
			order: 1,
			c0: 1,
			k: 0.012,
			timeS: 72,
			totalTimeS: 360
		});
		expect(kineticsSceneDefinition('sandbox')).toMatchObject({
			order: 1,
			c0: 1,
			k: 0.012,
			timeS: 80,
			totalTimeS: 300
		});

		const k = 0.01;
		const c0 = 1;
		const relativeRate = (order: 0 | 1 | 2, fraction: number) =>
			rateAt(order, c0 * fraction, k) / rateAt(order, c0, k);
		expect(relativeRate(0, 0.8)).toBe(1);
		expect(relativeRate(0, 0.2)).toBe(1);
		expect(relativeRate(1, 0.5)).toBeCloseTo(0.5, 12);
		expect(relativeRate(2, 0.5)).toBeCloseTo(0.25, 12);
		expect(concentrationAt(2, 2, k, 80) / 2).toBeLessThan(concentrationAt(1, 2, k, 80) / 2);
	});
});

describe('Arrhenius scene parity', () => {
	const stageIds = ARRHENIUS_SCENES.map((scene) => scene.id);

	it('keeps stage directions and both locales aligned', () => {
		expectLocaleParity(
			stageIds,
			zhCNArrheniusContent.scenes,
			enArrheniusContent.scenes,
			zhCNArrheniusContent.kickers,
			enArrheniusContent.kickers
		);
	});

	it('keeps every thermal state in the teaching window and resolvable', () => {
		for (const scene of ARRHENIUS_SCENES) {
			expect(scene.temperatureC).toBeGreaterThanOrEqual(-20);
			expect(scene.temperatureC).toBeLessThanOrEqual(100);
			expect(scene.referenceTemperatureC).toBeGreaterThanOrEqual(-20);
			expect(scene.referenceTemperatureC).toBeLessThanOrEqual(100);
			expect(scene.eaKJPerMol).toBeGreaterThan(0);
			expect(arrheniusSceneDefinition(scene.id)).toBe(scene);
		}
		expect(() => arrheniusSceneDefinition('missing' as never)).toThrow(/Unknown Arrhenius/);
	});

	it('makes the ten-degree rule a 53 kJ/mol coincidence, not a law', () => {
		const roomTemperatureK = 298.15;
		expect(rateRatio(53, roomTemperatureK, roomTemperatureK + 10)).toBeCloseTo(2, 1);
		expect(rateRatio(20, roomTemperatureK, roomTemperatureK + 10)).toBeLessThan(1.4);
		expect(rateRatio(120, roomTemperatureK, roomTemperatureK + 10)).toBeGreaterThan(4);
	});

	it('pins every narrative temperature and barrier to the state the stage receives', () => {
		expect(arrheniusSceneDefinition('hook')).toMatchObject({
			temperatureC: 4,
			referenceTemperatureC: 25,
			eaKJPerMol: 75
		});
		expect(arrheniusSceneDefinition('the-tail')).toMatchObject({
			temperatureC: 40,
			referenceTemperatureC: 25,
			eaKJPerMol: 50
		});
		expect(arrheniusSceneDefinition('rule-of-thumb')).toMatchObject({
			temperatureC: 35,
			referenceTemperatureC: 25,
			eaKJPerMol: 53
		});
		expect(arrheniusSceneDefinition('life-runs-on-it')).toMatchObject({
			temperatureC: 4,
			referenceTemperatureC: 25,
			eaKJPerMol: 75
		});
		const twoPoint = arrheniusSceneDefinition('two-point');
		expect(twoPoint).toMatchObject({
			temperatureC: 40,
			referenceTemperatureC: 20
		});
		expect(twoPoint.eaKJPerMol).toBeCloseTo(61.9897436323, 10);
		expect(arrheniusSceneDefinition('sandbox')).toMatchObject({
			temperatureC: 35,
			referenceTemperatureC: 25,
			eaKJPerMol: 53
		});
	});
});

describe('catalyst scene parity', () => {
	const stageIds = CATALYST_SCENES.map((scene) => scene.id);

	it('keeps stage directions and both locales aligned', () => {
		expectLocaleParity(
			stageIds,
			zhCNCatalystContent.scenes,
			enCatalystContent.scenes,
			zhCNCatalystContent.kickers,
			enCatalystContent.kickers
		);
	});

	it('keeps every pathway physical and resolvable', () => {
		for (const scene of CATALYST_SCENES) {
			expect(scene.eaKJPerMol).toBeGreaterThan(0);
			expect(scene.temperatureC).toBeGreaterThan(-273.15);
			expect(catalystSceneDefinition(scene.id)).toBe(scene);
		}
		expect(() => catalystSceneDefinition('missing' as never)).toThrow(/Unknown catalyst/);
	});

	it('lowers forward and reverse barriers equally, leaving the valleys fixed', () => {
		const plain = barriers(73, H2O2_DELTA_H_KJ);
		const iodide = barriers(56, H2O2_DELTA_H_KJ);
		expect(plain.forward - iodide.forward).toBe(17);
		expect(plain.reverse - iodide.reverse).toBe(17);
		expect(accelerationFactor(73, 56, 298.15)).toBeCloseTo(
			accelerationFactor(plain.reverse, iodide.reverse, 298.15),
			10
		);
	});

	it('pins the temperature-only sandbox to the fixed 73/56 kJ/mol paths', () => {
		expect(catalystSceneDefinition('sandbox')).toMatchObject({
			catalyst: 'iodide',
			eaKJPerMol: 56,
			temperatureC: 25,
			showCatalyzedPath: true,
			active: true
		});
		expect(accelerationFactor(73, 56, 298.15)).toBeCloseTo(951, 0);
		expect(accelerationFactor(73, 56, 373.15)).toBeCloseTo(240, 0);
	});
});
