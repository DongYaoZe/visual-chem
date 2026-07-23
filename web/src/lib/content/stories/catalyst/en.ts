import type { CatalystStoryContent } from '../../types';

export const enCatalystContent = {
	locale: 'en',
	seo: {
		title: 'The Shortcut That Moves No Valley — VisualChem',
		description:
			'The same hydrogen peroxide barely fizzes, bubbles over iodide, and erupts around catalase. Follow the 73, 56, and 14 kJ/mol paths to see how catalysts lower a pass without moving either valley, accelerate both directions equally, and leave equilibrium untouched.',
		path: '/en/stories/catalyst/',
		alternateLocalePath: '/stories/catalyst/',
		type: 'article',
		image: '/og-catalyst.png',
		imageAlt:
			'VisualChem story cover with a bubbling hydrogen-peroxide experiment, a catalytic cycle, and three reaction-energy paths',
		publishedTime: '2026-07-23',
		modifiedTime: '2026-07-23'
	},
	hero: {
		eyebrow: 'KINETICS · STORY 10',
		title: ['The shortcut that', 'moves no valley'],
		subtitle:
			'A catalyst cuts down the pass and leaves both valleys where they were. Speed changes; equilibrium does not.',
		heroTag: '73 → 56 → 14 kJ·mol⁻¹ · the same two valleys'
	},
	readingNote:
		'The stage on the right follows one reaction path: the macroscopic bench reports rate as bubbles, the microscopic surface closes the loop from binding to release, and the symbolic panel overlays catalyzed and uncatalyzed energy profiles. All three tell the same story — a catalyst changes the route, never the start or finish.',
	stage: {
		dialogAriaLabel: 'Graphic for the current scene',
		closeGraphicAriaLabel: 'Close the current graphic',
		openGraphicButton: 'View current graphic',
		shortStateAriaLabel: 'Current graphic state'
	},
	scenes: [
		{
			id: 'hook',
			prose: `Three beakers, each holding hydrogen peroxide at the same concentration and temperature. Add nothing to the first, iodide to the second, and a little catalase to the third.

The reaction is identical:

$$2\\,\\mathrm{H_2O_2(aq) \\to 2\\,H_2O(l) + O_2(g)}$$

The first gives an occasional bubble, the second bubbles steadily, and the third all but erupts in foam. **If the start and finish are identical, how can a trace additive rewrite the clock by orders of magnitude?**

Place your bet.`
		},
		{
			id: 'the-pass',
			prose: `The reaction enthalpy is about

$$\\Delta_r H = -98\\ \\mathrm{kJ\\,mol^{-1}}\\quad\\text{(per mole of }\\mathrm{H_2O_2}\\text{)}$$

The product valley lies far below the reactant valley — thermodynamics says the trip is worthwhile. But an H₂O₂ molecule cannot drop straight from one to the other. Old bonds must stretch and electrons must rearrange, through a transition-state pass roughly **73 kJ/mol** above the start.

The Arrhenius law from the previous story prices admission as $e^{-E_a/RT}$. At room temperature, 73 kJ/mol is a forbidding gate. **Downhill tells you where; the pass tells you when.** That is why a bottle of peroxide can sit quietly for a while.`
		},
		{
			id: 'lower-pass',
			prose: `A catalyst does not shove molecules over the old pass. It provides a **different mechanism**.

On this teaching profile:

- Uncatalyzed path: $E_a \\approx 73\\ \\mathrm{kJ/mol}$
- Iodide path: $E_a \\approx 56\\ \\mathrm{kJ/mol}$
- Catalase path: $E_a \\approx 14\\ \\mathrm{kJ/mol}$

Iodide reacts with H₂O₂ in one step and is regenerated in another. The enzyme's heme active site holds the substrate in a productive geometry and stabilizes high-energy states along the way. A new route often has several smaller humps and intermediates; what matters is that its **highest pass is lower**.

Near room temperature, every 5.7 kJ/mol cut in Ea buys roughly one decade in the Arrhenius factor. Switch among the three paths: you are not changing the finish, only the fraction of molecules able to reach it.`
		},
		{
			id: 'both-ways',
			prose: `Read the energy profile from right to left and a common misconception dissolves.

Uncatalyzed, the forward pass is 73 kJ/mol. Because the products lie 98 kJ/mol lower, the reverse climb is **171 kJ/mol**. Lower the forward pass to 56 with the iodide path and the reverse pass becomes **154 kJ/mol** — both are cut by 17. The enzyme path cuts both by 59.

For the same reversible path at one temperature:

$$\\frac{k_f'}{k_f}=\\frac{k_r'}{k_r}=e^{\\Delta E_a/RT}$$

and therefore

$$K=\\frac{k_f}{k_r}=\\frac{k_f'}{k_r'}$$

**A catalyst accelerates forward and reverse reactions by the same factor.** It shortens the wait for equilibrium; it cannot change the equilibrium composition. To shift that composition, change temperature or pressure, or remove a product — do not reach for a catalyst.`
		},
		{
			id: 'unconsumed',
			prose: `How can a small amount of catalyst process so much substrate? Follow one full turn of the microscopic panel:

$$\\mathrm{Cat + R \\rightleftharpoons Cat\\!\\cdot\\!R \\to Cat\\!\\cdot\\!P \\rightleftharpoons Cat + P}$$

The catalyst participates, forms intermediates, then is **regenerated**. That is why it disappears from the net equation and is not consumed in stoichiometric proportion to product. Two practical numbers describe the cycle: turnover frequency, cycles per active site per second; and turnover number, total cycles before deactivation.

But “not consumed” does not mean “unchanged forever.” Impurities **poison** surfaces, nanoparticles sinter, carbon blocks pores, and enzymes denature. Industrial catalysts are regenerated or replaced because no real cycle is immortal.`
		},
		{
			id: 'enzymes',
			prose: `Enzymes turn “find another route” into precision engineering.

Catalase's active pocket is not a magic stone that merely lowers a hill. A channel selects what can enter; weak interactions pose H₂O₂ in the right geometry; heme iron temporarily handles electrons; acid-base groups relay protons; water and oxygen depart, restoring the site.

That architecture explains two powers:

- **Activity**: lower the highest barrier on an effective route
- **Selectivity**: make that route available to one substrate, one bond, or one stereochemical direction

Selectivity matters enormously. A process that runs a hundred times faster but fills the plant with hard-to-separate by-products may be no improvement at all. Sending every atom toward the desired product can be worth more than speed by itself.`
		},
		{
			id: 'no-free-lunch',
			prose: `Catalysis offers no free lunch.

It **cannot** make a thermodynamically unfavorable reaction favorable, alter $\\Delta G^\\circ$ or $K$, or supply the net energy a process requires. What it can do is make an allowed route usable, often delivering practical rates at lower temperature or pressure — and thereby saving energy indirectly.

The real design brief reaches far beyond “lowest Ea”:

- Activity: cycles per unit time
- Selectivity: feed that reaches the target product
- Stability: resistance to heat, poisons, coking, and wear
- Availability: scarce metals, recovery, and regeneration
- Transport: molecules through pores and heat out of the bed

Ammonia synthesis relies on iron catalysts, vehicle exhaust treatment on platinum-group metals, and life on enzymes. A catalyst is not a magic shortcut. It is a route co-designed by **chemistry, materials, flow, and economics**.`
		},
		{
			id: 'sandbox',
			prose: `The pass is yours.

	Hold the uncatalyzed route at 73 kJ/mol and the iodide route at 56 kJ/mol; move temperature alone. Both $k/A$ values rise with heat, but the taller uncatalyzed barrier responds more strongly, so iodide's **relative catalytic advantage falls**. The bubbles, solution-mediated cycle, and energy profile answer together; the endpoints remain pinned at 0 and −98 kJ/mol.

	**Challenge**: record the roughly 951-fold advantage at 25 °C, then heat to 100 °C. Verify that both absolute rates rise while the ratio shrinks to about 240-fold. The catalyst has not “stopped working”; the taller barrier is simply more temperature-sensitive.`
		}
	],
	kickers: {
		hook: '00',
		'the-pass': '01',
		'lower-pass': '02',
		'both-ways': '03',
		unconsumed: '04',
		enzymes: '05',
		'no-free-lunch': '06',
		sandbox: '07'
	},
	interactions: {
		hook: {
			question: 'Predict first: a catalyst speeds a reaction because',
			options: [
				{ id: 'heat', label: 'It continuously heats the molecules' },
				{ id: 'path', label: 'It opens a lower-barrier route' },
				{ id: 'equilibrium', label: 'It pushes equilibrium toward products' }
			],
			explanation:
				'It opens a lower-barrier route. Reactant and product energies, ΔG°, and the equilibrium constant stay put; only the highest pass between them changes. The three synchronized panels will pin down that distinction.'
		},
		lowerPass: {
			catalystLabel: 'Reaction path',
			catalystNames: ['Uncatalyzed · 73', 'Iodide · 56', 'Catalase · 14'],
			readout: ({ ea, boost }) => `Ea = ${ea} kJ/mol · ${boost}× vs uncatalyzed`
		},
		bothWays: {
			readout: ({ forwardBoost, reverseBoost }) =>
				`Forward ${forwardBoost}× · reverse ${reverseBoost}× · K unchanged`
		},
		sandbox: {
			eaLabel: 'Fixed iodide-path Ea',
			temperatureLabel: 'Temperature T',
			readout: ({ boost, ea, uncatalyzedFactor, catalyzedFactor }) =>
				`Ea = ${ea} kJ/mol · uncatalyzed k/A = ${uncatalyzedFactor} · iodide k/A = ${catalyzedFactor} · relative ${boost}×`
		}
	},
	triView: {
		defaultAriaLabel: 'Triple-representation stage for catalyzed hydrogen-peroxide decomposition',
		liveSummary: ({ ea, boost }) =>
			`Current path activation energy ${ea} kJ/mol; ${boost} times the uncatalyzed rate.`,
		synchronizedState: 'One path · three representations',
		bench: {
			ariaLabel: 'Hydrogen-peroxide decomposition bench view',
			viewName: 'Macro · Bench',
			caption:
				'Bubble frequency compresses the Arrhenius factor; it shows relative speed, not calibrated gas flow.',
			plainTag: 'Uncatalyzed',
			catalyzedTag: 'Current path',
			bubbleRate: ({ boost }) => `Relative rate ${boost}×`
		},
		surface: {
			viewName: 'Micro · Catalytic cycle',
			states: {
				none: {
					ariaLabel: 'Molecular sketch of uncatalyzed hydrogen-peroxide decomposition',
					caption:
						'No mediator or active site is present; molecules must attempt the high-barrier direct route.',
					catalystLabel: 'No catalytic mediator',
					reactantLabel: '2 H₂O₂',
					productLabel: '2 H₂O + O₂',
					cycleTag: 'Direct route · slow'
				},
				iodide: {
					ariaLabel: 'Solution-phase iodide mediator cycle for hydrogen-peroxide decomposition',
					caption:
						'Homogeneous-mediator sketch: I⁻ becomes IO⁻ in solution and is then regenerated; this is not a solid surface.',
					catalystLabel: 'I⁻ ⇌ IO⁻',
					reactantLabel: '2 H₂O₂ enter',
					productLabel: '2 H₂O + O₂ leave',
					cycleTag: 'I⁻ → IO⁻ → I⁻'
				},
				catalase: {
					ariaLabel: 'Catalase heme pocket and substrate-selectivity diagram',
					caption:
						'Enzyme-pocket sketch: shape and the heme center select, orient, and convert H₂O₂.',
					catalystLabel: 'Catalase · heme',
					reactantLabel: '2 H₂O₂ enter in sequence',
					productLabel: '2 H₂O + O₂',
					cycleTag: 'Recognize → orient → convert → reset'
				}
			}
		},
		profile: {
			ariaLabel: ({ ea }) =>
				`Reaction-energy profile; current catalyzed activation energy ${ea} kilojoules per mole`,
			viewName: 'Symbol · Energy paths',
			caption:
				'Piecewise-cosine profiles; the reactants at 0 and products at −98 kJ/mol never move.',
			xAxis: 'Reaction coordinate',
			yAxis: 'Relative energy / kJ·mol⁻¹',
			plainCurve: 'Uncatalyzed · Ea 73',
			catalyzedCurve: 'Catalyzed path',
			eaMarker: 'Forward activation energy Ea',
			deltaHMarker: 'ΔH'
		}
	},
	edge: {
		eyebrow: 'THE PASSKEEPER',
		title: 'The passkeeper’s field notes',
		facts: [
			{
				term: 'Change the route, not the valleys',
				definition:
					'A catalyst lowers the effective activation barrier through new elementary steps. State-function energies of reactants and products stay fixed, so ΔG°, ΔH°, and K stay fixed.'
			},
			{
				term: 'Both ways, equally',
				definition:
					'Lower one reversible path by ΔEa and both directional barriers lose ΔEa. Both Arrhenius factors gain e^(ΔEa/RT), leaving kf/kr unchanged.'
			},
			{
				term: 'Cycles and turnover',
				definition:
					'A catalyst participates and is regenerated each cycle. Turnover frequency measures speed; turnover number measures lifetime. Poisoning, sintering, coking, and denaturation end real cycles.'
			},
			{
				term: 'Selectivity',
				definition:
					'A catalyst chooses among competing paths. Industrial value joins activity to selectivity, stability, recovery, and heat and mass transport.'
			}
		]
	},
	conceptCheck: {
		question:
			'A reversible reaction is already at equilibrium. What happens when a catalyst that changes only kinetics is added?',
		options: [
			{ label: 'Equilibrium shifts toward products because the forward reaction speeds up' },
			{
				label: 'Equilibrium shifts toward reactants because the reverse reaction is catalyzed too'
			},
			{
				label:
					'Composition stays fixed; forward and reverse rates both rise and remain equal to each other'
			},
			{ label: 'ΔG° falls, but K stays fixed' }
		],
		correctIndex: 2,
		explanation:
			'At equilibrium the forward and reverse rates are already equal. A thermodynamically consistent catalyst opens the same lower-barrier reversible path to both, so they rise together and remain equal. The free-energy difference, ΔG°, and K do not move. Away from equilibrium, the catalyst merely reaches the original equilibrium composition sooner.'
	},
	sandboxIntro: {
		eyebrow: 'FREE PLAY · Leave the storyline with a question',
		title: 'The pass design studio',
		description:
			'Hold the 73/56 kJ/mol routes fixed and change temperature; track both absolute rates and the relative catalytic advantage.'
	},
	modelCard: {
		title: 'Model card · V0.1',
		items: [
			{
				term: 'System and numerical anchors',
				value:
					'The reaction is 2 H₂O₂(aq) → 2 H₂O(l) + O₂(g). Teaching anchors, per mole of H₂O₂: ΔrH = −98 kJ/mol; effective forward barriers are 73 kJ/mol uncatalyzed, 56 with iodide, and 14 with catalase. They provide a common comparison scale; measured apparent Ea depends on pH, concentration, ionic strength, enzyme source, and fitting range.'
			},
			{
				term: 'Energy profiles',
				value:
					'The uncatalyzed route is one peak; the catalyzed route is a smooth, piecewise-cosine two-peak sketch with an intermediate. Its highest peak equals the selected Ea; reactants stay at 0 and products at −98 kJ/mol. The horizontal coordinate has no time or distance unit, and the drawn peak shapes cannot reveal transition-state structures.'
			},
			{
				term: 'Rate mapping',
				value:
					'Relative acceleration is exp[(Ea,uncatalyzed − Ea,current)/(RT)], assuming the same A to isolate the barrier effect. The sandbox fixes 73/56 kJ/mol: heating raises both k/A values, but the taller barrier gains faster, so their ratio falls. Real catalysis also changes A, coverage, and the rate-controlling step; this is not a process prediction. Bubble density and speed use log₁₀ compression, while the visible multiplier always reports the true value.'
			},
			{
				term: 'Boundary of the equilibrium claim',
				value:
					'A thermodynamically consistent reversible mechanism obeys microscopic reversibility: a catalyst cannot change ΔG° or K. The page uses “equal acceleration” for one shared transition path; apparent forward and reverse rates in a complex multistep network need not each collapse to one multiplier, but both must converge on the same equilibrium.'
			},
			{
				term: 'Reality not modeled',
				value:
					'The page does not simulate Michaelis–Menten saturation, surface adsorption isotherms, heat and mass transfer, induction periods, deactivation kinetics, or side-reaction networks. The enzyme and iodide cycles are mechanism sketches; elementary-reaction, TST/RRKM, surface-KMC, and reactor models remain backend work.'
			}
		]
	},
	ending: {
		summary:
			'A catalyst does not rewrite thermodynamics’ ending. It turns a route that takes forever into one that can finish today.',
		invitation:
			'Season three complete: concentration sets the clock, temperature opens the gate, and catalysts redraw the route.',
		backToHome: 'Back to the story catalog'
	}
} satisfies CatalystStoryContent;

export default enCatalystContent;
