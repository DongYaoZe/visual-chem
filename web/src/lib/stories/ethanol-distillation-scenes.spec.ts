import { describe, expect, it } from 'vitest';
import {
	enEthanolDistillationContent,
	zhCNEthanolDistillationContent
} from '$lib/content/stories/ethanol-distillation';
import { ETHANOL_DISTILLATION_SCENES, sceneDefinition } from './ethanol-distillation-scenes';

// 叙事文本（各语言）与舞台指示共享同一份有序场景 id。
// 任何一方增删、重排场景而其他方未跟上，这里必须先红。
describe('ethanol-distillation scene parity', () => {
	const stageIds = ETHANOL_DISTILLATION_SCENES.map((scene) => scene.id);

	it('keeps scene ids unique', () => {
		expect(new Set(stageIds).size).toBe(stageIds.length);
	});

	it('keeps zh-CN narrative in the same order as the stage directions', () => {
		expect(zhCNEthanolDistillationContent.scenes.map((scene) => scene.id)).toEqual(stageIds);
	});

	it('keeps English narrative in the same order as the stage directions', () => {
		expect(enEthanolDistillationContent.scenes.map((scene) => scene.id)).toEqual(stageIds);
	});

	it('resolves every content id to a stage direction', () => {
		for (const scene of zhCNEthanolDistillationContent.scenes) {
			expect(sceneDefinition(scene.id)).toBeDefined();
		}
	});

	it('keeps stage state within physical bounds', () => {
		for (const scene of ETHANOL_DISTILLATION_SCENES) {
			expect(scene.composition, scene.id).toBeGreaterThan(0);
			expect(scene.composition, scene.id).toBeLessThan(1);
			expect(scene.reveal, scene.id).toBeGreaterThan(0);
			expect(scene.reveal, scene.id).toBeLessThanOrEqual(1);
			expect(scene.interactionScale, scene.id).toBeGreaterThanOrEqual(0);
			expect(scene.interactionScale, scene.id).toBeLessThanOrEqual(1);
			expect(scene.stage, scene.id).toBeGreaterThanOrEqual(0);
			expect(Number.isInteger(scene.stage), scene.id).toBe(true);
		}
	});
});
