import { findInteriorRoots, solveBracketedRoot } from './root';
import type {
	AntoineConstants,
	AzeotropePoint,
	BinarySystem,
	DistillationStage,
	EquilibriumPoint,
	FlashState,
	Margules3Parameters
} from './types';

const MMHG_PER_BAR = 750.061683;
const EPSILON = 1e-8;

export const ATM_BAR = 1.01325;

export const ETHANOL_WATER: BinarySystem = {
	id: 'ethanol-water',
	componentA: {
		id: 'ethanol',
		name: '乙醇',
		formula: 'C₂H₅OH',
		molarMass: 46.06844,
		antoine: { a: 8.20417, b: 1642.89, c: 230.3, validRangeC: [0, 78.3] }
	},
	componentB: {
		id: 'water',
		name: '水',
		formula: 'H₂O',
		molarMass: 18.01528,
		antoine: { a: 8.07131, b: 1730.63, c: 233.426, validRangeC: [1, 100] }
	},
	// Three-suffix Margules parameters calibrated to the 1 atm azeotrope
	// (x_ethanol = 0.895, T = 78.15 C). This is an educational local model,
	// not a replacement for temperature-dependent NRTL or experimental tables.
	interaction: { a12: 1.39081729, a21: 0.95455763 },
	referencePressureBar: ATM_BAR
};

export function clampComposition(value: number): number {
	return Math.min(1, Math.max(0, value));
}

export function antoinePressureBar(temperatureC: number, constants: AntoineConstants): number {
	return 10 ** (constants.a - constants.b / (temperatureC + constants.c)) / MMHG_PER_BAR;
}

export function antoineTemperatureC(pressureBar: number, constants: AntoineConstants): number {
	if (pressureBar <= 0) throw new Error('Pressure must be positive.');
	return constants.b / (constants.a - Math.log10(pressureBar * MMHG_PER_BAR)) - constants.c;
}

export function margules3ActivityCoefficients(
	xA: number,
	parameters: Margules3Parameters = ETHANOL_WATER.interaction,
	interactionScale = 1
): readonly [number, number] {
	const x = clampComposition(xA);
	const xB = 1 - x;
	const a12 = parameters.a12 * interactionScale;
	const a21 = parameters.a21 * interactionScale;
	const lnGammaA = xB ** 2 * (a12 + 2 * (a21 - a12) * x);
	const lnGammaB = x ** 2 * (a21 + 2 * (a12 - a21) * xB);
	return [Math.exp(lnGammaA), Math.exp(lnGammaB)];
}

export function vaporCompositionAt(
	xA: number,
	temperatureC: number,
	pressureBar = ATM_BAR,
	system = ETHANOL_WATER,
	interactionScale = 1
): number {
	const x = clampComposition(xA);
	const [gammaA] = margules3ActivityCoefficients(x, system.interaction, interactionScale);
	return clampComposition(
		(x * gammaA * antoinePressureBar(temperatureC, system.componentA.antoine)) / pressureBar
	);
}

export function totalPressureAt(
	xA: number,
	temperatureC: number,
	system = ETHANOL_WATER,
	interactionScale = 1
): number {
	const x = clampComposition(xA);
	const [gammaA, gammaB] = margules3ActivityCoefficients(x, system.interaction, interactionScale);
	return (
		x * gammaA * antoinePressureBar(temperatureC, system.componentA.antoine) +
		(1 - x) * gammaB * antoinePressureBar(temperatureC, system.componentB.antoine)
	);
}

export function bubblePointAt(
	xA: number,
	pressureBar = ATM_BAR,
	system = ETHANOL_WATER,
	interactionScale = 1
): EquilibriumPoint {
	const x = clampComposition(xA);
	if (x <= EPSILON) {
		const temperatureC = antoineTemperatureC(pressureBar, system.componentB.antoine);
		return { x: 0, y: 0, temperatureC, pressureBar };
	}
	if (x >= 1 - EPSILON) {
		const temperatureC = antoineTemperatureC(pressureBar, system.componentA.antoine);
		return { x: 1, y: 1, temperatureC, pressureBar };
	}

	const residual = (temperatureC: number) =>
		totalPressureAt(x, temperatureC, system, interactionScale) - pressureBar;
	const pureA = antoineTemperatureC(pressureBar, system.componentA.antoine);
	const pureB = antoineTemperatureC(pressureBar, system.componentB.antoine);
	const temperatureC = solveBracketedRoot(
		residual,
		Math.min(pureA, pureB) - 35,
		Math.max(pureA, pureB) + 20
	);
	return {
		x,
		y: vaporCompositionAt(x, temperatureC, pressureBar, system, interactionScale),
		temperatureC,
		pressureBar
	};
}

export function dewPointAt(
	yA: number,
	pressureBar = ATM_BAR,
	system = ETHANOL_WATER,
	interactionScale = 1
): EquilibriumPoint {
	const y = clampComposition(yA);
	if (y <= EPSILON) return bubblePointAt(0, pressureBar, system, interactionScale);
	if (y >= 1 - EPSILON) return bubblePointAt(1, pressureBar, system, interactionScale);
	const liquidComposition = solveBracketedRoot(
		(x) => bubblePointAt(x, pressureBar, system, interactionScale).y - y,
		0,
		1,
		{ tolerance: 1e-8 }
	);
	return bubblePointAt(liquidComposition, pressureBar, system, interactionScale);
}

