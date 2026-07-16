import { describe, expect, it } from 'vitest';
import { mixtureColor } from './color';

function channels(color: string): [number, number, number] {
	const match = color.match(/^rgb\((\d+),(\d+),(\d+)\)$/);
	if (!match) throw new Error(`Unexpected color format: ${color}`);
	return [Number(match[1]), Number(match[2]), Number(match[3])];
}

describe('mixtureColor', () => {
	it('returns the brand endpoints at pure compositions', () => {
		// OKLCH round-trip may shift a channel by one 8-bit step.
		const water = channels(mixtureColor(0));
		const ethanol = channels(mixtureColor(1));
		expect(water.map((c, i) => Math.abs(c - [32, 127, 140][i]))).toEqual([0, 0, 0]);
		expect(ethanol.map((c, i) => Math.abs(c - [214, 107, 50][i]))).toEqual([0, 0, 0]);
	});

	it('clamps out-of-range compositions', () => {
		expect(mixtureColor(-0.4)).toBe(mixtureColor(0));
		expect(mixtureColor(1.7)).toBe(mixtureColor(1));
	});

	it('stays saturated at mid composition instead of collapsing to gray', () => {
		const [red, green, blue] = channels(mixtureColor(0.5));
		const spread = Math.max(red, green, blue) - Math.min(red, green, blue);
		// The old sRGB lerp gave rgb(123,117,95): spread 28, i.e. muddy gray.
		expect(spread).toBeGreaterThan(60);
	});

	it('sweeps smoothly through distinct colors', () => {
		const samples = Array.from({ length: 21 }, (_, i) => channels(mixtureColor(i / 20)));
		expect(new Set(samples.map((c) => c.join(','))).size).toBe(samples.length);
		for (let i = 1; i < samples.length; i += 1) {
			const step = Math.hypot(
				samples[i][0] - samples[i - 1][0],
				samples[i][1] - samples[i - 1][1],
				samples[i][2] - samples[i - 1][2]
			);
			// A 5% composition change should never jump more than a modest step.
			expect(step, `step ${i}`).toBeLessThan(40);
		}
	});
});
