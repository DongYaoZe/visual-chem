import { describe, expect, it } from 'vitest';
import pythonReference from './fixtures/ethanol-water-python.json';
import {
	ATM_BAR,
	ETHANOL_WATER,
	antoineTemperatureC,
	bubblePointAt,
	buildTxyCurve,
	dewPointAt,
	findAzeotrope,
	flashAt,
	margules3ActivityCoefficients,
	simpleDistillationStages
} from './ethanol-water';

describe('ethanol-water educational VLE model', () => {
	it('reproduces pure-component normal boiling points', () => {
		expect(antoineTemperatureC(ATM_BAR, ETHANOL_WATER.componentA.antoine)).toBeCloseTo(78.32, 2);
		expect(antoineTemperatureC(ATM_BAR, ETHANOL_WATER.componentB.antoine)).toBeCloseTo(100.0, 2);
	});

	it('keeps pure components at unit activity coefficient', () => {
		expect(margules3ActivityCoefficients(1)[0]).toBeCloseTo(1, 12);
		expect(margules3ActivityCoefficients(0)[1]).toBeCloseTo(1, 12);
	});

	it('reproduces the calibrated atmospheric azeotrope', () => {
		const azeotrope = findAzeotrope();
		expect(azeotrope).not.toBeNull();
		expect(azeotrope?.x).toBeCloseTo(0.895, 3);
		expect(azeotrope?.massFractionA).toBeCloseTo(0.956, 3);
		expect(azeotrope?.temperatureC).toBeCloseTo(78.15, 2);
	});

	it('closes the modified Raoult-law pressure balance', () => {
		const point = bubblePointAt(0.25);
		expect(point.y).toBeGreaterThan(point.x);
		expect(point.temperatureC).toBeGreaterThan(78);
		expect(point.temperatureC).toBeLessThan(100);
	});

	it('builds both pure endpoints without numerical drift', () => {
		const curve = buildTxyCurve(ATM_BAR, 11);
		expect(curve).toHaveLength(11);
		expect(curve[0].x).toBe(0);
		expect(curve[0].y).toBe(0);
		expect(curve.at(-1)?.x).toBe(1);
		expect(curve.at(-1)?.y).toBe(1);
	});

	it('approaches but does not cross the azeotrope during repeated distillation', () => {
		const stages = simpleDistillationStages(0.1, 12);
		for (let index = 1; index < stages.length; index += 1) {
			expect(stages[index].x).toBeGreaterThanOrEqual(stages[index - 1].x - 1e-9);
			expect(stages[index].x).toBeLessThan(0.896);
		}
	});

	it('matches the independent SciPy reference across the full composition range', () => {
		for (const reference of pythonReference.points) {
			const point = bubblePointAt(reference.x);
			const [gammaEthanol, gammaWater] = margules3ActivityCoefficients(reference.x);
			expect(point.temperatureC).toBeCloseTo(reference.temperature_c, 7);
			expect(point.y).toBeCloseTo(reference.y, 7);
			expect(gammaEthanol).toBeCloseTo(reference.gamma_ethanol, 10);
			expect(gammaWater).toBeCloseTo(reference.gamma_water, 10);
		}
	});

	it('solves dew points directly rather than snapping to a plotting grid', () => {
		const dew = dewPointAt(0.4);
		expect(dew.y).toBeCloseTo(0.4, 7);
		expect(bubblePointAt(dew.x).temperatureC).toBeCloseTo(dew.temperatureC, 7);
	});

	it('returns a closed lever-rule balance inside the two-phase region', () => {
		const state = flashAt(0.4, 82);
		expect(state.region).toBe('two-phase');
		expect(state.liquidFraction + state.vaporFraction).toBeCloseTo(1, 10);
		expect(
			state.liquidFraction * state.liquidComposition + state.vaporFraction * state.vaporComposition
		).toBeCloseTo(0.4, 7);
	});
});
