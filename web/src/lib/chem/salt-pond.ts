/**
 * Solid–liquid equilibria for the ternary system H2O–KNO3–NaNO3.
 *
 * Teaching model, stated honestly:
 *  - Each pure-salt solubility table (0–100 °C) is interpolated in van 't Hoff
 *    coordinates (ln Ksp against 1/T) with a monotone cubic, so the computed
 *    binary curves reproduce every tabulated anchor exactly.
 *  - Dissolution is treated as fully ionic with a shared nitrate ion:
 *    Ksp(KNO3) = m(K+)·m(NO3-), Ksp(NaNO3) = m(Na+)·m(NO3-) in molality units,
 *    which is the ideal common-ion model (activity coefficients = 1).
 *  - The calibrated model multiplies each Ksp by an empirical salting term
 *    (1 + β·m_other) whose two β values are solved directly from one measured
 *    doubly-saturated (eutonic) composition at 25 °C. `interactionScale`
 *    interpolates between ideal (0) and calibrated (1), mirroring the
 *    ideal-vs-calibrated device of the ethanol–water story.
 *
 * Neither salt forms a hydrate or a double salt in this range, which is what
 * makes H2O–KNO3–NaNO3 the clean textbook ternary. All closed-form: saturation
 * branches are quadratics; only the eutonic needs a bracketed 1-D root.
 */

import {
	CALIBRATION_EUTONICS,
	KNO3_SOLUBILITY_TABLE,
	NANO3_SOLUBILITY_TABLE
} from './data/salt-solubility';
import { monotoneCubic, type MonotoneCubic } from './monotone-cubic';
import { solveBracketedRoot } from './root';

export const KNO3_MOLAR_MASS_G_PER_MOL = 101.103;
export const NANO3_MOLAR_MASS_G_PER_MOL = 84.995;

export const SALT_TEMPERATURE_MIN_C = KNO3_SOLUBILITY_TABLE[0][0];
export const SALT_TEMPERATURE_MAX_C = KNO3_SOLUBILITY_TABLE[KNO3_SOLUBILITY_TABLE.length - 1][0];

const CELSIUS_ZERO_K = 273.15;

function assertRange(value: number, low: number, high: number): void {
	if (!Number.isFinite(value) || value < low || value > high) {
		throw new Error(`${value} is outside [${low}, ${high}]`);
	}
}

const molalityFromGPer100g = (gPer100g: number, molarMass: number): number =>
	(gPer100g * 10) / molarMass;
const gPer100gFromMolality = (molPerKg: number, molarMass: number): number =>
	(molPerKg * molarMass) / 10;

/** Build ln Ksp = f(1/T_K) through every table anchor. */
function buildLnKsp(
	table: readonly (readonly [number, number])[],
	molarMass: number
): MonotoneCubic {
	const points = table
		.map(([temperatureC, gPer100g]) => {
			const molality = molalityFromGPer100g(gPer100g, molarMass);
			return [1 / (temperatureC + CELSIUS_ZERO_K), 2 * Math.log(molality)] as const;
		})
		.reverse(); // 1/T decreases with T, so reverse to sort ascending.
	return monotoneCubic(points);
}

const lnKspKno3 = buildLnKsp(KNO3_SOLUBILITY_TABLE, KNO3_MOLAR_MASS_G_PER_MOL);
const lnKspNano3 = buildLnKsp(NANO3_SOLUBILITY_TABLE, NANO3_MOLAR_MASS_G_PER_MOL);

/** Ideal solubility product of KNO3 in (mol/kg)^2 at `temperatureC`. */
export function kno3Ksp(temperatureC: number): number {
	assertRange(temperatureC, SALT_TEMPERATURE_MIN_C, SALT_TEMPERATURE_MAX_C);
	return Math.exp(lnKspKno3(1 / (temperatureC + CELSIUS_ZERO_K)));
}

/** Ideal solubility product of NaNO3 in (mol/kg)^2 at `temperatureC`. */
export function nano3Ksp(temperatureC: number): number {
	assertRange(temperatureC, SALT_TEMPERATURE_MIN_C, SALT_TEMPERATURE_MAX_C);
	return Math.exp(lnKspNano3(1 / (temperatureC + CELSIUS_ZERO_K)));
}

