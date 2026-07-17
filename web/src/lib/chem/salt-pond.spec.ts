import { describe, expect, it } from 'vitest';
import { CARROLL_2005_BRINES } from './data/carroll-2005-kno3-nano3';
import { REINDERS_1915_POINTS } from './data/reinders-1915-kno3-nano3';
import {
	CALIBRATION_EUTONICS,
	KNO3_SOLUBILITY_TABLE,
	NANO3_SOLUBILITY_TABLE
} from './data/salt-solubility';
import {
	eutonicMolalities,
	harvestSolids,
	kno3Ksp,
	kno3SaturatedMolality,
	kno3SolubilityGPer100g,
	massesToComposition,
	nano3SaturatedMolality,
	nano3SolubilityGPer100g,
	saltingBeta,
	saltIsotherm,
	solveSaltEquilibrium,
	ternaryToXY,
	type SaltPotState
} from './salt-pond';

const conserves = (state: SaltPotState, interactionScale = 1) => {
	const split = solveSaltEquilibrium(state, interactionScale);
	expect(split.liquid.kno3G + split.solids.kno3G).toBeCloseTo(state.kno3G, 9);
	expect(split.liquid.nano3G + split.solids.nano3G).toBeCloseTo(state.nano3G, 9);
	expect(split.liquid.waterG).toBeCloseTo(state.waterG, 9);
	return split;
};

describe('binary solubility curves', () => {
	it('reproduce every tabulated anchor exactly, both salts', () => {
		for (const [temperatureC, gPer100g] of KNO3_SOLUBILITY_TABLE) {
			expect(kno3SolubilityGPer100g(temperatureC)).toBeCloseTo(gPer100g, 9);
		}
		for (const [temperatureC, gPer100g] of NANO3_SOLUBILITY_TABLE) {
			expect(nano3SolubilityGPer100g(temperatureC)).toBeCloseTo(gPer100g, 9);
		}
	});

	it('are strictly increasing in temperature', () => {
		let previousK = kno3SolubilityGPer100g(0);
		let previousN = nano3SolubilityGPer100g(0);
		for (let t = 1; t <= 100; t += 1) {
			const k = kno3SolubilityGPer100g(t);
			const n = nano3SolubilityGPer100g(t);
			expect(k).toBeGreaterThan(previousK);
			expect(n).toBeGreaterThan(previousN);
			previousK = k;
			previousN = n;
		}
	});

	it('refuse temperatures outside the tabulated range', () => {
		expect(() => kno3Ksp(-1)).toThrow(/outside/);
		expect(() => kno3Ksp(101)).toThrow(/outside/);
	});
});

describe('common-ion coupling', () => {
	it('depresses each solubility in the ideal model', () => {
		expect(kno3SaturatedMolality(25, 5, 0)).toBeLessThan(kno3SaturatedMolality(25, 0, 0));
		expect(nano3SaturatedMolality(25, 3, 0)).toBeLessThan(nano3SaturatedMolality(25, 0, 0));
	});

	it('calibration salting terms are positive (real mixtures dissolve more than ideal)', () => {
		for (const { temperatureC } of CALIBRATION_EUTONICS) {
			expect(saltingBeta(temperatureC).kno3).toBeGreaterThan(0);
			expect(saltingBeta(temperatureC).nano3).toBeGreaterThan(0);
		}
	});
});

describe('eutonic point', () => {
	it('satisfies both saturation equations, ideal and calibrated', () => {
		for (const scale of [0, 1]) {
			for (const temperatureC of [10, 25, 60, 100]) {
				const { kno3MolPerKg, nano3MolPerKg } = eutonicMolalities(temperatureC, scale);
				expect(kno3SaturatedMolality(temperatureC, nano3MolPerKg, scale)).toBeCloseTo(
					kno3MolPerKg,
					8
				);
				expect(nano3SaturatedMolality(temperatureC, kno3MolPerKg, scale)).toBeCloseTo(
					nano3MolPerKg,
					8
				);
			}
		}
	});

	it('reproduces every measured calibration eutonic when fully calibrated', () => {
		for (const anchor of CALIBRATION_EUTONICS) {
			const eutonic = eutonicMolalities(anchor.temperatureC, 1);
			expect(eutonic.kno3MolPerKg).toBeCloseTo(anchor.kno3MolPerKg, 6);
			expect(eutonic.nano3MolPerKg).toBeCloseTo(anchor.nano3MolPerKg, 6);
		}
	});
});

