<script lang="ts">
	import { catalyzedProfile, uncatalyzedProfile, type ProfilePoint } from '$lib/chem';
	import type { CatalystTriViewContent } from '$lib/content';

	interface Props {
		uncatalyzedEaKJPerMol: number;
		catalyzedEaKJPerMol: number;
		deltaHKJPerMol: number;
		/** Reaction-coordinate position of the moving state ball, from 0 to 1. */
		progress?: number;
		/** Selects which of the two computed paths carries the state ball. */
		catalyzed?: boolean;
		/** Early scenes can reveal the uncatalyzed mountain before the shortcut. */
		showCatalyzed?: boolean;
		content: CatalystTriViewContent['profile'];
	}

	let {
		uncatalyzedEaKJPerMol,
		catalyzedEaKJPerMol,
		deltaHKJPerMol,
		progress = 0,
		catalyzed = false,
		showCatalyzed = true,
		content
	}: Props = $props();

	const width = 560;
	const height = 318;
	const margin = { top: 24, right: 24, bottom: 48, left: 58 };
	const xMin = -0.02;
	const xMax = 1.02;

	let plainProfile = $derived(uncatalyzedProfile(uncatalyzedEaKJPerMol, deltaHKJPerMol, 56));
	let catalystProfile = $derived(catalyzedProfile(catalyzedEaKJPerMol, deltaHKJPerMol, 36));
	let minEnergy = $derived(Math.min(deltaHKJPerMol, 0) - 14);
	let maxEnergy = $derived(Math.max(uncatalyzedEaKJPerMol, catalyzedEaKJPerMol) + 13);
	let clampedProgress = $derived(Math.max(0, Math.min(1, progress)));
	let activeCatalyzed = $derived(showCatalyzed && catalyzed);
	let activeProfile = $derived(activeCatalyzed ? catalystProfile : plainProfile);
	let activeSummit = $derived.by(() =>
		activeProfile.reduce((highest, point) => (point.e > highest.e ? point : highest))
	);
	let stateEnergy = $derived(interpolateEnergy(activeProfile, clampedProgress));
	let activeEa = $derived(activeSummit.e);
	let ariaLabel = $derived(content.ariaLabel({ ea: activeEa.toFixed(0) }));

	function x(value: number): number {
		return margin.left + ((value - xMin) / (xMax - xMin)) * (width - margin.left - margin.right);
	}

	function y(value: number): number {
		return (
			margin.top +
			((maxEnergy - value) / (maxEnergy - minEnergy)) * (height - margin.top - margin.bottom)
		);
	}

	function pathFor(points: readonly ProfilePoint[]): string {
		return points
			.map(
				(point, index) =>
					`${index === 0 ? 'M' : 'L'}${x(point.x).toFixed(2)},${y(point.e).toFixed(2)}`
			)
			.join(' ');
	}

	function interpolateEnergy(points: readonly ProfilePoint[], coordinate: number): number {
		for (let index = 1; index < points.length; index += 1) {
			const previous = points[index - 1];
			const current = points[index];
			if (coordinate <= current.x) {
				const span = current.x - previous.x;
				if (span === 0) return current.e;
				const fraction = (coordinate - previous.x) / span;
				return previous.e + (current.e - previous.e) * fraction;
			}
		}
		return points.at(-1)?.e ?? deltaHKJPerMol;
	}

	let plainPath = $derived(pathFor(plainProfile));
	let catalystPath = $derived(pathFor(catalystProfile));
	let tickStep = $derived(Math.max(20, Math.ceil((maxEnergy - minEnergy) / 5 / 20) * 20));
	let energyTicks = $derived.by(() => {
		const ticks: number[] = [];
		const first = Math.ceil(minEnergy / tickStep) * tickStep;
		for (let value = first; value <= maxEnergy; value += tickStep) ticks.push(value);
		return ticks;
	});
	const xTicks = [0, 0.25, 0.5, 0.75, 1];
</script>

