/**
 * Teaching model for the fundamental infrared vibrations of 12C16O2.
 *
 * Frequencies are lightweight, rounded gas-phase anchors from the NIST
 * Chemistry WebBook. The browser derives wavelength and photon energy from
 * each wavenumber; the animation amplitude is only a visual normal-coordinate
 * cue, not molecular dynamics.
 */

const PLANCK_EV_S = 4.135667696e-15;
const LIGHT_SPEED_CM_S = 2.99792458e10;

export type CO2ModeId = 'symmetric-stretch' | 'bend' | 'asymmetric-stretch';
export type CO2ModeKind = 'stretch' | 'bend';

export interface CO2Mode {
	readonly id: CO2ModeId;
	readonly kind: CO2ModeKind;
	readonly wavenumberCm: number;
	readonly wavelengthUm: number;
	readonly photonEnergyEv: number;
	readonly degeneracy: number;
	readonly irActive: boolean;
	readonly dipoleChange: boolean;
}

export interface CO2InfraredFrame extends CO2Mode {
	readonly amplitude: number;
	readonly normalizedPosition: number;
}

const MODE_DATA: Readonly<Record<CO2ModeId, Omit<CO2Mode, 'wavelengthUm' | 'photonEnergyEv'>>> = {
	'symmetric-stretch': {
		id: 'symmetric-stretch',
		kind: 'stretch',
		wavenumberCm: 1333,
		degeneracy: 1,
		irActive: false,
		dipoleChange: false
	},
	bend: {
		id: 'bend',
		kind: 'bend',
		wavenumberCm: 667,
		degeneracy: 2,
		irActive: true,
		dipoleChange: true
	},
	'asymmetric-stretch': {
		id: 'asymmetric-stretch',
		kind: 'stretch',
		wavenumberCm: 2349,
		degeneracy: 1,
		irActive: true,
		dipoleChange: true
	}
};

function modeRecord(id: CO2ModeId): CO2Mode {
	const base = MODE_DATA[id];
	return {
		...base,
		wavelengthUm: 1e4 / base.wavenumberCm,
		photonEnergyEv: PLANCK_EV_S * LIGHT_SPEED_CM_S * base.wavenumberCm
	};
}

export function co2Mode(id: CO2ModeId): CO2Mode {
	return modeRecord(id);
}

export function co2InfraredFrame(id: CO2ModeId, amplitude = 0.72): CO2InfraredFrame {
	if (!Number.isFinite(amplitude) || amplitude < 0 || amplitude > 1) {
		throw new Error(`amplitude must be between 0 and 1, got ${amplitude}`);
	}
	const mode = modeRecord(id);
	return { ...mode, amplitude, normalizedPosition: amplitude };
}

export function allCO2Modes(): readonly CO2Mode[] {
	return (Object.keys(MODE_DATA) as CO2ModeId[]).map(modeRecord);
}

export function co2ModeLabel(id: CO2ModeId): string {
	return id === 'symmetric-stretch' ? 'ν₁' : id === 'bend' ? 'ν₂' : 'ν₃';
}

export function co2ModeFromIndex(index: number): CO2ModeId {
	const ids: readonly CO2ModeId[] = ['symmetric-stretch', 'bend', 'asymmetric-stretch'];
	if (!Number.isInteger(index) || index < 0 || index >= ids.length) {
		throw new Error(`mode index must be 0, 1 or 2, got ${index}`);
	}
	return ids[index];
}
