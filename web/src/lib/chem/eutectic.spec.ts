import { describe, expect, it } from 'vitest';
import {
	BISMUTH,
	CADMIUM,
	COPPER,
	NICKEL,
	biCdEutectic,
	branchLiquidusK,
	branchLiquidusMoleFraction,
	eutecticLiquidFraction,
	eutecticSplit,
	lensCompositions,
	liquidusK,
	massFractionCdToMole,
	moleFractionCdToMass,
	simulateCoolingCurve
} from './eutectic';

const KELVIN = 273.15;

describe('Schröder–van Laar branches', () => {
	it('are analytic inverses of each other', () => {
		for (const x of [0.05, 0.3, 0.7, 0.95, 1]) {
			const t = branchLiquidusK(BISMUTH, x);
			expect(branchLiquidusMoleFraction(BISMUTH, t)).toBeCloseTo(x, 10);
			expect(branchLiquidusMoleFraction(CADMIUM, branchLiquidusK(CADMIUM, x))).toBeCloseTo(x, 10);
		}
	});

	it('meet the pure melting points at the diagram edges', () => {
		expect(liquidusK(0)).toBeCloseTo(BISMUTH.meltingPointC + KELVIN, 9);
		expect(liquidusK(1)).toBeCloseTo(CADMIUM.meltingPointC + KELVIN, 9);
	});

	it('reject non-physical mole fractions', () => {
		expect(() => branchLiquidusK(BISMUTH, 0)).toThrow(/outside/);
		expect(() => branchLiquidusK(BISMUTH, 1.01)).toThrow(/outside/);
	});
});

describe('the ideal Bi–Cd eutectic', () => {
	it('lands near the measured composition and ~10 K below the measured temperature', () => {
		const eutectic = biCdEutectic();
		// Measured: ~145 °C at ~40 wt% Cd (x_Cd ≈ 0.55). The ideal model nails
		// the composition and sits ~10 K low — the story's honesty beat.
		expect(eutectic.xB).toBeGreaterThan(0.53);
		expect(eutectic.xB).toBeLessThan(0.6);
		expect(eutectic.temperatureC).toBeGreaterThan(128);
		expect(eutectic.temperatureC).toBeLessThan(142);
		// Both branches agree at the intersection.
		expect(branchLiquidusK(BISMUTH, 1 - eutectic.xB)).toBeCloseTo(eutectic.temperatureK, 7);
	});

	it('is the minimum of the whole liquidus', () => {
		const eutectic = biCdEutectic();
		for (let i = 1; i < 40; i += 1) {
			const x = i / 40;
			if (Math.abs(x - eutectic.xB) < 1e-9) continue;
			expect(liquidusK(x)).toBeGreaterThan(eutectic.temperatureK - 1e-9);
		}
	});
});

describe('eutecticSplit', () => {
	it('applies the lever rule against pure solids', () => {
		const split = eutecticSplit(0.3, 440);
		expect(split.region).toBe('liquid+A');
		expect(split.liquidFraction + split.solidAFraction + split.solidBFraction).toBeCloseTo(1, 12);
		// All Cd stays in the liquid: overall balance closes.
		expect(split.liquidFraction * (split.liquidXB ?? 0)).toBeCloseTo(0.3, 10);
	});

	it('mirrors on the Cd side', () => {
		const split = eutecticSplit(0.8, 500);
		expect(split.region).toBe('liquid+B');
		expect(split.liquidFraction * (split.liquidXB ?? 0) + split.solidBFraction).toBeCloseTo(
			0.8,
			10
		);
	});

	it('is all liquid above the liquidus and all solid below the eutectic', () => {
		expect(eutecticSplit(0.3, 540).region).toBe('liquid');
		const solid = eutecticSplit(0.3, 380);
		expect(solid.region).toBe('solid-mixture');
		expect(solid.solidAFraction).toBeCloseTo(0.7, 12);
		expect(solid.solidBFraction).toBeCloseTo(0.3, 12);
	});

	it('the eutectic liquid fraction peaks at the eutectic composition (Tammann)', () => {
		const eutectic = biCdEutectic();
		expect(eutecticLiquidFraction(eutectic.xB)).toBeCloseTo(1, 12);
		expect(eutecticLiquidFraction(0.2)).toBeLessThan(eutecticLiquidFraction(0.4));
		expect(eutecticLiquidFraction(0.9)).toBeLessThan(eutecticLiquidFraction(0.7));
		expect(eutecticLiquidFraction(0)).toBe(0);
		expect(eutecticLiquidFraction(1)).toBe(0);
	});
});

