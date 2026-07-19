<script lang="ts">
	import type { GibbsTriViewContent } from '$lib/content';

	interface Props {
		/** NO2 mole fraction 0..1 — drives the brown tint. */
		no2Fraction: number;
		temperatureC: number;
		pressureBar: number;
		content: GibbsTriViewContent['flask'];
	}

	let { no2Fraction, temperatureC, pressureBar, content }: Props = $props();

	// Brown tint: pale straw when the dimer dominates, deep amber-brown when
	// NO2 does. The sqrt bias makes faint browning visible early, matching how
	// strongly NO2 absorbs in the blue.
	let clamped = $derived(Math.min(1, Math.max(0, no2Fraction)));
	let tint = $derived(Math.sqrt(clamped));
	let gasFill = $derived(
		`rgba(${Math.round(200 - 80 * tint)}, ${Math.round(160 - 100 * tint)}, ${Math.round(
			80 - 60 * tint
		)}, ${(0.06 + 0.76 * tint).toFixed(3)})`
	);
	let swirlOpacity = $derived(0.08 + 0.3 * clamped);
</script>

<figure class="no2-flask">
	<svg viewBox="0 0 220 190" role="img" aria-label={content.ariaLabel}>
		<g aria-hidden="true">
			<path class="bench" d="M14 168h192" />

			<!-- Gas tint fills the whole sealed volume: bulb + neck -->
			<circle class="gas" cx="110" cy="118" r="46" style:fill={gasFill} />
			<rect class="gas" x="101" y="42" width="18" height="38" style:fill={gasFill} />

			<!-- Schematic gas swirls, more visible as NO2 grows -->
			<g class="swirls" style:opacity={swirlOpacity}>
				<path class="swirl" d="M84 108c10-8 24-8 34 0" />
				<path class="swirl" style:animation-delay="-0.9s" d="M90 126c9 7 22 7 31-1" />
				<path class="swirl" style:animation-delay="-1.7s" d="M96 142c8-6 18-6 26 0" />
			</g>

			<!-- Round-bottom flask: sphere + neck + stopper -->
			<path class="vessel" d="M101 42v37.5a46 46 0 1 0 18 0V42" />
			<rect class="stopper" x="98" y="30" width="24" height="12" rx="3" />

			<!-- Placard -->
			<g class="placard">
				<text class="label strong" x="212" y="16" text-anchor="end"
					>{content.temperatureLabel({ temperatureC: Math.round(temperatureC) })}</text
				>
				<text class="label" x="212" y="29" text-anchor="end"
					>{content.no2Label({ percent: (no2Fraction * 100).toFixed(0) })}</text
				>
				<text class="label" x="212" y="41" text-anchor="end"
					>{content.pressureLabel({ pressureBar: pressureBar.toFixed(1) })}</text
				>
			</g>
		</g>
	</svg>
	<figcaption><span>{content.viewName}</span> {content.caption}</figcaption>
</figure>

<style>
	.no2-flask {
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

	.gas {
		transition: fill 500ms ease;
	}

	.vessel {
		fill: none;
		stroke: #52625f;
		stroke-linecap: round;
		stroke-width: 2.5;
	}

	.stopper {
		fill: rgba(200, 190, 175, 0.6);
		stroke: #52625f;
		stroke-width: 2;
	}

	.swirls {
		transition: opacity 500ms ease;
	}

	.swirl {
		fill: none;
		stroke: var(--ink);
		stroke-linecap: round;
		stroke-width: 2;
		animation: drift 2.6s ease-in-out infinite alternate;
	}

	@media (prefers-reduced-motion: reduce) {
		.swirl {
			animation: none;
		}
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
		to {
			transform: translate(3px, -4px);
		}
	}
</style>
