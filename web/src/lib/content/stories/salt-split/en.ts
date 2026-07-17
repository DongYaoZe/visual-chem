import type { SaltSplitStoryContent } from '../../types';

export const enSaltSplitContent = {
	locale: 'en',
	seo: {
		title: 'A Pot of Brine, Split in Two — VisualChem',
		description:
			'Two salts dissolve into one pot of water — can you coax them back out one at a time? The ternary salt–water phase map is computed point by point in your browser: cool out the KNO3, evaporate out the NaNO3, and plan the whole act on one triangle.',
		path: '/en/stories/salt-split/',
		alternateLocalePath: '/stories/salt-split/',
		type: 'article',
		image: '/og-salt-split.png',
		imageAlt:
			'VisualChem story cover with a ternary salt–water phase triangle, a crystallizing beaker, and an ion view',
		publishedTime: '2026-07-17',
		modifiedTime: '2026-07-17'
	},
	hero: {
		eyebrow: 'PHASE EQUILIBRIUM · STORY 03',
		metadata: ['About 12 minutes', 'Ternary salt–water system', 'Interactive alpha'],
		heading: {
			lines: ['A pot of brine,'],
			emphasis: 'split in two'
		},
		ledeLines: [
			'Once two salts dissolve into the same water, are they mixed for good?',
			'A triangular map shows how to usher them out — one at a time.'
		],
		scrollCue: 'Scroll down and place your prediction first',
		curveEvidence: '25 °C isotherm · computed point by point from solubility data'
	},
	readingNote: {
		eyebrow: 'HOW TO READ',
		body: [
			{ text: 'The stage on the right is driven by one pot state (T, recipe): the ' },
			{ text: 'macroscopic', emphasis: 'strong' },
			{ text: ' beaker shows what is happening, the ' },
			{ text: 'microscopic', emphasis: 'strong' },
			{ text: ' ions explain why, and the ' },
			{ text: 'symbolic', emphasis: 'strong' },
			{ text: ' triangle maps the territory of every possible recipe.' }
		]
	},
	stage: {
		dialogAriaLabel: 'Graphic for the current scene',
		closeGraphicAriaLabel: 'Close the current graphic',
		triViewAriaLabel: 'Triple-representation stage for the current scene',
		shortStateAriaLabel: 'Current graphic state',
		openGraphicButton: 'View current graphic',
		shortState: {
			temperature: ({ temperatureC }) => `T ${temperatureC} °C`,
			liquid: ({ kno3G, nano3G }) => `Liquid K ${kno3G} g · Na ${nano3G} g`,
			solids: ({ summary }) => `${summary}`
		}
	},
	scenes: [
		{
			id: 'hook',
			kicker: '00 · The hook',
			title: 'One pot of water, two dissolved salts.',
			paragraphs: [
				'100 grams of potassium nitrate and 100 grams of sodium nitrate, dissolved into 100 grams of near-boiling water — everything dissolves into one clear, heavy broth. K⁺, Na⁺ and NO₃⁻ mingle without a trace of loyalty.',
				'Now turn off the heat and let it fall to 25 °C. Place your bet first: what will the crystals be?'
			]
		},
		{
			id: 'two-curves',
			kicker: '01 · Steep and not so steep',
			title: 'Both salts love hot water — to wildly different degrees.',
			paragraphs: [
				'From 0 to 100 °C, 100 g of water goes from holding 13.3 g of KNO3 to 246 g — more than eighteenfold. NaNO3 climbs from 73 g to about 176 g: not even two and a half times.',
				'In other words: cold is a catastrophe for KNO3 and a mere discount for NaNO3. Cooling crystallization favors the salt with the steep curve — the first prop of the act. But with two salts in one water, the story is subtler than two separate curves.'
			]
		},
		{
			id: 'shared-water',
			kicker: '02 · One water, not two pots',
			title: 'Two salts share a single crowd of nitrate.',
			paragraphs: [
				'Dissolution equilibrium watches a product of ions: the concentration of K⁺ times the concentration of NO₃⁻, and crystals fall once it tops out. But NO₃⁻ never asks which salt it came from — nitrate contributed by NaNO3 crowds the very same product.',
				'Add NaNO3 to a saturated KNO3 solution and, before anything visibly happens, the room left for KNO3 has already shrunk. That is the common-ion effect: not two curves side by side, but one web of mutual restraint. (This is the ideal-solution first lesson; real brines stage a reversal in scene 08.)'
			],
			formula: String.raw`K_{sp}=m_{\mathrm{K^+}}\cdot m_{\mathrm{NO_3^-}}`
		},
		{
			id: 'triangle-map',
			kicker: '03 · From lines to a triangle',
			title: 'Three components, one triangular map.',
			paragraphs: [
				'Water, KNO3, NaNO3 — three mass fractions that always sum to 100 %. Fix two and the third follows, so every possible recipe tiles exactly one triangle: the vertices are pure substances, the edges are binary mixtures, and every interior point is one definite pot of brine.',
				'Your pot is a single point near the middle. Every operation to come — cooling, evaporating, diluting, filtering — will leave a track on this map.'
			]
		},
		{
			id: 'isotherm',
			kicker: '04 · The borders at 25 °C',
			title: 'One isotherm divides the triangle into four territories.',
			paragraphs: [
				'At 25 °C the dissolution equilibria draw two saturation branches. On the water side lies the sea of unsaturated solution; cross the KNO3 border and you enter its crystallization field, where every pot rains pure KNO3; the NaNO3 side mirrors it.',
				'The two branches meet at one point: the eutonic E. Together with the two salt vertices it fences off the two-salt valley — where both crystals fall together and the trick collapses. The whole act is about keeping your track out of that valley.'
			]
		},
		{
			id: 'cooling',
			kicker: '05 · The point stays, the map moves',
			title: 'When you cool the pot, the borders sweep past it.',
			paragraphs: [
				'Cooling changes no recipe: the overall-composition point does not move an inch. The borders move instead. From 100 °C down to 25 °C, the KNO3 field expands dramatically and sweeps across your pot — pure KNO3 crystals begin to fall.',
				'The pot is now two points: crystals at the KNO3 vertex, mother liquor sliding along the saturation border. Overall point, liquor and vertex stay on one straight line, and its split ratio is your yield. The NaNO3 border never touches your pot down to 25 °C — but only just: the liquor halts one step from the eutonic. A few degrees greedier and the second crystal follows. The classic recipe stops here for a reason.'
			]
		},
		{
			id: 'filter-jump',
			kicker: '06 · Filtration is teleportation',
			title: 'Scoop out the crystals, and the pot jumps.',
			paragraphs: [
				'Filtration does exactly one thing: it removes the crystals from the system. The overall composition leaps instantly from where it was to the mother-liquor point — a teleport on the map.',
				'That is the mechanism of the whole act: crystallization splits one point into “crystals” and “liquor”, and filtration chooses which one you keep. The first bottle already holds nearly pure KNO3; what remains in the pot is a liquor that is mostly NaNO3.'
			]
		},
		{
			id: 'evaporate',
			kicker: '07 · Walking away from water',
			title: 'Evaporation walks the pot straight away from the water vertex.',
			paragraphs: [
				'Reheat to 100 °C and boil water off. The rule on the map is simple: losing water moves the overall composition along the straight ray pointing away from the water vertex — the salt ratio stays fixed while everything concentrates.',
				'The first border that ray hits belongs to NaNO3: pure sodium nitrate starts to fall, while KNO3 — absurdly soluble at 100 °C — sits tight in the liquid. A second filtration fills the second bottle. But do not overshoot: the ray ends in the two-salt valley, and the last few greedy grams of water would drag KNO3 out too.'
			]
		},
		{
			id: 'honest-map',
			kicker: '08 · How true is this map?',
			title: 'Press the model against measured brines.',
			paragraphs: [
				'Open the map at 90 °C, where a Livermore lab measured 17 saturated brines in 2005 (Carroll et al., reversed deliquescence, concentrations to ±2 %). Now switch to the ideal model: with ion–ion interactions ignored, the borders shrink inward and leave the measured points far outside — and the ideal model would even convict the opening pot of mixed crystals at 25 °C.',
				'The calibrated model multiplies each equilibrium by an empirical salting term, pinned by measured eutonics at 10, 25 and 90 °C. Once pinned, it tracks the century-old 25 °C branches to within about ten percent and the 17 hot brines to an RMS near 9 %. No shame in that: the Yucca Mountain project’s professional Pitzer database once missed the same eutonic by a factor of two. An honest map declares what pins it.'
			],
			formula: String.raw`K_{sp}^{\mathrm{eff}}=K_{sp}\,(1+\beta\,m_{\mathrm{other}})`
		}
	],
	interactions: {
		hook: {
			prompt: 'Predict first: at 25 °C the crystals will be',
			choices: [{ label: 'Only KNO3' }, { label: 'Only NaNO3' }, { label: 'A mixture of both' }],
			evidence:
				'Experiment and the calibrated model agree: about 54 g of crystals fall, almost all of it pure KNO3 — not a gram of NaNO3 leaves the liquor. Cold is only a catastrophe for the steep-curve salt.'
		},
		twoCurves: {
			controlLabel: 'Temperature T',
			sliderAriaLabel: 'Choose a temperature along the solubility curves',
			readout: ({ temperatureC, kno3Solubility, nano3Solubility }) =>
				`${temperatureC} °C: 100 g water holds KNO3 ${kno3Solubility} g · NaNO3 ${nano3Solubility} g`
		},
		sharedWater: {
			controlLabel: 'Add NaNO3',
			sliderAriaLabel: 'Add sodium nitrate to a saturated potassium nitrate solution',
			scale: {
				start: '0 g · KNO3 alone',
				end: '80 g · crowded nitrate'
			},
			readout: ({ nano3G, kno3CapacityG, soloCapacityG }) =>
				`With ${nano3G} g NaNO3 added, 100 g water now holds only ${kno3CapacityG} g KNO3 (alone: ${soloCapacityG} g)`
		},
		triangleMap: {
			kno3ControlLabel: 'KNO3 / g',
			kno3SliderAriaLabel: 'Set the mass of potassium nitrate in the pot',
			nano3ControlLabel: 'NaNO3 / g',
			nano3SliderAriaLabel: 'Set the mass of sodium nitrate in the pot',
			readout: ({ waterPct, kno3Pct, nano3Pct }) =>
				`Water ${waterPct}% · KNO3 ${kno3Pct}% · NaNO3 ${nano3Pct}%`
		},
		isotherm: {
			regionReadout: ({ region }) => `Current territory: ${region}`,
			crystalReadout: ({ summary }) => `${summary}`
		},
		cooling: {
			controlLabel: 'Temperature T',
			sliderAriaLabel: 'Cool the whole pot',
			readout: ({ temperatureC, kno3CrystalsG }) =>
				`${temperatureC} °C · pure KNO3 crystallized: ${kno3CrystalsG} g`
		},
		filterJump: {
			filterButton: 'Filter: collect the crystals',
			resetButton: 'Refill the pot',
			waitingHint: 'The crystals have settled — press the button to sweep them into bottle one.',
			harvestOutput: ({ crystalsG }) =>
				`Bottle one: pure KNO3, ${crystalsG} g. The pot teleports to the liquor point.`
		},
		evaporate: {
			controlLabel: 'Water evaporated',
			sliderAriaLabel: 'Evaporate water at 100 °C',
			readout: ({ waterRemovedG, nano3CrystalsG }) =>
				`${waterRemovedG} g water gone · pure NaNO3 crystallized: ${nano3CrystalsG} g`
		},
		honestMap: {
			toggleLabel: 'Model',
			idealButton: 'Ideal common-ion',
			calibratedButton: 'Calibrated',
			verdictIdeal:
				'Ideal model: the borders shrink and abandon the measured points; the opening pot would be misjudged as mixed crystals.',
			verdictCalibrated:
				'Calibrated model: the measured eutonics at 10, 25 and 90 °C are pinned exactly, and the opening prediction holds.'
		}
	},
	triView: {
		defaultAriaLabel: 'Triple-representation stage for the salt–water ternary system',
		liveSummary: ({ temperatureC, liquidKno3G, liquidNano3G, region }) =>
			`Current state: ${temperatureC} °C, liquid holds ${liquidKno3G} g KNO3 and ${liquidNano3G} g NaNO3, ${region}.`,
		synchronizedState: 'One pot · three representations',
		temperature: 'Temperature',
		liquidKno3: 'Liquid KNO3',
		liquidNano3: 'Liquid NaNO3',
		region: 'Territory',
		gramsValue: ({ grams }) => `${grams} g`,
		regionNames: {
			unsaturated: 'Unsaturated solution',
			kno3: 'KNO3 crystallizing',
			nano3: 'NaNO3 crystallizing',
			both: 'Both salts crystallizing',
			dry: 'Dry — all solid'
		},
		pot: {
			ariaLabel: 'Crystallizing beaker view',
			viewName: 'Macro · Beaker',
			caption:
				'Liquid level and crystal piles are illustrative; which crystals fall, and how much, is computed.',
			temperatureLabel: ({ temperatureC }) => `${temperatureC} °C`,
			dissolvedLabel: ({ kno3G, nano3G }) => `Liquid KNO3 ${kno3G} g · NaNO3 ${nano3G} g`,
			kno3CrystalsLabel: ({ grams }) => `KNO3 crystals ${grams} g`,
			nano3CrystalsLabel: ({ grams }) => `NaNO3 crystals ${grams} g`,
			waterLabel: ({ grams }) => `Water ${grams} g`
		},
		ions: {
			ariaLabel: 'Ion view',
			viewName: 'Micro · Ions',
			caption:
				'Ion counts scale with the computed liquid composition; positions are schematic, not molecular dynamics.',
			potassium: 'K⁺',
			sodium: 'Na⁺',
			nitrate: 'NO₃⁻',
			dissolvedTag: 'Solution',
			latticeTag: 'Lattice'
		},
		triangle: {
			ariaLabel: ({ temperatureC, region }) =>
				`Water–KNO3–NaNO3 ternary phase map with the ${temperatureC} °C isotherm; currently in ${region}`,
			waterVertex: 'H₂O',
			kno3Vertex: 'KNO₃',
			nano3Vertex: 'NaNO₃',
			isothermLabel: ({ temperatureC }) => `${temperatureC} °C isotherm`,
			regions: {
				unsaturated: 'Unsaturated solution',
				kno3Field: 'KNO₃ field',
				nano3Field: 'NaNO₃ field',
				bothField: 'Two-salt valley'
			},
			eutonicPoint: 'Eutonic E',
			totalPoint: 'Overall',
			liquidPoint: 'Liquor',
			tieLine: 'Tie line',
			trajectory: 'Operation track',
			experimentPoints: 'Measured (literature)',
			curvesXAxis: 'Temperature T / °C',
			curvesYAxis: 'Solubility / g per 100 g water',
			caption: {
				curves:
					'Both pure-salt curves are interpolated from tabulated anchors in van ’t Hoff coordinates; every anchor is reproduced exactly.',
				map: 'Isotherm computed point by point from solubility data and common-ion equilibrium; mass-fraction coordinates.',
				calibrated:
					'Calibrated model: the empirical salting term is solved from measured eutonics at 10, 25 and 90 °C.',
				ideal:
					'Ideal model: activity coefficients set to 1, common-ion coupling only — note how far the borders retreat from the measurements.'
			},
			captionKind: 'Model'
		}
	},
	edge: {
		eyebrow: 'THE INDUSTRIAL CUT',
		heading: {
			lines: ['Playing the trick', 'with four ions.']
		},
		body: 'Industry went further than separating two salts — it used the same trick to conjure a new one. Conversion saltpeter: dissolve Chile saltpeter and potassium chloride in one pot, and the four ions K⁺, Na⁺, Cl⁻, NO₃⁻ reshuffle. As the liquor boils down, NaCl — whose solubility barely moves with temperature — crystallizes first and is filtered off hot; cooling then drops potassium nitrate in bulk. Until the 1950s, most of the world’s KNO3 was conjured this way. The staged solar ponds of the Qarhan Salt Lake are the same map in open air: sun out the NaCl, float off the potassium, send the tail brine on to lithium. And the trade’s golden age ended with another revolution — Haber’s ammonia synthesis meant humanity no longer mined its nitrogen off a map.',
		industryFacts: [
			{ label: 'Conversion reaction', value: 'NaNO₃ + KCl → KNO₃ + NaCl' },
			{ label: 'Hot end', value: 'NaCl crystallizes from the boiling liquor; filtered hot' },
			{ label: 'Cold end', value: 'The filtrate cools; KNO₃ is harvested' },
			{ label: 'Per tonne', value: '≈ 0.96 t KCl + 0.86 t NaNO₃ → 1 t KNO₃' }
		],
		figureCaption:
			'Conversion-process flow and consumption figures are typical industrial values; salt-lake facts from public Qarhan reporting.'
	},
	conceptCheck: {
		question:
			'The classic order is: cool out KNO3 first, then evaporate out NaNO3. What happens if you reverse it and evaporate at 100 °C right away?',
		options: [
			{ label: 'Nothing crystallizes — you must cool first' },
			{
				label:
					'NaNO3 comes out first instead; but the ray runs close to the two-salt valley, and overshooting drops both crystals together'
			},
			{ label: 'KNO3 still crystallizes first; the order never matters' },
			{ label: 'A mixed crystal of both salts appears immediately' }
		],
		correctIndex: 1,
		explanation:
			'Evaporation walks the overall composition along the ray away from the water vertex, and the first border on that ray belongs to NaNO3 — but the ray soon closes on the eutonic, and further water loss enters the valley. Cooling instead lets the KNO3 border sweep across your pot while the NaNO3 border never arrives. Choosing the order of operations is choosing a route on the map.'
	},
	sandbox: {
		eyebrow: 'FREE PLAY · Leave the storyline with a question',
		title: 'The whole act is yours now.',
		introduction:
			'Temperature, evaporation, dilution, filtration — all four operations in your hands. Watch the track wander the triangle, count what lands in each bottle, and see whether you skirted the two-salt valley.',
		controls: {
			temperature: 'Temperature T',
			temperatureAriaLabel: 'Set the pot temperature',
			evaporate: 'Evaporate 10 g water',
			evaporateAriaLabel: 'Evaporate 10 grams of water',
			addWater: 'Add 10 g water',
			addWaterAriaLabel: 'Add 10 grams of water',
			filterButton: 'Filter: collect crystals',
			resetButton: 'Refill the pot (100/100/100)'
		},
		harvest: {
			label: 'Bottled so far',
			kno3: ({ grams }) => `KNO₃ ${grams} g`,
			nano3: ({ grams }) => `NaNO₃ ${grams} g`,
			water: ({ grams }) => `Water evaporated ${grams} g`
		},
		challengeLabel: 'Try this',
		challenge:
			'Starting from 100/100/100, bottle both salts at better than 90 % recovery each — what is the least water you must evaporate along the way?',
		triViewAriaLabel: 'Free-exploration triple-representation lab'
	},
	modelCard: {
		eyebrow: 'MODEL CARD · V0.1',
		heading: {
			lines: ['What this triangle knows —', 'and what it does not.']
		},
		items: [
			{
				title: 'Backbone: solubility tables + van ’t Hoff interpolation',
				body: [
					{
						text: 'Both salts’ 0–100 °C solubility tables (KNO3: the classic series in Chinese textbooks, identical to Seidell’s 1919 evaluated curve; NaNO3: the CRC Handbook series — note modern evaluations put its 100 °C solubility near 176 g, not the folk value 180) are interpolated with a monotone cubic in ln Ksp vs 1/T; the computed pure-salt curves reproduce every tabulated anchor exactly, pinned point by point in unit tests.'
					}
				],
				openByDefault: true
			},
			{
				title: 'Coupling: common-ion model + empirical salting calibration',
				body: [
					{
						text: 'The two salts couple through shared NO₃⁻ (the ideal common-ion model), times an empirical salting term (1+β·m). β is no black box: it is solved directly from measured eutonic points at 10, 25 and 90 °C, so the isotherms are pinned to experiment at both ends. Flip the model switch to “ideal” to see how far the uncorrected map errs.'
					}
				],
				openByDefault: true
			},
			{
				title: 'Confrontation: measured brines and branches',
				body: [
					{
						text: 'The 17 points on the 90 °C isotherm are Carroll, Craig & Wolery’s reversed-deliquescence brines (±2 % concentrations); against them the calibrated model holds an RMS near 9 %. The 25 °C overlay is Reinders’ 1915 isotherm, whose KNO3 branch genuinely dips before rising — the one-parameter calibration flattens that shallow dip (errors up to ~10 %), which this card declares rather than hides. For scale: the Yucca Mountain project’s Pitzer database missed the 90 °C eutonic by a factor of two.'
					}
				],
				openByDefault: true,
				links: [
					{
						label: 'Carroll et al. 2005, Geochem. Trans. 6:19 ↗',
						href: 'https://geochemicaltransactions.biomedcentral.com/articles/10.1186/1467-4866-6-19'
					},
					{
						label: 'Int. Critical Tables vol. IV (1928 scan) ↗',
						href: 'https://archive.org/details/international-critical-tables_1928_4'
					}
				]
			},
			{
				title: 'What cannot be inferred from this page',
				body: [
					{
						text: 'The model holds for H2O–KNO3–NaNO3 only: neither salt forms hydrates or double salts over 0–100 °C, which is precisely what makes this the clean teaching system; other salt pairs change both the border shapes and the solid phases, and the empirical salting term must not be extrapolated to them. The map contains no crystallization kinetics — how fast crystals grow, and how large, is a different question. Saturated nitrate liquors boil at 115–165 °C (Rard 2006), so the 100 °C pot is safely liquid; real plants evaporate at the boil, treated here as isothermal.'
					}
				],
				openByDefault: false,
				links: [
					{
						label: 'Rard et al. 2006 boiling-point measurements (OSTI open text) ↗',
						href: 'https://www.osti.gov/servlets/purl/898040'
					}
				]
			}
		]
	},
	ending: {
		lead: 'Neither salt ever vanished.',
		heading: {
			lines: ['You simply walked one pot of brine', 'around a triangle and back.']
		},
		catalogLink: 'Back to the story catalog',
		sourceLink: 'View the computation and source ↗'
	}
} satisfies SaltSplitStoryContent;

export default enSaltSplitContent;
