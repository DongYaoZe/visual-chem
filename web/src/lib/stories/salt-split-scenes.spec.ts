import { describe, expect, it } from 'vitest';
import { harvestSolids, solveSaltEquilibrium } from '$lib/chem';
import { enSaltSplitContent, zhCNSaltSplitContent } from '$lib/content/stories/salt-split';
import {
	COLD_TEMPERATURE_C,
	EVAPORATION_MAX_G,
	HONEST_MAP_TEMPERATURE_C,
	HOOK_POT,
	SALT_SPLIT_SCENES,
	coldHookPot,
	hookMotherLiquor,
	saltSceneDefinition
} from './salt-split-scenes';

// 叙事文本（各语言）与舞台指示共享同一份有序场景 id。
// 任何一方增删、重排场景而其他方未跟上，这里必须先红。
describe('salt-split scene parity', () => {
	const stageIds = SALT_SPLIT_SCENES.map((scene) => scene.id);

	it('keeps scene ids unique', () => {
		expect(new Set(stageIds).size).toBe(stageIds.length);
	});

	it('keeps zh-CN narrative in the same order as the stage directions', () => {
		expect(zhCNSaltSplitContent.scenes.map((scene) => scene.id)).toEqual(stageIds);
	});

	it('keeps English narrative in the same order as the stage directions', () => {
		expect(enSaltSplitContent.scenes.map((scene) => scene.id)).toEqual(stageIds);
	});

	it('resolves every content id to a stage direction', () => {
		for (const scene of zhCNSaltSplitContent.scenes) {
			expect(saltSceneDefinition(scene.id)).toBeDefined();
		}
	});

	it('keeps every scene pot physically solvable in both models', () => {
		for (const scene of SALT_SPLIT_SCENES) {
			for (const scale of [0, 1]) {
				expect(() => solveSaltEquilibrium(scene.pot, scale), scene.id).not.toThrow();
			}
		}
	});
});

describe('the classic split route the scenes stage', () => {
	it('opens fully dissolved and hot', () => {
		expect(solveSaltEquilibrium(HOOK_POT, 1).region).toBe('unsaturated');
	});

	it('cools to pure KNO3 at 25 °C — the hook answer', () => {
		const split = solveSaltEquilibrium(coldHookPot(), 1);
		expect(split.region).toBe('kno3');
		expect(split.solids.nano3G).toBe(0);
		// The narrative claims "about 54 g"; hold the text to the model.
		expect(split.solids.kno3G).toBeGreaterThan(52);
		expect(split.solids.kno3G).toBeLessThan(57);
	});

	it('cools into the two-salt valley a few degrees further — the cliff the story warns about', () => {
		expect(solveSaltEquilibrium({ ...HOOK_POT, temperatureC: 20 }, 1).region).toBe('both');
	});

	it('the ideal model wrongly convicts the hook pot of mixed crystals', () => {
		expect(solveSaltEquilibrium(coldHookPot(), 0).region).toBe('both');
	});

	it('evaporating the mother liquor at 100 °C drops pure NaNO3, then the valley punishes greed', () => {
		const liquor = hookMotherLiquor(100);
		const midway = solveSaltEquilibrium({ ...liquor, waterG: liquor.waterG - 80 }, 1);
		expect(midway.region).toBe('nano3');
		expect(midway.solids.kno3G).toBe(0);
		expect(midway.solids.nano3G).toBeGreaterThan(55);
		const overshot = solveSaltEquilibrium(
			{ ...liquor, waterG: liquor.waterG - EVAPORATION_MAX_G },
			1
		);
		expect(overshot.region).toBe('both');
	});

	it('the two bottles recover most of both salts', () => {
		const first = harvestSolids(coldHookPot(), 1);
		const liquor = { ...first.state, temperatureC: 100 };
		const second = harvestSolids({ ...liquor, waterG: liquor.waterG - 80 }, 1);
		expect(first.harvestedKno3G + second.harvestedKno3G).toBeGreaterThan(50);
		expect(second.harvestedNano3G).toBeGreaterThan(55);
		expect(first.harvestedNano3G).toBe(0);
		expect(second.harvestedKno3G).toBe(0);
	});

	it('stages the verdict scene at the measured Carroll temperature', () => {
		const scene = saltSceneDefinition('honest-map');
		expect(scene.pot.temperatureC).toBe(HONEST_MAP_TEMPERATURE_C);
		expect(HONEST_MAP_TEMPERATURE_C).toBe(90);
		expect(scene.showExperimentPoints).toBe(true);
		// The verdict pot must stay dissolved so the toggle compares borders, not crystals.
		expect(solveSaltEquilibrium(scene.pot, 1).region).toBe('unsaturated');
		expect(solveSaltEquilibrium(scene.pot, 0).region).toBe('unsaturated');
	});

	it('anchors the shared-water scene at solo saturation', () => {
		const scene = saltSceneDefinition('shared-water');
		expect(scene.pot.temperatureC).toBe(COLD_TEMPERATURE_C);
		// 38.3 g per 100 g water is the 25 °C table anchor.
		expect(scene.pot.kno3G).toBeCloseTo(38.3, 6);
	});
});
