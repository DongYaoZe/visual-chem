<script lang="ts">
	import type { NernstTriViewContent } from '$lib/content';

	interface Props {
		zincMolar: number;
		copperMolar: number;
		/** True while discharging: animates electron dots along the wire. */
		active?: boolean;
		content: NernstTriViewContent['ions'];
	}

	let { zincMolar, copperMolar, active = false, content }: Props = $props();

	const MAX_IONS = 10;
	const MIN_IONS = 3;

	// Map 0.01..2 M onto 3..10 ions on a log scale so dilute solutions still
	// show a visible population.
	function ionCount(molar: number): number {
		const clamped = Math.min(2, Math.max(0.01, molar));
		const t = (Math.log10(clamped) + 2) / (Math.log10(2) + 2);
		return Math.round(MIN_IONS + t * (MAX_IONS - MIN_IONS));
	}

	// Deterministic pseudo-random scatter within each half-chamber.
	function scatterPosition(index: number, originX: number, spanX: number) {
		const hash = ((index * 2654435761) >>> 0) / 4294967296;
		const hash2 = ((index * 1664525 + 1013904223) >>> 0) / 4294967296;
		return {
			x: originX + hash * spanX,
			y: 52 + hash2 * 110,
			delay: -((index * 0.19) % 2.8)
		};
	}

	const zincSlots = Array.from({ length: MAX_IONS }, (_item, index) => ({
		index,
		...scatterPosition(index + 7, 30, 66)
	}));
	const copperSlots = Array.from({ length: MAX_IONS }, (_item, index) => ({
		index,
		...scatterPosition(index + 57, 122, 66)
	}));

	let zincCount = $derived(ionCount(zincMolar));
	let copperCount = $derived(ionCount(copperMolar));

	const electronDelays = [0, -0.9, -1.8];
</script>

<figure class="ion-interfaces">
	<svg viewBox="0 0 220 190" role="img" aria-label={content.ariaLabel}>
		<g aria-hidden="true">
			<rect class="chamber" x="6" y="6" width="208" height="178" rx="12" />
			<line class="divider" x1="110" y1="36" x2="110" y2="180" />

			<!-- Wire across the top with travelling electrons -->
			<path class="wire" d="M18 24H202" />
			{#each electronDelays as delay (delay)}
				<circle
					class="electron"
					class:running={active}
					cx="0"
					cy="24"
					r="2.6"
					style:animation-delay={`${delay}s`}
				/>
			{/each}

			<!-- Zinc interface: slate electrode edge on far left, ions leaving -->
			<rect class="zinc-edge" x="8" y="36" width="12" height="146" rx="3" />
			<text class="tag" x="26" y="46">{content.dissolveTag}</text>
			{#each zincSlots.slice(0, zincCount) as slot (slot.index)}
				<circle
					class="ion zn"
					cx={slot.x}
					cy={slot.y}
					r="4.5"
					style:animation-delay={`${slot.delay}s`}
				/>
			{/each}

			<!-- Copper interface mirrored: ions approaching the electrode -->
			<rect class="copper-edge" x="200" y="36" width="12" height="146" rx="3" />
			<text class="tag" x="194" y="46" text-anchor="end">{content.depositTag}</text>
			{#each copperSlots.slice(0, copperCount) as slot (slot.index)}
				<circle
					class="ion cu"
					cx={slot.x}
					cy={slot.y}
					r="4.5"
					style:animation-delay={`${slot.delay}s`}
				/>
			{/each}
		</g>
	</svg>

	<div class="legend" aria-hidden="true">
		<span><i class="dot zn"></i>{content.zincIon}</span>
		<span><i class="dot cu"></i>{content.copperIon}</span>
		<span><i class="dot electron"></i>{content.electronTag}</span>
	</div>

	<figcaption><span>{content.viewName}</span> {content.caption}</figcaption>
</figure>

<style>
	.ion-interfaces {
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
		fill: rgba(37, 99, 168, 0.05);
		stroke: rgba(31, 40, 38, 0.2);
	}

	.divider {
		stroke: rgba(31, 40, 38, 0.14);
		stroke-dasharray: 3 4;
		stroke-width: 1.5;
	}

	.wire {
		fill: none;
		stroke: rgba(31, 40, 38, 0.55);
		stroke-linecap: round;
		stroke-width: 2;
	}

	.electron {
		fill: var(--acid);
		stroke: rgba(255, 255, 255, 0.7);
		stroke-width: 0.6;
		animation: travel 2.7s linear infinite;
		animation-play-state: paused;
	}

	.electron.running {
		animation-play-state: running;
	}

	.zinc-edge {
		fill: #6b7280;
		stroke: #4b5563;
		stroke-width: 1;
	}

	.copper-edge {
		fill: #b06c2f;
		stroke: #8a5424;
		stroke-width: 1;
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

	.ion {
		stroke: rgba(255, 255, 255, 0.72);
		stroke-width: 0.8;
		animation: sway 2.8s ease-in-out infinite alternate;
	}

	.ion.zn {
		fill: #5f6398;
	}

	.ion.cu {
		fill: #2563a8;
	}

	@media (prefers-reduced-motion: reduce) {
		.ion,
		.electron {
			animation: none;
		}
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

	.legend .dot.zn {
		background: #5f6398;
	}

	.legend .dot.cu {
		background: #2563a8;
	}

	.legend .dot.electron {
		background: var(--acid);
	}

	@keyframes travel {
		from {
			transform: translateX(18px);
		}
		to {
			transform: translateX(202px);
		}
	}

	@keyframes sway {
		to {
			transform: translate(3px, -4px);
		}
	}
</style>
