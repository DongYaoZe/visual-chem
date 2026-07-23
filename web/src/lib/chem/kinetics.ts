/**
 * Integrated rate laws for the concentration-countdown story.
 *
 * The workhorse reaction is H2O2 decomposition, 2 H2O2 -> 2 H2O + O2 —
 * genuinely first-order in H2O2 over iodide or catalase, the classic
 * classroom system. Uncatalyzed k at 25 °C is tiny (shelf-stable for
 * months); with KI it runs on classroom time. We expose k as a knob and let
 * the story anchor specific values.
 *
 * Orders 0, 1, and 2 share one interface so the detective scenes can lay
 * their fingerprints side by side: only first order has a
 * concentration-independent half-life.
 */

export type ReactionOrder = 0 | 1 | 2;

function assertPositive(value: number, name: string): void {
	if (!(value > 0) || !Number.isFinite(value)) {
		throw new Error(`${name} must be positive, got ${value}`);
	}
}

/**
 * Concentration at time t for the given order.
 * Units: c0 in mol/L, k in the order's natural units
 * (0: mol L^-1 s^-1, 1: s^-1, 2: L mol^-1 s^-1).
 */
export function concentrationAt(
	order: ReactionOrder,
	c0: number,
	k: number,
	timeS: number
): number {
	assertPositive(c0, 'c0');
	assertPositive(k, 'k');
	if (timeS < 0) throw new Error(`time must be non-negative, got ${timeS}`);
	switch (order) {
		case 0:
			return Math.max(0, c0 - k * timeS);
		case 1:
			return c0 * Math.exp(-k * timeS);
		case 2:
			return c0 / (1 + k * c0 * timeS);
	}
}

/** Instantaneous rate −dc/dt at concentration c. */
export function rateAt(order: ReactionOrder, c: number, k: number): number {
	assertPositive(k, 'k');
	if (c < 0) throw new Error(`concentration must be non-negative, got ${c}`);
	switch (order) {
		case 0:
			return c > 0 ? k : 0;
		case 1:
			return k * c;
		case 2:
			return k * c * c;
	}
}

/** Half-life starting from concentration c0. Only order 1 ignores c0. */
export function halfLife(order: ReactionOrder, c0: number, k: number): number {
	assertPositive(c0, 'c0');
	assertPositive(k, 'k');
	switch (order) {
		case 0:
			return c0 / (2 * k);
		case 1:
			return Math.LN2 / k;
		case 2:
			return 1 / (k * c0);
	}
}

/**
 * The detective's fingerprint: successive half-life times t(c0→c0/2),
 * t(c0/2→c0/4), t(c0/4→c0/8). Constant ⇔ first order; shrinking ⇔ zero
 * order; doubling ⇔ second order.
 */
export function successiveHalfLives(
	order: ReactionOrder,
	c0: number,
	k: number,
	count = 3
): readonly number[] {
	const spans: number[] = [];
	let c = c0;
	for (let index = 0; index < count; index += 1) {
		spans.push(halfLife(order, c, k));
		c /= 2;
	}
	return spans;
}

export interface DecayCurve {
	order: ReactionOrder;
	c0: number;
	k: number;
	times: readonly number[];
	concentrations: readonly number[];
	/** Cumulative times at which c reaches c0/2, c0/4, c0/8. */
	halfLifeMarks: readonly number[];
}

export interface PeroxideParticleCounts {
	/** H2O2 formula units still present. */
	reactant: number;
	/** H2O formula units formed. */
	water: number;
	/** O2 formula units formed. */
	oxygen: number;
}

/**
 * Integer particle bookkeeping for 2 H2O2 -> 2 H2O + O2.
 *
 * The reactant pool is deliberately even, so every visual reaction event
 * consumes two peroxide formula units and produces exactly two waters and
 * one oxygen. Snapping happens at the pair level; atom counts therefore stay
 * exact at every rendered frame instead of only in the continuum limit.
 */
export function peroxideParticleCounts(
	remainingFraction: number,
	initialReactants = 20
): PeroxideParticleCounts {
	if (!Number.isFinite(remainingFraction) || remainingFraction < 0 || remainingFraction > 1) {
		throw new Error(`remaining fraction must be in [0, 1], got ${remainingFraction}`);
	}
	if (!Number.isInteger(initialReactants) || initialReactants <= 0 || initialReactants % 2 !== 0) {
		throw new Error(`initial H2O2 count must be a positive even integer, got ${initialReactants}`);
	}
	const remainingPairs = Math.round((initialReactants / 2) * remainingFraction);
	const reactant = remainingPairs * 2;
	const consumed = initialReactants - reactant;
	return { reactant, water: consumed, oxygen: consumed / 2 };
}

export function decayCurve(
	order: ReactionOrder,
	c0: number,
	k: number,
	totalTimeS: number,
	samples = 120
): DecayCurve {
	assertPositive(totalTimeS, 'totalTime');
	const times: number[] = [];
	const concentrations: number[] = [];
	for (let index = 0; index <= samples; index += 1) {
		const t = (totalTimeS * index) / samples;
		times.push(t);
		concentrations.push(concentrationAt(order, c0, k, t));
	}
	const spans = successiveHalfLives(order, c0, k);
	const halfLifeMarks: number[] = [];
	let cumulative = 0;
	for (const span of spans) {
		cumulative += span;
		if (cumulative <= totalTimeS) halfLifeMarks.push(cumulative);
	}
	return { order, c0, k, times, concentrations, halfLifeMarks };
}

/**
 * Carbon-14 anchor: t1/2 = 5730 a (Cambridge half-life), so
 * k = ln 2 / 5730 a^-1 and age = t1/2 · log2(c0/c).
 */
export const C14_HALF_LIFE_A = 5730;

export function c14AgeYears(remainingFraction: number): number {
	if (!(remainingFraction > 0 && remainingFraction <= 1)) {
		throw new Error(`fraction must be in (0, 1], got ${remainingFraction}`);
	}
	return C14_HALF_LIFE_A * Math.log2(1 / remainingFraction);
}
