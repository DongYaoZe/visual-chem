/** Stage directions for season 4: one discharge tube, one energy ladder and
 * one spectrum, all resolved from the same hydrogen transition. */

import type { HydrogenSpectrumSceneId } from '$lib/content/types';

export interface HydrogenSpectrumSceneDefinition {
	readonly id: HydrogenSpectrumSceneId;
	readonly upperN: number;
	readonly lowerN: number;
	readonly showSeriesSet: boolean;
	readonly active: boolean;
}

const spectrumScene = (
	id: HydrogenSpectrumSceneId,
	overrides: Partial<Omit<HydrogenSpectrumSceneDefinition, 'id'>> = {}
): HydrogenSpectrumSceneDefinition => ({
	id,
	upperN: 3,
	lowerN: 2,
	showSeriesSet: true,
	active: false,
	...overrides
});

export const HYDROGEN_SPECTRUM_SCENES: readonly HydrogenSpectrumSceneDefinition[] = [
	spectrumScene('hook', { active: true }),
	spectrumScene('split-the-light'),
	spectrumScene('measure-the-lines', { upperN: 4 }),
	spectrumScene('energy-steps', { upperN: 5, showSeriesSet: false, active: true }),
	spectrumScene('rydberg-key', { upperN: 6 }),
	spectrumScene('three-families', { upperN: 2, lowerN: 1 }),
	spectrumScene('fingerprint', { upperN: 6 }),
	spectrumScene('sandbox', { upperN: 4, showSeriesSet: false, active: true })
];

export function hydrogenSpectrumSceneDefinition(
	id: HydrogenSpectrumSceneId
): HydrogenSpectrumSceneDefinition {
	const definition = HYDROGEN_SPECTRUM_SCENES.find((candidate) => candidate.id === id);
	if (!definition) throw new Error(`Unknown hydrogen-spectrum scene id: ${id}`);
	return definition;
}
