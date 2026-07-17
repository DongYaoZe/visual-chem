/**
 * Anchor data for the ternary system H2O–KNO3–NaNO3.
 *
 * Binary solubility tables in g of salt per 100 g of water:
 *  - KNO3: the classic evaluated series (identical in Seidell, "Solubilities
 *    of Inorganic and Organic Compounds", 2nd ed. 1919, p. 542 "average curve"
 *    and in the 人教版 grade-9 table students know), plus the 25 °C point from
 *    the CRC Handbook refit of Söhnel & Novotný 1985 (38.3; Armstrong & Eyre
 *    1910–11 measured 38.45). Values at ≥90 °C carry ≈2 % spread across
 *    sources (CRC gives 205.8 / 242.5 vs the classic 202 / 246).
 *  - NaNO3: the CRC Handbook series (Söhnel & Novotný refit; no IUPAC-grade
 *    evaluation is freely available and NaNO3 is not in the 人教版 core
 *    table). Note the folk value "180 at 100 °C" traces to Mulder's
 *    19th-century curve; modern evaluations agree on ≈175–176.
 *
 * Neither salt forms a hydrate over 0–100 °C, so one smooth curve per salt is
 * physically appropriate.
 */

/** g KNO3 per 100 g water: [temperature °C, solubility]. */
export const KNO3_SOLUBILITY_TABLE: readonly (readonly [number, number])[] = [
	[0, 13.3],
	[10, 20.9],
	[20, 31.6],
	[25, 38.3],
	[30, 45.8],
	[40, 63.9],
	[50, 85.5],
	[60, 110],
	[70, 138],
	[80, 169],
	[90, 202],
	[100, 246]
];

/** g NaNO3 per 100 g water: [temperature °C, solubility]. */
export const NANO3_SOLUBILITY_TABLE: readonly (readonly [number, number])[] = [
	[0, 73.0],
	[10, 79.9],
	[20, 87.3],
	[25, 91.2],
	[30, 95.3],
	[40, 104.1],
	[50, 113.7],
	[60, 123.7],
	[70, 135.3],
	[80, 147.5],
	[90, 161.1],
	[100, 176.2]
];

export interface CalibrationEutonic {
	temperatureC: number;
	kno3MolPerKg: number;
	nano3MolPerKg: number;
	source: string;
}

/**
 * Measured doubly-saturated (eutonic) solutions used to calibrate the salting
 * terms, sorted by temperature (molalities = g/100g × 10 / molar mass):
 *  - 10 °C: Kremann & Zitek 1909 (Sitzungsber. Akad. Wiss. Wien IIb 118, 59),
 *    tabulated in International Critical Tables vol. IV p. 365: 29.9 g KNO3 +
 *    83.0 g NaNO3 per 100 g water.
 *  - 25 °C: mean of three independent determinations — Cornec & Krombach 1928
 *    (via Purdon & Slater 1946, Table 15), Reinders 1915 (Z. Anorg. Allg.
 *    Chem. 93, 202, via ICT vol. IV p. 365) and Kremann & Zitek 1909:
 *    45.6 ± 1.8 g KNO3 + 100.7 ± 1.3 g NaNO3 per 100 g water.
 *  - 90 °C: Carroll, Craig & Wolery 2005 (Geochem. Trans. 6:19, Sec. IV),
 *    the authors' trend estimate bracketed by samples MS-20/MS-21.
 */
export const CALIBRATION_EUTONICS: readonly CalibrationEutonic[] = [
	{
		temperatureC: 10,
		kno3MolPerKg: 2.9574,
		nano3MolPerKg: 9.7653,
		source: 'Kremann & Zitek 1909, via Int. Crit. Tables IV p.365'
	},
	{
		temperatureC: 25,
		kno3MolPerKg: 4.5103,
		nano3MolPerKg: 11.8478,
		source: 'Mean of Cornec & Krombach 1928, Reinders 1915, Kremann & Zitek 1909'
	},
	{
		temperatureC: 90,
		kno3MolPerKg: 22,
		nano3MolPerKg: 20,
		source: 'Carroll 2005, doi:10.1186/1467-4866-6-19'
	}
];
