import type { StorySceneContent } from '$lib/content';

/**
 * The visual state each narrative scene drives on the shared stage.
 *
 * Scenes are keyed by the same ids the locale content uses, so narrative text
 * (zh-CN/en) and stage direction can never drift apart positionally — the
 * content-parity spec asserts all three lists agree on ordered ids.
 */

export type StorySceneId = StorySceneContent['id'];

export type StageFocus = 'macro' | 'micro' | 'symbol' | 'all';

export interface SceneDefinition {
	/** Stable id shared with every locale's narrative content. */
	id: StorySceneId;
	/** Liquid-phase ethanol mole fraction the stage rests on. */
	composition: number;
	/** Ideal equilibrium stages drawn as a staircase on the diagram. */
	stage: number;
	/** 0 = ideal Raoult baseline, 1 = calibrated Margules model. */
	interactionScale: number;
	/** How much of the T-x-y map has been revealed so far (0–1). */
	reveal: number;
	/** Which representation the reader should be looking at. */
	focus: StageFocus;
	/** Mark the azeotrope on the diagram from this scene onwards. */
	showAzeotrope: boolean;
	/** Overlay the Lai 2014 measurements on the diagram. */
	showExperimentalData: boolean;
}

export const ETHANOL_DISTILLATION_SCENES: readonly SceneDefinition[] = [
	{
		id: 'hook',
		composition: 0.1,
		stage: 0,
		interactionScale: 1,
		reveal: 0.08,
		focus: 'macro',
		showAzeotrope: false,
		showExperimentalData: false
	},
	{
		id: 'composition-language',
		composition: 0.25,
		stage: 0,
		interactionScale: 0,
		reveal: 0.08,
		focus: 'micro',
		showAzeotrope: false,
		showExperimentalData: false
	},
	{
		id: 'first-bubble',
		composition: 0.1,
		stage: 0,
		interactionScale: 0,
		reveal: 0.14,
		focus: 'macro',
		showAzeotrope: false,
		showExperimentalData: false
	},
	{
		id: 'tie-line',
		composition: 0.1,
		stage: 0,
		interactionScale: 0,
		reveal: 0.22,
		focus: 'all',
		showAzeotrope: false,
		showExperimentalData: false
	},
	{
		id: 'build-the-map',
		composition: 0.4,
		stage: 0,
		interactionScale: 0,
		reveal: 1,
		focus: 'symbol',
		showAzeotrope: false,
		showExperimentalData: false
	},
	{
		id: 'equilibrium-cascade',
		composition: 0.1,
		stage: 7,
		interactionScale: 0,
		reveal: 1,
		focus: 'symbol',
		showAzeotrope: false,
		showExperimentalData: false
	},
	{
		id: 'nonideal-model',
		composition: 0.35,
		stage: 0,
		interactionScale: 1,
		reveal: 1,
		focus: 'all',
		showAzeotrope: true,
		showExperimentalData: true
	},
	{
		id: 'fixed-point',
		composition: 0.82,
		stage: 0,
		interactionScale: 1,
		reveal: 1,
		focus: 'symbol',
		showAzeotrope: true,
		showExperimentalData: true
	},
	{
		id: 'change-the-operation',
		composition: 0.891,
		stage: 0,
		interactionScale: 1,
		reveal: 1,
		focus: 'macro',
		showAzeotrope: true,
		showExperimentalData: true
	}
];

const sceneById: ReadonlyMap<StorySceneId, SceneDefinition> = new Map(
	ETHANOL_DISTILLATION_SCENES.map((scene) => [scene.id, scene])
);

export function sceneDefinition(id: StorySceneId): SceneDefinition {
	const definition = sceneById.get(id);
	if (!definition) throw new Error(`No stage direction defined for scene "${id}"`);
	return definition;
}
