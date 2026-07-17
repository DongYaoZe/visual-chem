/**
 * Measured saturated brines in the KNO3–NaNO3–H2O system at 90 °C.
 *
 * Source: S. Carroll, L. Craig, T. J. Wolery, "Deliquescence of NaCl–NaNO3,
 * KNO3–NaNO3, and NaCl–KNO3 salt mixtures from 90 to 120 °C", Geochemical
 * Transactions 6(2), 19 (2005), Table IV. Open access,
 * doi:10.1186/1467-4866-6-19. Reversed-deliquescence steady states; relative
 * humidity ±3.1 %RH (2σ), analyzed molalities ±2 %.
 *
 * Conventions: molalities in mol per kg water. `branch` marks which solid the
 * brine equilibrated with; MS-20/MS-21 bracket the doubly-saturated (eutonic)
 * point — the exact eutonic was not sampled. Solution mass fractions derived
 * from these molalities assign the cations to their nitrate salts (Na→NaNO3,
 * K→KNO3); measured NO3 differs from Na+K by ≤5 % (analytical closure).
 */

export interface Carroll2005Brine {
	sample: string;
	relativeHumidityPct: number;
	naMolPerKg: number;
	kMolPerKg: number;
	no3MolPerKg: number;
	branch: 'kno3' | 'nano3' | 'eutonic-bracket';
}

export const CARROLL_2005_TEMPERATURE_C = 90;

export const CARROLL_2005_BRINES: readonly Carroll2005Brine[] = [
	{
		sample: 'MS-14A1',
		relativeHumidityPct: 65.5,
		naMolPerKg: 3.35,
		kMolPerKg: 18.15,
		no3MolPerKg: 22.02,
		branch: 'kno3'
	},
	{
		sample: 'MS-14A',
		relativeHumidityPct: 67.5,
		naMolPerKg: 1.44,
		kMolPerKg: 18.27,
		no3MolPerKg: 20.4,
		branch: 'kno3'
	},
	{
		sample: 'MS-14B',
		relativeHumidityPct: 67.4,
		naMolPerKg: 2.36,
		kMolPerKg: 17.93,
		no3MolPerKg: 20.82,
		branch: 'kno3'
	},
	{
		sample: 'MS-15A',
		relativeHumidityPct: 58.6,
		naMolPerKg: 18.81,
		kMolPerKg: 1.01,
		no3MolPerKg: 20.23,
		branch: 'nano3'
	},
	{
		sample: 'MS-15B',
		relativeHumidityPct: 58.3,
		naMolPerKg: 18.53,
		kMolPerKg: 1.12,
		no3MolPerKg: 20.47,
		branch: 'nano3'
	},
	{
		sample: 'MS-16A',
		relativeHumidityPct: 55.5,
		naMolPerKg: 20.36,
		kMolPerKg: 2.54,
		no3MolPerKg: 23.02,
		branch: 'nano3'
	},
	{
		sample: 'MS-16B',
		relativeHumidityPct: 55.2,
		naMolPerKg: 20.32,
		kMolPerKg: 3.33,
		no3MolPerKg: 23.36,
		branch: 'nano3'
	},
	{
		sample: 'MS-17A',
		relativeHumidityPct: 55.6,
		naMolPerKg: 10.77,
		kMolPerKg: 19.67,
		no3MolPerKg: 31.04,
		branch: 'kno3'
	},
	{
		sample: 'MS-17B3',
		relativeHumidityPct: 55.3,
		naMolPerKg: 10.94,
		kMolPerKg: 18.58,
		no3MolPerKg: 30.01,
		branch: 'kno3'
	},
	{
		sample: 'MS-18A',
		relativeHumidityPct: 50.3,
		naMolPerKg: 14.84,
		kMolPerKg: 20.16,
		no3MolPerKg: 35.47,
		branch: 'kno3'
	},
	{
		sample: 'MS-18B3',
		relativeHumidityPct: 50.4,
		naMolPerKg: 14.44,
		kMolPerKg: 19.72,
		no3MolPerKg: 33.66,
		branch: 'kno3'
	},
	{
		sample: 'MS-19A',
		relativeHumidityPct: 50.6,
		naMolPerKg: 21.4,
		kMolPerKg: 9.0,
		no3MolPerKg: 30.89,
		branch: 'nano3'
	},
	{
		sample: 'MS-19B',
		relativeHumidityPct: 50.7,
		naMolPerKg: 21.66,
		kMolPerKg: 9.8,
		no3MolPerKg: 31.84,
		branch: 'nano3'
	},
	{
		sample: 'MS-20A',
		relativeHumidityPct: 45.0,
		naMolPerKg: 18.67,
		kMolPerKg: 21.65,
		no3MolPerKg: 40.24,
		branch: 'eutonic-bracket'
	},
	{
		sample: 'MS-20B',
		relativeHumidityPct: 45.5,
		naMolPerKg: 19.71,
		kMolPerKg: 22.53,
		no3MolPerKg: 42.48,
		branch: 'eutonic-bracket'
	},
	{
		sample: 'MS-21A',
		relativeHumidityPct: 45.6,
		naMolPerKg: 22.82,
		kMolPerKg: 16.43,
		no3MolPerKg: 39.17,
		branch: 'eutonic-bracket'
	},
	{
		sample: 'MS-21B',
		relativeHumidityPct: 45.9,
		naMolPerKg: 22.54,
		kMolPerKg: 16.37,
		no3MolPerKg: 38.95,
		branch: 'eutonic-bracket'
	}
];

/**
 * The authors' trend-based estimate of the 90 °C eutonic brine (text, Sec. IV):
 * mutual deliquescence RH ≈ 42 %, X_Na ≈ 0.5, with the composition estimate
 * Na = 20, K = 22 mol/kg. Not a directly sampled point — MS-20/21 bracket it.
 */
export const CARROLL_2005_EUTONIC_ESTIMATE = {
	temperatureC: CARROLL_2005_TEMPERATURE_C,
	kno3MolPerKg: 22,
	nano3MolPerKg: 20
} as const;
