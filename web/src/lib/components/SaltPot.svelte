<script lang="ts">
	import type { SaltFrame } from '$lib/chem';
	import type { SaltTriViewContent } from '$lib/content';

	interface Props {
		frame: SaltFrame;
		content: SaltTriViewContent['pot'];
	}

	let { frame, content }: Props = $props();

	let liquid = $derived(frame.equilibrium.liquid);
	let solids = $derived(frame.equilibrium.solids);
	let liquidMass = $derived(liquid.waterG + liquid.kno3G + liquid.nano3G);
	// Fill level reads total liquid mass against a 300 g full pot; the floor
	// keeps a thin visible layer whenever any liquid remains.
	let fillFraction = $derived(
		liquidMass > 0.05 ? Math.min(1, Math.max(0.12, liquidMass / 300)) : 0
	);
	let liquidTop = $derived(154 - 104 * fillFraction);
	// Brine tint deepens with dissolved-salt mass fraction; ~0.55 is near the
	// hottest saturated liquor this story reaches.
	let brine = $derived(
		liquidMass > 0.05 ? Math.min(1, (liquid.kno3G + liquid.nano3G) / liquidMass / 0.55) : 0
	);
	let liquidFill = $derived(
		`rgba(${Math.round(32 - 12 * brine)}, ${Math.round(127 - 34 * brine)}, ${Math.round(
			140 - 26 * brine
		)}, ${(0.35 + 0.3 * brine).toFixed(3)})`
	);
	let mercuryTop = $derived(146 - (Math.min(100, Math.max(0, frame.temperatureC)) / 100) * 84);
	let showKno3 = $derived(solids.kno3G > 0.05);
	let showNano3 = $derived(solids.nano3G > 0.05);
	let kno3Scale = $derived(Math.min(1.2, 0.5 + Math.sqrt(solids.kno3G) / 9));
	let nano3Scale = $derived(Math.min(1.2, 0.5 + Math.sqrt(solids.nano3G) / 9));
	let steaming = $derived(frame.temperatureC >= 70);
</script>

