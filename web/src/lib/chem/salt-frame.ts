/**
 * One resolved thermodynamic frame per salt-pot state.
 *
 * The story resolves a frame once per reader state and hands the same object
 * to every view (pot, ions, ternary map, status strip), so the views never
 * recompute or disagree. Memoized with identity-stable objects for Svelte 5
 * fine-grained reactivity, like thermoFrame (ethanol) and waterFrame (water).
 */

import {
	kno3SolubilityGPer100g,
	massesToComposition,
	nano3SolubilityGPer100g,
	saltIsotherm,
	solveSaltEquilibrium,
	type SaltEquilibrium,
	type SaltIsotherm,
	type SaltPotState,
	type SaltRegion,
	type TernaryComposition
} from './salt-pond';

export interface SaltFrameInput extends SaltPotState {
	interactionScale?: number;
}

export interface SaltFrame extends SaltPotState {
	interactionScale: number;
	equilibrium: SaltEquilibrium;
	region: SaltRegion;
	/** Total composition of the whole pot (crystals included); null for an empty pot. */
	composition: TernaryComposition | null;
	/** Composition of the liquid phase alone; null when the pot is dry. */
	liquidComposition: TernaryComposition | null;
	isotherm: SaltIsotherm;
	/** Pure-salt solubilities at this temperature, g per 100 g water. */
	kno3SolubilityGPer100g: number;
	nano3SolubilityGPer100g: number;
}

const ISOTHERM_CACHE_CAPACITY = 16;
const isothermCache = new Map<string, SaltIsotherm>();

/** Identity-stable isotherm per (temperature, interaction) pair, shared across pots. */
function memoizedIsotherm(temperatureC: number, interactionScale: number): SaltIsotherm {
	const key = `${temperatureC}|${interactionScale}`;
	const hit = isothermCache.get(key);
	if (hit) {
		isothermCache.delete(key);
		isothermCache.set(key, hit);
		return hit;
	}
	const isotherm = saltIsotherm(temperatureC, interactionScale);
	isothermCache.set(key, isotherm);
	if (isothermCache.size > ISOTHERM_CACHE_CAPACITY) {
		const oldest = isothermCache.keys().next().value;
		if (oldest !== undefined) isothermCache.delete(oldest);
	}
	return isotherm;
}

const FRAME_CACHE_CAPACITY = 64;
const frameCache = new Map<string, SaltFrame>();

export function saltFrame(input: SaltFrameInput): SaltFrame {
	const interactionScale = input.interactionScale ?? 1;
	const key = `${input.temperatureC}|${input.waterG}|${input.kno3G}|${input.nano3G}|${interactionScale}`;
	const hit = frameCache.get(key);
	if (hit) {
		frameCache.delete(key);
		frameCache.set(key, hit);
		return hit;
	}

	const state: SaltPotState = {
		temperatureC: input.temperatureC,
		waterG: input.waterG,
		kno3G: input.kno3G,
		nano3G: input.nano3G
	};
	const equilibrium = solveSaltEquilibrium(state, interactionScale);
	const totalMass = state.waterG + state.kno3G + state.nano3G;
	const liquidMass =
		equilibrium.liquid.waterG + equilibrium.liquid.kno3G + equilibrium.liquid.nano3G;
	const frame: SaltFrame = {
		...state,
		interactionScale,
		equilibrium,
		region: equilibrium.region,
		composition: totalMass > 0 ? massesToComposition(state) : null,
		liquidComposition: liquidMass > 0 ? massesToComposition(equilibrium.liquid) : null,
		isotherm: memoizedIsotherm(state.temperatureC, interactionScale),
		kno3SolubilityGPer100g: kno3SolubilityGPer100g(state.temperatureC),
		nano3SolubilityGPer100g: nano3SolubilityGPer100g(state.temperatureC)
	};

	frameCache.set(key, frame);
	if (frameCache.size > FRAME_CACHE_CAPACITY) {
		const oldest = frameCache.keys().next().value;
		if (oldest !== undefined) frameCache.delete(oldest);
	}
	return frame;
}
