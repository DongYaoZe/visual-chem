/**
 * Solid–liquid equilibria for a simple binary eutectic with pure solids,
 * and the cooling curves a thermal-analysis lab would record over it.
 *
 * The liquidus is the ideal-solution Schröder–van Laar equation,
 * ln x_i = -(ΔH_fus,i/R)·(1/T - 1/T_m,i), analytic in both directions per
 * branch; only the eutectic (branch intersection) needs a bracketed root.
 * Solids are treated as pure components — for Bi–Cd the terminal solid
 * solubility really is negligible, which is why it is the classic teaching
 * system for the 步冷曲线 (cooling-curve) laboratory.
 *
 * Cooling curves come from a Newtonian heat balance: the extracted heat
 * -h·(T - T_ambient) is paid first from sensible heat and, inside a
 * two-phase field, also from the latent heat of the freezing solid — which
 * is what flattens the curve at the liquidus break and holds it flat at the
 * invariant eutectic arrest (F = C - P + 1 = 0). The arrest length grows
 * with the amount of eutectic liquid: the classical Tammann construction.
 */

import { solveBracketedRoot } from './root';

export const GAS_CONSTANT_J_PER_MOL_K = 8.31446261815324;
const CELSIUS_ZERO_K = 273.15;

export interface EutecticComponent {
	/** Melting point of the pure component, °C. */
	meltingPointC: number;
	/** Molar enthalpy of fusion, J/mol. */
	fusionEnthalpyJPerMol: number;
	molarMassGPerMol: number;
}

/** Pure-component constants (provisional pending the source audit). */
export const BISMUTH: EutecticComponent = {
	meltingPointC: 271.4,
	fusionEnthalpyJPerMol: 11300,
	molarMassGPerMol: 208.98
};

export const CADMIUM: EutecticComponent = {
	meltingPointC: 321.07,
	fusionEnthalpyJPerMol: 6210,
	molarMassGPerMol: 112.41
};

const kelvin = (celsius: number): number => celsius + CELSIUS_ZERO_K;

/**
 * Liquidus temperature (K) of a component's branch at its own liquid mole
 * fraction `ownMoleFraction` (Schröder–van Laar, solved for T).
 */
export function branchLiquidusK(component: EutecticComponent, ownMoleFraction: number): number {
	if (!(ownMoleFraction > 0 && ownMoleFraction <= 1)) {
		throw new Error(`${ownMoleFraction} is outside (0, 1]`);
	}
	return (
		1 /
		(1 / kelvin(component.meltingPointC) -
			(GAS_CONSTANT_J_PER_MOL_K / component.fusionEnthalpyJPerMol) * Math.log(ownMoleFraction))
	);
}

/**
 * The component's own liquid mole fraction on its branch at temperature T
 * (Schröder–van Laar, solved for x — the analytic inverse).
 */
export function branchLiquidusMoleFraction(
	component: EutecticComponent,
	temperatureK: number
): number {
	return Math.exp(
		(component.fusionEnthalpyJPerMol / GAS_CONSTANT_J_PER_MOL_K) *
			(1 / kelvin(component.meltingPointC) - 1 / temperatureK)
	);
}

export interface EutecticPoint {
	/** Mole fraction of B (Cd) in the liquid at the eutectic. */
	xB: number;
	temperatureK: number;
	temperatureC: number;
}

/** Compositions are mole fraction of B (Cd); x = 0 is pure A (Bi). */
export function solveEutectic(
	a: EutecticComponent = BISMUTH,
	b: EutecticComponent = CADMIUM
): EutecticPoint {
	const residual = (xB: number) => branchLiquidusK(a, 1 - xB) - branchLiquidusK(b, xB);
	const xB = solveBracketedRoot(residual, 1e-9, 1 - 1e-9, { tolerance: 1e-13 });
	const temperatureK = branchLiquidusK(b, xB);
	return { xB, temperatureK, temperatureC: temperatureK - CELSIUS_ZERO_K };
}

const BI_CD_EUTECTIC = solveEutectic();

export function biCdEutectic(): EutecticPoint {
	return BI_CD_EUTECTIC;
}

/** Liquidus temperature (K) over the whole diagram at mole fraction of Cd. */
export function liquidusK(xB: number, a = BISMUTH, b = CADMIUM): number {
	const eutectic = a === BISMUTH && b === CADMIUM ? BI_CD_EUTECTIC : solveEutectic(a, b);
	if (xB <= 0) return kelvin(a.meltingPointC);
	if (xB >= 1) return kelvin(b.meltingPointC);
	return xB <= eutectic.xB ? branchLiquidusK(a, 1 - xB) : branchLiquidusK(b, xB);
}

export type EutecticRegion =
	'liquid' | 'liquid+A' | 'liquid+B' | 'solid-mixture' | 'eutectic-arrest';

export interface EutecticSplit {
	region: EutecticRegion;
	/** Mole fraction of Cd in the remaining liquid; null when fully solid. */
	liquidXB: number | null;
	/** Phase fractions by mole, summing to 1. */
	liquidFraction: number;
	solidAFraction: number;
	solidBFraction: number;
}

