<script lang="ts">
	import {
		ICE_IH_MELTING_FLOOR_K,
		WATER_CRITICAL_POINT,
		WATER_TRIPLE_POINT,
		buildBoilingCurve,
		buildMeltingCurve,
		buildSublimationCurve,
		celsiusToKelvin,
		meltingPressurePa,
		type PTPoint,
		type WaterFrame
	} from '$lib/chem';
	import type { WaterTriViewContent } from '$lib/content';

	interface Props {
		/** The resolved water state this diagram renders. */
		frame: WaterFrame;
		reveal?: number;
		showSolid?: boolean;
		showCritical?: boolean;
		linearized?: boolean;
		showPressureLine?: boolean;
		/** Extra p–T waypoints drawn as a dashed route (freeze-dry detour). */
		routePoints?: readonly { temperatureC: number; pressurePa: number }[];
		content: WaterTriViewContent['map'];
		phaseName: string;
	}

	let {
		frame,
		reveal = 1,
		showSolid = false,
		showCritical = false,
		linearized = false,
		showPressureLine = false,
		routePoints = [],
		content,
		phaseName
	}: Props = $props();

	const width = 560;
	const height = 318;
	const margin = { top: 24, right: 24, bottom: 48, left: 58 };

	// The map's fixed window: hold the axes still while scenes change what
	// they draw, so the reader watches curves appear on one territory
	// instead of the territory jumping around.
	const minTemperatureK = 200;
	const maxTemperatureK = 700;
	const minPressurePa = 1; // 1 Pa floor keeps the log axis finite.
	const maxPressurePa = 1e9;

	// Linearized window: the saturation span only.
	const minInverseK = 1000 / WATER_CRITICAL_POINT.temperatureK;
	const maxInverseK = 1000 / 273.15;

	const boilingCurve = buildBoilingCurve();
	const sublimationCurve = buildSublimationCurve();
	// The near-vertical melting wall, drawn from the triple point up and out
	// of the top of the window.
	const meltingCurve: PTPoint[] = buildMeltingCurve()
		.slice()
		.reverse()
		.concat({
			temperatureK: ICE_IH_MELTING_FLOOR_K,
			pressurePa: meltingPressurePa(ICE_IH_MELTING_FLOOR_K) * 5
		});

	function xScale(temperatureK: number): number {
		const t = linearized
			? (1000 / temperatureK - minInverseK) / (maxInverseK - minInverseK)
			: (temperatureK - minTemperatureK) / (maxTemperatureK - minTemperatureK);
		return margin.left + t * (width - margin.left - margin.right);
	}

	function yScale(pressurePa: number): number {
		const clamped = Math.max(minPressurePa, Math.min(maxPressurePa, pressurePa));
		const t = linearized
			? (Math.log(clamped / 1000) - Math.log(0.6)) / (Math.log(23000) - Math.log(0.6))
			: (Math.log10(clamped) - Math.log10(minPressurePa)) /
				(Math.log10(maxPressurePa) - Math.log10(minPressurePa));
		return height - margin.bottom - t * (height - margin.top - margin.bottom);
	}

	function pathFor(points: readonly PTPoint[]): string {
		return points
			.filter((point) => !linearized || point.temperatureK >= 273.15)
			.map(
				(point, index) =>
					`${index === 0 ? 'M' : 'L'}${xScale(point.temperatureK).toFixed(2)},${yScale(point.pressurePa).toFixed(2)}`
			)
			.join(' ');
	}

	let revealedBoiling = $derived(
		boilingCurve.slice(
			0,
			Math.max(2, Math.round(boilingCurve.length * Math.min(1, Math.max(0.03, reveal))))
		)
	);
	let boilingPath = $derived(pathFor(revealedBoiling));
	let sublimationPath = $derived(pathFor(sublimationCurve));
	let meltingPath = $derived(pathFor(meltingCurve));
	let routePath = $derived(
		routePoints
			.map(
				(point, index) =>
					`${index === 0 ? 'M' : 'L'}${xScale(celsiusToKelvin(point.temperatureC)).toFixed(2)},${yScale(point.pressurePa).toFixed(2)}`
			)
			.join(' ')
	);

	let stateX = $derived(xScale(frame.temperatureK));
	let stateY = $derived(yScale(frame.pressurePa));
	let stateVisible = $derived(
		!linearized ||
			(frame.temperatureK >= 273.15 && frame.temperatureK <= WATER_CRITICAL_POINT.temperatureK)
	);

	let triplePx = $derived(xScale(WATER_TRIPLE_POINT.temperatureK));
	let triplePy = $derived(yScale(WATER_TRIPLE_POINT.pressurePa));
	let criticalPx = $derived(xScale(WATER_CRITICAL_POINT.temperatureK));
	let criticalPy = $derived(yScale(WATER_CRITICAL_POINT.pressurePa));

	// Temperature ticks in Celsius for the map view.
	const mapTicksC = [-50, 0, 100, 200, 300, 400];
	const pressureTicks = [
		{ pa: 1, label: '1 Pa' },
		{ pa: 1e3, label: '1 kPa' },
		{ pa: 101325, label: '1 atm' },
		{ pa: 1e7, label: '10 MPa' },
		{ pa: 1e9, label: '1 GPa' }
	];
	const inverseTicks = [1.6, 2.0, 2.4, 2.8, 3.2, 3.6];

	let displayPressureKPa = $derived(
		frame.pressurePa >= 100
			? (frame.pressurePa / 1000).toFixed(frame.pressurePa >= 1e6 ? 0 : 1)
			: (frame.pressurePa / 1000).toFixed(3)
	);
	let ariaLabel = $derived(
		content.ariaLabel({
			temperatureC: frame.temperatureC.toFixed(1),
			pressureKPa: displayPressureKPa,
			phase: phaseName
		})
	);
