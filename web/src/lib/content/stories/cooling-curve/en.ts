import type { CoolingCurveStoryContent } from '../../types';

export const enCoolingCurveContent = {
	locale: 'en',
	seo: {
		title: 'The Cooling-Curve Detective — VisualChem',
		description:
			'One unlabeled Bi–Cd alloy, one thermometer: reconstruct the whole binary eutectic phase diagram from the breaks and plateaus of its cooling curve. The liquidus is computed point by point from the Schröder–van Laar equation; the curve from a latent-heat balance.',
		path: '/en/stories/cooling-curve/',
		alternateLocalePath: '/stories/cooling-curve/',
		type: 'article',
		image: '/og-cooling-curve.png',
		imageAlt:
			'VisualChem story cover with the Bi–Cd eutectic phase diagram, a crucible, and a cooling curve',
		publishedTime: '2026-07-18',
		modifiedTime: '2026-07-18'
	},
	hero: {
		eyebrow: 'PHASE EQUILIBRIUM · STORY 04',
		title: ['The Cooling-Curve', 'Detective'],
		subtitle: 'One alloy, one thermometer — reconstruct the whole map from a temperature log.'
	},
	readingNote:
		'The stage on the right is driven by one melt state: the macroscopic crucible shows what the alloy is doing, the microscopic atoms explain why, and the symbolic panel switches between the temperature–time curve and the temperature–composition map — the detective’s evidence and verdict.',
	stage: {
		dialogAriaLabel: 'Graphic for the current scene',
		closeGraphicAriaLabel: 'Close the current graphic',
		openGraphicButton: 'View current graphic',
		shortStateAriaLabel: 'Current graphic state'
	},
	shortState: {
		temperature: ({ temperatureC }) => `T ${temperatureC} °C`,
		time: ({ timeS }) => `t ${timeS} s`,
		phase: 'Phase'
	},
	scenes: [
		{
			id: 'hook',
			prose: `In the physical-chemistry lab you are handed a tube of molten alloy — the instructor says it is a "bismuth–cadmium binary" but will not tell you the ratio.

Your only instrument is a thermometer.

**Can you reconstruct the complete phase diagram from a single cooling record?**

Predict first: what shape will the curve take?`
		},
		{
			id: 'pure-metal',
			prose: `If the tube held a **pure metal** — say pure bismuth — the cooling curve would show a **horizontal halt**: as the metal freezes, the released latent heat exactly pays for the heat leaking away, and the temperature parks at the melting point until the last drop solidifies.

The halt's height is the melting point; its length is proportional to the latent heat being paid.

But your alloy is not pure. What happens instead?`
		},
		{
			id: 'first-crystal',
			prose: `Cool slowly. At some temperature the **first crystal** appears — bismuth or cadmium? It depends on the ratio: a Bi-rich melt drops Bi first, a Cd-rich melt drops Cd.

The **liquidus equation** (Schröder–van Laar) says when that first crystal arrives:

$$T_{\\mathrm{liq}} = \\left(\\frac{1}{T_{\\mathrm{fus}}} - \\frac{R}{\\Delta H_{\\mathrm{fus}}}\\ln x\\right)^{-1}$$

And once crystals form, **the melt's composition starts to move** — pure Bi leaves, the remaining liquid grows Cd-rich, and the liquidus temperature keeps falling. The curve shows a **break**, then keeps descending on a gentler slope.`
		},
		{
			id: 'eutectic-arrest',
			prose: `The liquid slides down the liquidus until it reaches the **eutectic point**: both crystals now freeze together, weaving lamellae as the last liquid solidifies in one go.

Here the curve shows a **horizontal arrest** — not because heat transfer slowed, but because three coexisting phases pin the temperature.

**The arrest's length is proportional to how much liquid remains on arrival.** Remember that line; it earns its keep soon.`
		},
		{
			id: 'read-the-map',
			prose: `Now move the evidence onto the map:

- The **break** temperature → one **liquidus** data point for this composition
- The **arrest** temperature → the **eutectic temperature** (every composition shares one horizontal line)
- The **arrest length** → the liquid fraction on arrival

Measure several compositions: each gives a liquidus point; every arrest parks at the same temperature; connect the dots — **from curves, the diagram**. This is exactly what the classic thermal-analysis laboratory has students do.`
		},
		{
			id: 'phase-rule',
			prose: `Why does the curve break where it breaks and stop where it stops? One sentence governs everything (condensed system):

$$F = C - P + 1$$

- **All liquid** (1 phase): $F=2$, temperature slides freely — the curve slopes
- **Liquid + one crystal** (2 phases): $F=1$, composition pinned to the liquidus — a break, then a gentler slope
- **Liquid + two crystals** (3 phases): $F=0$, temperature and composition both pinned — the horizontal arrest

The arrest is **the phase rule forbidding cooling** until the last drop of liquid is gone.`
		},
		{
			id: 'real-anchors',
			prose: `Check the map against the world:

- Pure Bi melts at **271.3 °C** (ΔH_fus 10.9 kJ/mol), pure Cd at **321.1 °C** (6.3 kJ/mol)
- Measured eutectic: about **145.5 °C** at 60 at% Bi / 40 at% Cd; this page's ideal model computes **135.3 °C** at x(Cd)=0.565 — the composition lands within a percent, the temperature runs ~10 K low: the honest price of the ideal-solution approximation

Eutectics are everywhere: road salt stops at the brine eutectic of **−21.1 °C**; 63/37 solder freezes crisply at **183 °C** while 50/50 wades through a ~30 °C pasty range; the Wood's-metal link in a fire sprinkler lets go all at once at **70 °C**.`
		},
		{
			id: 'cooling-rate',
			prose: `A caution from the bench: cool too fast and **supercooling** delays nucleation — the curve dives below the true temperature, then snaps back (recalescence); breaks get rounded, arrests get dragged low.

An ideal cooling curve needs near-equilibrium: the liquid sitting on the liquidus at every instant. The curves on this page are simulated with Newtonian heat loss plus equilibrium freezing — the wiggles and rounded corners on a real recorder are kinetics reminding you it exists.`
		},
		{
			id: 'sandbox',
			prose: `Now the tube is yours: mix any composition, press cool, and watch the curve answer.

**Challenges**: find the ratio with the longest arrest (the apex of Tammann's triangle); then mix a curve with almost no arrest at all; read a liquidus temperature off a break and check it against the map.`
		}
	],
	interactions: {
		hook: {
			question: 'Predict first: the cooling curve will show',
			options: [
				{ id: 'smooth', label: 'A smooth slide, no breaks' },
				{ id: 'one-break', label: 'One break + one plateau', correct: true },
				{ id: 'many-steps', label: 'Many plateaus, like stairs' }
			],
			correctExplanation:
				'Correct. An off-eutectic melt drops one crystal first (the slope breaks), then freezes in one go at the eutectic temperature (the plateau).'
		},
		firstCrystal: {
			compositionLabel: 'Cadmium mole fraction',
			compositionUnit: 'x(Cd)',
			showLiquidusButton: 'Show the computed liquidus'
		},
		eutecticArrest: {
			compositionLabel: 'Cadmium mole fraction',
			compositionUnit: 'x(Cd)',
			showSolidusButton: 'Mark the eutectic temperature'
		},
		readTheMap: {
			showCurveButton: 'Plot the evidence on the map'
		},
		sandbox: {
			compositionLabel: 'Cadmium mole fraction',
			compositionUnit: 'x(Cd)',
			playButton: '▶ Start cooling',
			pauseButton: '⏸ Pause',
			resetButton: '↻ Reset',
			challenge: 'Find the longest arrest; then mix a curve with almost none.'
		}
	},
	triView: {
		defaultAriaLabel: 'Triple-representation stage for the Bi–Cd alloy',
		liveSummary: ({ region, melt }) => `Current state: ${region}, liquid fraction ${melt}.`,
		synchronizedState: 'One melt · three representations',
		crucible: {
			ariaLabel: 'Crucible view',
			viewName: 'Macro · Crucible',
			caption:
				'Melt glow and crystal shapes are illustrative; which crystals form, and how much, is computed.',
			temperatureLabel: ({ temperatureC }) => `${temperatureC} °C`,
			liquidLabel: ({ percent }) => `Liquid ${percent}%`,
			solidALabel: ({ percent }) => `Bi crystals ${percent}%`,
			solidBLabel: ({ percent }) => `Cd crystals ${percent}%`,
			clockLabel: ({ minutes }) => `t = ${minutes} min`
		},
		melt: {
			ariaLabel: 'Atom view',
			viewName: 'Micro · Atoms',
			caption: 'Atom counts scale with the computed phase fractions; positions are schematic.',
			bismuth: 'Bi',
			cadmium: 'Cd',
			liquidTag: 'Melt',
			crystalTag: 'Crystals'
		},
		diagram: {
			ariaLabel: ({ temperatureC, region }) =>
				`Bi–Cd phase diagram, currently ${temperatureC} °C, in ${region}`,
			xAxis: 'Cadmium mole fraction x(Cd)',
			curveXAxis: 'Time t / s',
			yAxis: 'Temperature T / °C',
			bismuthVertex: 'Bi',
			cadmiumVertex: 'Cd',
			liquidusLine: 'Liquidus',
			eutecticPoint: 'Eutectic',
			breakMarker: 'Break',
			arrestMarker: 'Arrest',
			caption: {
				map: 'The liquidus is computed point by point from the Schröder–van Laar equation; the eutectic is where the two branches meet.',
				curve:
					"This composition's cooling curve is stepped from Newtonian heat loss plus latent heat; the break and the arrest are computed, not sketched."
			}
		},
		regionNames: {
			liquid: 'All liquid',
			'liquid+A': 'Liquid + Bi crystals',
			'liquid+B': 'Liquid + Cd crystals',
			'eutectic-arrest': 'Eutectic freezing',
			'solid-mixture': 'Solid mixture'
		}
	},
	edge: {
		title: 'The detective’s toolkit',
		facts: [
			{
				term: 'Liquidus',
				definition:
					'The temperature–composition line where the first crystal appears; Schröder–van Laar under the ideal-solution assumption.'
			},
			{
				term: 'Eutectic point',
				definition:
					'Where the two liquidus branches meet: the one temperature and composition at which both crystals freeze together, F = 0.'
			},
			{
				term: 'Phase rule',
				definition:
					'F = C − P + 1 (condensed system): the count of intensive properties still free to vary.'
			},
			{
				term: 'Tammann triangle',
				definition:
					'Plot arrest length against composition and a triangle appears; its apex is the eutectic composition — a classic since 1903.'
			}
		]
	},
	conceptCheck: {
		question:
			'If the alloy happens to be mixed at exactly the eutectic ratio, what does its cooling curve look like?',
		options: [
			{ label: 'No plateau — a slope all the way down' },
			{ label: 'A single plateau, parked at the eutectic temperature' },
			{ label: 'Two plateaus, one per crystal type' },
			{ label: 'Plateau first, then a break — the usual order reversed' }
		],
		correctIndex: 1,
		explanation:
			'A eutectic-ratio melt has its liquidus at the eutectic temperature itself: the moment it arrives, three-phase coexistence (F = 0) begins and the whole solidification happens at that one temperature — a single plateau, like a pure substance. That is why "eutectic solder" freezes crisply.'
	},
	sandbox: {
		title: 'The cooling-curve laboratory',
		description:
			'Mix any composition and run a full cool-down; the curve, the crucible, and the map answer together.',
		compositionLabel: 'Cadmium mole fraction',
		compositionUnit: 'x(Cd)',
		controls: {
			play: '▶ Start cooling',
			pause: '⏸ Pause',
			reset: '↻ Reset'
		},
		challenge:
			"Find the ratio with the longest arrest (Tammann's apex); mix a curve with almost none; read a liquidus temperature off a break and check it on the map."
	},
	modelCard: {
		title: 'Model card · V0.1',
		items: [
			{
				term: 'System',
				value:
					'Bi–Cd simple binary eutectic; terminal solid solubility is negligible (<1 at%), so the freezing solids are pure crystals — which is what makes it the textbook thermal-analysis system (Chinese labs often run Sn-Bi or Pb-Sn; same physics).'
			},
			{
				term: 'Liquidus',
				value:
					'Schröder–van Laar ideal-solution equation, analytic in both directions. Pure-component data: Bi 271.3 °C, ΔH_fus 10.9 kJ/mol (the NIST reference material gives 11.1); Cd 321.1 °C, 6.25 kJ/mol (CODATA).'
			},
			{
				term: 'Eutectic (ideal vs measured)',
				value:
					'Model: 135.3 °C at x(Cd)=0.565. Literature: 144–146 °C at ~40 at% Cd. Composition within one atomic percent; temperature ~10 K low — Bi-Cd mixes nearly ideally (ΔH_mix ≈ +840 J/mol), and the residual bias is declared, not hidden.'
			},
			{
				term: 'Cooling simulation',
				value:
					"Newtonian heat loss plus an equilibrium latent-heat source; in two-phase fields the effective heat capacity is C_p + ΔH·(df_s/dT), and the eutectic arrest pays out the remaining liquid's latent-heat budget step by step. Supercooling and recalescence are not modeled and are discussed in the text."
			},
			{
				term: 'Everyday anchors',
				value:
					"Brine eutectic −21.1 °C / 23.3 wt% (ice + NaCl·2H₂O); FHWA's practical salting floor near −9.5 °C; Sn-Pb 63/37 vs 50/50 solidus–liquidus; Wood's-metal sprinkler links at 70 °C — all with primary citations in the repository notes."
			}
		]
	},
	ending: {
		summary:
			"One temperature log holds the whole map: the breaks surrender the liquidus, the arrest pins the eutectic temperature, and the arrest's length points at the eutectic composition.",
		invitation: "The detective's next case is waiting in the catalog.",
		backToHome: 'Back to the story catalog'
	}
} satisfies CoolingCurveStoryContent;

export default enCoolingCurveContent;
