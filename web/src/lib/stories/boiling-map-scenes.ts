import {
	boilingPointAtAltitudeC,
	pressureAtAltitudePa,
	saturationPressurePa,
	saturationTemperatureK,
	celsiusToKelvin,
	kelvinToCelsius,
	WATER_TRIPLE_POINT
} from '$lib/chem';
import type { BoilingMapSceneId } from '$lib/content';

/**
 * Stage directions for the boiling-map story, keyed by scene id.
 *
 * Narrative content (zh-CN, en) and these definitions must list the same
 * scenes in the same order; the parity spec fails the build otherwise.
 */
export interface BoilingSceneDefinition {
	id: BoilingMapSceneId;
	/** Default state point the stage shows while this scene is active. */
	temperatureC: number;
	pressurePa: number;
	focus: 'macro' | 'micro' | 'symbol' | 'all';
	/** Fraction of the boiling curve drawn. */
	reveal: number;
	/** Show the solid-phase boundaries and triple point. */
	showSolid: boolean;
	showCritical: boolean;
	/** Plot ln p against 1/T instead of p against T. */
	linearized: boolean;
	/** Draw the horizontal external-pressure line through the state point. */
	showPressureLine: boolean;
	showLandmarks: boolean;
	showFreezeDryPath: boolean;
}

const LHASA_ALTITUDE_M = 3650;

export const BOILING_MAP_SCENES: readonly BoilingSceneDefinition[] = [
	{
		id: 'hook',
		temperatureC: boilingPointAtAltitudeC(LHASA_ALTITUDE_M),
		pressurePa: pressureAtAltitudePa(LHASA_ALTITUDE_M),
		focus: 'macro',
		reveal: 0.25,
		showSolid: false,
		showCritical: false,
		linearized: false,
		showPressureLine: false,
		showLandmarks: false,
		showFreezeDryPath: false
	},
	{
		id: 'invisible-race',
		temperatureC: 25,
		pressurePa: saturationPressurePa(celsiusToKelvin(25)),
		focus: 'micro',
		reveal: 0.15,
		showSolid: false,
		showCritical: false,
		linearized: false,
		showPressureLine: false,
		showLandmarks: false,
		showFreezeDryPath: false
	},
	{
		id: 'draw-the-curve',
		temperatureC: 75,
		pressurePa: saturationPressurePa(celsiusToKelvin(75)),
		focus: 'symbol',
		reveal: 1,
		showSolid: false,
		showCritical: false,
		linearized: false,
		showPressureLine: false,
		showLandmarks: false,
		showFreezeDryPath: false
	},
	{
		id: 'boiling-defined',
		temperatureC: 100,
		pressurePa: 101325,
		focus: 'all',
		reveal: 1,
		showSolid: false,
		showCritical: false,
		linearized: false,
		showPressureLine: true,
		showLandmarks: false,
		showFreezeDryPath: false
	},
	{
		id: 'straighten-the-curve',
		temperatureC: 100,
		pressurePa: 101325,
		focus: 'symbol',
		reveal: 1,
		showSolid: false,
		showCritical: false,
		linearized: true,
		showPressureLine: false,
		showLandmarks: false,
		showFreezeDryPath: false
	},
	{
		id: 'complete-the-map',
		temperatureC: kelvinToCelsius(WATER_TRIPLE_POINT.temperatureK),
		pressurePa: WATER_TRIPLE_POINT.pressurePa,
		focus: 'symbol',
		reveal: 1,
		showSolid: true,
		showCritical: true,
		linearized: false,
		showPressureLine: false,
		showLandmarks: false,
		showFreezeDryPath: false
	},
	{
		id: 'altitude-travel',
		temperatureC: boilingPointAtAltitudeC(LHASA_ALTITUDE_M),
		pressurePa: pressureAtAltitudePa(LHASA_ALTITUDE_M),
		focus: 'all',
		reveal: 1,
		showSolid: false,
		showCritical: false,
		linearized: false,
		showPressureLine: true,
		showLandmarks: true,
		showFreezeDryPath: false
	},
	{
		id: 'freeze-dry-detour',
		temperatureC: 20,
		pressurePa: 101325,
		focus: 'all',
		reveal: 1,
		showSolid: true,
		showCritical: false,
		linearized: false,
		showPressureLine: false,
		showLandmarks: false,
		showFreezeDryPath: true
	},
	{
		id: 'pressure-cooker',
		temperatureC: kelvinToCelsius(saturationTemperatureK(202650)),
		pressurePa: 202650,
		focus: 'macro',
		reveal: 1,
		showSolid: false,
		showCritical: false,
		linearized: false,
		showPressureLine: true,
		showLandmarks: false,
		showFreezeDryPath: false
	}
];

const SCENE_INDEX = new Map(BOILING_MAP_SCENES.map((scene) => [scene.id, scene]));

export function boilingSceneDefinition(id: BoilingMapSceneId): BoilingSceneDefinition {
	const definition = SCENE_INDEX.get(id);
	if (!definition) throw new Error(`Unknown boiling-map scene: ${id}`);
	return definition;
}

/** Altitude stops the travel slider snaps to; labels live in the content layer. */
export const ALTITUDE_LANDMARKS = [
	{ id: 'sea-level', altitudeM: 0 },
	{ id: 'denver', altitudeM: 1609 },
	{ id: 'lhasa', altitudeM: LHASA_ALTITUDE_M },
	{ id: 'everest', altitudeM: 8849 }
] as const;

export type AltitudeLandmarkId = (typeof ALTITUDE_LANDMARKS)[number]['id'];

/**
 * The freeze-drying detour: freeze at ambient pressure, evacuate the chamber,
 * then let heat drive ice straight across the sublimation line. At 30 Pa the
 * chamber sits below the sublimation pressure of −30 °C ice (≈38 Pa), so the
 * final leg crosses the boundary instead of the melting line.
 */
export const FREEZE_DRY_WAYPOINTS = [
	{ temperatureC: 20, pressurePa: 101325 },
	{ temperatureC: -30, pressurePa: 101325 },
	{ temperatureC: -30, pressurePa: 30 },
	{ temperatureC: 30, pressurePa: 30 }
] as const;

export interface FreezeDryState {
	temperatureC: number;
	pressurePa: number;
	/** Which leg of the programme is running: 0 freeze, 1 evacuate, 2 sublimate. */
	stageIndex: 0 | 1 | 2;
}

/** Interpolate the freeze-dry programme; pressure moves in log space. */
export function freezeDryState(progress: number): FreezeDryState {
	const clamped = Math.min(1, Math.max(0, progress));
	const legs = FREEZE_DRY_WAYPOINTS.length - 1;
	const position = clamped * legs;
	const stageIndex = Math.min(legs - 1, Math.floor(position)) as FreezeDryState['stageIndex'];
	const t = position - stageIndex;
	const from = FREEZE_DRY_WAYPOINTS[stageIndex];
	const to = FREEZE_DRY_WAYPOINTS[stageIndex + 1];
	return {
		temperatureC: from.temperatureC + (to.temperatureC - from.temperatureC) * t,
		pressurePa: Math.exp(
			Math.log(from.pressurePa) + (Math.log(to.pressurePa) - Math.log(from.pressurePa)) * t
		),
		stageIndex
	};
}