/**
 * Equilibrium phase split of overall composition `xB` at `temperatureK`,
 * lever rule against pure solids. Exactly at the eutectic temperature the
 * split is indeterminate (the arrest); we report the state on arrival.
 */
export function eutecticSplit(xB: number, temperatureK: number): EutecticSplit {
	const eutectic = BI_CD_EUTECTIC;
	if (xB < 0 || xB > 1) throw new Error(`${xB} is outside [0, 1]`);
	if (temperatureK >= liquidusK(xB)) {
		return {
			region: 'liquid',
			liquidXB: xB,
			liquidFraction: 1,
			solidAFraction: 0,
			solidBFraction: 0
		};
	}
	if (temperatureK > eutectic.temperatureK) {
		if (xB <= eutectic.xB) {
			// Pure Bi freezes; the liquid slides down the A branch.
			const liquidXB = 1 - branchLiquidusMoleFraction(BISMUTH, temperatureK);
			const liquidFraction = xB / liquidXB;
			return {
				region: 'liquid+A',
				liquidXB,
				liquidFraction,
				solidAFraction: 1 - liquidFraction,
				solidBFraction: 0
			};
		}
		const liquidXB = branchLiquidusMoleFraction(CADMIUM, temperatureK);
		const liquidFraction = (1 - xB) / (1 - liquidXB);
		return {
			region: 'liquid+B',
			liquidXB,
			liquidFraction,
			solidAFraction: 0,
			solidBFraction: 1 - liquidFraction
		};
	}
	// Below the eutectic everything is solid; the two solids split by mass
	// balance of the overall composition.
	return {
		region: 'solid-mixture',
		liquidXB: null,
		liquidFraction: 0,
		solidAFraction: 1 - xB,
		solidBFraction: xB
	};
}

/** Mole fraction of liquid remaining when the melt reaches the eutectic. */
export function eutecticLiquidFraction(xB: number): number {
	const eutectic = BI_CD_EUTECTIC;
	if (xB <= 0 || xB >= 1) return 0;
	return xB <= eutectic.xB ? xB / eutectic.xB : (1 - xB) / (1 - eutectic.xB);
}

export function massFractionCdToMole(wB: number): number {
	const nB = wB / CADMIUM.molarMassGPerMol;
	const nA = (1 - wB) / BISMUTH.molarMassGPerMol;
	return nB / (nA + nB);
}

export function moleFractionCdToMass(xB: number): number {
	const mB = xB * CADMIUM.molarMassGPerMol;
	const mA = (1 - xB) * BISMUTH.molarMassGPerMol;
	return mB / (mA + mB);
}

export interface CoolingCurveOptions {
	/** Overall composition, mole fraction of Cd. */
	xB: number;
	startC?: number;
	ambientC?: number;
	endC?: number;
	/** Newtonian cooling constant, 1/s. */
	coolingPerS?: number;
	/** Molar heat capacity of every phase, J/(mol·K) — Dulong–Petit scale. */
	heatCapacityJPerMolK?: number;
	timeStepS?: number;
}

export interface CoolingCurvePoint {
	timeS: number;
	temperatureC: number;
}

export interface CoolingCurve {
	points: readonly CoolingCurvePoint[];
	/** Where primary crystallization starts; null at the exact eutectic composition or pure ends below Tm. */
	liquidusBreakC: number | null;
	/** The invariant arrest, when any eutectic liquid remains to freeze. */
	arrest: { temperatureC: number; startS: number; durationS: number } | null;
}

/**
 * Simulate the recorded cooling curve of one melt. Explicit stepping of the
 * heat balance; inside a two-phase field the latent heat term
 * ΔH·(df_s/dT) stretches the time axis, and at the eutectic the temperature
 * is pinned until the remaining liquid has paid its full latent heat.
 */