/** Solubility of pure KNO3 in g per 100 g water (reproduces the table anchors). */
export function kno3SolubilityGPer100g(temperatureC: number): number {
	return gPer100gFromMolality(Math.sqrt(kno3Ksp(temperatureC)), KNO3_MOLAR_MASS_G_PER_MOL);
}

/** Solubility of pure NaNO3 in g per 100 g water (reproduces the table anchors). */
export function nano3SolubilityGPer100g(temperatureC: number): number {
	return gPer100gFromMolality(Math.sqrt(nano3Ksp(temperatureC)), NANO3_MOLAR_MASS_G_PER_MOL);
}

/**
 * Empirical salting coefficients solved from each measured eutonic anchor:
 * m_K·(m_K+m_N) = Ksp_K·(1 + β_K·m_N) and the mirror equation for NaNO3 give
 * one (β_K, β_N) pair per anchor directly, no fitting loop. Between anchors
 * β varies linearly with temperature; outside, it holds the edge value. The
 * calibrated model therefore reproduces every measured eutonic exactly.
 */
function solveBetaAnchors(): readonly { temperatureC: number; kno3: number; nano3: number }[] {
	return CALIBRATION_EUTONICS.map(({ temperatureC, kno3MolPerKg: mK, nano3MolPerKg: mN }) => {
		const nitrate = mK + mN;
		return {
			temperatureC,
			kno3: ((mK * nitrate) / kno3Ksp(temperatureC) - 1) / mN,
			nano3: ((mN * nitrate) / nano3Ksp(temperatureC) - 1) / mK
		};
	});
}

export const SALTING_BETA_ANCHORS = solveBetaAnchors();

export function saltingBeta(temperatureC: number): { kno3: number; nano3: number } {
	const anchors = SALTING_BETA_ANCHORS;
	const first = anchors[0];
	const last = anchors[anchors.length - 1];
	if (temperatureC <= first.temperatureC) return { kno3: first.kno3, nano3: first.nano3 };
	if (temperatureC >= last.temperatureC) return { kno3: last.kno3, nano3: last.nano3 };
	for (let i = 0; i < anchors.length - 1; i += 1) {
		const a = anchors[i];
		const b = anchors[i + 1];
		if (temperatureC <= b.temperatureC) {
			const t = (temperatureC - a.temperatureC) / (b.temperatureC - a.temperatureC);
			return {
				kno3: a.kno3 + t * (b.kno3 - a.kno3),
				nano3: a.nano3 + t * (b.nano3 - a.nano3)
			};
		}
	}
	return { kno3: last.kno3, nano3: last.nano3 };
}

const kno3EffectiveKsp = (temperatureC: number, nano3Molality: number, scale: number): number =>
	kno3Ksp(temperatureC) * (1 + scale * saltingBeta(temperatureC).kno3 * nano3Molality);
const nano3EffectiveKsp = (temperatureC: number, kno3Molality: number, scale: number): number =>
	nano3Ksp(temperatureC) * (1 + scale * saltingBeta(temperatureC).nano3 * kno3Molality);

/** Saturated KNO3 molality when the solution already holds `nano3Molality` of NaNO3. */
export function kno3SaturatedMolality(
	temperatureC: number,
	nano3Molality: number,
	interactionScale = 1
): number {
	const ksp = kno3EffectiveKsp(temperatureC, nano3Molality, interactionScale);
	return (-nano3Molality + Math.sqrt(nano3Molality * nano3Molality + 4 * ksp)) / 2;
}

/** Saturated NaNO3 molality when the solution already holds `kno3Molality` of KNO3. */
export function nano3SaturatedMolality(
	temperatureC: number,
	kno3Molality: number,
	interactionScale = 1
): number {
	const ksp = nano3EffectiveKsp(temperatureC, kno3Molality, interactionScale);
	return (-kno3Molality + Math.sqrt(kno3Molality * kno3Molality + 4 * ksp)) / 2;
}

export interface EutonicMolalities {
	kno3MolPerKg: number;
	nano3MolPerKg: number;
}

