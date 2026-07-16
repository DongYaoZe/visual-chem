<script lang="ts">
	import {
		ATM_BAR,
		ETHANOL_WATER,
		ETHANOL_WATER_LAI_2014,
		buildTxyCurve,
		findAzeotrope,
		simpleDistillationStages,
		type ExperimentalVlePoint
	} from '$lib/chem';
	import { type DiagramContent, zhCNSiteContent } from '$lib/content';

	interface PlotPoint {
		x: number;
		y: number;
		temperatureC: number;
	}

	interface Props {
		composition: number;
		stage?: number;
		pressureBar?: number;
		interactionScale?: number;
		reveal?: number;
		showAzeotrope?: boolean;
		experimentMode?: boolean;
		showExperimentalData?: boolean;
		currentPointOverride?: ExperimentalVlePoint;
		recordedExperimentalIndices?: number[];
		content?: DiagramContent;
	}

	let {
		composition,
		stage = 0,
		pressureBar = ATM_BAR,
		interactionScale = 1,
		reveal = 1,
		showAzeotrope = true,
		experimentMode = false,
		showExperimentalData = false,
		currentPointOverride,
		recordedExperimentalIndices = [],
		content = zhCNSiteContent.shared.diagram
	}: Props = $props();

	const width = 560;
	const height = 318;
	const margin = { top: 22, right: 20, bottom: 48, left: 54 };
	let curve = $derived(buildTxyCurve(pressureBar, 101, ETHANOL_WATER, interactionScale));
	let azeotrope = $derived(findAzeotrope(pressureBar, ETHANOL_WATER, interactionScale));
	let stages = $derived(
		simpleDistillationStages(composition, stage, pressureBar, ETHANOL_WATER, interactionScale)
	);
	let modelCurrent = $derived(stages.at(-1) ?? stages[0]);
	let current = $derived(currentPointOverride ?? modelCurrent);
	let referenceTemperatures = $derived([
		...buildTxyCurve(pressureBar, 101, ETHANOL_WATER, 0).map((point) => point.temperatureC),
		...buildTxyCurve(pressureBar, 101, ETHANOL_WATER, 1).map((point) => point.temperatureC),
		...ETHANOL_WATER_LAI_2014.points.map((point) => point.temperatureC)
	]);
	let minTemperature = $derived(Math.min(...referenceTemperatures) - 1.2);
	let maxTemperature = $derived(Math.max(...referenceTemperatures) + 1.5);
	let revealedCurve = $derived(
		curve.slice(0, Math.max(2, Math.round(curve.length * Math.min(1, Math.max(0.03, reveal)))))
	);
	let recordedPoints = $derived(
		recordedExperimentalIndices
			.filter((index) => index >= 0 && index < ETHANOL_WATER_LAI_2014.points.length)
			.map((index) => ETHANOL_WATER_LAI_2014.points[index])
			.sort((first, second) => first.x - second.x)
	);
	let experimentComplete = $derived(recordedPoints.length >= 5);
	let plottedCurve = $derived(experimentMode ? [] : revealedCurve);
	let showEnvelope = $derived(!experimentMode && reveal >= 0.95);
	let experimentalPressureMatches = $derived(
		Math.abs(pressureBar * 100 - ETHANOL_WATER_LAI_2014.pressureKPa) <= 0.05
	);
	let showLiteraturePoints = $derived(
		experimentalPressureMatches && (showExperimentalData || (experimentMode && experimentComplete))
	);
	let displayedExperimentalPoints = $derived(
		showLiteraturePoints ? ETHANOL_WATER_LAI_2014.points : recordedPoints
	);
	let accessibleLabel = $derived(
		experimentMode
			? content.accessibleReconstruction({
					totalPoints: ETHANOL_WATER_LAI_2014.points.length,
					selectedPoints: recordedPoints.length,
					liquidComposition: current.x.toFixed(3),
					vaporComposition: current.y.toFixed(3),
					temperatureC: current.temperatureC.toFixed(2)
				})
			: content.accessibleModel({
					liquidComposition: current.x.toFixed(3),
					vaporComposition: current.y.toFixed(3),
					bubblePointC: current.temperatureC.toFixed(2),
					modelStrength: interactionScale.toFixed(2),
					withExperimentalData: showExperimentalData,
					totalPoints: ETHANOL_WATER_LAI_2014.points.length
				})
	);
	let caption = $derived(
		experimentMode
			? content.captions.reconstruction
			: showExperimentalData
				? content.captions.comparison({ modelStrength: interactionScale.toFixed(2) })
				: interactionScale === 0
					? content.captions.ideal
					: content.captions.margules({ modelStrength: interactionScale.toFixed(2) })
	);

	function xScale(value: number): number {
		return margin.left + value * (width - margin.left - margin.right);
	}

	function yScale(value: number): number {
		return (
			margin.top +
			((maxTemperature - value) / (maxTemperature - minTemperature)) *
				(height - margin.top - margin.bottom)
		);
	}

	function pathFor(points: readonly PlotPoint[], key: 'x' | 'y'): string {
		return points
			.map(
				(point, index) =>
					`${index === 0 ? 'M' : 'L'}${xScale(point[key]).toFixed(2)},${yScale(point.temperatureC).toFixed(2)}`
			)
			.join(' ');
	}

	function trianglePoints(x: number, y: number, radius: number): string {
		return `${x},${y - radius} ${x - radius * 0.9},${y + radius * 0.7} ${x + radius * 0.9},${y + radius * 0.7}`;
	}

	function isRecorded(point: ExperimentalVlePoint): boolean {
		return recordedPoints.includes(point);
	}

	let bubblePath = $derived(pathFor(plottedCurve, 'x'));
	let dewPath = $derived(pathFor(plottedCurve, 'y'));
	let recordedBubblePath = $derived(pathFor(recordedPoints, 'x'));
	let recordedDewPath = $derived(pathFor(recordedPoints, 'y'));
	let literatureBubblePath = $derived(pathFor(ETHANOL_WATER_LAI_2014.points, 'x'));
	let literatureDewPath = $derived(pathFor(ETHANOL_WATER_LAI_2014.points, 'y'));
	let regionPath = $derived(
		`${pathFor(curve, 'x')} ${curve
			.slice()
			.reverse()
			.map((point) => `L${xScale(point.y).toFixed(2)},${yScale(point.temperatureC).toFixed(2)}`)
			.join(' ')} Z`
	);
	let ladderPath = $derived.by(() => {
		if (stages.length <= 1) return '';
		const commands: string[] = [];
		for (let index = 0; index < stages.length - 1; index += 1) {
			const point = stages[index];
			const next = stages[index + 1];
			commands.push(
				`${index === 0 ? 'M' : 'L'}${xScale(point.x)},${yScale(point.temperatureC)}`,
				`L${xScale(point.y)},${yScale(point.temperatureC)}`,
				`L${xScale(next.x)},${yScale(next.temperatureC)}`
			);
		}
		return commands.join(' ');
	});

	let tickValues = $derived(
		Array.from(
			{ length: 5 },
			(_, index) => minTemperature + ((maxTemperature - minTemperature) * index) / 4
		)
	);
