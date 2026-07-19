<script lang="ts">
	import { reactionGibbs, valleyCurve } from '$lib/chem';
	import type { GibbsTriViewContent } from '$lib/content';

	interface Props {
		temperatureK: number;
		pressureBar: number;
		/** Ball position ξ; null parks it on the floor. */
		extent?: number | null;
		showSlope?: boolean;
		showFloor?: boolean;
		content: GibbsTriViewContent['valley'];
	}

	let {
		temperatureK,
		pressureBar,
		extent = null,
		showSlope = false,
		showFloor = true,
		content
	}: Props = $props();

	const width = 560;
	const height = 318;
	const margin = { top: 24, right: 24, bottom: 46, left: 58 };

	let curve = $derived(valleyCurve(temperatureK, pressureBar, 140));
	// A fixed window keeps the valley comparable while T and p reshape it.
	const minG = -3.5;
	const maxG = 9;

	function x(xi: number): number {
		return margin.left + xi * (width - margin.left - margin.right);
	}
	function y(gibbsKJ: number): number {
		const clamped = Math.max(minG, Math.min(maxG, gibbsKJ));
		return margin.top + ((maxG - clamped) / (maxG - minG)) * (height - margin.top - margin.bottom);
	}

	let valleyPath = $derived(
		curve.extents
			.map(
				(xi, index) =>
					`${index === 0 ? 'M' : 'L'}${x(xi).toFixed(2)},${y(curve.gibbsKJ[index]).toFixed(2)}`
			)
			.join(' ')
	);

	let floor = $derived(curve.equilibrium);
	let ballExtent = $derived(extent ?? floor.extent);
	let ballGibbs = $derived.by(() => {
		// Read the ball's height off the sampled curve for perfect registration.
		let best = 0;
		for (let index = 1; index < curve.extents.length; index += 1) {
			if (
				Math.abs(curve.extents[index] - ballExtent) < Math.abs(curve.extents[best] - ballExtent)
			) {
				best = index;
			}
		}
		return curve.gibbsKJ[best];
	});
	let slopeKJ = $derived(reactionGibbs(ballExtent, temperatureK, pressureBar) / 1000);

	// Tangent segment at the ball, drawn in ξ-window of ±0.09.
	let tangent = $derived.by(() => {
		const dx = 0.09;
		const x0 = Math.max(0.002, ballExtent - dx);
		const x1 = Math.min(0.998, ballExtent + dx);
		return {
			x1: x(x0),
			y1: y(ballGibbs - slopeKJ * (ballExtent - x0)),
			x2: x(x1),
			y2: y(ballGibbs + slopeKJ * (x1 - ballExtent))
		};
	});

	const xTicks = [0, 0.25, 0.5, 0.75, 1];
	const gTicks = [-2, 0, 2, 4, 6, 8];

	let ariaLabel = $derived(content.ariaLabel({ extent: ballExtent.toFixed(2) }));
</script>

<figure class="diagram">
	<svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={ariaLabel}>
		{#each gTicks as tick (tick)}
			<line class="grid" x1={margin.left} x2={width - margin.right} y1={y(tick)} y2={y(tick)} />
			<text class="tick" x={margin.left - 8} y={y(tick) + 4} text-anchor="end">{tick}</text>
		{/each}
		{#each xTicks as tick (tick)}
			<line
				class="x-tick"
				x1={x(tick)}
				x2={x(tick)}
				y1={height - margin.bottom}
				y2={height - margin.bottom + 5}
			/>
			<text class="tick" x={x(tick)} y={height - margin.bottom + 19} text-anchor="middle"
				>{tick.toFixed(2)}</text
			>
		{/each}

		<path class="valley" d={valleyPath} />

		{#if showFloor}
			<line
				class="floor-line"
				x1={x(floor.extent)}
				x2={x(floor.extent)}
				y1={y(floor.gibbsKJ)}
				y2={height - margin.bottom}
			/>
			<circle class="floor-dot" cx={x(floor.extent)} cy={y(floor.gibbsKJ)} r="4.6" />
			<text
				class="floor-label"
				x={x(floor.extent) + 8}
				y={height - margin.bottom - 8}
				text-anchor="start">{content.floorMarker} ξ = {floor.extent.toFixed(2)}</text
			>
		{/if}

		{#if showSlope}
			<line class="tangent" x1={tangent.x1} y1={tangent.y1} x2={tangent.x2} y2={tangent.y2} />
		{/if}

		<circle class="state-halo" cx={x(ballExtent)} cy={y(ballGibbs)} r="11" />
		<circle class="state" cx={x(ballExtent)} cy={y(ballGibbs)} r="5.5" />
		<text
			class="ball-label"
			x={x(ballExtent) + (ballExtent > 0.72 ? -9 : 9)}
			y={y(ballGibbs) - 9}
			text-anchor={ballExtent > 0.72 ? 'end' : 'start'}>{content.ballMarker}</text
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
			class="axis-label y-label"
			transform={`translate(15 ${(margin.top + height - margin.bottom) / 2}) rotate(-90)`}
			text-anchor="middle">{content.yAxis}</text
		>
	</svg>
	<div class="legend">
		{#if showSlope}
			<span class="slope-readout">{content.slopeReadout({ deltaG: slopeKJ.toFixed(2) })}</span>
		{/if}
		<strong>ξ = {ballExtent.toFixed(2)}</strong>
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

	.valley {
		fill: none;
		stroke: #8a5a2c;
		stroke-linecap: round;
		stroke-width: 3.2;
		transition: d 300ms ease;
	}

	.floor-line {
		stroke: var(--acid);
		stroke-dasharray: 3 5;
		stroke-width: 1.4;
	}

	.floor-dot {
		fill: var(--paper);
		stroke: var(--acid);
		stroke-width: 2.4;
	}

	.floor-label {
		fill: var(--acid);
		font-family: var(--mono);
		font-size: 10px;
		font-weight: 800;
	}

	.tangent {
		stroke: var(--water);
		stroke-width: 2.2;
		stroke-linecap: round;
	}

	.state {
		fill: var(--ethanol);
		stroke: var(--paper);
		stroke-width: 2;
		transition:
			cx 260ms ease,
			cy 260ms ease;
	}

	.state-halo {
		fill: rgba(214, 107, 50, 0.16);
		transition:
			cx 260ms ease,
			cy 260ms ease;
	}

	.ball-label {
		fill: var(--ink);
		font-family: var(--mono);
		font-size: 10px;
		font-weight: 700;
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

	.slope-readout {
		color: #175059;
		font-family: var(--mono);
		font-weight: 700;
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

	@media (max-width: 540px) {
		.tick {
			font-size: 18px;
		}

		.axis-label {
			font-size: 17px;
		}

		.floor-label,
		.ball-label {
			font-size: 14px;
		}

		.legend {
			padding-left: 0;
			gap: 0.55rem;
		}
	}
</style>
