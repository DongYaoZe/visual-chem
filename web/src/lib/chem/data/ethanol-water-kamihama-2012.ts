export interface IndependentValidationVlePoint {
	/** Liquid-phase ethanol mole fraction used to join ThermoML datasets 4 and 5. */
	x: number;
	/** Vapor-phase ethanol mole fraction measured at the same equilibrium state. */
	y: number;
	temperatureK: number;
	temperatureC: number;
	/** 95% expanded uncertainty reported for the temperature value by the ThermoML compiler. */
	temperatureUncertaintyK95: number;
	/** 95% expanded uncertainty reported for the vapor composition by the ThermoML compiler. */
	vaporCompositionUncertainty95: number;
}

/**
 * Independent validation evidence for the atmospheric ethanol-water system.
 *
 * This dataset is intentionally not part of the story's canonical experimental curve.
 * It is reserved for checking that conclusions drawn from Lai 2014 are reproducible in
 * measurements from a second laboratory.
 */
export const ETHANOL_WATER_KAMIHAMA_2012_VALIDATION = {
	id: 'ethanol-water-kamihama-2012-101.3-kpa-validation',
	role: 'independent-validation-only',
	pressureKPa: 101.3,
	points: [
		{
			x: 0.018,
			y: 0.18,
			temperatureK: 368.18,
			temperatureC: 95.03,
			temperatureUncertaintyK95: 1.76,
			vaporCompositionUncertainty95: 0.056
		},
		{
			x: 0.079,
			y: 0.418,
			temperatureK: 360.5,
			temperatureC: 87.35,
			temperatureUncertaintyK95: 1.18,
			vaporCompositionUncertainty95: 0.038
		},
		{
			x: 0.09,
			y: 0.441,
			temperatureK: 359.7,
			temperatureC: 86.55,
			temperatureUncertaintyK95: 1.21,
			vaporCompositionUncertainty95: 0.039
		},
		{
			x: 0.147,
			y: 0.51,
			temperatureK: 357.27,
			temperatureC: 84.12,
			temperatureUncertaintyK95: 0.39,
			vaporCompositionUncertainty95: 0.018
		},
		{
			x: 0.244,
			y: 0.567,
			temperatureK: 355.38,
			temperatureC: 82.23,
			temperatureUncertaintyK95: 0.25,
			vaporCompositionUncertainty95: 0.016
		},
		{
			x: 0.311,
			y: 0.589,
			temperatureK: 354.55,
			temperatureC: 81.4,
			temperatureUncertaintyK95: 0.19,
			vaporCompositionUncertainty95: 0.015
		},
		{
			x: 0.353,
			y: 0.604,
			temperatureK: 354.11,
			temperatureC: 80.96,
			temperatureUncertaintyK95: 0.16,
			vaporCompositionUncertainty95: 0.015
		},
		{
			x: 0.425,
			y: 0.627,
			temperatureK: 353.45,
			temperatureC: 80.3,
			temperatureUncertaintyK95: 0.15,
			vaporCompositionUncertainty95: 0.015
		},
		{
			x: 0.488,
			y: 0.652,
			temperatureK: 352.96,
			temperatureC: 79.81,
			temperatureUncertaintyK95: 0.13,
			vaporCompositionUncertainty95: 0.016
		},
		{
			x: 0.57,
			y: 0.688,
			temperatureK: 352.39,
			temperatureC: 79.24,
			temperatureUncertaintyK95: 0.13,
			vaporCompositionUncertainty95: 0.016
		},
		{
			x: 0.616,
			y: 0.713,
			temperatureK: 352.11,
			temperatureC: 78.96,
			temperatureUncertaintyK95: 0.12,
			vaporCompositionUncertainty95: 0.016
		},
		{
			x: 0.67,
			y: 0.736,
			temperatureK: 351.82,
			temperatureC: 78.67,
			temperatureUncertaintyK95: 0.11,
			vaporCompositionUncertainty95: 0.016
		},
		{
			x: 0.711,
			y: 0.76,
			temperatureK: 351.64,
			temperatureC: 78.49,
			temperatureUncertaintyK95: 0.1,
			vaporCompositionUncertainty95: 0.017
		},
		{
			x: 0.802,
			y: 0.819,
			temperatureK: 351.37,
			temperatureC: 78.22,
			temperatureUncertaintyK95: 0.09,
			vaporCompositionUncertainty95: 0.017
		},
		{
			x: 0.835,
			y: 0.844,
			temperatureK: 351.3,
			temperatureC: 78.15,
			temperatureUncertaintyK95: 0.09,
			vaporCompositionUncertainty95: 0.018
		},
		{
			x: 0.869,
			y: 0.873,
			temperatureK: 351.27,
			temperatureC: 78.12,
			temperatureUncertaintyK95: 0.09,
			vaporCompositionUncertainty95: 0.018
		},
		{
			x: 0.901,
			y: 0.9,
			temperatureK: 351.26,
			temperatureC: 78.11,
			temperatureUncertaintyK95: 0.09,
			vaporCompositionUncertainty95: 0.019
		},
		{
			x: 0.914,
			y: 0.912,
			temperatureK: 351.26,
			temperatureC: 78.11,
			temperatureUncertaintyK95: 0.09,
			vaporCompositionUncertainty95: 0.019
		},
		{
			x: 0.922,
			y: 0.92,
			temperatureK: 351.27,
			temperatureC: 78.12,
			temperatureUncertaintyK95: 0.09,
			vaporCompositionUncertainty95: 0.019
		},
		{
			x: 0.94,
			y: 0.937,
			temperatureK: 351.29,
			temperatureC: 78.14,
			temperatureUncertaintyK95: 0.09,
			vaporCompositionUncertainty95: 0.02
		},
		{
			x: 0.972,
			y: 0.969,
			temperatureK: 351.35,
			temperatureC: 78.2,
			temperatureUncertaintyK95: 0.09,
			vaporCompositionUncertainty95: 0.02
		}
	] satisfies IndependentValidationVlePoint[],
	provenance: {
		source: 'NIST ThermoML Data Archive',
		archiveDoi: '10.18434/mds2-2422',
		articleDoi: '10.1021/je2008704',
		articleTitle:
			'Isobaric Vapor-Liquid Equilibria for Ethanol + Water + Ethylene Glycol and Its Constituent Three Binary Systems',
		authors: [
			'Naoki Kamihama',
			'Hiroyuki Matsuda',
			'Kiyofumi Kurihara',
			'Katsumi Tochigi',
			'Shigeo Oba'
		],
		thermoMlUrl: 'https://trc.nist.gov/ThermoML/10.1021/je2008704.json',
		componentRegistry: { ethanol: 1, water: 3 },
		temperatureDataSet: 4,
		vaporCompositionDataSet: 5,
		confidenceLevelPercent: 95,
		transformedOn: '2026-07-16',
		transformation:
			'Joined datasets 4 and 5 by liquid ethanol mole fraction; converted K to C; no interpolation or smoothing.',
		thermoMlEmbeddedMd5: '47789dd277cb1ba535ebafc0ac5a23ab',
		rawJsonMd5: '50dd2066da7ce764683f96bde6cabb61',
		rawJsonSha256: '1a8a7a9238b3d127fb19c39bfe6e9701822e37e5b78d36f44fc4b14a48382a91',
		rawJsonBytes: 122933
	}
} as const;