</script>

<figure class="diagram">
	<svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={accessibleLabel}>
		{#each tickValues as tick (tick)}
			<line
				class="grid"
				x1={margin.left}
				x2={width - margin.right}
				y1={yScale(tick)}
				y2={yScale(tick)}
			/>
			<text class="tick" x={margin.left - 10} y={yScale(tick) + 4} text-anchor="end"
				>{tick.toFixed(0)}</text
			>
		{/each}
		{#each [0, 0.25, 0.5, 0.75, 1] as tick (tick)}
			<line
				class="x-tick"
				x1={xScale(tick)}
				x2={xScale(tick)}
				y1={height - margin.bottom}
				y2={height - margin.bottom + 5}
			/>
			<text class="tick" x={xScale(tick)} y={height - margin.bottom + 19} text-anchor="middle"
				>{tick.toFixed(2)}</text
			>
		{/each}

		{#if showEnvelope}
			<path class="two-phase" d={regionPath} />
		{/if}
		{#if !experimentMode}
			<path class="bubble-line" d={bubblePath} />
			<path class="dew-line" d={dewPath} />
		{/if}
		{#if experimentMode && experimentComplete}
			<path class="literature-guide bubble-guide" d={literatureBubblePath} />
			<path class="literature-guide dew-guide" d={literatureDewPath} />
		{/if}
		{#if experimentMode && recordedPoints.length > 1}
			<path class="recorded-line bubble-recorded" d={recordedBubblePath} />
			<path class="recorded-line dew-recorded" d={recordedDewPath} />
		{/if}

		{#each displayedExperimentalPoints as point (point.x)}
			<g class="literature-measurement" class:selected={isRecorded(point)}>
				<line
					class="experimental-error"
					x1={xScale(point.x)}
					x2={xScale(point.x)}
					y1={yScale(point.temperatureC - point.temperatureUncertaintyK95)}
					y2={yScale(point.temperatureC + point.temperatureUncertaintyK95)}
				/>
				<line
					class="experimental-error"
					x1={xScale(point.y)}
					x2={xScale(point.y)}
					y1={yScale(point.temperatureC - point.temperatureUncertaintyK95)}
					y2={yScale(point.temperatureC + point.temperatureUncertaintyK95)}
				/>
				{#if point.vaporCompositionUncertainty95}
					<line
						class="experimental-error"
						x1={xScale(point.y - point.vaporCompositionUncertainty95)}
						x2={xScale(point.y + point.vaporCompositionUncertainty95)}
						y1={yScale(point.temperatureC)}
						y2={yScale(point.temperatureC)}
					/>
				{/if}
				<circle
					class="literature-point liquid-record"
					class:recorded-point={experimentMode && isRecorded(point)}
					cx={xScale(point.x)}
					cy={yScale(point.temperatureC)}
					r={isRecorded(point) ? 5 : 3.7}
				/>
				<polygon
					class="literature-point vapor-record"
					class:recorded-point={experimentMode && isRecorded(point)}
					points={trianglePoints(
						xScale(point.y),
						yScale(point.temperatureC),
						isRecorded(point) ? 5.4 : 4.1
					)}
				/>
			</g>
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

		{#if ladderPath}
			<path class="ladder" d={ladderPath} />
		{/if}

		<line
			class="tie-line"
			x1={xScale(current.x)}
			x2={xScale(current.y)}
			y1={yScale(current.temperatureC)}
			y2={yScale(current.temperatureC)}
		/>
		<circle class="liquid-point" cx={xScale(current.x)} cy={yScale(current.temperatureC)} r="5" />
		<polygon
			class="vapor-point"
			points={trianglePoints(xScale(current.y), yScale(current.temperatureC), 5.5)}
		/>
		<text
			class="point-label"
			x={xScale(current.x) - 7}
			y={yScale(current.temperatureC) - 9}
			text-anchor="end">x</text
		>
		<text class="point-label" x={xScale(current.y) + 7} y={yScale(current.temperatureC) - 9}>y</text
		>

		{#if showAzeotrope && azeotrope}
			<line
				class="azeo-guide model-guide"
				x1={xScale(azeotrope.x)}
				x2={xScale(azeotrope.x)}
				y1={yScale(azeotrope.temperatureC)}
				y2={height - margin.bottom}
			/>
			<rect
				class="azeo-point model-azeo"
				x={xScale(azeotrope.x) - 5}
				y={yScale(azeotrope.temperatureC) - 5}
				width="10"
				height="10"
				transform={`rotate(45 ${xScale(azeotrope.x)} ${yScale(azeotrope.temperatureC)})`}
			/>
			<text
				class="azeo-label model-label"
				x={xScale(azeotrope.x) - 8}
				y={yScale(azeotrope.temperatureC) + 18}
				text-anchor="end">{content.modelFixedPoint}</text
			>
		{/if}
		{#if showAzeotrope && showExperimentalData && experimentalPressureMatches}
			<line
				class="azeo-guide experimental-guide"
				x1={xScale(ETHANOL_WATER_LAI_2014.azeotrope.x)}
				x2={xScale(ETHANOL_WATER_LAI_2014.azeotrope.x)}
				y1={yScale(ETHANOL_WATER_LAI_2014.azeotrope.temperatureC)}
				y2={height - margin.bottom}
			/>
			<circle
				class="azeo-point experimental-azeo"
				cx={xScale(ETHANOL_WATER_LAI_2014.azeotrope.x)}
				cy={yScale(ETHANOL_WATER_LAI_2014.azeotrope.temperatureC)}
				r="8"
			/>
			<circle
				class="azeo-point experimental-azeo-core"
				cx={xScale(ETHANOL_WATER_LAI_2014.azeotrope.x)}
				cy={yScale(ETHANOL_WATER_LAI_2014.azeotrope.temperatureC)}
				r="3"
			/>
			<text
				class="azeo-label experimental-label"
				x={xScale(ETHANOL_WATER_LAI_2014.azeotrope.x) - 8}
				y={yScale(ETHANOL_WATER_LAI_2014.azeotrope.temperatureC) - 13}
				text-anchor="end">{content.laiExperimentalAzeotrope}</text
			>
		{/if}

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
		<text class="region-label" x={xScale(0.43)} y={yScale(maxTemperature - 1)}
			>{content.regions.vapor}</text
		>
		<text class="region-label" x={xScale(0.43)} y={yScale(minTemperature + 0.65)}
			>{content.regions.liquid}</text
		>
		<text
			class="region-label two"
			x={xScale(0.43)}
			y={yScale((minTemperature + maxTemperature) / 2)}>{content.regions.twoPhase}</text
		>
	</svg>
	<div class="legend">
		{#if !experimentMode}
			<span class="bubble-key">{content.legend.modelLiquid}</span>
			<span class="dew-key">{content.legend.modelVapor}</span>
		{/if}
		{#if displayedExperimentalPoints.length > 0}
			<span class="experiment-key">{content.legend.experiment}</span>
		{/if}
		{#if experimentMode && recordedPoints.length > 1}
			<span class="reconstruction-key">{content.legend.reconstruction}</span>
		{/if}
		<strong>{pressureBar.toFixed(3)} bar</strong>
	</div>
	<figcaption>
		<span>{experimentMode ? content.captionKind.evidence : content.captionKind.model}</span>
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
	.point-label,
	.azeo-label,
	.region-label {
		fill: var(--ink-muted);
		font-family: var(--mono);
		font-size: 10px;
	}

	.axis-label {
		fill: var(--ink);
		font-size: 11px;
		font-weight: 700;
	}

	.two-phase {
		fill: rgba(229, 183, 118, 0.14);
		stroke: none;
	}

	.bubble-line,
	.dew-line,
	.ladder {
		fill: none;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.bubble-line {
		stroke: var(--ethanol);
		stroke-width: 3.2;
	}

	.dew-line {
		stroke: var(--ethanol);
		stroke-dasharray: 7 5;
		stroke-width: 3;
	}

	.literature-guide {
		fill: none;
		stroke: rgba(31, 40, 38, 0.38);
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-width: 1.2;
	}

	.dew-guide {
		stroke-dasharray: 3 4;
	}

	.tie-line {
		stroke: var(--ink);
		stroke-dasharray: 3 3;
		stroke-width: 1.4;
	}

	.ladder {
		stroke: var(--acid);
		stroke-width: 2;
	}

	.recorded-line {
		fill: none;
		stroke: var(--acid);
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-width: 2.8;
	}

	.bubble-recorded {
		stroke-dasharray: 9 3;
	}

	.dew-recorded {
		stroke-dasharray: 2 4;
	}

	.experimental-error {
		stroke: rgba(31, 40, 38, 0.38);
		stroke-width: 1;
	}

	.literature-point {
		fill: var(--paper);
		stroke: var(--ink);
		stroke-width: 1.5;
	}

	.literature-measurement.selected .literature-point,
	.recorded-point {
		stroke: var(--acid);
		stroke-width: 2.8;
	}

	.literature-measurement.selected .experimental-error {
		stroke: var(--acid);
		stroke-width: 1.25;
	}

	.liquid-point {
		fill: var(--ethanol);
		stroke: var(--paper);
		stroke-width: 2;
	}

	.vapor-point {
		fill: var(--ethanol);
		stroke: var(--paper);
		stroke-width: 2;
	}

	.azeo-guide {
		stroke: var(--acid);
		stroke-dasharray: 2 4;
		stroke-width: 1.2;
	}

	.model-azeo {
		fill: var(--paper);
		stroke: var(--acid);
		stroke-width: 2.4;
	}

	.experimental-azeo {
		fill: var(--paper);
		stroke: var(--ink);
		stroke-width: 2.4;
	}

	.experimental-azeo-core {
		fill: var(--ink);
		stroke: var(--paper);
		stroke-width: 1;
	}

	.azeo-label {
		fill: var(--acid);
		font-weight: 800;
	}

	.region-label {
		font-family: var(--serif);
		font-size: 12px;
		font-style: italic;
		opacity: 0.62;
	}

	.region-label.two {
		fill: #8d6e43;
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

	.bubble-key::before {
		background: var(--ethanol);
	}

	.dew-key::before {
		background: repeating-linear-gradient(90deg, var(--ethanol) 0 5px, transparent 5px 8px);
	}

	.experiment-key::before {
		width: auto;
		height: auto;
		color: var(--ink);
		font-size: 0.72rem;
		font-weight: 800;
		content: '○△';
	}

	.reconstruction-key::before {
		background: repeating-linear-gradient(90deg, var(--acid) 0 6px, transparent 6px 9px);
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
		.tick,
		.point-label {
			font-size: 18px;
		}

		.axis-label {
			font-size: 17px;
		}

		.azeo-label {
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
