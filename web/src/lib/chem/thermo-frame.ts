import { ETHANOL_WATER_LAI_2014 } from './data/ethanol-water-lai-2014';
import {
	ATM_BAR,
	ETHANOL_WATER,
	buildTxyCurve,
	findAzeotrope,
	simpleDistillationStages
} from './ethanol-water';
import type { AzeotropePoint, DistillationStage, EquilibriumPoint } from './types';

export interface ThermoFrameInput {
	composition: number;
	stage?: number;
	pressureBar?: number;
	interactionScale?: number;
}

export interface TemperatureExtent {
	minC: number;
	maxC: number;
}

/**
 * One thermodynamic state, computed once and narrated everywhere.
 *
 * Every panel that talks about "the current point" — the tri-view header,
 * the apparatus, the particle chamber, the Txy diagram, the mobile status
 * strip — must read from the same frame, so the numbers a reader compares
 * across panels can never drift apart.
 */
export interface ThermoFrame {
	composition: number;
	stage: number;
	pressureBar: number;
	interactionScale: number;
	/** Txy envelope at this pressure and model strength. */
	curve: EquilibriumPoint[];
	/** Equilibrium ladder; entry 0 is the initial charge. */
	stages: DistillationStage[];
	/** The state after the last equilibrium stage — the point being narrated. */
	current: DistillationStage;
	/** Model azeotrope, or null when this model strength has no interior fixed point. */
	azeotrope: AzeotropePoint | null;
	/**
	 * Temperature span of every reference the diagram may draw at this
	 * pressure: the ideal and calibrated envelopes plus the Lai (2014)
	 * measurements. Axes scaled to this extent hold still while the model
	 * slider moves, so the curves morph instead of the map.
	 */
	temperatureExtent: TemperatureExtent;
}

const CURVE_SAMPLES = 101;
const FRAME_CACHE_CAPACITY = 32;

const frameCache = new Map<string, ThermoFrame>();
const extentCache = new Map<number, TemperatureExtent>();

function temperatureExtentAt(pressureBar: number): TemperatureExtent {
	const cached = extentCache.get(pressureBar);
	if (cached) return cached;
	const referenceTemperatures = [
		...buildTxyCurve(pressureBar, CURVE_SAMPLES, ETHANOL_WATER, 0),
		...buildTxyCurve(pressureBar, CURVE_SAMPLES, ETHANOL_WATER, 1),
		...ETHANOL_WATER_LAI_2014.points
	].map((point) => point.temperatureC);
	const extent = {
		minC: Math.min(...referenceTemperatures),
		maxC: Math.max(...referenceTemperatures)
	};
	extentCache.set(pressureBar, extent);
	return extent;
}

/**
 * Resolve the full thermodynamic state for one set of inputs.
 *
 * Memoized on the input tuple: a story shell and the tri-view it renders can
 * both ask for the frame and share one computation, and the returned object
 * keeps its identity across repeated calls so fine-grained reactivity does
 * not cascade when nothing changed.
 */
export function thermoFrame({
	composition,
	stage = 0,
	pressureBar = ATM_BAR,
	interactionScale = 1
}: ThermoFrameInput): ThermoFrame {
	const key = `${composition}|${stage}|${pressureBar}|${interactionScale}`;
	const cached = frameCache.get(key);
	if (cached) {
		// Refresh recency so slider scrubbing evicts stale frames, not live ones.
		frameCache.delete(key);
		frameCache.set(key, cached);
		return cached;
	}

	const stages = simpleDistillationStages(
		composition,
		stage,
		pressureBar,
		ETHANOL_WATER,
		interactionScale
	);
	const frame: ThermoFrame = {
		composition,
		stage,
		pressureBar,
		interactionScale,
		curve: buildTxyCurve(pressureBar, CURVE_SAMPLES, ETHANOL_WATER, interactionScale),
		stages,
		current: stages[stages.length - 1],
		azeotrope: findAzeotrope(pressureBar, ETHANOL_WATER, interactionScale),
		temperatureExtent: temperatureExtentAt(pressureBar)
	};

	frameCache.set(key, frame);
	if (frameCache.size > FRAME_CACHE_CAPACITY) {
		frameCache.delete(frameCache.keys().next().value as string);
	}
	return frame;
}
