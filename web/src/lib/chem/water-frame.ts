import {
	WATER_CRITICAL_POINT,
	celsiusToKelvin,
	classifyWaterPhase,
	kelvinToCelsius,
	saturationPressurePa,
	saturationTemperatureK,
	vaporizationEnthalpyKJPerMol,
	type WaterPhase
} from './water-pt';

export interface WaterFrameInput {
	temperatureC: number;
	pressurePa: number;
}

/**
 * One (T, p) state of water, resolved once and narrated everywhere.
 * The stovetop, the molecular race, and the p–T map all read from the
 * same frame, so the story can never show a pot boiling at a state the
 * diagram places inside the liquid region.
 */
export interface WaterFrame {
	temperatureC: number;
	temperatureK: number;
	pressurePa: number;
	phase: WaterPhase;
	/** Boiling temperature at this pressure; null outside the saturation span. */
	boilingPointC: number | null;
	/** Saturation pressure at this temperature; null off the saturation line's span. */
	saturationPressurePa: number | null;
	/** Liquid at (or past) its boiling point — the pot is rolling. */
	boiling: boolean;
	/** Clausius–Clapeyron slope readout at this temperature, where defined. */
	vaporizationEnthalpyKJPerMol: number | null;
}

const FRAME_CACHE_CAPACITY = 64;
const frameCache = new Map<string, WaterFrame>();

export function waterFrame({ temperatureC, pressurePa }: WaterFrameInput): WaterFrame {
	const key = `${temperatureC}|${pressurePa}`;
	const cached = frameCache.get(key);
	if (cached) {
		frameCache.delete(key);
		frameCache.set(key, cached);
		return cached;
	}

	const temperatureK = celsiusToKelvin(temperatureC);
	const onSaturationSpan =
		temperatureK >= 273.15 && temperatureK <= WATER_CRITICAL_POINT.temperatureK;
	const saturation = onSaturationSpan ? saturationPressurePa(temperatureK) : null;
	const boilingPointC =
		pressurePa >= 611.213 && pressurePa <= WATER_CRITICAL_POINT.pressurePa
			? kelvinToCelsius(saturationTemperatureK(pressurePa))
			: null;
	const phase = classifyWaterPhase(temperatureK, pressurePa);
	const frame: WaterFrame = {
		temperatureC,
		temperatureK,
		pressurePa,
		phase,
		boilingPointC,
		saturationPressurePa: saturation,
		boiling:
			boilingPointC !== null &&
			phase !== 'solid' &&
			phase !== 'supercritical' &&
			temperatureC >= boilingPointC - 0.25,
		vaporizationEnthalpyKJPerMol: onSaturationSpan
			? vaporizationEnthalpyKJPerMol(temperatureK)
			: null
	};

	frameCache.set(key, frame);
	if (frameCache.size > FRAME_CACHE_CAPACITY) {
		frameCache.delete(frameCache.keys().next().value as string);
	}
	return frame;
}
