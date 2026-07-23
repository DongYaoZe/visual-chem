<script lang="ts">
	import { mbDistribution, tailFraction } from '$lib/chem';
	import type { ArrheniusTriViewContent } from '$lib/content';

	interface PlotPoint {
		x: number;
		y: number;
	}

	interface Props {
		/** Temperature represented by the live state. */
		temperatureK: number;
		/** Fixed comparison temperature; the chart orders the two values cold → hot. */
		coldTemperatureK?: number;
		/** Temperature whose most-probable speed defines x = 1. */
		referenceTemperatureK?: number;
		eaKJPerMol: number;
		content: ArrheniusTriViewContent['distribution'];
	}

	let {
		temperatureK,
		coldTemperatureK = 277.15,
		referenceTemperatureK = 298.15,
		eaKJPerMol,
		content
	}: Props = $props();

	const gasConstantJPerMolK = 8.31446261815324;
	const width = 560;
	const height = 318;
	const margin = { top: 26, right: 24, bottom: 48, left: 58 };

	let lowTemperatureK = $derived(Math.min(temperatureK, coldTemperatureK));
	let highTemperatureK = $derived(Math.max(temperatureK, coldTemperatureK));
	// For x = v/vp(Tref), the molar kinetic energy is R*Tref*x².
	let thresholdX = $derived(
		Math.sqrt((eaKJPerMol * 1000) / (gasConstantJPerMolK * referenceTemperatureK))
	);
	let xMax = $derived(Math.max(3.4, thresholdX * 1.16));
	let coldCurve = $derived(mbDistribution(lowTemperatureK / referenceTemperatureK, 180, xMax));
	let hotCurve = $derived(mbDistribution(highTemperatureK / referenceTemperatureK, 180, xMax));
	let peak = $derived(Math.max(...coldCurve.ys, ...hotCurve.ys) * 1.08);
	let currentTail = $derived(tailFraction(eaKJPerMol, temperatureK));
	let coldTail = $derived(tailFraction(eaKJPerMol, lowTemperatureK));
	let hotTail = $derived(tailFraction(eaKJPerMol, highTemperatureK));
	let ariaLabel = $derived(
		`${content.ariaLabel({ temperatureC: (temperatureK - 273.15).toFixed(1) })}. ` +
			`Ea = ${eaKJPerMol.toFixed(0)} kJ mol^-1; k/A = ${currentTail.toExponential(2)}. ` +
			content.caption
	);

	function x(value: number): number {
		return margin.left + (value / xMax) * (width - margin.left - margin.right);
	}

	function y(value: number): number {
		return margin.top + (1 - value / peak) * (height - margin.top - margin.bottom);
	}

	function asPoints(curve: { xs: readonly number[]; ys: readonly number[] }): PlotPoint[] {
		return curve.xs.map((value, index) => ({ x: value, y: curve.ys[index] }));
	}

	function linePath(points: readonly PlotPoint[]): string {
		return points
			.map(
				(point, index) =>
					`${index === 0 ? 'M' : 'L'}${x(point.x).toFixed(2)},${y(point.y).toFixed(2)}`
			)
			.join(' ');
	}

	function tailPath(points: readonly PlotPoint[]): string {
		const tail = points.filter((point) => point.x >= thresholdX);
		if (tail.length === 0) return '';
		return [
			`M${x(thresholdX).toFixed(2)},${height - margin.bottom}`,
			...tail.map((point) => `L${x(point.x).toFixed(2)},${y(point.y).toFixed(2)}`),
			`L${x(xMax).toFixed(2)},${height - margin.bottom}`,
			'Z'
		].join(' ');
	}

	let coldPoints = $derived(asPoints(coldCurve));
	let hotPoints = $derived(asPoints(hotCurve));
	let coldPath = $derived(linePath(coldPoints));
	let hotPath = $derived(linePath(hotPoints));
	let coldTailPath = $derived(tailPath(coldPoints));
	let hotTailPath = $derived(tailPath(hotPoints));
	let xTicks = $derived(Array.from({ length: 5 }, (_item, index) => (xMax * index) / 4));
	const yTicks = [0, 0.25, 0.5, 0.75, 1];

	function scientific(value: number): string {
		return value.toExponential(2).replace('e-', 'e−');
	}
</script>

<figure class="diagram">
	<svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={ariaLabel}>
		{#each yTicks as tick (tick)}
			<line
				class="grid"
				x1={margin.left}
				x2={width - margin.right}
				y1={y(peak * tick)}
				y2={y(peak * tick)}
			/>
			<text class="tick" x={margin.left - 9} y={y(peak * tick) + 4} text-anchor="end">
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
				{tick.toFixed(1)}
			</text>
		{/each}

		<path class="cold-tail" d={coldTailPath} />
		<path class="hot-tail" d={hotTailPath} />
		<path class="cold-curve" d={coldPath} />
		<path class="hot-curve" d={hotPath} />

		<line
			class="threshold"
			x1={x(thresholdX)}
			x2={x(thresholdX)}
			y1={margin.top}
			y2={height - margin.bottom}
		/>
		<text class="threshold-label" x={x(thresholdX) - 7} y={margin.top + 13} text-anchor="end"
			>{content.thresholdLabel} · {eaKJPerMol.toFixed(0)} kJ mol⁻¹</text
		>
		<text
			class="tail-label"
			x={(x(thresholdX) + width - margin.right) / 2}
			y={height - margin.bottom - 12}
			text-anchor="middle">{content.tailLabel}</text
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
	</svg>
	<div class="legend">
		<span class="cold-key">{content.coldCurve} · {lowTemperatureK.toFixed(0)} K</span>
		<span class="hot-key">{content.hotCurve} · {highTemperatureK.toFixed(0)} K</span>
		<strong>k/A = {scientific(currentTail)}</strong>
	</div>
	<div class="tail-comparison" aria-hidden="true">
		k/A: {scientific(coldTail)} → {scientific(hotTail)}
	</div>
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

	.cold-curve,
	.hot-curve {
		fill: none;
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-width: 3;
		transition: d 280ms ease;
	}

	.cold-curve {
		stroke: #17636d;
	}

	.hot-curve {
		stroke: #a34428;
	}

	.cold-tail {
		fill: rgba(23, 99, 109, 0.22);
	}

	.hot-tail {
		fill: rgba(163, 68, 40, 0.27);
	}

	.threshold {
		stroke: #6d4b1f;
		stroke-dasharray: 4 4;
		stroke-width: 1.8;
	}

	.threshold-label,
	.tail-label {
		fill: #654018;
		font-family: var(--mono);
		font-size: 9px;
		font-weight: 800;
	}

	.tail-label {
		fill: #8f321e;
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
		height: 3px;
		margin-right: 0.32rem;
		vertical-align: middle;
		content: '';
	}

	.cold-key::before {
		background: #17636d;
	}

	.hot-key::before {
		background: #a34428;
	}

	.legend strong {
		margin-left: auto;
		font-family: var(--mono);
		font-size: 0.62rem;
	}

	.tail-comparison {
		margin-top: 0.14rem;
		color: #754518;
		font-family: var(--mono);
		font-size: 0.56rem;
		text-align: right;
	}

	figcaption {
		margin: 0.35rem 0 0;
		color: var(--ink-muted);
		font-size: 0.64rem;
		line-height: 1.4;
	}

	@media (prefers-reduced-motion: reduce) {
		.cold-curve,
		.hot-curve {
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

		.threshold-label,
		.tail-label {
			font-size: 14px;
		}

		.legend {
			padding-left: 0;
			gap: 0.55rem;
		}
	}
</style>
