import type { EntropyStoryContent } from '../../types';

export const enEntropyContent = {
	locale: 'en',
	seo: {
		title: 'Entropy Is Not Disorder — VisualChem',
		description:
			'Pull the divider and the gas never comes back — why? No "messiness" metaphors: count microstates one by one in your browser, watch ln W grow into entropy, √N pin the fluctuations, and 2⁻¹⁰⁰ pass the verdict of irreversibility.',
		path: '/en/stories/entropy/',
		alternateLocalePath: '/stories/entropy/',
		type: 'article',
		image: '/og-entropy.png',
		imageAlt: 'VisualChem story cover with a two-bulb gas, a microstate histogram, and S = k ln W',
		publishedTime: '2026-07-18',
		modifiedTime: '2026-07-18'
	},
	hero: {
		eyebrow: 'THERMODYNAMICS · STORY 05',
		title: ['Entropy is not', 'disorder'],
		subtitle: 'It is an honest count. The moment the valve opens, the numbers take over.',
		heroTag: 'W = C(N, n) · counted one by one'
	},
	readingNote:
		'The stage on the right is driven by one set of particles: the macroscopic bulbs show what the gas does, the histogram counts how many ways each split can happen, and S = k ln W turns the count into thermodynamics. The three panels never disagree — entropy is not a quantity from another world; it is this count.',
	stage: {
		dialogAriaLabel: 'Graphic for the current scene',
		closeGraphicAriaLabel: 'Close the current graphic',
		openGraphicButton: 'View current graphic',
		shortStateAriaLabel: 'Current graphic state'
	},
	scenes: [
		{
			id: 'hook',
			prose: `Two glass bulbs, a valve between them. Gas on the left, vacuum on the right.

Open the valve — the gas roars into the right bulb, and within seconds each side holds half. Wait a day, a year, a hundred million years: it will never crawl back into the left bulb on its own.

**No law of mechanics forbids the return.** Play every collision backwards and each one is perfectly legal. So what is standing in the way?

Place your bet.`
		},
		{
			id: 'count-the-ways',
			prose: `Forget "messiness" — let us **count**.

Give every molecule a coin: heads = left bulb, tails = right. Each heads-tails pattern of the $N$ molecules is one **microstate**, and the number of ways to put exactly $n$ molecules on the left is

$$W(n) = \\binom{N}{n} = \\frac{N!}{n!\\,(N-n)!}$$

With $N=4$: all-left can happen in exactly **1** way; a two-two split in **6**. Drag the particle count and watch the census take off — by $N=100$, the even split has about $10^{29}$ ways, while "all left" still has its lonely 1.`
		},
		{
			id: 'the-spike',
			prose: `Plot $W(n)$ and you do not get a gentle hill. You get a **spike**.

The bigger $N$, the sharper: the peak's width grows only as $\\sqrt{N}$ while the axis stretches as $N$. At $N=100$, a window of ±10 molecules already holds over 95 % of all microstates; at $N=10^{23}$ the window holding 99.9999…% is too narrow to **draw** — thinner than an atom.

The macroscopic world only ever sees the tip of the spike. "Equilibrium" is that spike's name.`
		},
		{
			id: 'boltzmann',
			prose: `Boltzmann carved this census into a formula — and onto his gravestone:

$$S = k \\ln W$$

The logarithm is there because $W$ multiplies for independent systems while thermodynamics needs entropy to add; the constant $k = 1.38\\times 10^{-23}\\ \\mathrm{J/K}$ converts a count into calorimeter units.

Double the volume of one mole of gas and every molecule doubles its options, so $W$ gains a factor $2^{N_A}$:

$$\\Delta S = N_A k \\ln 2 = R\\ln 2 = 5.76\\ \\mathrm{J\\,K^{-1}\\,mol^{-1}}$$

Not a metaphor — a number a calorimeter can check.`
		},
		{
			id: 'irreversible',
			prose: `Now answer the opening question: why does the gas never come back?

Press the button: all 100 molecules are stuffed back into the left bulb, then released. Each step, one randomly chosen molecule hops sides (Ehrenfest's urn). Watch the count fall toward the spike — and get **pinned there, jittering**.

Returning to all-left is not forbidden; its probability is $2^{-100} \\approx 10^{-30}$. Try once per nanosecond and you would wait $10^4$ ages of the universe. For a mole of molecules the exponent becomes $-10^{23}$.

**Irreversibility is not a decree. It is odds.**`
		},
		{
			id: 'fluctuations',
			prose: `In small systems, though, the odds are not lopsided — watch the histogram: the count keeps **jittering**.

At $N=100$, ±10 % excursions happen all the time; Brownian motion and critical opalescence are entropy's fluctuations made visible. Their relative size shrinks as $\\sqrt{N}/N = 1/\\sqrt{N}$: ten-thousand-fold more particles, hundred-fold quieter.

The iron certainty of the "laws" of thermodynamics is a gift statistics hands over as $N\\to 10^{23}$.`
		},
		{
			id: 'not-disorder',
			prose: `Finally, settle the famous metaphor: **entropy is not "mess".**

- Oil and water separating into neat layers is the **higher**-entropy state — in the hydrophobic effect it is the water molecules' count of arrangements that rules
- Hard spheres at high density **crystallize spontaneously**: the tidy lattice gives every sphere more room to rattle, $W_{\\text{crystal}} > W_{\\text{jumbled}}$
- A "messy-looking" deck of cards and a suit-sorted one have exactly the same number of microstates — **messiness is human aesthetics; entropy only counts**

"Disorder" has guessed right many times, and every time it guesses wrong it is because it was never the definition. There is only one definition: $S = k\\ln W$.`
		},
		{
			id: 'sandbox',
			prose: `The counter is yours.

Drag the particle count and watch the spike sharpen; frame a window and see how many microstates it swallows; herd every molecule back to the left and watch the odds drive them home to the spike.

**Challenge**: find an $N$ where a ±5 % window captures exactly 99 % of all microstates — then imagine pushing it to $10^{23}$.`
		}
	],
	kickers: {
		hook: '00',
		'count-the-ways': '01',
		'the-spike': '02',
		boltzmann: '03',
		irreversible: '04',
		fluctuations: '05',
		'not-disorder': '06',
		sandbox: '07'
	},
	interactions: {
		hook: {
			question: 'Predict first: what stops the gas from returning?',
			options: [
				{ id: 'force', label: 'Some unknown force' },
				{ id: 'law', label: 'A mechanical prohibition' },
				{ id: 'odds', label: 'Pure probability' }
			],
			explanation:
				'Probability. Every microscopic path is reversible, but the ways "back" are too few — 2⁻ᴺ few. The rest of this story counts that sentence out.'
		},
		countTheWays: {
			particlesLabel: 'Particles N'
		},
		irreversible: {
			releaseButton: '⏵ Stuff them all left, let go',
			resetButton: '↻ Reset',
			runningHint: 'Random hops running — watch the count fall to the spike.'
		},
		sandbox: {
			particlesLabel: 'Particles N',
			windowLabel: 'Window half-width ±',
			windowReadout: ({ percent, window }) =>
				`A ±${window} window captures ${percent}% of all microstates`
		}
	},
	triView: {
		defaultAriaLabel: 'Triple-representation stage for the two-bulb gas',
		liveSummary: ({ leftCount, total }) =>
			`Current state: ${leftCount} of ${total} particles in the left bulb.`,
		synchronizedState: 'One census · three representations',
		bulbs: {
			ariaLabel: 'Two-bulb view',
			viewName: 'Macro · Bulbs',
			caption:
				'Particle positions are schematic; the left-right counts match every statistic exactly.',
			leftLabel: 'Left',
			rightLabel: 'Right',
			valveOpen: 'Valve open',
			valveClosed: 'Valve closed'
		},
		histogram: {
			ariaLabel: ({ total }) => `Microstate histogram for ${total} particles`,
			viewName: 'Statistics · Way count',
			caption:
				'W(n) is computed point by point from binomial coefficients; the axis shows probability.',
			xAxis: 'Particles on the left, n',
			yAxis: 'P(n)',
			currentMarker: 'Now',
			allLeftMarker: 'All left'
		},
		entropy: {
			ariaLabel: 'Entropy readout view',
			viewName: 'Symbol · S = k ln W',
			caption: 'ln W in natural log; entropy reported in units of k.',
			lnWLabel: 'ln W',
			entropyReadout: ({ lnW }) => `S / k = ln W = ${lnW}`,
			oddsReadout: ({ exponent }) => `Odds of full return ≈ 10^${exponent}`
		}
	},
	edge: {
		eyebrow: 'THE LEDGER',
		title: 'The counter’s ledger',
		facts: [
			{
				term: 'Microstates W',
				definition:
					'The number of microscopic ways to realize one macroscopic look; in the two bulbs W(n) = C(N, n), countable one by one.'
			},
			{
				term: 'Boltzmann’s formula',
				definition:
					'S = k ln W: the log makes entropies of independent systems add, and k converts a count into calorimeter units. Carved on his grave in Vienna.'
			},
			{
				term: 'The √N law',
				definition:
					'Fluctuations grow as √N in absolute size and vanish as 1/√N in relative size — thermodynamic certainty is a gift of large numbers.'
			},
			{
				term: 'R ln 2',
				definition:
					'The 5.76 J/(K·mol) entropy of doubling a mole of gas: derived by counting, checkable by calorimetry.'
			}
		]
	},
	conceptCheck: {
		question:
			'At constant temperature, one mole of ideal gas is compressed back to half its volume. What happens to the system’s entropy?',
		options: [
			{ label: 'Nothing — temperature did not change, and entropy depends only on temperature' },
			{
				label:
					'It drops by R ln 2 — each molecule’s options halve, but the surroundings gain at least as much'
			},
			{ label: 'It rises — the compression work put energy into the gas' },
			{ label: 'It drops, and the entropy of the whole universe drops with it' }
		],
		correctIndex: 1,
		explanation:
			'Halving the volume halves every molecule’s positional options: the system loses R ln 2 ≈ 5.76 J/(K·mol). No conflict with the second law — the heat expelled during compression raises the surroundings’ entropy by at least as much. Local entropy can fall (life does it daily); the total ledger never shrinks.'
	},
	sandboxIntro: {
		eyebrow: 'FREE PLAY · Leave the storyline with a question',
		title: 'The counting laboratory',
		description:
			'Particle count, observation window, release experiment — all yours; the three panels answer together.'
	},
	modelCard: {
		title: 'Model card · V0.1',
		items: [
			{
				term: 'System',
				value:
					'A two-equal-bulb lattice gas: N in-principle-distinguishable particles, each equally likely left or right, W(n) = C(N, n). The minimal microstate-counting model of the classroom; real gases add momentum dimensions to the count, making the verdicts even more lopsided.'
			},
			{
				term: 'Computation',
				value:
					'All statistics run in log space (Stirling with the 1/(12n) correction for n ≥ 32, relative error < 1e-10), so N reaches hundreds without overflow; the histogram normalizes point by point, and unit tests pin normalization, symmetry, the 2⁻ᴺ tail, and R ln 2 = 5.763 J/(K·mol).'
			},
			{
				term: 'Release animation',
				value:
					'Ehrenfest’s urn: each step one particle, chosen by a fixed-seed LCG, hops sides — reproducible by construction. A cartoon of relaxation, not molecular dynamics; real relaxation rates are set by collision frequencies.'
			},
			{
				term: 'Sources for the "tidy yet higher-entropy" cases',
				value:
					'The hydrophobic effect (water’s configuration count drives demixing) and hard-sphere crystallization (the Alder transition, first shown by computer experiment in 1957) are standard statistical mechanics; this page cites them qualitatively — numerical simulations are backend work, see docs/后端待办.md.'
			},
			{
				term: 'What cannot be inferred from this page',
				value:
					'Nothing here treats the entropy of energy exchange (temperature, heat capacities, the third law) or the relation between information entropy and thermodynamic entropy — other stories. Mixing identical gases needs the Gibbs-paradox correction to particle distinguishability, declared here honestly.'
			}
		]
	},
	ending: {
		summary:
			'Entropy is not a substance, not a force, and not "mess". It is the number of ways — and large numbers show no mercy.',
		invitation: 'Next stop: let this census drive a chemical reaction downhill.',
		backToHome: 'Back to the story catalog'
	}
} satisfies EntropyStoryContent;

export default enEntropyContent;
