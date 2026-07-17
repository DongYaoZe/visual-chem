import { describe, expect, it } from 'vitest';
import { monotoneCubic } from './monotone-cubic';

describe('monotoneCubic', () => {
	const anchors: readonly (readonly [number, number])[] = [
		[0, 13.3],
		[10, 20.9],
		[20, 31.6],
		[30, 45.8],
		[40, 63.9]
	];

	it('passes through every anchor exactly', () => {
		const f = monotoneCubic(anchors);
		for (const [x, y] of anchors) {
			expect(f(x)).toBeCloseTo(y, 12);
		}
	});

	it('stays monotone and bounded between anchors of monotone data', () => {
		const f = monotoneCubic(anchors);
		let previous = f(0);
		for (let i = 1; i <= 400; i += 1) {
			const x = (40 * i) / 400;
			const value = f(x);
			expect(value).toBeGreaterThanOrEqual(previous - 1e-12);
			previous = value;
		}
		// No overshoot: values inside a segment stay inside the segment's y-range.
		for (let segment = 0; segment < anchors.length - 1; segment += 1) {
			const [x0, y0] = anchors[segment];
			const [x1, y1] = anchors[segment + 1];
			for (let i = 1; i < 20; i += 1) {
				const value = f(x0 + ((x1 - x0) * i) / 20);
				expect(value).toBeGreaterThanOrEqual(Math.min(y0, y1));
				expect(value).toBeLessThanOrEqual(Math.max(y0, y1));
			}
		}
	});

	it('reproduces a straight line exactly', () => {
		const f = monotoneCubic([
			[1, 2],
			[3, 6],
			[7, 14]
		]);
		expect(f(2)).toBeCloseTo(4, 12);
		expect(f(5)).toBeCloseTo(10, 12);
	});

	it('is continuous across segment boundaries', () => {
		const f = monotoneCubic(anchors);
		for (const [x] of anchors.slice(1, -1)) {
			expect(f(x - 1e-9)).toBeCloseTo(f(x + 1e-9), 6);
		}
	});

	it('throws outside the anchor domain and on bad input', () => {
		const f = monotoneCubic(anchors);
		expect(() => f(-0.001)).toThrow(/outside/);
		expect(() => f(40.001)).toThrow(/outside/);
		expect(() => monotoneCubic([[0, 1]])).toThrow(/at least two/);
		expect(() =>
			monotoneCubic([
				[0, 1],
				[0, 2]
			])
		).toThrow(/strictly increasing/);
	});
});