<figure class="salt-pot">
	<svg viewBox="0 0 220 190" role="img" aria-label={content.ariaLabel}>
		<g aria-hidden="true">
			<path class="bench" d="M14 168h192" />

			<g class="thermo">
				<line class="tube" x1="38" y1="58" x2="38" y2="146" />
				<line class="mercury" x1="38" y1={mercuryTop} x2="38" y2="146" />
				<circle class="bulb" cx="38" cy="152" r="6" />
			</g>

			<path class="vessel" d="M66 46v102c0 8 6 12 14 12h60c8 0 14-4 14-12V46" />
			{#if fillFraction > 0}
				<path
					class="liquid"
					style:fill={liquidFill}
					d={`M70 ${liquidTop}h80v${145 - liquidTop}c0 6-4 9-10 9h-60c-6 0-10-3-10-9Z`}
				/>
			{/if}
			<path class="lip" d="M62 44l4 2m92-2l-4 2" />

			{#if steaming}
				{#each [0, 1, 2] as plume (plume)}
					<path
						class="steam"
						style:opacity={0.55 - plume * 0.15}
						style:animation-delay={`${plume * -0.7}s`}
						d={`M${88 + plume * 22} 42c-5-8 5-13 0-22`}
					/>
				{/each}
			{/if}

			{#if showKno3}
				<g transform={`translate(92 152) scale(${kno3Scale})`}>
					<path class="kno3-crystal" d="M-16 0l4-18 4 18z" />
					<path class="kno3-crystal" d="M-6 0l3-24 4 24z" />
					<path class="kno3-crystal" d="M5 0l4-15 4 15z" />
					<path class="kno3-crystal" d="M-11 0l8-12 3 12z" />
				</g>
			{/if}
			{#if showNano3}
				<g transform={`translate(128 152) scale(${nano3Scale})`}>
					<path class="nano3-crystal" d="M-14 0l4-8h11l-4 8z" />
					<path class="nano3-crystal" d="M0 0l4-9h11l-4 9z" />
					<path class="nano3-crystal" d="M-8 -8l4-7h10l-4 7z" />
				</g>
			{/if}

			<g class="placard">
				<text class="label strong" x="212" y="16" text-anchor="end"
					>{content.temperatureLabel({ temperatureC: Math.round(frame.temperatureC) })}</text
				>
				<text class="label" x="212" y="29" text-anchor="end"
					>{content.dissolvedLabel({
						kno3G: liquid.kno3G.toFixed(1),
						nano3G: liquid.nano3G.toFixed(1)
					})}</text
				>
				<text class="label" x="212" y="41" text-anchor="end"
					>{content.waterLabel({ grams: liquid.waterG.toFixed(1) })}</text
				>
			</g>

			{#if showKno3}
				<text class="pile-label" x="12" y="181"
					>{content.kno3CrystalsLabel({ grams: solids.kno3G.toFixed(1) })}</text
				>
			{/if}
			{#if showNano3}
				<text class="pile-label" x="208" y="181" text-anchor="end"
					>{content.nano3CrystalsLabel({ grams: solids.nano3G.toFixed(1) })}</text
				>
			{/if}
		</g>
	</svg>
	<figcaption><span>{content.viewName}</span> {content.caption}</figcaption>
</figure>

<style>
	.salt-pot {
		height: 100%;
		min-height: 220px;
		margin: 0;
	}

	svg {
		display: block;
		width: 100%;
		height: auto;
		max-height: 260px;
	}

	.bench {
		stroke: rgba(31, 40, 38, 0.22);
		stroke-width: 2;
	}

	.vessel {
		fill: rgba(255, 255, 255, 0.35);
		stroke: #52625f;
		stroke-width: 2.5;
	}

	.lip {
		fill: none;
		stroke: #52625f;
		stroke-linecap: round;
		stroke-width: 2.5;
	}

	.liquid {
		transition: fill 500ms ease;
	}

	.tube {
		stroke: rgba(31, 40, 38, 0.18);
		stroke-linecap: round;
		stroke-width: 5;
	}

	.mercury {
		stroke: var(--acid);
		stroke-linecap: round;
		stroke-width: 3;
	}

	.bulb {
		fill: var(--acid);
	}

	.steam {
		fill: none;
		stroke: rgba(31, 40, 38, 0.4);
		stroke-linecap: round;
		stroke-width: 2.5;
		animation: drift 2.6s ease-in-out infinite;
	}

	.kno3-crystal {
		fill: rgba(97, 100, 153, 0.78);
		stroke: #4c4f7c;
		stroke-linejoin: round;
	}

	.nano3-crystal {
		fill: rgba(219, 158, 63, 0.82);
		stroke: #a3702a;
		stroke-linejoin: round;
	}

	.label {
		fill: var(--ink-muted);
		font-family: var(--mono);
		font-size: 8px;
		font-weight: 700;
		paint-order: stroke;
		stroke: var(--paper);
		stroke-width: 3;
	}

	.label.strong {
		fill: var(--ink);
		font-size: 9.5px;
	}

	.pile-label {
		fill: var(--ink-muted);
		font-family: var(--mono);
		font-size: 7.5px;
		font-weight: 700;
	}

	figcaption {
		margin: 0.1rem 0 0;
		color: var(--ink-muted);
		font-size: 0.64rem;
		line-height: 1.4;
	}

	figcaption span {
		margin-right: 0.35rem;
		color: var(--ink);
		font-family: var(--mono);
		font-weight: 800;
		letter-spacing: 0.12em;
	}

	@keyframes drift {
		0%,
		100% {
			transform: translateX(0);
		}
		50% {
			transform: translateX(5px) translateY(-4px);
		}
	}
</style>
