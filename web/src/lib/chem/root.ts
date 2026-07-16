export interface RootOptions {
	tolerance?: number;
	maxIterations?: number;
}

/**
 * Solve a continuous, sign-changing interval with Brent's method (zeroin).
 *
 * Deterministic like the bisection it replaced, but superlinear: inverse
 * quadratic interpolation with a secant fallback, guarded so every step
 * stays inside the shrinking bracket. Interactive sliders call this on
 * every input event via bubblePointAt, so evaluation count matters.
 */
export function solveBracketedRoot(
	fn: (value: number) => number,
	lower: number,
	upper: number,
	options: RootOptions = {}
): number {
	const tolerance = options.tolerance ?? 1e-9;
	const maxIterations = options.maxIterations ?? 120;
	let a = lower;
	let b = upper;
	let fa = fn(a);
	let fb = fn(b);

	if (!Number.isFinite(fa) || !Number.isFinite(fb)) {
		throw new Error('Root interval produced a non-finite value.');
	}
	if (Math.abs(fa) <= tolerance) return a;
	if (Math.abs(fb) <= tolerance) return b;
	if (fa * fb > 0) {
		throw new Error(`Root is not bracketed on [${lower}, ${upper}].`);
	}

	// c is the previous bracket endpoint: [b, c] always straddles the root
	// and b is the current best estimate (|f(b)| <= |f(c)|).
	let c = a;
	let fc = fa;
	let d = b - a;
	let e = d;

	for (let iteration = 0; iteration < maxIterations; iteration += 1) {
		if ((fb > 0 && fc > 0) || (fb < 0 && fc < 0)) {
			c = a;
			fc = fa;
			d = b - a;
			e = d;
		}
		if (Math.abs(fc) < Math.abs(fb)) {
			a = b;
			b = c;
			c = a;
			fa = fb;
			fb = fc;
			fc = fa;
		}

		const tol1 = 2 * Number.EPSILON * Math.abs(b) + tolerance / 2;
		const xm = (c - b) / 2;
		if (Math.abs(xm) <= tol1 || fb === 0 || Math.abs(fb) <= tolerance) return b;

		if (Math.abs(e) >= tol1 && Math.abs(fa) > Math.abs(fb)) {
			// Try inverse quadratic interpolation (secant when a === c).
			const s = fb / fa;
			let p: number;
			let q: number;
			if (a === c) {
				p = 2 * xm * s;
				q = 1 - s;
			} else {
				const inverseSlope = fa / fc;
				const ratio = fb / fc;
				p = s * (2 * xm * inverseSlope * (inverseSlope - ratio) - (b - a) * (ratio - 1));
				q = (inverseSlope - 1) * (ratio - 1) * (s - 1);
			}
			if (p > 0) q = -q;
			p = Math.abs(p);
			// Accept the step only if it stays well inside the bracket and
			// shrinks faster than the previous one; otherwise bisect.
			if (2 * p < Math.min(3 * xm * q - Math.abs(tol1 * q), Math.abs(e * q))) {
				e = d;
				d = p / q;
			} else {
				d = xm;
				e = d;
			}
		} else {
			d = xm;
			e = d;
		}

		a = b;
		fa = fb;
		b += Math.abs(d) > tol1 ? d : xm > 0 ? tol1 : -tol1;
		fb = fn(b);
		if (!Number.isFinite(fb)) throw new Error('Root solver produced a non-finite value.');
	}

	return b;
}

export function findInteriorRoots(
	fn: (value: number) => number,
	lower = 0,
	upper = 1,
	samples = 240
): number[] {
	const roots: number[] = [];
	let previousX = lower;
	let previousValue = fn(previousX);

	for (let index = 1; index <= samples; index += 1) {
		const x = lower + ((upper - lower) * index) / samples;
		const value = fn(x);
		if (previousValue * value < 0) {
			const root = solveBracketedRoot(fn, previousX, x);
			if (!roots.some((existing) => Math.abs(existing - root) < 1e-6)) roots.push(root);
		}
		previousX = x;
		previousValue = value;
	}

	return roots.filter((root) => root > lower + 1e-6 && root < upper - 1e-6);
}