describe('composition conversions', () => {
	it('round-trip between mass and mole fraction', () => {
		for (const w of [0, 0.2, 0.4, 0.63, 1]) {
			expect(moleFractionCdToMass(massFractionCdToMole(w))).toBeCloseTo(w, 12);
		}
		// 40 wt% Cd is about x_Cd 0.55 — the classic eutectic quotation.
		expect(massFractionCdToMole(0.4)).toBeGreaterThan(0.54);
		expect(massFractionCdToMole(0.4)).toBeLessThan(0.56);
	});
});

describe('simulateCoolingCurve', () => {
	it('never lets the temperature rise', () => {
		const curve = simulateCoolingCurve({ xB: 0.3 });
		for (let i = 1; i < curve.points.length; i += 1) {
			expect(curve.points[i].temperatureC).toBeLessThanOrEqual(
				curve.points[i - 1].temperatureC + 1e-9
			);
		}
	});

	it('a pure component halts exactly at its melting point', () => {
		const curve = simulateCoolingCurve({ xB: 0 });
		expect(curve.liquidusBreakC).toBeNull();
		expect(curve.arrest).not.toBeNull();
		expect(curve.arrest!.temperatureC).toBeCloseTo(BISMUTH.meltingPointC, 6);
		expect(curve.arrest!.durationS).toBeGreaterThan(60);
	});

	it('a mixture breaks at the liquidus, then arrests at the eutectic', () => {
		const eutectic = biCdEutectic();
		const curve = simulateCoolingCurve({ xB: 0.3 });
		expect(curve.liquidusBreakC).toBeCloseTo(liquidusK(0.3) - KELVIN, 6);
		expect(curve.arrest!.temperatureC).toBeCloseTo(eutectic.temperatureC, 6);
		// The two-phase slope is flatter than the liquid slope just above it.
		const slopeNear = (targetC: number) => {
			const index = curve.points.findIndex((point) => point.temperatureC <= targetC);
			const a = curve.points[index - 2];
			const b = curve.points[index + 2];
			return (a.temperatureC - b.temperatureC) / (b.timeS - a.timeS);
		};
		const breakC = curve.liquidusBreakC!;
		expect(slopeNear(breakC - 8)).toBeLessThan(slopeNear(breakC + 8) * 0.85);
	});

	it('the eutectic arrest is longest at the eutectic composition (Tammann triangle)', () => {
		const eutectic = biCdEutectic();
		const durationAt = (xB: number) => simulateCoolingCurve({ xB }).arrest?.durationS ?? 0;
		const atEutectic = durationAt(eutectic.xB);
		expect(atEutectic).toBeGreaterThan(durationAt(0.35));
		expect(durationAt(0.35)).toBeGreaterThan(durationAt(0.15));
		expect(atEutectic).toBeGreaterThan(durationAt(0.85));
	});

	it('the exact eutectic melt shows a single arrest and no earlier break', () => {
		const eutectic = biCdEutectic();
		const curve = simulateCoolingCurve({ xB: eutectic.xB });
		expect(curve.liquidusBreakC).toBeNull();
		expect(curve.arrest!.temperatureC).toBeCloseTo(eutectic.temperatureC, 6);
	});
});

describe('the ideal solid-solution lens (Cu–Ni)', () => {
	it('closes at both pure melting points', () => {
		const atCu = lensCompositions(COPPER.meltingPointK);
		expect(atCu.liquidXA).toBeCloseTo(1, 9);
		expect(atCu.solidXA).toBeCloseTo(1, 9);
		const atNi = lensCompositions(NICKEL.meltingPointK);
		expect(atNi.liquidXA).toBeCloseTo(0, 9);
		expect(atNi.solidXA).toBeCloseTo(0, 9);
	});

	it('keeps the liquid richer in the lower-melting component between the ends', () => {
		for (const t of [1400, 1500, 1600, 1700]) {
			const { liquidXA, solidXA } = lensCompositions(t);
			expect(liquidXA).toBeGreaterThan(solidXA);
			expect(liquidXA).toBeGreaterThan(0);
			expect(liquidXA).toBeLessThan(1);
		}
	});
});
