import { describe, expect, it } from 'vitest';
import { ATM_BAR, ETHANOL_WATER, bubblePointAt } from '../ethanol-water';
import { ETHANOL_WATER_LAI_2014 } from './ethanol-water-lai-2014';

describe('Lai 2014 NIST ThermoML ethanol-water dataset', () => {
	it('preserves the 16 paired x-T-y rows in ascending composition order', () => {
		const { points } = ETHANOL_WATER_LAI_2014;
		expect(points).toHaveLength(16);
		expect(points[0]).toMatchObject({ x: 0, y: 0, temperatureK: 373.15 });
		expect(points.at(-1)).toMatchObject({ x: 1, y: 1, temperatureK: 351.45 });
		expect(points.every((point, index) => index === 0 || point.x > points[index - 1].x)).toBe(true);
		for (const point of points) {
			expect(point.temperatureK - 273.15).toBeCloseTo(point.temperatureC, 10);
		}
	});

	it('keeps the independently reported azeotrope and its uncertainty', () => {
		const { azeotrope } = ETHANOL_WATER_LAI_2014;
		expect(azeotrope).toMatchObject({
			pressureKPa: 101.3,
			x: 0.891,
			y: 0.891,
			temperatureK: 351.32,
			compositionUncertainty95: 0.004,
			temperatureUncertaintyK95: 0.23
		});
		expect(azeotrope.massFractionEthanol).toBeCloseTo(0.9543446629, 10);
	});

	it('quantifies rather than hides the teaching model residuals', () => {
		const residuals = ETHANOL_WATER_LAI_2014.points.map((experimental) => {
			const model = bubblePointAt(experimental.x, ATM_BAR, ETHANOL_WATER, 1);
			return {
				temperature: model.temperatureC - experimental.temperatureC,
				vaporComposition: model.y - experimental.y
			};
		});
		const rms = (values: number[]) =>
			Math.sqrt(values.reduce((sum, value) => sum + value * value, 0) / values.length);

		expect(rms(residuals.map((value) => value.temperature))).toBeGreaterThan(0.5);
		expect(rms(residuals.map((value) => value.temperature))).toBeLessThan(0.65);
		expect(rms(residuals.map((value) => value.vaporComposition))).toBeGreaterThan(0.015);
		expect(rms(residuals.map((value) => value.vaporComposition))).toBeLessThan(0.018);
	});
});
