/**
 * Monotone piecewise-cubic Hermite interpolation (Steffen 1990).
 *
 * Used to interpolate tabulated thermodynamic anchors (e.g. solubility tables
 * in van 't Hoff coordinates) with a curve that passes through every anchor
 * exactly, is C1-smooth, and never overshoots between anchors — so a monotone
 * data table always produces a monotone curve. Reference: M. Steffen,
 * "A simple method for monotonic interpolation in one dimension",
 * Astron. Astrophys. 239, 443–450 (1990).
 */

export interface MonotoneCubic {
	(x: number): number;
	readonly domain: readonly [number, number];
}

const sign = (value: number): number => (value > 0 ? 1 : value < 0 ? -1 : 0);

/**
 * Build a Steffen interpolant through `points`, which must be sorted by
 * strictly increasing x. Evaluating outside the anchor domain throws, because
 * every table this project interpolates has a physical validity range.
 */
export function monotoneCubic(points: readonly (readonly [number, number])[]): MonotoneCubic {
	if (points.length < 2) {
		throw new Error('monotoneCubic requires at least two points.');
	}
	const n = points.length;
	const xs = points.map((point) => point[0]);
	const ys = points.map((point) => point[1]);
	for (let i = 1; i < n; i += 1) {
		if (!(xs[i] > xs[i - 1])) {
			throw new Error('monotoneCubic requires strictly increasing x values.');
		}
	}

	const h: number[] = [];
	const secant: number[] = [];
	for (let i = 0; i < n - 1; i += 1) {
		h.push(xs[i + 1] - xs[i]);
		secant.push((ys[i + 1] - ys[i]) / h[i]);
	}

	const slope: number[] = new Array(n);
	for (let i = 1; i < n - 1; i += 1) {
		const weighted = (secant[i - 1] * h[i] + secant[i] * h[i - 1]) / (h[i - 1] + h[i]);
		slope[i] =
			(sign(secant[i - 1]) + sign(secant[i])) *
			Math.min(Math.abs(secant[i - 1]), Math.abs(secant[i]), 0.5 * Math.abs(weighted));
	}
	const boundarySlope = (first: number, second: number, spanFirst: number, spanSecond: number) => {
		let m = first + (spanFirst * (first - second)) / (spanFirst + spanSecond);
		if (m * first <= 0) {
			m = 0;
		} else if (Math.abs(m) > 2 * Math.abs(first)) {
			m = 2 * first;
		}
		return m;
	};
	slope[0] = n === 2 ? secant[0] : boundarySlope(secant[0], secant[1], h[0], h[1]);
	slope[n - 1] =
		n === 2 ? secant[0] : boundarySlope(secant[n - 2], secant[n - 3], h[n - 2], h[n - 3]);

	const evaluate = (x: number): number => {
		if (x < xs[0] || x > xs[n - 1]) {
			throw new Error(`${x} is outside [${xs[0]}, ${xs[n - 1]}]`);
		}
		let low = 0;
		let high = n - 2;
		while (low < high) {
			const middle = (low + high + 1) >> 1;
			if (xs[middle] <= x) {
				low = middle;
			} else {
				high = middle - 1;
			}
		}
		const t = x - xs[low];
		const a = (slope[low] + slope[low + 1] - 2 * secant[low]) / (h[low] * h[low]);
		const b = (3 * secant[low] - 2 * slope[low] - slope[low + 1]) / h[low];
		return ((a * t + b) * t + slope[low]) * t + ys[low];
	};

	return Object.assign(evaluate, { domain: [xs[0], xs[n - 1]] as const });
}
