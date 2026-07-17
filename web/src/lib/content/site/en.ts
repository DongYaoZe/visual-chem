import type { SiteContent } from '../types';

export const enSiteContent = {
	locale: 'en',
	htmlLang: 'en',
	shared: {
		seo: {
			defaultImageAlt:
				'VisualChem: university chemistry principles told as stories you can step into'
		},
		header: {
			brand: 'VisualChem',
			tagline: 'Chemistry through visual stories',
			homeAriaLabel: 'VisualChem home',
			navigationAriaLabel: 'Main navigation',
			storyLink: 'Start the first story',
			githubLink: 'GitHub'
		},
		motionControl: {
			pause: 'Pause animation',
			resume: 'Resume animation'
		},
		conceptCheck: {
			eyebrow: 'CONCEPT CHECK · PREDICT, THEN TEST',
			verifyButton: 'Check my prediction',
			correctFeedback: 'That causal chain holds.',
			incorrectFeedback: 'Look again for the evidence shared by all three views.'
		},
		triView: {
			defaultAriaLabel: 'Linked chemistry views',
			liveSummary: ({ liquidComposition, vaporComposition, bubblePointC, stage }) =>
				`Current state: ethanol mole fraction ${liquidComposition} in the liquid and ${vaporComposition} in the vapor; bubble point ${bubblePointC} degrees Celsius; equilibrium stage ${stage}.`,
			synchronizedState: 'Synchronized state',
			liquidComposition: 'Liquid x',
			vaporComposition: 'Vapor y',
			bubblePoint: 'Bubble point',
			experimentalAzeotrope: 'Experimental azeotrope',
			modelLimit: 'Model limit',
			massPercent: ({ value }) => `≈${value} wt%`
		},
		apparatus: {
			ariaLabel: 'Flask, condenser, and receiver showing the linked liquid and vapor compositions',
			stillLiquid: ({ composition }) => `Still liquid x = ${composition}`,
			distillate: ({ composition }) => `Distillate y = ${composition}`,
			equilibriumStage: ({ stage }) => `Equilibrium stage ${stage}`,
			viewName: 'MACROSCOPIC',
			caption: 'Equilibrium-stage schematic; it does not represent actual tray efficiency'
		},
		particles: {
			vaporPhase: 'Vapor',
			liquidPhase: 'Liquid',
			ethanol: 'Ethanol',
			water: 'Water',
			viewName: 'PARTICULATE',
			caption:
				'Particle proportions are quantitative; positions, collisions, and paths are explanatory only'
		},
		diagram: {
			accessibleReconstruction: ({
				totalPoints,
				selectedPoints,
				liquidComposition,
				vaporComposition,
				temperatureC
			}) =>
				`Reconstruction of a constant-pressure ethanol–water x–T–y diagram from ${totalPoints} Lai 2014 measurements; ${selectedPoints} points selected. Current liquid composition x ${liquidComposition}, vapor composition y ${vaporComposition}, and temperature ${temperatureC} degrees Celsius. The smooth teaching model is hidden.`,
			accessibleModel: ({
				liquidComposition,
				vaporComposition,
				bubblePointC,
				modelStrength,
				withExperimentalData,
				totalPoints
			}) =>
				`Constant-pressure ethanol–water x–T–y diagram. Current liquid composition x ${liquidComposition}, vapor composition y ${vaporComposition}, and bubble point ${bubblePointC} degrees Celsius. The Margules teaching model is shown at nonideality strength ${modelStrength}${withExperimentalData ? `, overlaid with ${totalPoints} experimental points from Lai 2014` : ''}.`,
			captions: {
				reconstruction:
					'Lai 2014 measurements at 101.3 kPa; dashed lines are visual guides through the selected points only',
				comparison: ({ modelStrength }) =>
					`Comparison · open symbols are Lai 2014 measurements; smooth curves are the Margules teaching model at λ=${modelStrength}`,
				ideal: 'Ideal Raoult-law baseline (γ = 1), not an experimental curve',
				margules: ({ modelStrength }) =>
					`Three-suffix Margules teaching model (λ=${modelStrength}), not a fit to the experimental data`
			},
			modelFixedPoint: 'Model fixed point',
			laiExperimentalAzeotrope: 'Lai experimental azeotrope',
			xAxis: 'Ethanol mole fraction · x (liquid) / y (vapor)',
			yAxis: 'Temperature / °C',
			regions: {
				vapor: 'Vapor',
				liquid: 'Liquid',
				twoPhase: 'Liquid + vapor'
			},
			legend: {
				modelLiquid: 'Solid model curve · liquid x (bubble curve)',
				modelVapor: 'Dashed model curve · vapor y (dew curve)',
				experiment: '○ x / △ y · experimental data',
				reconstruction: 'Heavy dashed lines · your reconstruction'
			},
			captionKind: {
				evidence: 'EVIDENCE',
				model: 'MODEL'
			}
		}
	},
	home: {
		seo: {
			title: 'VisualChem — Chemistry, told through explorable stories',
			description:
				'Lock macroscopic phenomena, particulate models, and chemical symbols into one explorable story. VisualChem is an open-source narrative visualization project for university chemistry.',
			path: '/en/',
			alternateLocalePath: '/',
			type: 'website',
			image: '/og-home.png',
			imageAlt:
				'VisualChem home: macroscopic, particulate, and symbolic views synchronized around an ethanol–water phase diagram',
			modifiedTime: '2026-07-16'
		},
		hero: {
			eyebrow: 'OPEN CHEMISTRY · EXPLORABLE STORIES',
			heading: {
				lines: ['Do not just draw', 'the phase diagram.'],
				emphasis: 'Make it speak.'
			},
			lead: 'Macroscopic phenomena, particles, and symbols no longer tell separate stories. Scrolling becomes a camera; your hand becomes the experimental control. Every graphic enters only when the argument needs it.',
			primaryAction: {
				label: 'Enter the first story',
				symbol: '↗'
			},
			methodAction: 'How we teach',
			proofs: [
				{ value: '3', label: 'representations in sync' },
				{ value: '0', label: 'server-side computations' },
				{ value: 'MIT', label: 'open-source code license' }
			],
			previewAriaLabel: 'Visual preview of the azeotrope in the first story',
			limitLabel: 'A signpost for ordinary distillation at 1 atm',
			limitValue: '≈95.5',
			limitUnit: '%',
			limitContext: 'ethanol by mass · approximate experimental value at 1 atm',
			unreachableValue: '100%',
			fixedPointLabel: 'y = x',
			azeotropeCompositionLabel: 'Azeotropic composition',
			storyPreview: 'Story 01 · The unreachable 100%'
		},
		method: {
			eyebrow: 'THE JOHNSTONE TRIANGLE, IN MOTION',
			heading: {
				lines: ['One state,', 'seen at three scales.']
			},
			body: 'Textbooks often scatter the flask, molecules, and equations across three pages. The hard part is not seeing three pictures; it is translating between them. VisualChem drives all three from one state: when composition changes, the apparatus, particle proportions, and point on the phase diagram must change together.',
			controls: {
				initialComposition: 'Initial still liquid · ethanol mole fraction',
				initialCompositionAriaLabel: 'Initial liquid ethanol mole fraction',
				equilibriumStages: 'Repeated equilibrium stages',
				equilibriumStagesAriaLabel: 'Number of repeated equilibrium stages',
				hint: 'Move either control and ask whether all three views tell the same story.',
				triViewAriaLabel: 'Home-page demonstration of three synchronized representations'
			}
		},
		season: {
			eyebrow: 'SEASON 01 · PHASE EQUILIBRIUM',
			title: 'A phase-equilibrium trilogy',
			introduction:
				'We begin with ideas that benefit most from three-way translation. Each story starts with an anomaly and ends at a model you can calculate with.',
			stories: [
				{
					number: '01',
					status: 'Interactive prototype · about 12 minutes',
					title: 'The unreachable 100%',
					description:
						'Why does repeated distillation enrich ethanol, yet stop with roughly the final 4.5% still out of reach?',
					action: 'Start reading ↗'
				},
				{
					number: '02',
					status: 'Interactive alpha · about 10 minutes',
					title: 'A map of boiling',
					description:
						'How does a pot of water at high altitude lead us into the pressure–temperature map?',
					action: 'Start reading ↗'
				},
				{
					number: '03',
					status: 'Interactive alpha · about 12 minutes',
					title: 'A pot of brine, split in two',
					description:
						'Two salts dissolve into one pot of water; a triangular map shows how to usher them out one at a time.',
					action: 'Start reading ↗'
				}
			]
		},
		principles: {
			eyebrow: 'WHAT COUNTS AS TRUE',
			heading: {
				lines: ['A graphic may be poetic.', 'Its numbers cannot be imagined.']
			},
			items: [
				{
					number: '01',
					title: 'Calculations you can verify',
					body: 'Every phase boundary comes from thermodynamic calculations in the browser. Unit tests lock down pure-component boiling points, phase equilibrium, and the azeotrope.'
				},
				{
					number: '02',
					title: 'Metaphors with boundaries',
					body: 'Particle proportions track the calculation quantitatively; particle paths are explicitly schematic. We do not present animation as molecular dynamics.'
				},
				{
					number: '03',
					title: 'Predict before you test',
					body: 'Readers commit to a prediction, manipulate the model, and then seek common evidence across all three scales—instead of passively watching an answer.'
				}
			]
		},
		footer: {
			tagline: 'VisualChem · Walk into the story behind a chemical principle.',
			sourceCodeLink: 'Source code',
			firstStoryLink: 'First story'
		}
	}
} satisfies SiteContent;

export default enSiteContent;
