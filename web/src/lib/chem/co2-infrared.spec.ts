import { describe, expect, it } from 'vitest';
import { allCO2Modes, co2InfraredFrame, co2Mode, co2ModeFromIndex } from './co2-infrared';

describe('CO2 infrared teaching model', () => {
	it('keeps the three fundamental mode anchors', () => {
		expect(allCO2Modes().map((mode) => mode.wavenumberCm)).toEqual([1333, 667, 2349]);
		expect(co2Mode('bend').degeneracy).toBe(2);
		expect(co2Mode('symmetric-stretch').irActive).toBe(false);
		expect(co2Mode('asymmetric-stretch').irActive).toBe(true);
	});

	it('derives wavelength and photon energy from wavenumber', () => {
		const mode = co2Mode('asymmetric-stretch');
		expect(mode.wavelengthUm).toBeCloseTo(4.257, 2);
		expect(mode.photonEnergyEv).toBeCloseTo(0.291, 2);
	});

	it('shares one complete frame with the visual amplitude', () => {
		const frame = co2InfraredFrame('bend', 0.4);
		expect(frame.id).toBe('bend');
		expect(frame.normalizedPosition).toBe(0.4);
		expect(frame.wavelengthUm).toBeCloseTo(14.99, 1);
	});

	it('rejects invalid controls and maps the three modes deterministically', () => {
		expect(co2ModeFromIndex(0)).toBe('symmetric-stretch');
		expect(co2ModeFromIndex(2)).toBe('asymmetric-stretch');
		expect(() => co2ModeFromIndex(3)).toThrow(/mode index/);
		expect(() => co2InfraredFrame('bend', 1.1)).toThrow(/amplitude/);
	});
});
