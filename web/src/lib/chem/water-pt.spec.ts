import { describe, expect, it } from 'vitest';
import {
	WATER_CRITICAL_POINT,
	WATER_TRIPLE_POINT,
	boilingPointAtAltitudeC,
	buildBoilingCurve,
	buildMeltingCurve,
	buildSublimationCurve,
	classifyWaterPhase,
	meltingPressurePa,
	pressureAtAltitudePa,
	saturationPressurePa,
	saturationTemperatureK,
	sublimationPressurePa,
	vaporizationEnthalpyKJPerMol
} from './water-pt';

describe('IF97 saturation equations', () => {
	// Official computer-program verification values, IF97 Tables 35 and 36.
	it('reproduces the IAPWS-IF97 Table 35 saturation pressures', () => {
		expect(saturationPressurePa(300) / 1e6).toBeCloseTo(0.353658941e-2, 10);
		expect(saturationPressurePa(500) / 1e6).toBeCloseTo(0.263889776e1, 7);
		expect(saturationPressurePa(600) / 1e6).toBeCloseTo(0.123443146e2, 6);
	});

	it('reproduces the IAPWS-IF97 Table 36 saturation temperatures', () => {
		expect(saturationTemperatureK(0.1e6)).toBeCloseTo(372.755919, 5);
		expect(saturationTemperatureK(1e6)).toBeCloseTo(453.035632, 5);
		expect(saturationTemperatureK(10e6)).toBeCloseTo(584.149488, 5);
	});

	it('boils at 100 °C under one standard atmosphere', () => {
		expect(saturationTemperatureK(101325) - 273.15).toBeCloseTo(100, 1);
	});

	it('hits the critical point exactly', () => {
		expect(saturationPressurePa(WATER_CRITICAL_POINT.temperatureK)).toBeCloseTo(
			WATER_CRITICAL_POINT.pressurePa,
			-1
		);
	});

	it('is analytically self-consistent in both directions', () => {
		for (const temperatureK of [280, 310, 373.15, 450, 550, 640]) {
			expect(saturationTemperatureK(saturationPressurePa(temperatureK))).toBeCloseTo(
				temperatureK,
				6
			);
		}
	});

	it('rejects states outside the saturation line', () => {
		expect(() => saturationPressurePa(200)).toThrow(/outside/);
		expect(() => saturationTemperatureK(23e6)).toThrow(/outside/);
	});
});

describe('ice Ih boundaries (IAPWS R14-08(2011))', () => {
	it('reproduces the official melting verification value at 260 K', () => {
		expect(meltingPressurePa(260) / 1e6).toBeCloseTo(138.268, 2);
	});

	it('reproduces the official sublimation verification value at 230 K', () => {
		expect(sublimationPressurePa(230)).toBeCloseTo(8.94735, 4);
	});

	it('both boundaries meet the vapor line at the triple point', () => {
		expect(meltingPressurePa(WATER_TRIPLE_POINT.temperatureK)).toBeCloseTo(
			WATER_TRIPLE_POINT.pressurePa,
			6
		);
		expect(sublimationPressurePa(WATER_TRIPLE_POINT.temperatureK)).toBeCloseTo(
			WATER_TRIPLE_POINT.pressurePa,
			6
		);
	});

	it('melting line slopes backward: colder ice needs more pressure to melt', () => {
		expect(meltingPressurePa(272)).toBeGreaterThan(meltingPressurePa(273));
		expect(meltingPressurePa(255)).toBeGreaterThan(meltingPressurePa(260));
	});

	it('ordinary ice melts at 0 °C under one atmosphere', () => {
		// The melting curve must cross 101.325 kPa within a hundredth of a
		// degree of 273.15 K — that is how the Celsius scale was anchored.
		let lower = 273.1;
		let upper = 273.16;
		for (let iteration = 0; iteration < 60; iteration += 1) {
			const middle = (lower + upper) / 2;
			if (meltingPressurePa(middle) > 101325) lower = middle;
			else upper = middle;
		}
		expect(lower - 273.15).toBeCloseTo(0, 2);
	});
});

describe('Clausius–Clapeyron readout', () => {
	it('recovers the enthalpy of vaporization within the approximation it teaches', () => {
		// The true value at 100 °C is 40.66 kJ/mol; Clausius–Clapeyron reads
		// ~1.5% high there because steam is not quite an ideal gas. At 25 °C
		// the vapor is nearly ideal and the textbook 43.99 comes back.
		expect(Math.abs(vaporizationEnthalpyKJPerMol(373.15) - 41.3)).toBeLessThan(0.15);
		expect(Math.abs(vaporizationEnthalpyKJPerMol(298.15) - 43.99)).toBeLessThan(0.25);
	});
});

describe('altitude travel', () => {
	it('matches the standard atmosphere at its anchors', () => {
		expect(pressureAtAltitudePa(0)).toBeCloseTo(101325, 0);
		expect(pressureAtAltitudePa(5500) / 1000).toBeCloseTo(50.5, 0);
	});

	it('boils noodles badly on the plateau', () => {
		expect(boilingPointAtAltitudeC(0)).toBeCloseTo(100, 0);
		expect(boilingPointAtAltitudeC(3650)).toBeGreaterThan(86);
		expect(boilingPointAtAltitudeC(3650)).toBeLessThan(90);
		expect(boilingPointAtAltitudeC(8849)).toBeGreaterThan(69);
		expect(boilingPointAtAltitudeC(8849)).toBeLessThan(73);
	});
});

describe('phase classification', () => {
	it('places everyday states in their regions', () => {
		expect(classifyWaterPhase(298.15, 101325)).toBe('liquid');
		expect(classifyWaterPhase(398.15, 101325)).toBe('vapor');
		expect(classifyWaterPhase(263.15, 101325)).toBe('solid');
		expect(classifyWaterPhase(263.15, 100)).toBe('vapor');
		expect(classifyWaterPhase(700, 30e6)).toBe('supercritical');
	});

	it('pressure-melts cold ice across the backward wall', () => {
		// The ice Ih melting pressure at 261 K is 129.5 MPa.
		expect(classifyWaterPhase(261, 120e6)).toBe('solid');
		expect(classifyWaterPhase(261, 140e6)).toBe('liquid');
	});
});

describe('curve builders', () => {
	it('spans triple point to critical point monotonically', () => {
		const curve = buildBoilingCurve();
		expect(curve[0].temperatureK).toBe(WATER_TRIPLE_POINT.temperatureK);
		expect(curve.at(-1)?.temperatureK).toBe(WATER_CRITICAL_POINT.temperatureK);
		for (let index = 1; index < curve.length; index += 1) {
			expect(curve[index].pressurePa).toBeGreaterThan(curve[index - 1].pressurePa);
		}
	});

	it('sublimation stays below the triple-point pressure; melting above', () => {
		for (const point of buildSublimationCurve().slice(0, -1)) {
			expect(point.pressurePa).toBeLessThan(WATER_TRIPLE_POINT.pressurePa);
		}
		for (const point of buildMeltingCurve().slice(0, -1)) {
			expect(point.pressurePa).toBeGreaterThan(WATER_TRIPLE_POINT.pressurePa);
		}
	});
});
