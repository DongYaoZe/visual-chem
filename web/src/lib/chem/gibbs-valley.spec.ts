import { describe, expect, it } from 'vitest';
import {
	DELTA_G0_J_PER_MOL,
	DELTA_H0_J_PER_MOL,
	deltaG0,
	equilibriumExtent,
	equilibriumExtentByRoot,
	equilibriumKp,
	gibbsOfExtent,
	no2MoleFraction,
	reactionGibbs,
	valleyCurve
} from './gibbs-valley';

describe('standard reaction quantities (CODATA/NIST-JANAF 298.15 K)', () => {
	it('pins ΔrG° and ΔrH° for N2O4 → 2 NO2', () => {
		expect(DELTA_G0_J_PER_MOL).toBeCloseTo(4700, 6);
		expect(DELTA_H0_J_PER_MOL).toBeCloseTo(57240, 6);
		expect(deltaG0(298.15)).toBeCloseTo(4700, 6);
	});

	it('gives the textbook Kp ≈ 0.15 at 298 K and Kp = 1 near 320 K', () => {
		expect(equilibriumKp(298.15)).toBeGreaterThan(0.14);
		expect(equilibriumKp(298.15)).toBeLessThan(0.16);
		// ΔG°(T*) = 0 at T* = ΔH°/ΔS°; with our data T* ≈ 325 K.
		const tStar = DELTA_H0_J_PER_MOL / ((DELTA_H0_J_PER_MOL - DELTA_G0_J_PER_MOL) / 298.15);
		expect(tStar).toBeGreaterThan(320);
		expect(tStar).toBeLessThan(330);
		expect(equilibriumKp(tStar)).toBeCloseTo(1, 6);
	});

	it('is endothermic: Kp grows with temperature (browner when hot)', () => {
		expect(equilibriumKp(350)).toBeGreaterThan(equilibriumKp(298.15));
		expect(equilibriumKp(273.15)).toBeLessThan(equilibriumKp(298.15));
	});
});

describe('the Gibbs valley', () => {
	it('has its floor exactly where ΔrG crosses zero', () => {
		for (const T of [280, 298.15, 320, 350]) {
			for (const p of [0.5, 1, 2]) {
				const analytic = equilibriumExtent(T, p);
				expect(analytic).toBeCloseTo(equilibriumExtentByRoot(T, p), 9);
				expect(reactionGibbs(analytic, T, p)).toBeCloseTo(0, 6);
			}
		}
	});

	it('is a genuine minimum: G rises on both sides of the floor', () => {
		const T = 298.15;
		const floor = equilibriumExtent(T);
		const gFloor = gibbsOfExtent(floor, T);
		expect(gibbsOfExtent(floor - 0.05, T)).toBeGreaterThan(gFloor);
		expect(gibbsOfExtent(floor + 0.05, T)).toBeGreaterThan(gFloor);
	});

	it('slopes downhill toward the floor from both directions', () => {
		const T = 298.15;
		const floor = equilibriumExtent(T);
		expect(reactionGibbs(floor / 2, T)).toBeLessThan(0);
		expect(reactionGibbs(floor + (1 - floor) / 2, T)).toBeGreaterThan(0);
	});

	it('sits below the pure-reactant reference even though ΔrG° > 0', () => {
		// The story's central point: mixing digs the valley below G(0),
		// so "ΔG° positive" does not mean "no reaction".
		const { equilibrium } = valleyCurve(298.15);
		expect(equilibrium.gibbsKJ).toBeLessThan(0);
		expect(equilibrium.extent).toBeGreaterThan(0.15);
		expect(equilibrium.extent).toBeLessThan(0.25);
	});
});

describe('Le Chatelier on the computed landscape', () => {
	it('compression pushes the floor toward N2O4 (fewer moles)', () => {
		expect(equilibriumExtent(298.15, 2)).toBeLessThan(equilibriumExtent(298.15, 1));
		expect(equilibriumExtent(298.15, 0.2)).toBeGreaterThan(equilibriumExtent(298.15, 1));
	});

	it('heating pushes the floor toward NO2 (endothermic)', () => {
		expect(equilibriumExtent(350)).toBeGreaterThan(equilibriumExtent(298.15));
		expect(equilibriumExtent(273.15)).toBeLessThan(equilibriumExtent(298.15));
	});

	it('the ice-bath and warm-bath extents bracket the classroom color change', () => {
		// 0 °C: mostly colorless; 60 °C: strongly brown.
		expect(no2MoleFraction(equilibriumExtent(273.15))).toBeLessThan(0.2);
		expect(no2MoleFraction(equilibriumExtent(333.15))).toBeGreaterThan(0.5);
	});
});

describe('valleyCurve sampling', () => {
	it('spans (0,1) and tags the equilibrium point on the curve', () => {
		const curve = valleyCurve(298.15, 1, 60);
		expect(curve.extents[0]).toBeGreaterThan(0);
		expect(curve.extents[curve.extents.length - 1]).toBeLessThan(1);
		const minimum = Math.min(...curve.gibbsKJ);
		expect(curve.equilibrium.gibbsKJ).toBeLessThanOrEqual(minimum + 1e-6);
	});
});
