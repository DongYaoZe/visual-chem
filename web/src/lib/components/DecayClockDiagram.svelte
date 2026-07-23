<script lang="ts">
	import { concentrationAt, decayCurve, type ReactionOrder } from '$lib/chem';
	import type { KineticsTriViewContent } from '$lib/content';

	interface Props {
		order: ReactionOrder;
		c0: number;
		k: number;
		totalTimeS: number;
		currentTimeS?: number;
		showHalfLives?: boolean;
		/** Localized name supplied by the story, for example “一级” / “first order”. */
		orderLabel?: string;
		content: KineticsTriViewContent['clock'];
	}

	let {
		order,
		c0,
		k,
		totalTimeS,
		currentTimeS = 0,
		showHalfLives = true,
		orderLabel,
		content
	}: Props = $props();

	const width = 560;
	const height = 318;
	const margin = { top: 26, right: 24, bottom: 48, left: 58 };

	let curve = $derived(decayCurve(order, c0, k, totalTimeS, 160));
	let clampedTime = $derived(Math.max(0, Math.min(totalTimeS, currentTimeS)));
	let currentFraction = $derived(concentrationAt(order, c0, k, clampedTime) / c0);
	let localizedOrder = $derived(orderLabel ?? `m = ${order}`);
	let ariaLabel = $derived(content.ariaLabel({ order: localizedOrder }));

	function x(timeS: number): number {
		return margin.left + (timeS / totalTimeS) * (width - margin.left - margin.right);
	}

	function y(fraction: number): number {
		return (
			margin.top + (1 - Math.max(0, Math.min(1, fraction))) * (height - margin.top - margin.bottom)
		);
	}

	let curvePath = $derived(
		curve.times
			.map((timeS, index) => {
				const fraction = curve.concentrations[index] / curve.c0;
				return `${index === 0 ? 'M' : 'L'}${x(timeS).toFixed(2)},${y(fraction).toFixed(2)}`;
			})
			.join(' ')
	);

	const yTicks = [0, 0.25, 0.5, 0.75, 1];
	let xTicks = $derived(Array.from({ length: 5 }, (_item, index) => (totalTimeS * index) / 4));

	function formatTime(value: number): string {
		if (value >= 100) return value.toFixed(0);
		if (value >= 10) return value.toFixed(1).replace(/\.0$/, '');
		return value.toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
	}
</script>

