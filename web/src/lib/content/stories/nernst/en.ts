import type { NernstStoryContent } from '../../types';

export const enNernstContent = {
	locale: 'en',
	seo: {
		title: 'The Potential Landscape Inside a Battery — VisualChem',
		description:
			'A strip of zinc, a strip of copper, two salt solutions — where does 1.10 V come from? The ladder of electrode potentials, the Nernst slope, the discharge plateau and its final avalanche: every number of the Daniell cell is computed from standard potentials in your browser.',
		path: '/en/stories/nernst/',
		alternateLocalePath: '/stories/nernst/',
		type: 'article',
		image: '/og-nernst.png',
		imageAlt:
			'VisualChem story cover with a Daniell cell, an ion view, and the electrode-potential ladder',
		publishedTime: '2026-07-18',
		modifiedTime: '2026-07-18'
	},
	hero: {
		eyebrow: 'THERMODYNAMICS · STORY 07',
		title: ['The potential landscape', 'inside a battery'],
		subtitle:
			'There is no magic in 1.10 V. It is the gap between two rungs — computable to the digit.',
		heroTag: 'E = E° − (RT/nF)·ln Q · computed from standard potentials'
	},
	readingNote:
		'The stage on the right is driven by one cell state: the macroscopic battery shows electrodes, salt bridge, and the voltmeter; the microscopic ions explain why the electrons want this route; and the symbolic panel draws the ladder of electrode potentials — the gap between two rungs is the volts on the meter.',
	stage: {
		dialogAriaLabel: 'Graphic for the current scene',
		closeGraphicAriaLabel: 'Close the current graphic',
		openGraphicButton: 'View current graphic',
		shortStateAriaLabel: 'Current graphic state'
	},
	scenes: [
		{
			id: 'hook',
			prose: `Zinc into zinc sulfate, copper into copper sulfate, a salt bridge across, and the voltmeter lights up:

$$1.10\\ \\mathrm{V}$$

No more, no less. Use stronger solutions — still about 1.10 V. Build the cell ten times bigger — still 1.10 V.

**Where does that number come from?** Why not 2 V, why not 0.5?

Place your bet.`
		},
		{
			id: 'two-heights',
			prose: `Taken apart, this is **two** half-reactions:

- Zinc side: $\\mathrm{Zn \\to Zn^{2+} + 2e^-}$ — zinc is "willing" to shed electrons and dissolve
- Copper side: $\\mathrm{Cu^{2+} + 2e^- \\to Cu}$ — copper ions are "willing" to catch them and deposit

Willingness can be measured: rank every half-reaction against one common ruler (the standard hydrogen electrode) and you get **standard electrode potentials**:

$$E^\\circ(\\mathrm{Cu^{2+}/Cu}) = +0.34\\ \\mathrm{V} \\qquad E^\\circ(\\mathrm{Zn^{2+}/Zn}) = -0.76\\ \\mathrm{V}$$

Electrons jump from the lower rung to the higher one, and the gap is the voltage: $0.34 - (-0.76) = 1.10\\ \\mathrm{V}$. **The answer is not magic. It is a table.**`
		},
		{
			id: 'the-ladder',
			prose: `Hang every common couple on that ruler and you get electrochemistry’s **ladder** — the standard-potential table of every textbook, turned upright:

- At the top, $\\mathrm{F_2/F^-}$ (+2.87 V): the hungriest oxidant
- Midway, $\\mathrm{Cu^{2+}/Cu}$, $\\mathrm{H^+/H_2}$ (defined as 0), $\\mathrm{Zn^{2+}/Zn}$
- At the bottom, $\\mathrm{Li^+/Li}$ (−3.04 V): the most generous reductant

Pick any two rungs; the gap is that pair’s standard voltage. The 3–4 V secret of lithium batteries is simply **shopping from both ends of the ladder**. The ladder is not memorization material — it is the price list of every battery ever built.`
		},
		{
			id: 'nernst-slope',
			prose: `But 1.10 V holds only at **standard concentrations** (1 mol/L). Move a concentration and the rung slides — the Nernst equation gives the exact slope:

$$E = E^\\circ - \\frac{RT}{nF}\\ln\\frac{[\\mathrm{Zn^{2+}}]}{[\\mathrm{Cu^{2+}}]}$$

With $n=2$ at room temperature the slope is **29.6 mV per decade**: ten-fold richer zinc drops the voltage 29.6 mV; ten-fold richer copper raises it the same.

Drag the two sliders and watch the meter answer in millivolts. That logarithmic slope is the **same term** as last story’s $RT\\ln Q$ — a battery is the Gibbs valley with an electrical readout: $\\Delta G = -nFE$.`
		},
		{
			id: 'discharge',
			prose: `Put the cell to work. As it discharges, zinc dissolves and copper deposits: $[\\mathrm{Zn^{2+}}]$ climbs, $[\\mathrm{Cu^{2+}}]$ falls, Q grows, and the voltage slides down the Nernst slope.

Press discharge and watch the curve: for the first 80 % of the journey the voltage barely moves (it takes a four-fold concentration swing to spend one 29.6 mV step) — then the final stretch **avalanches**, as the logarithm plunges when a concentration nears zero.

That is where the battery "plateau" comes from — and why fuel gauges are hard: **on the plateau, voltage carries almost no charge information.**`
		},
		{
			id: 'dead-battery',
			prose: `The voltage reaches zero: the battery is "dead". Dead where, exactly?

$$E = 0 \\iff \\ln Q = \\frac{nFE^\\circ}{RT} \\iff Q = K \\approx 10^{37}$$

A dead battery is the reaction arriving at the **floor** of its Gibbs valley. This particular valley is just astonishingly deep: K ≈ 10³⁷ puts the floor hard against the "copper ions exhausted" cliff.

Last story said no reaction truly runs to completion — still strictly true, but a floor at 10³⁷ is indistinguishable from "completion" by any instrument ever built. **Thermodynamics never lies; it just sometimes writes the margin very small.**`
		},
		{
			id: 'concentration-cell',
			prose: `One last magic trick: build a cell from **two identical half-cells** — both copper, one solution concentrated, one dilute.

Any voltage? **Yes.**

$$E = \\frac{RT}{nF}\\ln\\frac{c_{\\text{conc}}}{c_{\\text{dil}}}$$

A 10:1 ratio gives 29.6 mV — small, but real, and with **no chemical reaction at all**: just copper ions moving house from rich to poor.

**Pure mixing entropy, read out directly in volts.** The resting potential of your neurons and salinity-gradient power plants are cousins of this little cell. Entropy is not an abstraction — your every heartbeat pays it a toll.`
		},
		{
			id: 'sandbox',
			prose: `The bench is yours.

Two concentration sliders, one temperature knob — the voltmeter and the ladder answer live; the discharge button walks the whole curve.

**Challenges**: push the voltage past 1.20 V touching only concentrations; build a 59 mV concentration cell; then work out how much ladder your phone’s 3.8 V battery must span.`
		}
	],
	kickers: {
		hook: '00',
		'two-heights': '01',
		'the-ladder': '02',
		'nernst-slope': '03',
		discharge: '04',
		'dead-battery': '05',
		'concentration-cell': '06',
		sandbox: '07'
	},
	interactions: {
		hook: {
			question: 'Predict first: 1.10 V is set by',
			options: [
				{ id: 'size', label: 'The size of the cell' },
				{ id: 'pair', label: 'Which two metals are used' },
				{ id: 'wire', label: 'The thickness of the wires' }
			],
			explanation:
				'The two metals (and their ions) — each couple has its own rung height on the ladder, and the gap is the voltage. Size sets capacity, never voltage. That is exactly the account this story itemizes.'
		},
		nernstSlope: {
			zincLabel: '[Zn²⁺] / mol·L⁻¹',
			copperLabel: '[Cu²⁺] / mol·L⁻¹',
			readout: ({ emf, deltaG }) => `E = ${emf} V · ΔG = ${deltaG} kJ/mol`
		},
		discharge: {
			playButton: '⏵ Discharge',
			pauseButton: '⏸ Pause',
			resetButton: '↻ Fresh cell',
			readout: ({ depth, emf }) => `Discharged ${depth}% · E = ${emf} V`
		},
		concentrationCell: {
			ratioLabel: 'Concentration ratio c₂/c₁',
			readout: ({ ratio, emf }) => `Ratio ${ratio}:1 → E = ${emf} mV`
		},
		sandbox: {
			zincLabel: '[Zn²⁺] / mol·L⁻¹',
			copperLabel: '[Cu²⁺] / mol·L⁻¹',
			temperatureLabel: 'Temperature T',
			readout: ({ emf, deltaG }) => `E = ${emf} V · ΔG = −nFE = ${deltaG} kJ/mol`
		}
	},
	triView: {
		defaultAriaLabel: 'Triple-representation stage for the Daniell cell',
		liveSummary: ({ emf }) => `Current cell voltage ${emf} V.`,
		synchronizedState: 'One cell · three representations',
		cell: {
			ariaLabel: 'Cell view',
			viewName: 'Macro · Cell',
			caption:
				'Electrode thinning and plating are schematic; the voltmeter reading is computed from the Nernst equation.',
			zincLabel: 'Zn',
			copperLabel: 'Cu',
			bridgeLabel: 'Salt bridge',
			voltmeterLabel: ({ emf }) => `${emf} V`,
			zincConcLabel: ({ molar }) => `Zn²⁺ ${molar} M`,
			copperConcLabel: ({ molar }) => `Cu²⁺ ${molar} M`
		},
		ions: {
			ariaLabel: 'Ion view',
			viewName: 'Micro · Interfaces',
			caption:
				'Ion counts scale with concentration; the electron direction follows the sign of the potential gap.',
			zincIon: 'Zn²⁺',
			copperIon: 'Cu²⁺',
			electronTag: 'e⁻',
			dissolveTag: 'Dissolving',
			depositTag: 'Plating'
		},
		ladder: {
			ariaLabel: ({ emf }) => `Electrode-potential ladder, current cell voltage ${emf} volts`,
			viewName: 'Symbol · The ladder',
			caption:
				'Rung heights are CRC/IUPAC standard potentials; working positions slide by the Nernst equation.',
			yAxis: 'E vs SHE / V',
			zincRung: 'Zn²⁺/Zn',
			copperRung: 'Cu²⁺/Cu',
			gapLabel: ({ emf }) => `ΔE = ${emf} V`,
			sheLabel: 'H⁺/H₂ (0 V)'
		}
	},
	edge: {
		eyebrow: 'THE PRICE LIST',
		title: 'The ladder’s price list',
		facts: [
			{
				term: 'Standard potentials',
				definition:
					'Each half-reaction’s rung height against the standard hydrogen electrode; the gap between any two rungs is that pair’s standard voltage. CRC/IUPAC values.'
			},
			{
				term: 'The Nernst slope',
				definition:
					'59.2/n mV per decade of concentration ratio (298 K): 29.6 mV for n = 2. The log term is the Gibbs valley’s RT ln Q wearing volts.'
			},
			{
				term: 'ΔG = −nFE',
				definition:
					'Voltage is molar Gibbs energy with an electrical meter: 1.10 V × 2F = 213 kJ/mol of downhill.'
			},
			{
				term: 'Concentration cells',
				definition:
					'Voltage from pure mixing entropy, zero net chemistry: E = (RT/nF)·ln(c₂/c₁). The prototype of nerve resting potentials and salinity-gradient power.'
			}
		]
	},
	conceptCheck: {
		question:
			'Dilute the copper half-cell of a Daniell cell ten-fold ([Cu²⁺] from 1 M to 0.1 M). What happens to the voltage?',
		options: [
			{ label: 'Nothing — E° depends only on which metals are used' },
			{ label: 'It drops about 29.6 mV — Q grows, and the Nernst term spends one step' },
			{ label: 'It rises about 29.6 mV — a thinner solution has less resistance' },
			{ label: 'It halves — the concentration was cut to a tenth' }
		],
		correctIndex: 1,
		explanation:
			'E° indeed does not move, but the working voltage follows the Nernst term: diluting Cu²⁺ raises Q = [Zn²⁺]/[Cu²⁺] ten-fold, ln Q climbs one step, and E falls by (RT/2F)·ln 10 ≈ 29.6 mV. Resistance affects current and power, never the open-circuit voltage.'
	},
	sandboxIntro: {
		eyebrow: 'FREE PLAY · Leave the storyline with a question',
		title: 'The battery bench',
		description:
			'Concentrations, temperature, discharge — all yours; the voltmeter, the interfaces, and the ladder answer together.'
	},
	modelCard: {
		title: 'Model card · V0.1',
		items: [
			{
				term: 'System and data',
				value:
					'The Daniell cell Zn | Zn²⁺ ‖ Cu²⁺ | Cu, standard potentials from CRC/IUPAC (298.15 K): E°(Cu²⁺/Cu)=+0.3419 V, E°(Zn²⁺/Zn)=−0.7618 V, E°cell=1.1037 V. Unit tests pin the 29.58 mV/decade slope, ΔG°=−213 kJ/mol, and K≈10³⁷.'
			},
			{
				term: 'Teaching approximation',
				value:
					'Concentrations stand in for activities (γ=1). Real 1 M ZnSO₄/CuSO₄ have activity coefficients near 0.04–0.05, so measured open-circuit voltages deviate by tens of millivolts; Debye–Hückel/Pitzer corrections are backend work (docs/后端待办.md). Junction and salt-bridge asymmetry potentials are also unmodeled.'
			},
			{
				term: 'Discharge curve',
				value:
					'Equal-volume half-cells marched by mass balance ([Zn²⁺]+[Cu²⁺] conserved), E recomputed by Nernst each step down to the cutoff. No internal resistance, polarization, or mass-transport limits — those set how fast a cell can discharge; this page only answers how far.'
			},
			{
				term: 'What cannot be inferred from this page',
				value:
					'Electrode kinetics (overpotentials, exchange currents), real-cell capacity fade and self-discharge, and the voltage-curve shapes of intercalation batteries like Li-ion (governed by solid-phase activities, not solution concentrations) are all beyond this model. The ladder reports thermodynamic heights, never arrival speeds.'
			}
		]
	},
	ending: {
		summary:
			'1.10 V is the gap between two rungs, 29.6 mV is the logarithm’s slope, 10³⁷ is the depth of the floor. A battery creates no energy — it merely puts a meter on the downhill road.',
		invitation: 'Season 2 · the skeleton of thermodynamics is still going up.',
		backToHome: 'Back to the story catalog'
	}
} satisfies NernstStoryContent;

export default enNernstContent;