export function equilibriaAtTemperature(
	temperatureC: number,
	pressureBar = ATM_BAR,
	system = ETHANOL_WATER,
	interactionScale = 1
): EquilibriumPoint[] {
	const residual = (x: number) =>
		totalPressureAt(x, temperatureC, system, interactionScale) - pressureBar;
	const compositions = findInteriorRoots(residual, 1e-7, 1 - 1e-7, 500);
	if (Math.abs(residual(0)) < 1e-7) compositions.unshift(0);
	if (Math.abs(residual(1)) < 1e-7) compositions.push(1);
	return compositions.map((x) => ({
		x,
		y: vaporCompositionAt(x, temperatureC, pressureBar, system, interactionScale),
		temperatureC,
		pressureBar
	}));
}

export function buildTxyCurve(
	pressureBar = ATM_BAR,
	samples = 101,
	system = ETHANOL_WATER,
	interactionScale = 1
): EquilibriumPoint[] {
	return Array.from({ length: samples }, (_, index) =>
		bubblePointAt(index / (samples - 1), pressureBar, system, interactionScale)
	);
}

export function findAzeotrope(
	pressureBar = ATM_BAR,
	system = ETHANOL_WATER,
	interactionScale = 1
): AzeotropePoint | null {
	const residual = (x: number) => {
		const point = bubblePointAt(x, pressureBar, system, interactionScale);
		return point.y - point.x;
	};
	const roots = findInteriorRoots(residual, 1e-4, 1 - 1e-4, 160);
	if (roots.length === 0) return null;
	const point = bubblePointAt(roots[0], pressureBar, system, interactionScale);
	return {
		...point,
		massFractionA: moleToMassFraction(
			point.x,
			system.componentA.molarMass,
			system.componentB.molarMass
		)
	};
}

export function moleToMassFraction(xA: number, molarMassA: number, molarMassB: number): number {
	const x = clampComposition(xA);
	const massA = x * molarMassA;
	return massA / (massA + (1 - x) * molarMassB);
}

export function flashAt(
	overallComposition: number,
	temperatureC: number,
	pressureBar = ATM_BAR,
	system = ETHANOL_WATER
): FlashState {
	const z = clampComposition(overallComposition);
	const bubbleAtZ = bubblePointAt(z, pressureBar, system);
	const dewAtZ = dewPointAt(z, pressureBar, system);
	const lowerBoundary = Math.min(bubbleAtZ.temperatureC, dewAtZ.temperatureC);
	const upperBoundary = Math.max(bubbleAtZ.temperatureC, dewAtZ.temperatureC);
	const azeotrope = findAzeotrope(pressureBar, system);

	if (azeotrope && Math.abs(z - azeotrope.x) < 5e-4) {
		return {
			region: 'azeotrope',
			overallComposition: z,
			liquidComposition: z,
			vaporComposition: z,
			liquidFraction: temperatureC <= azeotrope.temperatureC ? 1 : 0,
			vaporFraction: temperatureC > azeotrope.temperatureC ? 1 : 0,
			bubbleTemperatureC: azeotrope.temperatureC,
			dewTemperatureC: azeotrope.temperatureC
		};
	}

	if (temperatureC <= lowerBoundary) {
		return {
			region: 'liquid',
			overallComposition: z,
			liquidComposition: z,
			vaporComposition: z,
			liquidFraction: 1,
			vaporFraction: 0,
			bubbleTemperatureC: bubbleAtZ.temperatureC,
			dewTemperatureC: dewAtZ.temperatureC
		};
	}
	if (temperatureC >= upperBoundary) {
		return {
			region: 'vapor',
			overallComposition: z,
			liquidComposition: z,
			vaporComposition: z,
			liquidFraction: 0,
			vaporFraction: 1,
			bubbleTemperatureC: bubbleAtZ.temperatureC,
			dewTemperatureC: dewAtZ.temperatureC
		};
	}

	const tiePoints = equilibriaAtTemperature(temperatureC, pressureBar, system);
	const tiePoint = tiePoints.find(
		(point) => z >= Math.min(point.x, point.y) - 1e-7 && z <= Math.max(point.x, point.y) + 1e-7
	);
	if (!tiePoint) {
		throw new Error('No equilibrium tie line contains the requested overall composition.');
	}
	const denominator = tiePoint.y - tiePoint.x;
	const vaporFraction =
		Math.abs(denominator) < EPSILON ? 0.5 : clampComposition((z - tiePoint.x) / denominator);
	return {
		region: 'two-phase',
		overallComposition: z,
		liquidComposition: tiePoint.x,
		vaporComposition: tiePoint.y,
		liquidFraction: 1 - vaporFraction,
		vaporFraction,
		bubbleTemperatureC: bubbleAtZ.temperatureC,
		dewTemperatureC: dewAtZ.temperatureC
	};
}

export function simpleDistillationStages(
	initialLiquidComposition: number,
	stages = 8,
	pressureBar = ATM_BAR,
	system = ETHANOL_WATER,
	interactionScale = 1
): DistillationStage[] {
	const result: DistillationStage[] = [];
	let liquidComposition = clampComposition(initialLiquidComposition);
	for (let stage = 0; stage <= stages; stage += 1) {
		const point = bubblePointAt(liquidComposition, pressureBar, system, interactionScale);
		result.push({
			...point,
			stage,
			liquidMassFractionA: moleToMassFraction(
				point.x,
				system.componentA.molarMass,
				system.componentB.molarMass
			),
			vaporMassFractionA: moleToMassFraction(
				point.y,
				system.componentA.molarMass,
				system.componentB.molarMass
			)
		});
		liquidComposition = point.y;
	}
	return result;
}
