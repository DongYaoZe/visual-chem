import type { KineticsStoryContent } from '../../types';

export const enKineticsContent = {
	locale: 'en',
	seo: {
		title: 'The Concentration Countdown — VisualChem',
		description:
			'How fast does a bottle of peroxide die? Rate is not a number but a curve sliding with concentration. Half-life is the fingerprint of reaction order — equal beats mean first order, doubling beats mean second — computed point by point in your browser, with the same math running the carbon-14 clock.',
		path: '/en/stories/kinetics/',
		alternateLocalePath: '/stories/kinetics/',
		type: 'article',
		image: '/og-kinetics.png',
		imageAlt: 'VisualChem story cover with a bubbling beaker and the half-life staircase',
		publishedTime: '2026-07-23',
		modifiedTime: '2026-07-23'
	},
	hero: {
		eyebrow: 'KINETICS · STORY 08',
		title: ['The concentration', 'countdown'],
		subtitle:
			'Thermodynamics promised the downhill — it never said how long the walk takes. Season three straps a stopwatch to the reaction.',
		heroTag: 'c(t) = c₀e^(−kt) · computed point by point'
	},
	readingNote:
		'The stage on the right is driven by one decomposition: the beaker’s bubbles pace the instantaneous rate, the microscopic molecules vanish with the remaining fraction, and the symbolic panel draws the whole concentration-time curve with its half-life staircase. All three panels share one clock — rate is not a memorized formula, it is the slope of this curve.',
	stage: {
		dialogAriaLabel: 'Graphic for the current scene',
		closeGraphicAriaLabel: 'Close the current graphic',
		openGraphicButton: 'View current graphic',
		shortStateAriaLabel: 'Current graphic state'
	},
	scenes: [
		{
			id: 'hook',
			prose: `The peroxide bottle in the medicine cabinet, once opened, burbles away its oxygen:

$$\\mathrm{2\\,H_2O_2 \\to 2\\,H_2O + O_2}$$

Last season established this is thoroughly downhill (ΔG ≪ 0). Yet it does not go in one rush — the bubbles come **one at a time**.

Watch it for ten minutes. **Will the bubbling speed up, hold steady, or slow down?**

Place your bet.`
		},
		{
			id: 'watch-it-fall',
			prose: `Press play and watch the concentration fall.

The curve is **steep at first, then gentle** — because the rate follows the concentration: many molecules, many encounters, fast reaction; fewer molecules, and the rate ebbs with them. In symbols:

$$v = -\\frac{\\mathrm{d}c}{\\mathrm{d}t} = k\\,c$$

Rate is not one number; it is **the slope of the curve at each point**. The constant is k — the countdown's **metronome**, in s⁻¹, indifferent to concentration.`
		},
		{
			id: 'half-life',
			prose: `A beautiful rhythm hides in this curve.

Falling from $c_0$ to $c_0/2$ takes some time; falling from $c_0/2$ to $c_0/4$ takes **exactly the same time**; halve again — the same again.

$$t_{1/2} = \\frac{\\ln 2}{k}$$

The half-life does not care how much is left — that is **the fingerprint of a first-order reaction**. Watch the staircase marks on the plot: evenly spaced drumbeats, all the way down (asymptotically) to zero.`
		},
		{
			id: 'fingerprints',
			prose: `But not every reaction keeps this beat. Switch the order and watch the fingerprint change:

- **Zero order**: rate ignores concentration (saturated enzymes, surfaces) — successive half-lives **halve each time**, and the line crashes into zero
- **First order**: half-life **constant** — radioactive decay; peroxide decomposition only within a stated concentration regime and at fixed catalyst concentration
- **Second order**: rate ∝ c² — half-lives **double each time**, dragging a long tail

**Measuring successive half-lives is dusting a reaction for fingerprints** — the detective's way to read the order with no curve fitting at all.`
		},
		{
			id: 'rate-law',
			prose: `Write the fingerprint as mathematics. Integrating the first-order law:

$$c = c_0 e^{-kt} \\qquad \\ln c = \\ln c_0 - kt$$

Take the logarithm and the curve **straightens into a line** with slope −k. The same move as straightening the vaporization curve in story two: **find the right coordinates and the law stands up straight by itself.**

The order m in $v = k c^m$ can only be read from **experiment** — never copied from stoichiometry. The 2 in $\\mathrm{2\\,H_2O_2}$ has nothing to do with "first order".`
		},
		{
			id: 'carbon-clock',
			prose: `The same mathematics, with the stopwatch swapped for a calendar of millennia.

Carbon-14 is radioactive carbon made by cosmic rays; living things keep topping it up. At death the topping-up stops and **the countdown begins** — half-life 5730 years, rain or shine.

$$t = 5730 \\cdot \\log_2\\frac{c_0}{c}$$

Ötzi the Iceman still carries about 53 % of his carbon-14: roughly 5300 years. The Dead Sea Scrolls were dated by this same exponential. **A first-order stopwatch never asks how big the bottle is.**`
		},
		{
			id: 'not-all-equal',
			prose: `The honesty clause:

- Peroxide's first-order behavior is a **conditional experimental result**, not something the equation reveals: fixed iodide can give pseudo-first-order behavior in H₂O₂, while an enzyme is approximately first order only in its low-substrate, unsaturated regime
- k depends strongly on temperature (next story's protagonist) and on catalysts (the one after) — every curve on this page sits at one fixed temperature
- Real reactions can change order: a saturated enzyme slides from first order toward zero; orders can even be fractional

A rate law is an **empirical law read off measurements**; the mechanism hides behind it — a deeper detective story.`
		},
		{
			id: 'sandbox',
			prose: `The stopwatch is yours.

Three knobs — order, rate constant, starting concentration — recompute the curve and its half-life staircase live; the beaker and the molecule chamber answer in step.

**Challenges**: tune a first-order curve that drums exactly three half-life beats within 200 seconds; then work out why a second-order reaction never quite finishes dying.`
		}
	],
	kickers: {
		hook: '00',
		'watch-it-fall': '01',
		'half-life': '02',
		fingerprints: '03',
		'rate-law': '04',
		'carbon-clock': '05',
		'not-all-equal': '06',
		sandbox: '07'
	},
	interactions: {
		hook: {
			question: 'Predict first: the bubbling will',
			options: [
				{ id: 'faster', label: 'Speed up' },
				{ id: 'steady', label: 'Hold steady' },
				{ id: 'slower', label: 'Slow down' }
			],
			explanation:
				'Slow down. The rate is proportional to how much peroxide remains — fewer molecules, fewer encounters. That ebbing-with-concentration curve is this story’s protagonist.'
		},
		watchItFall: {
			playButton: '⏵ Start the clock',
			pauseButton: '⏸ Pause',
			resetButton: '↻ Refill'
		},
		fingerprints: {
			orderLabel: 'Reaction order',
			orderNames: ['Zero order', 'First order', 'Second order'],
			readout: ({ first, second, third }) =>
				`Successive half-lives: ${first} s → ${second} s → ${third} s`
		},
		carbonClock: {
			fractionLabel: 'Carbon-14 remaining',
			readout: ({ percent, years }) => `${percent}% left → about ${years} years old`
		},
		sandbox: {
			orderLabel: 'Reaction order',
			kLabel: 'Rate constant k',
			kUnit: ({ order }) =>
				Number(order) === 0 ? 'mol L⁻¹ s⁻¹' : Number(order) === 1 ? 's⁻¹' : 'L mol⁻¹ s⁻¹',
			c0Label: 'Starting concentration c₀',
			readout: ({ halfLife }) => `First half-life t½ = ${halfLife} s`
		}
	},
	triView: {
		defaultAriaLabel: 'Triple-representation stage for peroxide decomposition',
		liveSummary: ({ concentration, timeS }) =>
			`Current state: t = ${timeS} s, remaining fraction ${concentration}.`,
		synchronizedState: 'One clock · three representations',
		beaker: {
			ariaLabel: ({ concentration, normalizedRate }) =>
				`Beaker view: remaining fraction ${concentration}; instantaneous rate is ${normalizedRate} of its initial value.`,
			viewName: 'Macro · Beaker',
			caption: 'Bubble pace follows the computed instantaneous rate; the glassware is schematic.',
			bubbleTag: 'O₂',
			concentrationLabel: ({ concentration }) => `c/c₀ = ${concentration}`,
			timeLabel: ({ timeS }) => `t = ${timeS} s`
		},
		molecules: {
			ariaLabel: ({ reactantCount, waterCount, oxygenCount }) =>
				`Molecule view: ${reactantCount} H2O2, ${waterCount} H2O, and ${oxygenCount} O2 formula units, preserving the 2-to-2-to-1 stoichiometry.`,
			viewName: 'Micro · Molecules',
			caption: 'Every 2 H₂O₂ consumed form 2 H₂O and 1 O₂; positions are schematic.',
			reactantLabel: 'H₂O₂',
			waterLabel: 'H₂O',
			oxygenLabel: 'O₂'
		},
		clock: {
			ariaLabel: ({ order }) => `Concentration-time curve, currently ${order}`,
			viewName: 'Symbol · The countdown',
			caption:
				'The curve is computed from the integrated rate law; vertical lines drum the successive half-lives.',
			xAxis: 'Time t / s',
			yAxis: 'c / c₀',
			halfLifeMarker: 't½',
			currentMarker: 'Now',
			orderTag: ({ order }) => `${order}`
		}
	},
	edge: {
		eyebrow: 'THE STOPWATCH',
		title: 'The timekeeper’s handbook',
		facts: [
			{
				term: 'Rate is slope',
				definition:
					'v = −dc/dt: the tangent at every point, ebbing with concentration; k is the metronome that never changes.'
			},
			{
				term: 'Half-life fingerprints',
				definition:
					'Equal beats = first order, doubling = second, halving = zero — reading the order with no fitting at all.'
			},
			{
				term: 'Order is measured',
				definition:
					'The m in v = kc^m comes only from experiment; stoichiometric coefficients get no vote.'
			},
			{
				term: 'The carbon-14 clock',
				definition:
					'First-order decay with t½ = 5730 a: the same exponential runs from the medicine cabinet to the excavation site.'
			}
		]
	},
	conceptCheck: {
		question:
			'A reaction shows successive half-lives of 100 s, 200 s, 400 s. Its most likely order is:',
		options: [
			{ label: 'Zero — the half-life is changing' },
			{ label: 'First — having a half-life at all means first order' },
			{ label: 'Second — half-lives double each round' },
			{ label: 'Impossible to say without temperature data' }
		],
		correctIndex: 2,
		explanation:
			'Doubling half-lives (t½ ∝ 1/c) are exactly the second-order fingerprint: after each halving, encounters are twice as hard to come by. First order keeps the beat constant; zero order halves it. Temperature rescales k but never reshapes the fingerprint.'
	},
	sandboxIntro: {
		eyebrow: 'FREE PLAY · Leave the storyline with a question',
		title: 'The countdown bench',
		description:
			'Order, rate constant, and starting concentration are all yours; the curve, the bubbles, and the molecules answer together.'
	},
	modelCard: {
		title: 'Model card · V0.1',
		items: [
			{
				term: 'System',
				value:
					'H₂O₂ decomposition (2H₂O₂ → 2H₂O + O₂) is a classic classroom system. The first-order curve represents stated limiting conditions only: fixed iodide can make the law pseudo-first-order in H₂O₂; catalase is approximately first order at low, unsaturating substrate and tends toward zero order as substrate rises. The on-page k is a free knob, not one measured catalytic condition; the uncatalyzed room-temperature reaction is very slow.'
			},
			{
				term: 'Computation',
				value:
					'Integrated rate laws for orders 0/1/2 evaluated analytically; successive half-lives advanced per-order (c₀/2k, ln2/k, 1/kc₀), with unit tests pinning the equal/halving/doubling fingerprints and curve-drumbeat alignment.'
			},
			{
				term: 'Carbon-14',
				value:
					'Cambridge half-life 5730 a; age = 5730·log₂(c₀/c). Real archaeological dating additionally applies the IntCal atmospheric calibration curve; on-page ages are uncalibrated teaching values, off by up to centuries.'
			},
			{
				term: 'What cannot be inferred from this page',
				value:
					'Rate laws are empirical: orders do not come from stoichiometry, and mechanisms (elementary steps, intermediates) are beyond this page; temperature lives in story nine, catalysis in story ten. Bubble pacing is proportional to the computed rate but is not a gas-volume measurement.'
			}
		]
	},
	ending: {
		summary:
			'Rate is a slope, k is a metronome, half-life is a fingerprint. Thermodynamics drew the terrain; kinetics has started calling the time.',
		invitation:
			'Next stop: how temperature winds this stopwatch — the mountain the molecules must cross.',
		backToHome: 'Back to the story catalog'
	}
} satisfies KineticsStoryContent;

export default enKineticsContent;
