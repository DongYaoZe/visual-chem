import type { CO2InfraredStoryContent } from '../../types';

export const enCO2InfraredContent = {
	locale: 'en',
	seo: {
		title: 'Why some molecular vibrations are invisible to infrared — VisualChem',
		description:
			'CO₂ has three kinds of fundamental motion, but infrared does not record all of them. Link normal modes, dipole change and computed band positions.',
		path: '/en/stories/co2-infrared/',
		alternateLocalePath: '/stories/co2-infrared/',
		type: 'article',
		image: '/og-hydrogen-spectrum.png',
		imageAlt:
			'A VisualChem story cover with an infrared beam, carbon dioxide vibration and absorption spectrum',
		publishedTime: '2026-08-07',
		modifiedTime: '2026-08-07'
	},
	hero: {
		eyebrow: 'MOLECULAR VIBRATION · STORY 12',
		title: ['Why infrared misses', 'some vibrations'],
		subtitle:
			'The atoms in CO₂ keep moving. Its infrared spectrum records only the motions that satisfy one additional condition.',
		heroTag: 'ν₂ = 667 · ν₁ = 1333 · ν₃ = 2349 cm⁻¹'
	},
	readingNote:
		'All three panels share one normal mode. The beam shows whether the sample absorbs, the molecule enlarges the normal-coordinate motion, and the spectrum marks the same wavenumber.',
	stage: {
		dialogAriaLabel: 'Current carbon-dioxide infrared story graphic',
		closeGraphicAriaLabel: 'Close current graphic',
		openGraphicButton: 'View current graphic',
		shortStateAriaLabel: 'Current vibrational mode state'
	},
	scenes: [
		{
			id: 'hook',
			prose: `Send infrared light through a cell of CO₂ and compare the beam before and after the sample. The detector records strong absorption near 667 and 2349 cm⁻¹.

CO₂ also has a symmetric stretch near 1333 cm⁻¹. Why is its fundamental missing from the infrared spectrum?

Make a prediction, then compare molecular motion with the changing dipole.`
		},
		{
			id: 'three-motions',
			prose: `Linear CO₂ has four vibrational degrees of freedom. Bending can occur in two perpendicular planes at the same frequency, so the pair is treated as one doubly degenerate mode.

This page compares three kinds of fundamental motion:

- $\nu_1$ symmetric stretch, about 1333 cm⁻¹
- $\nu_2$ bend, about 667 cm⁻¹ and doubly degenerate
- $\nu_3$ asymmetric stretch, about 2349 cm⁻¹

Move the mode control. Atomic displacement, wavenumber and band position come from the same mode record.`
		},
		{
			id: 'silent-stretch',
			prose: `During the symmetric stretch, both C=O bonds lengthen together and then shorten together. The oxygen displacements remain symmetric, so the molecule keeps zero net dipole throughout the motion.

The vibration exists, yet the electric field of infrared light cannot excite this normal mode. The teaching spectrum therefore shows no fundamental absorption at 1333 cm⁻¹.

Other methods, including Raman spectroscopy, can observe this motion. Infrared-silent describes this selection rule only.`
		},
		{
			id: 'dipole-rule',
			prose: `Infrared absorption requires the molecular dipole to change along the normal coordinate:

$$\left(\frac{\partial \mu}{\partial Q}\right)_0 \neq 0$$

Bending takes the linear molecule away from a straight line. In the asymmetric stretch, one bond lengthens while the other shortens. Both motions produce a changing dipole and can couple to the infrared electric field.

Atomic motion alone is not enough. The dipole must change.`
		},
		{
			id: 'read-the-spectrum',
			prose: `Infrared spectra commonly run from high to low wavenumber. Wavenumber and wavelength are reciprocals:

$$\lambda(\mu\mathrm m)=\frac{10^4}{\tilde\nu(\mathrm{cm}^{-1})}$$

Thus 2349 cm⁻¹ is about 4.26 μm, while 667 cm⁻¹ is about 15.0 μm. Higher wavenumber also means more energy per photon.

This page marks only the fundamental teaching positions. It does not compute rotational structure, linewidth or measured absorbance.`
		},
		{
			id: 'fingerprint-region',
			prose: `Most molecular infrared spectra are more crowded than the CO₂ example. Stretches and bends can overlap, and the lower-wavenumber region contains bands that respond strongly to the molecular framework.

Chemists first inspect familiar functional-group ranges, then compare the complete pattern with candidate structures. One band rarely establishes a structure on its own.

CO₂ supplies the essential rule: a molecule may have a vibration that infrared does not record.`
		},
		{
			id: 'sandbox',
			prose: `Choose a normal mode and change the display amplitude. The page recomputes wavelength and photon energy, then sends the same mode to all three views.

**Try this:** find the infrared-silent mode, then compare the wavelengths of bending and asymmetric stretching. Explain why the larger wavenumber belongs to the shorter wavelength.`
		}
	],
	kickers: {
		hook: '00',
		'three-motions': '01',
		'silent-stretch': '02',
		'dipole-rule': '03',
		'read-the-spectrum': '04',
		'fingerprint-region': '05',
		sandbox: '06'
	},
	interactions: {
		hook: {
			question: 'Which fundamental is infrared-silent?',
			options: [
				{ id: 'symmetric-stretch', label: 'Symmetric stretch' },
				{ id: 'bend', label: 'Bend' },
				{ id: 'asymmetric-stretch', label: 'Asymmetric stretch' }
			],
			explanation:
				'The symmetric stretch. Both bonds change together while the net molecular dipole remains zero, so the fundamental does not satisfy the infrared selection rule.'
		},
		mode: {
			label: 'Normal mode',
			ariaLabel: 'Choose a carbon-dioxide vibrational mode',
			readout: ({ mode, wavenumberCm, wavelengthUm, irActive }) =>
				`${mode}: ${wavenumberCm} cm⁻¹, ${wavelengthUm} μm, ${irActive ? 'infrared-active' : 'infrared-silent'}`
		},
		amplitude: { label: 'Display amplitude', ariaLabel: 'Adjust the displayed vibration amplitude' }
	},
	triView: {
		defaultAriaLabel:
			'Three linked views of an infrared beam, carbon-dioxide normal mode and absorption spectrum',
		liveSummary: ({ mode, wavenumberCm, wavelengthUm, irActive }) =>
			`Current mode ${mode}, wavenumber ${wavenumberCm} reciprocal centimetres, wavelength ${wavelengthUm} micrometres, ${irActive ? 'infrared-active' : 'infrared-silent'}.`,
		synchronizedState: 'One normal mode · three representations',
		modeLabel: 'Mode',
		wavenumberLabel: 'Wavenumber',
		wavelengthLabel: 'Wavelength',
		activityLabel: 'IR activity',
		activityNames: { active: 'absorbs', silent: 'silent' },
		instrument: {
			ariaLabel: ({ mode, wavenumberCm, irActive }) =>
				`Infrared light crosses a carbon-dioxide cell. ${mode} at ${wavenumberCm} reciprocal centimetres ${irActive ? 'produces absorption' : 'has no fundamental infrared absorption'}.`,
			viewName: 'MACRO · IR BENCH',
			caption:
				'The detector compares incident and transmitted light. Beam brightness marks activity, not measured intensity.',
			beamLabel: 'infrared',
			sampleLabel: 'CO₂ cell',
			detectorLabel: 'detector'
		},
		molecule: {
			ariaLabel: ({ mode, amplitude }) =>
				`Schematic ${mode} of carbon dioxide at ${amplitude}% display amplitude. Displacements are enlarged and are not molecular-dynamics trajectories.`,
			viewName: 'MICRO · NORMAL MODE',
			caption:
				'Arrows show the normal-coordinate direction. Displacement is enlarged and is not a real molecular trajectory.',
			carbonLabel: 'C',
			oxygenLabel: 'O',
			bondLabel: 'C=O',
			modeNames: {
				hook: 'asymmetric stretch',
				'three-motions': 'bend',
				'silent-stretch': 'symmetric stretch',
				'dipole-rule': 'asymmetric stretch',
				'read-the-spectrum': 'asymmetric stretch',
				'fingerprint-region': 'bend',
				sandbox: 'bend',
				'symmetric-stretch': 'symmetric stretch',
				bend: 'bend',
				'asymmetric-stretch': 'asymmetric stretch'
			}
		},
		spectrum: {
			ariaLabel: ({ mode, wavenumberCm, irActive }) =>
				`Carbon-dioxide infrared spectrum with ${mode} selected at ${wavenumberCm} reciprocal centimetres, ${irActive ? 'shown as an absorption band' : 'shown as a silent fundamental position'}.`,
			viewName: 'SYMBOL · IR SPECTRUM',
			caption:
				'Band positions come from the mode data and wavenumber conversion. The vertical scale is not experimental absorbance.',
			xAxis: 'Wavenumber / cm⁻¹',
			yAxis: 'Absorption',
			selectedBand: 'selected mode',
			activeBand: 'IR-active',
			silentBand: 'fundamental silent'
		}
	},
	edge: {
		eyebrow: 'WHEN READING IR',
		title: 'Motion must change the dipole',
		facts: [
			{
				term: 'Mode count',
				definition:
					'A linear three-atom molecule has 3N−5 = 4 vibrational degrees of freedom; the two bend directions are degenerate.'
			},
			{
				term: 'Selection rule',
				definition:
					'A fundamental infrared absorption appears only when the dipole changes along the normal coordinate.'
			},
			{
				term: 'Position conversion',
				definition: 'With wavelength in micrometres, λ = 10⁴/ṽ; 2349 cm⁻¹ is about 4.26 μm.'
			},
			{
				term: 'Model boundary',
				definition:
					'This page covers three fundamental mode types, not rotational structure, intensity, linewidth, overtones or combination bands.'
			}
		]
	},
	conceptCheck: {
		question: 'Why is the CO₂ symmetric stretch silent in the fundamental infrared spectrum?',
		options: [
			{ label: 'Its frequency is too low' },
			{ label: 'Its net dipole does not change' },
			{ label: 'The oxygen atoms do not move' },
			{ label: 'CO₂ cannot absorb infrared' }
		],
		correctIndex: 1,
		explanation:
			'Both oxygen atoms move in the symmetric stretch, but their displacements preserve zero net dipole. Infrared absorption requires the dipole to change along the normal coordinate.'
	},
	sandboxIntro: {
		eyebrow: 'FREE PLAY · SWITCH NORMAL MODES',
		title: 'CO₂ infrared bench',
		description:
			'Choose a mode and display amplitude. Wavenumber, wavelength, infrared activity and all three panels share one computed frame.'
	},
	modelCard: {
		title: 'Model card · V0.1',
		items: [
			{
				term: 'Data anchors',
				value:
					'Rounded 12C16O2 gas-phase fundamentals from the NIST Chemistry WebBook: bend 667 cm⁻¹, symmetric stretch 1333 cm⁻¹ and asymmetric stretch 2349 cm⁻¹.'
			},
			{
				term: 'Infrared activity',
				value:
					'Activity follows whether the dipole changes along the normal coordinate. The symmetric stretch is silent; bending and asymmetric stretching are active.'
			},
			{
				term: 'Spectrum scope',
				value:
					'The plot marks fundamental teaching positions only. Real gas spectra include rovibrational structure and may contain overtones, combination bands and Fermi resonance.'
			},
			{
				term: 'Animation boundary',
				value:
					'The amplitude control scales a schematic displacement. It does not represent thermal amplitude, a single-molecule trajectory or actual oscillation count.'
			},
			{
				term: 'Source',
				value:
					'Frequencies and infrared activity checked against the NIST Chemistry WebBook Carbon dioxide (12C16O2) vibrational and/or electronic energy levels page, accessed 2026-08-07.'
			}
		]
	},
	ending: {
		summary:
			'Infrared records vibrations that couple to its electric field. Read the atomic motion, then test whether the dipole changes before assigning a band.',
		invitation: 'Next: rebuild a molecular structure from an NMR spectrum.',
		backToHome: 'Back to the story catalog'
	}
} satisfies CO2InfraredStoryContent;

export default enCO2InfraredContent;
