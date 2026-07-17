/**
 * Measured 25 °C isotherm of the KNO3–NaNO3–H2O system.
 *
 * Source: W. Reinders, Z. Anorg. Allg. Chem. 93, 202 (1915), as tabulated in
 * International Critical Tables of Numerical Data, vol. IV, McGraw-Hill 1928,
 * p. 365 (open scan: archive.org/details/international-critical-tables_1928_4).
 * Values in g of salt per 100 g of water; `branch` names the saturating solid.
 *
 * The KNO3 branch is genuinely non-monotonic: adding NaNO3 first depresses
 * KNO3 solubility (common ion), then raises it (salting-in) — the measured
 * minimum sits near 15 g NaNO3. The one-parameter calibrated model reproduces
 * only the net rise and flattens this shallow dip; the spec quantifies that
 * deviation instead of hiding it.
 */

export interface Reinders1915Point {
	kno3GPer100gWater: number;
	nano3GPer100gWater: number;
	branch: 'kno3' | 'nano3' | 'eutonic';
}

export const REINDERS_1915_TEMPERATURE_C = 25;

export const REINDERS_1915_POINTS: readonly Reinders1915Point[] = [
	{ kno3GPer100gWater: 38.85, nano3GPer100gWater: 0, branch: 'kno3' },
	{ kno3GPer100gWater: 37.96, nano3GPer100gWater: 5, branch: 'kno3' },
	{ kno3GPer100gWater: 37.49, nano3GPer100gWater: 10, branch: 'kno3' },
	{ kno3GPer100gWater: 37.42, nano3GPer100gWater: 15, branch: 'kno3' },
	{ kno3GPer100gWater: 37.54, nano3GPer100gWater: 20, branch: 'kno3' },
	{ kno3GPer100gWater: 39.39, nano3GPer100gWater: 40, branch: 'kno3' },
	{ kno3GPer100gWater: 41.87, nano3GPer100gWater: 60, branch: 'kno3' },
	{ kno3GPer100gWater: 46.15, nano3GPer100gWater: 100.9, branch: 'eutonic' },
	{ kno3GPer100gWater: 30, nano3GPer100gWater: 97.95, branch: 'nano3' },
	{ kno3GPer100gWater: 20, nano3GPer100gWater: 96.06, branch: 'nano3' },
	{ kno3GPer100gWater: 10, nano3GPer100gWater: 94.47, branch: 'nano3' },
	{ kno3GPer100gWater: 5, nano3GPer100gWater: 93.39, branch: 'nano3' },
	{ kno3GPer100gWater: 0, nano3GPer100gWater: 91.86, branch: 'nano3' }
];