/** The doubly-saturated (eutonic) solution at `temperatureC`. */
export function eutonicMolalities(temperatureC: number, interactionScale = 1): EutonicMolalities {
	const residual = (nano3Molality: number): number => {
		const kno3Molality = kno3SaturatedMolality(temperatureC, nano3Molality, interactionScale);
		return (
			nano3Molality * (kno3Molality + nano3Molality) -
			nano3EffectiveKsp(temperatureC, kno3Molality, interactionScale)
		);
	};
	// At m_N -> 0 the NaNO3 equation is undersaturated (negative residual);
	// scan upward by doubling until it flips, then hand Brent the bracket.
	let lower = 1e-9;
	let upper = Math.max(1, Math.sqrt(nano3Ksp(temperatureC)) / 2);
	let guard = 0;
	while (residual(upper) < 0) {
		lower = upper;
		upper *= 2;
		guard += 1;
		if (guard > 60) throw new Error('Eutonic bracket search failed to converge.');
	}
	const nano3MolPerKg = solveBracketedRoot(residual, lower, upper, { tolerance: 1e-12 });
	return {
		kno3MolPerKg: kno3SaturatedMolality(temperatureC, nano3MolPerKg, interactionScale),
		nano3MolPerKg
	};
}

export type SaltRegion = 'unsaturated' | 'kno3' | 'nano3' | 'both' | 'dry';

/** One pot: total masses in grams, before any phase split. */
export interface SaltPotState {
	temperatureC: number;
	waterG: number;
	kno3G: number;
	nano3G: number;
}

export interface SaltEquilibrium {
	region: SaltRegion;
	/** Dissolved masses in the liquid phase, grams. */
	liquid: { waterG: number; kno3G: number; nano3G: number };
	/** Crystal masses, grams. */
	solids: { kno3G: number; nano3G: number };
}

const DRY_WATER_G = 1e-6;

/** Split one pot into its equilibrium liquid and crystals. */
export function solveSaltEquilibrium(state: SaltPotState, interactionScale = 1): SaltEquilibrium {
	const { temperatureC, waterG, kno3G, nano3G } = state;
	assertRange(temperatureC, SALT_TEMPERATURE_MIN_C, SALT_TEMPERATURE_MAX_C);
	if (waterG < 0 || kno3G < 0 || nano3G < 0) {
		throw new Error('Salt pot masses must be non-negative.');
	}
	if (waterG <= DRY_WATER_G) {
		return {
			region: 'dry',
			liquid: { waterG: 0, kno3G: 0, nano3G: 0 },
			solids: { kno3G, nano3G }
		};
	}

	const waterKg = waterG / 1000;
	const mK0 = kno3G / KNO3_MOLAR_MASS_G_PER_MOL / waterKg;
	const mN0 = nano3G / NANO3_MOLAR_MASS_G_PER_MOL / waterKg;

	const kno3Holds = (mK: number, mN: number): boolean =>
		mK * (mK + mN) <= kno3EffectiveKsp(temperatureC, mN, interactionScale) * (1 + 1e-12);
	const nano3Holds = (mK: number, mN: number): boolean =>
		mN * (mK + mN) <= nano3EffectiveKsp(temperatureC, mK, interactionScale) * (1 + 1e-12);

	if (kno3Holds(mK0, mN0) && nano3Holds(mK0, mN0)) {
		return {
			region: 'unsaturated',
			liquid: { waterG, kno3G, nano3G },
			solids: { kno3G: 0, nano3G: 0 }
		};
	}

	if (!kno3Holds(mK0, mN0)) {
		const mK = kno3SaturatedMolality(temperatureC, mN0, interactionScale);
		if (nano3Holds(mK, mN0)) {
			const liquidKno3G = mK * waterKg * KNO3_MOLAR_MASS_G_PER_MOL;
			return {
				region: 'kno3',
				liquid: { waterG, kno3G: liquidKno3G, nano3G },
				solids: { kno3G: Math.max(0, kno3G - liquidKno3G), nano3G: 0 }
			};
		}
	}

	if (!nano3Holds(mK0, mN0)) {
		const mN = nano3SaturatedMolality(temperatureC, mK0, interactionScale);
		if (kno3Holds(mK0, mN)) {
			const liquidNano3G = mN * waterKg * NANO3_MOLAR_MASS_G_PER_MOL;
			return {
				region: 'nano3',
				liquid: { waterG, kno3G, nano3G: liquidNano3G },
				solids: { kno3G: 0, nano3G: Math.max(0, nano3G - liquidNano3G) }
			};
		}
	}

	const eutonic = eutonicMolalities(temperatureC, interactionScale);
	const liquidKno3G = eutonic.kno3MolPerKg * waterKg * KNO3_MOLAR_MASS_G_PER_MOL;
	const liquidNano3G = eutonic.nano3MolPerKg * waterKg * NANO3_MOLAR_MASS_G_PER_MOL;
	return {
		region: 'both',
		liquid: { waterG, kno3G: liquidKno3G, nano3G: liquidNano3G },
		solids: {
			kno3G: Math.max(0, kno3G - liquidKno3G),
			nano3G: Math.max(0, nano3G - liquidNano3G)
		}
	};
}

