<script lang="ts">
	import { peroxideParticleCounts } from '$lib/chem';
	import type { KineticsTriViewContent } from '$lib/content';

	interface Props {
		/** Fraction of reactant remaining, 0..1. */
		fraction: number;
		content: KineticsTriViewContent['molecules'];
	}

	let { fraction, content }: Props = $props();

	const CHAMBER_X = 6;
	const CHAMBER_Y = 6;
	const CHAMBER_WIDTH = 208;
	const CHAMBER_HEIGHT = 178;
	const TOTAL_REACTANTS = 20;

	function scatterPosition(index: number, margin: number) {
		const hash = ((index * 2654435761) >>> 0) / 4294967296;
		const hash2 = ((index * 1664525 + 1013904223) >>> 0) / 4294967296;
		return {
			x: CHAMBER_X + margin + hash * (CHAMBER_WIDTH - 2 * margin),
			y: CHAMBER_Y + margin + hash2 * (CHAMBER_HEIGHT - 2 * margin),
			delay: -((index * 0.19) % 3.4)
		};
	}

	const reactantSlots = Array.from({ length: TOTAL_REACTANTS }, (_item, index) => ({
		index,
		...scatterPosition(index + 5, 10)
	}));
	const waterSlots = Array.from({ length: TOTAL_REACTANTS }, (_item, index) => ({
		index,
		...scatterPosition(index + 57, 8)
	}));
	const oxygenSlots = Array.from({ length: TOTAL_REACTANTS / 2 }, (_item, index) => ({
		index,
		...scatterPosition(index + 113, 12)
	}));

	let counts = $derived(
		peroxideParticleCounts(Math.max(0, Math.min(1, fraction)), TOTAL_REACTANTS)
	);
	let ariaLabel = $derived(
		content.ariaLabel({
			reactantCount: counts.reactant,
			waterCount: counts.water,
			oxygenCount: counts.oxygen
		})
	);
</script>

<figure class="decay-chamber">
	<svg viewBox="0 0 220 190" role="img" aria-label={ariaLabel}>
		<g aria-hidden="true">
			<rect
				class="chamber"
				x={CHAMBER_X}
				y={CHAMBER_Y}
				width={CHAMBER_WIDTH}
				height={CHAMBER_HEIGHT}
				rx="12"
			/>

			<!-- Surviving H2O2: fused teal double-dots -->
			{#each reactantSlots.slice(0, counts.reactant) as slot (slot.index)}
				<circle
					class="molecule reactant"
					cx={slot.x - 3}
					cy={slot.y}
					r="3.8"
					style:animation-delay={`${slot.delay}s`}
				/>
				<circle
					class="molecule reactant"
					cx={slot.x + 3}
					cy={slot.y}
					r="3.8"
					style:animation-delay={`${slot.delay}s`}
				/>
			{/each}

			<!-- Products are counted separately to preserve 2 H2O : 1 O2. -->
			{#each waterSlots.slice(0, counts.water) as slot (slot.index)}
				<circle
					class="molecule water"
					cx={slot.x}
					cy={slot.y}
					r="3.2"
					style:animation-delay={`${slot.delay}s`}
				/>
			{/each}

			{#each oxygenSlots.slice(0, counts.oxygen) as slot (slot.index)}
				<circle
					class="molecule oxygen"
					cx={slot.x - 1.8}
					cy={slot.y}
					r="1.9"
					style:animation-delay={`${slot.delay}s`}
				/>
				<circle
					class="molecule oxygen"
					cx={slot.x + 1.8}
					cy={slot.y}
					r="1.9"
					style:animation-delay={`${slot.delay}s`}
				/>
			{/each}
		</g>
	</svg>

	<div class="legend" aria-hidden="true">
		<span><i class="dot reactant"></i>{content.reactantLabel}</span>
		<span><i class="dot water"></i>{content.waterLabel}</span>
		<span><i class="dot oxygen"></i>{content.oxygenLabel}</span>
	</div>

	<figcaption><span>{content.viewName}</span> {content.caption}</figcaption>
</figure>

<style>
	.decay-chamber {
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
		fill: rgba(32, 127, 140, 0.05);
		stroke: rgba(31, 40, 38, 0.2);
	}

	.molecule {
		stroke: rgba(255, 255, 255, 0.7);
		stroke-width: 0.8;
		animation: drift 3.4s ease-in-out infinite alternate;
	}

	@media (prefers-reduced-motion: reduce) {
		.molecule {
			animation: none;
		}
	}

	.molecule.reactant {
		fill: #207f8c;
	}

	.molecule.water {
		fill: #9fb6bb;
	}

	.molecule.oxygen {
		fill: #4a5f63;
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

	.legend .dot.reactant {
		margin-right: 5px;
		background: #207f8c;
		box-shadow: 5px 0 0 #207f8c;
	}

	.legend .dot.water {
		background: #9fb6bb;
	}

	.legend .dot.oxygen {
		width: 5px;
		height: 5px;
		margin-right: 4px;
		background: #4a5f63;
		box-shadow: 4px 0 0 #4a5f63;
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
