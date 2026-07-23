/**
 * Reaction energy profiles for the catalyst story.
 *
 * The profile is a smooth double-well built from cosine half-waves:
 * reactants at 0, a summit at Ea, products at ΔH. The catalyzed path
 * replaces the single summit with a lower two-bump pass (intermediate in a
 * shallow dip), the standard textbook picture for e.g. H2O2 over iodide:
 * uncatalyzed ~70-75 kJ/mol, iodide-catalyzed ~56, catalase ~8-20.
 *
 * The kernel's claims, pinned by spec:
 * - the catalyzed summit is lower, but reactant and product levels do not
 *   move — a catalyst never moves the valley, only the pass;
 * - both directions' barriers drop by the same amount, so kf and kr gain
 *   the same Arrhenius factor and K = kf/kr is untouched.
 */

import { arrheniusFactor } from './arrhenius';

export interface ProfilePoint {
	/** Reaction coordinate 0..1. */
	x: number;
	/** Energy in kJ/mol relative to reactants. */
	e: number;
}

function assertFinite(value: number, name: string): void {
	if (!Number.isFinite(value)) throw new Error(`${name} must be finite, got ${value}`);
}

/** Smooth interpolation from (x0,e0) to (x1,e1) with zero end slopes. */
function cosineRamp(
	x0: number,
	e0: number,
	x1: number,
	e1: number,
	points: ProfilePoint[],
	samples: number
): void {
	for (let index = 1; index <= samples; index += 1) {
		const t = index / samples;
		const s = (1 - Math.cos(Math.PI * t)) / 2;
		points.push({ x: x0 + (x1 - x0) * t, e: e0 + (e1 - e0) * s });
	}
}

/** Single-summit profile: reactants 0 → summit Ea → products ΔH. */
export function uncatalyzedProfile(
	eaKJPerMol: number,
	deltaHKJPerMol: number,
	samples = 40
): readonly ProfilePoint[] {
	assertFinite(eaKJPerMol, 'Ea');
	assertFinite(deltaHKJPerMol, 'dH');
	if (eaKJPerMol <= Math.max(0, deltaHKJPerMol)) {
		throw new Error('the summit must rise above both valleys');
	}
	const points: ProfilePoint[] = [{ x: 0, e: 0 }];
	cosineRamp(0.08, 0, 0.5, eaKJPerMol, points, samples);
	cosineRamp(0.5, eaKJPerMol, 0.92, deltaHKJPerMol, points, samples);
	points.unshift({ x: -0.02, e: 0 });
	points.push({ x: 1.02, e: deltaHKJPerMol });
	return points;
}

/**
 * Catalyzed profile: two lower bumps with an intermediate dip between.
 * catalyzedEa is the height of the taller bump (the rate-determining one).
 */
export function catalyzedProfile(
	catalyzedEaKJPerMol: number,
	deltaHKJPerMol: number,
	samples = 24
): readonly ProfilePoint[] {
	assertFinite(catalyzedEaKJPerMol, 'Ea');
	assertFinite(deltaHKJPerMol, 'dH');
	if (catalyzedEaKJPerMol <= Math.max(0, deltaHKJPerMol)) {
		throw new Error('the pass must rise above both valleys');
	}
	// Intermediate sits partway down; second bump slightly lower than first.
	const dip = Math.max(deltaHKJPerMol * 0.4, catalyzedEaKJPerMol * 0.35);
	const secondBump = dip + 0.82 * (catalyzedEaKJPerMol - dip) + deltaHKJPerMol * 0.1;
	const points: ProfilePoint[] = [{ x: 0, e: 0 }];
	cosineRamp(0.08, 0, 0.3, catalyzedEaKJPerMol, points, samples);
	cosineRamp(0.3, catalyzedEaKJPerMol, 0.5, dip, points, samples);
	cosineRamp(0.5, dip, 0.68, secondBump, points, samples);
	cosineRamp(0.68, secondBump, 0.92, deltaHKJPerMol, points, samples);
	points.unshift({ x: -0.02, e: 0 });
	points.push({ x: 1.02, e: deltaHKJPerMol });
	return points;
}

/** Forward and reverse barrier heights of a single-summit profile. */
export function barriers(
	eaKJPerMol: number,
	deltaHKJPerMol: number
): { forward: number; reverse: number } {
	return { forward: eaKJPerMol, reverse: eaKJPerMol - deltaHKJPerMol };
}

/**
 * The equal-acceleration theorem the story pins: dropping the summit by
 * ΔEa multiplies BOTH kf and kr by the same factor exp(ΔEa/RT), so the
 * equilibrium constant K = kf/kr is exactly unchanged.
 */
export function accelerationFactor(
	eaBeforeKJPerMol: number,
	eaAfterKJPerMol: number,
	temperatureK: number
): number {
	return (
		arrheniusFactor(eaAfterKJPerMol, temperatureK) / arrheniusFactor(eaBeforeKJPerMol, temperatureK)
	);
}

/** H2O2 decomposition anchors (kJ/mol), classroom-standard values. */
export const H2O2_BARRIERS_KJ = {
	uncatalyzed: 73,
	iodide: 56,
	catalase: 14
} as const;

/** Reaction enthalpy of 2 H2O2 -> 2 H2O + O2, per mole H2O2 (kJ/mol). */
export const H2O2_DELTA_H_KJ = -98;
