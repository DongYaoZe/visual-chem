<script lang="ts">
	import { tailFraction } from '$lib/chem';
	import type { ArrheniusTriViewContent } from '$lib/content';
	import { logCompressedTailCount } from './arrhenius-visual';

	interface Props {
		temperatureK: number;
		eaKJPerMol: number;
		content: ArrheniusTriViewContent['collisions'];
	}

	let { temperatureK, eaKJPerMol, content }: Props = $props();

	const CHAMBER_X = 6;
	const CHAMBER_Y = 6;
	const CHAMBER_WIDTH = 208;
	const CHAMBER_HEIGHT = 178;
	const COUNT = 18;
	const BARRIER_X = CHAMBER_X + CHAMBER_WIDTH * 0.7;

	function hashed(index: number, salt: number): number {
		return (((index + salt) * 2654435761) >>> 0) / 4294967296;
	}

	// Positions and base speeds are index-hashed and therefore reproducible.
	// crossingRank is an indicator rank, not a simulated molecular energy.
	const slots = Array.from({ length: COUNT }, (_item, index) => ({
		index,
		crossingRank: index,
		baseSpeed: 0.5 + 0.5 * hashed(index, 11),
		y: CHAMBER_Y + 14 + hashed(index, 29) * (CHAMBER_HEIGHT - 28),
		xSeed: hashed(index, 47),
		delay: -((index * 0.23) % 2.8)
	}));

	let temperatureC = $derived(temperatureK - 273.15);
	let heat = $derived(Math.min(1, Math.max(0, (temperatureC + 10) / 90)));
	let crossingShare = $derived(tailFraction(eaKJPerMol, temperatureK));
	let highlightedCount = $derived(logCompressedTailCount(crossingShare, COUNT));
	let scientificShare = $derived(crossingShare.toExponential(2));
	let accessibleLabel = $derived(
		content.ariaLabel({
			temperatureC: temperatureC.toFixed(0),
			eaKJPerMol: eaKJPerMol.toFixed(0),
			tailShare: scientificShare,
			highlighted: highlightedCount,
			total: COUNT
		})
	);

	let molecules = $derived(
		slots.map((slot) => {
			const speed = slot.baseSpeed * (0.6 + heat);
			const crossing = slot.crossingRank < highlightedCount;
			const x = crossing
				? BARRIER_X + 8 + slot.xSeed * (CHAMBER_X + CHAMBER_WIDTH - BARRIER_X - 18)
				: CHAMBER_X + 10 + slot.xSeed * (BARRIER_X - CHAMBER_X - 24);
			return { ...slot, speed, crossing, x, trail: 6 + 16 * (speed - 0.3) };
		})
	);
</script>

<figure
	class="collision-chamber"
	data-testid="collision-chamber"
	data-crossing-count={highlightedCount}
	data-tail-share={crossingShare}
>
	<svg viewBox="0 0 220 190" role="img" aria-label={accessibleLabel}>
		<g aria-hidden="true">
			<rect
				class="chamber"
				x={CHAMBER_X}
				y={CHAMBER_Y}
				width={CHAMBER_WIDTH}
				height={CHAMBER_HEIGHT}
				rx="12"
			/>

			<line
				class="barrier"
				x1={BARRIER_X}
				x2={BARRIER_X}
				y1={CHAMBER_Y + 8}
				y2={CHAMBER_Y + CHAMBER_HEIGHT - 8}
			/>
			<text class="barrier-tag" x={BARRIER_X + 4} y={CHAMBER_Y + 18}
				>{content.barrierTag} · {eaKJPerMol.toFixed(0)}</text
			>

			{#each molecules as molecule (molecule.index)}
				<g style:animation-delay={molecule.delay + 's'} class="mover">
					<line
						class="trail"
						class:fast={molecule.crossing}
						x1={molecule.x - molecule.trail}
						y1={molecule.y + molecule.trail * 0.22}
						x2={molecule.x}
						y2={molecule.y}
					/>
					<circle
						class="dot"
						class:fast={molecule.crossing}
						cx={molecule.x}
						cy={molecule.y}
						r="3.4"
					/>
				</g>
			{/each}
		</g>
	</svg>

	<div class="legend" aria-hidden="true">
		<span><i class="dot-swatch slow"></i>{content.slowLabel}</span>
		<span><i class="dot-swatch fast"></i>{content.fastLabel}</span>
	</div>
	<p class="crossing-readout">
		{content.crossingReadout({
			tailShare: scientificShare,
			highlighted: highlightedCount,
			total: COUNT
		})}
	</p>

	<figcaption><span>{content.viewName}</span> {content.caption}</figcaption>
</figure>

<style>
	.collision-chamber {
		display: grid;
		height: 100%;
		min-height: 220px;
		margin: 0;
		grid-template-rows: 1fr auto auto auto;
	}

	svg {
		display: block;
		width: 100%;
		height: auto;
		max-height: 260px;
	}

	.chamber {
		fill: rgba(31, 40, 38, 0.03);
		stroke: rgba(31, 40, 38, 0.2);
	}

	.barrier {
		stroke: var(--ink-muted);
		stroke-dasharray: 4 5;
		stroke-width: 1.6;
	}

	.barrier-tag {
		fill: var(--ink-muted);
		font-family: var(--mono);
		font-size: 8.5px;
		font-weight: 800;
		letter-spacing: 0.04em;
	}

	.mover {
		animation: dart 2.8s ease-in-out infinite alternate;
	}

	.trail {
		stroke: rgba(31, 40, 38, 0.28);
		stroke-width: 1.6;
		stroke-linecap: round;
	}

	.trail.fast {
		stroke: rgba(191, 61, 48, 0.5);
		stroke-width: 2;
	}

	.dot {
		fill: var(--ink-muted);
	}

	.dot.fast {
		fill: var(--acid);
	}

	.legend {
		display: flex;
		gap: 1rem;
		justify-content: center;
		padding-top: 0.35rem;
		color: var(--ink-muted);
		font-size: 0.62rem;
	}

	.legend span {
		display: flex;
		gap: 0.3rem;
		align-items: center;
	}

	.dot-swatch {
		display: inline-block;
		width: 7px;
		height: 7px;
		border-radius: 50%;
	}

	.dot-swatch.slow {
		background: var(--ink-muted);
	}

	.dot-swatch.fast {
		background: var(--acid);
	}

	.crossing-readout {
		margin: 0.2rem 0 0;
		color: #7b3827;
		font-family: var(--mono);
		font-size: 0.54rem;
		line-height: 1.35;
		text-align: center;
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

	@keyframes dart {
		to {
			transform: translate(5px, -3px);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.mover {
			animation: none;
		}
	}
</style>
