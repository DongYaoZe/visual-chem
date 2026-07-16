export interface ExperimentalVlePoint {
	/** Liquid-phase ethanol mole fraction. */
	x: number;
	/** Vapor-phase ethanol mole fraction measured at the same equilibrium state. */
	y: number;
	temperatureK: number;
	temperatureC: number;
	/** 95% expanded uncertainty reported by the ThermoML compiler. */
	temperatureUncertaintyK95: number;
	/** Null at pure-component endpoints where ThermoML reports no composition uncertainty. */
	vaporCompositionUncertainty95: number | null;
}

export interface ExperimentalAzeotropePoint {
	pressureKPa: number;
	x: number;
	y: number;
	temperatureK: number;
	temperatureC: number;
	compositionUncertainty95: number;
	temperatureUncertaintyK95: number;
	massFractionEthanol: number;
}

/**
 * Canonical atmospheric ethanol-water VLE evidence used by the first story.
 * Values are transcribed from the cited NIST ThermoML datasets without smoothing.
 */
export const ETHANOL_WATER_LAI_2014 = {
	id: 'ethanol-water-lai-2014-101.3-kpa',
	pressureKPa: 101.3,
	points: [
		{
			x: 0,
			y: 0,
			temperatureK: 373.15,
			temperatureC: 100,
			temperatureUncertaintyK95: 0.13,
			vaporCompositionUncertainty95: null
		},
		{
			x: 0.015,
			y: 0.139,
			temperatureK: 369.27,
			temperatureC: 96.12,
			temperatureUncertaintyK95: 0.45,
			vaporCompositionUncertainty95: 0.015
		},
		{
			x: 0.035,
			y: 0.261,
			temperatureK: 365.61,
			temperatureC: 92.46,
			temperatureUncertaintyK95: 0.25,
			vaporCompositionUncertainty95: 0.008
		},
		{
			x: 0.1,
			y: 0.436,
			temperatureK: 359.79,
			temperatureC: 86.64,
			temperatureUncertaintyK95: 0.18,
			vaporCompositionUncertainty95: 0.007
		},
		{
			x: 0.183,
			y: 0.525,
			temperatureK: 356.66,
			temperatureC: 83.51,
			temperatureUncertaintyK95: 0.14,
			vaporCompositionUncertainty95: 0.006
		},
		{
			x: 0.292,
			y: 0.585,
			temperatureK: 354.88,
			temperatureC: 81.73,
			temperatureUncertaintyK95: 0.14,
			vaporCompositionUncertainty95: 0.005
		},
		{
			x: 0.394,
			y: 0.611,
			temperatureK: 353.89,
			temperatureC: 80.74,
			temperatureUncertaintyK95: 0.13,
			vaporCompositionUncertainty95: 0.005
		},
		{
			x: 0.501,
			y: 0.648,
			temperatureK: 353.06,
			temperatureC: 79.91,
			temperatureUncertaintyK95: 0.13,
			vaporCompositionUncertainty95: 0.005
		},
		{
			x: 0.543,
			y: 0.669,
			temperatureK: 352.73,
			temperatureC: 79.58,
			temperatureUncertaintyK95: 0.13,
			vaporCompositionUncertainty95: 0.005
		},
		{
			x: 0.631,
			y: 0.714,
			temperatureK: 352.04,
			temperatureC: 78.89,
			temperatureUncertaintyK95: 0.13,
			vaporCompositionUncertainty95: 0.005
		},
		{
			x: 0.749,
			y: 0.781,
			temperatureK: 351.67,
			temperatureC: 78.52,
			temperatureUncertaintyK95: 0.13,
			vaporCompositionUncertainty95: 0.005
		},
		{
			x: 0.794,
			y: 0.814,
			temperatureK: 351.64,
			temperatureC: 78.49,
			temperatureUncertaintyK95: 0.13,
			vaporCompositionUncertainty95: 0.005
		},
		{
			x: 0.848,
			y: 0.855,
			temperatureK: 351.4,
			temperatureC: 78.25,
			temperatureUncertaintyK95: 0.13,
			vaporCompositionUncertainty95: 0.005
		},
		{
			x: 0.899,
			y: 0.898,
			temperatureK: 351.33,
			temperatureC: 78.18,
			temperatureUncertaintyK95: 0.13,
			vaporCompositionUncertainty95: 0.005
		},
		{
			x: 0.949,
			y: 0.946,
			temperatureK: 351.37,
			temperatureC: 78.22,
			temperatureUncertaintyK95: 0.13,
			vaporCompositionUncertainty95: 0.005
		},
		{
			x: 1,
			y: 1,
			temperatureK: 351.45,
			temperatureC: 78.3,
			temperatureUncertaintyK95: 0.13,
			vaporCompositionUncertainty95: null
		}
	] satisfies ExperimentalVlePoint[],
	azeotrope: {
		pressureKPa: 101.3,
		x: 0.891,
		y: 0.891,
		temperatureK: 351.32,
		temperatureC: 78.17,
		compositionUncertainty95: 0.004,
		temperatureUncertaintyK95: 0.23,
		massFractionEthanol: 0.9543446629
	} satisfies ExperimentalAzeotropePoint,
	provenance: {
		source: 'NIST ThermoML Data Archive',
		archiveDoi: '10.18434/mds2-2422',
		articleDoi: '10.1016/j.jct.2013.08.020',
		thermoMlUrl: 'https://trc.nist.gov/ThermoML/10.1016/j.jct.2013.08.020.json',
		temperatureDataSet: 9,
		vaporCompositionDataSet: 10,
		azeotropeTemperatureDataSet: 11,
		azeotropeCompositionDataSet: 12,
		transformedOn: '2026-07-16',
		transformation:
			'Joined datasets 9 and 10 by liquid ethanol mole fraction; converted K to C; no interpolation or smoothing.',
		thermoMlMd5: 'cedcf928fcdca39df77eaa6b3146dc27',
		thermoMlXmlSha256: '9ade859fa53eb443bb45a75f14e742056f0fb137bbfdf5fdc93dfa05d614a11a'
	}
} as const;
