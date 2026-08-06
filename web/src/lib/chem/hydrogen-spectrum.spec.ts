import { describe, expect, it } from 'vitest';
import {
	hydrogenEnergyEv,
	hydrogenSeriesLines,
	hydrogenSeriesLimitNm,
	hydrogenSpectrumFrame,
	hydrogenTransition,
	hydrogenWavelengthNm,
	isVisibleWavelength,
	photonEnergyEv,
	visibleBalmerLines
} from './hydrogen-spectrum';

describe('hydrogen spectrum', () => {
	it('reproduces the four prominent Balmer wavelengths from the Rydberg equation', () => {
		const wavelengths = visibleBalmerLines().map((line) => line.wavelengthNm);
		expect(wavelengths[0]).toBeCloseTo(656.47, 1);
		expect(wavelengths[1]).toBeCloseTo(486.27, 1);
		expect(wavelengths[2]).toBeCloseTo(434.17, 1);
		expect(wavelengths[3]).toBeCloseTo(410.29, 1);
	});

	it('keeps the energy-level gap and photon energy consistent', () => {
		const line = hydrogenTransition(3, 2);
		const gap = hydrogenEnergyEv(3) - hydrogenEnergyEv(2);
		expect(line.photonEnergyEv).toBeCloseTo(gap, 10);
		expect(photonEnergyEv(line.wavelengthNm)).toBeCloseTo(gap, 10);
	});

	it('resolves one complete frame for all three representations', () => {
		const frame = hydrogenSpectrumFrame(3, 2);
		expect(frame.energyGapEv).toBeCloseTo(frame.photonEnergyEv, 10);
		expect(frame.region).toBe('visible');
		expect(frame.isVisible).toBe(true);
		expect(frame.series).toBe('Balmer');
		expect(frame.displayColor).toBe('#e54b4b');
	});

	it('builds each family from the requested common lower level', () => {
		const lyman = hydrogenSeriesLines(1, 4);
		expect(lyman.map((line) => [line.upperN, line.lowerN])).toEqual([
			[2, 1],
			[3, 1],
			[4, 1]
		]);
		expect(lyman.every((line) => line.series === 'Lyman')).toBe(true);
	});

	it('converges the Balmer series on the reduced-mass vacuum limit', () => {
		expect(hydrogenSeriesLimitNm(2)).toBeCloseTo(364.71, 2);
	});

	it('separates ultraviolet, visible Balmer, and infrared transitions', () => {
		expect(isVisibleWavelength(hydrogenWavelengthNm(2, 1))).toBe(false);
		expect(isVisibleWavelength(hydrogenWavelengthNm(3, 2))).toBe(true);
		expect(isVisibleWavelength(hydrogenWavelengthNm(4, 3))).toBe(false);
		expect(hydrogenTransition(2, 1).series).toBe('Lyman');
		expect(hydrogenTransition(3, 2).series).toBe('Balmer');
		expect(hydrogenTransition(4, 3).series).toBe('Paschen');
	});

	it('rejects impossible emission transitions', () => {
		expect(() => hydrogenWavelengthNm(2, 2)).toThrow(/upperN > lowerN/);
		expect(() => hydrogenEnergyEv(0)).toThrow(/positive integer/);
	});
});
