export interface RootOptions {
	tolerance?: number;
	maxIterations?: number;
}

/** Solve a continuous, sign-changing interval with deterministic bisection. */
export function solveBracketedRoot(
	fn: (value: number) => number,
	lower: number,
	upper: number,
	options: RootOptions = {}
): number {
	const tolerance = options.tolerance ?? 1e-9;
	const maxIterations = options.maxIterations ?? 120;
	let left = lower;
	let right = upper;
	let fLeft = fn(left);
	const fRight = fn(right);

	if (!Number.isFinite(fLeft) || !Number.isFinite(fRight)) {
		throw new Error('Root interval produced a non-finite value.');
	}
	if (Math.abs(fLeft) <= tolerance) return left;
	if (Math.abs(fRight) <= tolerance) return right;
	if (fLeft * fRight > 0) {
		throw new Error(`Root is not bracketed on [${lower}, ${upper}].`);
	}

	for (let iteration = 0; iteration < maxIterations; iteration += 1) {
		const middle = (left + right) / 2;
		const fMiddle = fn(middle);
		if (!Number.isFinite(fMiddle)) throw new Error('Root solver produced a non-finite value.');
		if (Math.abs(fMiddle) <= tolerance || (right - left) / 2 <= tolerance) return middle;

		if (fLeft * fMiddle <= 0) {
			right = middle;
		} else {
			left = middle;
			fLeft = fMiddle;
		}
	}

	return (left + right) / 2;
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
