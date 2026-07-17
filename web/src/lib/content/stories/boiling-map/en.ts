import type { BoilingMapStoryContent } from '../../types';

export const enBoilingMapContent = {
	locale: 'en',
	seo: {
		title: 'A Map of Boiling — VisualChem',
		description:
			'From a pot of noodles in Lhasa to freeze-dried strawberries and pressure cookers: water’s pressure–temperature phase map, computed point by point in your browser from the IAPWS formulations.',
		path: '/en/stories/boiling-map/',
		alternateLocalePath: '/stories/boiling-map/',
		type: 'article',
		image: '/og-boiling-map.png',
		imageAlt:
			'VisualChem narrative cover combining water’s pressure–temperature phase diagram, a stovetop pot, and the molecular race view',
		publishedTime: '2026-07-17',
		modifiedTime: '2026-07-17'
	},
	hero: {
		eyebrow: 'PHASE EQUILIBRIUM · STORY 02',
		metadata: ['About 10 minutes', 'One-component phase equilibrium', 'Interactive alpha'],
		heading: {
			lines: ['A map of'],
			emphasis: 'boiling'
		},
		ledeLines: [
			'In Lhasa, water rolls before it reaches 90 °C.',
			'A map that computes itself can explain every exception in the kitchen.'
		],
		scrollCue: 'Scroll down — make your prediction first',
		curveEvidence: 'Lhasa, 3650 m · boils near 88 °C'
	},
	readingNote: {
		eyebrow: 'HOW TO READ',
		body: [
			{ text: 'The stage on the right is driven by one (T, p) state: the ' },
			{ text: 'macro', emphasis: 'strong' },
			{ text: ' stovetop shows what the water is doing, the ' },
			{ text: 'micro', emphasis: 'strong' },
			{ text: ' surface explains why, and the ' },
			{ text: 'symbolic', emphasis: 'strong' },
			{ text: ' diagram maps the whole territory.' }
		]
	},
	stage: {
		dialogAriaLabel: 'Current scene graphic',
		closeGraphicAriaLabel: 'Close the graphic',
		triViewAriaLabel: 'Triple-representation stage for the current scene',
		shortStateAriaLabel: 'Current graphic state',
		openGraphicButton: 'View graphic',
		shortState: {
			temperature: ({ temperatureC }) => `T ${temperatureC} °C`,
			pressure: ({ pressureKPa }) => `p ${pressureKPa} kPa`,
			phase: ({ phase }) => `${phase}`
		}
	},
	scenes: [
		{
			id: 'hook',
			kicker: '00 · The hook',
			title: 'In Lhasa, water boils shy of 90 °C.',
			paragraphs: [
				'At 3650 meters, a pot of water rolls at about 88 °C. Noodles stay stubborn however long you cook them — not because the flame is weak, but because the “boiling water” itself is not hot enough.',
				'Make a call first: same water, same flame — is boiling water at altitude hotter, exactly as hot, or cooler than at sea level? Then let the water speak for itself.'
			]
		},
		{
			id: 'invisible-race',
			kicker: '01 · The invisible race',
			title: 'Above every liquid surface, a two-way race.',
			paragraphs: [
				'At any temperature, molecules escape the surface into the vapor while others are captured back. In a closed container the two flows eventually balance — the vapor pressure that settles above the surface is the saturation pressure.',
				'It depends on temperature alone: heating backs the escaping side, and the balance point climbs. At 25 °C water’s saturation pressure is about 3.2 kPa — far below the atmosphere, so the surface looks calm, yet evaporation never stops.'
			],
			formula: String.raw`p^*=p^*(T)`
		},
		{
			id: 'draw-the-curve',
			kicker: '02 · Connect the points',
			title: 'At every temperature, water names a pressure.',
			paragraphs: [
				'Record temperature–saturation-pressure pairs and a curve surfaces in the p–T plane. It is not a sketch: the IAPWS industrial-standard equations are computing this line point by point in your browser.',
				'Drag the temperature and watch the state point climb. The growth steepens relentlessly — this near-exponential curve hides a straight line, which scene 4 will reveal.'
			]
		},
		{
			id: 'boiling-defined',
			kicker: '03 · Boiling, defined',
			title: 'Boiling is the moment vapor pressure catches the outside.',
			paragraphs: [
				'For a bubble to live inside the liquid, the steam within it pushes out at p*(T) while the atmosphere squeezes back. While p* < P every bubble collapses on the spot and water can only evaporate from its surface; the instant p*(T) = P, bubbles stand their ground — the whole pot rolls.',
				'So the “boiling point” was never one number. It is the outcome of a negotiation, and the outside pressure has the final word. Move the pressure line and the intersection slides along the curve.'
			],
			formula: String.raw`p^*(T_b)=P`
		},
		{
			id: 'straighten-the-curve',
			kicker: '04 · Straighten the curve',
			title: 'Change coordinates, and the exponential turns straight.',
			paragraphs: [
				'Plot ln p against 1/T and the steep curve flattens into nearly a line — the promise of the Clausius–Clapeyron equation, whose slope equals −ΔH·R⁻¹.',
				'Inside the steepness hides a measurable quantity: the enthalpy of vaporization, about 41 kJ/mol — the energy toll for sending one mole of water off the surface. The approximation treats steam as an ideal gas and reads ~1.5% high near 100 °C; an honest map labels its own error.'
			],
			formula: String.raw`\ln p=-\frac{\Delta H_{\mathrm{vap}}}{R}\cdot\frac{1}{T}+C`
		},
		{
			id: 'complete-the-map',
			kicker: '05 · The map completes',
			title: 'Three boundaries, one territory.',
			paragraphs: [
				'The boiling line is not alone: ice and vapor share a sublimation line, ice and liquid a melting line. All three meet at 0.01 °C and 611.657 Pa — the triple point, the only state where ice, water, and steam coexist; the kelvin was once defined from it.',
				'Watch the melting line: nearly vertical, and leaning left — pressure helps ice melt, water’s famous anomaly. At the far end the boiling line stops at 373.95 °C and 22.06 MPa, the critical point, where “liquid” and “gas” cease to differ.'
			],
			formula: String.raw`\frac{\mathrm{d}p}{\mathrm{d}T}=\frac{\Delta H}{T\,\Delta V}`
		},
		{
			id: 'altitude-travel',
			kicker: '06 · Travel by altitude',
			title: 'Take the map on a journey.',
			paragraphs: [
				'Climb, and the ambient pressure falls along the standard-atmosphere model; the horizontal pressure line sinks, and its intersection with the boiling curve slides toward lower temperature. Denver: about 95 °C. Lhasa: about 88 °C. Everest base camp: about 70 °C — tea that scalds, already boiling.',
				'Your opening prediction now has its answer: boiling water at altitude really is cooler. What cooking lacks up there is not flame — it is pressure.'
			]
		},
		{
			id: 'freeze-dry-detour',
			kicker: '07 · The freeze-dry detour',
			title: 'Lose the water without ever passing through liquid.',
			paragraphs: [
				'Freeze-dried strawberries follow a detour: freeze at ambient pressure, pump the chamber down to tens of pascals, then warm gently. The state point swings below the triple point, and ice turns straight into vapor — it never melts.',
				'This is what reading the diagram as a map means: same start, same destination, different routes — and which boundary a route crosses decides what the material endures. No liquid water tears the cells, so the fruit recognizes itself after rehydration.'
			]
		},
		{
			id: 'pressure-cooker',
			kicker: '08 · Run it in reverse',
			title: 'The pressure cooker pushes the crossing toward heat.',
			paragraphs: [
				'The mountain problem, inverted, becomes a kitchen solution: a locked lid traps steam until the pot holds about two atmospheres, the boiling point rises to about 120 °C, and stews cook several times faster — the same map, traveled the other way.',
				'From noodles in Lhasa to the cooker on your stove, you used one sentence: the boiling point is where p*(T) meets the outside pressure. The map was never memorized. It was computed.'
			]
		}
	],
	interactions: {
		hook: {
			prompt: 'Predict: boiling water at altitude is',
			choices: [{ label: 'Hotter' }, { label: 'Exactly 100 °C' }, { label: 'Cooler' }],
			evidence:
				'Under the standard atmosphere, 3650 m means about 64 kPa — and water boils near 88 °C. “100 °C” is not water’s nature; it is sea level’s coincidence.'
		},
		drawTheCurve: {
			controlLabel: 'Temperature T',
			sliderAriaLabel: 'Choose a temperature along the saturation line',
			readout: ({ temperatureC, pressureKPa }) => `T = ${temperatureC} °C · p* = ${pressureKPa} kPa`
		},
		boilingDefined: {
			controlLabel: 'External pressure P',
			sliderAriaLabel: 'Set the external pressure',
			scale: {
				start: '5 kPa · near vacuum',
				end: '250 kPa · pressure cooker'
			},
			readout: ({ pressureKPa, temperatureC }) =>
				`At ${pressureKPa} kPa, water boils at ${temperatureC} °C`
		},
		straighten: {
			toggleLabel: 'Coordinates',
			mapButton: 'p–T map',
			linearizedButton: 'ln p — 1/T',
			enthalpyReadout: ({ enthalpyKJ }) => `The slope reads ΔH ≈ ${enthalpyKJ} kJ/mol`
		},
		altitude: {
			controlLabel: 'Altitude',
			sliderAriaLabel: 'Choose an altitude',
			landmarks: {
				'sea-level': 'Sea level',
				denver: 'Denver',
				lhasa: 'Lhasa',
				everest: 'Everest'
			},
			readout: ({ altitudeM, pressureKPa, temperatureC }) =>
				`${altitudeM} m · ambient ${pressureKPa} kPa · boils at ${temperatureC} °C`
		},
		freezeDry: {
			controlLabel: 'Freeze-drying programme',
			sliderAriaLabel: 'Advance the freeze-drying programme',
			stages: ['① Freeze at ambient', '② Evacuate', '③ Sublimate'],
			readout: ({ temperatureC, pressureKPa }) => `T = ${temperatureC} °C · p = ${pressureKPa} kPa`
		},
		pressureCooker: {
			controlLabel: 'Pot pressure',
			sliderAriaLabel: 'Set the pressure inside the cooker',
			scale: {
				start: '101 kPa · open pot',
				end: '250 kPa · relief valve'
			},
			readout: ({ pressureKPa, temperatureC }) => `${pressureKPa} kPa → boils at ${temperatureC} °C`
		}
	},
	triView: {
		defaultAriaLabel: 'Triple-representation stage for water’s pressure–temperature state',
		liveSummary: ({ temperatureC, pressureKPa, phase }) =>
			`Current state: ${temperatureC} °C at ${pressureKPa} kPa — ${phase}.`,
		synchronizedState: 'One state · three views',
		temperature: 'Temperature',
		pressure: 'Pressure',
		phase: 'Phase',
		boilingPoint: 'Boiling point here',
		phaseNames: {
			solid: 'Ice',
			liquid: 'Liquid water',
			vapor: 'Water vapor',
			supercritical: 'Supercritical'
		},
		kitchen: {
			ariaLabel: 'Stovetop view',
			viewName: 'Macro · stovetop',
			caption: 'Flame and bubbles are illustrative; whether it boils is computed.',
			altitudeLabel: ({ altitudeM }) => `Altitude ${altitudeM} m`,
			boilingLabel: ({ temperatureC }) => `Boils at ${temperatureC} °C`,
			waterState: ({ temperatureC }) => `Water at ${temperatureC} °C`
		},
		race: {
			ariaLabel: 'Molecular race at the liquid surface',
			viewName: 'Micro · above the surface',
			caption:
				'The escape/return flow ratio comes from the vapor-pressure computation; particle motion is illustrative, not molecular dynamics.',
			escapeLabel: 'Escape',
			returnLabel: 'Return'
		},
		map: {
			ariaLabel: ({ temperatureC, pressureKPa, phase }) =>
				`Water pressure–temperature phase diagram; current state ${temperatureC} °C at ${pressureKPa} kPa, in the ${phase} region`,
			xAxis: 'Temperature T / °C',
			xAxisLinearized: '1000 / T · K⁻¹',
			yAxis: 'Pressure p / kPa · log scale',
			yAxisLinearized: 'ln (p / kPa)',
			regions: {
				solid: 'Ice',
				liquid: 'Liquid',
				vapor: 'Vapor'
			},
			triplePoint: 'Triple point',
			criticalPoint: 'Critical point',
			boilingLine: 'Vaporization',
			sublimationLine: 'Sublimation',
			meltingLine: 'Melting',
			externalPressure: 'Ambient',
			caption: {
				map: 'All three boundaries computed point by point from the IAPWS formulations; the pressure axis is logarithmic.',
				linearized: 'ln p against 1/T: the vaporization line is nearly straight, slope −ΔH·R⁻¹.'
			},
			captionKind: 'MODEL'
		}
	},
	edge: {
		eyebrow: 'THE EDGE OF THE MAP',
		heading: {
			lines: ['Where the map ends,', '“liquid” and “gas” lose their difference.']
		},
		body: 'Follow the boiling line right: the liquid grows lighter, the vapor denser, until at the critical point their densities meet and the interface vanishes. Beyond lies supercritical water — working territory for power-plant boilers and green extraction. The line stops not because the cartographer tired, but because there are no longer two phases to separate.',
		criticalFacts: [
			{ label: 'Critical temperature', value: '373.95 °C' },
			{ label: 'Critical pressure', value: '22.064 MPa ≈ 218 atm' },
			{ label: 'Triple point', value: '0.01 °C · 611.657 Pa' }
		],
		figureCaption:
			'Critical- and triple-point values from IAPWS-IF97; the boundaries are computed in the browser.'
	},
	conceptCheck: {
		question:
			'Why can freeze-drying turn ice directly into vapor without liquid water ever appearing?',
		options: [
			{ label: 'The vacuum breaks the hydrogen bonds between water molecules' },
			{
				label:
					'The chamber pressure is below the triple point, so the heating path crosses the sublimation line and never enters the liquid region'
			},
			{ label: 'The ice actually melts first, just too quickly to see' },
			{ label: 'The machine keeps everything too cold for liquid water to exist' }
		],
		correctIndex: 1,
		explanation:
			'Liquid water’s territory has a floor: the triple-point pressure, 611.657 Pa. Below it, a horizontal heating path can only cross the sublimation line, and the solid passes straight into vapor.'
	},
	sandbox: {
		eyebrow: 'FREE PLAY · leave the story with a question',
		title: 'The whole map is yours.',
		introduction:
			'Both dials — temperature and pressure — are in your hands. Watch which region the state point lands in, how the boiling readout follows the pressure, and which boundary stands between you and where you want to go.',
		controls: {
			temperature: 'Temperature T',
			temperatureAriaLabel: 'Temperature for free exploration',
			pressure: 'Pressure p · log',
			pressureAriaLabel: 'Pressure for free exploration',
			pressureScale: {
				start: '0.1 kPa',
				end: '10 MPa'
			}
		},
		challengeLabel: 'Try this',
		challenge:
			'Make 25 °C water boil: how far must the pressure fall? Every rotary evaporator in a lab does exactly this.',
		triViewAriaLabel: 'Free-exploration triple-representation lab'
	},
	modelCard: {
		eyebrow: 'MODEL CARD · V0.1',
		heading: {
			lines: ['What this map knows,', 'and what it doesn’t.']
		},
		items: [
			{
				title: 'Vaporization line: IAPWS-IF97 region 4',
				body: [
					{
						text: 'Saturation pressure and temperature use the analytic IAPWS-IF97 region-4 equations, exactly consistent in both directions; unit tests pin the official verification values (300 K → 3.536 59 kPa and two more) and the 100 °C boil at one atmosphere.'
					}
				],
				openByDefault: true,
				links: [
					{
						label: 'IAPWS R7-97(2012) release ↗',
						href: 'https://iapws.org/documents/release/IF97-Rev'
					}
				]
			},
			{
				title: 'Solid boundaries: IAPWS R14-08(2011)',
				body: [
					{
						text: 'The ice Ih melting and sublimation curves follow the 2011 revised release; tests pin the official values (138.268 MPa at 260 K; 8.947 Pa at 230 K) and check that all three lines meet at the triple point. The high-pressure ices III–VII lie beyond this map.'
					}
				],
				openByDefault: true,
				links: [
					{
						label: 'IAPWS R14-08(2011) release ↗',
						href: 'https://iapws.org/documents/release/MeltSub2011'
					}
				]
			},
			{
				title: 'Altitude: the International Standard Atmosphere',
				body: [
					{
						text: 'Altitude–pressure conversion uses the 0–11 km segment of the International Standard Atmosphere. Real weather swings pressure by a few percent, so mountain boiling points drift with it; the numbers in the text are standard-atmosphere values.'
					}
				],
				openByDefault: false
			},
			{
				title: 'What not to infer from this',
				body: [
					{
						text: 'The Clausius–Clapeyron slope readout treats steam as an ideal gas and ignores the liquid volume — about 1.5% high near 100 °C. The map excludes solutes (boiling-point elevation, freezing-point depression) and says nothing about heat-transfer rates: “how long until it boils” is a different question.'
					}
				],
				openByDefault: false
			}
		]
	},
	ending: {
		lead: 'You did not just memorize a phase diagram.',
		heading: {
			lines: ['You computed every boundary,', 'then planned three journeys across it.']
		},
		catalogLink: 'Back to the catalog',
		sourceLink: 'View the computation and source ↗'
	}
} satisfies BoilingMapStoryContent;

export default enBoilingMapContent;