<figure class="diagram">
	<svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={ariaLabel}>
		{#each yTicks as tick (tick)}
			<line class="grid" x1={margin.left} x2={width - margin.right} y1={y(tick)} y2={y(tick)} />
			<text class="tick" x={margin.left - 9} y={y(tick) + 4} text-anchor="end">
				{tick.toFixed(2).replace(/0+$/, '').replace(/\.$/, '')}
			</text>
		{/each}

		{#each xTicks as tick, index (`${index}-${tick}`)}
			<line
				class="x-tick"
				x1={x(tick)}
				x2={x(tick)}
				y1={height - margin.bottom}
				y2={height - margin.bottom + 5}
			/>
			<text class="tick" x={x(tick)} y={height - margin.bottom + 19} text-anchor="middle">
				{formatTime(tick)}
			</text>
		{/each}

		{#if showHalfLives}
			{#each curve.halfLifeMarks as mark, index (`${index}-${mark}`)}
				<line
					class="half-life-line"
					x1={x(mark)}
					x2={x(mark)}
					y1={margin.top}
					y2={height - margin.bottom}
				/>
				<text
					class="half-life-label"
					x={x(mark)}
					y={margin.top + 12 + (index % 2) * 12}
					text-anchor="middle"
					>{content.halfLifeMarker}<tspan class="half-index">{index + 1}</tspan></text
				>
			{/each}
		{/if}

		<path class="decay-curve" d={curvePath} />

		<line
			class="current-guide"
			x1={x(clampedTime)}
			x2={x(clampedTime)}
			y1={y(currentFraction)}
			y2={height - margin.bottom}
		/>
		<circle class="state-halo" cx={x(clampedTime)} cy={y(currentFraction)} r="12" />
		<circle class="state" cx={x(clampedTime)} cy={y(currentFraction)} r="5.5" />
		<text
			class="current-label"
			x={x(clampedTime) + (clampedTime > totalTimeS * 0.76 ? -9 : 9)}
			y={y(currentFraction) - 10}
			text-anchor={clampedTime > totalTimeS * 0.76 ? 'end' : 'start'}>{content.currentMarker}</text
		>

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
			class="axis-label"
			transform={`translate(15 ${(margin.top + height - margin.bottom) / 2}) rotate(-90)`}
			text-anchor="middle">{content.yAxis}</text
		>

		<g class="order-tag" transform={`translate(${width - margin.right - 92} ${margin.top + 7})`}>
			<rect width="92" height="24" rx="12" />
			<text x="46" y="16" text-anchor="middle">{content.orderTag({ order: localizedOrder })}</text>
		</g>
	</svg>
	<div class="legend">
		<span class="curve-key">c(t) / c₀</span>
		{#if showHalfLives}<span class="half-key">{content.halfLifeMarker}</span>{/if}
		<strong>t = {formatTime(clampedTime)} s · c/c₀ = {currentFraction.toFixed(3)}</strong>
	</div>
	{#if showHalfLives}<figcaption>{content.caption}</figcaption>{/if}
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

	.grid {
		stroke: rgba(31, 40, 38, 0.1);
		stroke-dasharray: 2 5;
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

	.decay-curve {
		fill: none;
		stroke: #17636d;
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-width: 3.2;
		transition: d 280ms ease;
	}

	.half-life-line {
		stroke: #8a5a2c;
		stroke-dasharray: 3 5;
		stroke-width: 1.3;
	}

	.half-life-label {
		fill: #754518;
		font-family: var(--mono);
		font-size: 9px;
		font-weight: 800;
	}

	.half-index {
		baseline-shift: sub;
		font-size: 7px;
	}

	.current-guide {
		stroke: #a34428;
		stroke-dasharray: 2 4;
		stroke-width: 1.35;
	}

	.state-halo {
		fill: rgba(163, 68, 40, 0.16);
		transition:
			cx 220ms ease,
			cy 220ms ease;
	}

	.state {
		fill: #a34428;
		stroke: var(--paper);
		stroke-width: 2;
		transition:
			cx 220ms ease,
			cy 220ms ease;
	}

	.current-label {
		fill: #8f321e;
		font-family: var(--mono);
		font-size: 10px;
		font-weight: 800;
	}

	.order-tag rect {
		fill: rgba(23, 99, 109, 0.1);
		stroke: rgba(23, 99, 109, 0.42);
	}

	.order-tag text {
		fill: #175b64;
		font-family: var(--mono);
		font-size: 9px;
		font-weight: 800;
	}

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		align-items: center;
		padding-left: 2.6rem;
		color: var(--ink-muted);
		font-size: 0.61rem;
	}

	.legend span::before {
		display: inline-block;
		width: 16px;
		height: 2px;
		margin-right: 0.32rem;
		vertical-align: middle;
		content: '';
	}

	.curve-key::before {
		background: #17636d;
	}

	.half-key::before {
		background: repeating-linear-gradient(90deg, #8a5a2c 0 3px, transparent 3px 6px);
	}

	.legend strong {
		margin-left: auto;
		font-family: var(--mono);
		font-size: 0.62rem;
	}

	figcaption {
		margin: 0.35rem 0 0;
		color: var(--ink-muted);
		font-size: 0.64rem;
		line-height: 1.4;
	}

	@media (prefers-reduced-motion: reduce) {
		.decay-curve,
		.state,
		.state-halo {
			transition: none;
		}
	}

	@media (max-width: 540px) {
		.tick {
			font-size: 18px;
		}

		.axis-label {
			font-size: 17px;
		}

		.current-label,
		.half-life-label,
		.order-tag text {
			font-size: 14px;
		}

		.legend {
			padding-left: 0;
			gap: 0.55rem;
		}
	}
</style>
