import type { GibbsStoryContent } from '../../types';

export const enGibbsContent = {
	locale: 'en',
	seo: {
		title: 'The Downhill Road of a Reaction — VisualChem',
		description:
			'ΔG° is positive, yet the reaction runs anyway? One amber flask of N₂O₄ and a Gibbs-energy valley computed point by point in your browser: mixing entropy digs the floor, ΔG is the slope, equilibrium is the bottom, and Le Chatelier is the valley flexing.',
		path: '/en/stories/gibbs-valley/',
		alternateLocalePath: '/stories/gibbs-valley/',
		type: 'article',
		image: '/og-gibbs-valley.png',
		imageAlt: 'VisualChem story cover with an N₂O₄/NO₂ flask and a Gibbs-energy valley',
		publishedTime: '2026-07-18',
		modifiedTime: '2026-07-18'
	},
	hero: {
		eyebrow: 'THERMODYNAMICS · STORY 06',
		title: ['The downhill road', 'of a reaction'],
		subtitle:
			'ΔG° is plainly positive, yet the flask turns brown. A terrain map explains everything.',
		heroTag: 'G(ξ) · computed from standard data'
	},
	readingNote:
		'The stage on the right is driven by one extent of reaction: the macroscopic flask reports the NO₂ content through its color, the microscopic molecules show dimers splitting and re-pairing, and the symbolic panel draws the whole Gibbs-energy valley — the ball’s position is the flask’s state at this instant.',
	stage: {
		dialogAriaLabel: 'Graphic for the current scene',
		closeGraphicAriaLabel: 'Close the current graphic',
		openGraphicButton: 'View current graphic',
		shortStateAriaLabel: 'Current graphic state'
	},
	scenes: [
		{
			id: 'hook',
			prose: `A sealed flask of colorless N₂O₄ gas. Look up the tables:

$$\\mathrm{N_2O_4(g) \\to 2\\,NO_2(g)}\\qquad \\Delta_r G^\\circ = +4.7\\ \\mathrm{kJ/mol}$$

**Positive.** By the slogan "positive ΔG means non-spontaneous", nothing should happen in that flask.

Yet at room temperature the flask is visibly **brown** — the color of NO₂. About a fifth of the N₂O₄ has already split.

Is the slogan wrong? Place your bet.`
		},
		{
			id: 'two-forces',
			prose: `Two forces wrestle inside the flask.

**Energy** sides with N₂O₄: splitting one dimer costs 57.2 kJ/mol. Enthalpy shouts "don't".

**Counting** sides with splitting: one molecule becomes two, the particle count grows from 1 to 1+ξ — more particles, more ways to mix. The W we counted last story shouts "do".

ΔG° referees only the match between **pure reactants and pure products**. But a reaction never has to go all the way — it can stop **partway**. And about partway, ΔG° says not a word.`
		},
		{
			id: 'the-valley',
			prose: `So draw the partway. The axis is the extent $\\xi$: 0 is pure N₂O₄, 1 is fully split. For every ξ, compute the total Gibbs energy:

$$G(\\xi) = \\xi\\,\\Delta_r G^\\circ + RT\\big[(1-\\xi)\\ln x_A + 2\\xi \\ln x_B\\big]$$

The first term is the standard straight line — tilted **upward**, since ΔG° is positive. The second is **mixing entropy**: every ln x of a mixture is negative, and it presses the middle of the curve **down**.

A line plus a sag makes a **valley**. Its floor sits at ξ ≈ 0.19 — not at 0, not at 1. The flask’s brown is the color of that floor.`
		},
		{
			id: 'slope-is-deltaG',
			prose: `Now untangle the two easily-confused siblings.

**ΔrG (no °) is the valley’s slope at the current position**:

$$\\Delta_r G = \\left(\\frac{\\partial G}{\\partial \\xi}\\right)_{T,p} = \\Delta_r G^\\circ + RT\\ln Q$$

Slope negative — the ball rolls right (forward reaction). Positive — it rolls left (reverse). **Zero slope is the floor: equilibrium.**

ΔrG° is merely one **construction parameter** of the valley: it sets which side the floor leans toward, never whether a floor exists. Mixing entropy guarantees one whenever two gases coexist — **no reaction truly runs to completion.**`
		},
		{
			id: 'kp-position',
			prose: `The floor’s position has a name: the equilibrium constant.

$$\\Delta_r G^\\circ = -RT\\ln K \\qquad K_{298} = e^{-4700/RT} \\approx 0.15$$

K is no separate mystery — it is the floor’s coordinate in different units. ΔG° = 0 means K = 1, floor dead center; every 5.7 kJ/mol of ΔG° slides the floor one power of ten.

+4.7 kJ/mol converts to K ≈ 0.15: leaning toward N₂O₄, but nowhere near "doesn't happen". **"Positive ΔG°" only ever means: the floor is in the left half.**`
		},
		{
			id: 'squeeze',
			prose: `Squeeze the valley: **pressure**.

In a 1-goes-to-2 reaction the particle count grows with extent; raising the pressure flattens the mixing advantage of the many-particle side, the right wall bulges, and the floor **slides left** — NO₂ is pressed back into dimers, the brown fades.

Drag the pressure slider and watch the floor follow $\\xi_{eq} = \\sqrt{K/(K+4p)}$. Le Chatelier’s principle is not an independent law — it is the **geometry of a valley under load**.`
		},
		{
			id: 'heat',
			prose: `Now bake it: **temperature**.

Splitting the dimer is endothermic (ΔH° = +57.2 kJ/mol), and van ’t Hoff says K grows exponentially with temperature: the floor slides **right**.

In an ice bath the flask runs nearly colorless (0 °C: K ≈ 0.02); at 60 °C it browns deeply (K ≈ 1.3) — the classic classroom color demo is this same valley flexing continuously with temperature. Drag the slider and watch color and floor travel together.`
		},
		{
			id: 'positive-deltaG0',
			prose: `Back to the slogan — now we can fix it precisely:

- "ΔG° > 0 means non-spontaneous" — **wrong**. ΔG° only places the floor. Starting from pure reactants the slope ΔrG begins at $-\\infty$ (the mixing logarithm is bottomless at ξ = 0): **every reaction takes at least its first step**
- "ΔG < 0 means spontaneous" — **right, but the subject is the slope**: it speaks of one small step forward from here, never of going to completion
- The working test is **Q against K**: Q < K, you are left of the floor, forward; Q > K, right of it, reverse

One sentence: **ΔG° builds the valley, ΔrG reads the slope, the reaction rolls to the floor.**`
		},
		{
			id: 'sandbox',
			prose: `The valley is yours.

Two knobs — temperature and pressure — recompute the whole G(ξ) curve live; click anywhere on the valley to drop the ball and watch the slope shepherd it home; the flask and the molecules answer in step.

**Challenge**: find the temperature that centers the floor exactly at ξ = 0.5 — then squeeze it back below 0.3 with pressure alone.`
		}
	],
	kickers: {
		hook: '00',
		'two-forces': '01',
		'the-valley': '02',
		'slope-is-deltaG': '03',
		'kp-position': '04',
		squeeze: '05',
		heat: '06',
		'positive-deltaG0': '07',
		sandbox: '08'
	},
	interactions: {
		hook: {
			question: 'Predict first: with ΔG° positive, the flask will',
			options: [
				{ id: 'nothing', label: 'Do nothing at all' },
				{ id: 'partial', label: 'React partway, then stop' },
				{ id: 'complete', label: 'Reverse any trace of reaction' }
			],
			explanation:
				'Partway, then stop — at the floor of the Gibbs-energy valley. ΔG° decides where the floor leans, never whether a reaction happens. The rest of this story computes that valley.'
		},
		valley: {
			extentLabel: 'Extent ξ'
		},
		squeeze: {
			pressureLabel: 'Total pressure p',
			pressureScale: {
				start: '0.2 bar · expand',
				end: '5 bar · squeeze'
			}
		},
		heat: {
			temperatureLabel: 'Temperature T',
			temperatureScale: {
				start: '0 °C · ice bath',
				end: '80 °C · hot bath'
			}
		},
		sandbox: {
			temperatureLabel: 'Temperature T',
			pressureLabel: 'Total pressure p',
			ballButton: 'Drop the ball at this ξ',
			readout: ({ extent, kp, deltaG0 }) =>
				`Floor ξ_eq = ${extent} · K = ${kp} · ΔG° = ${deltaG0} kJ/mol`
		}
	},
	triView: {
		defaultAriaLabel: 'Triple-representation stage for the N₂O₄/NO₂ equilibrium',
		liveSummary: ({ extent, temperatureC }) =>
			`Current state: ${temperatureC} °C, extent ${extent}.`,
		synchronizedState: 'One extent · three representations',
		flask: {
			ariaLabel: 'Flask view',
			viewName: 'Macro · Flask',
			caption:
				'The brown depth is driven by the computed NO₂ mole fraction; the glassware is schematic.',
			temperatureLabel: ({ temperatureC }) => `${temperatureC} °C`,
			no2Label: ({ percent }) => `NO₂ share ${percent}%`,
			pressureLabel: ({ pressureBar }) => `p = ${pressureBar} bar`
		},
		molecules: {
			ariaLabel: 'Molecule view',
			viewName: 'Micro · Molecules',
			caption: 'Dimer and monomer counts scale with the computed extent; positions are schematic.',
			dimerLabel: 'N₂O₄',
			monomerLabel: 'NO₂'
		},
		valley: {
			ariaLabel: ({ extent }) => `Gibbs-energy valley, current extent ${extent}`,
			viewName: 'Symbol · The G(ξ) valley',
			caption:
				'The valley is computed point by point from standard data and ideal mixing; the floor is equilibrium.',
			xAxis: 'Extent of reaction ξ',
			yAxis: 'G − G(0) / kJ·mol⁻¹',
			floorMarker: 'Floor (equilibrium)',
			ballMarker: 'Current state',
			slopeReadout: ({ deltaG }) => `Slope ΔrG = ${deltaG} kJ/mol`
		}
	},
	edge: {
		eyebrow: 'THE SURVEYOR',
		title: 'The surveyor’s handbook',
		facts: [
			{
				term: 'The G(ξ) valley',
				definition:
					'A standard straight line plus the mixing-entropy sag: a floor is guaranteed whenever products and reactants coexist.'
			},
			{
				term: 'ΔrG is the slope',
				definition:
					'∂G/∂ξ: negative rolls forward, positive rolls back, zero is equilibrium. It varies along the road; ΔrG° is one constant at standard state.'
			},
			{
				term: 'K is the floor’s coordinate',
				definition:
					'ΔrG° = −RT ln K: 5.7 kJ/mol per decade. K never switches a reaction off — it only moves the floor.'
			},
			{
				term: 'Le Chatelier = flexing',
				definition:
					'Pressure and heat put the valley under load; which way the floor slides follows from the mole change and the reaction enthalpy — computable point by point.'
			}
		]
	},
	conceptCheck: {
		question:
			'A reaction has ΔrG° = +20 kJ/mol (K ≈ 3×10⁻⁴). Starting from pure reactants, the most accurate statement is:',
		options: [
			{ label: 'No reaction occurs at all — ΔG° is positive' },
			{ label: 'It runs forward a little, stopping at a floor far on the reactant side' },
			{ label: 'It goes to completion — given enough time' },
			{ label: 'Impossible to say without the activation energy' }
		],
		correctIndex: 1,
		explanation:
			'From ξ = 0 the mixing entropy makes the initial slope plunge toward −∞, so the reaction must start; but K ≈ 3×10⁻⁴ pins the floor far to the left, so it advances only slightly. Activation energy sets how fast, never where it stops — the stopping place belongs to the valley.'
	},
	sandboxIntro: {
		eyebrow: 'FREE PLAY · Leave the storyline with a question',
		title: 'The valley sculpting room',
		description:
			'Temperature, pressure, and the ball are all yours; the valley recomputes live and the flask recolors in step.'
	},
	modelCard: {
		title: 'Model card · V0.1',
		items: [
			{
				term: 'System and data',
				value:
					'N₂O₄(g) ⇌ 2 NO₂(g), standard formation data from CODATA/NIST-JANAF (298.15 K): ΔfG°(NO₂)=51.3, ΔfG°(N₂O₄)=97.9, ΔfH°(NO₂)=33.2, ΔfH°(N₂O₄)=9.16 kJ/mol, giving ΔrG°=+4.7 and ΔrH°=+57.2 kJ/mol. Unit tests pin K(298) ≈ 0.15 and the K = 1 temperature ≈ 325 K.'
			},
			{
				term: 'Valley computation',
				value:
					'Ideal-gas mixing: G(ξ) evaluated analytically point by point; the floor has the closed form ξ_eq = √(K/(K+4p)), cross-checked against the bracketed zero of ΔrG to 1e-9. Temperature extrapolation is van ’t Hoff with constant ΔH°; the error within 80 °C is far below line width.'
			},
			{
				term: 'Color mapping',
				value:
					'The flask browns linearly with the computed NO₂ mole fraction. Real NO₂ absorption (~400 nm) follows Beer’s law nonlinearly in path and concentration; the linear teaching map keeps the trend, not photometry.'
			},
			{
				term: 'What cannot be inferred from this page',
				value:
					'The ideal-gas approximation degrades above ~5 bar, and the real vapor also holds minor species like N₂O₃ — neither is modeled. Rates and activation energies are entirely absent: the valley answers "where it stops", never "how fast it gets there". Non-ideality corrections and kinetics simulations are backend work (docs/后端待办.md).'
			}
		]
	},
	ending: {
		summary:
			'ΔG° builds the valley, mixing entropy digs the floor, ΔrG reads the slope, Le Chatelier flexes the walls. A reaction has no finish line — only a floor.',
		invitation: 'Next stop: wire this downhill road to a bulb and make it glow.',
		backToHome: 'Back to the story catalog'
	}
} satisfies GibbsStoryContent;

export default enGibbsContent;
