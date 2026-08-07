import type { CO2InfraredSceneId } from '$lib/content/types';

export interface CO2InfraredSceneDefinition {
	readonly id: CO2InfraredSceneId;
	readonly mode: 'symmetric-stretch' | 'bend' | 'asymmetric-stretch';
	readonly amplitude: number;
	readonly active: boolean;
}

const modeScene = (
	id: CO2InfraredSceneId,
	mode: CO2InfraredSceneDefinition['mode'],
	overrides: Partial<Omit<CO2InfraredSceneDefinition, 'id' | 'mode'>> = {}
): CO2InfraredSceneDefinition => ({ id, mode, amplitude: 0.72, active: false, ...overrides });

export const CO2_INFRARED_SCENES: readonly CO2InfraredSceneDefinition[] = [
	modeScene('hook', 'asymmetric-stretch', { active: true }),
	modeScene('three-motions', 'bend'),
	modeScene('silent-stretch', 'symmetric-stretch', { active: true }),
	modeScene('dipole-rule', 'asymmetric-stretch'),
	modeScene('read-the-spectrum', 'asymmetric-stretch'),
	modeScene('fingerprint-region', 'bend'),
	modeScene('sandbox', 'bend', { active: true })
];

export function co2InfraredSceneDefinition(id: CO2InfraredSceneId): CO2InfraredSceneDefinition {
	const definition = CO2_INFRARED_SCENES.find((candidate) => candidate.id === id);
	if (!definition) throw new Error(`Unknown co2-infrared scene id: ${id}`);
	return definition;
}
