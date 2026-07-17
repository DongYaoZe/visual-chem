<script lang="ts">
	import {
		CARROLL_2005_BRINES,
		KNO3_MOLAR_MASS_G_PER_MOL,
		NANO3_MOLAR_MASS_G_PER_MOL,
		REINDERS_1915_POINTS,
		kno3SolubilityGPer100g,
		massesToComposition,
		nano3SolubilityGPer100g,
		ternaryToXY,
		type SaltFrame,
		type TernaryComposition
	} from '$lib/chem';
	import type { SaltTriViewContent } from '$lib/content';

	interface Props {
		/** The resolved pot state this diagram renders. */
		frame: SaltFrame;
		mode?: 'curves' | 'ternary';
		showIsotherm?: boolean;
		showRegions?: boolean;
		showEutonic?: boolean;
		showTieLine?: boolean;
		showExperimentPoints?: boolean;
		/** Extra waypoints drawn as a dashed operation track. */
		trajectory?: readonly TernaryComposition[];
		content: SaltTriViewContent['triangle'];
		regionName: string;
	}

	let {
		frame,
		mode = 'ternary',
		showIsotherm = false,
		showRegions = false,
		showEutonic = false,
		showTieLine = false,
		showExperimentPoints = false,
		trajectory = [],
		content,
		regionName
	}: Props = $props();

	const width = 560;
	const height = 318;

	// --- Binary curves view -------------------------------------------------
	const curveMargin = { top: 20, right: 24, bottom: 46, left: 58 };
	const maxSolubility = 260;
	const CURVE_SAMPLES = 101;
	const kno3Curve = Array.from({ length: CURVE_SAMPLES }, (_, index) => {
		const t = (100 * index) / (CURVE_SAMPLES - 1);
		return [t, kno3SolubilityGPer100g(t)] as const;
	});
	const nano3Curve = Array.from({ length: CURVE_SAMPLES }, (_, index) => {
		const t = (100 * index) / (CURVE_SAMPLES - 1);
		return [t, nano3SolubilityGPer100g(t)] as const;
	});

	function cx(temperatureC: number): number {
		return curveMargin.left + (temperatureC / 100) * (width - curveMargin.left - curveMargin.right);
	}
	function cy(solubility: number): number {
		return (
			height -
			curveMargin.bottom -
			(solubility / maxSolubility) * (height - curveMargin.top - curveMargin.bottom)
		);
	}
	function curvePath(points: readonly (readonly [number, number])[]): string {
		return points
			.map(
				(point, index) =>
					`${index === 0 ? 'M' : 'L'}${cx(point[0]).toFixed(2)},${cy(point[1]).toFixed(2)}`
			)
			.join(' ');
	}
	const temperatureTicks = [0, 25, 50, 75, 100];
	const solubilityTicks = [50, 100, 150, 200, 250];
	let markerT = $derived(Math.min(100, Math.max(0, frame.temperatureC)));

	// --- Ternary view -------------------------------------------------------
	// Unit triangle from ternaryToXY: KNO3 at (0,0), NaNO3 at (1,0), water apex
	// at (0.5, sqrt(3)/2). One scale for both axes keeps it equilateral.
	const side = 300;
	const originX = 130;
	const baseY = 296;

	function pointFor(composition: TernaryComposition): { x: number; y: number } {
		const unit = ternaryToXY(composition);
		return { x: originX + unit.x * side, y: baseY - unit.y * side };
	}
	function pathFor(points: readonly TernaryComposition[]): string {
		return points
			.map((point, index) => {
				const { x, y } = pointFor(point);
				return `${index === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`;
			})
			.join(' ');
	}

	const kno3Vertex = pointFor({ waterFrac: 0, kno3Frac: 1, nano3Frac: 0 });
	const nano3Vertex = pointFor({ waterFrac: 0, kno3Frac: 0, nano3Frac: 1 });
	const waterVertex = pointFor({ waterFrac: 1, kno3Frac: 0, nano3Frac: 0 });
	// Light reading grid: lines of constant water fraction.
	const waterGrid = [0.2, 0.4, 0.6, 0.8].map((f) => ({
		f,
		a: pointFor({ waterFrac: f, kno3Frac: 1 - f, nano3Frac: 0 }),
		b: pointFor({ waterFrac: f, kno3Frac: 0, nano3Frac: 1 - f })
	}));

	let isotherm = $derived(frame.isotherm);
	let kno3BranchPath = $derived(pathFor(isotherm.kno3Branch));
	let nano3BranchPath = $derived(pathFor(isotherm.nano3Branch));
	let eutonicPoint = $derived(pointFor(isotherm.eutonic));

	let kno3FieldPath = $derived(
		`M${kno3Vertex.x},${kno3Vertex.y} L${pathFor(isotherm.kno3Branch).slice(1)} Z`
	);
	let nano3FieldPath = $derived(
		`M${nano3Vertex.x},${nano3Vertex.y} L${pathFor(isotherm.nano3Branch).slice(1)} Z`
	);
	let valleyPath = $derived(
		`M${kno3Vertex.x},${kno3Vertex.y} L${eutonicPoint.x},${eutonicPoint.y} L${nano3Vertex.x},${nano3Vertex.y} Z`
	);
	let seaPath = $derived(
		`M${waterVertex.x},${waterVertex.y} L${pathFor(isotherm.kno3Branch).slice(1)} L${pathFor(
			[...isotherm.nano3Branch].reverse()
		).slice(1)} Z`
	);

	let totalPoint = $derived(frame.composition ? pointFor(frame.composition) : null);
	let liquidPoint = $derived(frame.liquidComposition ? pointFor(frame.liquidComposition) : null);
	let liquidSeparate = $derived(
		frame.equilibrium.solids.kno3G > 0.05 || frame.equilibrium.solids.nano3G > 0.05
	);
	let trajectoryPath = $derived(trajectory.length > 1 ? pathFor(trajectory) : '');

	// Experiment overlays live at their measurement temperatures only.
	let experimentPoints = $derived.by(() => {
		if (!showExperimentPoints) return [];
		if (Math.abs(frame.temperatureC - 25) < 0.5) {
			return REINDERS_1915_POINTS.map((point) =>
				pointFor(
					massesToComposition({
						waterG: 100,
						kno3G: point.kno3GPer100gWater,
						nano3G: point.nano3GPer100gWater
					})
				)
			);
		}
		if (Math.abs(frame.temperatureC - 90) < 0.5) {
			return CARROLL_2005_BRINES.map((brine) =>
				pointFor(
					massesToComposition({
						waterG: 1000,
						kno3G: brine.kMolPerKg * KNO3_MOLAR_MASS_G_PER_MOL,
						nano3G: brine.naMolPerKg * NANO3_MOLAR_MASS_G_PER_MOL
					})
				)
			);
		}
		return [];
	});

	let ariaLabel = $derived(
		content.ariaLabel({ temperatureC: frame.temperatureC.toFixed(0), region: regionName })
	);
	let caption = $derived(
		mode === 'curves'
			? content.caption.curves
			: frame.interactionScale === 0
				? content.caption.ideal
				: showExperimentPoints
					? content.caption.calibrated
					: content.caption.map
	);
