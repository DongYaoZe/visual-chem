<script lang="ts">
	import type { EntropyTriViewContent } from '$lib/content';

	interface Props {
		/** Total particle count N (10..400 typical; draw at most 60 dots, scaled honestly). */
		total: number;
		/** Particles currently in the left bulb. */
		leftCount: number;
		/** Valve open state; closed draws a bar across the neck. */
		valveOpen: boolean;
		content: EntropyTriViewContent['bulbs'];
	}

	let { total, leftCount, valveOpen, content }: Props = $props();

	const MAX_DOTS = 60;
	const LEFT_CX = 58;
	const RIGHT_CX = 162;
	const BULB_CY = 96;
	const GOLDEN_ANGLE = 2.399963229728653;

	// Deterministic golden-angle spiral: dots fill each bulb from the center
	// outward, so any prefix of the slot list stays evenly spread.
	function bulbSlots(cx: number) {
		return Array.from({ length: MAX_DOTS }, (_item, index) => {
			const radius = 36 * Math.sqrt((index + 0.5) / MAX_DOTS);
			const angle = index * GOLDEN_ANGLE;
			return {
				index,
				x: cx + radius * Math.cos(angle),
				y: BULB_CY + radius * Math.sin(angle),
				delay: -((index * 0.13) % 2.6)
			};
		});
	}

	const leftSlots = bulbSlots(LEFT_CX);
	const rightSlots = bulbSlots(RIGHT_CX);

	// Honest scaling: with N ≤ 60 each dot is one particle; above that the
	// 60 dots split in the same proportion as the true counts.
	let drawTotal = $derived(Math.max(0, Math.min(MAX_DOTS, Math.round(total))));
	let leftDots = $derived(
		total > 0 ? Math.min(drawTotal, Math.max(0, Math.round((drawTotal * leftCount) / total))) : 0
	);
	let rightDots = $derived(Math.max(0, drawTotal - leftDots));
	let rightCount = $derived(Math.max(0, total - leftCount));
</script>

<figure class="twin-bulbs">
	<svg viewBox="0 0 220 190" role="img" aria-label={content.ariaLabel}>
		<g aria-hidden="true">
			<path class="bench" d="M14 168h192" />

			<!-- Neck tube joining the bulbs -->
			<path class="neck" d="M100 89h20M100 103h20" />

			<!-- Valve stem + wheel above the neck -->
			<line class="valve-stem" x1="110" y1="88" x2="110" y2="74" />
			<circle class="valve-wheel" cx="110" cy="71" r="5" />
			<line class="valve-handle" x1="102" y1="71" x2="118" y2="71" />
			{#if !valveOpen}
				<line class="valve-bar" x1="110" y1="86" x2="110" y2="106" />
			{/if}

			<!-- Glass bulbs -->
			<circle class="bulb" cx={LEFT_CX} cy={BULB_CY} r="44" />
			<circle class="bulb" cx={RIGHT_CX} cy={BULB_CY} r="44" />

			{#each leftSlots.slice(0, leftDots) as slot (slot.index)}
				<circle
					class="dot"
					cx={slot.x}
					cy={slot.y}
					r="3.6"
					style:animation-delay={`${slot.delay}s`}
				/>
			{/each}
			{#each rightSlots.slice(0, rightDots) as slot (slot.index)}
				<circle
					class="dot"
					cx={slot.x}
					cy={slot.y}
					r="3.6"
					style:animation-delay={`${slot.delay}s`}
				/>
			{/each}

			<!-- Chips -->
			<text class="label strong" x="110" y="58" text-anchor="middle"
				>{valveOpen ? content.valveOpen : content.valveClosed}</text
			>
			<text class="label" x={LEFT_CX} y="156" text-anchor="middle"
				>{`${content.leftLabel} · ${leftCount}`}</text
			>
			<text class="label" x={RIGHT_CX} y="156" text-anchor="middle"
				>{`${content.rightLabel} · ${rightCount}`}</text
			>
		</g>
	</svg>
	<figcaption><span>{content.viewName}</span> {content.caption}</figcaption>
</figure>

<style>
	.twin-bulbs {
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

	.bulb {
		fill: rgba(255, 255, 255, 0.35);
		stroke: #52625f;
		stroke-width: 2.5;
	}

	.neck {
		fill: none;
		stroke: #52625f;
		stroke-linecap: round;
		stroke-width: 2.5;
	}

	.valve-stem {
		stroke: rgba(31, 40, 38, 0.4);
		stroke-linecap: round;
		stroke-width: 2.5;
	}

	.valve-wheel {
		fill: rgba(255, 255, 255, 0.6);
		stroke: #52625f;
		stroke-width: 2;
	}

	.valve-handle {
		stroke: #52625f;
		stroke-linecap: round;
		stroke-width: 2;
	}

	.valve-bar {
		stroke: var(--acid);
		stroke-linecap: round;
		stroke-width: 4;
	}

	.dot {
		fill: rgba(32, 127, 140, 0.85);
		stroke: rgba(255, 255, 255, 0.7);
		stroke-width: 0.8;
		animation: drift 2.6s ease-in-out infinite alternate;
	}

	@media (prefers-reduced-motion: reduce) {
		.dot {
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
