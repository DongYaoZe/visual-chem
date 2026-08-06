import type { HydrogenSpectrumStoryContent } from '../../types';

export const enHydrogenSpectrumContent = {
	locale: 'en',
	seo: {
		title: 'Why atoms sing only a few notes — VisualChem',
		description:
			'Split the light from a hydrogen discharge tube: not a rainbow, but a handful of bright lines. Trace the Balmer lines back to quantized energy levels, then compute the atomic fingerprint with the Rydberg equation.',
		path: '/en/stories/hydrogen-spectrum/',
		alternateLocalePath: '/stories/hydrogen-spectrum/',
		type: 'article',
		image: '/og-hydrogen-spectrum.png',
		imageAlt:
			'A VisualChem story cover combining a hydrogen discharge tube, quantized levels and Balmer lines',
		publishedTime: '2026-07-24',
		modifiedTime: '2026-07-24'
	},
	hero: {
		eyebrow: 'ATOMIC STRUCTURE · STORY 11',
		title: ['Why atoms sing', 'only a few notes'],
		subtitle:
			'White light spreads into a rainbow. Hydrogen lights only a few thin lines. Season four begins with the missing colours.',
		heroTag: 'λ = 656.5 · 486.3 · 434.2 · 410.3 nm (vacuum approximation)'
	},
	readingNote:
		'The stage locks all three panels to one transition. The discharge tube and grating show what an experiment separates; the energy ladder shows how much energy the electron loses; the spectrum ruler translates that same gap into wavelength. Change n, and the beam, arrow and line must move together.',
	stage: {
		dialogAriaLabel: 'Current hydrogen-spectrum story graphic',
		closeGraphicAriaLabel: 'Close current graphic',
		openGraphicButton: 'View current graphic',
		shortStateAriaLabel: 'Current transition state'
	},
	scenes: [
		{
			id: 'hook',
			prose: `Put a high voltage across low-pressure hydrogen and the glass tube glows pink-violet. Now send that light through a diffraction grating and onto a dark screen.

What appears: a complete violet-to-red rainbow, or **a few isolated bright lines**?

Do not memorize the answer yet. A continuous rainbow would mean that any energy can be emitted. A few lines would mean that the atom releases only **specific packets of energy**.`
		},
		{
			id: 'split-the-light',
			prose: `A grating works like a comb, separating wavelengths that arrive mixed together. An incandescent lamp fills the screen; hydrogen leaves most of it dark and lights only about 656, 486, 434 and 410 nm.

These are not four pigments. Each line is a population of photons with the same energy:

$$E_{\\mathrm{photon}} = h\\nu = \\frac{hc}{\\lambda}$$

The red line has the longest wavelength and the least energy per photon. Toward violet, each photon becomes more “expensive.”`
		},
		{
			id: 'measure-the-lines',
			prose: `Aim a spectrometer at each of the four lines. Move the upper-level control: the reading is not measured from a drawing—the browser recomputes it from the same Rydberg relation.

- $3\\to2$: Hα, red, about 656.5 nm
- $4\\to2$: Hβ, blue-green, about 486.3 nm
- $5\\to2$: Hγ, blue-violet, about 434.2 nm
- $6\\to2$: Hδ, violet, about 410.3 nm

They share the destination $n=2$, so they form the **Balmer series**. Higher starting levels crowd the lines toward the ultraviolet.`
		},
		{
			id: 'energy-steps',
			prose: `Why are all the colours between the lines absent? An electron's energy is not a ramp on which it may stand anywhere. It is a staircase:

$$E_n = -\\frac{hcR_{\\mathrm H}}{n^2}$$

The electron may occupy $n=5$ or $n=2$, but no level between them. When it drops, the whole step difference goes to one photon:

$$\\Delta E = E_{n_u}-E_{n_l}=\\frac{hc}{\\lambda}$$

The atom does not pick colours from a rainbow. **Allowed energy gaps are discrete first; wavelengths are locked in afterward.**`
		},
		{
			id: 'rydberg-key',
			prose: `In 1885, before quantum mechanics existed, Balmer guessed a numerical key from the visible lines. For hydrogen it can be written:

$$\\frac{1}{\\lambda}=R_{\\mathrm H}\\left(\\frac{1}{n_l^2}-\\frac{1}{n_u^2}\\right),\\qquad n_u>n_l$$

Insert $n_u=3, n_l=2$ and the vacuum wavelength is about 656.5 nm. The energy-level gap, photon energy and line position all return the same answer.

A red line is no longer merely observed. It becomes **a ruler for the spacing inside an atom**.`
		},
		{
			id: 'three-families',
			prose: `Change the shared destination and the whole family moves:

- Drops to $n=1$: the Lyman series, mainly **ultraviolet**, invisible to the eye
- Drops to $n=2$: the Balmer series, with four strong lines in **visible light**
- Drops to $n=3$: the Paschen series, in the **infrared**, also invisible to the eye

For invisible radiation the dashed ray shows only where an instrument would detect it; it is not painted as a visible colour. **Invisible does not mean absent.** Detectors record the families beyond the eye.`
		},
		{
			id: 'fingerprint',
			prose: `If the steps come from an atom's internal structure, changing element changes their spacing and therefore the line pattern. That pattern is an **atomic fingerprint**.

Helium was identified in sunlight from a yellow line absent from laboratories at the time. Dark lines left when starlight crosses cool gas use the same energy gaps to identify elements.

Now turn up the resolution. The single teaching Hα line on our stage splits into several fine-structure components around 656.271–656.285 nm in the NIST air-wavelength table. **A successful simple model is still not the final model**: it captures the gross structure, then hands its residuals to finer theory.

Keep the boundary clear: this page's simple equation belongs to one-electron hydrogen. Interacting electrons in helium, sodium or iron require fuller quantum models; the hydrogen Rydberg equation cannot simply be pasted onto them.`
		},
		{
			id: 'sandbox',
			prose: `Treat the atom as an instrument made of energy.

Choose the destination $n_l$, then a higher starting level $n_u$. The stage translates the gap into photon energy, vacuum wavelength and spectral region; all three panels share one computed frame.

**Challenge:** find a visible red line, an ultraviolet line and an infrared line. Then explain why lines in one series crowd together as $n_u$ rises.`
		}
	],
	kickers: {
		hook: '00',
		'split-the-light': '01',
		'measure-the-lines': '02',
		'energy-steps': '03',
		'rydberg-key': '04',
		'three-families': '05',
		fingerprint: '06',
		sandbox: '07'
	},
	interactions: {
		hook: {
			question: 'Predict what appears after the grating',
			options: [
				{ id: 'rainbow', label: 'A complete rainbow' },
				{ id: 'lines', label: 'A few bright lines' },
				{ id: 'dark', label: 'Total darkness' }
			],
			explanation:
				'A few bright lines. Hydrogen emits only photons that match allowed energy gaps; the darkness between them is evidence of quantization.'
		},
		measure: {
			upperLevelLabel: 'Upper level nᵤ',
			readout: ({ upperN, wavelengthNm, photonEnergyEv }) =>
				`n=${upperN}→2: λ=${wavelengthNm} nm, photon energy ${photonEnergyEv} eV`
		},
		series: {
			lowerLevelLabel: 'Common lower level nₗ',
			readout: ({ series, wavelengthNm, region }) =>
				`${series} first line: λ=${wavelengthNm} nm, in the ${region}`
		},
		sandbox: {
			upperLevelLabel: 'Start nᵤ',
			lowerLevelLabel: 'Destination nₗ',
			readout: ({ transition, wavelengthNm, photonEnergyEv, region }) =>
				`${transition}: λ=${wavelengthNm} nm, ΔE=${photonEnergyEv} eV, ${region}`
		}
	},
	triView: {
		defaultAriaLabel:
			'Three linked views of a hydrogen discharge tube, electron levels and line spectrum',
		liveSummary: ({ upperN, lowerN, wavelengthNm, region }) =>
			`Hydrogen transition from n=${upperN} to n=${lowerN}; computed vacuum wavelength ${wavelengthNm} nanometres, in the ${region}.`,
		synchronizedState: 'One transition · three representations',
		transitionLabel: 'Transition',
		wavelengthLabel: 'Vacuum wavelength',
		photonEnergyLabel: 'Photon energy',
		regionNames: { ultraviolet: 'ultraviolet', visible: 'visible', infrared: 'infrared' },
		tube: {
			ariaLabel: ({ wavelengthNm, region }) =>
				`Hydrogen discharge tube and grating; selected vacuum wavelength ${wavelengthNm} nanometres in the ${region}. Ultraviolet and infrared use dashed guides rather than visible colours.`,
			viewName: 'MACRO · TUBE',
			caption:
				'The grating separates wavelengths. Dashed guides mark invisible radiation; brightness is not an intensity prediction.',
			tubeLabel: 'Low-pressure H₂ tube',
			gratingLabel: 'Grating',
			lightLabel: 'Separated radiation'
		},
		levels: {
			ariaLabel: ({ upperN, lowerN, energyEv, wavelengthNm, region, isVisible }) =>
				`Hydrogen energy levels. The electron drops from n=${upperN} to n=${lowerN}, a gap of ${energyEv} electronvolts, emitting a ${wavelengthNm} nanometre photon in the ${region}, ${isVisible ? 'visible to the eye' : 'invisible to the eye'}.`,
			viewName: 'MICRO · LEVELS',
			caption:
				'Horizontal lines are allowed energies, not spatial orbits around a nucleus; the arrow is an energy gap.',
			energyAxis: 'Energy E / eV',
			electronLabel: 'electron',
			photonLabel: ({ wavelengthNm }) => `photon ${wavelengthNm} nm`
		},
		spectrum: {
			ariaLabel: ({ upperN, lowerN, wavelengthNm, region, isVisible }) =>
				`Hydrogen line spectrum. Selected transition n=${upperN} to n=${lowerN}, vacuum wavelength ${wavelengthNm} nanometres in the ${region}, shown as ${isVisible ? 'a line on the visible reference band' : 'a grey line in an invisible region'}.`,
			viewName: 'SYMBOL · SPECTRUM',
			caption:
				'Line positions are computed by the Rydberg equation. The visible gradient is a coordinate guide, not continuous emission.',
			xAxis: 'Vacuum wavelength λ / nm',
			selectedLine: 'selected',
			seriesNames: { Lyman: 'Lyman', Balmer: 'Balmer', Paschen: 'Paschen', other: 'Other series' }
		}
	},
	edge: {
		eyebrow: 'THE ATOMIC SCORE',
		title: "The atom's score",
		facts: [
			{
				term: 'A line is an energy gap',
				definition:
					'ΔE = hc/λ: one line on the screen corresponds to one fixed difference between two internal steps.'
			},
			{
				term: 'The destination defines a series',
				definition:
					'Drops to n=1, 2 and 3 form the Lyman, Balmer and Paschen series; most lie outside human vision.'
			},
			{
				term: 'Lines converge',
				definition:
					'Levels crowd together as n grows, so wavelengths in one series approach a short-wavelength limit.'
			},
			{
				term: 'Each element has a fingerprint',
				definition:
					'Nuclear charge and electron interactions reshape the levels; patterns identify elements, but many-electron atoms need fuller models.'
			}
		]
	},
	conceptCheck: {
		question: 'For two drops ending at n=2, which emits the shorter-wavelength photon?',
		options: [
			{ label: '3→2, because its start is closer to n=2' },
			{ label: '4→2, because its energy gap is larger' },
			{ label: 'They are equal because the destination is equal' },
			{ label: 'Impossible to tell without intensity' }
		],
		correctIndex: 1,
		explanation:
			'The 4→2 gap is larger, so the photon has more energy. From E=hc/λ, greater energy means shorter wavelength: about 486.3 nm versus about 656.5 nm for 3→2. Intensity counts photons; it does not set one photon’s wavelength.'
	},
	sandboxIntro: {
		eyebrow: 'FREE PLAY · USE THE LEVELS AS KEYS',
		title: 'Hydrogen spectrum bench',
		description:
			'Choose a downward transition; the gap, vacuum wavelength, region and all three representations recompute together.'
	},
	modelCard: {
		title: 'Model card · V0.1',
		items: [
			{
				term: 'Computation',
				value:
					'We use the 2022 CODATA R∞ = 10,973,731.568157 m⁻¹ and proton/electron mass ratio 1836.152673426, apply the reduced-mass correction to obtain R_H, and derive both E_n = −hcR_H/n² and wavelengths from that same R_H. Readouts are approximate vacuum wavelengths.'
			},
			{
				term: 'Why NIST air lines differ slightly',
				value:
					'The simple model gives an Hα vacuum centre trend near 656.47 nm. The NIST Hydrogen Strong Lines table lists 656.27–656.29 nm in air and resolves several fine-structure components. Air refractive index, fine structure and the Lamb shift are outside this lightweight model; those numbers must not be mixed as one convention.'
			},
			{
				term: 'Apparatus and intensity',
				value:
					'The tube represents low-pressure hydrogen excited by collisions and then cascading downward. Rays show which wavelengths exist; linewidths, relative intensities, selection rules, collision kinetics and instrument response are not modelled. Motion is not a real-time trajectory of one atom.'
			},
			{
				term: 'Scope',
				value:
					'The Rydberg/Bohr one-electron model teaches the gross structure of hydrogen and hydrogen-like ions. The fingerprint idea still applies to many-electron elements, but this equation does not compute their levels. Teaching colours are redundant cues; UV and IR are not painted as visible colours.'
			},
			{
				term: 'Sources',
				value:
					'Constants: NIST 2022 CODATA Rydberg constant and proton-electron mass ratio. A few air components are used only as reference anchors from the NIST Atomic Spectra Database v5.12 Hydrogen Strong Lines query (DOI 10.18434/T4W30F); the table is not mirrored. Accessed 2026-07-23.'
			}
		]
	},
	ending: {
		summary:
			'One spectral line is an energy receipt; a set of lines is an atomic fingerprint. Colour is the surface. The step difference is the melody.',
		invitation: 'Next: why CO₂ absorbs infrared—the molecule that sings.',
		backToHome: 'Back to the story catalog'
	}
} satisfies HydrogenSpectrumStoryContent;

export default enHydrogenSpectrumContent;
