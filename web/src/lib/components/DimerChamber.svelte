<script lang="ts">
	import type { GibbsTriViewContent } from '$lib/content';

	interface Props {
		/** Extent of reaction 0..1: fraction of original N2O4 split into 2 NO2. */
		extent: number;
		content: GibbsTriViewContent['molecules'];
	}

	let { extent, content }: Props = $props();

	const CHAMBER_X = 6;
	const CHAMBER_Y = 6;
	const CHAMBER_WIDTH = 208;
	const CHAMBER_HEIGHT = 178;
	const TOTAL_DIMERS = 12;
	const DIMER_RADIUS = 4;
	const MONOMER_RADIUS = 3.5;

	// Deterministic pseudo-random positions: index-hashed scatter
	function scatterPosition(index: number, margin: number) {
		const hash = ((index * 2654435761) >>> 0) / 4294967296;
		const hash2 = ((index * 1664525 + 1013904223) >>> 0) / 4294967296;
		return {
			x: CHAMBER_X + margin + hash * (CHAMBER_WIDTH - 2 * margin),
			y: CHAMBER_Y + margin + hash2 * (CHAMBER_HEIGHT - 2 * margin),
			delay: -((index * 0.17) % 3.2)
		};
	}

	const dimerSlots = Array.from({ length: TOTAL_DIMERS }, (_item, index) => ({
		index,
		...scatterPosition(index + 3, DIMER_RADIUS * 2 + 3)
	}));
	const monomerSlots = Array.from({ length: TOTAL_DIMERS * 2 }, (_item, index) => ({
		index,
		...scatterPosition(index + 41, MONOMER_RADIUS + 3)
	}));

	// Honest bookkeeping: round(12·(1−extent)) dimers stay fused; every split
	// dimer contributes exactly two monomers.
	let dimerCount = $derived(
		Math.max(0, Math.min(TOTAL_DIMERS, Math.round(TOTAL_DIMERS * (1 - extent))))
	);
	let monomerCount = $derived((TOTAL_DIMERS - dimerCount) * 2);
</script>

<figure class="dimer-chamber">
	<svg viewBox="0 0 220 190" role="img" aria-label={content.ariaLabel}>
		<g aria-hidden="true">
			<rect
				class="chamber"
				x={CHAMBER_X}
				y={CHAMBER_Y}
				width={CHAMBER_WIDTH}
				height={CHAMBER_HEIGHT}
				rx="12"
			/>

			<!-- Intact N2O4 dimers: two fused circles drifting as one -->
			{#each dimerSlots.slice(0, dimerCount) as slot (slot.index)}
				<circle
					class="molecule dimer"
					cx={slot.x - 3.4}
					cy={slot.y}
					r={DIMER_RADIUS}
					style:animation-delay={`${slot.delay}s`}
				/>
				<circle
					class="molecule dimer"
					cx={slot.x + 3.4}
					cy={slot.y}
					r={DIMER_RADIUS}
					style:animation-delay={`${slot.delay}s`}
				/>
			{/each}

			<!-- Free NO2 monomers -->
			{#each monomerSlots.slice(0, monomerCount) as slot (slot.index)}
				<circle
					class="molecule monomer"
					cx={slot.x}
					cy={slot.y}
					r={MONOMER_RADIUS}
					style:animation-delay={`${slot.delay}s`}
				/>
			{/each}
		</g>
	</svg>

	<div class="legend" aria-hidden="true">
		<span><i class="dot dimer"></i>{content.dimerLabel}</span>
		<span><i class="dot monomer"></i>{content.monomerLabel}</span>
	</div>

	<figcaption><span>{content.viewName}</span> {content.caption}</figcaption>
</figure>

<style>
	.dimer-chamber {
		display: grid;
		height: 100%;
		min-height: 220px;
		margin: 0;
		grid-template-rows: 1fr auto auto;
	}

	svg {
		display: block;
		width: 100%;
		height: auto;
		max-height: 260px;
	}

	.chamber {
		fill: rgba(192, 122, 58, 0.06);
		stroke: rgba(31, 40, 38, 0.2);
	}

	.molecule {
		stroke: rgba(255, 255, 255, 0.7);
		stroke-width: 0.8;
		animation: drift 3.2s ease-in-out infinite alternate;
	}

	@media (prefers-reduced-motion: reduce) {
		.molecule {
			animation: none;
		}
	}

	.molecule.dimer {
		fill: #c07a3a;
	}

	.molecule.monomer {
		fill: #7c4a1e;
	}

	.legend {
		display: flex;
		gap: 1rem;
		justify-content: center;
		padding-top: 0.45rem;
		color: var(--ink-muted);
		font-size: 0.62rem;
	}

	.legend span {
		display: flex;
		gap: 0.3rem;
		align-items: center;
	}

	.legend i {
		display: inline-block;
		width: 7px;
		height: 7px;
		border-radius: 50%;
	}

	/* Fused-double swatch: the box-shadow paints the twin circle. */
	.legend .dot.dimer {
		margin-right: 5px;
		background: #c07a3a;
		box-shadow: 5px 0 0 #c07a3a;
	}

	.legend .dot.monomer {
		background: #7c4a1e;
	}

	figcaption {
		margin: 0.35rem 0 0;
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
			transform: translate(4px, -5px);
		}
	}
</style>
