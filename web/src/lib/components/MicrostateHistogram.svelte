<script lang="ts">
	import { leftCountProbability } from '$lib/chem';
	import type { EntropyTriViewContent } from '$lib/content';

	interface Props {
		/** Total particle count N. */
		total: number;
		/** Current left-bulb count, marked on the distribution. */
		leftCount: number;
		/** Highlight the lonely all-left bar. */
		markAllLeft?: boolean;
		/** Shade a ±window band around the even split; null hides it. */
		window?: number | null;
		content: EntropyTriViewContent['histogram'];
	}

	let { total, leftCount, markAllLeft = false, window = null, content }: Props = $props();

	const width = 560;
	const height = 318;
	const margin = { top: 24, right: 24, bottom: 46, left: 58 };

	// The distribution is symmetric; a fixed 4-decade log floor keeps the
	// lonely all-left bar visible next to a peak 29 orders taller.
	let bars = $derived.by(() => {
		const probabilities: number[] = [];
		for (let n = 0; n <= total; n += 1) probabilities.push(leftCountProbability(total, n));
		return probabilities;
	});
	let peak = $derived(Math.max(...bars));

	function x(n: number): number {
		return margin.left + ((n + 0.5) / (total + 1)) * (width - margin.left - margin.right);
	}
	let barWidth = $derived(
		Math.max(1.2, ((width - margin.left - margin.right) / (total + 1)) * 0.82)
	);
	function y(probability: number): number {
		// Linear in probability: the spike IS the story; the log view would
		// flatter the tails and blunt the point.
		const t = probability / peak;
		return height - margin.bottom - t * (height - margin.top - margin.bottom);
	}

	let currentX = $derived(x(Math.round(leftCount)));
	let halfX = $derived(x(Math.round(total / 2)));
	let windowLeft = $derived(window === null ? null : x(Math.max(0, total / 2 - window)));
	let windowRight = $derived(window === null ? null : x(Math.min(total, total / 2 + window)));

	const xTickCount = 4;
	let xTicks = $derived(
		Array.from({ length: xTickCount + 1 }, (_item, index) =>
			Math.round((total * index) / xTickCount)
		)
	);

	let ariaLabel = $derived(content.ariaLabel({ total }));
</script>

<figure class="diagram">
	<svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={ariaLabel}>
		{#if windowLeft !== null && windowRight !== null}
			<rect
				class="window-band"
				x={windowLeft - barWidth / 2}
				y={margin.top}
				width={windowRight - windowLeft + barWidth}
				height={height - margin.top - margin.bottom}
			/>
		{/if}

		{#each bars as probability, n (n)}
			<rect
				class="bar"
				class:current={n === Math.round(leftCount)}
				x={x(n) - barWidth / 2}
				y={y(probability)}
				width={barWidth}
				height={Math.max(0, height - margin.bottom - y(probability))}
			/>
		{/each}

		{#if markAllLeft}
			<line
				class="all-left-line"
				x1={x(total)}
				x2={x(total)}
				y1={margin.top + 12}
				y2={height - margin.bottom}
			/>
			<text class="all-left-label" x={x(total) - 6} y={margin.top + 24} text-anchor="end"
				>{content.allLeftMarker} · 1</text
			>
		{/if}

		<line
			class="current-line"
			x1={currentX}
			x2={currentX}
			y1={margin.top}
			y2={height - margin.bottom}
		/>
		<text
			class="current-label"
			x={currentX + (leftCount > total * 0.7 ? -8 : 8)}
			y={margin.top + 12}
			text-anchor={leftCount > total * 0.7 ? 'end' : 'start'}
			>{content.currentMarker} · {Math.round(leftCount)}</text
		>

		{#each xTicks as tick (tick)}
			<line
				class="x-tick"
				x1={x(tick)}
				x2={x(tick)}
				y1={height - margin.bottom}
				y2={height - margin.bottom + 5}
			/>
			<text class="tick" x={x(tick)} y={height - margin.bottom + 19} text-anchor="middle"
				>{tick}</text
			>
		{/each}

		<line
			class="axis"
			x1={margin.left}
			x2={margin.left}
			y1={margin.top}
			y2={height - margin.bottom}
		/>
		<line
			class="axis"
			x1={margin.left}
			x2={width - margin.right}
			y1={height - margin.bottom}
			y2={height - margin.bottom}
		/>

		<text
			class="axis-label"
			x={(margin.left + width - margin.right) / 2}
			y={height - 7}
			text-anchor="middle">{content.xAxis}</text
		>
		<text
			class="axis-label y-label"
			transform={`translate(15 ${(margin.top + height - margin.bottom) / 2}) rotate(-90)`}
			text-anchor="middle">{content.yAxis}</text
		>
		<circle class="half-dot" cx={halfX} cy={height - margin.bottom + 4} r="2.4" />
	</svg>
	<figcaption>{content.caption}</figcaption>
</figure>

<style>
	.diagram {
		min-width: 0;
		margin: 0;
	}

	svg {
		display: block;
		width: 100%;
		height: auto;
		max-height: 298px;
		overflow: visible;
	}

	.axis,
	.x-tick {
		stroke: var(--ink);
		stroke-width: 1.4;
	}

	.tick,
	.axis-label {
		fill: var(--ink-muted);
		font-family: var(--mono);
		font-size: 10px;
	}

	.axis-label {
		fill: var(--ink);
		font-size: 11px;
		font-weight: 700;
	}

	.bar {
		fill: rgba(32, 127, 140, 0.55);
		transition:
			y 240ms ease,
			height 240ms ease;
	}

	.bar.current {
		fill: var(--ethanol);
	}

	.window-band {
		fill: rgba(163, 112, 42, 0.12);
	}

	.current-line {
		stroke: var(--ethanol);
		stroke-dasharray: 3 4;
		stroke-width: 1.5;
	}

	.current-label {
		fill: var(--ethanol);
		font-family: var(--mono);
		font-size: 10px;
		font-weight: 800;
	}

	.all-left-line {
		stroke: var(--acid);
		stroke-dasharray: 2 4;
		stroke-width: 1.4;
	}

	.all-left-label {
		fill: var(--acid);
		font-family: var(--mono);
		font-size: 10px;
		font-weight: 800;
	}

	.half-dot {
		fill: var(--ink-muted);
	}

	figcaption {
		margin: 0.35rem 0 0;
		color: var(--ink-muted);
		font-size: 0.64rem;
		line-height: 1.4;
	}

	@media (max-width: 540px) {
		.tick {
			font-size: 18px;
		}

		.axis-label {
			font-size: 17px;
		}

		.current-label,
		.all-left-label {
			font-size: 14px;
		}
	}
</style>
