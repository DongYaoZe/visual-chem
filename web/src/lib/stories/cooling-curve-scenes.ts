/**
 * Stage directions for The Cooling-Curve Detective, keyed by scene id.
 *
 * Each scene pins the default melt composition, where the clock stands on the
 * recorded curve (timeS reads the temperature off the simulation), which mode
 * the symbolic panel is in — the time-domain curve or the T–x map — and which
 * map layers are revealed. Interactive scenes override parts of this from
 * reader input; the parity spec keeps ids aligned with both locales.
 */

import { biCdEutectic } from '$lib/chem';
import type { CoolingCurveSceneId } from '$lib/content/types';

export type CoolingDiagramMode = 'curve' | 'map';

export interface CoolingSceneDefinition {
	readonly id: CoolingCurveSceneId;
	/** Default melt composition, mole fraction of Cd. */
	readonly xCd: number;
	/** Fixed temperature in °C; null means read it from the curve at timeS. */
	readonly temperatureC: number | null;
	/** Clock position on the recorded curve, seconds; null hides the clock. */
	readonly timeS: number | null;
	readonly mode: CoolingDiagramMode;
	readonly showLiquidus: boolean;
	readonly showSolidus: boolean;
	readonly showEutectic: boolean;
}

const EUTECTIC_XCD = biCdEutectic().xB;

const scene = (
	id: CoolingCurveSceneId,
	overrides: Partial<Omit<CoolingSceneDefinition, 'id'>> = {}
): CoolingSceneDefinition => ({
	id,
	xCd: 0.35,
	temperatureC: null,
	timeS: null,
	mode: 'curve',
	showLiquidus: false,
	showSolidus: false,
	showEutectic: false,
	...overrides
});

export const COOLING_CURVE_SCENES: readonly CoolingSceneDefinition[] = [
	scene('hook', { temperatureC: 330, mode: 'curve' }),
	scene('pure-metal', { xCd: 0, timeS: 300 }),
	scene('first-crystal', { timeS: 320, mode: 'map', showLiquidus: true }),
	scene('eutectic-arrest', { xCd: 0.35, timeS: 760 }),
	scene('read-the-map', {
		temperatureC: 200,
		mode: 'map',
		showLiquidus: true,
		showSolidus: true,
		showEutectic: true
	}),
	scene('phase-rule', {
		temperatureC: 165,
		mode: 'map',
		showLiquidus: true,
		showSolidus: true,
		showEutectic: true
	}),
	scene('real-anchors', {
		xCd: EUTECTIC_XCD,
		temperatureC: 150,
		mode: 'map',
		showLiquidus: true,
		showSolidus: true,
		showEutectic: true
	}),
	scene('cooling-rate', { timeS: 1100 }),
	scene('sandbox', { xCd: 0.5, timeS: 0 })
];

export function coolingSceneDefinition(id: CoolingCurveSceneId): CoolingSceneDefinition {
	const definition = COOLING_CURVE_SCENES.find((candidate) => candidate.id === id);
	if (!definition) throw new Error(`Unknown cooling-curve scene id: ${id}`);
	return definition;
}
