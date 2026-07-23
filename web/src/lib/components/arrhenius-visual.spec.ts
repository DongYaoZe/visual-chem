import { describe, expect, it } from 'vitest';
import { tailFraction } from '$lib/chem';
import { logCompressedTailCount } from './arrhenius-visual';

describe('logCompressedTailCount', () => {
	it('makes fixed-temperature barrier changes visible without changing the real tail', () => {
		const temperatureK = 298.15;
		const total = 18;
		const lowBarrierTail = tailFraction(20, temperatureK);
		const highBarrierTail = tailFraction(120, temperatureK);
		const lowBarrierCount = logCompressedTailCount(lowBarrierTail, total);
		const highBarrierCount = logCompressedTailCount(highBarrierTail, total);

		expect(lowBarrierTail).toBeGreaterThan(highBarrierTail);
		expect(lowBarrierCount).toBe(17);
		expect(highBarrierCount).toBe(2);
		expect(lowBarrierCount).toBeGreaterThan(highBarrierCount);
	});

	it('is monotonic, bounded, and deterministic across the display range', () => {
		const shares = [1e-30, 1e-24, 1e-16, 1e-8, 1e-2, 1];
		const counts = shares.map((share) => logCompressedTailCount(share, 18));
		expect(counts).toEqual([...counts].sort((left, right) => left - right));
		expect(counts[0]).toBe(0);
		expect(counts.at(-1)).toBe(18);
		expect(logCompressedTailCount(1e-9, 18)).toBe(logCompressedTailCount(1e-9, 18));
	});

	it('rejects invalid inputs instead of silently inventing a signal', () => {
		expect(() => logCompressedTailCount(0, 18)).toThrow(/tailShare/);
		expect(() => logCompressedTailCount(1e-9, 0)).toThrow(/total/);
		expect(() => logCompressedTailCount(1e-9, 18, -2, -24)).toThrow(/maxExponent/);
	});
});