describe('solveSaltEquilibrium', () => {
	it('classifies the easy pots and conserves mass in every region', () => {
		expect(conserves({ temperatureC: 25, waterG: 100, kno3G: 5, nano3G: 5 }).region).toBe(
			'unsaturated'
		);
		expect(conserves({ temperatureC: 25, waterG: 100, kno3G: 80, nano3G: 5 }).region).toBe('kno3');
		expect(conserves({ temperatureC: 25, waterG: 100, kno3G: 5, nano3G: 150 }).region).toBe(
			'nano3'
		);
		expect(conserves({ temperatureC: 25, waterG: 20, kno3G: 80, nano3G: 80 }).region).toBe('both');
		const dry = solveSaltEquilibrium({ temperatureC: 25, waterG: 0, kno3G: 3, nano3G: 4 });
		expect(dry.region).toBe('dry');
		expect(dry.solids).toEqual({ kno3G: 3, nano3G: 4 });
	});

	it('crystals never appear while the liquid is below saturation', () => {
		const split = conserves({ temperatureC: 60, waterG: 100, kno3G: 100, nano3G: 100 });
		expect(split.region).toBe('unsaturated');
		expect(split.solids.kno3G).toBe(0);
		expect(split.solids.nano3G).toBe(0);
	});

	it('in the doubly saturated cone the liquid sits at the eutonic', () => {
		const scale = 1;
		const split = conserves({ temperatureC: 25, waterG: 50, kno3G: 90, nano3G: 90 }, scale);
		expect(split.region).toBe('both');
		const eutonic = eutonicMolalities(25, scale);
		expect(split.liquid.kno3G).toBeCloseTo(eutonic.kno3MolPerKg * 0.05 * 101.103, 6);
		expect(split.liquid.nano3G).toBeCloseTo(eutonic.nano3MolPerKg * 0.05 * 84.995, 6);
	});
});

describe('the classic split route (100 g KNO3 + 100 g NaNO3 + 100 g water)', () => {
	const hot: SaltPotState = { temperatureC: 100, waterG: 100, kno3G: 100, nano3G: 100 };
	const cold: SaltPotState = { ...hot, temperatureC: 25 };

	it('fully dissolves at 100 °C in both models', () => {
		expect(solveSaltEquilibrium(hot, 0).region).toBe('unsaturated');
		expect(solveSaltEquilibrium(hot, 1).region).toBe('unsaturated');
	});

	it('cooling to 25 °C drops pure KNO3 in the calibrated model', () => {
		const split = conserves(cold, 1);
		expect(split.region).toBe('kno3');
		expect(split.solids.nano3G).toBe(0);
		// Golden yield for the classic recipe, from the calibrated 25 °C anchor.
		expect(split.solids.kno3G).toBeCloseTo(54.4, 0);
	});

	it('the ideal model wrongly convicts the same pot of mixed crystals', () => {
		const split = conserves(cold, 0);
		expect(split.region).toBe('both');
		expect(split.solids.nano3G).toBeGreaterThan(0);
	});

	it('filtering then evaporating hot water drops NaNO3 next (calibrated)', () => {
		const { state: motherLiquor, harvestedKno3G, harvestedNano3G } = harvestSolids(cold, 1);
		expect(harvestedNano3G).toBe(0);
		expect(harvestedKno3G).toBeGreaterThan(30);
		const reheated = { ...motherLiquor, temperatureC: 100 };
		const evaporated = { ...reheated, waterG: reheated.waterG - 80 };
		const second = conserves(evaporated, 1);
		expect(second.region).toBe('nano3');
		expect(second.solids.kno3G).toBe(0);
		expect(second.solids.nano3G).toBeCloseTo(61.6, 0);
	});
});

describe('harvestSolids', () => {
	it('moves the pot to the mother liquor and hands over the crystals', () => {
		const state: SaltPotState = { temperatureC: 25, waterG: 100, kno3G: 80, nano3G: 40 };
		const { state: after, harvestedKno3G, harvestedNano3G } = harvestSolids(state, 1);
		expect(after.waterG).toBeCloseTo(100, 9);
		expect(harvestedKno3G + after.kno3G).toBeCloseTo(80, 9);
		expect(harvestedNano3G + after.nano3G).toBeCloseTo(40, 9);
		const recheck = solveSaltEquilibrium(after, 1);
		expect(recheck.solids.kno3G).toBeCloseTo(0, 6);
		expect(recheck.solids.nano3G).toBeCloseTo(0, 6);
	});
});

