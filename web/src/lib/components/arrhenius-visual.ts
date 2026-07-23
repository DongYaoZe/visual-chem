/**
 * Map the many orders of magnitude in an Arrhenius tail to a small,
 * deterministic indicator ensemble.
 *
 * This is deliberately a logarithmic display transform, not a claim that
 * highlighted / total equals the molecular crossing probability. The
 * CollisionChamber labels that boundary in visible copy and its ARIA summary.
 */
export function logCompressedTailCount(
	tailShare: number,
	total: number,
	minExponent = -24,
	maxExponent = -2
): number {
	if (!(tailShare > 0) || !Number.isFinite(tailShare)) {
		throw new Error('tailShare must be positive and finite');
	}
	if (!Number.isInteger(total) || total <= 0) {
		throw new Error('total must be a positive integer');
	}
	if (!(maxExponent > minExponent)) {
		throw new Error('maxExponent must exceed minExponent');
	}

	const logShare = Math.log10(tailShare);
	const normalized = (logShare - minExponent) / (maxExponent - minExponent);
	const clamped = Math.min(1, Math.max(0, normalized));
	return Math.round(clamped * total);
}
