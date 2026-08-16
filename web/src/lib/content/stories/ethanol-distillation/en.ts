import type { EthanolDistillationStoryContent } from '../../types';

export const enEthanolDistillationContent = {
	locale: 'en',
	seo: {
		title: 'The unreachable 100% — VisualChem',
		description:
			'From the first bubble to the ethanol–water azeotrope: linked apparatus, particle proportions, and an x–T–y diagram explain why ordinary distillation stops near 95.5 wt% ethanol at atmospheric pressure.',
		path: '/en/stories/ethanol-distillation/',
		alternateLocalePath: '/stories/ethanol-distillation/',
		type: 'article',
		image: '/og-ethanol-distillation.png',
		imageAlt:
			'VisualChem story cover combining an ethanol–water x–T–y diagram, distillation apparatus, and particle view',
		publishedTime: '2026-07-16',
		modifiedTime: '2026-07-16'
	},
	hero: {
		eyebrow: 'PHASE EQUILIBRIUM · STORY 01',
		metadata: ['About 12 minutes', 'Undergraduate physical chemistry', 'Interactive Alpha'],
		heading: {
			lines: ['The unreachable'],
			emphasis: '100%'
		},
		ledeLines: [
			'A column can make ethanol richer and richer.',
			'Why does even a taller column lose its direction at the last trace of water?'
		],
		scrollCue: 'Scroll down and commit to a prediction',
		curveEvidence: 'about 95.5 wt% · atmospheric-pressure experiment'
	},
	readingNote: {
		eyebrow: 'HOW TO READ',
		body: [
			{
				text: 'The stage at right is not a set of three unrelated illustrations. One thermodynamic state drives them all: the '
			},
			{ text: 'macroscopic view', emphasis: 'strong' },
			{ text: ' shows what happens, the ' },
			{ text: 'particulate view', emphasis: 'strong' },
			{ text: ' helps build an explanation, and the ' },
			{ text: 'symbolic view', emphasis: 'strong' },
			{ text: ' supplies a map you can calculate with.' }
		]
	},
	stage: {
		dialogAriaLabel: 'Graphics for the current story scene',
		closeGraphicAriaLabel: 'Close the current graphic',
		triViewAriaLabel: 'Three linked representations for the current story scene',
		shortStateAriaLabel: 'Current graphic state',
		openGraphicButton: 'View current graphic',
		shortState: {
			liquid: ({ composition }) => `x ${composition}`,
			vapor: ({ composition }) => `y ${composition}`,
			temperature: ({ temperatureC }) => `${temperatureC} °C`
		}
	},
	scenes: [
		{
			id: 'hook',
			kicker: '00 · THE HOOK',
			title: 'One more stage—will it reach 100%?',
			paragraphs: [
				'Distill once and the ethanol gets richer. Distill again and it gets richer again. Intuition says that repeating the same step often enough must end at pure ethanol.',
				'Do not accept the answer yet. Add stages to this “theoretical-stage column” — every stage truly reaches vapor–liquid equilibrium — and watch where the top composition chooses to stop.'
			]
		},
		{
			id: 'composition-language',
			kicker: '01 · A COMMON LANGUAGE',
			title: 'What exactly does “10% alcohol” mean?',
			paragraphs: [
				'Volume fraction, mass fraction, and mole fraction may all be called “concentration,” but they are not the same scale. The horizontal axis of this phase diagram is the ethanol mole fraction.',
				'Orange denotes ethanol and blue-green denotes water. Both branches of the diagram record ethanol composition, so solid versus dashed lines and circles versus triangles distinguish liquid x from vapor y.'
			],
			formula: String.raw`z_E=\frac{n_E}{n_E+n_W}`
		},
		{
			id: 'first-bubble',
			kicker: '02 · THE FIRST BUBBLE',
			title: 'Boiling begins when the sum catches the external pressure.',
			paragraphs: [
				'Water and ethanol both contribute vapor pressure at all times. The first bubble can survive inside the liquid only when their partial pressures add up to the external pressure.',
				'More volatile means that ethanol is enriched in the vapor; it does not mean that water stops evaporating. We begin with an ideal solution because it is calculable. Scene 4 will test it against experimental data.'
			],
			formula: String.raw`x_Ep_E^*+(1-x_E)p_W^*=P`
		},
		{
			id: 'tie-line',
			kicker: '03 · ONE TIE LINE',
			title: 'At one temperature, why are there two compositions?',
			paragraphs: [
				'Call the liquid composition in the still x and the equilibrium vapor composition y. They share the same temperature and pressure, yet their compositions can differ.',
				'Condense that vapor completely. This changes the phase but not the overall composition of the sample, so the new liquid droplet has exactly the former vapor composition y.'
			],
			formula: String.raw`y_E=\frac{x_Ep_E^*}{P}`
		},
		{
			id: 'build-the-map',
			kicker: '04 · BUILD THE MAP',
			title: 'Turn an experimental table back into a map.',
			paragraphs: [
				'Lai and co-workers reported 16 ethanol–water x–T–y equilibrium measurements at 101.3 kPa. Each row gives a liquid composition, an equilibrium temperature, and a vapor composition. These points were measured; they were not drawn by an equation.',
				'Choose rows from the table. Place the circle (x,T) on the liquid, or bubble-point, branch and the triangle (y,T) on the vapor, or dew-point, branch. Then use dashed lines to sketch your proposed phase boundaries.',
				'The circle and triangle from one row are joined by a horizontal tie line. Its ends give the two phase compositions; where the overall composition z lies between them determines how much of each phase is present.'
			],
			formula: String.raw`\beta=\frac{z_E-x_E}{y_E-x_E}`
		},
		{
			id: 'equilibrium-cascade',
			kicker: '05 · EQUILIBRIUM-STAGE CASCADE',
			title: 'The ideal model builds a composition ladder.',
			paragraphs: [
				'Keep the experimental points as a reference and ask what ideal Raoult’s law predicts. Bring a liquid to equilibrium, remove its vapor, and condense it completely; then repeat with the new liquid.',
				'In the ideal model, the ladder moves to the right. Each equilibrium stage brings a smaller gain, but the direction always points toward pure ethanol.'
			],
			formula: String.raw`x_{n+1}=y(x_n)`
		},
		{
			id: 'nonideal-model',
			kicker: '06 · WHERE IDEALITY FAILS',
			title: 'Mixing changes how strongly molecules “want to escape.”',
			paragraphs: [
				'Open circles and triangles are the Lai 2014 measurements; smooth solid and dashed curves are model results. λ=0 is the ideal Raoult-law baseline. λ=1 is a Margules teaching model calibrated to the atmospheric azeotrope.',
				'A model does not replace experiment. Its value is to explain trends with a few parameters, and its misses matter too. Values 0<λ<1 are a teaching morph—not a measurable property and not a point-by-point regression.'
			],
			formula: String.raw`p_i=x_i\gamma_i p_i^*`
		},
		{
			id: 'fixed-point',
			kicker: '07 · THE FIXED POINT',
			title: 'The wall is not a line. It is the moment y = x.',
			paragraphs: [
				'When the equilibrium vapor and liquid have exactly the same composition, vaporization followed by condensation no longer changes composition. This azeotropic composition is a fixed point of the distillation map.',
				'From the low-composition side, y−x is positive; from the high-composition side, y−x is negative. Cascades from both sides approach the same point and do not cross it. Experiment and the teaching model give nearby values, but not the same result.'
			],
			formula: String.raw`\Delta(x)=y(x)-x=0`
		},
		{
			id: 'change-the-operation',
			kicker: '08 · CHANGE THE OPERATION',
			title: 'Do not push the same step harder. Choose a different step.',
			paragraphs: [
				'The azeotrope limits repeated vapor–liquid equilibrium separation under fixed conditions. It does not forbid anhydrous ethanol from existing.',
				'Selective dehydration removes water directly and changes the material-balance path. It no longer follows the distillation ladder x→y(x), so it can cross the former fixed point.'
			],
			formula: String.raw`x_E(q)=\frac{n_E}{n_E+(1-q)n_W}`
		}
	],
	interactions: {
		hook: {
			prompt: 'PREDICT FIRST',
			choices: [{ label: 'It will reach 100%' }, { label: 'It will stop somewhere' }],
			addStageButton: '+ Add one stage',
			autoRunButton: 'Let it keep running',
			autoPauseButton: 'Pause auto demo',
			resetButton: 'Reset',
			stageOutput: ({ stage, composition }) => `Stage ${stage}: x = ${composition}`,
			evidence:
				'The reading still changes as more stages are added, but ever more slowly. Keep your prediction; Scene 7 will define precisely what “stop” means.'
		},
		firstBubble: {
			prompt: 'THE FIRST BUBBLE WILL BE',
			choices: [
				{ label: 'Pure ethanol' },
				{ label: 'Enriched in ethanol' },
				{ label: 'The same as the liquid' }
			],
			evidence:
				'At x = 0.10, the ideal model gives y ≈ 0.20: the bubble is enriched in ethanol, but water’s contribution is not zero.'
		},
		experiment: {
			controlLabel: 'Literature sample · liquid x',
			sampleStripLabel: 'Pick experimental compositions directly',
			sampleStripAriaLabel: 'The 16 experimental compositions reported by Lai 2014',
			sampleButtonAriaLabel: ({ index, liquidComposition }) =>
				`Select and add experimental sample ${index}, liquid ethanol mole fraction ${liquidComposition}`,
			sliderAriaLabel: 'Choose an experimental sample from Lai 2014',
			sliderValueText: ({ index, liquidComposition }) =>
				`Sample ${index}, liquid ethanol mole fraction ${liquidComposition}`,
			measurement: ({ temperatureC, temperatureUncertaintyC, vaporComposition }) =>
				`Measured T = ${temperatureC} ± ${temperatureUncertaintyC} °C · vapor y = ${vaporComposition}`,
			addButton: 'Add this literature measurement',
			addedButton: 'This sample is already added',
			clearButton: 'Clear selection',
			selectionOutput: ({ selected, total }) => `${selected} / ${total} samples selected`,
			coverageLabel: 'Sampling coverage',
			coverageBands: ['low composition', 'middle composition', 'high composition'],
			coverageHint: ({ covered, total }) =>
				`You currently cover ${covered} / ${total} composition regions. Do not choose only neighbouring measurements.`,
			coverageComplete:
				'You now have evidence at low, middle, and high composition. Look again for places where your sketch still interpolates too confidently.',
			incompleteEvidence:
				'Pick different compositions directly above. The circle and triangle are liquid x and vapor y from the same equilibrium state. Select at least 5 samples across the composition axis before comparing your sketch with the complete table of 16 measurements.',
			completeEvidence:
				'The heavy dashed lines are only your sketch through the selected data. The remaining literature points are now revealed: look for regions where your sketch lacked evidence, and later ask how the model explains the full trend.'
		},
		idealCascade: {
			controlLabel: 'Equilibrium stages N (ideal Raoult model)',
			sliderAriaLabel: 'Number of theoretical equilibrium stages'
		},
		nonidealModel: {
			controlLabel: 'Teaching-model control λ',
			sliderAriaLabel: 'Nonideality strength of the teaching model',
			scale: {
				start: '0 · ideal Raoult',
				end: '1 · calibrated Margules'
			}
		},
		azeotropeSearch: {
			controlLabel: 'Find y − x = 0 in the Margules model',
			sliderAriaLabel: 'Ethanol mole fraction used to search for the azeotrope',
			compositionOutput: ({ liquidComposition, vaporComposition }) =>
				`x = ${liquidComposition} · y = ${vaporComposition}`,
			nearEvidence: ({
				modelComposition,
				modelTemperatureC,
				experimentalComposition,
				experimentalCompositionUncertainty,
				experimentalTemperatureC,
				experimentalTemperatureUncertaintyC
			}) =>
				`The current model gives x≈${modelComposition} and T≈${modelTemperatureC}°C. Lai’s experiment gives x=y=${experimentalComposition}±${experimentalCompositionUncertainty} and T=${experimentalTemperatureC}±${experimentalTemperatureUncertaintyC}°C. Close is not identical.`
		}
	},
	escape: {
		eyebrow: 'CHANGE THE OPERATION',
		heading: {
			lines: ['Remove the water', 'instead of distilling once more.']
		},
		body: 'Starting at the azeotropic composition, a 3A molecular sieve or another dehydration process selectively removes water. It changes the process constraint; it does not make vapor–liquid equilibrium “stop applying.”',
		controlLabel: 'Fraction q of the remaining water removed',
		controlAriaLabel: 'Fraction of water removed selectively',
		percentOutput: ({ percent }) => `${percent}%`,
		figureCaption:
			'Material-balance schematic for the selective removal of water by a molecular sieve',
		beforeLabel: 'Azeotropic distillate',
		beforeValue: ({ molePercent }) => `${molePercent} mol%`,
		sieveLabelLines: ['3A', 'molecular sieve'],
		afterLabel: 'After dehydration',
		afterValue: ({ molePercent }) => `${molePercent} mol%`
	},
	conceptCheck: {
		question:
			'Why does molecular-sieve dehydration not contradict the statement that ordinary distillation cannot cross the azeotrope?',
		options: [
			{ label: 'The sieve temporarily switches off the thermodynamics of the azeotrope' },
			{
				label:
					'It selectively removes water, so it is no longer another vapor–liquid equilibrium stage'
			},
			{ label: 'The sieve suddenly lowers ethanol’s boiling point to zero degrees' },
			{ label: 'Any azeotrope disappears automatically if the process is slow enough' }
		],
		correctIndex: 1,
		explanation:
			'The azeotropic constraint applies to the vapor–liquid equilibrium mapping x→y(x) under specified conditions. Selective water removal follows a different material-balance path, so it can pass the former fixed point.'
	},
	sandbox: {
		eyebrow: 'FREE PLAY · LEAVE THE STORY WITH A QUESTION',
		title: 'Now the controls are yours.',
		introduction:
			'The author-controlled camera ends here. Change the initial composition, nonideality strength, and number of theoretical stages. Watch which quantities move together and which relationships remain invariant.',
		controls: {
			initialComposition: 'Initial ethanol mole fraction x₀',
			initialCompositionAriaLabel: 'Initial ethanol mole fraction for free exploration',
			equilibriumStages: 'Theoretical equilibrium stages N',
			equilibriumStagesAriaLabel: 'Number of theoretical equilibrium stages for free exploration',
			nonidealStrength: 'Nonideality strength λ',
			nonidealStrengthAriaLabel: 'Nonideality strength for free exploration',
			nonidealStrengthScale: {
				start: '0 · ideal Raoult',
				end: '1 · calibrated Margules'
			}
		},
		challengeLabel: 'TRY THIS',
		challenge:
			'Start at x₀ = 0.95 and repeat the distillation step. Does the ladder move left or right? What composition does it approach?',
		triViewAriaLabel: 'Three-view laboratory for free exploration'
	},
	modelCard: {
		eyebrow: 'MODEL CARD · V0.1',
		heading: {
			lines: ['What this diagram knows—', 'and what it does not.']
		},
		items: [
			{
				title: 'Evidence layer: 16 public measurements',
				body: [
					{
						text: 'The open circles and triangles are x–T–y data reported by Lai and co-workers in 2014 at 101.3 kPa. Temperature and vapor-composition uncertainties are the 95% expanded uncertainties published through NIST ThermoML. Lines between points are visual guides only; they do not create new measurements.'
					}
				],
				openByDefault: true,
				links: [
					{
						label: 'Original paper DOI ↗',
						href: 'https://doi.org/10.1016/j.jct.2013.08.020'
					},
					{
						label: 'NIST ThermoML data record ↗',
						href: 'https://trc.nist.gov/ThermoML/10.1016/j.jct.2013.08.020.html'
					}
				]
			},
			{
				title: 'Model layer: interpretable, but not itself a measurement',
				body: [
					{
						text: 'The vapor phase is treated as an ideal gas, pure-component vapor pressures use Antoine equations, and the liquid phase uses a three-suffix Margules activity-coefficient model. Parameters are calibrated to the atmospheric azeotrope at x'
					},
					{ text: 'E', emphasis: 'subscript' },
					{
						text: '≈0.895 and T≈78.15°C (the model gives 95.61 wt% ethanol). Against the 16 Lai points, the current model has a temperature RMS error of about 0.57 K and a vapor-composition RMS error of about 0.016. Experiments in the literature give about 95.4–95.6 wt%, so the story says “about 95.5 wt%.”'
					}
				],
				openByDefault: true
			},
			{
				title: 'What you cannot infer from it',
				body: [
					{
						text: 'This is not a full temperature-dependent NRTL regression of the experimental data. It does not simulate tray efficiency, reflux ratio, mass-transfer rates, or batch-distillation time. Do not use these teaching parameters for pressure extrapolation or industrial design.'
					}
				],
				openByDefault: false
			},
			{
				title: 'Evidence boundary for the particulate animation',
				body: [
					{
						text: 'Ethanol/water proportions in each phase come from the equilibrium calculation. Dot positions, collisions, bubble shapes, and animation timing are explanatory metaphors—not real-time molecular dynamics.'
					}
				],
				openByDefault: false
			}
		]
	},
	ending: {
		lead: 'You did more than “read a phase diagram.”',
		heading: {
			lines: [
				'You rebuilt a map from an experimental table,',
				'then used a model to explain its wall.'
			]
		},
		catalogLink: 'Return to the story catalog',
		sourceLink: 'View the calculations and source code ↗'
	}
} satisfies EthanolDistillationStoryContent;

export default enEthanolDistillationContent;
