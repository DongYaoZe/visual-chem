/**
 * Nernst-equation landscape of the Daniell cell, Zn | Zn²⁺ ‖ Cu²⁺ | Cu.
 *
 * Standard electrode potentials (vs SHE, 298.15 K, CRC/IUPAC):
 * E°(Cu²⁺/Cu) = +0.3419 V, E°(Zn²⁺/Zn) = −0.7618 V, so E°cell = 1.1037 V.
 * The working cell follows E = E° − (RT/nF)·ln(a_Zn²⁺/a_Cu²⁺) with n = 2 and
 * concentrations standing in for activities — the teaching approximation the
 * model card declares. ΔG = −nFE ties the story back to story 6's downhill.
 */

const GAS_CONSTANT_J_PER_MOL_K = 8.31446261815324;
export const FARADAY_C_PER_MOL = 96485.33212;

export const STANDARD_POTENTIALS_V = {
	copper: 0.3419,
	zinc: -0.7618
} as const;

export const DANIELL_STANDARD_EMF_V = STANDARD_POTENTIALS_V.copper - STANDARD_POTENTIALS_V.zinc;
const ELECTRONS = 2;

function assertConcentration(molar: number): void {
	if (!(molar > 0) || !Number.isFinite(molar)) {
		throw new Error(`${molar} is not a positive concentration`);
	}
}

/** Cell EMF in volts at the given ion concentrations (mol/L) and temperature. */
export function daniellEmfV(zincMolar: number, copperMolar: number, temperatureK = 298.15): number {
	assertConcentration(zincMolar);
	assertConcentration(copperMolar);
	const RT_nF = (GAS_CONSTANT_J_PER_MOL_K * temperatureK) / (ELECTRONS * FARADAY_C_PER_MOL);
	return DANIELL_STANDARD_EMF_V - RT_nF * Math.log(zincMolar / copperMolar);
}

/** Reaction Gibbs energy ΔG = −nFE in kJ/mol at the given state. */
export function daniellGibbsKJ(
	zincMolar: number,
	copperMolar: number,
	temperatureK = 298.15
): number {
	return (
		(-ELECTRONS * FARADAY_C_PER_MOL * daniellEmfV(zincMolar, copperMolar, temperatureK)) / 1000
	);
}

/** The dead-battery ratio: E = 0 when ln(Q) = nF·E°/RT, Q = a_Zn/a_Cu. */
export function equilibriumRatio(temperatureK = 298.15): number {
	return Math.exp(
		(ELECTRONS * FARADAY_C_PER_MOL * DANIELL_STANDARD_EMF_V) /
			(GAS_CONSTANT_J_PER_MOL_K * temperatureK)
	);
}

/**
 * Discharge trajectory: start with equal concentrations and transfer charge
 * until the EMF sags. Each step converts dξ mol/L of Cu²⁺ into Zn²⁺; the
 * curve ends when E reaches `cutoffV`. Returns state-of-charge samples.
 */
export interface DischargePoint {
	/** Fraction of the initial Cu²⁺ consumed. */
	depth: number;
	zincMolar: number;
	copperMolar: number;
	emfV: number;
}

export function dischargeCurve(
	initialMolar = 1,
	cutoffV = 0.9,
	samples = 200
): readonly DischargePoint[] {
	const points: DischargePoint[] = [];
	for (let index = 0; index <= samples; index += 1) {
		// March depth toward 1; the log blows up as Cu²⁺ → 0, so stop early.
		const depth = (index / samples) * 0.999999;
		const copperMolar = initialMolar * (1 - depth);
		const zincMolar = initialMolar * (1 + depth);
		const emfV = daniellEmfV(zincMolar, copperMolar);
		points.push({ depth, zincMolar, copperMolar, emfV });
		if (emfV < cutoffV) break;
	}
	return points;
}

/** Concentration cell: same metal both sides, EMF from the ratio alone. */
export function concentrationCellEmfV(
	diluteMolar: number,
	concentratedMolar: number,
	temperatureK = 298.15
): number {
	assertConcentration(diluteMolar);
	assertConcentration(concentratedMolar);
	const RT_nF = (GAS_CONSTANT_J_PER_MOL_K * temperatureK) / (ELECTRONS * FARADAY_C_PER_MOL);
	return RT_nF * Math.log(concentratedMolar / diluteMolar);
}
