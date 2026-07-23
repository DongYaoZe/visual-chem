/**
 * Arrhenius kinetics and the Maxwell-Boltzmann speed distribution for the
 * mountain-crossing story.
 *
 * k = A·exp(−Ea/RT). The story's teaching anchors: a typical Ea of
 * 50 kJ/mol roughly doubles k per 10 K near room temperature (the classic
 * rule of thumb, and its own debunking — the factor depends on Ea and T);
 * food spoilage, RGB firefly flashing, and cricket chirps (Dolbear's law)
 * all follow near-Arrhenius behavior.
 *
 * The MB distribution is plotted for the speed axis in reduced units; the
 * high-energy tail fraction uses the barrier-crossing fraction
 * exp(−Ea/RT) — the same exponential that powers Arrhenius.
 */

const GAS_CONSTANT_J_PER_MOL_K = 8.31446261815324;

function assertPositive(value: number, name: string): void {
	if (!(value > 0) || !Number.isFinite(value)) {
		throw new Error(`${name} must be positive, got ${value}`);
	}
}

/** Rate constant relative to A: exp(−Ea/RT). */
export function arrheniusFactor(eaKJPerMol: number, temperatureK: number): number {
	assertPositive(eaKJPerMol, 'Ea');
	assertPositive(temperatureK, 'T');
	return Math.exp((-eaKJPerMol * 1000) / (GAS_CONSTANT_J_PER_MOL_K * temperatureK));
}

/** Ratio k(T2)/k(T1) for the same reaction. */
export function rateRatio(eaKJPerMol: number, t1K: number, t2K: number): number {
	return arrheniusFactor(eaKJPerMol, t2K) / arrheniusFactor(eaKJPerMol, t1K);
}

/**
 * The "doubles every 10 K" rule of thumb, made honest: the temperature rise
 * that doubles k at temperature T for barrier Ea.
 * From ln2 = Ea/R · (1/T − 1/T2).
 */
export function doublingRiseK(eaKJPerMol: number, temperatureK: number): number {
	assertPositive(eaKJPerMol, 'Ea');
	assertPositive(temperatureK, 'T');
	const eaOverR = (eaKJPerMol * 1000) / GAS_CONSTANT_J_PER_MOL_K;
	const inverse = 1 / temperatureK - Math.LN2 / eaOverR;
	if (inverse <= 0) return Infinity;
	return 1 / inverse - temperatureK;
}

/**
 * Maxwell-Boltzmann speed distribution in reduced units.
 * x = v / v_p where v_p = most probable speed at the reference temperature
 * T_ref; the curve for temperature T (in units of T_ref) is
 * f(x) ∝ x² exp(−x²/τ) with τ = T/T_ref, normalized to unit area.
 */
export function mbDistribution(
	tau: number,
	samples = 120,
	xMax = 3.4
): { xs: readonly number[]; ys: readonly number[] } {
	assertPositive(tau, 'tau');
	const xs: number[] = [];
	const raw: number[] = [];
	for (let index = 0; index <= samples; index += 1) {
		const x = (xMax * index) / samples;
		xs.push(x);
		raw.push(x * x * Math.exp((-x * x) / tau));
	}
	// Normalize to unit area by the trapezoid rule so different temperatures
	// share one honest vertical scale (same number of molecules).
	let area = 0;
	for (let index = 1; index < raw.length; index += 1) {
		area += ((raw[index] + raw[index - 1]) / 2) * (xs[index] - xs[index - 1]);
	}
	const ys = raw.map((value) => value / area);
	return { xs, ys };
}

/**
 * Fraction of molecules above the reduced threshold energy: for the story's
 * shaded tail we use the barrier fraction exp(−E/RT), the Arrhenius
 * exponential itself (exact for the 1D/collision-energy picture the
 * classroom uses).
 */
export function tailFraction(eaKJPerMol: number, temperatureK: number): number {
	return arrheniusFactor(eaKJPerMol, temperatureK);
}

/** Solve Ea from two measured rate constants (the two-point Arrhenius). */
export function eaFromTwoPoints(t1K: number, k1: number, t2K: number, k2: number): number {
	assertPositive(k1, 'k1');
	assertPositive(k2, 'k2');
	assertPositive(t1K, 'T1');
	assertPositive(t2K, 'T2');
	if (t1K === t2K) throw new Error('temperatures must differ');
	const slope = Math.log(k2 / k1) / (1 / t2K - 1 / t1K);
	return (-slope * GAS_CONSTANT_J_PER_MOL_K) / 1000;
}

/**
 * Dolbear's law anchor: cricket chirps N per minute vs temperature.
 * T(°F) = 50 + (N60 − 40)/4 for the snowy tree cricket; we expose the
 * chirp rate at temperature for the story's playful cross-check.
 */
export function dolbearChirpsPerMinute(temperatureC: number): number {
	const temperatureF = temperatureC * 1.8 + 32;
	return Math.max(0, (temperatureF - 50) * 4 + 40);
}
