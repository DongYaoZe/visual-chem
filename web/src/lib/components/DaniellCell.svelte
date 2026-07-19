<script lang="ts">
	import type { NernstTriViewContent } from '$lib/content';

	interface Props {
		emfV: number;
		zincMolar: number;
		copperMolar: number;
		/** Depth of discharge 0..1; thins the Zn electrode and thickens Cu plating. */
		depth?: number;
		content: NernstTriViewContent['cell'];
	}

	let { emfV, zincMolar, copperMolar, depth = 0, content }: Props = $props();

	function clamp(value: number, low: number, high: number): number {
		return Math.min(high, Math.max(low, value));
	}

	// Zn solution: barely-there gray-blue that deepens slightly with molarity.
	let zincAlpha = $derived(clamp(0.04 + 0.06 * Math.sqrt(clamp(zincMolar, 0, 2)), 0.04, 0.14));
	let zincSolutionFill = $derived(`rgba(96, 112, 128, ${zincAlpha.toFixed(3)})`);
	// Cu solution: cupric blue whose opacity tracks [Cu2+].
	let copperAlpha = $derived(clamp(0.06 + 0.3 * Math.sqrt(clamp(copperMolar, 0, 2)), 0.06, 0.5));
	let copperSolutionFill = $derived(`rgba(37, 99, 168, ${copperAlpha.toFixed(3)})`);

	// Discharge geometry: Zn slab loses up to 40% width, Cu grows a bright skin.
	let depthClamped = $derived(clamp(depth, 0, 1));
	let zincWidth = $derived(16 * (1 - 0.4 * depthClamped));
	let copperSkin = $derived(16 * 0.4 * depthClamped);
	let zincX = $derived(52 - zincWidth / 2);
	let copperX = $derived(168 - 16 / 2);
</script>

<figure class="daniell-cell">
	<svg viewBox="0 0 220 190" role="img" aria-label={content.ariaLabel}>
		<g aria-hidden="true">
			<path class="bench" d="M14 168h192" />

			<!-- Wires from electrodes up to the voltmeter -->
			<path class="wire" d="M52 66V30h40" />
			<path class="wire" d="M168 66V30h-40" />

			<!-- Voltmeter -->
			<circle class="meter" cx="110" cy="30" r="18" />
			<text class="meter-reading" x="110" y="33" text-anchor="middle"
				>{content.voltmeterLabel({ emf: emfV.toFixed(3) })}</text
			>

			<!-- Left beaker: Zn | Zn2+ -->
			<path class="beaker" d="M22 78v70c0 6 4 10 10 10h40c6 0 10-4 10-10V78" />
			<rect
				class="solution"
				style:fill={zincSolutionFill}
				x="25"
				y="92"
				width="54"
				height="62"
				rx="6"
			/>
			<rect class="zinc-slab" x={zincX} y="66" width={zincWidth} height="76" rx="2" />
			<text class="electrode-label" x="52" y="60" text-anchor="middle">{content.zincLabel}</text>

			<!-- Right beaker: Cu | Cu2+ -->
			<path class="beaker" d="M138 78v70c0 6 4 10 10 10h40c6 0 10-4 10-10V78" />
			<rect
				class="solution"
				style:fill={copperSolutionFill}
				x="141"
				y="92"
				width="54"
				height="62"
				rx="6"
			/>
			<rect class="copper-slab" x={copperX} y="66" width="16" height="76" rx="2" />
			{#if copperSkin > 0.2}
				<rect
					class="copper-skin"
					x={copperX - copperSkin / 2}
					y="70"
					width={16 + copperSkin}
					height="72"
					rx="2"
				/>
			{/if}
			<text class="electrode-label" x="168" y="60" text-anchor="middle">{content.copperLabel}</text>

			<!-- Inverted-U salt bridge -->
			<path class="bridge" d="M88 96V78c0-6 4-10 10-10h24c6 0 10 4 10 10v18" />
			<text class="bridge-label" x="110" y="62" text-anchor="middle">{content.bridgeLabel}</text>

			<!-- Concentration chips -->
			<text class="chip" x="52" y="174" text-anchor="middle"
				>{content.zincConcLabel({ molar: zincMolar.toFixed(2) })}</text
			>
			<text class="chip" x="168" y="174" text-anchor="middle"
				>{content.copperConcLabel({ molar: copperMolar.toFixed(2) })}</text
			>
		</g>
	</svg>
	<figcaption><span>{content.viewName}</span> {content.caption}</figcaption>
</figure>

<style>
	.daniell-cell {
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

	.wire {
		fill: none;
		stroke: rgba(31, 40, 38, 0.55);
		stroke-linecap: round;
		stroke-width: 2;
	}

	.meter {
		fill: rgba(255, 255, 255, 0.85);
		stroke: #52625f;
		stroke-width: 2.5;
	}

	.meter-reading {
		fill: var(--ink);
		font-family: var(--mono);
		font-size: 8px;
		font-weight: 800;
	}

	.beaker {
		fill: rgba(255, 255, 255, 0.35);
		stroke: #52625f;
		stroke-width: 2.5;
	}

	.solution {
		transition: fill 500ms ease;
	}

	.zinc-slab {
		fill: #6b7280;
		stroke: #4b5563;
		stroke-width: 1;
		transition:
			x 400ms ease,
			width 400ms ease;
	}

	.copper-slab {
		fill: #b06c2f;
		stroke: #8a5424;
		stroke-width: 1;
	}

	.copper-skin {
		fill: rgba(214, 128, 62, 0.85);
		stroke: #b06c2f;
		stroke-width: 0.8;
		transition:
			x 400ms ease,
			width 400ms ease;
	}

	.bridge {
		fill: none;
		stroke: rgba(163, 112, 42, 0.7);
		stroke-linecap: round;
		stroke-width: 7;
	}

	.electrode-label,
	.bridge-label {
		fill: var(--ink);
		font-family: var(--mono);
		font-size: 8px;
		font-weight: 700;
		paint-order: stroke;
		stroke: var(--paper);
		stroke-width: 3;
	}

	.bridge-label {
		fill: var(--ink-muted);
		font-size: 7px;
	}

	.chip {
		fill: var(--ink-muted);
		font-family: var(--mono);
		font-size: 7.5px;
		font-weight: 700;
		paint-order: stroke;
		stroke: var(--paper);
		stroke-width: 3;
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
</style>
