<script lang="ts">
	import { biCdEutectic, liquidusK, type EutecticFrame } from '$lib/chem';
	import type { CoolingTriViewContent } from '$lib/content';

	interface Props {
		/** The resolved melt state this diagram renders. */
		frame: EutecticFrame;
		/** 'curve' plots this melt's T–t record; 'map' plots the T–x diagram. */
		mode?: 'curve' | 'map';
		/** Clock position on the curve, seconds; marks the current instant. */
		timeS?: number | null;
		showLiquidus?: boolean;
		showEutectic?: boolean;
		/** Plot this melt's break and arrest as evidence points on the map. */
		showEvidence?: boolean;
		content: CoolingTriViewContent['diagram'];
		regionName: string;
	}

	let {
		frame,
		mode = 'map',
		timeS = null,
		showLiquidus = false,
		showEutectic = false,
		showEvidence = false,
		content,
		regionName
	}: Props = $props();

	const width = 560;
	const height = 318;
	const margin = { top: 22, right: 24, bottom: 46, left: 58 };
	const CELSIUS_ZERO_K = 273.15;

	const eutectic = biCdEutectic();
	// Shared temperature window: below the eutectic down to the cold end of
	// the simulated curves, up to the hotter melting point plus headroom.
	const minTemperatureC = 50;
	const maxTemperatureC = 345;

	function ty(temperatureC: number): number {
		const t = (temperatureC - minTemperatureC) / (maxTemperatureC - minTemperatureC);
		return height - margin.bottom - t * (height - margin.top - margin.bottom);
	}

	// --- T–x map ------------------------------------------------------------
	function mx(xCd: number): number {
		return margin.left + xCd * (width - margin.left - margin.right);
	}

	const LIQUIDUS_SAMPLES = 61;
	const liquidusLeft = Array.from({ length: LIQUIDUS_SAMPLES }, (_, index) => {
		const x = (index / (LIQUIDUS_SAMPLES - 1)) * eutectic.xB;
		return [x, liquidusK(x) - CELSIUS_ZERO_K] as const;
	});
	const liquidusRight = Array.from({ length: LIQUIDUS_SAMPLES }, (_, index) => {
		const x = eutectic.xB + (index / (LIQUIDUS_SAMPLES - 1)) * (1 - eutectic.xB);
		return [x, liquidusK(x) - CELSIUS_ZERO_K] as const;
	});

	function mapPath(points: readonly (readonly [number, number])[]): string {
		return points
			.map(([x, t], index) => `${index === 0 ? 'M' : 'L'}${mx(x).toFixed(2)},${ty(t).toFixed(2)}`)
			.join(' ');
	}

	const liquidusLeftPath = mapPath(liquidusLeft);
	const liquidusRightPath = mapPath(liquidusRight);
	const mapXTicks = [0, 0.2, 0.4, 0.6, 0.8, 1];
	const temperatureTicks = [100, 150, 200, 250, 300];

	// --- T–t curve ------------------------------------------------------------
	let curveEndS = $derived(frame.curve.points[frame.curve.points.length - 1].timeS);
	function tx(time: number): number {
		return margin.left + (time / curveEndS) * (width - margin.left - margin.right);
	}
	let curvePath = $derived(
		frame.curve.points
			.filter((_point, index) => index % 3 === 0)
			.map(
				(point, index) =>
					`${index === 0 ? 'M' : 'L'}${tx(point.timeS).toFixed(2)},${ty(point.temperatureC).toFixed(2)}`
			)
			.join(' ')
	);
	let arrest = $derived(frame.curve.arrest);
	let breakC = $derived(frame.curve.liquidusBreakC);
	let clockX = $derived(timeS === null ? null : tx(Math.min(timeS, curveEndS)));
	let clockY = $derived(timeS === null ? null : ty(frame.temperatureC));

	let stateX = $derived(mode === 'map' ? mx(frame.xCd) : (clockX ?? mx(frame.xCd)));
	let stateY = $derived(ty(frame.temperatureC));

	let ariaLabel = $derived(
		content.ariaLabel({ temperatureC: frame.temperatureC.toFixed(0), region: regionName })
	);
	let caption = $derived(mode === 'curve' ? content.caption.curve : content.caption.map);
</script>

