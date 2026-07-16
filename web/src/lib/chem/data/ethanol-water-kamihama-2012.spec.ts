import { describe, expect, it } from 'vitest';
import { ATM_BAR, ETHANOL_WATER, bubblePointAt } from '../ethanol-water';
import { ETHANOL_WATER_KAMIHAMA_2012_VALIDATION } from './ethanol-water-kamihama-2012';
import { ETHANOL_WATER_LAI_2014 } from './ethanol-water-lai-2014';

function rms(values: number[]): number {
	return Math.sqrt(values.reduce((sum, value) => sum + value * value, 0) / values.length);
}

function interpolateIndependentDataAt(x: number): { temperatureK: number; y: number } {
	const points = ETHANOL_WATER_KAMIHAMA_2012_VALIDATION.points;
	const upperIndex = points.findIndex((point) => point.x >= x);
	if (upperIndex <= 0) {
		throw new Error(`Composition ${x} is outside the independent validation range.`);
	}
	const lower = points[upperIndex - 1];
	const upper = points[upperIndex];
	const fraction = (x - lower.x) / (upper.x - lower.x);
	return {
		temperatureK: lower.temperatureK + fraction * (upper.temperatureK - lower.temperatureK),
		y: lower.y + fraction * (upper.y - lower.y)
	};
}

describe('Kamihama 2012 independent NIST ThermoML validation dataset', () => {
	it('preserves the 21 joined rows, provenance, and pointwise uncertainties', () => {
		const { points, provenance } = ETHANOL_WATER_KAMIHAMA_2012_VALIDATION;
		expect(points).toHaveLength(21);
		expect(points[0]).toMatchObject({ x: 0.018, y: 0.18, temperatureK: 368.18 });
		expect(points.at(-1)).toMatchObject({ x: 0.972, y: 0.969, temperatureK: 351.35 });
		expect(points.every((point, index) => index === 0 || point.x > points[index - 1].x)).toBe(true);
		expect(
			points.every(
				(point) => point.temperatureUncertaintyK95 > 0 && point.vaporCompositionUncertainty95 > 0
			)
		).toBe(true);
		expect(provenance).toMatchObject({
			articleDoi: '10.1021/je2008704',
			temperatureDataSet: 4,
			vaporCompositionDataSet: 5,
			confidenceLevelPercent: 95,
			thermoMlEmbeddedMd5: '47789dd277cb1ba535ebafc0ac5a23ab',
			rawJsonSha256: '1a8a7a9238b3d127fb19c39bfe6e9701822e37e5b78d36f44fc4b14a48382a91'
		});
	});

	it('converts every source temperature from kelvin to degrees Celsius', () => {
		for (const point of ETHANOL_WATER_KAMIHAMA_2012_VALIDATION.points) {
			expect(point.temperatureK - 273.15).toBeCloseTo(point.temperatureC, 10);
		}
	});

	it('reproduces cross-laboratory agreement by interpolating onto the Lai measurement grid', () => {
		const independentPoints = ETHANOL_WATER_KAMIHAMA_2012_VALIDATION.points;
		const comparisonPoints = ETHANOL_WATER_LAI_2014.points.filter(
			(point) => point.x >= independentPoints[0].x && point.x <= independentPoints.at(-1)!.x
		);
		expect(comparisonPoints).toHaveLength(13);
		const residuals = comparisonPoints.map((lai) => {
			const independent = interpolateIndependentDataAt(lai.x);
			return {
				temperatureK: independent.temperatureK - lai.temperatureK,
				y: independent.y - lai.y
			};
		});

		expect(rms(residuals.map((residual) => residual.temperatureK))).toBeCloseTo(0.224396, 5);
		expect(rms(residuals.map((residual) => residual.y))).toBeCloseTo(0.0077243, 6);
	});

	it('quantifies the current teaching-model residuals on unseen laboratory data', () => {
		const residuals = ETHANOL_WATER_KAMIHAMA_2012_VALIDATION.points.map((experimental) => {
			const model = bubblePointAt(experimental.x, ATM_BAR, ETHANOL_WATER, 1);
			return {
				temperature: model.temperatureC - experimental.temperatureC,
				vaporComposition: model.y - experimental.y
			};
		});
		const temperatureRms = rms(residuals.map((residual) => residual.temperature));
		const vaporCompositionRms = rms(residuals.map((residual) => residual.vaporComposition));

		expect(temperatureRms).toBeCloseTo(0.777318, 5);
		expect(vaporCompositionRms).toBeCloseTo(0.0197836, 6);
	});
});
