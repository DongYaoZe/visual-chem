/**
 * Phase boundaries of ordinary water in the p–T plane.
 *
 * Every curve on the boiling map is computed from IAPWS releases, not drawn:
 * - Vapor–liquid saturation: IAPWS-IF97 region-4 equations (Eqs. 29–31),
 *   valid 273.15 K to 647.096 K, exact at the triple, normal-boiling, and
 *   critical points.
 * - Ice Ih melting and sublimation: IAPWS R14-08(2011) Eqs. (1) and (6),
 *   valid 251.165–273.16 K and 50–273.16 K respectively.
 * The IF97 saturation pair is analytic in both directions, so boiling
 * points respond to a slider without any iteration.
 */

export const WATER_TRIPLE_POINT = { temperatureK: 273.16, pressurePa: 611.657 } as const;
export const WATER_CRITICAL_POINT = { temperatureK: 647.096, pressurePa: 22.064e6 } as const;
/** Ice Ih–ice III–liquid triple point: the cold end of the ordinary melting curve. */
export const ICE_IH_MELTING_FLOOR_K = 251.165;

export const CELSIUS_ZERO_K = 273.15;

export function kelvinToCelsius(temperatureK: number): number {
	return temperatureK - CELSIUS_ZERO_K;
}

export function celsiusToKelvin(temperatureC: number): number {
	return temperatureC + CELSIUS_ZERO_K;
}

// IAPWS-IF97 Table 34 coefficients for the region-4 saturation equations.
const N = [
	0.11670521452767e4, -0.72421316703206e6, -0.17073846940092e2, 0.1202082470247e5,
	-0.32325550322333e7, 0.1491510861353e2, -0.48232657361591e4, 0.40511340542057e6,
	-0.23855557567849, 0.65017534844798e3
];

function assertRange(value: number, lower: number, upper: number, label: string): void {
	if (!Number.isFinite(value) || value < lower || value > upper) {
		throw new Error(`${label} ${value} is outside [${lower}, ${upper}]`);
	}
}

/** IF97 Eq. (30): saturation pressure in Pa for 273.15 K ≤ T ≤ 647.096 K. */
export function saturationPressurePa(temperatureK: number): number {
	assertRange(temperatureK, 273.15, WATER_CRITICAL_POINT.temperatureK, 'temperatureK');
	const theta = temperatureK + N[8] / (temperatureK - N[9]);
	const a = theta * theta + N[0] * theta + N[1];
	const b = N[2] * theta * theta + N[3] * theta + N[4];
	const c = N[5] * theta * theta + N[6] * theta + N[7];
	const fraction = (2 * c) / (-b + Math.sqrt(b * b - 4 * a * c));
	return fraction ** 4 * 1e6;
}

/** IF97 Eq. (31): saturation temperature in K for 611.213 Pa ≤ p ≤ 22.064 MPa. */
export function saturationTemperatureK(pressurePa: number): number {
	assertRange(pressurePa, 611.213, WATER_CRITICAL_POINT.pressurePa, 'pressurePa');
	const beta = (pressurePa / 1e6) ** 0.25;
	const e = beta * beta + N[2] * beta + N[5];
	const f = N[0] * beta * beta + N[3] * beta + N[6];
	const g = N[1] * beta * beta + N[4] * beta + N[7];
	const d = (2 * g) / (-f - Math.sqrt(f * f - 4 * e * g));
	const sum = N[9] + d;
	return (sum - Math.sqrt(sum * sum - 4 * (N[8] + N[9] * d))) / 2;
}

// IAPWS R14-08(2011) Eq. (6): sublimation pressure of ice Ih.
const SUBLIMATION_A = [-0.212144006e2, 0.273203819e2, -0.61059813e1];
const SUBLIMATION_B = [0.333333333e-2, 0.120666667e1, 0.170333333e1];

/** Sublimation pressure in Pa for 50 K ≤ T ≤ 273.16 K. */
export function sublimationPressurePa(temperatureK: number): number {
	assertRange(temperatureK, 50, WATER_TRIPLE_POINT.temperatureK, 'temperatureK');
	const theta = temperatureK / WATER_TRIPLE_POINT.temperatureK;
	let sum = 0;
	for (let index = 0; index < SUBLIMATION_A.length; index += 1) {
		sum += SUBLIMATION_A[index] * theta ** SUBLIMATION_B[index];
	}
	return WATER_TRIPLE_POINT.pressurePa * Math.exp(sum / theta);
}

// IAPWS R14-08(2011) Eq. (1): melting pressure of ice Ih.
const MELTING_A = [0.119539337e7, 0.808183159e5, 0.33382686e4];
const MELTING_B = [0.3e1, 0.2575e2, 0.10375e3];

/** Ice Ih melting pressure in Pa for 251.165 K ≤ T ≤ 273.16 K. The famous
 * negative slope: lowering the temperature raises the pressure needed. */
