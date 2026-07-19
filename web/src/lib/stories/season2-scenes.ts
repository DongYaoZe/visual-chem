/**
 * Stage directions for the three season-2 stories, keyed by scene id.
 *
 * Season-2 scenes are lighter than season 1: each pins the default state of
 * its story's model and which symbolic layers are revealed. Interactive
 * scenes override parts from reader input; the parity specs keep ids aligned
 * with both locales.
 */

import type { EntropySceneId, GibbsSceneId, NernstSceneId } from '$lib/content/types';

/* --- Story 5 · Entropy --------------------------------------------------- */

export interface EntropySceneDefinition {
	readonly id: EntropySceneId;
	/** Total particles N. */
	readonly total: number;
	/** Particles in the left bulb; null = the even split. */
	readonly leftCount: number | null;
	readonly valveOpen: boolean;
	/** Highlight the all-left bar on the histogram. */
	readonly markAllLeft: boolean;
}

const entropyScene = (
	id: EntropySceneId,
	overrides: Partial<Omit<EntropySceneDefinition, 'id'>> = {}
): EntropySceneDefinition => ({
	id,
	total: 100,
	leftCount: null,
	valveOpen: true,
	markAllLeft: false,
	...overrides
});

export const ENTROPY_SCENES: readonly EntropySceneDefinition[] = [
	entropyScene('hook', { leftCount: 100, valveOpen: false }),
	entropyScene('count-the-ways', { total: 4, leftCount: 2 }),
	entropyScene('the-spike'),
	entropyScene('boltzmann'),
	entropyScene('irreversible', { leftCount: 100, markAllLeft: true }),
	entropyScene('fluctuations'),
	entropyScene('not-disorder'),
	entropyScene('sandbox')
];

export function entropySceneDefinition(id: EntropySceneId): EntropySceneDefinition {
	const definition = ENTROPY_SCENES.find((candidate) => candidate.id === id);
	if (!definition) throw new Error(`Unknown entropy scene id: ${id}`);
	return definition;
}

/* --- Story 6 · Gibbs valley ---------------------------------------------- */

export interface GibbsSceneDefinition {
	readonly id: GibbsSceneId;
	readonly temperatureC: number;
	readonly pressureBar: number;
	/** Ball position ξ; null = sit at the equilibrium floor. */
	readonly extent: number | null;
	readonly showValley: boolean;
	readonly showSlope: boolean;
	readonly showFloor: boolean;
}

const gibbsScene = (
	id: GibbsSceneId,
	overrides: Partial<Omit<GibbsSceneDefinition, 'id'>> = {}
): GibbsSceneDefinition => ({
	id,
	temperatureC: 25,
	pressureBar: 1,
	extent: null,
	showValley: true,
	showSlope: false,
	showFloor: true,
	...overrides
});

export const GIBBS_SCENES: readonly GibbsSceneDefinition[] = [
	gibbsScene('hook', { showValley: false, showFloor: false }),
	gibbsScene('two-forces', { extent: 0.5, showValley: false, showFloor: false }),
	gibbsScene('the-valley'),
	gibbsScene('slope-is-deltaG', { extent: 0.6, showSlope: true }),
	gibbsScene('kp-position'),
	gibbsScene('squeeze', { pressureBar: 2 }),
	gibbsScene('heat', { temperatureC: 60 }),
	gibbsScene('positive-deltaG0', { extent: 0.02, showSlope: true }),
	gibbsScene('sandbox')
];

export function gibbsSceneDefinition(id: GibbsSceneId): GibbsSceneDefinition {
	const definition = GIBBS_SCENES.find((candidate) => candidate.id === id);
	if (!definition) throw new Error(`Unknown gibbs scene id: ${id}`);
	return definition;
}

/* --- Story 7 · Nernst ----------------------------------------------------- */

export interface NernstSceneDefinition {
	readonly id: NernstSceneId;
	readonly zincMolar: number;
	readonly copperMolar: number;
	readonly temperatureK: number;
	/** Show the full standard-potential ladder context. */
	readonly showLadder: boolean;
	/** Animate electron flow. */
	readonly active: boolean;
}

const nernstScene = (
	id: NernstSceneId,
	overrides: Partial<Omit<NernstSceneDefinition, 'id'>> = {}
): NernstSceneDefinition => ({
	id,
	zincMolar: 1,
	copperMolar: 1,
	temperatureK: 298.15,
	showLadder: false,
	active: false,
	...overrides
});

export const NERNST_SCENES: readonly NernstSceneDefinition[] = [
	nernstScene('hook', { active: true }),
	nernstScene('two-heights', { showLadder: true }),
	nernstScene('the-ladder', { showLadder: true }),
	nernstScene('nernst-slope', { showLadder: true }),
	nernstScene('discharge', { active: true }),
	nernstScene('dead-battery', { zincMolar: 1.999, copperMolar: 0.001 }),
	nernstScene('concentration-cell', { showLadder: true }),
	nernstScene('sandbox', { showLadder: true })
];

export function nernstSceneDefinition(id: NernstSceneId): NernstSceneDefinition {
	const definition = NERNST_SCENES.find((candidate) => candidate.id === id);
	if (!definition) throw new Error(`Unknown nernst scene id: ${id}`);
	return definition;
}
