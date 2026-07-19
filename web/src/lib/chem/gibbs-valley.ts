/**
 * Gibbs-energy landscape of the N2O4 ⇌ 2 NO2 equilibrium.
 *
 * The story's "valley": for one mole of N2O4 dissociating to extent ξ at
 * constant T and p, the ideal-gas Gibbs energy per mole of initial N2O4 is
 *
 *   G(ξ) = (1−ξ)·μ°(N2O4) + 2ξ·μ°(NO2) + RT·[(1−ξ)ln x_A + 2ξ ln x_B] + n RT ln(p/p°)
 *
 * with x_A = (1−ξ)/(1+ξ), x_B = 2ξ/(1+ξ), n = 1+ξ. The mixing term digs the
 * valley; its minimum is exactly where ΔrG = 0, i.e. Kp = 4ξ²/(1−ξ²)·(p/p°).
 * Standard data (CODATA/NIST-JANAF, 298.15 K): ΔfG°(NO2) = 51.3 kJ/mol,
 * ΔfG°(N2O4) = 97.9 kJ/mol, ΔfH°(NO2) = 33.2, ΔfH°(N2O4) = 9.16 kJ/mol —
 * so ΔrG° = +4.7 kJ/mol and ΔrH° = +57.2 kJ/mol (endothermic, browns on
 * heating). Temperature dependence via van 't Hoff with constant ΔrH°.
 */

import { solveBracketedRoot } from './root';

const GAS_CONSTANT_J_PER_MOL_K = 8.31446261815324;
const T0_K = 298.15;

/** Standard reaction quantities for N2O4(g) → 2 NO2(g) at 298.15 K. */
export const DELTA_G0_J_PER_MOL = 2 * 51300 - 97900; // +4700
export const DELTA_H0_J_PER_MOL = 2 * 33200 - 9160; // +57240

export function deltaG0(temperatureK: number): number {
	// Gibbs–Helmholtz with constant ΔrH°: ΔG°(T)/T = ΔG°(T0)/T0 + ΔH°·(1/T − 1/T0).
	return (
		temperatureK * (DELTA_G0_J_PER_MOL / T0_K + DELTA_H0_J_PER_MOL * (1 / temperatureK - 1 / T0_K))
	);
}

/** Kp (dimensionless, p° = 1 bar) from the van 't Hoff integration. */
export function equilibriumKp(temperatureK: number): number {
	return Math.exp(-deltaG0(temperatureK) / (GAS_CONSTANT_J_PER_MOL_K * temperatureK));
}

function assertExtent(extent: number): void {
	if (!(extent > 0 && extent < 1)) throw new Error(`${extent} is outside (0, 1)`);
}

/**
 * G(ξ) − G(0) in J per mole of initial N2O4, at total pressure p (bar).
 * Referenced to pure N2O4 so the plotted valley starts at zero.
 */
export function gibbsOfExtent(extent: number, temperatureK: number, pressureBar = 1): number {
	assertExtent(extent);
	const RT = GAS_CONSTANT_J_PER_MOL_K * temperatureK;
	const moles = 1 + extent;
	const xA = (1 - extent) / moles;
	const xB = (2 * extent) / moles;
	const standard = extent * deltaG0(temperatureK);
	const mixing = RT * ((1 - extent) * Math.log(xA) + 2 * extent * Math.log(xB));
	const compression = moles * RT * Math.log(pressureBar);
	// G(0) has zero mixing and one mole of gas at p.
	return standard + mixing + compression - RT * Math.log(pressureBar);
}

/** Reaction Gibbs energy ΔrG(ξ) = dG/dξ in J/mol — the slope of the valley. */
export function reactionGibbs(extent: number, temperatureK: number, pressureBar = 1): number {
	assertExtent(extent);
	const RT = GAS_CONSTANT_J_PER_MOL_K * temperatureK;
	const moles = 1 + extent;
	const xA = (1 - extent) / moles;
	const xB = (2 * extent) / moles;
	const reactionQuotient = (xB * pressureBar) ** 2 / (xA * pressureBar);
	return deltaG0(temperatureK) + RT * Math.log(reactionQuotient);
}

/** Equilibrium extent: the analytic valley floor, ΔrG = 0. */
export function equilibriumExtent(temperatureK: number, pressureBar = 1): number {
	// Kp = 4ξ²/(1−ξ²)·p  ⇒  ξ = √(K/(K+4p)).
	const kp = equilibriumKp(temperatureK);
	return Math.sqrt(kp / (kp + 4 * pressureBar));
}

/** Numeric check helper: locate the valley floor by the sign change of ΔrG. */
export function equilibriumExtentByRoot(temperatureK: number, pressureBar = 1): number {
	return solveBracketedRoot(
		(extent) => reactionGibbs(extent, temperatureK, pressureBar),
		1e-9,
		1 - 1e-9,
		{ tolerance: 1e-13 }
	);
}

export interface ValleyCurve {
	temperatureK: number;
	pressureBar: number;
	extents: readonly number[];
	/** G(ξ) − G(0) in kJ per mole of initial N2O4. */
	gibbsKJ: readonly number[];
	equilibrium: { extent: number; gibbsKJ: number };
}

export function valleyCurve(temperatureK: number, pressureBar = 1, samples = 121): ValleyCurve {
	const extents: number[] = [];
	const gibbsKJ: number[] = [];
	for (let index = 0; index <= samples; index += 1) {
		const extent = 0.001 + (0.998 * index) / samples;
		extents.push(extent);
		gibbsKJ.push(gibbsOfExtent(extent, temperatureK, pressureBar) / 1000);
	}
	const extent = equilibriumExtent(temperatureK, pressureBar);
	return {
		temperatureK,
		pressureBar,
		extents,
		gibbsKJ,
		equilibrium: { extent, gibbsKJ: gibbsOfExtent(extent, temperatureK, pressureBar) / 1000 }
	};
}

/** Mole fraction of NO2 in the vapor at extent ξ — drives the brown tint. */
export function no2MoleFraction(extent: number): number {
	assertExtent(extent);
	return (2 * extent) / (1 + extent);
}
