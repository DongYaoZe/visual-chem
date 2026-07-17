import { describe, expect, it } from 'vitest';
import {
	CARROLL_2005_BRINES,
	CARROLL_2005_EUTONIC_ESTIMATE,
	CARROLL_2005_TEMPERATURE_C
} from './carroll-2005-kno3-nano3';

describe('Carroll 2005 Table IV data integrity', () => {
	it('holds all 17 steady-state brines', () => {
		expect(CARROLL_2005_BRINES).toHaveLength(17);
		expect(new Set(CARROLL_2005_BRINES.map((brine) => brine.sample)).size).toBe(17);
	});

	it('closes the nitrate balance within the stated 5 % analytical closure', () => {
		for (const brine of CARROLL_2005_BRINES) {
			const cations = brine.naMolPerKg + brine.kMolPerKg;
			expect(Math.abs(brine.no3MolPerKg - cations) / brine.no3MolPerKg).toBeLessThan(0.05);
		}
	});

	it('labels branches consistently with the dominant cation', () => {
		for (const brine of CARROLL_2005_BRINES) {
			const xNa = brine.naMolPerKg / (brine.naMolPerKg + brine.kMolPerKg);
			if (brine.branch === 'kno3') expect(xNa).toBeLessThan(0.5);
			if (brine.branch === 'nano3') expect(xNa).toBeGreaterThan(0.5);
			if (brine.branch === 'eutonic-bracket') {
				expect(xNa).toBeGreaterThan(0.4);
				expect(xNa).toBeLessThan(0.6);
			}
		}
	});

	it('shows the deliquescence signature: the eutonic brackets sit at the lowest RH', () => {
		const bracketMax = Math.max(
			...CARROLL_2005_BRINES.filter((brine) => brine.branch === 'eutonic-bracket').map(
				(brine) => brine.relativeHumidityPct
			)
		);
		const branchMin = Math.min(
			...CARROLL_2005_BRINES.filter((brine) => brine.branch !== 'eutonic-bracket').map(
				(brine) => brine.relativeHumidityPct
			)
		);
		expect(bracketMax).toBeLessThan(branchMin);
	});

	it('keeps the authors’ eutonic estimate inside the MS-20/MS-21 bracket', () => {
		expect(CARROLL_2005_TEMPERATURE_C).toBe(90);
		const brackets = CARROLL_2005_BRINES.filter((brine) => brine.branch === 'eutonic-bracket');
		const naValues = brackets.map((brine) => brine.naMolPerKg);
		const kValues = brackets.map((brine) => brine.kMolPerKg);
		expect(CARROLL_2005_EUTONIC_ESTIMATE.nano3MolPerKg).toBeGreaterThan(Math.min(...naValues) - 1);
		expect(CARROLL_2005_EUTONIC_ESTIMATE.nano3MolPerKg).toBeLessThan(Math.max(...naValues) + 1);
		expect(CARROLL_2005_EUTONIC_ESTIMATE.kno3MolPerKg).toBeGreaterThan(Math.min(...kValues) - 1);
		expect(CARROLL_2005_EUTONIC_ESTIMATE.kno3MolPerKg).toBeLessThan(Math.max(...kValues) + 1);
	});
});
