/**
 * Microstate counting for the two-bulb lattice-gas teaching model.
 *
 * N distinguishable-in-principle particles distributed over two equal bulbs:
 * W(n) = C(N, n) ways to put n particles in the left bulb. Everything the
 * story shows — the multiplicity spike, the Boltzmann entropy, the vanishing
 * odds of un-mixing — is computed from ln C(N, n) in log space, so N can be
 * taken to hundreds without overflow. S = k ln W is reported in units of k.
 *
 * The mixing-entropy limit for one mole uses S/Nk → ln 2 per particle when a
 * gas doubles its volume, giving ΔS = R ln 2 = 5.763 J/(K·mol).
 */

const GAS_CONSTANT_J_PER_MOL_K = 8.31446261815324;
export const AVOGADRO_PER_MOL = 6.02214076e23;

/** ln n! via Stirling's series for large n, exact accumulation for small n. */
export function lnFactorial(n: number): number {
	if (n < 0 || !Number.isInteger(n)) throw new Error(`${n} is not a natural number`);
	if (n < 2) return 0;
	if (n < 32) {
		let total = 0;
		for (let k = 2; k <= n; k += 1) total += Math.log(k);
		return total;
	}
	// Stirling with the 1/(12n) correction: relative error < 1e-10 for n ≥ 32.
	return n * Math.log(n) - n + 0.5 * Math.log(2 * Math.PI * n) + 1 / (12 * n);
}

/** ln of the binomial coefficient C(n, k). */
export function lnBinomial(n: number, k: number): number {
	if (k < 0 || k > n) throw new Error(`C(${n}, ${k}) is undefined`);
	return lnFactorial(n) - lnFactorial(k) - lnFactorial(n - k);
}

/** ln W for n of N particles in the left bulb. */
export function lnMultiplicity(totalParticles: number, leftCount: number): number {
	return lnBinomial(totalParticles, leftCount);
}

/** Probability of exactly n particles in the left bulb (fair coin per particle). */
export function leftCountProbability(totalParticles: number, leftCount: number): number {
	return Math.exp(lnBinomial(totalParticles, leftCount) - totalParticles * Math.LN2);
}

export interface MultiplicityDistribution {
	totalParticles: number;
	/** P(n) for n = 0..N, normalized. */
	probabilities: readonly number[];
	/** ln W(n) for n = 0..N. */
	lnMultiplicities: readonly number[];
	/** ln W at the even split. */
	lnPeak: number;
	/** Probability that the left bulb holds all N particles: 2^-N. */
	allLeftProbability: number;
}

export function multiplicityDistribution(totalParticles: number): MultiplicityDistribution {
	const probabilities: number[] = [];
	const lnMultiplicities: number[] = [];
	for (let n = 0; n <= totalParticles; n += 1) {
		lnMultiplicities.push(lnBinomial(totalParticles, n));
		probabilities.push(leftCountProbability(totalParticles, n));
	}
	return {
		totalParticles,
		probabilities,
		lnMultiplicities,
		lnPeak: lnBinomial(totalParticles, Math.floor(totalParticles / 2)),
		allLeftProbability: Math.pow(2, -totalParticles)
	};
}

/**
 * The fraction of all 2^N microstates lying within ±window of the even
 * split — the "how sharp is the peak" number the story leans on.
 */
export function centralFraction(totalParticles: number, window: number): number {
	const half = totalParticles / 2;
	let total = 0;
	for (let n = 0; n <= totalParticles; n += 1) {
		if (Math.abs(n - half) <= window) total += leftCountProbability(totalParticles, n);
	}
	return Math.min(1, total);
}

/** Molar entropy of doubling a gas's volume: ΔS = R ln 2. */
export const MOLAR_MIXING_ENTROPY_J_PER_K = GAS_CONSTANT_J_PER_MOL_K * Math.LN2;

/**
 * Deterministic pseudo-random walk of the two-bulb gas: each step one
 * particle chosen by a seeded LCG hops bulbs (the Ehrenfest urn). Returns the
 * left-count trajectory — relaxation toward N/2 with fluctuations of √N.
 */
export function ehrenfestTrajectory(
	totalParticles: number,
	steps: number,
	startLeft = totalParticles,
	seed = 42
): readonly number[] {
	let state = seed >>> 0;
	const next = () => {
		// Numerical Recipes LCG; plenty for a cartoon of relaxation.
		state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
		return state / 4294967296;
	};
	const trajectory: number[] = [startLeft];
	let left = startLeft;
	for (let step = 0; step < steps; step += 1) {
		// Pick a particle uniformly: it is in the left bulb with odds left/N.
		if (next() * totalParticles < left) left -= 1;
		else left += 1;
		trajectory.push(left);
	}
	return trajectory;
}