export function meltingPressurePa(temperatureK: number): number {
	assertRange(
		temperatureK,
		ICE_IH_MELTING_FLOOR_K,
		WATER_TRIPLE_POINT.temperatureK,
		'temperatureK'
	);
	const theta = temperatureK / WATER_TRIPLE_POINT.temperatureK;
	let sum = 1;
	for (let index = 0; index < MELTING_A.length; index += 1) {
		sum += MELTING_A[index] * (1 - theta ** MELTING_B[index]);
	}
	return WATER_TRIPLE_POINT.pressurePa * sum;
}

const GAS_CONSTANT = 8.31446261815324; // J/(mol·K)

/**
 * Molar enthalpy of vaporization in kJ/mol via Clausius–Clapeyron applied to
 * the computed saturation curve: ΔH ≈ −R · d(ln p)/d(1/T). Carries that
 * equation's assumptions (ideal vapor, negligible liquid volume), which is
 * exactly the approximation the story teaches.
 */
export function vaporizationEnthalpyKJPerMol(temperatureK: number): number {
	const deltaK = 0.05;
	const lower = Math.max(273.15, temperatureK - deltaK);
	const upper = Math.min(WATER_CRITICAL_POINT.temperatureK, temperatureK + deltaK);
	const slope =
		(Math.log(saturationPressurePa(upper)) - Math.log(saturationPressurePa(lower))) /
		(1 / upper - 1 / lower);
	return (-GAS_CONSTANT * slope) / 1000;
}

const SEA_LEVEL_PRESSURE_PA = 101325;

/** International Standard Atmosphere pressure for altitudes 0–11 000 m. */
export function pressureAtAltitudePa(altitudeM: number): number {
	assertRange(altitudeM, -500, 11000, 'altitudeM');
	return SEA_LEVEL_PRESSURE_PA * (1 - 2.25577e-5 * altitudeM) ** 5.25588;
}

/** Where water boils at a given altitude: the temperature at which the
 * saturation curve meets the local atmospheric pressure. */
export function boilingPointAtAltitudeC(altitudeM: number): number {
	return kelvinToCelsius(saturationTemperatureK(pressureAtAltitudePa(altitudeM)));
}

export type WaterPhase = 'solid' | 'liquid' | 'vapor' | 'supercritical';

/**
 * Classify a (T, p) state against the computed boundaries. Below the ice Ih
 * melting-curve floor (251.165 K) everything above the sublimation curve is
 * reported as solid — the high-pressure ice polymorphs are beyond this map.
 */
export function classifyWaterPhase(temperatureK: number, pressurePa: number): WaterPhase {
	if (temperatureK >= WATER_CRITICAL_POINT.temperatureK) {
		return pressurePa >= WATER_CRITICAL_POINT.pressurePa ? 'supercritical' : 'vapor';
	}
	if (temperatureK >= WATER_TRIPLE_POINT.temperatureK) {
		return pressurePa >= saturationPressurePa(Math.max(273.15, temperatureK)) ? 'liquid' : 'vapor';
	}
	if (pressurePa <= sublimationPressurePa(temperatureK)) return 'vapor';
	if (temperatureK >= ICE_IH_MELTING_FLOOR_K && pressurePa >= meltingPressurePa(temperatureK)) {
		return 'liquid';
	}
	return 'solid';
}

export interface PTPoint {
	temperatureK: number;
	pressurePa: number;
}

function sampleCurve(
	lowerK: number,
	upperK: number,
	samples: number,
	pressureAt: (temperatureK: number) => number
): PTPoint[] {
	return Array.from({ length: samples }, (_, index) => {
		const temperatureK = lowerK + ((upperK - lowerK) * index) / (samples - 1);
		return { temperatureK, pressurePa: pressureAt(temperatureK) };
	});
}

/** Vaporization curve from the triple point to the critical point. */
export function buildBoilingCurve(samples = 161): PTPoint[] {
	return sampleCurve(
		WATER_TRIPLE_POINT.temperatureK,
		WATER_CRITICAL_POINT.temperatureK,
		samples,
		(temperatureK) => saturationPressurePa(Math.max(273.15, temperatureK))
	);
}

/** Sublimation curve up to the triple point. */
export function buildSublimationCurve(lowerK = 190, samples = 81): PTPoint[] {
	return sampleCurve(lowerK, WATER_TRIPLE_POINT.temperatureK, samples, sublimationPressurePa);
}

/** Ice Ih melting curve, from the triple point up its near-vertical wall. */
export function buildMeltingCurve(samples = 81): PTPoint[] {
	return sampleCurve(
		ICE_IH_MELTING_FLOOR_K,
		WATER_TRIPLE_POINT.temperatureK,
		samples,
		meltingPressurePa
	);
}