</script>

<figure class="diagram">
	<svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={ariaLabel}>
		{#if mode === 'curves'}
			{#each solubilityTicks as tick (tick)}
				<line
					class="grid"
					x1={curveMargin.left}
					x2={width - curveMargin.right}
					y1={cy(tick)}
					y2={cy(tick)}
				/>
				<text class="tick" x={curveMargin.left - 8} y={cy(tick) + 4} text-anchor="end">{tick}</text>
			{/each}
			{#each temperatureTicks as tick (tick)}
				<line
					class="x-tick"
					x1={cx(tick)}
					x2={cx(tick)}
					y1={height - curveMargin.bottom}
					y2={height - curveMargin.bottom + 5}
				/>
				<text class="tick" x={cx(tick)} y={height - curveMargin.bottom + 19} text-anchor="middle"
					>{tick}</text
				>
			{/each}

			<line
				class="marker-line"
				x1={cx(markerT)}
				x2={cx(markerT)}
				y1={curveMargin.top}
				y2={height - curveMargin.bottom}
			/>
			<path class="curve kno3" d={curvePath(kno3Curve)} />
			<path class="curve nano3" d={curvePath(nano3Curve)} />
			<circle
				class="curve-dot kno3-dot"
				cx={cx(markerT)}
				cy={cy(frame.kno3SolubilityGPer100g)}
				r="5"
			/>
			<circle
				class="curve-dot nano3-dot"
				cx={cx(markerT)}
				cy={cy(frame.nano3SolubilityGPer100g)}
				r="5"
			/>
			<text class="curve-label kno3-label" x={cx(78)} y={cy(kno3SolubilityGPer100g(84))}
				>{content.kno3Vertex}</text
			>
			<text class="curve-label nano3-label" x={cx(64)} y={cy(nano3SolubilityGPer100g(56)) - 10}
				>{content.nano3Vertex}</text
			>

			<line
				class="axis"
				x1={curveMargin.left}
				x2={curveMargin.left}
				y1={curveMargin.top}
				y2={height - curveMargin.bottom}
			/>
			<line
				class="axis"
				x1={curveMargin.left}
				x2={width - curveMargin.right}
				y1={height - curveMargin.bottom}
				y2={height - curveMargin.bottom}
			/>
			<text
				class="axis-label"
				x={(curveMargin.left + width - curveMargin.right) / 2}
				y={height - 7}
				text-anchor="middle">{content.curvesXAxis}</text
			>
			<text
				class="axis-label y-label"
				transform={`translate(15 ${(curveMargin.top + height - curveMargin.bottom) / 2}) rotate(-90)`}
				text-anchor="middle">{content.curvesYAxis}</text
			>
		{:else}
			{#if showRegions}
				<path class="field sea" d={seaPath} />
				<path class="field kno3-field" d={kno3FieldPath} />
				<path class="field nano3-field" d={nano3FieldPath} />
				<path class="field valley" d={valleyPath} />
			{/if}

			{#each waterGrid as line (line.f)}
				<line class="grid" x1={line.a.x} y1={line.a.y} x2={line.b.x} y2={line.b.y} />
			{/each}

			<path
				class="triangle-edge"
				d={`M${kno3Vertex.x},${kno3Vertex.y} L${waterVertex.x},${waterVertex.y} L${nano3Vertex.x},${nano3Vertex.y} Z`}
			/>

			{#if showIsotherm}
				<path class="branch kno3" d={kno3BranchPath} />
				<path class="branch nano3" d={nano3BranchPath} />
			{/if}

			{#if showRegions}
				<text class="region-label" x={waterVertex.x} y={waterVertex.y + 74} text-anchor="middle"
					>{content.regions.unsaturated}</text
				>
				<text class="region-label" x={kno3Vertex.x + 62} y={baseY - 66} text-anchor="middle"
					>{content.regions.kno3Field}</text
				>
				<text class="region-label" x={nano3Vertex.x - 58} y={baseY - 66} text-anchor="middle"
					>{content.regions.nano3Field}</text
				>
				<text
					class="region-label"
					x={(kno3Vertex.x + nano3Vertex.x) / 2}
					y={baseY - 16}
					text-anchor="middle">{content.regions.bothField}</text
				>
			{/if}

			{#if trajectoryPath}
				<path class="route" d={trajectoryPath} />
			{/if}

			{#if showTieLine && liquidSeparate && liquidPoint}
				{#if frame.equilibrium.solids.kno3G > 0.05}
					<line
						class="tie"
						x1={kno3Vertex.x}
						y1={kno3Vertex.y}
						x2={liquidPoint.x}
						y2={liquidPoint.y}
					/>
				{/if}
				{#if frame.equilibrium.solids.nano3G > 0.05}
					<line
						class="tie"
						x1={nano3Vertex.x}
						y1={nano3Vertex.y}
						x2={liquidPoint.x}
						y2={liquidPoint.y}
					/>
				{/if}
			{/if}

			{#each experimentPoints as point, index (index)}
				<circle class="experiment" cx={point.x} cy={point.y} r="3.4" />
			{/each}

			{#if showEutonic}
				<circle class="landmark" cx={eutonicPoint.x} cy={eutonicPoint.y} r="5" />
				<text class="landmark-label" x={eutonicPoint.x + 9} y={eutonicPoint.y + 13}
					>{content.eutonicPoint}</text
				>
			{/if}

			{#if liquidSeparate && liquidPoint}
				<circle class="liquid-point" cx={liquidPoint.x} cy={liquidPoint.y} r="4.6" />
				<text class="point-label" x={liquidPoint.x - 9} y={liquidPoint.y - 8} text-anchor="end"
					>{content.liquidPoint}</text
				>
			{/if}
			{#if totalPoint}
				<circle class="state-halo" cx={totalPoint.x} cy={totalPoint.y} r="11" />
				<circle class="state" cx={totalPoint.x} cy={totalPoint.y} r="5.5" />
			{/if}

			<text class="vertex-label" x={waterVertex.x} y={waterVertex.y - 10} text-anchor="middle"
				>{content.waterVertex}</text
			>
			<text class="vertex-label" x={kno3Vertex.x - 4} y={baseY + 17} text-anchor="middle"
				>{content.kno3Vertex}</text
			>
			<text class="vertex-label" x={nano3Vertex.x + 4} y={baseY + 17} text-anchor="middle"
				>{content.nano3Vertex}</text
			>
		{/if}
	</svg>
	<div class="legend">
		{#if mode === 'curves'}
			<span class="kno3-key">{content.kno3Vertex}</span>
			<span class="nano3-key">{content.nano3Vertex}</span>
		{:else if showIsotherm}
			<span class="isotherm-key"
				>{content.isothermLabel({ temperatureC: frame.temperatureC.toFixed(0) })}</span
			>
			{#if experimentPoints.length > 0}
				<span class="experiment-key">{content.experimentPoints}</span>
			{/if}
		{/if}
		<strong>{frame.temperatureC.toFixed(0)} °C · {regionName}</strong>
	</div>
	<figcaption>
		<span>{content.captionKind}</span>
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
	.point-label {
		fill: var(--ink-muted);
		font-family: var(--mono);
		font-size: 10px;
	}

	.axis-label {
		fill: var(--ink);
		font-size: 11px;
		font-weight: 700;
	}

	.curve,
	.branch {
		fill: none;
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-width: 3.2;
	}

	.curve.kno3,
	.branch.kno3 {
		stroke: #5f6398;
	}

	.curve.nano3,
	.branch.nano3 {
		stroke: #a3702a;
	}

	.branch {
		stroke-width: 2.8;
		transition: d 300ms ease;
	}

	.marker-line {
		stroke: var(--ink);
		stroke-dasharray: 5 4;
		stroke-width: 1.2;
	}

	.curve-dot {
		stroke: var(--paper);
		stroke-width: 2;
	}

	.kno3-dot {
		fill: #5f6398;
	}

	.nano3-dot {
		fill: #a3702a;
	}

	.curve-label {
		font-family: var(--mono);
		font-size: 11px;
		font-weight: 800;
	}

	.kno3-label {
		fill: #4c4f7c;
	}

	.nano3-label {
		fill: #a3702a;
	}

	.triangle-edge {
		fill: none;
		stroke: var(--ink);
		stroke-width: 1.6;
		stroke-linejoin: round;
	}

	.field {
		stroke: none;
		transition: d 300ms ease;
	}

	.field.sea {
		fill: rgba(32, 127, 140, 0.09);
	}

	.field.kno3-field {
		fill: rgba(95, 99, 152, 0.14);
	}

	.field.nano3-field {
		fill: rgba(217, 154, 61, 0.15);
	}

	.field.valley {
		fill: rgba(31, 40, 38, 0.08);
	}

	.route {
		fill: none;
		stroke: var(--acid);
		stroke-dasharray: 3 5;
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-width: 2.4;
	}

	.tie {
		stroke: var(--ink-muted);
		stroke-dasharray: 4 4;
		stroke-width: 1.4;
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

	.experiment {
		fill: none;
		stroke: var(--ink);
		stroke-width: 1.6;
		opacity: 0.75;
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

	.liquid-point {
		fill: var(--paper);
		stroke: var(--ink);
		stroke-width: 2;
		transition:
			cx 260ms ease,
			cy 260ms ease;
	}

	.point-label {
		fill: var(--ink);
		font-weight: 700;
	}

	.vertex-label {
		fill: var(--ink);
		font-family: var(--mono);
		font-size: 11px;
		font-weight: 800;
	}

	.region-label {
		fill: var(--ink-muted);
		font-family: var(--serif);
		font-size: 12px;
		font-style: italic;
		opacity: 0.7;
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

	.kno3-key::before {
		background: #5f6398;
	}

	.nano3-key::before,
	.isotherm-key::before {
		background: linear-gradient(90deg, #5f6398 0 8px, #a3702a 8px 16px);
	}

	.nano3-key::before {
		background: #a3702a;
	}

	.experiment-key::before {
		height: 6px;
		width: 6px;
		border: 1.6px solid var(--ink);
		border-radius: 50%;
		background: none;
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

		.landmark-label,
		.point-label {
			font-size: 14px;
		}

		.vertex-label {
			font-size: 16px;
		}

		.region-label {
			font-size: 18px;
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
