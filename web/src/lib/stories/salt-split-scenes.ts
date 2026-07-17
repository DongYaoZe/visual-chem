/**
 * Stage directions for A Pot of Brine, Split in Two, keyed by scene id.
 *
 * Each scene pins the default pot state and which layers of the stage are
 * visible. Interactive scenes override parts of the pot from reader input;
 * these definitions are the anchors the story returns to, and the parity spec
 * keeps them aligned with the zh/en narrative modules.
 */

import { harvestSolids, kno3SolubilityGPer100g, type SaltPotState } from '$lib/chem';
import type { SaltSplitSceneId } from '$lib/content/types';

export type SaltDiagramMode = 'curves' | 'ternary';
export type SaltStageFocus = 'pot' | 'ions' | 'diagram' | null;

export interface SaltSceneDefinition {
	id: SaltSplitSceneId;
	pot: SaltPotState;
	interactionScale: number;
	diagramMode: SaltDiagramMode;
	focus: SaltStageFocus;
	showIsotherm: boolean;
	showRegions: boolean;
	showEutonic: boolean;
	showTieLine: boolean;
	showTrajectory: boolean;
	showExperimentPoints: boolean;
}

/** The classic split pot: 100 g of each salt in 100 g of water, near boiling. */
export const HOOK_POT: SaltPotState = {
	temperatureC: 100,
	waterG: 100,
	kno3G: 100,
	nano3G: 100
};

export const COLD_TEMPERATURE_C = 25;

export function coldHookPot(): SaltPotState {
	return { ...HOOK_POT, temperatureC: COLD_TEMPERATURE_C };
}

/** The mother liquor left after cooling the hook pot and filtering, reheated. */
export function hookMotherLiquor(temperatureC: number, interactionScale = 1): SaltPotState {
	const { state } = harvestSolids(coldHookPot(), interactionScale);
	return { ...state, temperatureC };
}

/** Water the evaporation scene may remove; keeps the pot short of dryness. */
export const EVAPORATION_MAX_G = 85;

/** Temperature of the model-vs-measurement verdict scene (Carroll 2005 data). */
export const HONEST_MAP_TEMPERATURE_C = 90;

const scene = (
	id: SaltSplitSceneId,
	pot: SaltPotState,
	overrides: Partial<Omit<SaltSceneDefinition, 'id' | 'pot'>> = {}
): SaltSceneDefinition => ({
	id,
	pot,
	interactionScale: 1,
	diagramMode: 'ternary',
	focus: null,
	showIsotherm: false,
	showRegions: false,
	showEutonic: false,
	showTieLine: false,
	showTrajectory: false,
	showExperimentPoints: false,
	...overrides
});

export const SALT_SPLIT_SCENES: readonly SaltSceneDefinition[] = [
	scene('hook', HOOK_POT, { focus: 'pot' }),
	scene('two-curves', coldHookPot(), { diagramMode: 'curves', focus: 'diagram' }),
	scene(
		'shared-water',
		{
			temperatureC: COLD_TEMPERATURE_C,
			waterG: 100,
			kno3G: kno3SolubilityGPer100g(COLD_TEMPERATURE_C),
			nano3G: 30
		},
		// The common-ion lesson runs on the ideal model on purpose: in the
		// calibrated model (and in Reinders' data) salting-in outweighs the
		// common ion at these strengths — that reversal is scene 08's turn.
		{ diagramMode: 'curves', focus: 'ions', interactionScale: 0 }
	),
	scene('triangle-map', coldHookPot(), { focus: 'diagram' }),
	scene('isotherm', coldHookPot(), {
		focus: 'diagram',
		showIsotherm: true,
		showRegions: true,
		showEutonic: true
	}),
	scene('cooling', HOOK_POT, {
		showIsotherm: true,
		showRegions: true,
		showEutonic: true,
		showTieLine: true
	}),
	scene('filter-jump', coldHookPot(), {
		showIsotherm: true,
		showRegions: true,
		showEutonic: true,
		showTieLine: true,
		showTrajectory: true
	}),
	scene('evaporate', hookMotherLiquor(100), {
		showIsotherm: true,
		showRegions: true,
		showEutonic: true,
		showTieLine: true,
		showTrajectory: true
	}),
	scene(
		'honest-map',
		{ ...HOOK_POT, temperatureC: HONEST_MAP_TEMPERATURE_C },
		{
			focus: 'diagram',
			showIsotherm: true,
			showRegions: true,
			showEutonic: true,
			showExperimentPoints: true
		}
	)
];

export function saltSceneDefinition(id: SaltSplitSceneId): SaltSceneDefinition {
	const definition = SALT_SPLIT_SCENES.find((candidate) => candidate.id === id);
	if (!definition) throw new Error(`Unknown salt-split scene: ${id}`);
	return definition;
}