</script>

<figure class="diagram">
	<svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={ariaLabel}>
		{#if linearized}
			{#each inverseTicks as tick (tick)}
				<line
					class="x-tick"
					x1={margin.left +
						((tick - minInverseK) / (maxInverseK - minInverseK)) *
							(width - margin.left - margin.right)}
					x2={margin.left +
						((tick - minInverseK) / (maxInverseK - minInverseK)) *
							(width - margin.left - margin.right)}
					y1={height - margin.bottom}
					y2={height - margin.bottom + 5}
				/>
				<text
					class="tick"
					x={margin.left +
						((tick - minInverseK) / (maxInverseK - minInverseK)) *
							(width - margin.left - margin.right)}
					y={height - margin.bottom + 19}
					text-anchor="middle">{tick.toFixed(1)}</text
				>
			{/each}
		{:else}
			{#each mapTicksC as tick (tick)}
				<line
					class="x-tick"
					x1={xScale(celsiusToKelvin(tick))}
					x2={xScale(celsiusToKelvin(tick))}
					y1={height - margin.bottom}
					y2={height - margin.bottom + 5}
				/>
				<text
					class="tick"
					x={xScale(celsiusToKelvin(tick))}
					y={height - margin.bottom + 19}
					text-anchor="middle">{tick}</text
				>
			{/each}
			{#each pressureTicks as tick (tick.pa)}
				<line
					class="grid"
					x1={margin.left}
					x2={width - margin.right}
					y1={yScale(tick.pa)}
					y2={yScale(tick.pa)}
				/>
				<text class="tick" x={margin.left - 8} y={yScale(tick.pa) + 4} text-anchor="end"
					>{tick.label}</text
				>
			{/each}
		{/if}

		{#if !linearized}
			{#if showSolid}
				<path class="boundary sublimation" d={sublimationPath} />
				<path class="boundary melting" d={meltingPath} />
			{/if}
			<path class="boundary boiling" d={boilingPath} />
		{:else}
			<path class="boundary boiling" d={boilingPath} />
		{/if}

		{#if !linearized && showPressureLine}
			<line
				class="pressure-line"
				x1={margin.left}
				x2={width - margin.right}
				y1={yScale(frame.pressurePa)}
				y2={yScale(frame.pressurePa)}
			/>
			<text
				class="pressure-label"
				x={width - margin.right - 4}
				y={yScale(frame.pressurePa) - 6}
				text-anchor="end">{content.externalPressure}</text
			>
		{/if}

		{#if !linearized && routePath}
			<path class="route" d={routePath} />
		{/if}

		{#if !linearized}
			<circle class="landmark triple" cx={triplePx} cy={triplePy} r="5" />
			{#if showSolid}
				<text class="landmark-label" x={triplePx + 9} y={triplePy + 14}>{content.triplePoint}</text>
			{/if}
			{#if showCritical}
				<circle class="landmark critical" cx={criticalPx} cy={criticalPy} r="5" />
				<text class="landmark-label" x={criticalPx - 9} y={criticalPy - 9} text-anchor="end"
					>{content.criticalPoint}</text
				>
			{/if}
			{#if showSolid}
				<text class="region-label" x={xScale(celsiusToKelvin(-45))} y={yScale(2e5)}
					>{content.regions.solid}</text
				>
				<text class="region-label" x={xScale(celsiusToKelvin(120))} y={yScale(4e6)}
					>{content.regions.liquid}</text
				>
				<text class="region-label" x={xScale(celsiusToKelvin(220))} y={yScale(2e2)}
					>{content.regions.vapor}</text
				>
			{:else}
				<text class="region-label" x={xScale(celsiusToKelvin(60))} y={yScale(6e5)}
					>{content.regions.liquid}</text
				>
				<text class="region-label" x={xScale(celsiusToKelvin(240))} y={yScale(6e2)}
					>{content.regions.vapor}</text
				>
			{/if}
		{/if}

		{#if stateVisible}
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
			text-anchor="middle">{linearized ? content.xAxisLinearized : content.xAxis}</text
		>
		<text
			class="axis-label y-label"
			transform={`translate(15 ${(margin.top + height - margin.bottom) / 2}) rotate(-90)`}
			text-anchor="middle">{linearized ? content.yAxisLinearized : content.yAxis}</text
		>
	</svg>
	<div class="legend">
		<span class="boiling-key">{content.boilingLine}</span>
		{#if showSolid && !linearized}
			<span class="sublimation-key">{content.sublimationLine}</span>
			<span class="melting-key">{content.meltingLine}</span>
		{/if}
		<strong>{displayPressureKPa} kPa · {frame.temperatureC.toFixed(1)} °C</strong>
	</div>
	<figcaption>
		<span>{content.captionKind}</span>
		{linearized ? content.caption.linearized : content.caption.map}
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
	.pressure-label {
		fill: var(--ink-muted);
		font-family: var(--mono);
		font-size: 10px;
	}

	.axis-label {
		fill: var(--ink);
		font-size: 11px;
		font-weight: 700;
	}

	.boundary {
		fill: none;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.boiling {
		stroke: var(--ethanol);
		stroke-width: 3.2;
		transition: d 300ms ease;
	}

	.sublimation {
		stroke: var(--water);
		stroke-dasharray: 7 5;
		stroke-width: 2.6;
	}

	.melting {
		stroke: var(--water);
		stroke-width: 2.6;
	}

	.pressure-line {
		stroke: var(--ink);
		stroke-dasharray: 5 4;
		stroke-width: 1.4;
	}

	.pressure-label {
		fill: var(--ink);
		font-weight: 700;
	}

	.route {
		fill: none;
		stroke: var(--acid);
		stroke-dasharray: 3 5;
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-width: 2.4;
	}

	.landmark {
		fill: var(--paper);
		stroke: var(--acid);
		stroke-width: 2.4;
	}

	.landmark.critical {
		stroke: var(--ink);
	}

	.landmark-label {
		fill: var(--acid);
		font-weight: 800;
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

	.region-label {
		fill: var(--ink-muted);
		font-family: var(--serif);
		font-size: 12px;
		font-style: italic;
		opacity: 0.62;
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

	.boiling-key::before {
		background: var(--ethanol);
	}

	.sublimation-key::before {
		background: repeating-linear-gradient(90deg, var(--water) 0 5px, transparent 5px 8px);
	}

	.melting-key::before {
		background: var(--water);
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

	figcaption span {
		margin-right: 0.35rem;
		color: var(--ink);
		font-family: var(--mono);
		font-weight: 800;
		letter-spacing: 0.12em;
	}

	@media (max-width: 540px) {
		.tick {
			font-size: 18px;
		}

		.axis-label {
			font-size: 17px;
		}

		.landmark-label {
			font-size: 14px;
		}

		.region-label {
			font-size: 19px;
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
