<script lang="ts">
	import type { KineticsTriViewContent } from '$lib/content';

	interface Props {
		/** Current concentration as a fraction of c0, 0..1 — drives liquid tint only. */
		fraction: number;
		/** Instantaneous rate divided by the initial rate, 0..1 — drives O2 bubbling. */
		normalizedRate: number;
		timeS: number;
		/** Pause bubble animation when false. */
		running?: boolean;
		content: KineticsTriViewContent['beaker'];
	}

	let { fraction, normalizedRate, timeS, running = true, content }: Props = $props();

	const LANE_COUNT = 7;
	const LIQUID_TOP = 66;

	// Deterministic pseudo-random lanes: index-hashed x positions and sizes.
	function hash01(seed: number): number {
		return ((seed * 2654435761) >>> 0) / 4294967296;
	}

	const lanes = Array.from({ length: LANE_COUNT }, (_item, index) => ({
		index,
		x: 78 + hash01(index + 11) * 64,
		r: 1.8 + hash01(index + 29) * 1.4,
		baseDuration: 2.4 + hash01(index + 47) * 1.6,
		delay: -((index * 0.53) % 2.6)
	}));

	let clamped = $derived(Math.min(1, Math.max(0, fraction)));
	let clampedRate = $derived(Math.min(1, Math.max(0, normalizedRate)));
	// Pale peroxide liquor: the blue-green tint thins as the reactant is spent.
	let liquidFill = $derived(`rgba(32, 127, 140, ${(0.05 + 0.25 * clamped).toFixed(3)})`);
	// Bubble population and travel speed both encode v(t)/v(0). In particular,
	// a zero-order reaction stays steady until the reactant is exhausted.
	let bubbleCount = $derived(
		clampedRate <= 0.001 ? 0 : Math.max(1, Math.round(LANE_COUNT * clampedRate))
	);
	let bubbleOpacity = $derived(0.28 + 0.62 * clampedRate);
	let speedFactor = $derived(0.35 + 1.05 * clampedRate);
	let ariaLabel = $derived(
		content.ariaLabel({
			concentration: clamped.toFixed(2),
			normalizedRate: clampedRate.toFixed(2)
		})
	);
</script>

<figure
	class="reaction-beaker"
	data-testid="reaction-beaker"
	data-concentration-fraction={clamped.toFixed(4)}
	data-rate-fraction={clampedRate.toFixed(4)}
	data-bubble-count={bubbleCount}
	data-speed-factor={speedFactor.toFixed(4)}
>
	<svg viewBox="0 0 220 190" role="img" aria-label={ariaLabel}>
		<g aria-hidden="true">
			<path class="bench" d="M14 168h192" />

			<!-- Liquid column: fixed level, tint tracks concentration -->
			<path
				class="liquid"
				style:fill={liquidFill}
				d={`M70 ${LIQUID_TOP}h80v${145 - LIQUID_TOP}c0 6-4 9-10 9h-60c-6 0-10-3-10-9Z`}
			/>

			<!-- O2 bubbles rising along fixed lanes -->
			<g class="bubbles" style:opacity={bubbleOpacity}>
				{#each lanes.slice(0, bubbleCount) as lane (lane.index)}
					<circle
						class="bubble"
						cx={lane.x}
						cy="146"
						r={lane.r}
						style:animation-duration={`${(lane.baseDuration / speedFactor).toFixed(2)}s`}
						style:animation-delay={`${lane.delay}s`}
						style:animation-play-state={running ? 'running' : 'paused'}
					/>
				{/each}
			</g>

			<!-- Beaker: straight walls, rounded base, pour spout at the left lip -->
			<path class="vessel" d="M66 46v102c0 8 6 12 14 12h60c8 0 14-4 14-12V46" />
			<path class="lip" d="M66 46l-6-6m94 6l4-4" />

			<!-- Escaping-gas chip near the surface -->
			<text class="tag" x="146" y={LIQUID_TOP - 5} text-anchor="end">{content.bubbleTag}</text>

			<!-- Placard -->
			<g class="placard">
				<text class="label strong" x="212" y="16" text-anchor="end"
					>{content.concentrationLabel({ concentration: fraction.toFixed(2) })}</text
				>
				<text class="label" x="212" y="29" text-anchor="end"
					>{content.timeLabel({ timeS: timeS.toFixed(0) })}</text
				>
			</g>
		</g>
	</svg>
	<figcaption><span>{content.viewName}</span> {content.caption}</figcaption>
</figure>

<style>
	.reaction-beaker {
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
		fill: none;
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

	.bubbles {
		transition: opacity 500ms ease;
	}

	.bubble {
		fill: rgba(255, 255, 255, 0.85);
		stroke: rgba(31, 40, 38, 0.35);
		stroke-width: 0.8;
		animation: rise 2.6s linear infinite;
	}

	@media (prefers-reduced-motion: reduce) {
		.bubble {
			animation: none;
		}
	}

	.tag {
		fill: var(--ink-muted);
		font-family: var(--mono);
		font-size: 7.5px;
		font-weight: 700;
		paint-order: stroke;
		stroke: var(--paper);
		stroke-width: 2.5;
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

	@keyframes rise {
		to {
			transform: translateY(-76px);
		}
	}
</style>
