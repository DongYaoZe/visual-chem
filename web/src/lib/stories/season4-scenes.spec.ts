import { describe, expect, it } from 'vitest';
import { hydrogenSpectrumFrame } from '$lib/chem';
import {
	enHydrogenSpectrumContent,
	zhCNHydrogenSpectrumContent
} from '$lib/content/stories/hydrogen-spectrum';
import { HYDROGEN_SPECTRUM_SCENES, hydrogenSpectrumSceneDefinition } from './season4-scenes';

describe('hydrogen-spectrum scene parity', () => {
	const stageIds = HYDROGEN_SPECTRUM_SCENES.map((scene) => scene.id);

	it('keeps the stage directions, Chinese copy and English copy aligned', () => {
		expect(new Set(stageIds).size).toBe(stageIds.length);
		expect(zhCNHydrogenSpectrumContent.scenes.map((scene) => scene.id)).toEqual(stageIds);
		expect(enHydrogenSpectrumContent.scenes.map((scene) => scene.id)).toEqual(stageIds);
		for (const id of stageIds) {
			expect(zhCNHydrogenSpectrumContent.kickers[id]).toBeTruthy();
			expect(enHydrogenSpectrumContent.kickers[id]).toBeTruthy();
		}
	});

	it('keeps escaped TeX commands free of JavaScript control characters', () => {
		const hasForbiddenControl = (value: string) =>
			Array.from(value).some((character) => {
				const code = character.charCodeAt(0);
				return code <= 31 && code !== 10;
			});
		for (const scene of [
			...zhCNHydrogenSpectrumContent.scenes,
			...enHydrogenSpectrumContent.scenes
		]) {
			expect(hasForbiddenControl(scene.prose)).toBe(false);
		}
	});

	it('keeps every scene on a drawable downward transition', () => {
		for (const scene of HYDROGEN_SPECTRUM_SCENES) {
			expect(scene.lowerN).toBeGreaterThanOrEqual(1);
			expect(scene.upperN).toBeGreaterThan(scene.lowerN);
			expect(scene.upperN).toBeLessThanOrEqual(6);
			expect(hydrogenSpectrumSceneDefinition(scene.id)).toBe(scene);
			const frame = hydrogenSpectrumFrame(scene.upperN, scene.lowerN);
			expect(frame.energyGapEv).toBeCloseTo(frame.photonEnergyEv, 10);
		}
		expect(() => hydrogenSpectrumSceneDefinition('missing' as never)).toThrow(
			/Unknown hydrogen-spectrum/
		);
	});

	it('pins the narrative family changes to UV, visible and IR', () => {
		expect(hydrogenSpectrumFrame(2, 1).region).toBe('ultraviolet');
		expect(hydrogenSpectrumFrame(3, 2).region).toBe('visible');
		expect(hydrogenSpectrumFrame(4, 3).region).toBe('infrared');
		expect(hydrogenSpectrumSceneDefinition('three-families')).toMatchObject({
			upperN: 2,
			lowerN: 1,
			showSeriesSet: true
		});
	});

	it('pins interactive page defaults to their scene contracts', () => {
		expect(hydrogenSpectrumSceneDefinition('measure-the-lines')).toMatchObject({
			upperN: 4,
			lowerN: 2
		});
		expect(hydrogenSpectrumSceneDefinition('three-families')).toMatchObject({
			upperN: 2,
			lowerN: 1
		});
		expect(hydrogenSpectrumSceneDefinition('sandbox')).toMatchObject({
			upperN: 4,
			lowerN: 2,
			showSeriesSet: false
		});
	});
});