/** Mass-fraction composition on the ternary; the three fractions sum to 1. */
export interface TernaryComposition {
	waterFrac: number;
	kno3Frac: number;
	nano3Frac: number;
}

export function massesToComposition(masses: {
	waterG: number;
	kno3G: number;
	nano3G: number;
}): TernaryComposition {
	const total = masses.waterG + masses.kno3G + masses.nano3G;
	if (total <= 0) throw new Error('Composition requires a positive total mass.');
	return {
		waterFrac: masses.waterG / total,
		kno3Frac: masses.kno3G / total,
		nano3Frac: masses.nano3G / total
	};
}

/**
 * Barycentric to 2-D on the unit triangle: KNO3 vertex at (0,0), NaNO3 at
 * (1,0), water at the apex (0.5, sqrt(3)/2). Components scale to their viewBox.
 */
export function ternaryToXY(composition: TernaryComposition): { x: number; y: number } {
	return {
		x: composition.nano3Frac + composition.waterFrac / 2,
		y: (composition.waterFrac * Math.sqrt(3)) / 2
	};
}

const compositionFromMolalities = (mK: number, mN: number): TernaryComposition =>
	massesToComposition({
		waterG: 1000,
		kno3G: mK * KNO3_MOLAR_MASS_G_PER_MOL,
		nano3G: mN * NANO3_MOLAR_MASS_G_PER_MOL
	});

export interface SaltIsotherm {
	temperatureC: number;
	interactionScale: number;
	/** KNO3 saturation branch, from the binary (no NaNO3) end to the eutonic. */
	kno3Branch: readonly TernaryComposition[];
	/** NaNO3 saturation branch, from the binary (no KNO3) end to the eutonic. */
	nano3Branch: readonly TernaryComposition[];
	eutonic: TernaryComposition;
	eutonicMolalities: EutonicMolalities;
}

/** Sample both saturation branches of the isotherm at `temperatureC`. */
export function saltIsotherm(
	temperatureC: number,
	interactionScale = 1,
	samplesPerBranch = 48
): SaltIsotherm {
	const eutonic = eutonicMolalities(temperatureC, interactionScale);
	const kno3Branch: TernaryComposition[] = [];
	const nano3Branch: TernaryComposition[] = [];
	for (let i = 0; i <= samplesPerBranch; i += 1) {
		const t = i / samplesPerBranch;
		const mN = eutonic.nano3MolPerKg * t;
		kno3Branch.push(
			compositionFromMolalities(kno3SaturatedMolality(temperatureC, mN, interactionScale), mN)
		);
		const mK = eutonic.kno3MolPerKg * t;
		nano3Branch.push(
			compositionFromMolalities(mK, nano3SaturatedMolality(temperatureC, mK, interactionScale))
		);
	}
	return {
		temperatureC,
		interactionScale,
		kno3Branch,
		nano3Branch,
		eutonic: compositionFromMolalities(eutonic.kno3MolPerKg, eutonic.nano3MolPerKg),
		eutonicMolalities: eutonic
	};
}

export interface HarvestResult {
	/** The pot after crystals are filtered off: the mother liquor. */
	state: SaltPotState;
	harvestedKno3G: number;
	harvestedNano3G: number;
}

/** Filter: remove the crystals, keep the mother liquor as the new pot. */
export function harvestSolids(state: SaltPotState, interactionScale = 1): HarvestResult {
	const equilibrium = solveSaltEquilibrium(state, interactionScale);
	return {
		state: {
			temperatureC: state.temperatureC,
			waterG: equilibrium.liquid.waterG,
			kno3G: equilibrium.liquid.kno3G,
			nano3G: equilibrium.liquid.nano3G
		},
		harvestedKno3G: equilibrium.solids.kno3G,
		harvestedNano3G: equilibrium.solids.nano3G
	};
}