export function simulateCoolingCurve(options: CoolingCurveOptions): CoolingCurve {
	const {
		xB,
		startC = 340,
		ambientC = 25,
		endC = 60,
		coolingPerS = 0.004,
		heatCapacityJPerMolK = 27,
		timeStepS = 1
	} = options;
	if (xB < 0 || xB > 1) throw new Error(`${xB} is outside [0, 1]`);
	const eutectic = BI_CD_EUTECTIC;
	const liquidusC = liquidusK(xB) - CELSIUS_ZERO_K;
	const pure = xB <= 1e-9 || xB >= 1 - 1e-9;
	const atEutecticComposition = Math.abs(xB - eutectic.xB) < 1e-9;

	// Latent heat of the freezing solid on the active branch, per mole of it.
	const primaryEnthalpy =
		xB <= eutectic.xB ? BISMUTH.fusionEnthalpyJPerMol : CADMIUM.fusionEnthalpyJPerMol;
	// The eutectic liquid freezes both solids at once; weight by its makeup.
	const eutecticEnthalpy =
		(1 - eutectic.xB) * BISMUTH.fusionEnthalpyJPerMol + eutectic.xB * CADMIUM.fusionEnthalpyJPerMol;

	const solidFractionAt = (temperatureK: number): number => {
		if (pure) return 0;
		if (atEutecticComposition) return 0;
		const split = eutecticSplit(xB, temperatureK);
		return split.solidAFraction + split.solidBFraction;
	};

	const points: CoolingCurvePoint[] = [];
	let temperatureC = startC;
	let timeS = 0;
	let arrest: CoolingCurve['arrest'] = null;
	// Latent-heat budget still to pay at the arrest, J per mole of alloy.
	let arrestBudget = eutecticLiquidFraction(pure ? 0 : xB) * eutecticEnthalpy;
	const pureBudget = pure
		? xB < 0.5
			? BISMUTH.fusionEnthalpyJPerMol
			: CADMIUM.fusionEnthalpyJPerMol
		: 0;
	let pureArrestBudget = pureBudget;

	const arrestTemperatureC = pure ? liquidusC : eutectic.temperatureC;
	const guardSteps = 200000;

	for (let step = 0; step < guardSteps && temperatureC > endC; step += 1) {
		points.push({ timeS, temperatureC });
		const extracted = heatCapacityJPerMolK * coolingPerS * (temperatureC - ambientC) * timeStepS;

		const budgetRemaining = pure ? pureArrestBudget : arrestBudget;
		// While an arrest is still owed, a cooling step may not overshoot
		// through the arrest temperature — it lands on it instead.
		const floorC = budgetRemaining > 0 ? arrestTemperatureC : -Infinity;
		const aboveArrest = temperatureC > arrestTemperatureC + 1e-9;
		if (aboveArrest && (pure || temperatureC > liquidusC)) {
			// Single-phase liquid (or pure liquid): plain Newtonian cooling.
			temperatureC = Math.max(floorC, temperatureC - extracted / heatCapacityJPerMolK);
		} else if (!pure && temperatureC > arrestTemperatureC + 1e-9) {
			// Two-phase slope: latent heat of primary crystals resists cooling.
			const deltaT = 0.05;
			const dfs =
				(solidFractionAt(kelvin(temperatureC - deltaT)) - solidFractionAt(kelvin(temperatureC))) /
				deltaT;
			const effectiveCapacity = heatCapacityJPerMolK + primaryEnthalpy * Math.max(0, dfs);
			temperatureC = Math.max(floorC, temperatureC - extracted / effectiveCapacity);
		} else {
			// The invariant arrest: temperature pinned until the budget is paid.
			const budget = pure ? pureArrestBudget : arrestBudget;
			if (budget > 0) {
				if (!arrest) arrest = { temperatureC: arrestTemperatureC, startS: timeS, durationS: 0 };
				arrest = { ...arrest, durationS: arrest.durationS + timeStepS };
				if (pure) pureArrestBudget -= extracted;
				else arrestBudget -= extracted;
				temperatureC = arrestTemperatureC;
			} else {
				temperatureC -= extracted / heatCapacityJPerMolK;
			}
		}
		timeS += timeStepS;
	}
	points.push({ timeS, temperatureC });

	return {
		points,
		liquidusBreakC: pure || atEutecticComposition ? null : liquidusC,
		arrest
	};
}

/** Ideal complete-solid-solution lens (Cu–Ni style), closed form. */
export interface LensComponent {
	meltingPointK: number;
	fusionEnthalpyJPerMol: number;
}

export const COPPER: LensComponent = { meltingPointK: 1357.77, fusionEnthalpyJPerMol: 13260 };
export const NICKEL: LensComponent = { meltingPointK: 1728, fusionEnthalpyJPerMol: 17480 };

/**
 * Liquid and solid compositions (mole fraction of A) coexisting at T.
 * With λ_i = x_i^S/x_i^L = exp[(ΔH_i/R)(1/T − 1/T_m,i)], mass balance gives
 * x_A^L = (λ_B − 1)/(λ_B − λ_A) and x_A^S = λ_A·x_A^L — the liquid is richer
 * in the lower-melting component. (The old Streamlit prototype had these two
 * labels swapped in its tie-line readout.)
 */
export function lensCompositions(
	temperatureK: number,
	a: LensComponent = COPPER,
	b: LensComponent = NICKEL
): { liquidXA: number; solidXA: number } {
	const lambdaA = Math.exp(
		(a.fusionEnthalpyJPerMol / GAS_CONSTANT_J_PER_MOL_K) * (1 / temperatureK - 1 / a.meltingPointK)
	);
	const lambdaB = Math.exp(
		(b.fusionEnthalpyJPerMol / GAS_CONSTANT_J_PER_MOL_K) * (1 / temperatureK - 1 / b.meltingPointK)
	);
	const liquidXA = (lambdaB - 1) / (lambdaB - lambdaA);
	return { liquidXA, solidXA: lambdaA * liquidXA };
}
