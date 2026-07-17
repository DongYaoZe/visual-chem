import { describe, expect, it } from 'vitest';
import { waterFrame } from './water-frame';

describe('waterFrame', () => {
	it('marks sea-level 100 °C water as boiling and 99 °C as not', () => {
		expect(waterFrame({ temperatureC: 100, pressurePa: 101325 }).boiling).toBe(true);
		expect(waterFrame({ temperatureC: 99, pressurePa: 101325 }).boiling).toBe(false);
	});

	it('reads the boiling point from the pressure alone', () => {
		const lhasa = waterFrame({ temperatureC: 20, pressurePa: 64000 });
		expect(lhasa.boilingPointC).toBeGreaterThan(86);
		expect(lhasa.boilingPointC).toBeLessThan(89);
		expect(lhasa.phase).toBe('liquid');
	});

	it('never calls ice or supercritical water boiling', () => {
		expect(waterFrame({ temperatureC: -10, pressurePa: 101325 }).boiling).toBe(false);
		const supercritical = waterFrame({ temperatureC: 380, pressurePa: 23e6 });
		expect(supercritical.phase).toBe('supercritical');
		expect(supercritical.boiling).toBe(false);
	});

	it('returns null readouts outside each equation span instead of throwing', () => {
		const cold = waterFrame({ temperatureC: -30, pressurePa: 30 });
		expect(cold.saturationPressurePa).toBeNull();
		expect(cold.vaporizationEnthalpyKJPerMol).toBeNull();
		expect(cold.phase).toBe('vapor');
		const vacuum = waterFrame({ temperatureC: 25, pressurePa: 100 });
		expect(vacuum.boilingPointC).toBeNull();
		expect(vacuum.phase).toBe('vapor');
	});

	it('returns the identical frame for identical inputs', () => {
		expect(waterFrame({ temperatureC: 25, pressurePa: 101325 })).toBe(
			waterFrame({ temperatureC: 25, pressurePa: 101325 })
		);
	});
});
