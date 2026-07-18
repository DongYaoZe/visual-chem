/**
 * One resolved frame per (composition, temperature) state of the Bi–Cd melt,
 * plus the memoized cooling curve of that composition. Same identity-stable
 * LRU pattern as thermoFrame/waterFrame/saltFrame.
 */

import {
	biCdEutectic,
	eutecticLiquidFraction,
	eutecticSplit,
	liquidusK,
	moleFractionCdToMass,
	simulateCoolingCurve,
	type CoolingCurve,
	type EutecticPoint,
	type EutecticSplit
} from './eutectic';

const CELSIUS_ZERO_K = 273.15;

export interface EutecticFrameInput {
	/** Overall composition, mole fraction of Cd. */
	xCd: number;
	temperatureC: number;
}

export interface EutecticFrame extends EutecticFrameInput {
	split: EutecticSplit;
	region: EutecticSplit['region'];
	/** Liquidus of this composition, °C. */
	liquidusC: number;
	eutectic: EutecticPoint;
	massFractionCd: number;
	/** Fraction of melt that will still be liquid on eutectic arrival. */
	eutecticLiquidFraction: number;
	/** The recorded cooling curve of this composition (default lab settings). */
	curve: CoolingCurve;
}

const CURVE_CACHE_CAPACITY = 24;
const curveCache = new Map<string, CoolingCurve>();

/** Identity-stable cooling curve per composition, shared across frames. */
export function memoizedCoolingCurve(xCd: number): CoolingCurve {
	const key = `${xCd}`;
	const hit = curveCache.get(key);
	if (hit) {
		curveCache.delete(key);
		curveCache.set(key, hit);
		return hit;
	}
	const curve = simulateCoolingCurve({ xB: xCd });
	curveCache.set(key, curve);
	if (curveCache.size > CURVE_CACHE_CAPACITY) {
		const oldest = curveCache.keys().next().value;
		if (oldest !== undefined) curveCache.delete(oldest);
	}
	return curve;
}

/** Temperature on a recorded curve at a given time, °C (linear between samples). */
export function temperatureAtTime(curve: CoolingCurve, timeS: number): number {
	const points = curve.points;
	if (timeS <= points[0].timeS) return points[0].temperatureC;
	const last = points[points.length - 1];
	if (timeS >= last.timeS) return last.temperatureC;
	let low = 0;
	let high = points.length - 1;
	while (low + 1 < high) {
		const middle = (low + high) >> 1;
		if (points[middle].timeS <= timeS) low = middle;
		else high = middle;
	}
	const a = points[low];
	const b = points[high];
	const t = (timeS - a.timeS) / (b.timeS - a.timeS);
	return a.temperatureC + t * (b.temperatureC - a.temperatureC);
}

const FRAME_CACHE_CAPACITY = 64;
const frameCache = new Map<string, EutecticFrame>();

export function eutecticFrame(input: EutecticFrameInput): EutecticFrame {
	const key = `${input.xCd}|${input.temperatureC}`;
	const hit = frameCache.get(key);
	if (hit) {
		frameCache.delete(key);
		frameCache.set(key, hit);
		return hit;
	}

	const split = eutecticSplit(input.xCd, input.temperatureC + CELSIUS_ZERO_K);
	const frame: EutecticFrame = {
		xCd: input.xCd,
		temperatureC: input.temperatureC,
		split,
		region: split.region,
		liquidusC: liquidusK(input.xCd) - CELSIUS_ZERO_K,
		eutectic: biCdEutectic(),
		massFractionCd: moleFractionCdToMass(input.xCd),
		eutecticLiquidFraction: eutecticLiquidFraction(input.xCd),
		curve: memoizedCoolingCurve(input.xCd)
	};

	frameCache.set(key, frame);
	if (frameCache.size > FRAME_CACHE_CAPACITY) {
		const oldest = frameCache.keys().next().value;
		if (oldest !== undefined) frameCache.delete(oldest);
	}
	return frame;
}
