/**
 * Hydrogen emission spectrum for the "atomic fingerprint" story.
 *
 * The browser computes every wavelength from the Rydberg equation.  The
 * visible Balmer colours are presentational labels only; the wavelength and
 * photon-energy readouts always come from the same transition state.
 */

/** NIST 2022 CODATA Rydberg constant for an infinitely heavy nucleus. */
export const RYDBERG_INFINITY_M_INVERSE = 10_973_731.568157;
/** NIST 2022 CODATA proton/electron mass ratio. */
export const PROTON_ELECTRON_MASS_RATIO = 1836.152673426;
/** Reduced-mass correction for ordinary protium (hydrogen-1). */
export const RYDBERG_HYDROGEN_M_INVERSE =
	RYDBERG_INFINITY_M_INVERSE / (1 + 1 / PROTON_ELECTRON_MASS_RATIO);
const PLANCK_EV_S = 4.135667696e-15;
const LIGHT_SPEED_M_S = 299_792_458;
/** Bohr/Rydberg ground-state energy derived from the same R_H as wavelength. */
export const HYDROGEN_GROUND_STATE_EV = -PLANCK_EV_S * LIGHT_SPEED_M_S * RYDBERG_HYDROGEN_M_INVERSE;

export interface HydrogenTransition {
	readonly upperN: number;
	readonly lowerN: number;
	readonly wavelengthNm: number;
	readonly photonEnergyEv: number;
	readonly series: 'Lyman' | 'Balmer' | 'Paschen' | 'other';
}

export type SpectrumRegion = 'ultraviolet' | 'visible' | 'infrared';

export interface HydrogenSpectrumFrame extends HydrogenTransition {
	readonly upperEnergyEv: number;
	readonly lowerEnergyEv: number;
	readonly energyGapEv: number;
	readonly region: SpectrumRegion;
	readonly isVisible: boolean;
	readonly displayColor: string;
}

function assertLevel(value: number, name: string): void {
	if (!Number.isInteger(value) || value < 1) {
		throw new Error(`${name} must be a positive integer, got ${value}`);
	}
}

/** Bound-state energy in electronvolts, with zero at the ionisation limit. */
export function hydrogenEnergyEv(n: number): number {
	assertLevel(n, 'n');
	return HYDROGEN_GROUND_STATE_EV / (n * n);
}

/** Emitted-photon wavelength for a downward transition, in vacuum nanometres. */
export function hydrogenWavelengthNm(upperN: number, lowerN: number): number {
	assertLevel(upperN, 'upperN');
	assertLevel(lowerN, 'lowerN');
	if (upperN <= lowerN) {
		throw new Error(`emission requires upperN > lowerN, got ${upperN} -> ${lowerN}`);
	}
	const inverseMetres =
		RYDBERG_HYDROGEN_M_INVERSE * (1 / (lowerN * lowerN) - 1 / (upperN * upperN));
	return 1e9 / inverseMetres;
}

/** Photon energy reconstructed independently from h c / wavelength. */
export function photonEnergyEv(wavelengthNm: number): number {
	if (!(wavelengthNm > 0) || !Number.isFinite(wavelengthNm)) {
		throw new Error(`wavelength must be positive, got ${wavelengthNm}`);
	}
	return (PLANCK_EV_S * LIGHT_SPEED_M_S * 1e9) / wavelengthNm;
}

export function hydrogenSeries(lowerN: number): HydrogenTransition['series'] {
	assertLevel(lowerN, 'lowerN');
	if (lowerN === 1) return 'Lyman';
	if (lowerN === 2) return 'Balmer';
	if (lowerN === 3) return 'Paschen';
	return 'other';
}

export function hydrogenTransition(upperN: number, lowerN: number): HydrogenTransition {
	const wavelengthNm = hydrogenWavelengthNm(upperN, lowerN);
	return {
		upperN,
		lowerN,
		wavelengthNm,
		photonEnergyEv: photonEnergyEv(wavelengthNm),
		series: hydrogenSeries(lowerN)
	};
}

/** One resolved state shared by all three representations. */
export function hydrogenSpectrumFrame(upperN: number, lowerN: number): HydrogenSpectrumFrame {
	const transition = hydrogenTransition(upperN, lowerN);
	const upperEnergyEv = hydrogenEnergyEv(upperN);
	const lowerEnergyEv = hydrogenEnergyEv(lowerN);
	const region: SpectrumRegion =
		transition.wavelengthNm < 380
			? 'ultraviolet'
			: transition.wavelengthNm <= 750
				? 'visible'
				: 'infrared';
	return {
		...transition,
		upperEnergyEv,
		lowerEnergyEv,
		energyGapEv: upperEnergyEv - lowerEnergyEv,
		region,
		isVisible: region === 'visible',
		displayColor: visibleWavelengthColor(transition.wavelengthNm)
	};
}

/** The four prominent visible Balmer lines used throughout the story. */
export function visibleBalmerLines(): readonly HydrogenTransition[] {
	return [3, 4, 5, 6].map((upperN) => hydrogenTransition(upperN, 2));
}

/** A short computed run of one spectral family for the teaching display. */
export function hydrogenSeriesLines(
	lowerN: number,
	maxUpperN = Math.max(6, lowerN + 4)
): readonly HydrogenTransition[] {
	assertLevel(lowerN, 'lowerN');
	assertLevel(maxUpperN, 'maxUpperN');
	if (maxUpperN <= lowerN) throw new Error('maxUpperN must exceed lowerN');
	return Array.from({ length: maxUpperN - lowerN }, (_, index) =>
		hydrogenTransition(lowerN + index + 1, lowerN)
	);
}

/** Short-wavelength limit as the upper level approaches infinity. */
export function hydrogenSeriesLimitNm(lowerN: number): number {
	assertLevel(lowerN, 'lowerN');
	return (1e9 * lowerN * lowerN) / RYDBERG_HYDROGEN_M_INVERSE;
}

/** A deterministic teaching colour for a computed visible wavelength. */
export function visibleWavelengthColor(wavelengthNm: number): string {
	if (wavelengthNm >= 620 && wavelengthNm <= 750) return '#e54b4b';
	if (wavelengthNm >= 480 && wavelengthNm < 620) return '#3db7d6';
	if (wavelengthNm >= 430 && wavelengthNm < 480) return '#5574e8';
	if (wavelengthNm >= 380 && wavelengthNm < 430) return '#8d62d9';
	return '#747b82';
}

/** True for the conventional human-visible window used in this story. */
export function isVisibleWavelength(wavelengthNm: number): boolean {
	return wavelengthNm >= 380 && wavelengthNm <= 750;
}