<figure class="diagram">
	<svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={ariaLabel}>
		{#each temperatureTicks as tick (tick)}
			<line class="grid" x1={margin.left} x2={width - margin.right} y1={ty(tick)} y2={ty(tick)} />
			<text class="tick" x={margin.left - 8} y={ty(tick) + 4} text-anchor="end">{tick}</text>
		{/each}

		{#if mode === 'map'}
			{#each mapXTicks as tick (tick)}
				<line
					class="x-tick"
					x1={mx(tick)}
					x2={mx(tick)}
					y1={height - margin.bottom}
					y2={height - margin.bottom + 5}
				/>
				<text class="tick" x={mx(tick)} y={height - margin.bottom + 19} text-anchor="middle"
					>{tick.toFixed(1)}</text
				>
			{/each}

			{#if showLiquidus}
				<path class="liquidus bi" d={liquidusLeftPath} />
				<path class="liquidus cd" d={liquidusRightPath} />
			{/if}
			{#if showEutectic}
				<line
					class="eutectic-line"
					x1={margin.left}
					x2={width - margin.right}
					y1={ty(eutectic.temperatureC)}
					y2={ty(eutectic.temperatureC)}
				/>
				<circle class="landmark" cx={mx(eutectic.xB)} cy={ty(eutectic.temperatureC)} r="5" />
				<text class="landmark-label" x={mx(eutectic.xB) + 9} y={ty(eutectic.temperatureC) + 15}
					>{content.eutecticPoint}</text
				>
			{/if}
			{#if showEvidence && breakC !== null}
				<circle class="evidence" cx={mx(frame.xCd)} cy={ty(breakC)} r="4.5" />
				<text class="evidence-label" x={mx(frame.xCd) + 9} y={ty(breakC) - 7}
					>{content.breakMarker}</text
				>
			{/if}
			{#if showEvidence && arrest}
				<circle class="evidence arrest" cx={mx(frame.xCd)} cy={ty(arrest.temperatureC)} r="4.5" />
				<text class="evidence-label" x={mx(frame.xCd) + 9} y={ty(arrest.temperatureC) - 7}
					>{content.arrestMarker}</text
				>
			{/if}

			<text class="vertex-label" x={mx(0)} y={ty(liquidusK(0) - CELSIUS_ZERO_K) - 10}
				>{content.bismuthVertex}</text
			>
			<text
				class="vertex-label"
				x={mx(1)}
				y={ty(liquidusK(1) - CELSIUS_ZERO_K) - 10}
				text-anchor="end">{content.cadmiumVertex}</text
			>
		{:else}
			<path class="cooling-curve" d={curvePath} />
			{#if breakC !== null}
				<circle class="evidence" cx={tx(0)} cy={ty(breakC)} r="0" />
				<line
					class="marker-line"
					x1={margin.left}
					x2={width - margin.right}
					y1={ty(breakC)}
					y2={ty(breakC)}
				/>
				<text
					class="evidence-label"
					x={width - margin.right - 4}
					y={ty(breakC) - 6}
					text-anchor="end">{content.breakMarker} {breakC.toFixed(0)} °C</text
				>
			{/if}
			{#if arrest}
				<line
					class="arrest-span"
					x1={tx(arrest.startS)}
					x2={tx(arrest.startS + arrest.durationS)}
					y1={ty(arrest.temperatureC)}
					y2={ty(arrest.temperatureC)}
				/>
				<text
					class="evidence-label arrest"
					x={tx(arrest.startS + arrest.durationS / 2)}
					y={ty(arrest.temperatureC) + 16}
					text-anchor="middle"
					>{content.arrestMarker}
					{arrest.temperatureC.toFixed(0)} °C · {arrest.durationS.toFixed(0)} s</text
				>
			{/if}
			{#if clockX !== null && clockY !== null}
				<line
					class="clock-line"
					x1={clockX}
					x2={clockX}
					y1={margin.top}
					y2={height - margin.bottom}
				/>
			{/if}
		{/if}

		{#if mode === 'map' || clockX !== null}
			<circle class="state-halo" cx={stateX} cy={stateY} r="11" />
			<circle class="state" cx={stateX} cy={stateY} r="5.5" />
		{/if}

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
			text-anchor="middle">{mode === 'curve' ? content.curveXAxis : content.xAxis}</text
		>
		<text
			class="axis-label y-label"
			transform={`translate(15 ${(margin.top + height - margin.bottom) / 2}) rotate(-90)`}
			text-anchor="middle">{content.yAxis}</text
		>
	</svg>
	<div class="legend">
		{#if mode === 'map' && showLiquidus}
			<span class="liquidus-key">{content.liquidusLine}</span>
		{/if}
		<strong>{frame.temperatureC.toFixed(0)} °C · {regionName}</strong>
	</div>
	<figcaption>
		{caption}
	</figcaption>
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
	.axis-label,
	.landmark-label,
	.evidence-label {
		fill: var(--ink-muted);
		font-family: var(--mono);
		font-size: 10px;
	}

	.axis-label {
		fill: var(--ink);
		font-size: 11px;
		font-weight: 700;
	}

	.liquidus {
		fill: none;
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-width: 3;
	}

	.liquidus.bi {
		stroke: #5f6398;
	}

	.liquidus.cd {
		stroke: #a3702a;
	}

	.eutectic-line {
		stroke: var(--acid);
		stroke-dasharray: 5 5;
		stroke-width: 1.6;
		opacity: 0.7;
	}

	.landmark {
		fill: var(--paper);
		stroke: var(--acid);
		stroke-width: 2.4;
	}

	.landmark-label {
		fill: var(--acid);
		font-weight: 800;
	}

	.cooling-curve {
		fill: none;
		stroke: var(--ink);
		stroke-width: 2.6;
		stroke-linecap: round;
	}

	.marker-line {
		stroke: #5f6398;
		stroke-dasharray: 4 5;
		stroke-width: 1.3;
	}

	.arrest-span {
		stroke: var(--acid);
		stroke-width: 4;
		stroke-linecap: round;
	}

	.clock-line {
		stroke: var(--ink-muted);
		stroke-dasharray: 3 4;
		stroke-width: 1.2;
	}

	.evidence {
		fill: var(--paper);
		stroke: #5f6398;
		stroke-width: 2.2;
	}

	.evidence.arrest {
		stroke: var(--acid);
	}

	.evidence-label {
		fill: var(--ink);
		font-weight: 700;
	}

	.evidence-label.arrest {
		fill: var(--acid);
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

	.vertex-label {
		fill: var(--ink);
		font-family: var(--mono);
		font-size: 11px;
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

	.liquidus-key::before {
		background: linear-gradient(90deg, #5f6398 0 8px, #a3702a 8px 16px);
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

		.landmark-label,
		.evidence-label {
			font-size: 14px;
		}

		.vertex-label {
			font-size: 16px;
		}

		.legend {
			padding-left: 0;
			gap: 0.55rem;
		}

		.legend span {
			font-size: 0.56rem;
		}
	}
</style>