<figure class="diagram">
	<svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={ariaLabel}>
		{#each energyTicks as tick (tick)}
			<line class="grid" x1={margin.left} x2={width - margin.right} y1={y(tick)} y2={y(tick)} />
			<text class="tick" x={margin.left - 9} y={y(tick) + 4} text-anchor="end">{tick}</text>
		{/each}

		{#each xTicks as tick (tick)}
			<line
				class="x-tick"
				x1={x(tick)}
				x2={x(tick)}
				y1={height - margin.bottom}
				y2={height - margin.bottom + 5}
			/>
			<text class="tick" x={x(tick)} y={height - margin.bottom + 19} text-anchor="middle">
				{tick.toFixed(2)}
			</text>
		{/each}

		<path class="plain-profile" class:inactive={activeCatalyzed} d={plainPath} />
		{#if showCatalyzed}
			<path class="catalyst-profile" class:inactive={!activeCatalyzed} d={catalystPath} />
		{/if}

		<!-- Forward activation barrier: reactant valley to the selected pass. -->
		<line
			class="ea-bracket"
			x1={x(activeSummit.x)}
			x2={x(activeSummit.x)}
			y1={y(0)}
			y2={y(activeEa)}
		/>
		<line
			class="ea-cap"
			x1={x(activeSummit.x) - 5}
			x2={x(activeSummit.x) + 5}
			y1={y(0)}
			y2={y(0)}
		/>
		<line
			class="ea-cap"
			x1={x(activeSummit.x) - 5}
			x2={x(activeSummit.x) + 5}
			y1={y(activeEa)}
			y2={y(activeEa)}
		/>
		<text class="ea-label" x={x(activeSummit.x) + 9} y={(y(0) + y(activeEa)) / 2 + 4}>
			{content.eaMarker}
			{activeEa.toFixed(0)}
		</text>

		<!-- Reaction enthalpy: identical endpoints for both paths. -->
		<line class="level-guide" x1={x(0)} x2={x(1)} y1={y(0)} y2={y(0)} />
		<line
			class="level-guide product"
			x1={x(0)}
			x2={x(1)}
			y1={y(deltaHKJPerMol)}
			y2={y(deltaHKJPerMol)}
		/>
		<line class="enthalpy-bracket" x1={x(0.96)} x2={x(0.96)} y1={y(0)} y2={y(deltaHKJPerMol)} />
		<text
			class="enthalpy-label"
			x={x(0.96) - 8}
			y={(y(0) + y(deltaHKJPerMol)) / 2 + 4}
			text-anchor="end">{content.deltaHMarker} = {deltaHKJPerMol.toFixed(0)} kJ mol⁻¹</text
		>

		<circle class="state-halo" cx={x(clampedProgress)} cy={y(stateEnergy)} r="12" />
		<circle class="state" cx={x(clampedProgress)} cy={y(stateEnergy)} r="5.5" />

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
		<span class="plain-key">{content.plainCurve} · {uncatalyzedEaKJPerMol.toFixed(0)} kJ mol⁻¹</span
		>
		{#if showCatalyzed}
			<span class="catalyst-key"
				>{content.catalyzedCurve} · {catalyzedEaKJPerMol.toFixed(0)} kJ mol⁻¹</span
			>
		{/if}
		<strong>ΔH = {deltaHKJPerMol.toFixed(0)} kJ mol⁻¹</strong>
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

	.plain-profile,
	.catalyst-profile {
		fill: none;
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-width: 3.2;
		transition:
			d 280ms ease,
			opacity 180ms ease;
	}

	.plain-profile {
		stroke: #8a5a2c;
	}

	.catalyst-profile {
		stroke: #17636d;
	}

	.inactive {
		opacity: 0.56;
	}

	.ea-bracket,
	.ea-cap {
		stroke: #8f321e;
		stroke-width: 1.55;
	}

	.ea-bracket {
		stroke-dasharray: 3 3;
	}

	.ea-label {
		fill: #8f321e;
		font-family: var(--mono);
		font-size: 9px;
		font-weight: 800;
	}

	.level-guide {
		stroke: rgba(31, 40, 38, 0.25);
		stroke-dasharray: 2 5;
		stroke-width: 1;
	}

	.enthalpy-bracket {
		stroke: #654018;
		stroke-dasharray: 3 3;
		stroke-width: 1.5;
	}

	.enthalpy-label {
		fill: #654018;
		font-family: var(--mono);
		font-size: 9px;
		font-weight: 800;
	}

	.state-halo {
		fill: rgba(163, 112, 42, 0.18);
		transition:
			cx 220ms ease,
			cy 220ms ease;
	}

	.state {
		fill: #a3702a;
		stroke: var(--paper);
		stroke-width: 2;
		transition:
			cx 220ms ease,
			cy 220ms ease;
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

	.plain-key::before {
		background: #8a5a2c;
	}

	.catalyst-key::before {
		background: #17636d;
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
		.plain-profile,
		.catalyst-profile,
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

		.ea-label,
		.enthalpy-label {
			font-size: 14px;
		}

		.legend {
			padding-left: 0;
			gap: 0.55rem;
		}
	}
</style>
