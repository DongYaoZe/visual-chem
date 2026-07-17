import { describe, expect, it } from 'vitest';
import { classifyWaterPhase, celsiusToKelvin, sublimationPressurePa } from '$lib/chem';
import { enBoilingMapContent, zhCNBoilingMapContent } from '$lib/content/stories/boiling-map';
import {
	ALTITUDE_LANDMARKS,
	BOILING_MAP_SCENES,
	FREEZE_DRY_WAYPOINTS,
	boilingSceneDefinition,
	freezeDryState
} from './boiling-map-scenes';

// 叙事文本（各语言）与舞台指示共享同一份有序场景 id。
// 任何一方增删、重排场景而其他方未跟上，这里必须先红。
describe('boiling-map scene parity', () => {
	const stageIds = BOILING_MAP_SCENES.map((scene) => scene.id);

	it('keeps scene ids unique', () => {
		expect(new Set(stageIds).size).toBe(stageIds.length);
	});

	it('keeps zh-CN narrative in the same order as the stage directions', () => {
		expect(zhCNBoilingMapContent.scenes.map((scene) => scene.id)).toEqual(stageIds);
	});

	it('keeps English narrative in the same order as the stage directions', () => {
		expect(enBoilingMapContent.scenes.map((scene) => scene.id)).toEqual(stageIds);
	});

	it('resolves every content id to a stage direction', () => {
		for (const scene of zhCNBoilingMapContent.scenes) {
			expect(boilingSceneDefinition(scene.id)).toBeDefined();
		}
	});

	it('labels every altitude landmark in both languages', () => {
		for (const landmark of ALTITUDE_LANDMARKS) {
			expect(zhCNBoilingMapContent.interactions.altitude.landmarks[landmark.id]).toBeTruthy();
			expect(enBoilingMapContent.interactions.altitude.landmarks[landmark.id]).toBeTruthy();
		}
	});

	it('keeps stage state within the map and physically consistent', () => {
		for (const scene of BOILING_MAP_SCENES) {
			expect(scene.reveal, scene.id).toBeGreaterThan(0);
			expect(scene.reveal, scene.id).toBeLessThanOrEqual(1);
			expect(scene.pressurePa, scene.id).toBeGreaterThan(0);
			expect(scene.temperatureC, scene.id).toBeGreaterThan(-80);
			expect(scene.temperatureC, scene.id).toBeLessThan(400);
			// Every scene's default state must classify without throwing.
			expect(() =>
				classifyWaterPhase(celsiusToKelvin(scene.temperatureC), scene.pressurePa)
			).not.toThrow();
		}
	});

	it('keeps the story anchors honest', () => {
		const hook = boilingSceneDefinition('hook');
		// Lhasa: boiling water below 90 °C but above 85 °C.
		expect(hook.temperatureC).toBeGreaterThan(85);
		expect(hook.temperatureC).toBeLessThan(90);
		const cooker = boilingSceneDefinition('pressure-cooker');
		// Two atmospheres: about 120 °C.
		expect(cooker.temperatureC).toBeGreaterThan(119);
		expect(cooker.temperatureC).toBeLessThan(122);
	});
});

describe('freeze-dry programme', () => {
	it('ends below the sublimation pressure of its coldest ice', () => {
		// The vacuum leg must sit under the sublimation line at −30 °C,
		// otherwise the final heating leg would melt instead of sublimate.
		const chamberPa = FREEZE_DRY_WAYPOINTS[2].pressurePa;
		expect(chamberPa).toBeLessThan(sublimationPressurePa(celsiusToKelvin(-30)));
	});

	it('starts as liquid, freezes, then sublimates to vapor', () => {
		const start = freezeDryState(0);
		expect(classifyWaterPhase(celsiusToKelvin(start.temperatureC), start.pressurePa)).toBe(
			'liquid'
		);
		const frozen = freezeDryState(1 / 3);
		expect(classifyWaterPhase(celsiusToKelvin(frozen.temperatureC), frozen.pressurePa)).toBe(
			'solid'
		);
		const done = freezeDryState(1);
		expect(classifyWaterPhase(celsiusToKelvin(done.temperatureC), done.pressurePa)).toBe('vapor');
	});

	it('clamps progress and interpolates pressure in log space', () => {
		expect(freezeDryState(-1)).toEqual(freezeDryState(0));
		expect(freezeDryState(2)).toEqual(freezeDryState(1));
		// Halfway through evacuation the pressure is the geometric mean.
		const evacuating = freezeDryState(0.5);
		expect(evacuating.stageIndex).toBe(1);
		expect(evacuating.pressurePa).toBeCloseTo(Math.sqrt(101325 * 30), 6);
	});
});
