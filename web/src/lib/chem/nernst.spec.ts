import { describe, expect, it } from 'vitest';
import {
	DANIELL_STANDARD_EMF_V,
	STANDARD_POTENTIALS_V,
	concentrationCellEmfV,
	daniellEmfV,
	daniellGibbsKJ,
	dischargeCurve,
	equilibriumRatio
} from './nernst';

describe('standard potentials (CRC/IUPAC, 298.15 K)', () => {
	it('pins the Daniell standard EMF at 1.1037 V', () => {
		expect(STANDARD_POTENTIALS_V.copper).toBeCloseTo(0.3419, 6);
		expect(STANDARD_POTENTIALS_V.zinc).toBeCloseTo(-0.7618, 6);
		expect(DANIELL_STANDARD_EMF_V).toBeCloseTo(1.1037, 6);
	});

	it('recovers E° at standard concentrations', () => {
		expect(daniellEmfV(1, 1)).toBeCloseTo(DANIELL_STANDARD_EMF_V, 12);
	});
});

describe('the Nernst slope', () => {
	it('moves 29.58 mV per decade of the ion ratio (n = 2)', () => {
		const step = daniellEmfV(1, 1) - daniellEmfV(10, 1);
		expect(step * 1000).toBeCloseTo(29.58, 1);
		// Symmetric the other way: richer Cu²⁺ raises the EMF.
		expect(daniellEmfV(1, 10) - daniellEmfV(1, 1)).toBeCloseTo(step, 10);
	});

	it('rejects non-physical concentrations', () => {
		expect(() => daniellEmfV(0, 1)).toThrow(/positive/);
		expect(() => daniellEmfV(1, -2)).toThrow(/positive/);
	});
});

describe('ΔG = −nFE ties back to the downhill story', () => {
	it('gives −213 kJ/mol at standard state', () => {
		expect(daniellGibbsKJ(1, 1)).toBeCloseTo(-213.0, 0);
	});

	it('flips sign exactly where the EMF crosses zero', () => {
		const ratio = equilibriumRatio();
		// At Q = K the cell is dead: E = 0, ΔG = 0.
		expect(daniellEmfV(ratio, 1)).toBeCloseTo(0, 6);
		expect(daniellGibbsKJ(ratio, 1)).toBeCloseTo(0, 4);
	});

	it('the dead-battery ratio is astronomically large (K ≈ 10^37)', () => {
		const log10K = Math.log10(equilibriumRatio());
		expect(log10K).toBeGreaterThan(37);
		expect(log10K).toBeLessThan(38);
	});
});

describe('dischargeCurve', () => {
	it('starts at E° and sags monotonically', () => {
		const curve = dischargeCurve(1, 0.9);
		expect(curve[0].emfV).toBeCloseTo(DANIELL_STANDARD_EMF_V, 9);
		for (let index = 1; index < curve.length; index += 1) {
			expect(curve[index].emfV).toBeLessThan(curve[index - 1].emfV);
		}
	});

	it('conserves total metal-ion inventory along the way', () => {
		for (const point of dischargeCurve(1, 0.9)) {
			expect(point.zincMolar + point.copperMolar).toBeCloseTo(2, 9);
		}
	});

	it('stays nearly flat until the very end — the plateau batteries live on', () => {
		const curve = dischargeCurve(1, 0.9);
		const at80 = curve.find((point) => point.depth >= 0.8);
		expect(at80).toBeDefined();
		// After consuming 80 % of the Cu²⁺ the cell has lost under 30 mV.
		expect(DANIELL_STANDARD_EMF_V - at80!.emfV).toBeLessThan(0.03);
	});
});

describe('concentrationCellEmfV', () => {
	it('is zero for equal sides and 29.6 mV per decade otherwise', () => {
		expect(concentrationCellEmfV(0.1, 0.1)).toBeCloseTo(0, 12);
		expect(concentrationCellEmfV(0.01, 0.1) * 1000).toBeCloseTo(29.58, 1);
		expect(concentrationCellEmfV(0.001, 1) * 1000).toBeCloseTo(3 * 29.58, 0);
	});
});