describe('ternary geometry', () => {
	it('maps the three vertices to the unit triangle corners', () => {
		expect(ternaryToXY({ waterFrac: 1, kno3Frac: 0, nano3Frac: 0 })).toEqual({
			x: 0.5,
			y: Math.sqrt(3) / 2
		});
		expect(ternaryToXY({ waterFrac: 0, kno3Frac: 1, nano3Frac: 0 })).toEqual({ x: 0, y: 0 });
		expect(ternaryToXY({ waterFrac: 0, kno3Frac: 0, nano3Frac: 1 })).toEqual({ x: 1, y: 0 });
	});

	it('evaporation walks the pot along the ray away from the water vertex', () => {
		const before = massesToComposition({ waterG: 100, kno3G: 30, nano3G: 50 });
		const after = massesToComposition({ waterG: 60, kno3G: 30, nano3G: 50 });
		const apex = ternaryToXY({ waterFrac: 1, kno3Frac: 0, nano3Frac: 0 });
		const b = ternaryToXY(before);
		const a = ternaryToXY(after);
		const cross = (b.x - apex.x) * (a.y - apex.y) - (b.y - apex.y) * (a.x - apex.x);
		expect(Math.abs(cross)).toBeLessThan(1e-12);
		// And it moves away from the apex, not toward it.
		const distanceBefore = Math.hypot(b.x - apex.x, b.y - apex.y);
		const distanceAfter = Math.hypot(a.x - apex.x, a.y - apex.y);
		expect(distanceAfter).toBeGreaterThan(distanceBefore);
	});
});

describe('validation against measured isotherms', () => {
	const KNO3_M = 101.103;
	const NANO3_M = 84.995;

	it('reproduces the Reinders 1915 NaNO3 branch within 2 % and the KNO3 branch within 11 %', () => {
		// The measured KNO3 branch dips (common ion) before it rises
		// (salting-in); the one-parameter calibration reproduces only the net
		// rise, so mid-branch errors reach ~10 % — quantified, not hidden.
		const errors: number[] = [];
		for (const point of REINDERS_1915_POINTS) {
			if (point.branch === 'eutonic') continue;
			const mK = (point.kno3GPer100gWater * 10) / KNO3_M;
			const mN = (point.nano3GPer100gWater * 10) / NANO3_M;
			if (point.branch === 'kno3') {
				const relative = kno3SaturatedMolality(25, mN, 1) / mK - 1;
				expect(Math.abs(relative)).toBeLessThan(0.11);
				errors.push(relative);
			} else {
				const relative = nano3SaturatedMolality(25, mK, 1) / mN - 1;
				expect(Math.abs(relative)).toBeLessThan(0.02);
				errors.push(relative);
			}
		}
		const rms = Math.sqrt(errors.reduce((sum, e) => sum + e * e, 0) / errors.length);
		expect(rms).toBeLessThan(0.07);
	});

	it('stays within 15 % of every single-solid Carroll 2005 brine at 90 °C', () => {
		const errors: number[] = [];
		for (const brine of CARROLL_2005_BRINES) {
			if (brine.branch === 'eutonic-bracket') continue;
			if (brine.branch === 'kno3') {
				const relative = kno3SaturatedMolality(90, brine.naMolPerKg, 1) / brine.kMolPerKg - 1;
				expect(Math.abs(relative)).toBeLessThan(0.15);
				errors.push(relative);
			} else {
				const relative = nano3SaturatedMolality(90, brine.kMolPerKg, 1) / brine.naMolPerKg - 1;
				expect(Math.abs(relative)).toBeLessThan(0.15);
				errors.push(relative);
			}
		}
		const rms = Math.sqrt(errors.reduce((sum, e) => sum + e * e, 0) / errors.length);
		// Measured RMS ≈ 9.3 % across the 13 single-solid brines. For scale:
		// the YMP Pitzer database missed the same eutonic by ~2x (Carroll 2005).
		expect(rms).toBeLessThan(0.1);
	});

	it('cooling the classic pot one step past 25 °C crosses into the two-salt valley', () => {
		const pot = { waterG: 100, kno3G: 100, nano3G: 100 };
		expect(solveSaltEquilibrium({ ...pot, temperatureC: 25 }, 1).region).toBe('kno3');
		expect(solveSaltEquilibrium({ ...pot, temperatureC: 20 }, 1).region).toBe('both');
	});
});

describe('saltIsotherm', () => {
	it('branches start at the binary saturation points and meet at the eutonic', () => {
		const isotherm = saltIsotherm(25, 1, 24);
		const first = isotherm.kno3Branch[0];
		expect(first.nano3Frac).toBeCloseTo(0, 12);
		// Binary end of the KNO3 branch is the pure-KNO3 solubility.
		expect((first.kno3Frac / first.waterFrac) * 100).toBeCloseTo(kno3SolubilityGPer100g(25), 6);
		const lastK = isotherm.kno3Branch[isotherm.kno3Branch.length - 1];
		const lastN = isotherm.nano3Branch[isotherm.nano3Branch.length - 1];
		expect(lastK.kno3Frac).toBeCloseTo(isotherm.eutonic.kno3Frac, 9);
		expect(lastN.nano3Frac).toBeCloseTo(isotherm.eutonic.nano3Frac, 9);
		for (const point of [...isotherm.kno3Branch, ...isotherm.nano3Branch]) {
			expect(point.waterFrac + point.kno3Frac + point.nano3Frac).toBeCloseTo(1, 12);
		}
	});
});
