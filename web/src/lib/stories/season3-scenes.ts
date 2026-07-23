/**
 * Stage directions for season 3: one clock, one thermal population, and one
 * reaction landscape. Interactive scenes override these defaults, while the
 * parity spec keeps the stage, Chinese copy, and English copy in lockstep.
 */

import type { ReactionOrder } from '$lib/chem';
import { H2O2_BARRIERS_KJ, eaFromTwoPoints } from '$lib/chem';
import type { ArrheniusSceneId, CatalystSceneId, KineticsSceneId } from '$lib/content/types';

/* --- Story 8 · The concentration countdown ----------------------------- */

export interface KineticsSceneDefinition {
	readonly id: KineticsSceneId;
	readonly order: ReactionOrder;
	readonly c0: number;
	readonly k: number;
	readonly timeS: number;
	readonly totalTimeS: number;
	readonly showHalfLives: boolean;
	readonly running: boolean;
}

const kineticsScene = (
	id: KineticsSceneId,
	overrides: Partial<Omit<KineticsSceneDefinition, 'id'>> = {}
): KineticsSceneDefinition => ({
	id,
	order: 1,
	c0: 1,
	k: 0.012,
	timeS: 36,
	totalTimeS: 240,
	showHalfLives: true,
	running: false,
	...overrides
});

export const KINETICS_SCENES: readonly KineticsSceneDefinition[] = [
	kineticsScene('hook', { timeS: 0, showHalfLives: false }),
	kineticsScene('watch-it-fall', { timeS: 0, showHalfLives: false }),
	kineticsScene('half-life', { timeS: Math.LN2 / 0.012 }),
	kineticsScene('fingerprints', { order: 1, k: 0.012, timeS: 72, totalTimeS: 360 }),
	kineticsScene('rate-law', { timeS: 96 }),
	kineticsScene('carbon-clock', { timeS: 118 }),
	kineticsScene('not-all-equal', { k: 0.006, timeS: 120, totalTimeS: 420 }),
	kineticsScene('sandbox', { timeS: 80, totalTimeS: 300 })
];

export function kineticsSceneDefinition(id: KineticsSceneId): KineticsSceneDefinition {
	const definition = KINETICS_SCENES.find((candidate) => candidate.id === id);
	if (!definition) throw new Error(`Unknown kinetics scene id: ${id}`);
	return definition;
}

/* --- Story 9 · Molecules over the mountain ------------------------------ */

export const ARRHENIUS_TWO_POINT_EA_KJ_PER_MOL = eaFromTwoPoints(293.15, 1.2e-3, 313.15, 6.09e-3);

export interface ArrheniusSceneDefinition {
	readonly id: ArrheniusSceneId;
	readonly temperatureC: number;
	readonly referenceTemperatureC: number;
	readonly eaKJPerMol: number;
	readonly showReference: boolean;
	readonly active: boolean;
}

const arrheniusScene = (
	id: ArrheniusSceneId,
	overrides: Partial<Omit<ArrheniusSceneDefinition, 'id'>> = {}
): ArrheniusSceneDefinition => ({
	id,
	temperatureC: 25,
	referenceTemperatureC: 5,
	eaKJPerMol: 53,
	showReference: true,
	active: false,
	...overrides
});

export const ARRHENIUS_SCENES: readonly ArrheniusSceneDefinition[] = [
	arrheniusScene('hook', {
		temperatureC: 4,
		referenceTemperatureC: 25,
		eaKJPerMol: 75
	}),
	arrheniusScene('two-populations'),
	arrheniusScene('the-tail', {
		temperatureC: 40,
		referenceTemperatureC: 25,
		eaKJPerMol: 50,
		active: true
	}),
	arrheniusScene('arrhenius-law', { temperatureC: 30, referenceTemperatureC: 25 }),
	arrheniusScene('rule-of-thumb', { temperatureC: 35, referenceTemperatureC: 25 }),
	arrheniusScene('life-runs-on-it', {
		temperatureC: 4,
		referenceTemperatureC: 25,
		eaKJPerMol: 75,
		active: true
	}),
	arrheniusScene('two-point', {
		temperatureC: 40,
		referenceTemperatureC: 20,
		eaKJPerMol: ARRHENIUS_TWO_POINT_EA_KJ_PER_MOL
	}),
	arrheniusScene('sandbox', {
		temperatureC: 35,
		referenceTemperatureC: 25,
		active: true
	})
];

export function arrheniusSceneDefinition(id: ArrheniusSceneId): ArrheniusSceneDefinition {
	const definition = ARRHENIUS_SCENES.find((candidate) => candidate.id === id);
	if (!definition) throw new Error(`Unknown Arrhenius scene id: ${id}`);
	return definition;
}

/* --- Story 10 · The shortcut that moves no valley ----------------------- */

export type CatalystPath = 'none' | 'iodide' | 'catalase';

export interface CatalystSceneDefinition {
	readonly id: CatalystSceneId;
	readonly catalyst: CatalystPath;
	readonly eaKJPerMol: number;
	readonly temperatureC: number;
	readonly showCatalyzedPath: boolean;
	readonly active: boolean;
}

const catalystScene = (
	id: CatalystSceneId,
	overrides: Partial<Omit<CatalystSceneDefinition, 'id'>> = {}
): CatalystSceneDefinition => ({
	id,
	catalyst: 'iodide',
	eaKJPerMol: H2O2_BARRIERS_KJ.iodide,
	temperatureC: 25,
	showCatalyzedPath: true,
	active: false,
	...overrides
});

export const CATALYST_SCENES: readonly CatalystSceneDefinition[] = [
	catalystScene('hook', {
		catalyst: 'none',
		eaKJPerMol: H2O2_BARRIERS_KJ.uncatalyzed,
		showCatalyzedPath: false
	}),
	catalystScene('the-pass', {
		catalyst: 'none',
		eaKJPerMol: H2O2_BARRIERS_KJ.uncatalyzed,
		showCatalyzedPath: false
	}),
	catalystScene('lower-pass', { active: true }),
	catalystScene('both-ways'),
	catalystScene('unconsumed', { active: true }),
	catalystScene('enzymes', {
		catalyst: 'catalase',
		eaKJPerMol: H2O2_BARRIERS_KJ.catalase,
		active: true
	}),
	catalystScene('no-free-lunch', { catalyst: 'catalase', eaKJPerMol: H2O2_BARRIERS_KJ.catalase }),
	catalystScene('sandbox', { active: true })
];

export function catalystSceneDefinition(id: CatalystSceneId): CatalystSceneDefinition {
	const definition = CATALYST_SCENES.find((candidate) => candidate.id === id);
	if (!definition) throw new Error(`Unknown catalyst scene id: ${id}`);
	return definition;
}
