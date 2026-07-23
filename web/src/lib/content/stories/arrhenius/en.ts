import type { ArrheniusStoryContent } from '../../types';

export const enArrheniusContent = {
	locale: 'en',
	seo: {
		title: 'Molecules over the Mountain — VisualChem',
		description:
			'How can a 21 °C drop slow a representative process almost ten-fold? Follow the high-energy tail from the Maxwell–Boltzmann distribution to k = Ae^(−Ea/RT), put the ten-degree rule on trial, and recover a barrier from two measurements — all computed live in your browser.',
		path: '/en/stories/arrhenius/',
		alternateLocalePath: '/stories/arrhenius/',
		type: 'article',
		image: '/og-arrhenius.png',
		imageAlt:
			'VisualChem story cover with molecular speed distributions, an energy threshold, and a pair of warm and cold cups',
		publishedTime: '2026-07-23',
		modifiedTime: '2026-07-23'
	},
	hero: {
		eyebrow: 'KINETICS · STORY 09',
		title: ['Molecules over', 'the mountain'],
		subtitle:
			'The average speed barely shifts; the high-energy tail can double. That tail is where temperature winds the reaction clock.',
		heroTag: 'k = A e^(−Ea/RT) · computed from temperature and barrier height'
	},
	readingNote:
		'One temperature drives the whole stage: the warm and cold cups compare two macroscopic fates, the collision chamber highlights high-energy molecules, and the symbolic panel overlays two Maxwell–Boltzmann speed distributions with an energy threshold. The distribution tail supplies the intuition; the Arrhenius exponential supplies this page’s quantitative model. We do not pretend they are the same exact integral.',
	stage: {
		dialogAriaLabel: 'Graphic for the current scene',
		closeGraphicAriaLabel: 'Close the current graphic',
		openGraphicButton: 'View current graphic',
		shortStateAriaLabel: 'Current graphic state'
	},
	scenes: [
		{
			id: 'hook',
			prose: `Split the same carton of milk between two cups: one stays on a 25 °C counter; the other goes into a 4 °C refrigerator.

Suppose one key spoilage process covers a certain stretch of its journey in one day on the counter. **Roughly how long would that same process take in the refrigerator?**

The temperature falls by only 21 °C — just 7 % on the kelvin scale. The answer need not be “7 % longer.”

Place your bet.`
		},
		{
			id: 'two-populations',
			prose: `Last season left a case unsolved: diamond turning into graphite is downhill (ΔG < 0), yet your ring sits there unharmed.

**There is a mountain across the downhill road.** Reactants must stretch old bonds and rearrange their geometry, passing through a high-energy transition state before they can descend to products. The pass above the reactants is the **activation energy**, $E_a$.

Nor are molecules at one temperature a regiment marching at one speed. Some are slow, some fast; their speeds spread into a Maxwell–Boltzmann distribution. Heating does not accelerate every molecule by the same amount — it broadens the distribution and shifts it toward higher speed. **The useful question is not the average, but how much tail survives beyond the barrier.**`
		},
		{
			id: 'the-tail',
			prose: `Barrier-crossing collisions come from the almost invisible **high-energy tail**. In this page’s minimal Arrhenius model, the barrier’s exponential penalty is

$$\\frac{k}{A} = e^{-E_a/RT}$$

At $E_a = 50\\ \\mathrm{kJ\\,mol^{-1}}$ and $T = 298.15\\ \\mathrm{K}$, $k/A = 1.74\\times10^{-9}$. That does not claim that “exactly 1.74 of every billion collisions reacts”: collision frequency, orientation, and transmission still live inside $A$. It says that **crossing this barrier alone imposes suppression on the scale of one part per billion.**

Move the temperature slider. The body of the distribution seems to budge only slightly, while the exponential factor multiplies. A small temperature change concentrates its leverage in the tail.`
		},
		{
			id: 'arrhenius-law',
			prose: `In 1889, Arrhenius wrote the temperature code as

$$k = A\\,e^{-E_a/RT}$$

$k$ is the rate constant and $A$ the pre-exponential factor. If $A$ and $E_a$ are approximately constant across a temperature interval, take the logarithm:

$$\\ln k = \\ln A - \\frac{E_a}{R}\\frac{1}{T}$$

Plot $\\ln k$ against $1/T$ and the curve stands up straight, with slope $-E_a/R$. This is the series’ third use of the same move: **choose the right coordinates and the law straightens itself.**

The line is also an experiment: measure $k$ at several temperatures and infer an apparent activation energy from the slope. If the points bend or break, they may be warning that the mechanism or rate-limiting step has changed.`
		},
		{
			id: 'rule-of-thumb',
			prose: `The classroom rule says, “A 10 °C rise makes a reaction roughly two to four times faster.” Put it on trial.

From 298.15 to 308.15 K:

- $E_a = 53\\ \\mathrm{kJ\\,mol^{-1}}$: $k_2/k_1 = 2.00$ — a clean doubling
- $E_a = 20\\ \\mathrm{kJ\\,mol^{-1}}$: only $1.30$ times
- $E_a = 120\\ \\mathrm{kJ\\,mol^{-1}}$: $4.81$ times

**Ten degrees does not constitute a law. Doubling is the coincidence made by a 53 kJ/mol barrier near room temperature.** At the same starting temperature, a higher barrier makes the rate more temperature-sensitive; move to another temperature range and every multiplier changes again.`
		},
		{
			id: 'life-runs-on-it',
			prose: `The exponential reaches far beyond the laboratory — but each example comes with boundaries:

- **Refrigerator**: represent one key process by $E_a = 75\\ \\mathrm{kJ\\,mol^{-1}}$. Cooling from 25 to 4 °C gives $k_4/k_{25}=0.101$, stretching its characteristic time by about **9.9-fold**. That answers the opening scale; it is not a shelf-life or food-safety promise, because real spoilage also involves microbial growth, packaging, and many reactions
- **Snowy tree cricket**: chirp rate changes with ambient temperature. The page uses an empirical Dolbear calibration: about 112 chirps/min at 20 °C and 148 at 25 °C. It is a biological thermometer over a limited range, not a direct measurement of one $E_a$
- **Firefly**: light production is enzyme-driven, so temperature can alter the flash rhythm; species, circadian timing, and physiology act alongside it

The common thread is not “everything obeys one perfect line.” It is that **ectotherms and biochemical processes can make temperature sensitivity audible and visible.**`
		},
		{
			id: 'two-point',
			prose: `Even without a whole line, two temperatures can give a first estimate of the mountain:

$$\\ln\\frac{k_2}{k_1}=\\frac{E_a}{R}\\left(\\frac{1}{T_1}-\\frac{1}{T_2}\\right)$$

Suppose one reaction has $k_1=1.20\\times10^{-3}\\ \\mathrm{s^{-1}}$ at 293.15 K and $k_2=6.09\\times10^{-3}\\ \\mathrm{s^{-1}}$ at 313.15 K. The result is $E_a\\approx62.0\\ \\mathrm{kJ\\,mol^{-1}}$.

The two-point method is quick, but it leaves no spare point to test whether the “line” is actually straight. Temperature error, rate error, and a changing mechanism are all compressed into one **apparent activation energy**. Two points estimate; a multi-point regression can put the model on trial.`
		},
		{
			id: 'sandbox',
			prose: `The temperature bench is yours.

Two controls — temperature and activation energy — recompute the distribution, barrier factor, doubling interval, and cricket reading; the cups and collision chamber answer in step.

**Challenges**: find the barrier that doubles the rate for exactly a 10 K rise near room temperature; then hold temperature fixed and raise the barrier until $k/A$ falls below $10^{-12}$; finally explain why “more temperature-sensitive” does not mean “faster to begin with.”`
		}
	],
	kickers: {
		hook: '00',
		'two-populations': '01',
		'the-tail': '02',
		'arrhenius-law': '03',
		'rule-of-thumb': '04',
		'life-runs-on-it': '05',
		'two-point': '06',
		sandbox: '07'
	},
	interactions: {
		hook: {
			question: 'Predict first: the key process in the refrigerator will be roughly',
			options: [
				{ id: 'seven-percent', label: 'Only 7% slower' },
				{ id: 'twice', label: 'About 2× slower' },
				{ id: 'tenfold', label: 'About 10× slower' }
			],
			explanation:
				'For a representative apparent barrier of 75 kJ/mol, cooling from 25 to 4 °C reduces k to 0.101 of its former value, stretching the characteristic time about 9.9-fold. This estimates one process, not the shelf life of real milk.'
		},
		theTail: {
			temperatureLabel: 'Temperature T',
			temperatureScale: { start: 'Cold · 0 °C', end: 'Hot · 80 °C' },
			readout: ({ tailShare, boost }) =>
				`Barrier factor k/A = ${tailShare} · relative to 25 °C: ${boost}×`
		},
		ruleOfThumb: {
			eaLabel: 'Activation energy Eₐ',
			readout: ({ ea, rise }) => `Eₐ = ${ea} kJ/mol · doubling rise ${rise} K`
		},
		twoPoint: {
			readout: ({ ea }) => `From two points: Eₐ = ${ea} kJ/mol`
		},
		sandbox: {
			temperatureLabel: 'Temperature T',
			eaLabel: 'Activation energy Eₐ',
			readout: ({ tailShare, doubling, chirps }) =>
				`k/A = ${tailShare} · doubling rise ${doubling} K · cricket ≈ ${chirps} chirps/min`
		}
	},
	triView: {
		defaultAriaLabel: 'Triple-representation stage for temperature and reaction rate',
		liveSummary: ({ temperatureC, eaKJPerMol, tailShare }) =>
			`Current temperature ${temperatureC} degrees Celsius, activation energy ${eaKJPerMol} kilojoules per mole, and Arrhenius barrier factor k over A ${tailShare}.`,
		synchronizedState: 'One temperature · three representations',
		scene: {
			ariaLabel: ({ coldTemperatureC, hotTemperatureC }) =>
				`Two-cup comparison: the colder cup on the left is ${coldTemperatureC} degrees Celsius; the warmer cup on the right is ${hotTemperatureC} degrees Celsius.`,
			viewName: 'Macro · Two cups',
			caption:
				'The colder temperature is always on the left and the warmer one on the right; change follows one Arrhenius model, not a food-safety timeline.',
			coldTag: 'Colder',
			hotTag: 'Warmer',
			temperatureLabel: ({ temperatureC }) => `${temperatureC} °C`
		},
		collisions: {
			ariaLabel: ({ temperatureC, eaKJPerMol, tailShare, highlighted, total }) =>
				`Molecular collision and barrier schematic at ${temperatureC} degrees Celsius and activation energy ${eaKJPerMol} kilojoules per mole. The actual barrier factor is ${tailShare}; logarithmic compression highlights ${highlighted} of ${total} indicator particles.`,
			viewName: 'Micro · Collisions',
			caption:
				'Positions and speeds are deterministic; highlight count logarithmically compresses the orders of magnitude in k/A and is not a literal reaction count in this small sample.',
			slowLabel: 'Lower energy',
			fastLabel: 'Crossing signal',
			barrierTag: 'Eₐ',
			crossingReadout: ({ tailShare, highlighted, total }) =>
				`Highlight ${highlighted}/${total} · actual k/A ${tailShare} · log-compressed`
		},
		distribution: {
			ariaLabel: ({ temperatureC }) =>
				`Molecular speed distributions and barrier at ${temperatureC} degrees Celsius`,
			viewName: 'Symbol · The high-energy tail',
			caption:
				'Curves are normalized reduced-speed distributions; the tail readout uses e^(−Eₐ/RT), not the exact three-dimensional integral of either curve.',
			xAxis: 'Reduced speed v/vₚ',
			yAxis: 'Probability density',
			tailLabel: 'High-energy tail',
			thresholdLabel: 'Barrier Eₐ',
			coldCurve: 'Lower T',
			hotCurve: 'Higher T'
		}
	},
	edge: {
		eyebrow: 'THE MOUNTAIN PASS',
		title: 'Rules of the pass',
		facts: [
			{
				term: 'The Arrhenius exponential',
				definition:
					'k/A = e^(−Eₐ/RT): temperature enters an exponent, so a small change becomes a large multiplier in the high-energy tail.'
			},
			{
				term: 'The line’s slope',
				definition:
					'The slope of ln k against 1/T is −Eₐ/R; curvature or a kink may report a changing mechanism, not merely bad data.'
			},
			{
				term: 'The ten-degree rule',
				definition:
					'For 53 kJ/mol from 298.15 to 308.15 K, the ratio is 2.00. Change the barrier or temperature range and the rule changes its answer.'
			},
			{
				term: 'The two-point method',
				definition:
					'Two k–T points estimate an apparent Eₐ but cannot test linearity; multiple points can expose curvature and a mechanism change.'
			}
		]
	},
	conceptCheck: {
		question:
			'For the same starting temperature, the same 10 K rise, and Arrhenius behavior, which reaction has the larger k₂/k₁?',
		options: [
			{ label: 'The higher-Eₐ reaction — its exponential is more temperature-sensitive' },
			{ label: 'The lower-Eₐ reaction — it is usually faster before heating' },
			{ label: 'They are equal — both were heated by 10 K' },
			{ label: 'The pre-exponential factor A alone decides this ratio' }
		],
		correctIndex: 0,
		explanation:
			'The ratio is exp[(Eₐ/R)(1/T₁−1/T₂)], so it grows with Eₐ when T₁ and T₂ are fixed; A cancels. “Larger heating multiplier” does not mean “larger original k”: a taller mountain can be more temperature-sensitive and still much harder to cross.'
	},
	sandboxIntro: {
		eyebrow: 'FREE PLAY · Leave the storyline with a question',
		title: 'The molecular temperature bench',
		description:
			'Temperature and activation energy are yours; the cups, collisions, and high-energy tail answer together.'
	},
	modelCard: {
		title: 'Model card · V0.1',
		items: [
			{
				term: 'Rate model',
				value:
					'The page computes k/A = exp(−Eₐ/RT) and rate ratios for the same reaction, treating A and Eₐ as constant across the selected range. Eₐ enters in kJ/mol and is converted to J/mol internally; R = 8.314462618 J/(mol·K).'
			},
			{
				term: 'Distribution and tail',
				value:
					'The symbolic panel draws a numerically normalized reduced Maxwell–Boltzmann speed distribution, f(x) ∝ x²exp(−x²/τ). Its numerical tail readout separately uses the Arrhenius barrier factor exp(−Eₐ/RT). The exact 3D speed-tail integral has a prefactor, and real reactions also depend on orientation and transmission; the page does not claim strict equality.'
			},
			{
				term: 'Everyday anchors',
				value:
					'The refrigerator example uses apparent Eₐ = 75 kJ/mol only to estimate a 9.9-fold single-process timescale, never food shelf life or safety. The snowy tree cricket uses the on-page empirical Dolbear relation T(°F)=50+(N₆₀−40)/4, a teaching approximation for the relevant species and range. Fireflies are a qualitative biological anchor only.'
			},
			{
				term: 'Two-point inversion',
				value:
					'eaFromTwoPoints recovers an apparent Eₐ directly from two positive k–T pairs. The example 293.15/313.15 K and 1.20×10⁻³/6.09×10⁻³ s⁻¹ returns about 62.0 kJ/mol. Two points have no residuals and cannot test Arrhenius linearity.'
			},
			{
				term: 'What cannot be inferred from this page',
				value:
					'The page does not resolve mechanisms, transition-state entropy, or quantum tunnelling, and it does not promise one A and Eₐ across a broad temperature range. Diffusion control, enzyme denaturation, phase changes, and a changing rate-limiting step can all produce non-Arrhenius behavior; an “apparent Eₐ” is then only a local slope.'
			}
		]
	},
	ending: {
		summary:
			'The average barely moves and the tail can double. Temperature does not remove the mountain; it sends more molecules toward the pass.',
		invitation: 'Next stop: if we do not heat the system, can we open a lower road?',
		backToHome: 'Back to the story catalog'
	}
} satisfies ArrheniusStoryContent;

export default enArrheniusContent;
