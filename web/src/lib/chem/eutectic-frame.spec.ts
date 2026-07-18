import { describe, expect, it } from 'vitest';
import { biCdEutectic } from './eutectic';
import { eutecticFrame, memoizedCoolingCurve, temperatureAtTime } from './eutectic-frame';

describe('eutecticFrame', () => {
	it('resolves the split, liquidus, and curve for one melt state', () => {
		const frame = eutecticFrame({ xCd: 0.3, temperatureC: 170 });
		expect(frame.region).toBe('liquid+A');
		expect(frame.liquidusC).toBeGreaterThan(170);
		expect(frame.eutectic.xB).toBeCloseTo(biCdEutectic().xB, 12);
		expect(frame.curve.liquidusBreakC).toBeCloseTo(frame.liquidusC, 6);
		expect(frame.massFractionCd).toBeGreaterThan(0.18);
		expect(frame.massFractionCd).toBeLessThan(0.2);
	});

	it('returns the identical object for the identical input (memoized)', () => {
		const a = eutecticFrame({ xCd: 0.4, temperatureC: 200 });
		const b = eutecticFrame({ xCd: 0.4, temperatureC: 200 });
		expect(b).toBe(a);
	});

	it('shares one cooling curve across temperatures of the same melt', () => {
		const a = eutecticFrame({ xCd: 0.25, temperatureC: 300 });
		const b = eutecticFrame({ xCd: 0.25, temperatureC: 150 });
		expect(b.curve).toBe(a.curve);
		expect(b).not.toBe(a);
	});

	it('reads the curve back by time, clamped at both ends', () => {
		const curve = memoizedCoolingCurve(0.3);
		const first = curve.points[0];
		const last = curve.points[curve.points.length - 1];
		expect(temperatureAtTime(curve, -5)).toBe(first.temperatureC);
		expect(temperatureAtTime(curve, last.timeS + 100)).toBe(last.temperatureC);
		// Midway lookup sits between neighbouring samples.
		const mid = temperatureAtTime(curve, 100.5);
		expect(mid).toBeLessThanOrEqual(temperatureAtTime(curve, 100));
		expect(mid).toBeGreaterThanOrEqual(temperatureAtTime(curve, 101));
	});
});
